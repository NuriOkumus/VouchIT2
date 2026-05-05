const API_BASE = process.env.NEXT_PUBLIC_API_BASE!

export type Skill = {
  name: string
  level: "junior" | "mid" | "senior"
  verified: boolean
  evidenceCount: number
}

export type LangItem = { name: string; pct: number; color: string }

export type ProfileMetadata = {
  title?: string
  location?: string
  yearsExperience?: number
  highlights?: string[]
  githubLanguages?: LangItem[]
  githubRepos?: number
  githubStars?: number
}

export type Profile = {
  id: string
  name: string
  developer_summary: string
  hr_summary: string
  skills: Skill[]
  metadata?: ProfileMetadata
}

export async function uploadCV(file: File, userId: string, githubToken?: string): Promise<Profile> {
  const form = new FormData()
  form.append("cv", file)
  form.append("userId", userId)
  if (githubToken) form.append("githubToken", githubToken)

  const res = await fetch(`${API_BASE}/analyze-cv`, { method: "POST", body: form })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? "Upload failed")
  }
  return res.json() as Promise<Profile>
}

export async function getProfile(id: string): Promise<Profile> {
  const res = await fetch(`${API_BASE}/profile/${id}`)
  if (!res.ok) throw new Error("Profile not found")
  return res.json() as Promise<Profile>
}

export async function listProfiles(): Promise<Profile[]> {
  const res = await fetch(`${API_BASE}/profiles`)
  if (!res.ok) throw new Error("Failed to fetch profiles")
  return res.json() as Promise<Profile[]>
}
