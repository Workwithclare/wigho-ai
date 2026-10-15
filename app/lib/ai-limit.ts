import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { aiUsage } from "./schema";

export const AI_DAILY_LIMIT = 30;

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

// Returns { ok, remaining }. If the ai_usage table does not exist yet
// (migration pending approval), it fails open so the app keeps working.
export async function checkAiQuota(userId: string): Promise<{ ok: boolean; remaining: number }> {
  try {
    const day = todayUTC();
    const rows = await db
      .select()
      .from(aiUsage)
      .where(and(eq(aiUsage.userId, userId), eq(aiUsage.day, day)));
    const count = rows[0]?.count ?? 0;
    if (count >= AI_DAILY_LIMIT) return { ok: false, remaining: 0 };
    return { ok: true, remaining: AI_DAILY_LIMIT - count };
  } catch {
    return { ok: true, remaining: AI_DAILY_LIMIT };
  }
}

export async function bumpAiUsage(userId: string): Promise<void> {
  try {
    const day = todayUTC();
    const rows = await db
      .select()
      .from(aiUsage)
      .where(and(eq(aiUsage.userId, userId), eq(aiUsage.day, day)));
    if (rows.length === 0) {
      await db.insert(aiUsage).values({ userId, day, count: 1 });
    } else {
      await db
        .update(aiUsage)
        .set({ count: (rows[0]?.count ?? 0) + 1, updatedAt: new Date() })
        .where(and(eq(aiUsage.userId, userId), eq(aiUsage.day, day)));
    }
  } catch {
    // Table missing or transient DB error — never break the request.
  }
}
