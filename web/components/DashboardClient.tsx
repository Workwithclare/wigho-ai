"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@radix-ui/themes";
import { authClient } from "@/lib/auth-client";
import type { Message, Task, Commitment, Draft } from "@/lib/schema";

const PLATFORM_STYLE: Record<string, { bg: string; glyph: string; color?: string }> = {
  WhatsApp: { bg: "#25D366", glyph: "✆" },
  Instagram: { bg: "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF)", glyph: "📷" },
  Gmail: { bg: "#FFFFFF", glyph: "M", color: "#EA4335" },
  "Google Calendar": { bg: "#FFFFFF", glyph: "📅", color: "#0B5C5B" },
  Slack: { bg: "#4A154B", glyph: "✳" },
  LinkedIn: { bg: "#0A66C2", glyph: "in" }
};

export function MessagesCard({ messages }: { messages: Message[] }) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      messages.filter((m) => {
        if (tab === "unread" && !m.unread) return false;
        if (tab === "starred" && !m.starred) return false;
        if (query && !`${m.platform} ${m.sender} ${m.body}`.toLowerCase().includes(query.toLowerCase()))
          return false;
        return true;
      }),
    [messages, tab, query]
  );

  return (
    <section style={card}>
      <h3 style={h3}>All Messages</h3>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search messages…"
        style={search}
      />
      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List>
          <Tabs.Trigger value="all">All</Tabs.Trigger>
          <Tabs.Trigger value="unread">Unread</Tabs.Trigger>
          <Tabs.Trigger value="starred">Starred</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <div style={{ marginTop: 8 }}>
        {visible.length === 0 && <p style={muted}>No messages match (data comes from the local database).</p>}
        {visible.map((m) => {
          const st = PLATFORM_STYLE[m.platform] ?? { bg: "#0B5C5B", glyph: "•" };
          return (
            <div key={m.id} style={msgRow}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  flex: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  fontWeight: 700,
                  background: st.bg,
                  color: st.color ?? "#fff"
                }}
              >
                {st.glyph}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <strong style={{ color: "#fff", fontSize: 13.5 }}>{m.platform}</strong>
                  <time style={{ color: "#7a8a8d", fontSize: 11.5 }}>{m.time}</time>
                </div>
                <p style={ellipsis}>{m.body}</p>
              </div>
              {m.unread && (
                <div
                  style={{
                    flex: "none",
                    alignSelf: "center",
                    background: "#14b8a6",
                    color: "#081012",
                    fontSize: 11,
                    fontWeight: 700,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  !
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function DraftsCard({ drafts }: { drafts: Draft[] }) {
  const router = useRouter();
  const [bodies, setBodies] = useState<Record<string, string>>({});
  const [toMap, setToMap] = useState<Record<string, string>>({});
  const [subjMap, setSubjMap] = useState<Record<string, string>>({});
  const [note, setNote] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  async function save(id: string, body: string) {
    const { updateDraftBody } = await import("@/app/actions");
    const res = await updateDraftBody(id, body);
    setNote((n) => ({ ...n, [id]: res.ok ? "✓ Saved." : `Error: ${res.error}` }));
    if (res.ok) router.refresh();
  }

  async function copy(id: string, body: string) {
    try {
      await navigator.clipboard.writeText(body);
    } catch {
      /* clipboard unavailable — user copies manually */
    }
    const { markDraftCopied } = await import("@/app/actions");
    await markDraftCopied(id);
    setNote((n) => ({ ...n, [id]: "✓ Copied — paste and send it yourself." }));
    router.refresh();
  }

  async function send(id: string) {
    setBusy((b) => ({ ...b, [id]: true }));
    const { sendDraft } = await import("@/app/actions");
    const res = await sendDraft(id, toMap[id] ?? "", subjMap[id] ?? "");
    setNote((n) => ({ ...n, [id]: res.ok ? "✓ Sent via ZeptoMail and logged." : `Error: ${res.error}` }));
    setBusy((b) => ({ ...b, [id]: false }));
    if (res.ok) router.refresh();
  }

  return (
    <section style={card}>
      <h3 style={h3}>Drafts — edit, copy, or send</h3>
      {drafts.length === 0 && (
        <p style={muted}>No drafts yet. Generate them from your commitments first.</p>
      )}
      {drafts.map((d) => (
        <div key={d.id} style={commitRow}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ ...muted, margin: "0 0 6px" }}>
              Tone: {d.tone} · Status: {d.status}
            </p>
            <textarea
              value={bodies[d.id] ?? d.body}
              onChange={(e) => setBodies((b) => ({ ...b, [d.id]: e.target.value }))}
              rows={4}
              style={{ ...search, resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <input
                value={toMap[d.id] ?? ""}
                onChange={(e) => setToMap((m) => ({ ...m, [d.id]: e.target.value }))}
                placeholder="Send to (email)"
                style={{ ...search, marginBottom: 0, flex: 1, minWidth: 180 }}
              />
              <input
                value={subjMap[d.id] ?? ""}
                onChange={(e) => setSubjMap((m) => ({ ...m, [d.id]: e.target.value }))}
                placeholder="Subject"
                style={{ ...search, marginBottom: 0, flex: 1, minWidth: 180 }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={() => save(d.id, bodies[d.id] ?? d.body)} style={ghostBtn}>
                Save edits
              </button>
              <button type="button" onClick={() => copy(d.id, bodies[d.id] ?? d.body)} style={ghostBtn}>
                Copy
              </button>
              <button type="button" onClick={() => send(d.id)} disabled={!!busy[d.id]} style={solidBtn}>
                {busy[d.id] ? "Sending…" : "Send via ZeptoMail"}
              </button>
            </div>
            {note[d.id] && <p style={{ color: "#14b8a6", fontSize: 12.5 }}>{note[d.id]}</p>}
          </div>
        </div>
      ))}
    </section>
  );
}

export function TasksCard({ tasks: initial }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initial);
  return (
    <section style={card}>
      <h3 style={h3}>Tasks</h3>
      {tasks.map((t) => (
        <div key={t.id} style={taskRow}>
          <input
            type="checkbox"
            checked={t.done}
            onChange={() => setTasks((prev) => prev.map((p) => (p.id === t.id ? { ...p, done: !p.done } : p)))}
            style={{ width: 17, height: 17, accentColor: "#14b8a6", cursor: "pointer" }}
          />
          <label
            style={{
              flex: 1,
              color: t.done ? "#7a8a8d" : "#f4f7f7",
              textDecoration: t.done ? "line-through" : "none",
              fontSize: 13
            }}
          >
            {t.title}
          </label>
          <span style={{ color: "#c7cdd1", fontSize: 12 }}>{t.progress}</span>
        </div>
      ))}
      <p style={{ ...muted, marginTop: 8 }}>Toggling here is UI-only in this phase (persists after the tasks API lands).</p>
    </section>
  );
}

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
      }}
      style={ghostBtn}
    >
      Log out
    </button>
  );
}

export function AssistantChat({ userName }: { userName: string }) {
  const [history, setHistory] = useState<Array<{ role: string; text: string }>>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setError("");
    setBusy(true);
    setHistory((h) => [...h, { role: "you", text }]);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Assistant failed.");
      setHistory((h) => [...h, { role: "ai", text: String(data.reply) }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assistant failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div style={{ textAlign: "center", padding: "6px 0 12px" }}>
        <div style={aiOrb}>🤖</div>
        <strong style={{ color: "#fff", fontSize: 15 }}>Hello {userName}! 👋</strong>
        <p style={{ color: "#c7cdd1", fontSize: 13, margin: "2px 0 0" }}>Ask about your messages, commitments, or tasks.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10, maxHeight: 260, overflowY: "auto" }}>
        {history.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "you" ? "flex-end" : "flex-start",
              background: m.role === "you" ? "#0b5c5b" : "#0e2224",
              border: "1px solid #073f42",
              color: "#f4f7f7",
              fontSize: 13,
              borderRadius: 10,
              padding: "8px 12px",
              maxWidth: "90%",
              whiteSpace: "pre-wrap"
            }}
          >
            {m.text}
          </div>
        ))}
        {busy && <div style={{ color: "#7a8a8d", fontSize: 12.5 }}>Thinking…</div>}
      </div>
      {error && <p style={{ color: "#ff9d9d", fontSize: 12.5 }}>{error}</p>}
      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask WIHGO AI…"
          style={{ ...search, marginBottom: 0, flex: 1 }}
        />
        <button type="submit" disabled={busy} style={{ ...solidBtn, opacity: busy ? 0.6 : 1 }}>
          Send
        </button>
      </form>
    </div>
  );
}

