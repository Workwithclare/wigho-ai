// One-shot Neon migration runner: reads DATABASE_URL from app/.env.local
// (never prints it), applies ./drizzle/*.sql statement-by-statement through
// the plain Neon client, then lists tables as proof.
// (Drizzle's built-in migrator hits a payload-serialization issue against
// this endpoint, so statements are applied directly — same SQL, same result.)
// Usage: node scripts/migrate.mjs  (from app/)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envText = fs.readFileSync(path.join(root, ".env.local"), "utf8");
const url = envText
  .split("\n")
  .map((l) => l.trim())
  .find((l) => l.startsWith("DATABASE_URL="))
  ?.slice("DATABASE_URL=".length);

if (!url || url.includes("PASTE")) {
  console.error("MISSING_DATABASE_URL");
  process.exit(1);
}

const { neon } = await import("@neondatabase/serverless");
const sql = neon(url);

const dir = path.join(root, "drizzle");
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.error("NO_MIGRATION_FILES (run: npm run db:generate first)");
  process.exit(1);
}

for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const statements = raw
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const stmt of statements) {
    await sql.query(stmt);
  }
  console.log("APPLIED:" + file);
}

const tables = await sql`SELECT tablename FROM pg_tables
  WHERE schemaname = 'public' AND tablename IN ('user', 'session', 'account', 'verification')
  ORDER BY tablename`;
console.log("TABLES:" + tables.map((t) => t.tablename).join(","));
