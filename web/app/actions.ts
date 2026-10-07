"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/schema";
import { intakeManualPaste } from "@/lib/gmail";
import { runExtractionForUser } from "@/lib/extract";
import { generateOutputsForUser, setTone, isTone } from "@/lib/outbox";
import type { Tone } from "@/lib/schema";

async function requireUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not signed in.");
  return session.user.id;
}

// Manual paste/forward intake into the signed-in user's own messages,
// then extract commitments from it.
export async function addManualMessage(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUserId();
    await intakeManualPaste(userId, {
      sender: String(formData.get("sender") ?? ""),
      body: String(formData.get("body") ?? "")
    });
    await runExtractionForUser(userId);
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Intake failed." };
  }
}

// Run the extraction job over the user's messages (idempotent).
export async function runExtraction(): Promise<{ created: number; scanned: number }> {
  const userId = await requireUserId();
  const result = await runExtractionForUser(userId);
  revalidatePath("/");
  return result;
}

// Correction loop: edit a commitment's fields. The old values are logged
// to the corrections table so wrong extractions improve future runs.
export async function correctCommitment(
  commitmentId: string,
  patch: { promiseText: string; owner: string; deadline: string }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUserId();
    const db = await getDb();
    const rows = await db
      .select()
      .from(schema.commitments)
      .where(and(eq(schema.commitments.id, commitmentId), eq(schema.commitments.userId, userId)));
    const current = rows[0];
    if (!current) return { ok: false, error: "Commitment not found." };
    const fields = ["promiseText", "owner", "deadline"] as const;
    for (const field of fields) {
      const oldValue = current[field] ?? "";
      const newValue = patch[field] ?? "";
      if (oldValue !== newValue) {
        await db.insert(schema.corrections).values({
          id: `${userId.slice(0, 8)}-corr-${Date.now()}-${field}`,
          userId,
          commitmentId,
          field,
          oldValue,
          newValue
        });
      }
    }
    await db
      .update(schema.commitments)
      .set({ promiseText: patch.promiseText, owner: patch.owner, deadline: patch.deadline, corrected: true })
      .where(and(eq(schema.commitments.id, commitmentId), eq(schema.commitments.userId, userId)));
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Correction failed." };
  }
}

// Phase 5: generate tasks + tone-aware drafts from open commitments.
export async function generateOutputs(): Promise<{ tasks: number; drafts: number; tone: Tone }> {
  const userId = await requireUserId();
  const result = await generateOutputsForUser(userId);
  revalidatePath("/");
  return result;
}

// Phase 5: set the global tone (Executive / Friendly / Direct / Concise).
export async function setToneAction(tone: string): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!isTone(tone)) return { ok: false, error: "Unknown tone." };
    const userId = await requireUserId();
    await setTone(userId, tone);
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Tone update failed." };
  }
}

// Phase 5: mark a draft as copied (user pasted/sent it manually elsewhere).
export async function markDraftCopied(draftId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUserId();
    const db = await getDb();
    await db
      .update(schema.drafts)
      .set({ status: "copied" })
      .where(and(eq(schema.drafts.id, draftId), eq(schema.drafts.userId, userId)));
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Update failed." };
  }
}

// Live Gmail: connection status for the signed-in user.
export async function gmailStatus(): Promise<{ connected: boolean; googleReady: boolean }> {
  try {
    const userId = await requireUserId();
    const { isGmailConnected } = await import("@/lib/gmail-live");
    return {
      connected: await isGmailConnected(userId),
      googleReady:
        Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET)
    };
  } catch {
    return { connected: false, googleReady: false };
  }
}

// Live Gmail: pull recent inbox threads into the user's messages + extract.
export async function syncGmailLiveAction(): Promise<{ inserted?: number; total?: number; error?: string }> {
  try {
    const userId = await requireUserId();
    const { syncGmailLive } = await import("@/lib/gmail-live");
    const result = await syncGmailLive(userId);
    await runExtractionForUser(userId);
    revalidatePath("/");
    return result;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Live sync failed." };
  }
}
export async function flagCommitment(commitmentId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUserId();
    const db = await getDb();
    const rows = await db
      .select()
      .from(schema.commitments)
      .where(and(eq(schema.commitments.id, commitmentId), eq(schema.commitments.userId, userId)));
    const current = rows[0];
    if (!current) return { ok: false, error: "Commitment not found." };
    await db.insert(schema.corrections).values({
      id: `${userId.slice(0, 8)}-corr-${Date.now()}-flag`,
      userId,
      commitmentId,
      field: "status",
      oldValue: current.status,
      newValue: "flagged-wrong"
    });
    await db
      .update(schema.commitments)
      .set({ status: "flagged-wrong", corrected: true })
      .where(and(eq(schema.commitments.id, commitmentId), eq(schema.commitments.userId, userId)));
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Flag failed." };
  }
}

// Update a draft's body (edit step of Edit → Copy → Send).
export async function updateDraftBody(
  draftId: string,
  body: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUserId();
    const db = await getDb();
    await db
      .update(schema.drafts)
      .set({ body: body.slice(0, 20000) })
      .where(and(eq(schema.drafts.id, draftId), eq(schema.drafts.userId, userId)));
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed." };
  }
}

// Send a draft via ZeptoMail (explicit user action only — never automatic).
// Logs the send; marks the draft sent. Requires ZEPTOMAIL_TOKEN + FROM.
export async function sendDraft(
  draftId: string,
  to: string,
  subject: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const userId = await requireUserId();
    const db = await getDb();
    const rows = await db
      .select()
      .from(schema.drafts)
      .where(and(eq(schema.drafts.id, draftId), eq(schema.drafts.userId, userId)));
    const draft = rows[0];
    if (!draft) return { ok: false, error: "Draft not found." };
    const { sendViaZeptoMail } = await import("@/lib/zeptomail");
    const session = await auth.api.getSession({ headers: await headers() });
    const result = await sendViaZeptoMail({
      to,
      subject: subject || `Follow-up from WIHGO AI`,
      textBody: draft.body,
      fromName: session?.user.name ?? "WIHGO AI"
    });
    await db.insert(schema.sentLog).values({
      id: `${userId.slice(0, 8)}-sent-${Date.now()}`,
      userId,
      draftId,
      toAddress: to.trim(),
      subject: subject.slice(0, 200),
      provider: "zeptomail",
      providerId: result.providerId,
      status: "sent"
    });
    await db
      .update(schema.drafts)
      .set({ status: "sent" })
      .where(and(eq(schema.drafts.id, draftId), eq(schema.drafts.userId, userId)));
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Send failed." };
  }
}
