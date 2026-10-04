import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import * as schema from "./schema";

// ---------------------------------------------------------------------------
// Live Gmail connector (read-only). Uses the Google OAuth tokens Better Auth
// stored in the `account` table when the user connected Gmail — no Gmail
// passwords or app passwords anywhere. Inactive until GOOGLE_CLIENT_ID /
// GOOGLE_CLIENT_SECRET are set and the user clicks "Connect Gmail".
// ---------------------------------------------------------------------------

interface GmailListResponse {
  messages?: Array<{ id: string; threadId: string }>;
}

interface GmailGetResponse {
  id: string;
  threadId: string;
  snippet?: string;
  payload?: {
    headers?: Array<{ name: string; value: string }>;
  };
}

function header(msg: GmailGetResponse, name: string): string {
  return msg.payload?.headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

async function getAccessToken(userId: string): Promise<string | null> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.account)
    .where(and(eq(schema.account.userId, userId), eq(schema.account.providerId, "google")));
  const acct = rows[0];
  if (!acct?.accessToken) return null;

  // Refresh when we know it is expired and a refresh token exists.
  if (acct.refreshToken && acct.accessTokenExpiresAt && acct.accessTokenExpiresAt.getTime() < Date.now() + 60_000) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        refresh_token: acct.refreshToken,
        grant_type: "refresh_token"
      })
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) return null;
    await db
      .update(schema.account)
      .set({
        accessToken: data.access_token,
        accessTokenExpiresAt: new Date(Date.now() + (data.expires_in ?? 3600) * 1000)
      })
      .where(eq(schema.account.id, acct.id));
    return data.access_token;
  }
  return acct.accessToken;
}

export async function isGmailConnected(userId: string): Promise<boolean> {
  return (await getAccessToken(userId)) !== null;
}

// Fetch the N most recent Gmail threads and store them as message rows
// (deduped by Gmail id, scoped to this user). Returns counts.
export async function syncGmailLive(userId: string, max = 10): Promise<{ inserted: number; total: number }> {
  const token = await getAccessToken(userId);
  if (!token) throw new Error("Gmail is not connected. Click “Connect Gmail” first.");
  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${max}&q=in:inbox`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (listRes.status === 401) throw new Error("Gmail authorization expired — reconnect Gmail.");
  if (!listRes.ok) throw new Error(`Gmail list failed (HTTP ${listRes.status}).`);
  const list = (await listRes.json()) as GmailListResponse;
  const items = list.messages ?? [];
  const db = await getDb();
  const prefix = userId.slice(0, 8);
  let inserted = 0;
  for (const item of items) {
    const id = `${prefix}-gmail-${item.id}`;
    const existing = await db
      .select({ id: schema.messages.id })
      .from(schema.messages)
      .where(and(eq(schema.messages.id, id), eq(schema.messages.userId, userId)));
    if (existing.length > 0) continue;
    const getRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!getRes.ok) continue;
    const full = (await getRes.json()) as GmailGetResponse;
    const from = header(full, "From");
    const subject = header(full, "Subject") || "(no subject)";
    await db.insert(schema.messages).values({
      id,
      userId,
      platform: "Gmail",
      sender: from.slice(0, 80) || "Gmail",
      body: `${subject} — ${(full.snippet ?? "").slice(0, 300)}`,
      time: header(full, "Date").slice(0, 32) || "recently",
      unread: true,
      starred: false
    });
    inserted += 1;
  }
  return { inserted, total: items.length };
}
