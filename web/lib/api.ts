const API_BASE = process.env.NEXT_PUBLIC_API_BASE!

export async function uploadCV(file: File, userId: string): Promise<{ jobId: string }> {
  const form = new FormData()
  form.append("cv", file)
  form.append("userId", userId)
  const res = await fetch(`${API_BASE}/upload-cv`, { method: "POST", body: form })
  if (!res.ok) throw new Error("Upload failed")
  return res.json() as Promise<{ jobId: string }>
}

export async function getProfile(id: string) {
  const res = await fetch(`${API_BASE}/profile/${id}`)
  if (!res.ok) throw new Error("Profile not found")
  return res.json()
}

export async function listProfiles() {
  const res = await fetch(`${API_BASE}/profiles`)
  if (!res.ok) throw new Error("Failed to fetch profiles")
  return res.json()
}
