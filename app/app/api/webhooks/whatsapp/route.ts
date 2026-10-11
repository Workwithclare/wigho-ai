import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { messages, connections } from "@/lib/schema";

// Meta WhatsApp webhook. GET = verification handshake, POST = inbound messages.
// Requires a PUBLIC https URL (Netlify prod). Meta cannot reach localhost.
// Env: WHATSAPP_VERIFY_TOKEN (you pick any secret string), set in Netlify + Meta dashboard.
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
    // Find the connected WhatsApp owner so inbound mail is filed under their user id.
    const conns = await db.select().from(connections).limit(50);
    const wa = conns.find((c) => c.name.toLowerCase().includes("whatsapp") && c.connected) ?? conns[0];
    const ownerId = wa?.userId ?? null;

    for (const entry of body.entry) {
      for (const change of entry.changes ?? []) {
        const value = change.value ?? {};
        for (const msg of value.messages ?? []) {
          const text =
            msg.text?.body ?? msg.interactive?.button_reply?.title ?? `[${msg.type || "media"} message]`;
          await db.insert(messages).values({
            id: `wa-${msg.id || Date.now()}`,
            platform: "whatsapp",
            sender: value.contacts?.[0]?.profile?.name || msg.from || "WhatsApp",
            body: String(text),
            time: new Date().toISOString(),
            unread: true,
            starred: false,
            userId: ownerId,
          });
        }
      }
    }
  } catch (e) {
    console.error("[whatsapp webhook]", (e as Error).message);
  }
  return NextResponse.json({ ok: true });
}
