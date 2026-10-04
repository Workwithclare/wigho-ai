import { eq } from "drizzle-orm";
import { getDb } from "./db";
import * as schema from "./schema";

export interface Extraction {
  promiseText: string;
  owner: string;
  deadline: string;
}

// ---------------------------------------------------------------------------
// Haystack seam.
// In production this calls the Haystack pipeline (extraction + memory
// search) over the message text. No Haystack service runs in this local
// phase, so it resolves to null and the offline heuristic below takes over.
// Swap the body of this function when the retrieval service lands — the
// Extraction shape and all callers stay unchanged.
// ---------------------------------------------------------------------------
async function runHaystackExtraction(_text: string): Promise<Extraction | null> {
  return null;
}

const COMMITMENT_CUES =
  /(promis|will send|will pay|will deliver|by (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|due (by|on)?|send me|follow up|book a|let['’]s meet|invoice|quote|proposal|call (you|tomorrow|today)|reminder)/i;

const DEADLINE_PATTERNS: Array<{ re: RegExp; label: (m: RegExpMatchArray) => string }> = [
  { re: /by (friday|monday|tuesday|wednesday|thursday|saturday|sunday)/i, label: (m) => `by ${m[1]}` },
  { re: /invoice #?(\d+)[^.]*?(overdue|paid|due)/i, label: () => "invoice due" },
  { re: /(tomorrow)/i, label: () => "tomorrow" },
  { re: /(today)/i, label: () => "today" },
  { re: /in (\d+) days?/i, label: (m) => `in ${m[1]} days` }
];

export async function extractFromMessage(
  platform: string,
  sender: string,
  body: string
): Promise<Extraction | null> {
  const haystack = await runHaystackExtraction(`${platform} ${sender}: ${body}`);
  if (haystack) return haystack;

  // Current extractor: commitment cues + deadline patterns over message text.
  if (!COMMITMENT_CUES.test(body)) return null;
  let deadline = "";
  for (const p of DEADLINE_PATTERNS) {
    const m = body.match(p.re);
    if (m) {
      deadline = p.label(m);
      break;
    }
  }
  return {
    promiseText: body.length > 140 ? `${body.slice(0, 137)}…` : body,
    owner: sender && sender !== platform ? sender : "you",
    deadline
  };
}

// Extraction job: every user message without a commitment row gets one if
// the extractor finds a commitment. Idempotent (skips extracted messages).
export async function runExtractionForUser(userId: string): Promise<{ created: number; scanned: number }> {
  const db = await getDb();
  const msgs = await db.select().from(schema.messages).where(eq(schema.messages.userId, userId));
  const existing = await db
    .select({ messageId: schema.commitments.messageId })
    .from(schema.commitments)
    .where(eq(schema.commitments.userId, userId));
  const done = new Set(existing.map((e) => e.messageId));
  let created = 0;
  for (const m of msgs) {
    if (done.has(m.id)) continue;
    const ex = await extractFromMessage(m.platform, m.sender, m.body);
    if (!ex) {
      // Record a skip so we don't rescan non-commitment chatter.
      await db.insert(schema.commitments).values({
        id: `${userId.slice(0, 8)}-skip-${m.id}`,
        userId,
        messageId: m.id,
        promiseText: "",
        owner: "",
        deadline: "",
        status: "skipped"
      });
      continue;
    }
    await db.insert(schema.commitments).values({
      id: `${userId.slice(0, 8)}-cm-${m.id}`,
      userId,
      messageId: m.id,
      promiseText: ex.promiseText,
      owner: ex.owner,
      deadline: ex.deadline,
      status: "open"
    });
    created += 1;
  }
  return { created, scanned: msgs.length };
}
