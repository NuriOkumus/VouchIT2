"use client"
import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { setPendingUpload } from "@/lib/upload-store"

export default function UploadPage() {
  const { data: session, status } = useSession()
  const [stage, setStage] = useState<"idle" | "dragging" | "file">("idle")
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const avatar = session?.user?.image ?? null
  const name = session?.user?.name ?? session?.user?.email ?? "user"
  const handle = name.toLowerCase().replace(/\s+/g, "").slice(0, 16)

  function handleFile(f: File) { setFile(f); setStage("file") }

  function handleContinue() {
    if (!file || !session?.user?.email) return
    setPendingUpload({ file, userId: session.user.email, token: session.accessToken })
    router.push("/loading")
  }

  if (status === "loading") return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div style={{ width: 32, height: 32, borderRadius: 999, border: "2px solid var(--mint)", borderTopColor: "transparent", animation: "verifiedSpin .8s linear infinite" }} />
    </div>
  )

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", borderBottom: "1px solid var(--line)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 4 L12 20 L21 4" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2" fill="var(--mint)" />
          </svg>
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>VouchIT</span>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 11 }}>
          {["Sign in", "Upload CV", "Analyze", "Profile"].map((s, i) => (
            <span key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                display: "flex", alignItems: "center", gap: 5,
                color: i === 1 ? "var(--fg)" : i < 1 ? "var(--mint)" : "var(--fg-4)",
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 999, flexShrink: 0,
                  border: `1px solid ${i <= 1 ? (i < 1 ? "var(--mint)" : "var(--line-2)") : "var(--line)"}`,
                  background: i < 1 ? "var(--mint)" : i === 1 ? "var(--bg-3)" : "transparent",
                  color: i < 1 ? "#0A0A0B" : "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 600,
                }}>{i < 1 ? "✓" : i + 1}</span>
                {s}
              </span>
              {i < 3 && <span style={{ color: "var(--fg-4)", marginLeft: 4 }}>—</span>}
            </span>
          ))}
        </div>

        {/* User chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "var(--fg-3)", fontFamily: "var(--mono)" }}>@{handle}</span>
          <div style={{
            width: 32, height: 32, borderRadius: 999, overflow: "hidden", flexShrink: 0,
            background: "linear-gradient(135deg, var(--mint), var(--violet))",
          }}>
            {avatar && <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />}
          </div>
        </div>
      </header>

      {/* Body — two columns */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 0 }}>

        {/* Left — upload */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          padding: "48px 56px", borderRight: "1px solid var(--line)",
        }}>
          <div style={{ width: "100%", maxWidth: 480 }}>
            <h1 style={{ fontSize: 36, fontWeight: 600, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
              Drop your CV.
            </h1>
            <p style={{ margin: "0 0 32px", color: "var(--fg-3)", fontSize: 14 }}>
              We&apos;ll build your verified developer profile automatically.
            </p>

            {/* Drop zone */}
            <div
              onDragEnter={(e) => { e.preventDefault(); setStage("dragging") }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setStage(file ? "file" : "idle")}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
              onClick={() => !file && inputRef.current?.click()}
              style={{
                border: `1.5px dashed ${stage === "dragging" ? "var(--mint)" : "var(--line-2)"}`,
                borderRadius: 16, padding: file ? "24px" : "48px 32px",
                background: stage === "dragging"
                  ? "linear-gradient(180deg,rgba(124,255,178,0.06),transparent)"
                  : "var(--bg-1)",
                cursor: file ? "default" : "pointer",
                transition: "all .2s ease",
                textAlign: "center",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
              }}
            >
              {!file && (
                <>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: stage === "dragging" ? "rgba(124,255,178,0.08)" : "var(--bg-2)",
                    border: `1px solid ${stage === "dragging" ? "rgba(124,255,178,0.3)" : "var(--line)"}`,
                    transition: "all .2s",
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke={stage === "dragging" ? "var(--mint)" : "var(--fg-2)"}
                      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 16V4M6 10l6-6 6 6" /><path d="M4 20h16" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
                      {stage === "dragging" ? "Drop it." : "Drag your CV here"}
                    </div>
                    <div style={{ color: "var(--fg-3)", fontSize: 13 }}>
                      or <span style={{ color: "var(--mint)", textDecoration: "underline", textUnderlineOffset: 4 }}>browse files</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["PDF", "DOCX", "≤ 10MB"].map((t) => (
                      <span key={t} className="chip" style={{ fontSize: 10, padding: "3px 8px" }}>{t}</span>
                    ))}
                  </div>
                </>
              )}

              {file && (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 10,
                    background: "var(--bg-2)", border: "1px solid var(--line)", textAlign: "left",
                  }}>
                    <div style={{
                      width: 36, height: 44, borderRadius: 6, flexShrink: 0,
                      background: "var(--bg-3)", border: "1px solid var(--line)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--mono)", fontSize: 8, color: "var(--rose)", fontWeight: 600,
                    }}>PDF</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                      <div style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--mono)", marginTop: 3 }}>
                        {(file.size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--mint)", fontSize: 11, fontFamily: "var(--mono)", flexShrink: 0 }}>
                      <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--mint)" }} />
                      ready
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn" onClick={(e) => { e.stopPropagation(); setFile(null); setStage("idle") }}
                      style={{ flex: 1, padding: "10px 0", fontSize: 13 }}>
                      Change
                    </button>
                    <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); handleContinue() }}
                      style={{ flex: 2, padding: "10px 0", fontSize: 13 }}>
                      Analyze CV →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <input ref={inputRef} type="file" accept=".pdf,.docx" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

            <div style={{ marginTop: 20, display: "flex", gap: 24, fontSize: 12, color: "var(--fg-4)", justifyContent: "center" }}>
              {[["🔒", "Encrypted in transit"], ["◈", "Not stored raw"], ["↺", "Delete anytime"]].map(([icon, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — preview */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          padding: "48px 56px", background: "var(--bg-1)",
        }}>
          <div style={{ width: "100%", maxWidth: 400 }}>
            <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
              What you&apos;ll get
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  icon: "◈", color: "var(--mint)", title: "Verified skill badges",
                  desc: "Skills auto-levelled from your CV, cross-checked against your GitHub repos.",
                },
                {
                  icon: "▸", color: "var(--amber)", title: "Career highlights",
                  desc: "Top 3 concrete achievements pulled from your CV — metrics included where available.",
                },
                {
                  icon: "◎", color: "#00ADD8", title: "GitHub activity heatmap",
                  desc: "Real contribution calendar, language breakdown, repo count and star total.",
                },
                {
                  icon: "⬡", color: "var(--violet)", title: "Developer identity card",
                  desc: "Title, location, years of experience and a technical summary — shareable as a link.",
                },
              ].map(({ icon, color, title, desc }) => (
                <div key={title} style={{
                  display: "flex", gap: 14, padding: "14px 16px",
                  borderRadius: 12, background: "var(--bg-2)", border: "1px solid var(--line)",
                }}>
                  <span style={{ color, fontSize: 18, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "var(--fg-3)", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 20, padding: "14px 16px", borderRadius: 12,
              background: "linear-gradient(135deg,rgba(124,255,178,0.06),rgba(167,139,250,0.04))",
              border: "1px solid rgba(124,255,178,0.15)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 999, overflow: "hidden", flexShrink: 0,
                background: "linear-gradient(135deg, var(--mint), var(--violet))",
              }}>
                {avatar && <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
                <div style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--mono)", marginTop: 1 }}>
                  profile will be created as <span style={{ color: "var(--mint)" }}>@{handle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
