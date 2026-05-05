"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const SPACES = [
  { id: "backend-tr",  name: "Backend",          count: 1284, dot: "var(--mint)"   },
  { id: "ml-istanbul", name: "Machine Learning",  count: 612,  dot: "var(--violet)" },
  { id: "go-guild",    name: "Go Guild",          count: 487,  dot: "#00ADD8"       },
  { id: "frontend-tr", name: "Frontend",          count: 943,  dot: "var(--amber)"  },
  { id: "devops-tr",   name: "DevOps & SRE",      count: 358,  dot: "var(--rose)"   },
  { id: "open-roles",  name: "Open Roles",        count: 96,   dot: "var(--fg-2)"   },
]

const PEOPLE = [
  {
    initials: "MK", name: "Mert Kaya", role: "Staff Engineer", loc: "Ankara", verified: true,
    skills: ["Go", "Kafka", "gRPC", "Postgres", "K8s"], commits: "5.8K", years: 9,
    bio: "Distributed systems @ Trendyol. Built the order routing layer serving 3M daily orders.",
    langs: [{ name: "Go", pct: 62, color: "#00ADD8" }, { name: "Python", pct: 24, color: "#3572A5" }, { name: "Shell", pct: 14, color: "#89E051" }],
    activity: "pushed to trendyol/order-router · 2h ago",
  },
  {
    initials: "EY", name: "Elif Yıldız", role: "Senior Backend Engineer", loc: "Izmir", verified: true,
    skills: ["Python", "Django", "AWS", "Redis", "Celery"], commits: "3.4K", years: 6,
    bio: "ML infra + backend @ Insider. Reduced model serving p99 from 340ms to 80ms.",
    langs: [{ name: "Python", pct: 71, color: "#3572A5" }, { name: "TypeScript", pct: 18, color: "#3178C6" }, { name: "Shell", pct: 11, color: "#89E051" }],
    activity: "opened PR insider/ml-serving: cache warm-up · 5h ago",
  },
  {
    initials: "BT", name: "Berk Toprak", role: "Backend Engineer", loc: "Remote", verified: true,
    skills: ["Rust", "Go", "Redis", "WASM", "Tokio"], commits: "2.1K", years: 4,
    bio: "OSS contributor, building high-perf networking tools in Rust. 2× Rustacean of the month.",
    langs: [{ name: "Rust", pct: 58, color: "#DEA584" }, { name: "Go", pct: 31, color: "#00ADD8" }, { name: "C++", pct: 11, color: "#F34B7D" }],
    activity: "released berk/netblaze v0.9.0 · 1d ago",
  },
  {
    initials: "ZK", name: "Zeynep Koç", role: "Senior SRE", loc: "Istanbul", verified: true,
    skills: ["K8s", "Terraform", "Go", "Prometheus", "ArgoCD"], commits: "2.6K", years: 7,
    bio: "SRE @ Getir. Took on-call incident rate from 18/mo to 3/mo through runbook automation.",
    langs: [{ name: "Go", pct: 44, color: "#00ADD8" }, { name: "Python", pct: 31, color: "#3572A5" }, { name: "Shell", pct: 25, color: "#89E051" }],
    activity: "merged getir/platform: bump argo to 2.11 · 3h ago",
  },
  {
    initials: "OS", name: "Onur Şahin", role: "Principal Engineer", loc: "Berlin", verified: true,
    skills: ["Go", "Postgres", "Kafka", "Protobuf", "ClickHouse"], commits: "9.4K", years: 12,
    bio: "Previously @ Delivery Hero. Author of go-schema-registry (1.2K ★). Speaker at GopherCon EU.",
    langs: [{ name: "Go", pct: 79, color: "#00ADD8" }, { name: "Python", pct: 13, color: "#3572A5" }, { name: "TypeScript", pct: 8, color: "#3178C6" }],
    activity: "starred onursh/go-schema-registry · just now",
  },
  {
    initials: "DA", name: "Deniz Aksoy", role: "Tech Lead", loc: "Istanbul", verified: false,
    skills: ["Java", "Spring Boot", "K8s", "Kafka", "Oracle"], commits: "—", years: 8,
    bio: "Tech lead @ Yapı Kredi. Leading migration of core banking services to microservices.",
    langs: [],
    activity: "github not connected",
  },
  {
    initials: "CU", name: "Can Uçar", role: "Backend Engineer", loc: "Istanbul", verified: true,
    skills: ["TypeScript", "Node", "GraphQL", "Postgres", "Redis"], commits: "1.9K", years: 3,
    bio: "Full-stack leaning backend @ Peak Games. Shipped real-time leaderboard for 5M+ users.",
    langs: [{ name: "TypeScript", pct: 55, color: "#3178C6" }, { name: "Go", pct: 27, color: "#00ADD8" }, { name: "Python", pct: 18, color: "#3572A5" }],
    activity: "pushed to peak/leaderboard-v2 · 6h ago",
  },
  {
    initials: "SY", name: "Selin Yıldırım", role: "Backend Engineer", loc: "Remote", verified: false,
    skills: ["Node", "TS", "MongoDB", "RabbitMQ", "Docker"], commits: "—", years: 2,
    bio: "Building e-commerce backend @ Hepsiburada. Focused on checkout reliability.",
    langs: [],
    activity: "github not connected",
  },
]

