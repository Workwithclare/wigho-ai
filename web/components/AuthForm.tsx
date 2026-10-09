"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const card: React.CSSProperties = {
  maxWidth: 420,
  margin: "12vh auto",
  background: "#0c1a1c",
  border: "1px solid #073f42",
  borderRadius: 14,
  padding: "36px 34px"
};

const input: React.CSSProperties = {
  width: "100%",
  background: "#0e2224",
  border: "1px solid #0b5c5b",
  borderRadius: 10,
  color: "#fff",
  fontFamily: "inherit",
  fontSize: 15,
  padding: "12px 14px",
  marginBottom: 12,
  outline: "none"
};

const btn: React.CSSProperties = {
  width: "100%",
  background: "#0b5c5b",
  color: "#fff",
  fontFamily: "inherit",
  fontSize: 15,
  fontWeight: 600,
  border: "none",
  borderRadius: 10,
  padding: "12px",
  cursor: "pointer",
  boxShadow: "0 0 16px rgba(20,184,166,0.45)"
};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("clare@wihgo.ai");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({ email, password, name: name || "Clare" });
        if (res.error) throw new Error(res.error.message ?? "Sign up failed");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message ?? "Login failed");
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", padding: 24, background: "#081012" }}>
      <div style={card}>
        <div style={{ color: "#14b8a6", fontSize: 12, fontWeight: 600, letterSpacing: "0.18em" }}>
          WIHGO AI &bull; CONNECT HUB
        </div>
        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 600, margin: "10px 0 4px" }}>
          {mode === "signup" ? "Create your account" : "Welcome back, Clare!"}
        </h1>
        <p style={{ color: "#c7cdd1", fontSize: 14, marginBottom: 20 }}>
          {mode === "signup"
            ? "Local test account — stored in the local database only."
            : "Sign in with your local test account."}
        </p>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <input
              style={input}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          )}
          <input
            style={input}
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            style={input}
            placeholder="Password (8+ characters)"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
          {error && <p style={{ color: "#ff9d9d", fontSize: 13 }}>{error}</p>}
          <button style={{ ...btn, opacity: busy ? 0.7 : 1 }} type="submit" disabled={busy}>
            {busy ? "Please wait…" : mode === "signup" ? "Sign up" : "Log in"}
          </button>
        </form>
        <p style={{ color: "#c7cdd1", fontSize: 13, marginTop: 16 }}>
          {mode === "signup" ? (
            <>Already have an account? <Link href="/login" style={{ color: "#14b8a6" }}>Log in</Link></>
          ) : (
            <>No account yet? <Link href="/signup" style={{ color: "#14b8a6" }}>Sign up</Link></>
          )}
        </p>
      </div>
    </main>
  );
}
