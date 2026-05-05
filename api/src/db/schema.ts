import { pgTable, text, timestamp, jsonb, uuid } from "drizzle-orm/pg-core"

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
  githubAvatar?: string
  githubUsername?: string
  githubContributions?: number[]
}

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  developerSummary: text("developer_summary").notNull(),
  hrSummary: text("hr_summary").notNull(),
  skills: jsonb("skills").$type<Skill[]>().notNull(),
  metadata: jsonb("metadata").$type<ProfileMetadata>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
