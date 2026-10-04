import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import * as schema from "./schema";
import type { Tone } from "./schema";

// ---------------------------------------------------------------------------
// Phase 5: actionable outputs. Drafts are Edit → Copy → Send ONLY — nothing
// here sends anything anywhere. Tone shapes the draft wording.
// ---------------------------------------------------------------------------

const TONE_OPENERS: Record<Tone, string> = {
  Executive: "Following up with a brief status update",
  Friendly: "Hope you're doing well — just checking in",
  Direct: "Quick update",
  Concise: "Update"
};

const TONE_CLOSERS: Record<Tone, string> = {
  Executive: "Please let me know a good time to review next steps.",
  Friendly: "Thanks so much, and let me know what works for you!",
  Direct: "Confirm receipt and next steps.",
  Concise: "Thanks."
};

export function isTone(t: string): t is Tone {
  return (schema.TONES as readonly string[]).includes(t);
}

export async function getTone(userId: string): Promise<Tone> {
  const db = await getDb();
  const rows = await db.select().from(schema.preferences).where(eq(schema.preferences.userId, userId));
  const t = rows[0]?.tone ?? "Executive";
  return isTone(t) ? t : "Executive";
}

export async function setTone(userId: string, tone: Tone): Promise<void> {
  const db = await getDb();
  const rows = await db.select().from(schema.preferences).where(eq(schema.preferences.userId, userId));
  if (rows.length === 0) {
    await db.insert(schema.preferences).values({ userId, tone });
  } else {
    await db.update(schema.preferences).set({ tone }).where(eq(schema.preferences.userId, userId));
  }
}

export function composeDraft(promiseText: string, owner: string, deadline: string, tone: Tone): string {
  const what = promiseText || "the open item";
  const when = deadline ? ` (${deadline})` : "";
  const who = owner && owner !== "you" ? ` for ${owner}` : "";
  return `${TONE_OPENERS[tone]}${who}: ${what}${when}. ${TONE_CLOSERS[tone]}`;
}

// Generate one task + one draft per open commitment (idempotent per
// commitment id). Tasks link back to the source message via `source`.
export async function generateOutputsForUser(
  userId: string
): Promise<{ tasks: number; drafts: number; tone: Tone }> {
  const db = await getDb();
  const tone = await getTone(userId);
  const commitments = await db
    .select()
    .from(schema.commitments)
    .where(and(eq(schema.commitments.userId, userId), eq(schema.commitments.status, "open")));
  const prefix = userId.slice(0, 8);
  let tasks = 0;
  let drafts = 0;
  for (const c of commitments) {
    const taskId = `${prefix}-autotask-${c.id}`;
    const draftId = `${prefix}-draft-${c.id}`;
    const existingTask = await db
      .select({ id: schema.tasks.id })
      .from(schema.tasks)
      .where(and(eq(schema.tasks.id, taskId), eq(schema.tasks.userId, userId)));
    if (existingTask.length === 0) {
      await db.insert(schema.tasks).values({
        id: taskId,
        userId,
        title: `Follow through: ${c.promiseText.slice(0, 80)}`,
        progress: c.deadline || "no deadline",
        done: false,
        source: c.messageId
      });
      tasks += 1;
    }
    const existingDraft = await db
      .select({ id: schema.drafts.id })
      .from(schema.drafts)
      .where(and(eq(schema.drafts.id, draftId), eq(schema.drafts.userId, userId)));
    if (existingDraft.length === 0) {
      await db.insert(schema.drafts).values({
        id: draftId,
        userId,
        commitmentId: c.id,
        messageId: c.messageId,
        body: composeDraft(c.promiseText, c.owner, c.deadline, tone),
        tone,
        status: "draft"
      });
      drafts += 1;
    }
  }
  return { tasks, drafts, tone };
}
