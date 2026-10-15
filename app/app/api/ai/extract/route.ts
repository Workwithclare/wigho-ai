import { NextResponse } from "next/server";
import { askGemini } from "@/lib/gemini";
import { getSessionUser } from "@/lib/session";
import { checkAiQuota, bumpAiUsage, AI_DAILY_LIMIT } from "@/lib/ai-limit";

export interface ExtractedCapture {
  contactName: string;
  promise: string;
  dueDate: string;
}

// Rule-based fallback: never blank, never raw errors.
function naiveExtract(text: string): ExtractedCapture {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const first = lines[0] || text;
  const dateMatch = text.match(
    /(\b(?:mon|tues?|wednes?|thurs?|fri|satur?|sun)(?:day)?\b|\btoday\b|\btomorrow\b|\bnext week\b|\d{1,2}[\/\-]\d{1,2}([\/\-]\d{2,4})?)/i
  );
  return {
    contactName: "",
    promise: first.slice(0, 280),
    dueDate: dateMatch ? dateMatch[0] : "",
  };
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const text = String(body.text || "").slice(0, 4000);
  if (!text.trim()) return NextResponse.json({ error: "empty text" }, { status: 400 });

  const quota = await checkAiQuota(user.id);
  if (!quota.ok) {
    return NextResponse.json({
      data: naiveExtract(text),
      limited: true,
      message: `Daily WihGo Mind limit (${AI_DAILY_LIMIT}) reached — showing a basic preview. Confirm to save, or try again tomorrow.`,
    });
  }
  await bumpAiUsage(user.id);

  const reply = await askGemini(
    `Extract from this message. Reply ONLY with compact JSON {"contactName":string,"promise":string,"dueDate":string}. Use "" when unknown. Message:\n${text}`
  );
  if (reply) {
    try {
      const clean = reply.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));
      return NextResponse.json({
        data: {
          contactName: String(parsed.contactName || ""),
          promise: String(parsed.promise || text.slice(0, 280)),
          dueDate: String(parsed.dueDate || ""),
        } as ExtractedCapture,
        limited: false,
      });
    } catch {
      // fall through to naive
    }
  }
  return NextResponse.json({
    data: naiveExtract(text),
    limited: true,
    message: "WihGo Mind is temporarily offline — showing a basic preview you can edit before saving.",
  });
}
