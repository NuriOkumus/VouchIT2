import { Hono } from "hono"
import { GoogleGenAI } from "@google/genai"
import { db } from "../db/index.js"
import { profiles } from "../db/schema.js"
import { eq } from "drizzle-orm"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

type GitHubRepo = { language: string | null }

async function fetchGitHubLanguages(token: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      "https://api.github.com/user/repos?per_page=100&affiliation=owner&sort=updated",
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
    )
    if (!res.ok) return {}
    const repos = (await res.json()) as GitHubRepo[]
    const counts: Record<string, number> = {}
    for (const repo of repos) {
      if (repo.language) counts[repo.language] = (counts[repo.language] ?? 0) + 1
    }
    return counts
  } catch {
    return {}
  }
}

function buildPrompt(githubLangs: Record<string, number>): string {
  const hasGitHub = Object.keys(githubLangs).length > 0
  const githubSection = hasGitHub
    ? `\nDeveloper's real GitHub language stats (language → repo count): ${JSON.stringify(githubLangs)}`
    : ""

  return `Analyze this CV/resume${githubSection ? " and GitHub data" : ""} and return ONLY a valid JSON object (no markdown, no extra text):
{
  "name": "full name",
  "developer_summary": "2-3 sentences, technical language, specific technologies, years of experience",
  "hr_summary": "2-3 sentences, HR-friendly, soft skills, impact, career progression",
  "skills": [
    {
      "name": "skill name",
      "level": "junior" | "mid" | "senior",
      "verified": true/false,
      "evidenceCount": number
    }
  ]
}
${githubSection}
Rules for skills:
- Include 5-10 most prominent technical skills from the CV
- level: junior <1yr, mid 1-3yr, senior 3+yr/leadership
${hasGitHub
    ? "- verified: true ONLY if the skill/language appears in GitHub stats\n- evidenceCount: GitHub repo count for that language (0 if not in GitHub)"
    : "- verified: true if there is concrete CV evidence (projects, work exp)\n- evidenceCount: number of projects/roles mentioning this skill"}`
}

function parseGeminiJSON(text: string) {
  return JSON.parse(
    text.trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim()
  )
}

export const analyzeRouter = new Hono()

analyzeRouter.post("/analyze-cv", async (c) => {
  try {
    const body = await c.req.parseBody()
    const file = body["cv"]
    const userId = body["userId"] as string
    const githubToken = body["githubToken"] as string | undefined

    if (!file || typeof file === "string") {
      return c.json({ error: "CV dosyası gerekli" }, 400)
    }
    if (!userId) {
      return c.json({ error: "userId gerekli" }, 400)
    }

    const [buffer, githubLangs] = await Promise.all([
      file.arrayBuffer(),
      githubToken ? fetchGitHubLanguages(githubToken) : Promise.resolve({}),
    ])

    const base64 = Buffer.from(buffer).toString("base64")
    const mimeType = (file.type || "application/pdf") as "application/pdf"

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        parts: [
          { inlineData: { data: base64, mimeType } },
          { text: buildPrompt(githubLangs) },
        ],
      }],
    })

    const raw = result.text ?? ""
    const data = parseGeminiJSON(raw) as {
      name: string
      developer_summary: string
      hr_summary: string
      skills: Array<{ name: string; level: "junior" | "mid" | "senior"; verified: boolean; evidenceCount: number }>
    }

    const [profile] = await db
      .insert(profiles)
      .values({
        userId,
        name: data.name,
        developerSummary: data.developer_summary,
        hrSummary: data.hr_summary,
        skills: data.skills,
      })
      .returning()

    return c.json({ id: profile.id, ...data })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[analyze-cv]", message)
    return c.json({ error: message }, 500)
  }
})

analyzeRouter.get("/profile/:id", async (c) => {
  const id = c.req.param("id")
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, id))
    .limit(1)

  if (!profile) return c.json({ error: "Profil bulunamadı" }, 404)

  return c.json({
    id: profile.id,
    name: profile.name,
    developer_summary: profile.developerSummary,
    hr_summary: profile.hrSummary,
    skills: profile.skills,
  })
})

analyzeRouter.get("/profiles", async (c) => {
  const rows = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      skills: profiles.skills,
      createdAt: profiles.createdAt,
    })
    .from(profiles)
    .orderBy(profiles.createdAt)
    .limit(50)

  return c.json(rows)
})
