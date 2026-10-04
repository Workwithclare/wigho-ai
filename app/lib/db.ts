import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazy client: neon() validates the URL *format* at creation but only
// connects when a query runs. The fallback below is format-valid on
// purpose so `next build` / page collection succeeds before DATABASE_URL
// is configured — any real query without a configured URL will fail
// loudly at query time, and the home page reports the unconfigured state.
const sql = neon(
  process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/wihgo"
);

export const db = drizzle(sql, { schema });
