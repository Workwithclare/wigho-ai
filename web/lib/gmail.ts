import { getDb } from "./db";

// Manual paste/forward intake: any pasted email text becomes a message row.
// Live Gmail sync lives in lib/gmail-live.ts (OAuth, read-only).

// Manual paste/forward intake: any pasted email text becomes a message row.
export async function intakeManualPaste(
  userId: string,
  input: { sender: string; body: string }
): Promise<{ id: string }> {
  const sender = input.sender.trim().slice(0, 80) || "Manual intake";
  const body = input.body.trim().slice(0, 2000);
  if (!body) throw new Error("Pasted text is empty.");
  const db = await getDb();
  const id = `${userId.slice(0, 8)}-manual-${Date.now()}`;
  await db.insert(schema.messages).values({
    id,
    userId,
    platform: "Manual",
    sender,
    body,
    time: "Just now",
    unread: true,
    starred: false
  });
  return { id };
}
