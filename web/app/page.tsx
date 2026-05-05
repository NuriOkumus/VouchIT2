"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"

function Logo({ size = 22 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M3 4 L12 20 L21 4" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="12" cy="12" r="2" fill="var(--mint)" />
      </svg>
      <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>VouchIT</span>
    </div>
  )
}

export default function LandingPage() {
  const [hovered, setHovered] = useState<"google" | "github" | null>(null)

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      background: "var(--bg)",
      overflow: "hidden",
    }}>
      {/* Ambient glows */}
      <div className="glow" style={{
        width: 600, height: 600, top: -200, left: -200,
        background: "radial-gradient(circle, var(--mint), transparent 60%)",
        opacity: 0.12,
      }} />
      <div className="glow" style={{
        width: 700, height: 700, bottom: -300, right: -200,
        background: "radial-gradient(circle, var(--violet), transparent 60%)",
        opacity: 0.10,
      }} />

      {/* Top bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "24px 40px", zIndex: 2,
      }}>
        <Logo />
        <nav style={{ display: "flex", gap: 28, fontSize: 14, color: "var(--fg-2)", cursor: "pointer" }}>
          <span>Manifesto</span>
          <span>Spaces</span>
          <span>For Recruiters</span>
          <span style={{ color: "var(--fg)" }}>Sign in</span>
        </nav>
      </header>

      {/* Hero */}
      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 40px", textAlign: "center", zIndex: 2,
      }}>
        <h1 style={{
          fontSize: "clamp(56px, 7vw, 96px)",
          fontWeight: 600, lineHeight: 0.98, margin: 0,
          letterSpacing: "-0.04em",
          maxWidth: 980,
        }}>
          Let your code speak.<br />
          <span style={{
            background: "linear-gradient(90deg, var(--mint), var(--violet))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Not you.</span>
        </h1>

        <p style={{
          marginTop: 24, fontSize: 18, color: "var(--fg-2)",
          maxWidth: 580, lineHeight: 1.5,
        }}>
          Evidence-based developer profiles. Drop your CV, link your GitHub —
          we&apos;ll handle the rest. Verified skills, real GitHub activity,
          and a <span style={{ color: "var(--mint)" }}>shareable profile</span> that speaks for itself.
        </p>

        <div style={{ display: "flex", gap: 16, marginTop: 44, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            className="btn"
            onMouseEnter={() => setHovered("google")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => signIn("google", { callbackUrl: "/upload" })}
            style={{
              padding: "20px 32px", fontSize: 16, minWidth: 240,
              background: hovered === "google" ? "var(--bg-3)" : "var(--bg-2)",
            }}>
            <GoogleGlyph /> Continue with Google
          </button>
          <button
            className="btn"
            onMouseEnter={() => setHovered("github")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => signIn("github", { callbackUrl: "/upload" })}
            style={{
              padding: "20px 32px", fontSize: 16, minWidth: 240,
              background: hovered === "github"
                ? "linear-gradient(180deg, #1C1C22, #0F0F12)"
                : "linear-gradient(180deg, #16161B, #0F0F12)",
              borderColor: "var(--line-2)",
              boxShadow: hovered === "github"
                ? "0 8px 32px -8px rgba(124,255,178,0.25), inset 0 1px 0 rgba(255,255,255,0.04)"
                : "inset 0 1px 0 rgba(255,255,255,0.04)",
            }}>
            <GithubGlyph />
            Continue with GitHub
            <span style={{
              fontFamily: "var(--mono)", fontSize: 11,
              padding: "2px 6px", borderRadius: 4,
              background: "rgba(124,255,178,0.12)", color: "var(--mint)",
              marginLeft: 6,
            }}>verified</span>
          </button>
        </div>

        <div style={{ marginTop: 24, fontSize: 13, color: "var(--fg-3)" }}>
          Frictionless. Zero forms. Profile ready in ~12 seconds.
        </div>
      </main>

      <footer style={{
        padding: "20px 40px", fontSize: 12, color: "var(--fg-4)",
        display: "flex", justifyContent: "space-between", zIndex: 2,
        fontFamily: "var(--mono)",
      }}>
        <span>© 2026 VouchIT</span>
        <span>privacy · manifesto · github</span>
      </footer>
    </div>
  )
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  )
}

function GithubGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.4-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  )
}
