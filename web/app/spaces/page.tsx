"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const SPACES = [
  { id: "backend-tr",  name: "Backend",         count: 1284, dot: "var(--mint)"   },
  { id: "ml-istanbul", name: "Machine Learning", count: 612,  dot: "var(--violet)" },
  { id: "go-guild",    name: "Go Guild",         count: 487,  dot: "#00ADD8"       },
  { id: "frontend-tr", name: "Frontend",         count: 943,  dot: "var(--amber)"  },
  { id: "devops-tr",   name: "DevOps & SRE",     count: 358,  dot: "var(--rose)"   },
  { id: "open-roles",  name: "Open Roles",       count: 96,   dot: "var(--fg-2)"   },
]

type FeedItem =
  | { type: "push";    who: Actor; repo: string; branch: string; commits: number; message: string; time: string }
  | { type: "pr";      who: Actor; repo: string; title: string; status: "open" | "merged"; time: string }
  | { type: "release"; who: Actor; repo: string; version: string; desc: string; stars: number; time: string }
  | { type: "verify";  who: Actor; skills: string[]; langs: Lang[]; years: number; time: string }
  | { type: "join";    who: Actor; bio: string; skills: string[]; years: number; time: string }
  | { type: "role";    company: string; role: string; skills: string[]; match: number; time: string }

type Actor = { initials: string; name: string; title: string; verified: boolean }
type Lang  = { name: string; pct: number; color: string }

const FEED: FeedItem[] = [
  {
    type: "verify",
    who: { initials: "OS", name: "Onur Şahin", title: "Principal Engineer · Berlin", verified: true },
    skills: ["Go", "Kafka", "Postgres", "Protobuf", "ClickHouse"],
    langs: [{ name: "Go", pct: 79, color: "#00ADD8" }, { name: "Python", pct: 13, color: "#3572A5" }, { name: "TypeScript", pct: 8, color: "#3178C6" }],
    years: 12, time: "2m ago",
  },
  {
    type: "release",
    who: { initials: "OS", name: "Onur Şahin", title: "Principal Engineer · Berlin", verified: true },
    repo: "onursh/go-schema-registry", version: "v2.1.0",
    desc: "Add Avro union type support, fix confluent compat headers, 40% faster serialization.",
    stars: 1284, time: "18m ago",
  },
  {
    type: "pr",
    who: { initials: "EY", name: "Elif Yıldız", title: "Senior Backend Engineer · Izmir", verified: true },
    repo: "insider/ml-serving", title: "feat: async cache warm-up on model load", status: "open", time: "1h ago",
  },
  {
    type: "push",
    who: { initials: "MK", name: "Mert Kaya", title: "Staff Engineer · Ankara", verified: true },
    repo: "trendyol/order-router", branch: "hotfix/duplicate-events",
    commits: 3, message: "fix: deduplicate order events on Kafka consumer restart", time: "2h ago",
  },
  {
    type: "join",
    who: { initials: "BT", name: "Berk Toprak", title: "Backend Engineer · Remote", verified: true },
    bio: "OSS contributor building high-perf networking tools in Rust. 2× Rustacean of the month.",
    skills: ["Rust", "Go", "Redis", "WASM", "Tokio"], years: 4, time: "3h ago",
  },
  {
    type: "role",
    company: "Trendyol", role: "Senior Backend Engineer — Payments",
    skills: ["Go", "Kafka", "Postgres", "gRPC"], match: 94, time: "4h ago",
  },
  {
    type: "pr",
    who: { initials: "ZK", name: "Zeynep Koç", title: "Senior SRE · Istanbul", verified: true },
    repo: "getir/platform", title: "chore: bump ArgoCD to 2.11, migrate app-of-apps", status: "merged", time: "5h ago",
  },
  {
    type: "push",
    who: { initials: "CU", name: "Can Uçar", title: "Backend Engineer · Istanbul", verified: true },
    repo: "peak/leaderboard-v2", branch: "feat/realtime-score-sync",
    commits: 7, message: "perf: replace polling with WebSocket pub-sub, cut latency 200ms→12ms", time: "6h ago",
  },
  {
    type: "verify",
    who: { initials: "EY", name: "Elif Yıldız", title: "Senior Backend Engineer · Izmir", verified: true },
    skills: ["Python", "Django", "AWS", "Redis", "Celery"],
    langs: [{ name: "Python", pct: 71, color: "#3572A5" }, { name: "TypeScript", pct: 18, color: "#3178C6" }, { name: "Shell", pct: 11, color: "#89E051" }],
    years: 6, time: "8h ago",
  },
]

