import type { Metadata } from "next"
import { Inter_Tight, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import SessionProvider from "@/components/SessionProvider"
import { auth } from "@/auth"

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "VouchIT",
  description: "Let your code speak.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en" className={`${interTight.variable} ${jetbrainsMono.variable}`} style={{ height: "100%" }}>
      <body style={{ height: "100%", position: "relative" }}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
