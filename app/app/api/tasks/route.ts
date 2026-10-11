import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

function toUI(r: typeof tasks.$inferSelect) {
  return {
    id: r.id,
    title: r.title,
    description: "",
    platform: "whatsapp",
    priority: "medium",
    dueDate: new Date().toISOString().split("T")[0],
    completed: r.done,
  };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await db.select().from(tasks).where(eq(tasks.userId, user.id));
  return NextResponse.json(rows.map(toUI));
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const row = {
    id: `task-${Date.now()}`,
    title: String(body.title || "Untitled task"),
    progress: "",
    done: false,
    source: "wihgo-web",
    userId: user.id,
  };
  await db.insert(tasks).values(row);
  return NextResponse.json(toUI({ ...row, createdAt: new Date() }), { status: 201 });
}
