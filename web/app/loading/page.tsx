"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { getPendingUpload, clearPendingUpload } from "@/lib/upload-store"
import { uploadCV } from "@/lib/api"

const PHASES = [
  { label: "Parsing CV",             detail: "Pages extracted, sections identified" },
  { label: "Scanning GitHub",        detail: "Last 24 months · repos · commits · stars" },
  { label: "Matching skills",        detail: "Repo languages ↔ CV claims" },
  { label: "Writing summary",        detail: "Technical bio, highlights, years of exp" },
  { label: "Building profile",       detail: "Computing evidence rings · language mix" },
]

const SAMPLE_LINES = [
  { type: "scan",   text: "scanning github.com/user..." },
  { type: "commit", text: "✓ feat(api): add streaming endpoint     · python · 142 ++" },
  { type: "commit", text: "✓ refactor: split worker pool           · go     ·  86 ++" },
  { type: "commit", text: "✓ fix(ml): resolve gradient explosion    · python · 31  ++" },
  { type: "match",  text: "≈ 'machine learning' (CV) ⇄ 12 repos found" },
  { type: "commit", text: "✓ chore: bump deps                       · ts     ·  4   ++" },
  { type: "scan",   text: "parsing pdf... (2 pages)" },
  { type: "match",  text: "≈ 'team lead' (CV) ⇄ 23 PR reviews found" },
  { type: "commit", text: "✓ feat: add jwt auth middleware          · go     ·  178 ++" },
  { type: "ai",     text: "→ inferring level: senior (5.8y exp, mid-large team signals)" },
  { type: "commit", text: "✓ docs: api reference v2                 · md     ·  402 ++" },
  { type: "match",  text: "≈ 'distributed systems' ⇄ 6 repos · go" },
  { type: "ai",     text: "→ generating dev-mode summary..." },
  { type: "ai",     text: "→ translating to recruiter-mode..." },
  { type: "scan",   text: "computing evidence rings... (per skill)" },
  { type: "ai",     text: "✓ profile ready · skills verified" },
]