function Avatar({ actor, size = 40 }: { actor: Actor; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, flexShrink: 0,
      background: actor.verified ? "linear-gradient(135deg,var(--mint),var(--violet))" : "linear-gradient(135deg,var(--bg-3),var(--bg-2))",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.3), fontWeight: 600,
      color: actor.verified ? "#0A0A0B" : "var(--fg-2)",
      border: "1px solid var(--line)",
    }}>{actor.initials}</div>
  )
}

function VerifiedBadge() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--mint)">
      <path d="M12 2l2.4 2 3.1-.4 1 3 2.5 2-1.5 2.7L20 14l-1.5 2.7L20 19.4l-3 .4-2 2.6L12 21l-3 1.4-2-2.6-3-.4 1.5-2.7L4 14l1.5-2.7L4 8.6l2.5-2 1-3 3.1.4z" />
      <path d="M9 12l2 2 4-4" stroke="#0A0A0B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SkillChips({ skills }: { skills: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {skills.map((s) => (
        <span key={s} style={{
          fontSize: 10, padding: "2px 8px", borderRadius: 999,
          background: "var(--bg-2)", border: "1px solid var(--line)",
          color: "var(--fg-2)", fontFamily: "var(--mono)",
        }}>{s}</span>
      ))}
    </div>
  )
}

function LangBar({ langs }: { langs: Lang[] }) {
  return (
    <div>
      <div style={{ display: "flex", height: 4, borderRadius: 2, overflow: "hidden" }}>
        {langs.map((l) => <div key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />)}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 5, fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--mono)" }}>
        {langs.map((l) => (
          <span key={l.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 1, background: l.color }} />
            {l.name} {l.pct}%
          </span>
        ))}
      </div>
    </div>
  )
}

function CardActions({ onView }: { onView: () => void }) {
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
      {[["◎ Save", false], ["◈ Vouch", false]].map(([label]) => (
        <button key={String(label)} style={{
          padding: "5px 12px", borderRadius: 8, fontSize: 11, fontFamily: "var(--mono)",
          background: "var(--bg-2)", border: "1px solid var(--line)", color: "var(--fg-3)", cursor: "pointer",
        }}>{String(label)}</button>
      ))}
      <button onClick={onView} style={{
        marginLeft: "auto", padding: "5px 14px", borderRadius: 8, fontSize: 11, fontFamily: "var(--mono)",
        background: "transparent", border: "1px solid var(--line)", color: "var(--fg-2)", cursor: "pointer",
      }}>view profile →</button>
    </div>
  )
}

