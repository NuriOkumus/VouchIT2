import { Hono } from "hono"
import { GoogleGenAI } from "@google/genai"
import { db } from "../db/index.js"
import { profiles } from "../db/schema.js"
import { eq } from "drizzle-orm"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const PROMPT = `Analyze this CV/resume and return ONLY a valid JSON object (no markdown, no extra text):
{
  "name": "full name",
  "developer_summary": "2-3 sentences, technical language, specific technologies, years of experience, notable achievements",
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
Include 5-10 most prominent technical skills. Level: junior < 1yr/little evidence, mid 1-3yr, senior 3+yr/leadership.`

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

    if (!file || typeof file === "string") {
      return c.json({ error: "CV dosyası gerekli" }, 400)
    }
    if (!userId) {
      return c.json({ error: "userId gerekli" }, 400)
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const mimeType = (file.type || "application/pdf") as "application/pdf"

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{
        parts: [
          { inlineData: { data: base64, mimeType } },
          { text: PROMPT },
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
