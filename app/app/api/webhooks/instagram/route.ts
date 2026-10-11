import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { messages, connections } from "@/lib/schema";

// Meta Instagram webhook (Business/Creator account linked to a Facebook Page).
// GET = verification handshake, POST = inbound messaging events.
// Requires a PUBLIC https URL (Netlify prod). Meta cannot reach localhost.
// Env: WHATSAPP_VERIFY_TOKEN (you pick any secret string; reuse it here + in Meta dashboard).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return NextResponse.json({ error: "forbidden" }, { status: 403 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.entry?.length) return NextResponse.json({ ok: true });
  try {
    const conns = await db.select().from(connections).limit(50);
    const ig =
      conns.find((c) => c.name.toLowerCase().includes("instagram") && c.connected) ?? conns[0];
    const ownerId = ig?.userId ?? null;

    for (const entry of body.entry) {
      for (const evt of entry.messaging ?? []) {
        const text = evt.message?.text ?? `[${evt.message ? "attachment" : "event"}]`;
        if (!evt.message?.text && !evt.message) continue;
        const senderId = String(evt.sender?.id ?? "unknown");
        await db.insert(messages).values({
          id: `ig-${evt.message?.mid || senderId + "-" + Date.now()}`,
          platform: "instagram",
          sender: `Instagram user …${senderId.slice(-4)}`,
          body: String(text),
          time: new Date(Number(evt.timestamp) || Date.now()).toISOString(),
          unread: true,
          starred: false,
          userId: ownerId,
        });
      }
    }
  } catch (e) {
    console.error("[instagram webhook]", (e as Error).message);
  }
  return NextResponse.json({ ok: true });
}
