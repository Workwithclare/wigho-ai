import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// WihGo business tables — these already exist in Neon with real data.
// Declared here so Drizzle NEVER proposes to drop them. Do NOT rename tables.
// ---------------------------------------------------------------------------

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  progress: text("progress").notNull().default(""),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  source: text("source").notNull().default(""),
  userId: text("user_id"),
});

export const connections = pgTable("connections", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  connected: boolean("connected").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: text("user_id"),
});

export const commitments = pgTable("commitments", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  messageId: text("message_id").notNull(),
  promiseText: text("promise_text").notNull(),
  owner: text("owner").notNull().default(""),
  deadline: text("deadline").notNull().default(""),
  status: text("status").notNull().default("open"),
  corrected: boolean("corrected").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  platform: text("platform").notNull(),
  sender: text("sender").notNull(),
  body: text("body").notNull(),
  time: text("time").notNull(),
  unread: boolean("unread").notNull().default(false),
  starred: boolean("starred").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: text("user_id"),
});

export const drafts = pgTable("drafts", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  commitmentId: text("commitment_id").notNull(),
  messageId: text("message_id").notNull().default(""),
  body: text("body").notNull().default(""),
  tone: text("tone").notNull().default("Executive"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const preferences = pgTable("preferences", {
  userId: text("user_id").primaryKey(),
  tone: text("tone").notNull().default("Executive"),
  updatedAt: timestamp("updated_at").notNull(),
});

export const suggestions = pgTable("suggestions", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  commitmentId: text("commitment_id").notNull(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  detail: text("detail").notNull().default(""),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const corrections = pgTable("corrections", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  commitmentId: text("commitment_id").notNull(),
  field: text("field").notNull(),
  oldValue: text("old_value").notNull().default(""),
  newValue: text("new_value").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sentLog = pgTable("sent_log", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  draftId: text("draft_id").notNull().default(""),
  toAddress: text("to_address").notNull(),
  subject: text("subject").notNull().default(""),
  provider: text("provider").notNull().default("zeptomail"),
  providerId: text("provider_id").notNull().default(""),
  status: text("status").notNull().default("sent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Better Auth core tables (email + future OAuth accounts).
// Verify/extend with: npx @better-auth/cli generate
// See: https://www.better-auth.com/docs/concepts/database
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
