"use client"
import { useSession } from "next-auth/react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"

export default function UploadPage() {
  const { data: session, status } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
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
          onClick={() => inputRef.current?.click()}
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
        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
          disabled={!file}
          onClick={() => console.log("upload", file?.name, session?.user?.email)}
        >
          Analiz Et
        </Button>
      </div>
    </main>
  )
}
