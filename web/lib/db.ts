import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

// Managed Neon PostgreSQL over HTTP (same Drizzle schema as before).
// Schema + mock seed are applied idempotently via ensureReady() — call it
// (and await it) before any query path; getDb() does this automatically.
const connectionString =
  process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/wihgo";

// Raw client for DDL (proven path: sql.query without params).
const sql = neon(connectionString);

const DDL = `
CREATE TABLE IF NOT EXISTS "user" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "email_verified" boolean NOT NULL DEFAULT false,
  "image" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "session" (
  "id" text PRIMARY KEY,
  "expires_at" timestamp NOT NULL,
  "token" text NOT NULL UNIQUE,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  "ip_address" text,
  "user_agent" text,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "account" (
  "id" text PRIMARY KEY,
  "account_id" text NOT NULL,
  "provider_id" text NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "access_token" text,
  "refresh_token" text,
  "id_token" text,
  "access_token_expires_at" timestamp,
  "refresh_token_expires_at" timestamp,
  "scope" text,
  "password" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "verification" (
  "id" text PRIMARY KEY,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "messages" (
  "id" text PRIMARY KEY,
  "platform" text NOT NULL,
  "sender" text NOT NULL,
  "body" text NOT NULL,
  "time" text NOT NULL,
  "unread" boolean NOT NULL DEFAULT false,
  "starred" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "tasks" (
  "id" text PRIMARY KEY,
  "title" text NOT NULL,
  "progress" text NOT NULL DEFAULT '',
  "done" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "source" text NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS "connections" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "connected" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "commitments" (
  "id" text PRIMARY KEY,
  "user_id" text,
  "message_id" text NOT NULL,
  "promise_text" text NOT NULL,
  "owner" text NOT NULL DEFAULT '',
  "deadline" text NOT NULL DEFAULT '',
  "status" text NOT NULL DEFAULT 'open',
  "corrected" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "corrections" (
  "id" text PRIMARY KEY,
  "user_id" text,
  "commitment_id" text NOT NULL,
  "field" text NOT NULL,
  "old_value" text NOT NULL DEFAULT '',
  "new_value" text NOT NULL DEFAULT '',
  "created_at" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "drafts" (
  "id" text PRIMARY KEY,
  "user_id" text,
  "commitment_id" text NOT NULL,
  "message_id" text NOT NULL DEFAULT '',
  "body" text NOT NULL DEFAULT '',
  "tone" text NOT NULL DEFAULT 'Executive',
  "status" text NOT NULL DEFAULT 'draft',
  "created_at" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "preferences" (
  "user_id" text PRIMARY KEY,
  "tone" text NOT NULL DEFAULT 'Executive',
  "updated_at" timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "sent_log" (
  "id" text PRIMARY KEY,
  "user_id" text,
  "draft_id" text NOT NULL DEFAULT '',
  "to_address" text NOT NULL,
  "subject" text NOT NULL DEFAULT '',
  "provider" text NOT NULL DEFAULT 'zeptomail',
  "provider_id" text NOT NULL DEFAULT '',
  "status" text NOT NULL DEFAULT 'sent',
  "created_at" timestamp NOT NULL DEFAULT now()
);
`;

const SEED_MESSAGES = [
  { id: "msg-1", platform: "WhatsApp", sender: "WhatsApp", body: "Hello, I need more information about your services.", time: "10:30 AM", unread: true, starred: false },
  { id: "msg-2", platform: "Instagram", sender: "Instagram", body: "Can you send me your pricing?", time: "10:15 AM", unread: true, starred: true },
  { id: "msg-3", platform: "Gmail", sender: "Gmail", body: "Partnership proposal for collaboration.", time: "09:45 AM", unread: false, starred: false },
  { id: "msg-4", platform: "LinkedIn", sender: "LinkedIn", body: "Thanks for connecting!", time: "09:20 AM", unread: false, starred: true }
];

const SEED_TASKS = [
  { id: "task-1", title: "Follow up with leads", progress: "2/5", done: false },
  { id: "task-2", title: "Prepare proposal", progress: "0/1", done: false },
  { id: "task-3", title: "Review analytics", progress: "3/3", done: true }
];

const SEED_CONNECTIONS = ["WhatsApp", "Instagram", "Gmail", "Google Calendar", "Slack", "LinkedIn"];

declare global {
  // eslint-disable-next-line no-var
  var __wihgoReady: Promise<void> | undefined;
}

// Synchronous drizzle instance (manages its own connection from the string).
// Await ensureReady() once before issuing queries.
export const db: NeonDatabase<typeof schema> = drizzle(connectionString, { schema });

export function ensureReady(): Promise<void> {
  if (!globalThis.__wihgoReady) {
    globalThis.__wihgoReady = (async () => {
      for (const stmt of DDL.split(";")) {
        const s = stmt.trim();
        if (s) await sql.query(s);
      }
      // Phase-3 migration: per-user ownership on app tables.
      await sql.query(`ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "user_id" text`);
      await sql.query(`ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "user_id" text`);
      await sql.query(`ALTER TABLE "connections" ADD COLUMN IF NOT EXISTS "user_id" text`);
      // Drop pre-ownership mock rows (test data only — regenerated per user below).
      await sql.query(`DELETE FROM "messages" WHERE "user_id" IS NULL`);
      await sql.query(`DELETE FROM "tasks" WHERE "user_id" IS NULL`);
      await sql.query(`DELETE FROM "connections" WHERE "user_id" IS NULL`);
    })();
  }
  return globalThis.__wihgoReady;
}

// Idempotent per-user mock seed: a new user starts with their own copy of
// the demo rows, so two test users never see each other's data.
export async function ensureUserSeed(userId: string): Promise<void> {
  await ensureReady();
  const prefix = userId.slice(0, 8);
  const existing = await db
    .select({ id: schema.messages.id })
    .from(schema.messages)
    .where(eq(schema.messages.userId, userId));
  if (existing.length > 0) return;
  await db.insert(schema.messages).values(
    SEED_MESSAGES.map((m) => ({ ...m, id: `${prefix}-${m.id}`, userId }))
  );
  await db.insert(schema.tasks).values(
    SEED_TASKS.map((t) => ({ ...t, id: `${prefix}-${t.id}`, userId }))
  );
  await db.insert(schema.connections).values(
    SEED_CONNECTIONS.map((name, i) => ({ id: `${prefix}-conn-${i + 1}`, name, connected: true, userId }))
  );
}

export async function getDb(): Promise<NeonDatabase<typeof schema>> {
  await ensureReady();
  return db;
}
