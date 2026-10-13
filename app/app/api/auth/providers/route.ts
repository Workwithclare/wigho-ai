import { NextResponse } from "next/server";

const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

export async function GET() {
  return NextResponse.json({ google: googleConfigured });
}
