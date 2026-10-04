// Temporary inline brand mark matching the frozen WIHGO AI identity.
// SWAP PLAN: when the official PNGs are available, drop them into
// web/public/brand/ as logo.png + app-icon.png and replace the <svg>
// below with: <img src="/brand/logo.png" alt="WIHGO AI" width={34} />
export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 7) / 12} viewBox="0 0 120 70" aria-label="WIHGO AI logo">
      <path
        d="M8 10 L28 60 L45 25 L62 60 L82 10 L66 10 L54 38 L45 18 L36 38 L24 10 Z"
        fill="#0B5C5B"
      />
      <path d="M82 10 L98 42 L112 10 L96 10 L90 24 L84 10 Z" fill="#C7CDD1" />
      <circle cx="112" cy="8" r="6" fill="#C7CDD1" />
    </svg>
  );
}

export function BrandLockup() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <BrandMark />
      <div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.03em" }}>
          WIHGO <span style={{ color: "#14b8a6" }}>AI</span>
        </div>
        <div style={{ color: "#14b8a6", fontSize: 9, fontWeight: 500, letterSpacing: "0.3em" }}>
          CONNECT HUB
        </div>
      </div>
    </div>
  );
}
