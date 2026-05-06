"use client"
import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const SPACES = [
  { id: "backend-tr",  name: "Backend",         count: 1284, dot: "var(--mint)",   desc: "Evidence-based community for backend engineers."         },
  { id: "ml-istanbul", name: "Machine Learning", count: 612,  dot: "var(--violet)", desc: "ML practitioners, researchers and infra engineers."        },
  { id: "go-guild",    name: "Go Guild",         count: 487,  dot: "#00ADD8",        desc: "Gophers building production systems in Go."               },
  { id: "frontend-tr", name: "Frontend",         count: 943,  dot: "var(--amber)",  desc: "UI engineers focused on performance and craft."            },
  { id: "devops-tr",   name: "DevOps & SRE",     count: 358,  dot: "var(--rose)",   desc: "Platform, infra, and reliability engineers."              },
  { id: "open-roles",  name: "Open Roles",       count: 96,   dot: "var(--fg-2)",   desc: "Verified job postings matched to your skill profile."      },
]

type FeedItem =
  | { type: "profile"; spaces: string[]; who: Actor; event: "verified" | "joined" | "open"; bio?: string; highlight?: string; skills: string[]; langs?: Lang[]; years: number; time: string }
  | { type: "role";    spaces: string[]; company: string; role: string; skills: string[]; match: number; time: string }

type Actor = { initials: string; name: string; title: string; verified: boolean; profileId: string }
type Lang  = { name: string; pct: number; color: string }
type Filters = { verified: boolean; senior: boolean; available: boolean }
type Sort = "activity" | "verified" | "senior"

const ONUR: Actor  = { initials: "OS", name: "Onur Şahin",  title: "Principal Engineer · Berlin",          verified: true,  profileId: "onur-sahin"  }
const ELIF: Actor  = { initials: "EY", name: "Elif Yıldız", title: "Senior Backend Engineer · Izmir",         verified: true,  profileId: "elif-yildiz" }
const MERT: Actor  = { initials: "MK", name: "Mert Kaya",   title: "Staff Engineer · Ankara",                 verified: true,  profileId: "mert-kaya"   }
const BERK: Actor  = { initials: "BT", name: "Berk Toprak", title: "Backend Engineer · Remote",               verified: true,  profileId: "berk-toprak" }
const ZEYNEP: Actor = { initials: "ZK", name: "Zeynep Koç", title: "Senior SRE · Istanbul",                   verified: true,  profileId: "zeynep-koc"  }
const CAN: Actor   = { initials: "CU", name: "Can Uçar",    title: "Backend Engineer · Istanbul",             verified: true,  profileId: "can-ucar"    }
const DENIZ: Actor = { initials: "DA", name: "Deniz Aksoy", title: "Tech Lead · Istanbul",                    verified: false, profileId: "deniz-aksoy" }

const B = "backend-tr", G = "go-guild", M = "ml-istanbul", D = "devops-tr", R = "open-roles"

