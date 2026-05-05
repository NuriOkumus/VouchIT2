"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ViewToggle from "@/components/ViewToggle"
import SkillCard from "@/components/SkillCard"
import { getProfile, type Profile } from "@/lib/api"
import { Loader2 } from "lucide-react"

const DEMO: Profile = {
  id: "demo",
  name: "Ali Yılmaz",
  developer_summary:
    "5 yıllık full-stack geliştirici. TypeScript, React, Node.js uzmanı. 200+ PR merged, 3 açık kaynak projesi katkısı.",
  hr_summary:
    "Teknoloji odaklı, takım çalışmasına yatkın yazılım uzmanı. Çeşitli sektörlerde müşteri odaklı çözümler geliştirmiş profesyonel.",
  skills: [
    { name: "TypeScript", level: "senior", verified: true, evidenceCount: 47 },
    { name: "React", level: "senior", verified: true, evidenceCount: 32 },
    { name: "Node.js", level: "mid", verified: true, evidenceCount: 21 },
    { name: "PostgreSQL", level: "mid", verified: false, evidenceCount: 14 },
    { name: "Docker", level: "junior", verified: false, evidenceCount: 6 },
  ],
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [profile, setProfile] = useState<Profile | null>(id === "demo" ? DEMO : null)
  const [view, setView] = useState<"developer" | "hr">("developer")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id === "demo") return
    getProfile(id)
      .then(setProfile)
      .catch(() => setError("Profil yüklenemedi"))
  }, [id])

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-zinc-900">{profile.name}</h1>
          <ViewToggle value={view} onChange={setView} />
        </div>
        <p className="text-zinc-600 leading-relaxed">
          {view === "developer" ? profile.developer_summary : profile.hr_summary}
        </p>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-800">Yetenekler</h2>
          <div className="flex flex-col gap-3">
            {profile.skills.map((skill) => (
              <SkillCard key={skill.name} {...skill} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