export default function LoadingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)
  const [streamLines, setStreamLines] = useState<Array<{ type: string; text: string; id: number }>>([])
  const [error, setError] = useState<string | null>(null)
  const profileIdRef = useRef<string | null>(null)
  const apiReadyRef = useRef(false)
  const animDoneRef = useRef(false)

  function tryNavigate() {
    if (!apiReadyRef.current || !animDoneRef.current) return
    if (!profileIdRef.current) return // error state — stay on page
    setTimeout(() => router.push(`/p/${profileIdRef.current!}`), 500)
  }

  useEffect(() => {
    const pending = getPendingUpload()
    if (!pending) {
      // No pending upload — redirect to own profile if exists, else demo
      const lastId = localStorage.getItem("lastProfileId")
      apiReadyRef.current = true
      profileIdRef.current = lastId ?? "demo"
      return
    }

    uploadCV(pending.file, pending.email, pending.token)
      .then((profile) => { profileIdRef.current = profile.id })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg.includes("503") || msg.includes("overloaded")
          ? "Gemini şu an çok meşgul, lütfen birkaç dakika bekleyip tekrar dene."
          : "Analiz sırasında bir hata oluştu. Lütfen tekrar dene.")
        profileIdRef.current = null
      })
      .finally(() => {
        clearPendingUpload()
        apiReadyRef.current = true
        tryNavigate()
      })
  }, [])

  useEffect(() => {
    let i = 0
    const tick = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 1.4)
        if (next >= 100 && !animDoneRef.current) {
          animDoneRef.current = true
          tryNavigate()
        }
        return next
      })
      i += 1
      if (i % 10 === 0) setPhase((ph) => Math.min(PHASES.length - 1, ph + 1))
    }, 60)
    return () => clearInterval(tick)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let idx = 0
    const tick = setInterval(() => {
      setStreamLines((lines) => {
        const line = { ...SAMPLE_LINES[idx % SAMPLE_LINES.length], id: Date.now() + Math.random() }
        return [...lines, line].slice(-12)
      })
      idx += 1
    }, 240)
    return () => clearInterval(tick)
  }, [])

  if (error) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", gap: 20, padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 32 }}>⚠</div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--fg)" }}>Analiz başarısız</h2>
        <p style={{ margin: 0, fontSize: 14, color: "var(--fg-3)", maxWidth: 420, lineHeight: 1.6 }}>{error}</p>
        <button className="btn btn-primary" onClick={() => router.push("/upload")} style={{ marginTop: 8 }}>
          Tekrar dene →
        </button>
      </div>
    )
  }

  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      background: "var(--bg)", overflow: "hidden",
    }}>
      {/* Ambient pulse */}
      <div className="glow" style={{
        width: 800, height: 800, top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, var(--mint), transparent 70%)",
        opacity: 0.08, animation: "pulseGlow 3s ease-in-out infinite",
      }} />

      <header style={{
        padding: "20px 40px", borderBottom: "1px solid var(--line)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 4 L12 20 L21 4" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2" fill="var(--mint)" />
          </svg>
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>VouchIT</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--mono)", fontSize: 11 }}>
          {["Sign in", "Upload CV", "Translate", "Profile"].map((s, i) => (
            <span key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                display: "flex", alignItems: "center", gap: 6,
                color: i === 2 ? "var(--fg)" : i < 2 ? "var(--fg-2)" : "var(--fg-4)",
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 999, flexShrink: 0,
                  border: `1px solid ${i <= 2 ? "var(--line-2)" : "var(--line)"}`,
                  background: i < 2 ? "var(--mint)" : i === 2 ? "var(--bg-3)" : "transparent",
                  color: i < 2 ? "#0A0A0B" : "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 600,
                }}>{i < 2 ? "✓" : i + 1}</span>
                {s}
              </span>
              {i < 3 && <span style={{ color: "var(--fg-4)", marginLeft: 8 }}>—</span>}
            </span>
          ))}
        </div>
        <div style={{ width: 100 }} />
      </header>

      <main style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 520px", minHeight: 0, zIndex: 2 }}>
        {/* Left — visual */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 40, position: "relative",
        }}>
          {/* Orb visual */}
          <div style={{ position: "relative", width: 280, height: 280 }}>
            {[0, 1, 2].map((r) => (
              <div key={r} style={{
                position: "absolute", inset: r * 24, borderRadius: "50%",
                border: "1px solid var(--line-2)",
                opacity: 0.6 - r * 0.15,
                animation: `verifiedSpin ${20 + r * 10}s linear infinite ${r % 2 ? "reverse" : ""}`,
              }}>
                <div style={{
                  position: "absolute", top: "50%", left: -3,
                  width: 6, height: 6, borderRadius: 999,
                  background: r === 0 ? "var(--mint)" : r === 1 ? "var(--violet)" : "var(--amber)",
                  boxShadow: "0 0 10px currentColor",
                  color: r === 0 ? "var(--mint)" : r === 1 ? "var(--violet)" : "var(--amber)",
                }} />
              </div>
            ))}
            <svg style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }} viewBox="0 0 280 280">
              <circle cx="140" cy="140" r="100" fill="none" stroke="var(--bg-3)" strokeWidth="2" />
              <circle cx="140" cy="140" r="100" fill="none"
                stroke="url(#orbGrad)" strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 628} 628`}
                style={{ transition: "stroke-dasharray .15s linear" }}
              />
              <defs>
                <linearGradient id="orbGrad">
                  <stop offset="0%" stopColor="#7CFFB2" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: "absolute", inset: "30%", borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, var(--mint), var(--violet))",
              opacity: 0.25, filter: "blur(2px)",
              animation: "pulseGlow 2.4s ease-in-out infinite",
            }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M3 4 L12 20 L21 4" stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div style={{ marginTop: 48, textAlign: "center", maxWidth: 480 }}>
            <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--mint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
              {String(Math.floor(progress)).padStart(2, "0")}% · phase {phase + 1}/{PHASES.length}
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 600, margin: 0, letterSpacing: "-0.02em", minHeight: 80 }}>
              {PHASES[phase]?.label}
            </h2>
            <p style={{ marginTop: 10, fontSize: 14, color: "var(--fg-3)", minHeight: 22 }}>
              {PHASES[phase]?.detail}
            </p>
            <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 6 }}>
              {PHASES.map((_, i) => (
                <div key={i} style={{
                  width: 28, height: 3, borderRadius: 999,
                  background: i <= phase ? "var(--mint)" : "var(--bg-3)",
                  transition: "background .3s ease",
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Right — code stream */}
        <div style={{ background: "var(--bg-1)", borderLeft: "1px solid var(--line)", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{
            padding: "14px 20px", borderBottom: "1px solid var(--line)",
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg-3)",
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FF5F56" }} />
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FFBD2E" }} />
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#27C93F" }} />
            </div>
            <span style={{ marginLeft: 8 }}>vouchit · translator.log</span>
            <span style={{ marginLeft: "auto", color: "var(--mint)" }}>● live</span>
          </div>
          <div className="scroll" style={{
            flex: 1, padding: "16px 20px", fontFamily: "var(--mono)", fontSize: 12,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            minHeight: 0, overflow: "hidden",
          }}>
            {streamLines.map((line) => (
              <div key={line.id} className="stream-line" style={{
                color: line.type === "ai" ? "var(--violet)"
                     : line.type === "match" ? "var(--mint)"
                     : line.type === "scan" ? "var(--fg-3)"
                     : "var(--fg-2)",
                lineHeight: 1.7,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                <span style={{ color: "var(--fg-4)", marginRight: 10 }}>{String(line.id).slice(-4)}</span>
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Progress bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 520, height: 2, background: "var(--bg-2)" }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: "linear-gradient(90deg, var(--mint), var(--violet))",
          transition: "width .1s linear",
          boxShadow: "0 0 12px var(--mint)",
        }} />
      </div>
    </div>
  )
}