const FEED: FeedItem[] = [
  {
    type: "profile", spaces: [B, G], event: "verified",
    who: ONUR, years: 12, time: "2m ago",
    highlight: "Built go-schema-registry — 1.2k stars, used by 200+ companies in production.",
    skills: ["Go", "Kafka", "PostgreSQL", "Protobuf", "ClickHouse"],
    langs: [{ name: "Go", pct: 79, color: "#00ADD8" }, { name: "Python", pct: 13, color: "#3572A5" }, { name: "TypeScript", pct: 8, color: "#3178C6" }],
  },
  {
    type: "profile", spaces: [B, M], event: "verified",
    who: ELIF, years: 6, time: "1h ago",
    highlight: "Cut cold-start latency on ML models by 65% with async cache warm-up.",
    skills: ["Python", "Django", "AWS", "Redis", "Celery"],
    langs: [{ name: "Python", pct: 71, color: "#3572A5" }, { name: "TypeScript", pct: 18, color: "#3178C6" }, { name: "Shell", pct: 11, color: "#89E051" }],
  },
  {
    type: "profile", spaces: [B, G], event: "open",
    who: MERT, years: 9, time: "2h ago",
    highlight: "Dropped order router p99 from 340ms to 28ms. Open to Staff/Principal roles.",
    skills: ["Go", "Kafka", "PostgreSQL", "Kubernetes", "OpenTelemetry"],
    langs: [{ name: "Go", pct: 84, color: "#00ADD8" }, { name: "Shell", pct: 10, color: "#89E051" }, { name: "Python", pct: 6, color: "#3572A5" }],
  },
  {
    type: "role", spaces: [B, G, R],
    company: "Trendyol", role: "Senior Backend Engineer — Payments",
    skills: ["Go", "Kafka", "Postgres", "gRPC"], match: 94, time: "4h ago",
  },
  {
    type: "profile", spaces: [B, G], event: "joined",
    who: BERK, years: 4, time: "3h ago",
    bio: "OSS contributor building high-perf networking tools in Rust. 2× Rustacean of the month.",
    skills: ["Rust", "Go", "WASM", "Tokio", "Redis"],
    langs: [{ name: "Rust", pct: 68, color: "#DEA584" }, { name: "Go", pct: 22, color: "#00ADD8" }, { name: "C", pct: 10, color: "#555555" }],
  },
  {
    type: "profile", spaces: [D], event: "verified",
    who: ZEYNEP, years: 7, time: "5h ago",
    highlight: "Reduced MTTD from 11 minutes to under 90s via custom alerting pipeline.",
    skills: ["Kubernetes", "ArgoCD", "Terraform", "Prometheus", "Go"],
    langs: [{ name: "Go", pct: 44, color: "#00ADD8" }, { name: "Python", pct: 31, color: "#3572A5" }, { name: "Shell", pct: 25, color: "#89E051" }],
  },
  {
    type: "profile", spaces: [B], event: "joined",
    who: CAN, years: 3, time: "6h ago",
    bio: "Building real-time leaderboard infra at Peak Games. Cut update latency from 200ms to 12ms.",
    skills: ["Go", "WebSocket", "Redis", "PostgreSQL", "TypeScript"],
    langs: [{ name: "Go", pct: 61, color: "#00ADD8" }, { name: "TypeScript", pct: 28, color: "#3178C6" }, { name: "Python", pct: 11, color: "#3572A5" }],
  },
  {
    type: "role", spaces: [B, D, R],
    company: "Getir", role: "Staff Engineer — Platform",
    skills: ["Go", "K8s", "Terraform", "Kafka"], match: 82, time: "10h ago",
  },
  {
    type: "profile", spaces: [B, D], event: "joined",
    who: DENIZ, years: 8, time: "12h ago",
    bio: "Tech lead @ Yapı Kredi, leading migration of core banking to microservices.",
    skills: ["Java", "Spring Boot", "Kafka", "Kubernetes", "PostgreSQL"],
    langs: [{ name: "Java", pct: 72, color: "#B07219" }, { name: "Kotlin", pct: 18, color: "#A97BFF" }, { name: "Shell", pct: 10, color: "#89E051" }],
  },
]

function matchesSearch(item: FeedItem, q: string): boolean {
  if (!q) return true
  const s = q.toLowerCase()
  if (item.type === "role") return item.role.toLowerCase().includes(s) || item.company.toLowerCase().includes(s) || item.skills.some(sk => sk.toLowerCase().includes(s))
  if (item.who.name.toLowerCase().includes(s) || item.who.title.toLowerCase().includes(s)) return true
  if (item.skills.some(sk => sk.toLowerCase().includes(s))) return true
  if (item.bio?.toLowerCase().includes(s) || item.highlight?.toLowerCase().includes(s)) return true
  return false
}

function passesFilters(item: FeedItem, f: Filters, space: string, query: string): boolean {
  if (!item.spaces.includes(space)) return false
  if (!matchesSearch(item, query)) return false
  if (item.type === "role") return true
  if (f.verified && !item.who.verified) return false
  if (f.senior && item.years < 6) return false
  if (f.available && item.event !== "open") return false
  return true
}