export function ConnectGmailButton() {
  const [error, setError] = useState("");
  return (
    <span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
      <button
        type="button"
        onClick={async () => {
          setError("");
          const res = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
          if (res.error) setError(res.error.message ?? "Could not start Google sign-in.");
        }}
        style={solidBtn}
      >
        Connect Gmail
      </button>
      {error && <span style={{ color: "#ff9d9d", fontSize: 12.5 }}>{error}</span>}
    </span>
  );
}

export function SyncGmailLiveButton() {
  const router = useRouter();
  const [state, setState] = useState("idle");
  return (
    <span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
      <button
        type="button"
        disabled={state === "busy"}
        onClick={async () => {
          setState("busy");
          const { syncGmailLiveAction } = await import("@/app/actions");
          const res = await syncGmailLiveAction();
          setState(res.error ? `Error: ${res.error}` : `✓ Live sync: ${res.inserted} new of ${res.total} recent`);
          if (!res.error) router.refresh();
        }}
        style={solidBtn}
      >
        {state === "busy" ? "Syncing…" : "Sync live Gmail"}
      </button>
      {state !== "idle" && state !== "busy" && (
        <span style={{ color: "#14b8a6", fontSize: 12.5 }}>{state}</span>
      )}
    </span>
  );
}

export function IntakeForm() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  return (
    <form
      action={async (formData: FormData) => {
        const { addManualMessage } = await import("@/app/actions");
        const res = await addManualMessage(formData);
        setMsg(res.ok ? "✓ Pasted email saved to your messages." : `Error: ${res.error}`);
        if (res.ok) router.refresh();
      }}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <input name="sender" placeholder="Sender label (e.g. forwarded email)" style={search} />
        <textarea
          name="body"
          required
          rows={3}
          placeholder="Paste email text here…"
          style={{ ...search, resize: "vertical" }}
        />
        <div>
          <button type="submit" style={solidBtn}>
            Save pasted email
          </button>
        </div>
        {msg && <span style={{ color: "#14b8a6", fontSize: 12.5 }}>{msg}</span>}
      </div>
    </form>
  );
}

