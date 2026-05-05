import SignInButtons from "@/components/SignInButtons"

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full text-center">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900">VouchIT</h1>
          <p className="text-lg text-zinc-500">GitHub konuşsun, sen yazma.</p>
        </div>
        <SignInButtons />
        <p className="text-sm text-zinc-400">
          Developer&apos;ın diliyle profil. İK&apos;nın diliyle çeviri.
        </p>
      </div>
    </main>
  )
}
