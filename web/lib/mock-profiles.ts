import type { Profile } from "./api"

export const MOCK_PROFILES: Record<string, Profile> = {
  "onur-sahin": {
    id: "onur-sahin",
    name: "Onur Şahin",
    developer_summary: "Principal Engineer with 12 years building distributed systems at scale. Deep expertise in event streaming (Kafka), schema registries, and Go microservices. Currently leading platform infrastructure at a Berlin-based fintech processing €2B+ per year.",
    hr_summary: "Seasoned Principal Engineer with a track record of technical leadership across high-scale distributed systems. Excels at cross-functional collaboration, mentoring senior engineers, and driving architectural decisions that balance delivery speed with long-term quality.",
    skills: [
      { name: "Go",         level: "senior", verified: true,  evidenceCount: 23 },
      { name: "Kafka",      level: "senior", verified: false, evidenceCount: 8  },
      { name: "PostgreSQL", level: "senior", verified: false, evidenceCount: 14 },
      { name: "Protobuf",   level: "mid",    verified: false, evidenceCount: 5  },
      { name: "Python",     level: "mid",    verified: true,  evidenceCount: 7  },
      { name: "ClickHouse", level: "mid",    verified: false, evidenceCount: 4  },
    ],
    metadata: {
      title: "Principal Engineer",
      location: "Berlin, Germany",
      yearsExperience: 12,
      highlights: [
        "Built go-schema-registry — 1.2k stars, used by 200+ companies in production",
        "Led migration of event bus from RabbitMQ to Kafka, now handling 40M messages/day",
        "Reduced Avro schema validation latency 40% via union type caching",
      ],
      githubLanguages: [
        { name: "Go",         pct: 79, color: "#00ADD8" },
        { name: "Python",     pct: 13, color: "#3572A5" },
        { name: "TypeScript", pct: 8,  color: "#3178C6" },
      ],
      githubRepos: 34,
      githubStars: 1284,
      githubUsername: "onursh",
    },
  },

  "elif-yildiz": {
    id: "elif-yildiz",
    name: "Elif Yıldız",
    developer_summary: "Senior Backend Engineer with 6 years focused on ML serving infrastructure and high-throughput data pipelines. Extensive experience with Python/Django, async task systems, and AWS. Contributor to insider/ml-serving at Insider.",
    hr_summary: "Results-driven Senior Backend Engineer with strong ownership across the full backend stack. Brings deep expertise in ML infrastructure and a collaborative approach to cross-team delivery.",
    skills: [
      { name: "Python",  level: "senior", verified: true,  evidenceCount: 19 },
      { name: "Django",  level: "senior", verified: false, evidenceCount: 11 },
      { name: "AWS",     level: "mid",    verified: false, evidenceCount: 6  },
      { name: "Redis",   level: "mid",    verified: false, evidenceCount: 7  },
      { name: "Celery",  level: "mid",    verified: false, evidenceCount: 5  },
      { name: "TypeScript", level: "mid", verified: true,  evidenceCount: 4  },
    ],
    metadata: {
      title: "Senior Backend Engineer",
      location: "Izmir, Turkey",
      yearsExperience: 6,
      highlights: [
        "Built async cache warm-up system that cut cold-start latency on ML models by 65%",
        "Migrated monolithic Django app to service-oriented architecture — zero downtime",
        "Reduced Celery task queue backlog from hours to under 90s during peak traffic",
      ],
      githubLanguages: [
        { name: "Python",     pct: 71, color: "#3572A5" },
        { name: "TypeScript", pct: 18, color: "#3178C6" },
        { name: "Shell",      pct: 11, color: "#89E051" },
      ],
      githubRepos: 21,
      githubStars: 143,
      githubUsername: "elyildiz",
    },
  },

  "mert-kaya": {
    id: "mert-kaya",
    name: "Mert Kaya",
    developer_summary: "Staff Engineer at Trendyol with 9 years of backend experience. Specializes in event-driven architectures, distributed tracing, and high-reliability order processing systems that serve millions of daily transactions.",
    hr_summary: "Technically strong Staff Engineer who combines deep systems knowledge with the ability to unblock teams and align engineering efforts across the organization. Known for clear communication and practical pragmatism.",
    skills: [
      { name: "Go",           level: "senior", verified: true,  evidenceCount: 17 },
      { name: "Kafka",        level: "senior", verified: false, evidenceCount: 9  },
      { name: "PostgreSQL",   level: "senior", verified: false, evidenceCount: 12 },
      { name: "Kubernetes",   level: "mid",    verified: false, evidenceCount: 6  },
      { name: "OpenTelemetry",level: "mid",    verified: false, evidenceCount: 4  },
    ],
    metadata: {
      title: "Staff Engineer",
      location: "Ankara, Turkey",
      yearsExperience: 9,
      highlights: [
        "Resolved duplicate-event bug in Kafka consumer causing 0.3% order loss at 2M orders/day",
        "Designed distributed tracing layer across 14 microservices using OpenTelemetry",
        "Led rewrite of order router service — p99 latency dropped from 340ms to 28ms",
      ],
      githubLanguages: [
        { name: "Go",   pct: 84, color: "#00ADD8" },
        { name: "Shell",pct: 10, color: "#89E051" },
        { name: "Python",pct: 6, color: "#3572A5" },
      ],
      githubRepos: 18,
      githubStars: 87,
      githubUsername: "mertkaya",
    },
  },

  "berk-toprak": {
    id: "berk-toprak",
    name: "Berk Toprak",
    developer_summary: "Backend Engineer with 4 years building high-performance networking tools in Rust and Go. Active OSS contributor, 2× Rustacean of the Month. Specializes in async runtimes (Tokio), WASM compilation targets, and low-latency systems.",
    hr_summary: "Passionate systems engineer with a strong open-source track record and a focus on correctness and performance. Self-directed, works effectively remote, and actively contributes to the broader Rust community.",
    skills: [
      { name: "Rust",  level: "senior", verified: true,  evidenceCount: 14 },
      { name: "Go",    level: "mid",    verified: true,  evidenceCount: 9  },
      { name: "WASM",  level: "mid",    verified: true,  evidenceCount: 6  },
      { name: "Tokio", level: "mid",    verified: false, evidenceCount: 5  },
      { name: "Redis", level: "mid",    verified: false, evidenceCount: 4  },
    ],
    metadata: {
      title: "Backend Engineer",
      location: "Remote",
      yearsExperience: 4,
      highlights: [
        "2× Rustacean of the Month — recognized for async runtime contributions",
        "Built WASM-compiled networking library adopted by 3 production systems",
        "Reduced memory allocations 60% in hot path via custom arena allocator",
      ],
      githubLanguages: [
        { name: "Rust", pct: 68, color: "#DEA584" },
        { name: "Go",   pct: 22, color: "#00ADD8" },
        { name: "C",    pct: 10, color: "#555555" },
      ],
      githubRepos: 29,
      githubStars: 412,
      githubUsername: "berktp",
    },
  },

  "zeynep-koc": {
    id: "zeynep-koc",
    name: "Zeynep Koç",
    developer_summary: "Senior SRE with 7 years of experience running Kubernetes-based platforms for high-traffic consumer apps. Deep expertise in GitOps (ArgoCD), observability stacks, and incident management across multi-cluster environments.",
    hr_summary: "Reliable and detail-oriented Senior SRE who thrives in high-pressure environments. Combines strong platform engineering skills with a calm, structured approach to incident response and capacity planning.",
    skills: [
      { name: "Kubernetes",  level: "senior", verified: false, evidenceCount: 13 },
      { name: "ArgoCD",      level: "senior", verified: false, evidenceCount: 8  },
      { name: "Terraform",   level: "mid",    verified: false, evidenceCount: 7  },
      { name: "Prometheus",  level: "mid",    verified: false, evidenceCount: 6  },
      { name: "Go",          level: "mid",    verified: true,  evidenceCount: 5  },
      { name: "Python",      level: "mid",    verified: true,  evidenceCount: 4  },
    ],
    metadata: {
      title: "Senior SRE",
      location: "Istanbul, Turkey",
      yearsExperience: 7,
      highlights: [
        "Migrated app-of-apps to ArgoCD 2.11 with zero service disruption across 6 clusters",
        "Reduced MTTD from 11 minutes to under 90 seconds via custom alerting pipeline",
        "Built on-call runbook system adopted by 4 engineering teams",
      ],
      githubLanguages: [
        { name: "Go",     pct: 44, color: "#00ADD8" },
        { name: "Python", pct: 31, color: "#3572A5" },
        { name: "Shell",  pct: 25, color: "#89E051" },
      ],
      githubRepos: 15,
      githubStars: 61,
      githubUsername: "zeynepkoc",
    },
  },

  "can-ucar": {
    id: "can-ucar",
    name: "Can Uçar",
    developer_summary: "Backend Engineer with 3 years specializing in real-time systems and leaderboard infrastructure. Replaced long-polling architectures with WebSocket pub-sub at Peak Games, cutting latency from 200ms to 12ms.",
    hr_summary: "Energetic and fast-learning Backend Engineer who delivers measurable performance improvements early in their career. Collaborative team player with a strong focus on user-facing latency and real-time features.",
    skills: [
      { name: "Go",        level: "mid",    verified: true,  evidenceCount: 8  },
      { name: "WebSocket", level: "mid",    verified: false, evidenceCount: 5  },
      { name: "Redis",     level: "mid",    verified: false, evidenceCount: 6  },
      { name: "PostgreSQL",level: "mid",    verified: false, evidenceCount: 4  },
      { name: "TypeScript",level: "junior", verified: true,  evidenceCount: 3  },
    ],
    metadata: {
      title: "Backend Engineer",
      location: "Istanbul, Turkey",
      yearsExperience: 3,
      highlights: [
        "Cut leaderboard update latency from 200ms to 12ms by replacing polling with WebSocket pub-sub",
        "Built score-sync service handling 50k concurrent connections at peak",
        "Reduced Redis memory footprint 35% via key expiry redesign",
      ],
      githubLanguages: [
        { name: "Go",         pct: 61, color: "#00ADD8" },
        { name: "TypeScript", pct: 28, color: "#3178C6" },
        { name: "Python",     pct: 11, color: "#3572A5" },
      ],
      githubRepos: 12,
      githubStars: 34,
      githubUsername: "canucar",
    },
  },

  "deniz-aksoy": {
    id: "deniz-aksoy",
    name: "Deniz Aksoy",
    developer_summary: "Tech Lead at Yapı Kredi with 8 years in enterprise backend systems. Currently leading a team of 7 migrating core banking services from a monolith to event-driven microservices using Java, Spring Boot, Kafka, and Kubernetes.",
    hr_summary: "Strategic Tech Lead with proven experience managing engineering teams and delivering large-scale modernization initiatives within regulated industries. Strong communicator who bridges technical and business stakeholders effectively.",
    skills: [
      { name: "Java",        level: "senior", verified: false, evidenceCount: 16 },
      { name: "Spring Boot", level: "senior", verified: false, evidenceCount: 12 },
      { name: "Kafka",       level: "mid",    verified: false, evidenceCount: 7  },
      { name: "Kubernetes",  level: "mid",    verified: false, evidenceCount: 5  },
      { name: "PostgreSQL",  level: "mid",    verified: false, evidenceCount: 8  },
    ],
    metadata: {
      title: "Tech Lead",
      location: "Istanbul, Turkey",
      yearsExperience: 8,
      highlights: [
        "Leading migration of core banking monolith to microservices — 3 of 12 services live",
        "Built event-sourcing framework adopted across 4 teams in the bank",
        "Reduced average deployment time from 2 hours to 18 minutes via CI/CD overhaul",
      ],
      githubLanguages: [
        { name: "Java",   pct: 72, color: "#B07219" },
        { name: "Kotlin", pct: 18, color: "#A97BFF" },
        { name: "Shell",  pct: 10, color: "#89E051" },
      ],
      githubRepos: 9,
      githubStars: 22,
    },
  },
}
