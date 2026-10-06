import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserData } from "@/lib/data";
import { getTone } from "@/lib/outbox";
import { askGemini } from "@/lib/ai";
import type { Message, Task, Commitment } from "@/lib/schema";

// POST /api/assistant { message } — session-gated AI chat over the
// signed-in user's own business memory. The Gemini key never leaves the server.
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  let message = "";
  try {
    const body = await req.json();
    message = String(body?.message ?? "").slice(0, 2000).trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!message) return NextResponse.json({ error: "Message is empty." }, { status: 400 });

  const userId = session.user.id;
  const [{ messages, tasks, commitments }, tone] = await Promise.all([getUserData(userId), getTone(userId)]);
  try {
    const reply = await askGemini(message, {
      userName: session.user.name?.split(" ")[0] ?? "there",
      tone,
      messages: messages.map((m: Message) => ({ platform: m.platform, sender: m.sender, body: m.body, time: m.time })),
      commitments: commitments.map((c: Commitment) => ({
        promiseText: c.promiseText,
        owner: c.owner,
        deadline: c.deadline,
        status: c.status
      })),
      tasks: tasks.map((t: Task) => ({ title: t.title, done: t.done }))
    });
    return NextResponse.json({ reply });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Assistant failed.";
    const status = msg.includes("not configured") ? 503 : 502;
    return NextResponse.json({ error: msg }, { status });
  }
}
