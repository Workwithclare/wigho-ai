import { NextResponse } from "next/server";
import { askGemini, MIND_SYSTEM } from "@/lib/gemini";
import { getSessionUser } from "@/lib/session";
import { checkAiQuota, bumpAiUsage } from "@/lib/ai-limit";

// AI tool endpoint (MyDay focus plan, assistant drafts).
// Tries live Gemini first, falls back to a static plan when offline.
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const quota = await checkAiQuota(user.id);
  if (!quota.ok) {
    return NextResponse.json({ result: "Daily WihGo Mind limit reached — resets tomorrow." });
  }
  await bumpAiUsage(user.id);
  const body = await req.json().catch(() => ({}));
  const toolId = String(body.toolId || "tool-planner");
  const input = String(body.input || "").slice(0, 1500);

  const live = await askGemini(
    `${MIND_SYSTEM}\nTool: ${toolId}\nInput: ${input || "none"}\nProduce the tool output now.`
  );
  if (live) return NextResponse.json({ result: live });

  const result =
    toolId === "tool-planner"
      ? `09:00 – Priority inbox sweep: answer the 3 most urgent threads first.\n10:30 – Deep work block: one high-priority task, notifications off.\n13:00 – Follow-ups: nudge every open commitment due today.\n15:00 – Plan tomorrow: pick 3 must-win tasks before logging off.`
      : `Draft ready from ${toolId}. AI is temporarily offline — try again shortly.`;
  return NextResponse.json({ result });
}