function FeedCard({ item, onNavigate }: { item: FeedItem; onNavigate: () => void }) {
  const base: React.CSSProperties = {
    padding: 18, borderRadius: 14,
    background: "var(--bg-1)", border: "1px solid var(--line)",
  }

  if (item.type === "verify") return (
    <div className="verified-card" style={base}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Avatar actor={item.who} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{item.who.name}</span>
            <VerifiedBadge />
            <span style={{ fontSize: 12, color: "var(--fg-3)" }}>got verified</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>{item.time}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{item.who.title} · {item.years}y exp</div>
        </div>
      </div>
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        <SkillChips skills={item.skills} />
        {item.langs.length > 0 && <LangBar langs={item.langs} />}
      </div>
      <CardActions onView={onNavigate} />
    </div>
  )

  if (item.type === "release") return (
    <div style={base}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Avatar actor={item.who} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{item.who.name}</span>
            {item.who.verified && <VerifiedBadge />}
            <span style={{ fontSize: 12, color: "var(--fg-3)" }}>released</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>{item.time}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{item.who.title}</div>
        </div>
      </div>
      <div style={{
        marginTop: 14, padding: "12px 14px", borderRadius: 10,
        background: "var(--bg-2)", border: "1px solid var(--line)",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "var(--mono)", color: "var(--fg)" }}>{item.repo}</span>
          <span style={{
            fontSize: 11, fontFamily: "var(--mono)", padding: "2px 8px", borderRadius: 6,
            background: "rgba(124,255,178,0.08)", border: "1px solid rgba(124,255,178,0.2)", color: "var(--mint)",
          }}>{item.version}</span>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--fg-2)", lineHeight: 1.55 }}>{item.desc}</p>
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>★ {item.stars.toLocaleString()}</div>
      </div>
      <CardActions onView={onNavigate} />
    </div>
  )

  if (item.type === "pr") return (
    <div style={base}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Avatar actor={item.who} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{item.who.name}</span>
            {item.who.verified && <VerifiedBadge />}
            <span style={{ fontSize: 12, color: "var(--fg-3)" }}>{item.status === "merged" ? "merged a PR" : "opened a PR"}</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>{item.time}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{item.who.title}</div>
        </div>
      </div>
      <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{
          fontSize: 10, padding: "2px 8px", borderRadius: 6, fontFamily: "var(--mono)", flexShrink: 0,
          background: item.status === "merged" ? "rgba(167,139,250,0.1)" : "rgba(124,255,178,0.08)",
          border: `1px solid ${item.status === "merged" ? "rgba(167,139,250,0.25)" : "rgba(124,255,178,0.2)"}`,
          color: item.status === "merged" ? "var(--violet)" : "var(--mint)",
        }}>{item.status}</span>
        <span style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--mono)" }}>{item.repo}</span>
      </div>
      <div style={{
        marginTop: 8, padding: "10px 12px", borderRadius: 8,
        background: "var(--bg-2)", border: "1px solid var(--line)",
        fontSize: 13, color: "var(--fg)", fontFamily: "var(--mono)",
      }}>{item.title}</div>
      <CardActions onView={onNavigate} />
    </div>
  )

  if (item.type === "push") return (
    <div style={base}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Avatar actor={item.who} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{item.who.name}</span>
            {item.who.verified && <VerifiedBadge />}
            <span style={{ fontSize: 12, color: "var(--fg-3)" }}>pushed {item.commits} commit{item.commits > 1 ? "s" : ""}</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>{item.time}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{item.who.title}</div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", marginBottom: 6 }}>
          {item.repo} · {item.branch}
        </div>
        <div style={{
          padding: "10px 12px", borderRadius: 8,
          background: "var(--bg-2)", border: "1px solid var(--line)",
          fontSize: 12, color: "var(--fg-2)", fontFamily: "var(--mono)", lineHeight: 1.5,
        }}>
          <span style={{ color: "var(--fg-4)", marginRight: 8 }}>▸</span>{item.message}
        </div>
      </div>
      <CardActions onView={onNavigate} />
    </div>
  )

  if (item.type === "join") return (
    <div style={base}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Avatar actor={item.who} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{item.who.name}</span>
            {item.who.verified && <VerifiedBadge />}
            <span style={{ fontSize: 12, color: "var(--fg-3)" }}>joined the space</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>{item.time}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{item.who.title} · {item.years}y exp</div>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--fg-2)", lineHeight: 1.55 }}>{item.bio}</p>
        </div>
      </div>
      <div style={{ marginTop: 12 }}><SkillChips skills={item.skills} /></div>
      <CardActions onView={onNavigate} />
    </div>
  )

  if (item.type === "role") return (
    <div style={{
      ...base,
      background: "linear-gradient(135deg,rgba(124,255,178,0.04),rgba(167,139,250,0.03))",
      border: "1px solid rgba(124,255,178,0.14)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", marginBottom: 4 }}>open role · {item.time}</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{item.role}</div>
          <div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 2 }}>{item.company}</div>
        </div>
        <div style={{
          padding: "6px 12px", borderRadius: 8, flexShrink: 0,
          background: item.match >= 90 ? "rgba(124,255,178,0.1)" : "rgba(167,139,250,0.1)",
          border: `1px solid ${item.match >= 90 ? "rgba(124,255,178,0.25)" : "rgba(167,139,250,0.25)"}`,
          color: item.match >= 90 ? "var(--mint)" : "var(--violet)",
          fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600,
        }}>{item.match}% match</div>
      </div>
      <div style={{ marginTop: 12 }}><SkillChips skills={item.skills} /></div>
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
        <button style={{
          padding: "7px 16px", borderRadius: 8, fontSize: 12, fontFamily: "var(--mono)",
          background: "var(--mint)", border: "none", color: "#0A0A0B", cursor: "pointer", fontWeight: 600,
        }}>Apply with profile →</button>
      </div>
    </div>
  )

  return null
}

