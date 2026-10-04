const dbConfigured = Boolean(process.env.DATABASE_URL);
const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center"
      }}
    >
      <div style={{ maxWidth: 640 }}>
        <div
          style={{
            color: "#14b8a6",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase"
          }}
        >
          WIHGO AI &bull; Connect Hub
        </div>
        <h1 style={{ color: "#fff", fontSize: 48, fontWeight: 700, margin: "16px 0 8px" }}>
          Connect. Collaborate. Achieve.
        </h1>
        <p style={{ color: "#c7cdd1", fontSize: 17 }}>
          Backend foundation is live. Sign-in and connectors activate as each
          service is configured below.
        </p>
        <ul style={{ listStyle: "none", padding: 0, marginTop: 24, color: "#c7cdd1" }}>
          <li>Database (Neon): {dbConfigured ? "configured ✓" : "not configured yet"}</li>
          <li>Google (Gmail + Calendar): {googleConfigured ? "configured ✓" : "not configured yet"}</li>
        </ul>
      </div>
    </main>
  );
}
