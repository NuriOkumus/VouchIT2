"use client"
import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const FEATURES = [
  {
    icon: "◈", color: "var(--mint)",
    title: "Verified skills",
    desc: "Skills extracted from your CV, cross-checked against real GitHub repo activity. Not self-reported.",
  },
  {
    icon: "◎", color: "#00ADD8",
    title: "GitHub heatmap",
    desc: "Real contribution calendar, language breakdown, repo count and stars — pulled live from your account.",
  },
  {
    icon: "▸", color: "var(--amber)",
    title: "Career highlights",
    desc: "Top 3 concrete achievements extracted from your CV. Metrics included where available.",
  },
  {
    icon: "⬡", color: "var(--violet)",
    title: "Shareable profile",
    desc: "One link. Shows your title, location, years of experience, and a technical summary.",
  },
]

const STATS = [
  { value: "~15s", label: "profile ready" },
  { value: "100%", label: "GitHub verified" },
  { value: "0",    label: "forms to fill" },
]

export default function LandingPage() {
  const [hovered, setHovered] = useState<"github" | null>(null)
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") router.replace("/spaces")
  }, [status, router])

  if (status === "loading" || status === "authenticated") {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ width: 32, height: 32, borderRadius: 999, border: "2px solid var(--mint)", borderTopColor: "transparent", animation: "verifiedSpin .8s linear infinite" }} />
      </div>
    )
  }

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      background: "var(--bg)", overflowY: "auto",
    }}>
      {/* Ambient glows */}
      <div className="glow" style={{
        width: 700, height: 700, top: -260, left: -200,
        background: "radial-gradient(circle, var(--mint), transparent 60%)", opacity: 0.1,
      }} />
      <div className="glow" style={{
        width: 600, height: 600, top: 200, right: -200,
        background: "radial-gradient(circle, var(--violet), transparent 60%)", opacity: 0.08,
      }} />

      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px", zIndex: 2, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 4 L12 20 L21 4" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2" fill="var(--mint)" />
          </svg>
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>VouchIT</span>
        </div>
        <nav style={{ display: "flex", gap: 28, fontSize: 13, color: "var(--fg-3)", fontFamily: "var(--mono)" }}>
          <span style={{ cursor: "pointer" }}>manifesto</span>
          <span style={{ cursor: "pointer" }}>spaces</span>
          <span style={{ cursor: "pointer" }}>for recruiters</span>
        </nav>
        <button
          className="btn"
          onClick={() => signIn("github", { callbackUrl: "/spaces" })}
          style={{ padding: "8px 18px", fontSize: 13 }}>
          Sign in →
        </button>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, zIndex: 2 }}>
        <section style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", textAlign: "center",
          padding: "80px 48px 64px", maxWidth: 900, margin: "0 auto",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24,
            padding: "5px 14px", borderRadius: 999,
            background: "rgba(124,255,178,0.08)", border: "1px solid rgba(124,255,178,0.2)",
            fontSize: 12, fontFamily: "var(--mono)", color: "var(--mint)",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--mint)" }} />
            Evidence-based · GitHub verified
          </div>

          <h1 style={{
            fontSize: "clamp(52px, 7vw, 88px)",
            fontWeight: 600, lineHeight: 0.96, margin: "0 0 28px",
            letterSpacing: "-0.04em",
          }}>
            Let your code speak.<br />
            <span style={{
              background: "linear-gradient(90deg, var(--mint) 0%, var(--violet) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Not you.</span>
          </h1>

          <p style={{ fontSize: 17, color: "var(--fg-2)", maxWidth: 520, lineHeight: 1.6, margin: "0 0 44px" }}>
            Drop your CV, link your GitHub. We verify your skills against real commits
            and build a profile that actually proves what you can do.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              className="btn"
              onMouseEnter={() => setHovered("github")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => signIn("github", { callbackUrl: "/spaces" })}
              style={{
                padding: "16px 32px", fontSize: 15, minWidth: 230,
                background: hovered === "github"
                  ? "linear-gradient(180deg, #1C1C22, #0F0F12)"
                  : "linear-gradient(180deg, #16161B, #0F0F12)",
                borderColor: hovered === "github" ? "rgba(124,255,178,0.4)" : "var(--line-2)",
                boxShadow: hovered === "github" ? "0 8px 32px -8px rgba(124,255,178,0.2)" : "none",
                display: "flex", alignItems: "center", gap: 10,
              }}>
              <GithubGlyph />
              Continue with GitHub
              <span style={{
                fontFamily: "var(--mono)", fontSize: 10,
                padding: "2px 6px", borderRadius: 4,
                background: "rgba(124,255,178,0.12)", color: "var(--mint)",
              }}>recommended</span>
            </button>
            <div style={{
              padding: "16px 32px", fontSize: 15, minWidth: 200,
              background: "var(--bg-1)", border: "1px solid var(--line)",
              borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
              opacity: 0.5, cursor: "not-allowed",
            }}>
              <GoogleGlyph />
              <span style={{ color: "var(--fg-3)" }}>Continue with Google</span>
              <span style={{
                fontFamily: "var(--mono)", fontSize: 10,
                padding: "2px 6px", borderRadius: 4,
                background: "rgba(167,139,250,0.1)", color: "var(--violet)",
              }}>soon</span>
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 12, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>
            No forms. No manual input. Profile ready in ~15 seconds.
          </div>
        </section>

        {/* Stats row */}
        <section style={{
          display: "flex", justifyContent: "center", gap: 0,
          borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
          background: "var(--bg-1)",
        }}>
          {STATS.map(({ value, label }, i) => (
            <div key={label} style={{
              flex: 1, maxWidth: 200, padding: "28px 0", textAlign: "center",
              borderRight: i < STATS.length - 1 ? "1px solid var(--line)" : "none",
            }}>
              <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--fg)" }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 4, fontFamily: "var(--mono)" }}>{label}</div>
            </div>
          ))}
        </section>

        {/* Features grid */}
        <section style={{ padding: "72px 48px", maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 600, margin: "0 0 12px", letterSpacing: "-0.025em" }}>
              Everything in one profile
            </h2>
            <p style={{ fontSize: 15, color: "var(--fg-3)", margin: 0 }}>
              Built automatically. No editing required.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {FEATURES.map(({ icon, color, title, desc }) => (
              <div key={title} style={{
                padding: "24px 26px", borderRadius: 16,
                background: "var(--bg-1)", border: "1px solid var(--line)",
              }}>
                <div style={{ fontSize: 22, color, marginBottom: 14 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: "var(--fg-3)", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{
          padding: "64px 48px", maxWidth: 960, margin: "0 auto",
          borderTop: "1px solid var(--line)",
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, margin: "0 0 48px", letterSpacing: "-0.025em", textAlign: "center" }}>
            How it works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {[
              { step: "01", title: "Sign in",      desc: "GitHub or Google — takes 10 seconds."       },
              { step: "02", title: "Drop your CV", desc: "PDF or DOCX, any format."                  },
              { step: "03", title: "We analyze",   desc: "AI reads your CV, GitHub verifies it."     },
              { step: "04", title: "Join the feed", desc: "Discover builders. Get discovered."        },
            ].map(({ step, title, desc }, i) => (
              <div key={step} style={{ position: "relative", padding: "20px 20px 20px 0" }}>
                {i < 3 && (
                  <div style={{
                    position: "absolute", top: 26, right: -4, left: "calc(100% - 8px)",
                    height: 1, background: "var(--line)", zIndex: 0,
                  }} />
                )}
                <div style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 999, marginBottom: 14,
                  background: "var(--bg-2)", border: "1px solid var(--line)",
                  fontFamily: "var(--mono)", fontSize: 11, color: "var(--mint)",
                  position: "relative", zIndex: 1,
                }}>{step}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{
          padding: "72px 48px", textAlign: "center",
          borderTop: "1px solid var(--line)",
          background: "linear-gradient(180deg, transparent, rgba(124,255,178,0.03))",
        }}>
          <h2 style={{ fontSize: 36, fontWeight: 600, margin: "0 0 14px", letterSpacing: "-0.025em" }}>
            Ready to prove your skills?
          </h2>
          <p style={{ fontSize: 15, color: "var(--fg-3)", margin: "0 0 36px" }}>
            Free. No credit card. Profile live in seconds.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => signIn("github", { callbackUrl: "/spaces" })}
            style={{ padding: "16px 40px", fontSize: 15 }}>
            Build your profile →
          </button>
        </section>
      </main>

      <footer style={{
        padding: "20px 48px", fontSize: 12, color: "var(--fg-4)",
        display: "flex", justifyContent: "space-between",
        fontFamily: "var(--mono)", borderTop: "1px solid var(--line)",
        flexShrink: 0, zIndex: 2,
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
