// Server-side Gemini integration (Google AI Studio / Generative Language API).
// The API key lives ONLY in server env (GEMINI_API_KEY) — it is never
// imported, logged, or sent to the browser. All calls go through the
// session-gated /api/assistant route below.

const MODEL = "gemini-3.8-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export interface AssistantContext {
  userName: string;
  tone: string;
  messages: Array<{ platform: string; sender: string; body: string; time: string }>;
  commitments: Array<{ promiseText: string; owner: string; deadline: string; status: string }>;
  tasks: Array<{ title: string; done: boolean }>;
}

function buildPrompt(userMessage: string, ctx: AssistantContext): string {
  const msgLines = ctx.messages
    .slice(0, 12)
    .map((m) => `- [${m.platform}] ${m.sender} (${m.time}): ${m.body}`)
    .join("\n");
  const comLines = ctx.commitments
    .filter((c) => c.status === "open")
    .slice(0, 12)
    .map((c) => `- ${c.promiseText}${c.owner ? ` (owner: ${c.owner})` : ""}${c.deadline ? ` (deadline: ${c.deadline})` : ""}`)
    .join("\n");
  const taskLines = ctx.tasks
    .slice(0, 12)
    .map((t) => `- [${t.done ? "done" : "open"}] ${t.title}`)
    .join("\n");
  return [
    `You are WIHGO AI, a business memory and attention assistant for ${ctx.userName}.`,
    `Reply in a ${ctx.tone} tone. Be concise, warm, and professional.`,
    `Answer ONLY from the business context below. If the answer is not in the context, say what is missing instead of inventing facts.`,
    ``,
    `OPEN COMMITMENTS:`,
    comLines || "(none)",
    ``,
    `RECENT MESSAGES:`,
    msgLines || "(none)",
    ``,
    `TASKS:`,
    taskLines || "(none)",
    ``,
    `USER ASKS: ${userMessage}`
  ].join("\n");
}

export async function askGemini(userMessage: string, ctx: AssistantContext): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "PASTE-YOUR-KEY-HERE") {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(userMessage, ctx) }] }],
      generationConfig: { maxOutputTokens: 512, temperature: 0.4 }
    })
  });
  if (res.status === 400) throw new Error("Gemini rejected the request (check key restrictions).");
  if (res.status === 403) throw new Error("Gemini denied access — API key invalid or restricted.");
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      const msg = errBody?.error?.message;
      if (msg) detail += `: ${String(msg).slice(0, 200)}`;
    } catch {
      /* ignore parse errors */
    }
    throw new Error(`Gemini request failed (${detail}).`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("")?.trim();
  if (!text) throw new Error("Gemini returned an empty reply.");
  return text;
}
