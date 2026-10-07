// Outbound email via ZeptoMail (transactional sending).
// Gmail stays read-only; anything the user sends goes through here with an
// explicit per-draft action — nothing auto-sends. Credentials live only in
// server env (ZEPTOMAIL_TOKEN); this module never runs in the browser.

const ENDPOINT = "https://api.zeptomail.com/v1.1/email";

export interface SendInput {
  to: string;
  toName?: string;
  subject: string;
  textBody: string;
  fromName?: string;
}

function configured(): { token: string; from: string; bounce: string } | null {
  const token = process.env.ZEPTOMAIL_TOKEN;
  const from = process.env.ZEPTOMAIL_FROM;
  if (!token || !from) return null;
  return { token, from, bounce: process.env.ZEPTOMAIL_BOUNCE ?? from };
}

export function zeptoConfigured(): boolean {
  return configured() !== null;
}

export async function sendViaZeptoMail(input: SendInput): Promise<{ providerId: string }> {
  const cfg = configured();
  if (!cfg) throw new Error("ZeptoMail is not configured (ZEPTOMAIL_TOKEN / ZEPTOMAIL_FROM).");
  const to = input.to.trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) throw new Error("Recipient address looks invalid.");
  if (!input.textBody.trim()) throw new Error("Email body is empty.");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Zoho-enczapikey ${cfg.token}`
    },
    body: JSON.stringify({
      bounce_address: cfg.bounce,
      from: { address: cfg.from, name: input.fromName ?? "WIHGO AI" },
      to: [{ email_address: { address: to, name: input.toName ?? to } }],
      subject: input.subject.slice(0, 200) || "Follow-up from WIHGO AI",
      textbody: input.textBody.slice(0, 20000)
    }),
    signal: AbortSignal.timeout(30000)
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      const msg =
        errBody?.error?.message ?? errBody?.message ?? JSON.stringify(errBody).slice(0, 200);
      if (msg) detail += `: ${msg}`;
    } catch {
      /* ignore parse errors */
    }
    throw new Error(`ZeptoMail send failed (${detail}).`);
  }
  const data = (await res.json().catch(() => ({}))) as { request_id?: string };
  return { providerId: data.request_id ?? "" };
}
