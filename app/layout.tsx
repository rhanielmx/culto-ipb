import type { Metadata } from "next"
import { Newsreader, Source_Serif_4, Outfit } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const fontDisplay = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
})

const fontBody = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
})

const fontSans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Repertório IPB",
  description: "Repertório musical da Igreja Presbiteriana",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[oklch(0.11_0.025_160)] bg-[radial-gradient(ellipse_at_top,_oklch(0.15_0.03_160)_0%,_oklch(0.10_0.02_160)_100%)]">
        <main className="flex-1">{children}</main>
        <Toaster
          toastOptions={{
            className: "font-sans text-sm",
          }}
        />
      </body>
    </html>
  )
}