export default function SpacesPage() {
  const router = useRouter()
  const [activeSpace, setActiveSpace] = useState("backend-tr")
  const [hovered, setHovered] = useState<number | null>(null)
  const [profileHref, setProfileHref] = useState("/p/demo")

  useEffect(() => {
    const saved = localStorage.getItem("lastProfileId")
    if (saved) setProfileHref(`/p/${saved}`)
  }, [])

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
            <span style={{ color: "var(--fg)" }}>spaces</span>
            <span style={{ cursor: "pointer" }}>vouches</span>
            <span style={{ cursor: "pointer" }}>settings</span>
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            width: 280, padding: "8px 12px", borderRadius: 10,
            background: "var(--bg-2)", border: "1px solid var(--line)",
            fontSize: 13, color: "var(--fg-3)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <span>Search skills, people, or repos…</span>
            <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 11, padding: "1px 6px", borderRadius: 4, background: "var(--bg-3)", color: "var(--fg-4)" }}>⌘K</span>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: 999, background: "linear-gradient(135deg, var(--mint), var(--violet))" }} />
        </div>
      </header>

      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "240px 1fr 320px", minHeight: 0 }}>
        {/* Left rail */}
        <aside style={{ borderRight: "1px solid var(--line)", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px 8px" }}>
            Spaces
          </div>
          {SPACES.map((s) => (
            <button key={s.id} onClick={() => setActiveSpace(s.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 8,
              background: activeSpace === s.id ? "var(--bg-2)" : "transparent",
              border: "1px solid transparent",
              cursor: "pointer", textAlign: "left",
              color: activeSpace === s.id ? "var(--fg)" : "var(--fg-2)",
              fontSize: 13, width: "100%",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: s.dot, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{s.name}</span>
              <span style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>{s.count}</span>
            </button>
          ))}
          <div style={{ marginTop: 12, borderTop: "1px solid var(--line)", paddingTop: 14, paddingLeft: 10, paddingRight: 10 }}>
            <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>For you</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "var(--fg-3)" }}>
              {[["Saved profiles", "4"], ["Pending vouches", "2"]].map(([label, count]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: "var(--bg-3)" }} />
                  {label}
                  <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-4)" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center feed */}
        <div className="scroll" style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>
                Backend
                <span style={{ fontSize: 13, color: "var(--fg-3)", fontWeight: 400, marginLeft: 10, fontFamily: "var(--mono)" }}>1,284 builders</span>
              </h2>
              <div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>Evidence-based community for backend engineers.</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {[["Verified only", true], ["Senior+", false], ["Available", false]].map(([label, active]) => (
                <span key={String(label)} style={{
                  padding: "5px 12px", borderRadius: 999, cursor: "pointer",
                  background: active ? "rgba(124,255,178,0.1)" : "var(--bg-2)",
                  border: `1px solid ${active ? "rgba(124,255,178,0.3)" : "var(--line)"}`,
                  color: active ? "var(--mint)" : "var(--fg-2)",
                  fontSize: 12, fontFamily: "var(--mono)", whiteSpace: "nowrap",
                }}>{active ? `✓ ${label}` : String(label)}</span>
              ))}
              <span style={{ marginLeft: 8, fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--mono)" }}>
                sort: <span style={{ color: "var(--fg)" }}>activity ↓</span>
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {PEOPLE.map((p, i) => (
              <div
                key={i}
                onClick={() => router.push("/p/demo")}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={p.verified ? "verified-card" : ""}
                style={{
                  position: "relative", padding: 16, borderRadius: 14,
                  background: hovered === i ? "var(--bg-2)" : "var(--bg-1)",
                  border: `1px solid ${hovered === i ? "var(--line-2)" : "var(--line)"}`,
                  transition: "all .15s ease", cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 999, flexShrink: 0,
                    background: p.verified
                      ? "linear-gradient(135deg, var(--mint), var(--violet))"
                      : "linear-gradient(135deg, var(--bg-3), var(--bg-2))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 600,
                    color: p.verified ? "#0A0A0B" : "var(--fg-2)",
                    border: "1px solid var(--line)",
                  }}>{p.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</span>
                      {p.verified && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--mint)">
                          <path d="M12 2l2.4 2 3.1-.4 1 3 2.5 2-1.5 2.7L20 14l-1.5 2.7L20 19.4l-3 .4-2 2.6L12 21l-3 1.4-2-2.6-3-.4 1.5-2.7L4 14l1.5-2.7L4 8.6l2.5-2 1-3 3.1.4z" />
                          <path d="M9 12l2 2 4-4" stroke="#0A0A0B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      <span style={{ marginLeft: "auto", fontSize: 10, fontFamily: "var(--mono)", color: "var(--fg-4)", padding: "1px 6px", borderRadius: 4, background: "var(--bg-3)" }}>
                        {p.years}y exp
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{p.role} · {p.loc}</div>
                    <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5 }}>{p.bio}</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 12 }}>
                  {p.skills.map((s) => (
                    <span key={s} style={{
                      fontSize: 10, padding: "2px 7px", borderRadius: 999,
                      background: "var(--bg-2)", border: "1px solid var(--line)",
                      color: "var(--fg-2)", fontFamily: "var(--mono)",
                    }}>{s}</span>
                  ))}
                </div>

                {p.langs.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", height: 4, borderRadius: 2, overflow: "hidden" }}>
                      {p.langs.map((l) => (
                        <div key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 5, fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--mono)" }}>
                      {p.langs.map((l) => (
                        <span key={l.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: 1, background: l.color }} />
                          {l.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{
                  marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--mono)",
                }}>
                  <span style={{ color: p.verified ? "var(--fg-4)" : "var(--fg-4)", opacity: p.verified ? 1 : 0.6 }}>
                    {p.activity}
                  </span>
                  <span style={{ color: hovered === i ? "var(--fg)" : "var(--fg-3)", transition: "color .15s", flexShrink: 0, marginLeft: 8 }}>
                    view →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right rail */}
        <aside style={{
          borderLeft: "1px solid var(--line)", padding: "24px 20px",
          display: "flex", flexDirection: "column", gap: 22,
          background: "var(--bg-1)", overflow: "auto",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Trending skills
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Go",         delta: "+18%", pct: 92 },
                { label: "Rust",       delta: "+34%", pct: 68 },
                { label: "Kubernetes", delta: "+12%", pct: 84 },
                { label: "ML Ops",     delta: "+47%", pct: 56 },
                { label: "PostgreSQL", delta: "+8%",  pct: 88 },
              ].map(({ label, delta, pct }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                    <span style={{ fontSize: 13 }}>{label}</span>
                    <span style={{ fontSize: 11, color: "var(--mint)", fontFamily: "var(--mono)" }}>{delta}</span>
                  </div>
                  <div className="skill-bar" style={{ height: 3 }}><div style={{ width: `${pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Open roles · matched
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { company: "Trendyol", role: "Senior Backend Eng",  match: 94 },
                { company: "Getir",    role: "Staff Engineer",       match: 82 },
                { company: "Iyzico",   role: "Tech Lead, Payments",  match: 76 },
              ].map(({ company, role, match }) => (
                <div key={company} style={{ padding: 12, borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{role}</span>
                    <span style={{
                      fontSize: 11, fontFamily: "var(--mono)",
                      color: match >= 90 ? "var(--mint)" : match >= 75 ? "var(--amber)" : "var(--fg-3)",
                    }}>{match}%</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{company}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Recent activity
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { who: "Onur Ş.",  action: "released go-schema-registry v2.1",   time: "2m"  },
                { who: "Mert K.",  action: "merged order-router hotfix",           time: "1h"  },
                { who: "Zeynep K.", action: "deployed platform/argo bump",         time: "3h"  },
                { who: "Elif Y.",  action: "opened PR: ml-serving cache warm-up",  time: "5h"  },
              ].map(({ who, action, time }) => (
                <div key={who} style={{ display: "flex", gap: 8, fontSize: 12 }}>
                  <span style={{ color: "var(--mint)", fontFamily: "var(--mono)", flexShrink: 0 }}>{who}</span>
                  <span style={{ color: "var(--fg-3)", flex: 1 }}>{action}</span>
                  <span style={{ color: "var(--fg-4)", fontFamily: "var(--mono)", flexShrink: 0 }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            padding: 14, borderRadius: 12,
            background: "linear-gradient(135deg, rgba(124,255,178,0.08), rgba(167,139,250,0.06))",
            border: "1px solid rgba(124,255,178,0.18)",
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Get verified, stand out</div>
            <div style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.5 }}>
              Verified profiles get 3.4× more views in the feed.
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
