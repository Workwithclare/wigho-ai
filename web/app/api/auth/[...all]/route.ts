import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { ensureReady } from "@/lib/db";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

// Database (tables + seed) is guaranteed ready before the handler runs.
export async function GET(req: NextRequest) {
  await ensureReady();
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  await ensureReady();
  return handlers.POST(req);
}
