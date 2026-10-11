import { Resend } from "resend";
import { db } from "./db";
import { sentLog } from "./schema";

const FROM = process.env.EMAIL_FROM || "WihGo AI <noreply@wihgo.ai>";

interface SendOpts {
  to: string;
  subject: string;
  html: string;
  userId?: string | null;
  draftId?: string;
}

// Returns { ok, providerId? }. Never throws — logs failures into sent_log.
export async function sendEmail(opts: SendOpts): Promise<{ ok: boolean; providerId?: string }> {
  const id = `mail-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY missing — logged only, not sent.");
    await db.insert(sentLog).values({
      id,
      userId: opts.userId ?? null,
      draftId: opts.draftId ?? "",
      toAddress: opts.to,
      subject: opts.subject,
      provider: "resend",
      providerId: "",
      status: "skipped-no-key",
    });
    return { ok: false };
  }
  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html });
    if (error) throw new Error(error.message);
    await db.insert(sentLog).values({
      id,
      userId: opts.userId ?? null,
      draftId: opts.draftId ?? "",
      toAddress: opts.to,
      subject: opts.subject,
      provider: "resend",
      providerId: data?.id ?? "",
      status: "sent",
    });
    return { ok: true, providerId: data?.id };
  } catch (e) {
    await db.insert(sentLog).values({
      id,
      userId: opts.userId ?? null,
      draftId: opts.draftId ?? "",
      toAddress: opts.to,
      subject: opts.subject,
      provider: "resend",
      providerId: "",
      status: `failed: ${(e as Error).message.slice(0, 120)}`,
    });
    return { ok: false };
  }
}