export default function SpacesPage() {
  const router = useRouter()
  const [activeSpace, setActiveSpace] = useState("backend-tr")
  const [profileHref, setProfileHref] = useState("/p/demo")
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem("lastProfileId")
    const avatar = localStorage.getItem("lastProfileAvatar")
    if (id) setProfileHref(`/p/${id}`)
    if (avatar) setProfileAvatar(avatar)
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
            width: 260, padding: "8px 12px", borderRadius: 10,
            background: "var(--bg-2)", border: "1px solid var(--line)",
            fontSize: 13, color: "var(--fg-3)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <span>Search people or skills…</span>
          </div>
          <Link href={profileHref} style={{
            display: "block", width: 32, height: 32, borderRadius: 999,
            overflow: "hidden", flexShrink: 0,
            background: "linear-gradient(135deg, var(--mint), var(--violet))",
          }}>
            {profileAvatar && <img src={profileAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />}
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "220px 1fr 300px", minHeight: 0 }}>

        {/* Left rail — spaces */}
        <aside style={{ borderRight: "1px solid var(--line)", padding: "20px 14px", display: "flex", flexDirection: "column", gap: 4, overflow: "auto" }}>
          <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 8px 10px" }}>Spaces</div>
          {SPACES.map((s) => (
            <button key={s.id} onClick={() => setActiveSpace(s.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8,
              background: activeSpace === s.id ? "var(--bg-2)" : "transparent",
              border: "1px solid transparent", cursor: "pointer", textAlign: "left",
              color: activeSpace === s.id ? "var(--fg)" : "var(--fg-2)", fontSize: 13, width: "100%",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: s.dot, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{s.name}</span>
              <span style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>{s.count}</span>
            </button>
          ))}
          <div style={{ marginTop: 14, borderTop: "1px solid var(--line)", paddingTop: 14, paddingLeft: 10, paddingRight: 10 }}>
            <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>For you</div>
            {[["Saved", "4"], ["Pending vouches", "2"]].map(([label, count]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--fg-3)", marginBottom: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: "var(--bg-3)" }} />
                {label}
                <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 11, color: "var(--fg-4)" }}>{count}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Center — feed */}
        <div className="scroll" style={{ padding: "24px 28px" }}>
          {/* Space header */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
                Backend
                <span style={{ fontSize: 12, color: "var(--fg-3)", fontWeight: 400, marginLeft: 10, fontFamily: "var(--mono)" }}>1,284 builders</span>
              </h2>
              <div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 3 }}>Evidence-based community for backend engineers.</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[["✓ Verified only", true], ["Senior+", false], ["Available", false]].map(([label, active]) => (
                <span key={String(label)} style={{
                  padding: "5px 10px", borderRadius: 999, cursor: "pointer", fontSize: 11, fontFamily: "var(--mono)",
                  background: active ? "rgba(124,255,178,0.1)" : "var(--bg-2)",
                  border: `1px solid ${active ? "rgba(124,255,178,0.3)" : "var(--line)"}`,
                  color: active ? "var(--mint)" : "var(--fg-2)", whiteSpace: "nowrap",
                }}>{String(label)}</span>
              ))}
            </div>
          </div>

          {/* Feed items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FEED.map((item, i) => (
              <FeedCard key={i} item={item} onNavigate={() => router.push("/p/demo")} />
            ))}
          </div>
        </div>

        {/* Right rail */}
        <aside style={{
          borderLeft: "1px solid var(--line)", padding: "24px 18px",
          display: "flex", flexDirection: "column", gap: 22,
          background: "var(--bg-1)", overflow: "auto",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Trending skills</div>
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
            <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Open roles · matched</div>
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

          <div style={{
            padding: 14, borderRadius: 12,
            background: "linear-gradient(135deg,rgba(124,255,178,0.08),rgba(167,139,250,0.06))",
            border: "1px solid rgba(124,255,178,0.18)",
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Get verified, stand out</div>
            <div style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.5 }}>Verified profiles get 3.4× more views in the feed.</div>
          </div>
        </aside>
      </main>
    </div>
  )
}
