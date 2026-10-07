"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLockup } from "./BrandMark";
import { CalendarCard } from "./CalendarCard";
import {
  MessagesCard,
  TasksCard,
  SignOutButton,
  IntakeForm,
  CommitmentsCard,
  DraftsCard,
  AssistantChat,
  ConnectGmailButton,
  SyncGmailLiveButton
} from "./DashboardClient";
import type { Message, Task, Connection, Commitment, Draft } from "@/lib/schema";
import { TONES } from "@/lib/schema";
import type { Tone } from "@/lib/schema";

export type ViewKey =
  | "Dashboard"
  | "Messages"
  | "Connections"
  | "Contacts"
  | "AI Assistant"
  | "Calendar"
  | "Analytics"
  | "Automation"
  | "Settings";

const NAV: Array<{ key: ViewKey; icon: string }> = [
  { key: "Dashboard", icon: "⌂" },
  { key: "Messages", icon: "✉" },
  { key: "Connections", icon: "⛓" },
  { key: "Contacts", icon: "👤" },
  { key: "AI Assistant", icon: "✦" },
  { key: "Calendar", icon: "📅" },
  { key: "Analytics", icon: "📊" },
  { key: "Automation", icon: "⚙" },
  { key: "Settings", icon: "🔧" }
];

export interface DashboardData {
  messages: Message[];
  tasks: Task[];
  connections: Connection[];
  commitments: Commitment[];
  drafts: Draft[];
}

