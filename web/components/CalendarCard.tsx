"use client";

import { useState } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function CalendarCard() {
  // Reference mock month from the frozen designs; arrows move freely.
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(4); // May
  const [selected, setSelected] = useState<number | null>(15);

  const firstDow = new Date(year, month, 1).getDay();
  const total = daysInMonth(year, month);
  const cells: Array<number | null> = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1)
  ];

  function shift(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelected(null);
  }

  return (
    <section style={card}>
      <div style={head}>
        <strong style={{ color: "#fff", fontSize: 14 }}>Calendar</strong>
        <span style={{ color: "#c7cdd1", fontSize: 12.5 }}>
          {MONTHS[month]} {year}&nbsp;&nbsp;
          <button type="button" onClick={() => shift(-1)} style={arrow} aria-label="Previous month">‹</button>
          &nbsp;&nbsp;
          <button type="button" onClick={() => shift(1)} style={arrow} aria-label="Next month">›</button>
        </span>
      </div>
      <div style={grid}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} style={dow}>{d}</span>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <span key={`e${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => setSelected(day)}
              style={selected === day ? { ...dayBtn, ...daySel } : dayBtn}
            >
              {day}
            </button>
          )
        )}
      </div>
      <p style={hint}>
        {selected !== null
          ? `Selected: ${MONTHS[month]} ${selected}, ${year} (mock — live sync lands with Google Calendar).`
          : "Pick a day. Live sync lands with Google Calendar."}
      </p>
      <p style={hint}>Upcoming: Team Meeting (Today, 2:00 PM) · Client Call (Tomorrow, 11:00 AM).</p>
    </section>
  );
}

const card: React.CSSProperties = {
  background: "#0c1a1c",
  border: "1px solid #073f42",
  borderRadius: 14,
  padding: 20
};
const head: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10
};
const arrow: React.CSSProperties = {
  background: "none",
  border: "1px solid #0b5c5b",
  color: "#f4f7f7",
  borderRadius: 6,
  width: 24,
  height: 24,
  cursor: "pointer",
  fontSize: 14,
  lineHeight: 1
};
const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: 2,
  textAlign: "center",
  fontSize: 11.5
};
const dow: React.CSSProperties = { color: "#7a8a8d", fontWeight: 600, padding: "4px 0" };
const dayBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#c7cdd1",
  fontFamily: "inherit",
  fontSize: 11.5,
  padding: "5px 0",
  borderRadius: 6,
  cursor: "pointer"
};
const daySel: React.CSSProperties = { background: "#14b8a6", color: "#081012", fontWeight: 700 };
const hint: React.CSSProperties = { color: "#c7cdd1", fontSize: 12.5, marginBottom: 0, marginTop: 10 };
