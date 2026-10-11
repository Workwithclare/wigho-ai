import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { commitments } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const status = body.completed || body.status === "completed" ? "done" : "open";
  await db
    .update(commitments)
    .set({ status })
    .where(and(eq(commitments.id, params.id), eq(commitments.userId, user.id)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await db
    .delete(commitments)
    .where(and(eq(commitments.id, params.id), eq(commitments.userId, user.id)));
  return NextResponse.json({ ok: true });
}
