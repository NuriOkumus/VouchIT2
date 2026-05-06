"use client"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SettingsPage() {
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
            <Link href="/vouches">vouches</Link>
            <span style={{ color: "var(--fg)" }}>settings</span>
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

      <div className="scroll" style={{ flex: 1 }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Account */}
          <div>
            <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Account</div>
            <div style={{ padding: 20, borderRadius: 14, background: "var(--bg-1)", border: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 999, overflow: "hidden", flexShrink: 0,
                background: "linear-gradient(135deg, var(--mint), var(--violet))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 600, color: "#0A0A0B",
              }}>
                {session?.user?.image
                  ? <img src={session.user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                  : session?.user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{session?.user?.name ?? "—"}</div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--mono)", marginTop: 2 }}>{session?.user?.email ?? "—"}</div>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <div>
            <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Session</div>
            <div style={{ padding: 20, borderRadius: 14, background: "var(--bg-1)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Sign out</div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>End your current session on this device.</div>
              </div>
              <button
                className="btn"
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{ padding: "8px 18px", fontSize: 13, flexShrink: 0 }}
              >
                Sign out →
              </button>
            </div>
          </div>

          {/* Back */}
          <div style={{ paddingTop: 8 }}>
            <button className="btn" onClick={() => router.push("/spaces")} style={{ padding: "8px 16px", fontSize: 13 }}>
              ← spaces
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
