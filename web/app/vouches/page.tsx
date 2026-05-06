"use client"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function VouchesPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const profileHref = typeof window !== "undefined"
    ? `/p/${localStorage.getItem("lastProfileId") ?? "demo"}`
    : "/p/demo"

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: "1px solid var(--line)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 4 L12 20 L21 4" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2" fill="var(--mint)" />
            </svg>
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>VouchIT</span>
          </div>
          <nav style={{ display: "flex", gap: 22, fontSize: 13, color: "var(--fg-3)", fontFamily: "var(--mono)" }}>
            <Link href={profileHref}>profile</Link>
            <Link href="/spaces">spaces</Link>
            <span style={{ color: "var(--fg)" }}>vouches</span>
            <Link href="/settings">settings</Link>
          </nav>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 999, overflow: "hidden", flexShrink: 0,
          background: "linear-gradient(135deg, var(--mint), var(--violet))",
        }}>
          {session?.user?.image && (
            <img src={session.user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
          )}
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div className="glow" style={{
          width: 600, height: 600, top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, var(--violet), transparent 65%)",
          opacity: 0.05,
        }} />

        <div style={{ textAlign: "center", maxWidth: 400, padding: "0 32px", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 28,
            padding: "5px 14px", borderRadius: 999,
            background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)",
            fontSize: 11, fontFamily: "var(--mono)", color: "var(--violet)",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--violet)" }} />
            in development
          </div>

          <h2 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em" }}>
            Vouches
          </h2>
          <p style={{ margin: "0 0 32px", fontSize: 14, color: "var(--fg-3)", lineHeight: 1.65 }}>
            Colleagues and collaborators will be able to vouch for your skills directly from your profile.
            Vouches will show up here with context and evidence.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
            {[
              { icon: "◈", label: "Skill-level vouches from real engineers" },
              { icon: "▸", label: "Project-based endorsements with context" },
              { icon: "⬡", label: "Vouch requests you can send and track" },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "11px 16px",
                borderRadius: 10, background: "var(--bg-1)", border: "1px solid var(--line)",
                fontSize: 13, color: "var(--fg-3)", textAlign: "left",
              }}>
                <span style={{ color: "var(--violet)", flexShrink: 0 }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>

          <button className="btn" onClick={() => router.push("/spaces")} style={{ padding: "10px 24px", fontSize: 13 }}>
            ← back to spaces
          </button>
        </div>
      </div>
    </div>
  )
}
