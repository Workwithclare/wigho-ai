import { eq } from "drizzle-orm";
import { getDb, ensureUserSeed } from "./db";
import * as schema from "./schema";

// Centralized owner-scoped access (PRD authorization rule):
// every read/write below is filtered to the authenticated user's own rows.
// Pass only session.user.id in — never trust client-supplied owner ids.
export async function getUserData(userId: string) {
  await ensureUserSeed(userId);
  const db = await getDb();
  const [messages, tasks, connections, commitments] = await Promise.all([
    db.select().from(schema.messages).where(eq(schema.messages.userId, userId)),
    db.select().from(schema.tasks).where(eq(schema.tasks.userId, userId)),
    db.select().from(schema.connections).where(eq(schema.connections.userId, userId)),
    db
      .select()
      .from(schema.commitments)
      .where(eq(schema.commitments.userId, userId))
  ]);
  return { messages, tasks, connections, commitments };
}
