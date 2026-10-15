import { NextResponse } from "next/server";
import { eq, and, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks, commitments } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";
import { askGemini, MIND_SYSTEM } from "@/lib/gemini";
import { checkAiQuota, bumpAiUsage } from "@/lib/ai-limit";

const EMPTY_BRIEF =
  "Welcome to WihGo Mind. You have no open follow-ups or tasks yet — add your first follow-up and I will turn it into a daily brief here.";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [openTasks, openComms] = await Promise.all([
    db.select().from(tasks).where(and(eq(tasks.userId, user.id), eq(tasks.done, false))),
    db.select().from(commitments).where(and(eq(commitments.userId, user.id), ne(commitments.status, "done"))),
  ]);

  if (openTasks.length === 0 && openComms.length === 0) {
    return NextResponse.json({ brief: EMPTY_BRIEF, empty: true });
  }

  const quota = await checkAiQuota(user.id);
  const lines = [
    ...openTasks.map((t) => `Task: ${t.title}`),
    ...openComms.map((c) => `Follow-up with ${c.owner || "unknown"}: ${c.promiseText}${c.deadline ? ` (due ${c.deadline})` : ""}`),
  ].slice(0, 20);

  if (!quota.ok) {
    return NextResponse.json({
      brief: `Daily limit reached. By due date, oldest first:\n${lines.map((l, i) => `${i + 1}. ${l}`).join("\n")}`,
      empty: false,
      limited: true,
    });
  }
  await bumpAiUsage(user.id);

  const reply = await askGemini(
    `${MIND_SYSTEM}\nWrite a short daily brief (max 5 lines) from these open items, most urgent first:\n${lines.join("\n")}`
  );
  if (reply) return NextResponse.json({ brief: reply, empty: false });
  return NextResponse.json({
    brief: `WihGo Mind is offline, so here is your list sorted as-is:\n${lines.map((l, i) => `${i + 1}. ${l}`).join("\n")}`,
    empty: false,
    limited: true,
  });
}