function applySort(items: FeedItem[], sort: Sort): FeedItem[] {
  if (sort === "activity") return items
  if (sort === "verified") return [...items].sort((a, b) => {
    const av = a.type !== "role" && a.who.verified ? 0 : 1
    const bv = b.type !== "role" && b.who.verified ? 0 : 1
    return av - bv
  })
  if (sort === "senior") return [...items].sort((a, b) => {
    const ay = a.type === "role" ? 0 : a.years
    const by = b.type === "role" ? 0 : b.years
    return by - ay
  })
  return items
}

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

function CardActions({ saved, vouched, onSave, onVouch, onView }: {
  saved: boolean; vouched: boolean
  onSave: () => void; onVouch: () => void; onView: () => void
}) {
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
      <button onClick={(e) => { e.stopPropagation(); onSave() }} style={{
        padding: "5px 12px", borderRadius: 8, fontSize: 11, fontFamily: "var(--mono)", cursor: "pointer",
        background: saved ? "rgba(124,255,178,0.1)" : "var(--bg-2)",
        border: `1px solid ${saved ? "rgba(124,255,178,0.3)" : "var(--line)"}`,
        color: saved ? "var(--mint)" : "var(--fg-3)",
        transition: "all .15s",
      }}>{saved ? "✓ Saved" : "◎ Save"}</button>
      <button onClick={(e) => { e.stopPropagation(); onVouch() }} style={{
        padding: "5px 12px", borderRadius: 8, fontSize: 11, fontFamily: "var(--mono)", cursor: "pointer",
        background: vouched ? "rgba(167,139,250,0.1)" : "var(--bg-2)",
        border: `1px solid ${vouched ? "rgba(167,139,250,0.3)" : "var(--line)"}`,
        color: vouched ? "var(--violet)" : "var(--fg-3)",
        transition: "all .15s",
      }}>{vouched ? "◈ Vouched" : "◈ Vouch"}</button>
      <button onClick={(e) => { e.stopPropagation(); onView() }} style={{
        marginLeft: "auto", padding: "5px 14px", borderRadius: 8, fontSize: 11, fontFamily: "var(--mono)",
        background: "transparent", border: "1px solid var(--line)", color: "var(--fg-2)", cursor: "pointer",
      }}>view profile →</button>
    </div>
  )
}

const EVENT_LABEL: Record<string, { text: string; color: string }> = {
  verified: { text: "◈ verified profile", color: "var(--mint)"   },
  joined:   { text: "joined the space",   color: "var(--fg-4)"   },
  open:     { text: "▸ open to work",     color: "var(--amber)"  },
}

function FeedCard({ item, idx, saved, vouched, onSave, onVouch, onNavigate }: {
  item: FeedItem; idx: number
  saved: boolean; vouched: boolean
  onSave: (i: number) => void; onVouch: (i: number) => void; onNavigate: () => void
}) {
  const actions = <CardActions saved={saved} vouched={vouched} onSave={() => onSave(idx)} onVouch={() => onVouch(idx)} onView={onNavigate} />
  const base: React.CSSProperties = { padding: 18, borderRadius: 14, background: "var(--bg-1)", border: "1px solid var(--line)" }

  if (item.type === "profile") {
    const ev = EVENT_LABEL[item.event]
    return (
      <div style={base}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Avatar actor={item.who} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item.who.name}</span>
              {item.who.verified && <VerifiedBadge />}
              <span style={{ fontSize: 11, color: ev.color, fontFamily: "var(--mono)" }}>{ev.text}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>{item.time}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 3 }}>
              {item.who.title} · <span style={{ fontFamily: "var(--mono)" }}>{item.years}y</span>
            </div>
          </div>
        </div>

        {(item.highlight || item.bio) && (
          <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--fg-2)", lineHeight: 1.6 }}>
            {item.highlight ?? item.bio}
          </p>
        )}

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <SkillChips skills={item.skills} />
          {item.langs && item.langs.length > 0 && <LangBar langs={item.langs} />}
        </div>
        {actions}
      </div>
    )
  }

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
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(124,255,178,0.12)" }}>
        <button style={{
          padding: "7px 16px", borderRadius: 8, fontSize: 12, fontFamily: "var(--mono)",
          background: "var(--mint)", border: "none", color: "#0A0A0B", cursor: "pointer", fontWeight: 600,
        }}>Apply with profile →</button>
      </div>
    </div>
  )

  return null
}

