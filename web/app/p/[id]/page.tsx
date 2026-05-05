"use client"
import { useState } from "react"
import ViewToggle from "@/components/ViewToggle"
import SkillCard from "@/components/SkillCard"

const PROFILE = {
  name: "Ali Yılmaz",
  developer_summary:
    "5 yıllık full-stack geliştirici. TypeScript, React, Node.js uzmanı. 200+ PR merged, 3 açık kaynak projesi katkısı. Yüksek kaliteli kod review geçmişi.",
  hr_summary:
    "Teknoloji odaklı, takım çalışmasına yatkın yazılım uzmanı. Çeşitli sektörlerde müşteri odaklı çözümler geliştirmiş, değer yaratan profesyonel. İletişim becerileri kuvvetli.",
  skills: [
    { name: "TypeScript", level: "senior" as const, verified: true, evidenceCount: 47 },
    { name: "React", level: "senior" as const, verified: true, evidenceCount: 32 },
    { name: "Node.js", level: "mid" as const, verified: true, evidenceCount: 21 },
    { name: "PostgreSQL", level: "mid" as const, verified: false, evidenceCount: 14 },
    { name: "Docker", level: "junior" as const, verified: false, evidenceCount: 6 },
  ],
}

export default function ProfilePage() {
  const [view, setView] = useState<"developer" | "hr">("developer")

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-zinc-900">{PROFILE.name}</h1>
          <ViewToggle value={view} onChange={setView} />
        </div>
        <p className="text-zinc-600 leading-relaxed">
          {view === "developer" ? PROFILE.developer_summary : PROFILE.hr_summary}
        </p>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-800">Yetenekler</h2>
          <div className="flex flex-col gap-3">
            {PROFILE.skills.map((skill) => (
              <SkillCard key={skill.name} {...skill} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
