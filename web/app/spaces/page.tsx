import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle } from "lucide-react"

const PROFILES = [
  { id: "1", name: "Ali Yılmaz", role: "Full Stack Developer", skills: ["TypeScript", "React"], verified: true },
  { id: "2", name: "Ayşe Kaya", role: "Backend Engineer", skills: ["Rust", "PostgreSQL"], verified: true },
  { id: "3", name: "Mert Demir", role: "DevOps Engineer", skills: ["Kubernetes", "Terraform"], verified: false },
  { id: "4", name: "Selin Çelik", role: "Frontend Developer", skills: ["Vue.js", "CSS"], verified: true },
  { id: "5", name: "Can Öztürk", role: "ML Engineer", skills: ["Python", "PyTorch"], verified: true },
  { id: "6", name: "Deniz Arslan", role: "Mobile Developer", skills: ["Swift", "Kotlin"], verified: false },
]

export default function SpacesPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Spaces</h1>
          <p className="text-zinc-500 mt-1">Developer profillerini keşfet</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROFILES.map((profile) => (
            <a key={profile.id} href={`/p/${profile.id}`}>
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                      {profile.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-zinc-900 truncate">{profile.name}</p>
                      {profile.verified && (
                        <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 truncate">{profile.role}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