export function DashboardShell({
  userName,
  userEmail,
  data,
  tone
}: {
  userName: string;
  userEmail: string;
  data: DashboardData;
  tone: Tone;
}) {
  const [view, setView] = useState<ViewKey>("Dashboard");
  const [genNote, setGenNote] = useState("");
  const { messages, tasks, connections, commitments, drafts } = data;
  const unread = messages.filter((m) => m.unread).length;
  const tasksDue = tasks.filter((t) => !t.done).length;

  const perPlatform = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of messages) map.set(m.platform, (map.get(m.platform) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [messages]);

  const contacts = useMemo(() => {
    const map = new Map<string, { platform: string; count: number }>();
    for (const m of messages) {
      const key = m.sender || m.platform;
      const prev = map.get(key) ?? { platform: m.platform, count: 0 };
      map.set(key, { platform: m.platform, count: prev.count + 1 });
    }
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [messages]);

  return (
    <div style={app}>
      <aside style={sidebar}>
        <div style={{ padding: "4px 8px 18px" }}>
          <BrandLockup />
        </div>
        {NAV.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setView(item.key)}
            style={{
              ...navItem,
              ...(view === item.key ? { background: "#0b5c5b", color: "#fff", fontWeight: 600 } : {})
            }}
          >
            <span style={{ width: 20 }}>{item.icon}</span>
            {item.key}
          </button>
        ))}
        <div style={userCard}>
          <div style={avatar}>{(userName[0] ?? "C").toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ display: "block", color: "#fff", fontSize: 13 }}>{userName}</strong>
            <span style={{ color: "#c7cdd1", fontSize: 11.5 }}>{userEmail}</span>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <div style={main} key={view} className="anim-view">
        <div style={header}>
          <div>
            <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 600, margin: 0 }}>
              {view === "Dashboard" ? `Welcome back, ${userName}! 👋` : view}
            </h1>
            <div style={{ color: "#c7cdd1", fontSize: 13.5 }}>
              {view === "Dashboard"
                ? "Here’s what’s happening with your hub today."
                : `${view} · data from your local database (test rows only)`}
            </div>
          </div>
        </div>

        {view === "Dashboard" && (
          <>
            <StatsRow
              messages={messages.length}
              unread={unread}
              connections={connections.length}
              tasksDue={tasksDue}
              tasks={tasks.length}
            />
            <div style={grid}>
              <MessagesCard messages={messages} />
              <PlatformsCard connections={connections} />
              <section style={card}>
                <h3 style={h3}>AI Assistant</h3>
                <AssistantChat userName={userName} />
              </section>
            </div>
            <CommitmentsCard commitments={commitments} messages={messages} />
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <GenerateOutputsButton onDone={setGenNote} />
              {genNote && <span style={{ color: "#14b8a6", fontSize: 12.5 }}>{genNote}</span>}
            </div>
            <DraftsCard drafts={drafts} />
            <IntakeBlock tasks={tasks} />
          </>
        )}

        {view === "Messages" && (
          <>
            <MessagesCard messages={messages} />
            <IntakeBlock tasks={tasks} />
          </>
        )}

        {view === "Connections" && <PlatformsCard connections={connections} />}

        {view === "Contacts" && (
          <section style={card}>
            <h3 style={h3}>Contacts — built from your messages</h3>
            {contacts.length === 0 && <p style={hint}>No contacts yet. Sync Gmail or paste an email first.</p>}
            {contacts.map(([name, info]) => (
              <div key={name} style={row}>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: "#fff", fontSize: 13.5 }}>{name}</strong>
                  <div style={{ color: "#c7cdd1", fontSize: 12.5 }}>
                    {info.platform} · {info.count} message{info.count === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {view === "AI Assistant" && (
          <section style={card}>
            <h3 style={h3}>AI Assistant</h3>
            <AssistantChat userName={userName} />
          </section>
        )}

        {view === "Calendar" && <CalendarCard />}

        {view === "Analytics" && (
          <section style={card}>
            <h3 style={h3}>Analytics — from your data</h3>
            <p style={hint}>
              {messages.length} messages · {unread} unread · {tasksDue} open tasks ·{" "}
              {commitments.filter((c) => c.status === "open").length} open commitments.
            </p>
            {perPlatform.map(([platform, count]) => (
              <div key={platform} style={row}>
                <strong style={{ color: "#fff", fontSize: 13.5, flex: 1 }}>{platform}</strong>
                <span style={{ color: "#14b8a6", fontSize: 13, fontWeight: 600 }}>{count}</span>
              </div>
            ))}
          </section>
        )}

        {view === "Automation" && (
          <section style={card}>
            <h3 style={h3}>Automation</h3>
            <p style={hint}>
              Automated rules (deadline nudges, follow-up sequences) land in a later phase. Your
              commitments and tasks above are the inputs they will act on — no mock automations run.
            </p>
          </section>
        )}

        {view === "Settings" && <SettingsView userEmail={userEmail} tone={tone} />}

        <div style={strip}>
          <StripItem glyph="💬" title="All your conversations." sub="One intelligent hub." />
          <StripItem glyph="✦" title="AI powered." sub="Smarter every day." />
          <StripItem glyph="🛡" title="Secure & Private." sub="Your data, your control." />
          <StripItem glyph="📈" title="Built for Business." sub="Designed to scale." />
        </div>
        <p style={{ textAlign: "center", color: "#7a8a8d", fontSize: 12 }}>
          WIHGO AI — CONNECT HUB · local build · data from local database (test rows only)
        </p>
      </div>
    </div>
  );
}

function StatsRow({
  messages,
  unread,
  connections,
  tasksDue,
  tasks
}: {
  messages: number;
  unread: number;
  connections: number;
  tasksDue: number;
  tasks: number;
}) {
  return (
    <div style={stats}>
      <Stat glyph="💬" num={messages} label="Total Messages" delta={`${unread} unread`} delay={0} />
      <Stat glyph="👥" num={connections} label="Connections" delta="all linked" delay={70} />
      <Stat glyph="📅" num={tasksDue} label="Tasks Due" delta={`${tasks} tracked`} delay={140} />
      <Stat glyph="📈" num={8} label="Automations" delta="mock" delay={210} />
    </div>
  );
}

function Stat({ glyph, num, label, delta, delay }: { glyph: string; num: number; label: string; delta: string; delay: number }) {
  return (
    <div style={{ ...stat, animationDelay: `${delay}ms` }} className="anim-card">
      <div style={tile}>{glyph}</div>
      <div>
        <div style={{ color: "#fff", fontSize: 26, fontWeight: 600, lineHeight: 1.1 }}>{num}</div>
        <div style={{ color: "#c7cdd1", fontSize: 12.5 }}>{label}</div>
        <div style={{ color: "#14b8a6", fontSize: 12 }}>{delta}</div>
      </div>
    </div>
  );
}

function PlatformsCard({ connections }: { connections: Connection[] }) {
  return (
    <section style={card}>
      <h3 style={h3}>Connected Platforms</h3>
      <p style={hint}>Manage all your integrations in one place.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {connections.map((c) => (
          <div key={c.id} style={plat}>
            <strong style={{ color: "#fff", fontSize: 13 }}>{c.name}</strong>
            <span style={{ color: "#14b8a6", fontSize: 11.5 }}>● Connected</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function GenerateOutputsButton({ onDone }: { onDone: (msg: string) => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const { generateOutputs } = await import("@/app/actions");
        const res = await generateOutputs();
        onDone(`✓ Generated ${res.tasks} tasks + ${res.drafts} drafts in ${res.tone} tone.`);
        setBusy(false);
        router.refresh();
      }}
      style={solidBtnLike}
      className="btn-glow"
    >
      {busy ? "Generating…" : "Generate tasks + drafts from commitments"}
    </button>
  );
}

function IntakeBlock({ tasks }: { tasks: DashboardData["tasks"] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
      <section style={card}>
        <h3 style={h3}>Gmail intake</h3>
        <p style={hint}>Connect live Gmail and sync, or paste any email text. Rows land in your own messages only.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <ConnectGmailButton />
          <SyncGmailLiveButton />
        </div>
        <IntakeForm />
      </section>
      <TasksCard tasks={tasks} />
    </div>
  );
}

function SettingsView({ userEmail, tone }: { userEmail: string; tone: Tone }) {
  const router = useRouter();
  const [current, setCurrent] = useState<Tone>(tone);
  const [note, setNote] = useState("");
  return (
    <section style={card}>
      <h3 style={h3}>Settings</h3>
      <p style={hint}>Signed in as {userEmail}. Every row in this app is scoped to your account.</p>
      <p style={{ color: "#fff", fontSize: 13.5, fontWeight: 600 }}>Assistant + draft tone</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {TONES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={async () => {
              const { setToneAction } = await import("@/app/actions");
              const res = await setToneAction(t);
              if (res.ok) {
                setCurrent(t);
                setNote(`✓ Tone set to ${t}. New drafts and replies use it.`);
                router.refresh();
              } else {
                setNote(`Error: ${res.error}`);
              }
            }}
            style={{
              background: current === t ? "#0b5c5b" : "none",
              border: "1px solid #0b5c5b",
              color: "#f4f7f7",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: current === t ? 600 : 400,
              borderRadius: 999,
              padding: "8px 18px",
              cursor: "pointer"
            }}
          >
            {t}
          </button>
        ))}
      </div>
      {note && <p style={{ color: "#14b8a6", fontSize: 12.5 }}>{note}</p>}
    </section>
  );
}

function StripItem({ glyph, title, sub }: { glyph: string; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <span style={{ color: "#14b8a6", fontSize: 24 }}>{glyph}</span>
      <div>
        <strong style={{ display: "block", color: "#fff", fontSize: 13.5 }}>{title}</strong>
        <span style={{ color: "#c7cdd1", fontSize: 12.5 }}>{sub}</span>
      </div>
    </div>
  );
}

const app: React.CSSProperties = {
  maxWidth: 1440,
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "230px 1fr",
  gap: 16,
  padding: 16,
  minHeight: "100vh",
  background: "#081012"
};
const main: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 16, minWidth: 0 };
const header: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" };
const stats: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 };
const stat: React.CSSProperties = {
  background: "#0c1a1c",
  border: "1px solid #073f42",
  borderRadius: 14,
  padding: 18,
  display: "flex",
  gap: 14,
  alignItems: "center"
};
const tile: React.CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 12,
  flex: "none",
  background: "rgba(20,184,166,0.14)",
  border: "1px solid #073f42",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 21
};
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "1.25fr 1.25fr 1fr", gap: 16 };
const card: React.CSSProperties = {
  background: "#0c1a1c",
  border: "1px solid #073f42",
  borderRadius: 14,
  padding: 20
};
const solidBtnLike: React.CSSProperties = {
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
const h3: React.CSSProperties = { color: "#fff", fontSize: 15.5, fontWeight: 600, margin: "0 0 4px" };
const hint: React.CSSProperties = { color: "#c7cdd1", fontSize: 12.5, marginBottom: 14 };
const plat: React.CSSProperties = {
  background: "#0e2224",
  border: "1px solid #073f42",
  borderRadius: 10,
  padding: 12
};
const row: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  padding: "9px 0",
  borderTop: "1px solid #073f42"
};
const strip: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 16,
  background: "#0c1a1c",
  border: "1px solid #073f42",
  borderRadius: 14,
  padding: "20px 26px"
};
const userCard: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#0e2224",
  border: "1px solid #073f42",
  borderRadius: 10,
  padding: "10px 12px"
};
const avatar: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  flex: "none",
  background: "linear-gradient(135deg,#0b5c5b,#073f42)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  fontSize: 14
};
const sidebar: React.CSSProperties = {
  background: "#0c1a1c",
  border: "1px solid #073f42",
  borderRadius: 14,
  padding: "20px 14px",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  alignSelf: "start",
  position: "sticky",
  top: 16
};
const navItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  color: "#f4f7f7",
  fontSize: 14,
  fontWeight: 500,
  padding: "10px 12px",
  borderRadius: 10,
  background: "none",
  border: "none",
  fontFamily: "inherit",
  width: "100%",
  textAlign: "left",
  cursor: "pointer"
};