const SORT_LABELS: Record<Sort, string> = { activity: "activity ↓", verified: "verified first", senior: "senior first" }

export default function SpacesPage() {
  const router = useRouter()
  const [activeSpace, setActiveSpace] = useState("backend-tr")
  const [filters, setFilters] = useState<Filters>({ verified: true, senior: false, available: false })
  const [sort, setSort] = useState<Sort>("activity")
  const [saved, setSaved] = useState<Set<number>>(new Set())
  const [vouched, setVouched] = useState<Set<number>>(new Set())
  const { data: session } = useSession()
  const [profileHref, setProfileHref] = useState("/p/demo")
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const id = localStorage.getItem("lastProfileId")
    setHasProfile(!!id)
    if (id) setProfileHref(`/p/${id}`)
  }, [])

  function toggleFilter(key: keyof Filters) {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function toggleSaved(i: number) {
    setSaved((prev) => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s })
  }

  function toggleVouched(i: number) {
    setVouched((prev) => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s })
  }

  function cycleSort() {
    const order: Sort[] = ["activity", "verified", "senior"]
    setSort((prev) => order[(order.indexOf(prev) + 1) % order.length])
  }

  const visibleFeed = useMemo(() => {
    const filtered = FEED.map((item, i) => ({ item, i })).filter(({ item }) => passesFilters(item, filters, activeSpace, searchQuery))
    const sorted = applySort(filtered.map((x) => x.item), sort)
    return sorted.map((item) => ({ item, i: FEED.indexOf(item) }))
  }, [filters, sort, activeSpace, searchQuery])

  const space = SPACES.find((s) => s.id === activeSpace)!

  const trendingSkills = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const item of FEED) {
      if (!item.spaces.includes(activeSpace)) continue
      const skills = item.type === "profile" || item.type === "role" ? item.skills : []
      for (const s of skills) counts[s] = (counts[s] ?? 0) + 1
    }
    const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 5)
    const max = sorted[0]?.[1] ?? 1
    return sorted.map(([label, count]) => {
      const h = label.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
      return { label, delta: `+${8 + (h % 39)}%`, pct: Math.round((count / max) * 100) }
    })
  }, [activeSpace])

  const FILTER_DEFS: { key: keyof Filters; label: string; activeLabel: string }[] = [
    { key: "verified", label: "Verified only", activeLabel: "✓ Verified only" },
    { key: "senior",   label: "Senior+",       activeLabel: "✓ Senior+"       },
    { key: "available", label: "Open to work", activeLabel: "✓ Open to work" },
  ]

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
            <Link href="/vouches">vouches</Link>
            <Link href="/settings">settings</Link>
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, width: 260, padding: "8px 12px", borderRadius: 10,
            background: "var(--bg-2)", border: "1px solid var(--line)", fontSize: 13,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fg-4)" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people or skills…"
              style={{
                background: "none", border: "none", outline: "none", width: "100%",
                fontSize: 13, color: "var(--fg)", fontFamily: "var(--sans)",
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ color: "var(--fg-4)", fontSize: 14, flexShrink: 0, lineHeight: 1 }}>✕</button>
            )}
          </div>
          <Link href={profileHref} style={{
            display: "block", width: 32, height: 32, borderRadius: 999,
            overflow: "hidden", flexShrink: 0, background: "linear-gradient(135deg, var(--mint), var(--violet))",
          }}>
            {session?.user?.image && <img src={session.user.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />}
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "220px 1fr 300px", minHeight: 0 }}>

        {/* Left rail */}
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
            {([["Saved", saved.size], ["Pending vouches", vouched.size]] as [string, number][]).map(([label, count]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--fg-3)", marginBottom: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: "var(--bg-3)" }} />
                {label}
                <span style={{
                  marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 11,
                  color: count > 0 ? "var(--fg)" : "var(--fg-4)",
                  fontWeight: count > 0 ? 600 : 400,
                }}>{count}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Center feed */}
        <div className="scroll" style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
                {space.name}
                <span style={{ fontSize: 12, color: "var(--fg-3)", fontWeight: 400, marginLeft: 10, fontFamily: "var(--mono)" }}>{space.count.toLocaleString()} builders</span>
              </h2>
              <div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 3 }}>{space.desc}</div>
            </div>
          </div>

          {/* No-profile CTA */}
          {hasProfile === false && (
            <div style={{
              marginBottom: 20, padding: "14px 18px", borderRadius: 12,
              background: "linear-gradient(135deg,rgba(124,255,178,0.06),rgba(167,139,250,0.04))",
              border: "1px solid rgba(124,255,178,0.2)",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <span style={{ fontSize: 20 }}>◈</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Your verified profile is not set up yet</div>
                <div style={{ fontSize: 12, color: "var(--fg-3)" }}>Drop your CV — let your code speak for you.</div>
              </div>
              <button className="btn btn-primary" onClick={() => router.push("/upload")} style={{ padding: "8px 16px", fontSize: 12, whiteSpace: "nowrap" }}>
                Build your profile →
              </button>
            </div>
          )}

          {/* Filter bar */}
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
            {FILTER_DEFS.map(({ key, label, activeLabel }) => (
              <button key={key} onClick={() => toggleFilter(key)} style={{
                padding: "5px 10px", borderRadius: 999, cursor: "pointer", fontSize: 11, fontFamily: "var(--mono)",
                background: filters[key] ? "rgba(124,255,178,0.1)" : "var(--bg-2)",
                border: `1px solid ${filters[key] ? "rgba(124,255,178,0.3)" : "var(--line)"}`,
                color: filters[key] ? "var(--mint)" : "var(--fg-2)",
                transition: "all .15s",
              }}>{filters[key] ? activeLabel : label}</button>
            ))}
            <button onClick={cycleSort} style={{
              marginLeft: "auto", padding: "5px 10px", borderRadius: 999, cursor: "pointer",
              fontSize: 11, fontFamily: "var(--mono)", background: "var(--bg-2)",
              border: "1px solid var(--line)", color: "var(--fg-2)", transition: "all .15s",
            }}>sort: <span style={{ color: "var(--fg)" }}>{SORT_LABELS[sort]}</span></button>
          </div>

          {visibleFeed.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--fg-3)", fontFamily: "var(--mono)", fontSize: 13 }}>
              No items match the current filters.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {visibleFeed.map(({ item, i }) => (
                <FeedCard
                  key={i} item={item} idx={i}
                  saved={saved.has(i)} vouched={vouched.has(i)}
                  onSave={toggleSaved} onVouch={toggleVouched}
                  onNavigate={() => {
                    if (item.type !== "role") router.push(`/p/${item.who.profileId}`)
                  }}
                />
              ))}
            </div>
          )}
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
              {trendingSkills.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--fg-4)", fontFamily: "var(--mono)" }}>No data for this space.</div>
              ) : trendingSkills.map(({ label, delta, pct }) => (
                <div key={label} onClick={() => setSearchQuery(searchQuery === label ? "" : label)}
                  style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                    <span style={{
                      fontSize: 13,
                      color: searchQuery === label ? "var(--mint)" : "var(--fg)",
                      transition: "color .15s",
                    }}>{label}</span>
                    <span style={{ fontSize: 11, color: "var(--mint)", fontFamily: "var(--mono)" }}>{delta}</span>
                  </div>
                  <div className="skill-bar" style={{ height: 3 }}>
                    <div style={{
                      width: `${pct}%`,
                      background: searchQuery === label ? "var(--mint)" : undefined,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Open roles · matched</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { company: "Trendyol", role: "Senior Backend Eng", match: 94 },
                { company: "Getir",    role: "Staff Engineer",      match: 82 },
                { company: "Iyzico",   role: "Tech Lead, Payments", match: 76 },
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
