"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { getProfile, type Profile } from "@/lib/api"
import { MOCK_PROFILES } from "@/lib/mock-profiles"


function Heatmap({ seed, data }: { seed: string; data?: number[] }) {
  const colors = ["var(--bg-3)", "rgba(124,255,178,0.2)", "rgba(124,255,178,0.45)", "rgba(124,255,178,0.7)", "rgba(124,255,178,0.95)"]

  let cells: number[]
  if (data && data.length > 0) {
    const max = Math.max(...data, 1)
    // Pad to 182 if shorter
    const padded = Array(Math.max(0, 182 - data.length)).fill(0).concat(data)
    cells = padded.slice(-182).map((n) => Math.min(4, Math.ceil((n / max) * 4)))
  } else {
    const hash = Math.abs(seed.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0))
    cells = Array.from({ length: 182 }, (_, i) => {
      const v = ((hash + i * 9301 + 49297) % 233280) / 233280
      return Math.min(4, Math.max(0, Math.floor(v * (1 + Math.sin((i + hash) / 8) * 0.5) * 5)))
    })
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(26, 1fr)", gridAutoRows: 12, gap: 3 }}>
      {cells.map((v, i) => (
        <div key={i} style={{ width: "100%", aspectRatio: "1", borderRadius: 2, background: colors[v] }} />
      ))}
    </div>
  )
}

