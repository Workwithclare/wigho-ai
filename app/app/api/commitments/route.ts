import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { commitments } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

function toUI(r: typeof commitments.$inferSelect) {
  return {
    id: r.id,
    contactName: r.owner || "Unknown",
    topic: r.promiseText,
    platform: "whatsapp",
    lastContact: "",
    followUpDate: r.deadline || "",
    status: r.status === "done" || r.status === "completed" ? "completed" : "pending",
  };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await db.select().from(commitments).where(eq(commitments.userId, user.id));
  return NextResponse.json(rows.map(toUI));
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const row = {
    id: `cm-${Date.now()}`,
    userId: user.id,
    messageId: "",
    promiseText: String(body.topic || "Untitled follow-up"),
    owner: String(body.contactName || "Unknown"),
    deadline: String(body.followUpDate || ""),
    status: "open",
    corrected: false,
  };
  await db.insert(commitments).values(row);
  return NextResponse.json(toUI({ ...row, createdAt: new Date() }), { status: 201 });
}
