import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  await db
    .update(tasks)
    .set({ done: Boolean(body.completed) })
    .where(and(eq(tasks.id, params.id), eq(tasks.userId, user.id)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await db
    .delete(tasks)
    .where(and(eq(tasks.id, params.id), eq(tasks.userId, user.id)));
  return NextResponse.json({ ok: true });
}
