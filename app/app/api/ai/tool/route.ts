import { NextResponse } from "next/server";

// Demo AI tool endpoint (MyDay focus plan, AI assistant drafts).
// Gemini wiring lands here later — no secrets involved, demo text for now.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const toolId = String(body.toolId || "tool-planner");
  const result =
    toolId === "tool-planner"
      ? `09:00 – Priority inbox sweep: answer the 3 most urgent threads first.\n10:30 – Deep work block: one high-priority task, notifications off.\n13:00 – Follow-ups: nudge every open commitment due today.\n15:00 – Plan tomorrow: pick 3 must-win tasks before logging off.`
      : `Draft ready from ${toolId}. Connect Gemini to generate live output.`;
  return NextResponse.json({ result });
}
