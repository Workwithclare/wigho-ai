import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await db.select().from(user).where(eq(user.id, sessionUser.id));
  const row = rows[0];
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ id: row.id, name: row.name, email: row.email });
}

export async function PATCH(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim().slice(0, 100);
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  await db.update(user).set({ name, updatedAt: new Date() }).where(eq(user.id, sessionUser.id));
  return NextResponse.json({ ok: true, name });
}