export function CommitmentsCard({
  commitments,
  messages
}: {
  commitments: Commitment[];
  messages: Message[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ promiseText: "", owner: "", deadline: "" });
  const [note, setNote] = useState("");
  const open = commitments.filter((c) => c.status === "open");
  const flagged = commitments.filter((c) => c.status !== "open" && c.status !== "skipped");
  const sourceOf = (id: string) => messages.find((m) => m.id === id);

  async function save(id: string) {
    const { correctCommitment } = await import("@/app/actions");
    const res = await correctCommitment(id, form);
    setNote(res.ok ? "✓ Correction saved and logged." : `Error: ${res.error}`);
    setEditing(null);
    if (res.ok) router.refresh();
  }

  async function flag(id: string) {
    const { flagCommitment } = await import("@/app/actions");
    const res = await flagCommitment(id);
    setNote(res.ok ? "✓ Flagged as wrong extraction and logged." : `Error: ${res.error}`);
    if (res.ok) router.refresh();
  }

  return (
    <section style={card}>
      <h3 style={h3}>Commitments — extracted memory</h3>
      {open.length === 0 && (
        <p style={muted}>No open commitments. Sync Gmail or paste an email, then run extraction.</p>
      )}
      {open.map((c) => {
        const src = sourceOf(c.messageId);
        const isEditing = editing === c.id;
        return (
          <div key={c.id} style={commitRow}>
            {isEditing ? (
              <div style={{ display: "grid", gap: 8, flex: 1 }}>
                <input
                  value={form.promiseText}
                  onChange={(e) => setForm({ ...form, promiseText: e.target.value })}
                  placeholder="Promise text"
                  style={search}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={form.owner}
                    onChange={(e) => setForm({ ...form, owner: e.target.value })}
                    placeholder="Owner"
                    style={{ ...search, marginBottom: 0 }}
                  />
                  <input
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    placeholder="Deadline"
                    style={{ ...search, marginBottom: 0 }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => save(c.id)} style={solidBtn}>
                    Save correction
                  </button>
                  <button type="button" onClick={() => setEditing(null)} style={ghostBtn}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#fff", fontSize: 13.5, margin: 0 }}>
                    Promised: <strong>{c.promiseText || "(empty)"}</strong>
                    {c.owner ? ` — ${c.owner}` : ""}
                    {c.deadline ? ` — ${c.deadline}` : ""}
                    {c.corrected ? " · corrected" : ""}
                  </p>
                  {src && (
                    <p style={{ ...muted, margin: "4px 0 0" }}>
                      Source: {src.platform} — “{src.body.slice(0, 90)}{src.body.length > 90 ? "…" : ""}”
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, flex: "none" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ promiseText: c.promiseText, owner: c.owner, deadline: c.deadline });
                      setEditing(c.id);
                    }}
                    style={ghostBtn}
                  >
                    Correct
                  </button>
                  <button type="button" onClick={() => flag(c.id)} style={ghostBtn}>
                    Flag wrong
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
      {flagged.length > 0 && (
        <p style={{ ...muted, marginTop: 8 }}>
          {flagged.length} flagged/corrected extraction{flagged.length === 1 ? "" : "s"} logged for review.
        </p>
      )}
      {note && <p style={{ color: "#14b8a6", fontSize: 12.5 }}>{note}</p>}
    </section>
  );
}

const card: React.CSSProperties = {
  background: "#0c1a1c",
  border: "1px solid #073f42",
  borderRadius: 14,
  padding: 20
};
const h3: React.CSSProperties = { color: "#fff", fontSize: 15.5, fontWeight: 600, margin: "0 0 12px" };
const muted: React.CSSProperties = { color: "#7a8a8d", fontSize: 12.5 };
const search: React.CSSProperties = {
  width: "100%",
  background: "#0e2224",
  border: "1px solid #0b5c5b",
  borderRadius: 10,
  color: "#fff",
  fontFamily: "inherit",
  fontSize: 13,
  padding: "9px 12px",
  marginBottom: 10,
  outline: "none"
};
const msgRow: React.CSSProperties = {
  display: "flex",
  gap: 12,
  padding: "11px 0",
  borderTop: "1px solid #073f42",
  alignItems: "flex-start"
};
const ellipsis: React.CSSProperties = {
  color: "#c7cdd1",
  fontSize: 12.5,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  margin: 0
};
const aiOrb: React.CSSProperties = {
  width: 64,
  height: 64,
  margin: "0 auto 10px",
  borderRadius: "50%",
  background: "radial-gradient(circle at 35% 30%, #2ad4c0, #0b5c5b 55%, #073f42)",
  boxShadow: "0 0 28px rgba(20,184,166,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 30
};
const commitRow: React.CSSProperties = {
  display: "flex",
  gap: 12,
  padding: "12px 0",
  borderTop: "1px solid #073f42",
  alignItems: "flex-start"
};
const taskRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  padding: "9px 0",
  borderTop: "1px solid #073f42"
};
const ghostBtn: React.CSSProperties = {
  background: "none",
  border: "1px solid #0b5c5b",
  color: "#f4f7f7",
  fontFamily: "inherit",
  fontSize: 13,
  borderRadius: 10,
  padding: "9px 16px",
  cursor: "pointer"
};
const solidBtn: React.CSSProperties = {
  background: "#0b5c5b",
  border: "none",
  color: "#fff",
  fontFamily: "inherit",
  fontSize: 13,
  fontWeight: 600,
  borderRadius: 10,
  padding: "10px 18px",
  cursor: "pointer",
  boxShadow: "0 0 14px rgba(20,184,166,0.45)"
};
