import { NextResponse } from "next/server";
import { askGemini, MIND_SYSTEM } from "@/lib/gemini";

export async function POST(req: Request) {
  const started = Date.now();
  const body = await req.json().catch(() => ({}));
  const message = String(body.message || "");
  const task = String(body.task || "chat");
  const ctx = body.context ? JSON.stringify(body.context).slice(0, 1500) : "";

  if (!message.trim()) {
    return NextResponse.json({ error: "empty message" }, { status: 400 });
  }

  const prompt = `${MIND_SYSTEM}\nTask: ${task}\nWorkspace context: ${ctx || "none"}\nUser: ${message}`;
  const reply = await askGemini(prompt);

  if (!reply) {
    return NextResponse.json({
      reply: `WihGo Mind noted: "${message}". AI is temporarily offline — your connected channels are still monitored.`,
      metadata: {
        provider: "WIHGO",
        model: "wihgo-core-engine-v1",
        latencyMs: Date.now() - started,
        status: "fallback",
        fallbackReason: "Gemini unreachable or unconfigured",
      },
      actionSuggested: null,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  }

  return NextResponse.json({
    reply,
    metadata: {
      provider: "GEMINI",
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      latencyMs: Date.now() - started,
      status: "active",
    },
    actionSuggested: null,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });
}
