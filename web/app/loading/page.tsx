"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoadingPage() {
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => router.push("/p/demo"), 10_000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-600 text-lg text-center px-4">
        AI commit&apos;lerini ve CV&apos;ni analiz ediyor...
      </p>
    </main>
  )
}
