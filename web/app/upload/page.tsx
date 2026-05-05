"use client"
import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"
import { uploadCV } from "@/lib/api"

export default function UploadPage() {
  const { data: session, status } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  async function handleSubmit() {
    if (!file || !session?.user?.email) return
    setLoading(true)
    setError(null)
    try {
      const profile = await uploadCV(file, session.user.email)
      router.push(`/p/${profile.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">CV Yükle</h1>
          <p className="text-zinc-500 mt-1">Merhaba, {session?.user?.name}</p>
        </div>
        <Card
          className="border-2 border-dashed border-zinc-200 rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer hover:border-emerald-400 transition-colors"
          onClick={() => !loading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const dropped = e.dataTransfer.files[0]
            if (dropped) setFile(dropped)
          }}
        >
          <Upload className="text-zinc-400" size={32} />
          <p className="text-zinc-500 text-center text-sm">
            {file ? file.name : "PDF veya DOCX sürükle ya da tıkla"}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </Card>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          disabled={!file || loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Analiz ediliyor...
            </span>
          ) : "Analiz Et"}
        </Button>
      </div>
    </main>
  )
}