function Section({ title, subtitle, children, mono }: { title: string; subtitle?: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{
          margin: 0, fontSize: 13, fontWeight: 500,
          letterSpacing: mono ? 0 : "0.06em", textTransform: mono ? "none" : "uppercase",
          color: "var(--fg-2)", fontFamily: mono ? "var(--mono)" : "var(--sans)",
        }}>{title}</h3>
        {subtitle && <span style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>{subtitle}</span>}
      </div>
      <div style={{ padding: 18, borderRadius: 14, background: "var(--bg-1)", border: "1px solid var(--line)" }}>
        {children}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id === "demo") return
    const mock = MOCK_PROFILES[id]
    if (mock) { setProfile(mock); return }
    getProfile(id).then(setProfile).catch(() => setError("Profil yüklenemedi"))
  }, [id])

  if (id === "demo") {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", gap: 0 }}>
        <div className="glow" style={{ width: 500, height: 500, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, var(--mint), transparent 65%)", opacity: 0.06 }} />
        <div style={{ textAlign: "center", maxWidth: 420, padding: "0 32px", position: "relative" }}>
          <div style={{ fontSize: 36, color: "var(--mint)", marginBottom: 24 }}>◈</div>
          <h2 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 600, letterSpacing: "-0.025em" }}>
            No profile yet
          </h2>
          <p style={{ margin: "0 0 32px", fontSize: 15, color: "var(--fg-3)", lineHeight: 1.6 }}>
            Drop your CV and link your GitHub.<br />
            We&apos;ll build your verified profile in ~15 seconds.
          </p>
          <button className="btn btn-primary" onClick={() => router.push("/upload")} style={{ padding: "14px 32px", fontSize: 15 }}>
            Build your profile →
          </button>
          <div style={{ marginTop: 16, fontSize: 12, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>
            No forms. No manual input.
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <p style={{ color: "var(--rose)" }}>{error}</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ width: 32, height: 32, borderRadius: 999, border: "2px solid var(--mint)", borderTopColor: "transparent", animation: "verifiedSpin .8s linear infinite" }} />
      </div>
    )
  }

  const meta = profile.metadata ?? {}
  const verified = profile.skills.some((s) => s.verified)
  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  const levelCounts = { senior: 0, mid: 0, junior: 0 }
  for (const s of profile.skills) levelCounts[s.level]++
  const topLevel = levelCounts.senior > 0 ? "Senior" : levelCounts.mid > 0 ? "Mid" : "Junior"

  const langItems = meta.githubLanguages ?? []

  const stats = [
    { label: "Experience", value: meta.yearsExperience ? `${meta.yearsExperience} yrs` : `${profile.skills.length} skills` },
    { label: "Level",      value: topLevel, hint: verified ? "verified" : "from CV" },
    { label: "Location",   value: meta.location ?? "—" },
  ]

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: "1px solid var(--line)", background: "var(--bg)", flexShrink: 0,
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
            <span style={{ color: "var(--fg)" }}>profile</span>
            <Link href="/spaces">spaces</Link>
            <Link href="/vouches">vouches</Link>
            <Link href="/settings">settings</Link>
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn" onClick={() => router.push("/spaces")} style={{ padding: "8px 14px", fontSize: 13 }}>
            ← spaces
          </button>
          <div style={{
            width: 32, height: 32, borderRadius: 999, overflow: "hidden", flexShrink: 0,
            background: "linear-gradient(135deg, var(--mint), var(--violet))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, color: "#0A0A0B",
          }}>
            {session?.user?.image
              ? <img src={session.user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
              : initials}
          </div>
        </div>
      </header>

      <div className="scroll" style={{ flex: 1, position: "relative" }}>
        {/* Cover band */}
        <div style={{
          height: 140, background: "linear-gradient(135deg, #0F1A14 0%, #0A0A0B 60%)",
          borderBottom: "1px solid var(--line)", position: "relative", overflow: "hidden",
        }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(124,255,178,0.08)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Identity row */}
        <div style={{ padding: "20px 32px 24px", display: "flex", alignItems: "center", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: -60 }}>
            <div style={{ position: "relative" }}>
              {verified && (
                <svg style={{ position: "absolute", inset: -8, animation: "verifiedSpin 12s linear infinite" }} width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="56" fill="none" stroke="url(#avRing)" strokeWidth="1.5" strokeDasharray="3 5" />
                  <defs>
                    <linearGradient id="avRing">
                      <stop offset="0%" stopColor="#7CFFB2" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
              <div style={{
                width: 104, height: 104, borderRadius: 999,
                background: "linear-gradient(135deg, #2A4A38, #1A2D5A)",
                border: "3px solid var(--bg)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36, fontWeight: 600, color: "white",
                boxShadow: verified ? "0 0 24px rgba(124,255,178,0.25)" : "none",
                overflow: "hidden", position: "relative",
              }}>
                {meta.githubAvatar
                  ? <img src={meta.githubAvatar} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                  : initials}
              </div>
            </div>
            <div style={{ marginTop: 50 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>{profile.name}</h1>
                {verified && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "3px 9px", borderRadius: 999,
                    background: "rgba(124,255,178,0.1)", border: "1px solid rgba(124,255,178,0.3)",
                    color: "var(--mint)", fontSize: 11, fontFamily: "var(--mono)", fontWeight: 500,
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.4 2 3.1-.4 1 3 2.5 2-1.5 2.7L20 14l-1.5 2.7L20 19.4l-3 .4-2 2.6L12 21l-3 1.4-2-2.6-3-.4 1.5-2.7L4 14l1.5-2.7L4 8.6l2.5-2 1-3 3.1.4z" />
                      <path d="M9 12l2 2 4-4" stroke="#0A0A0B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    VERIFIED
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 6, color: "var(--fg-2)", fontSize: 14, fontFamily: "var(--mono)", flexWrap: "wrap" }}>
                {meta.title && <span>{meta.title}</span>}
                {meta.title && meta.location && <span style={{ color: "var(--fg-4)" }}>·</span>}
                {meta.location && <span>{meta.location}</span>}
                {(meta.title || meta.location) && meta.githubUsername && <span style={{ color: "var(--fg-4)" }}>·</span>}
                {meta.githubUsername && (
                  <a href={`https://github.com/${meta.githubUsername}`} target="_blank" rel="noreferrer"
                    style={{ color: "var(--fg-3)", textDecoration: "none" }}>
                    @{meta.githubUsername}
                  </a>
                )}
                {(meta.title || meta.location || meta.githubUsername) && meta.githubRepos && <span style={{ color: "var(--fg-4)" }}>·</span>}
                {meta.githubRepos && <span>{meta.githubRepos} repos</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, padding: "28px 32px" }}>
          {/* Left col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Section title="$ whoami" mono>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--fg)" }}>
                {profile.developer_summary}
              </p>
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {stats.map(({ label, value, hint }) => (
                  <div key={label} style={{ padding: 12, borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--line)" }}>
                    <div style={{ fontSize: 11, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                    <div style={{ fontSize: 17, fontWeight: 600, marginTop: 4, letterSpacing: "-0.01em" }}>{value}</div>
                    {hint && <div style={{ fontSize: 10, color: "var(--fg-4)", fontFamily: "var(--mono)", marginTop: 2 }}>{hint}</div>}
                  </div>
                ))}
              </div>
            </Section>

            {meta.highlights && meta.highlights.length > 0 && (
              <Section title="Highlights" subtitle="from CV">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {meta.highlights.map((h, i) => (
                    <div key={i} style={{ display: "flex", gap: 12 }}>
                      <span style={{ color: "var(--mint)", fontFamily: "var(--mono)", fontSize: 12, marginTop: 2, flexShrink: 0 }}>▸</span>
                      <span style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.5 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Skills" subtitle={verified ? "Evidence rings · live from GitHub" : "Extracted from CV"}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {profile.skills.map((skill) => {
                  const pct = { senior: 88, mid: 65, junior: 42 }[skill.level] ?? 50
                  return (
                    <div key={skill.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{skill.name}</span>
                          {skill.verified && (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 3,
                              padding: "1px 6px", borderRadius: 999,
                              background: "rgba(124,255,178,0.08)", border: "1px solid rgba(124,255,178,0.25)",
                              color: "var(--mint)", fontSize: 9, fontFamily: "var(--mono)",
                            }}>● evidence</span>
                          )}
                        </div>
                        <span style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--mono)", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ letterSpacing: "0.05em" }}>
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} style={{ color: i < Math.min(5, Math.ceil(skill.evidenceCount / 4)) ? "var(--mint)" : "var(--fg-4)" }}>◆</span>
                            ))}
                          </span>
                          <span style={{ color: "var(--fg-4)" }}>·</span>
                          {skill.level}
                        </span>
                      </div>
                      <div className="skill-bar"><div style={{ width: `${pct}%` }} /></div>
                    </div>
                  )
                })}
              </div>
            </Section>

          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Section title="Contributions" subtitle="last 12 months">
              <Heatmap seed={profile.id} data={meta.githubContributions} />
              <div style={{ marginTop: 14, display: "flex", gap: 16, fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--mono)" }}>
                {meta.githubRepos && <span><b style={{ color: "var(--fg)" }}>{meta.githubRepos}</b> repos</span>}
                {meta.githubStars && <span><b style={{ color: "var(--fg)" }}>{meta.githubStars}</b> stars</span>}
                <span><b style={{ color: "var(--fg)" }}>{profile.skills.filter(s => s.verified).length}</b> verified skills</span>
              </div>
            </Section>

            {langItems.length > 0 && (
              <Section title="Language mix" subtitle="from GitHub">
                <div>
                  <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
                    {langItems.map((it) => (
                      <div key={it.name} style={{ width: `${it.pct}%`, background: it.color }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontSize: 12 }}>
                    {langItems.map((it) => (
                      <div key={it.name} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--fg-2)" }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: it.color }} />
                        {it.name} <span style={{ color: "var(--fg-4)", fontFamily: "var(--mono)" }}>{it.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            <Section title="Skill breakdown" subtitle="evidence quality">
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {profile.skills.slice(0, 5).map((skill) => {
                  const pct = Math.min(99, 40 + skill.evidenceCount * 4 + (skill.verified ? 20 : 0))
                  return (
                    <div key={skill.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13 }}>{skill.name}</span>
                        <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--mono)" }}>{pct}%</span>
                      </div>
                      <div className="skill-bar"><div style={{ width: `${pct}%` }} /></div>
                    </div>
                  )
                })}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}
