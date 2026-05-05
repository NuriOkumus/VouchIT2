import { Hono } from "hono"
import OpenAI from "openai"
import { db } from "../db/index.js"
import { profiles } from "../db/schema.js"
import type { LangItem } from "../db/schema.js"
import { eq } from "drizzle-orm"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#F1E05A", TypeScript: "#3178C6", Python: "#3572A5",
  Go: "#00ADD8", Rust: "#DEA584", Java: "#B07219", "C++": "#F34B7D",
  "C#": "#178600", Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138",
  Kotlin: "#A97BFF", Shell: "#89E051", HTML: "#E34C26", CSS: "#563D7C",
  Vue: "#41B883", Dart: "#00B4AB", Scala: "#C22D40", "Jupyter Notebook": "#DA5B0B",
}
function langColor(name: string) { return LANG_COLORS[name] ?? "#7A7A82" }

type GitHubRepo = { language: string | null; stargazers_count: number }
type GitHubUser = { public_repos: number }

async function fetchGitHubData(token: string): Promise<{
  langCounts: Record<string, number>
  langItems: LangItem[]
  repos: number
  stars: number
}> {
  try {
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
    const [reposRes, userRes] = await Promise.all([
      fetch("https://api.github.com/user/repos?per_page=100&affiliation=owner&sort=updated", { headers }),
      fetch("https://api.github.com/user", { headers }),
    ])
    if (!reposRes.ok) return { langCounts: {}, langItems: [], repos: 0, stars: 0 }

    const repoData = await reposRes.json() as GitHubRepo[]
    const userData = userRes.ok ? await userRes.json() as GitHubUser : { public_repos: 0 }

    const langCounts: Record<string, number> = {}
    let stars = 0
    for (const repo of repoData) {
      if (repo.language) langCounts[repo.language] = (langCounts[repo.language] ?? 0) + 1
      stars += repo.stargazers_count ?? 0
    }

    const total = Object.values(langCounts).reduce((s, n) => s + n, 0)
    const langItems: LangItem[] = Object.entries(langCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        pct: Math.round((count / total) * 100),
        color: langColor(name),
      }))

    // Normalize to 100%
    const pctSum = langItems.reduce((s, l) => s + l.pct, 0)
    if (langItems.length > 0 && pctSum !== 100) {
      langItems[langItems.length - 1].pct += 100 - pctSum
    }

    return { langCounts, langItems, repos: userData.public_repos, stars }
  } catch {
    return { langCounts: {}, langItems: [], repos: 0, stars: 0 }
  }
}

function buildPrompt(githubLangs: Record<string, number>): string {
  const hasGitHub = Object.keys(githubLangs).length > 0
  const githubSection = hasGitHub
    ? `\nDeveloper's real GitHub language stats (language → repo count): ${JSON.stringify(githubLangs)}`
    : ""

  return `Analyze this CV/resume${githubSection ? " and GitHub data" : ""} and return ONLY a valid JSON object (no markdown, no extra text):
{
  "name": "full name from CV",
  "title": "most recent job title (e.g. 'Senior Backend Engineer')",
  "location": "city and country from CV, or 'Remote' if remote",
  "years_experience": <number, e.g. 5.5>,
  "developer_summary": "2-3 sentences, technical language, specific technologies, years of experience",
  "hr_summary": "2-3 sentences, HR-friendly, soft skills, impact, career progression",
  "highlights": ["top achievement from CV", "second achievement", "third achievement"],
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
    : "- verified: true if there is concrete CV evidence (projects, work exp)\n- evidenceCount: number of projects/roles mentioning this skill"}
Rules for highlights:
- 3 concrete, specific achievements from CV (metrics if available, e.g. 'Reduced p99 latency from 480ms to 95ms')
- Use first-person omitted style (e.g. 'Built X that did Y')
- Be specific, not generic`
}

async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf" || mimeType.includes("pdf")) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod = await import("pdf-parse") as any
    const parse: (buf: Buffer) => Promise<{ text: string }> = typeof mod === "function" ? mod : (mod.default ?? mod)
    const data = await parse(buffer)
    return data.text.trim()
  }
  return buffer.toString("utf-8").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

async function callOpenAI(cvText: string, prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: `CV/Resume content:\n\n${cvText}\n\n---\n\n${prompt}`,
    }],
    max_tokens: 2000,
  })
  return response.choices[0]?.message?.content ?? ""
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

    if (!file || typeof file === "string") return c.json({ error: "CV dosyası gerekli" }, 400)
    if (!userId) return c.json({ error: "userId gerekli" }, 400)

    const [buffer, github] = await Promise.all([
      file.arrayBuffer(),
      githubToken ? fetchGitHubData(githubToken) : Promise.resolve({ langCounts: {}, langItems: [], repos: 0, stars: 0 }),
    ])

    const mimeType = file.type || "application/pdf"
    const cvText = await extractText(Buffer.from(buffer), mimeType)

    const raw = await callOpenAI(cvText, buildPrompt(github.langCounts))
    const data = parseGeminiJSON(raw) as {
      name: string
      title?: string
      location?: string
      years_experience?: number
      developer_summary: string
      hr_summary: string
      highlights?: string[]
      skills: Array<{ name: string; level: "junior" | "mid" | "senior"; verified: boolean; evidenceCount: number }>
    }

    const metadata = {
      title: data.title,
      location: data.location,
      yearsExperience: data.years_experience,
      highlights: data.highlights,
      githubLanguages: github.langItems.length > 0 ? github.langItems : undefined,
      githubRepos: github.repos > 0 ? github.repos : undefined,
      githubStars: github.stars > 0 ? github.stars : undefined,
    }

    const [profile] = await db
      .insert(profiles)
      .values({
        userId,
        name: data.name,
        developerSummary: data.developer_summary,
        hrSummary: data.hr_summary,
        skills: data.skills,
        metadata,
      })
      .returning()

    return c.json({ id: profile.id, name: data.name, developer_summary: data.developer_summary, hr_summary: data.hr_summary, skills: data.skills, metadata })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[analyze-cv]", message)
    return c.json({ error: message }, 500)
  }
})

analyzeRouter.get("/profile/:id", async (c) => {
  const id = c.req.param("id")
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1)
  if (!profile) return c.json({ error: "Profil bulunamadı" }, 404)

  return c.json({
    id: profile.id,
    name: profile.name,
    developer_summary: profile.developerSummary,
    hr_summary: profile.hrSummary,
    skills: profile.skills,
    metadata: profile.metadata ?? {},
  })
})

analyzeRouter.get("/profiles", async (c) => {
  const rows = await db
    .select({ id: profiles.id, name: profiles.name, skills: profiles.skills, createdAt: profiles.createdAt })
    .from(profiles)
    .orderBy(profiles.createdAt)
    .limit(50)
  return c.json(rows)
})
