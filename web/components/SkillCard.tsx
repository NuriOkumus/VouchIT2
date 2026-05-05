import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

const LEVEL_STYLES: Record<"junior" | "mid" | "senior", string> = {
  junior: "bg-yellow-100 text-yellow-700",
  mid: "bg-blue-100 text-blue-700",
  senior: "bg-emerald-100 text-emerald-700",
}

interface Props {
  name: string
  level: "junior" | "mid" | "senior"
  verified: boolean
  evidenceCount: number
}

export default function SkillCard({ name, level, verified, evidenceCount }: Props) {
  return (
    <Card className="px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium text-zinc-900">{name}</span>
        {verified && <CheckCircle size={14} className="text-emerald-500" />}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400">{evidenceCount} commit</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_STYLES[level]}`}>
          {level}
        </span>
      </div>
    </Card>
  )
}
