"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { submitSuggestion } from "@/lib/actions/suggestions"
import Link from "next/link"

export default function SuggestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const result = await submitSuggestion({
      title: form.get("title") as string,
      author: form.get("author") as string,
      lyrics: form.get("lyrics") as string,
      tone: form.get("tone") as string || undefined,
      bibleReference: form.get("bibleReference") as string || undefined,
      note: form.get("note") as string || undefined,
    })

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success("Sugestão enviada com sucesso!")
    router.push("/")
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs tracking-wide uppercase text-white/30 transition-all duration-300 hover:text-white/60"
        >
          <span className="inline-block w-4 h-px bg-white/30" />
          Voltar
        </Link>
      </div>

      <main className="mx-auto max-w-2xl px-6 pb-24">
        <header className="mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-light text-white">
            Sugerir Música
          </h1>
          <p className="mt-2 font-[family-name:var(--font-serif)] text-sm italic text-white/30">
            Sua contribuição será analisada pela comissão
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs tracking-wide uppercase text-white/50">
              Título *
            </Label>
            <Input
              id="title"
              name="title"
              required
              className="h-11 border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/25 transition-all duration-300 focus-visible:border-[oklch(0.68_0.09_65)] focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Título da música"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author" className="text-xs tracking-wide uppercase text-white/50">
              Autor/Compositor *
            </Label>
            <Input
              id="author"
              name="author"
              required
              className="h-11 border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/25 transition-all duration-300 focus-visible:border-[oklch(0.68_0.09_65)] focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Nome do autor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lyrics" className="text-xs tracking-wide uppercase text-white/50">
              Letra *
            </Label>
            <Textarea
              id="lyrics"
              name="lyrics"
              required
              rows={14}
              className="border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/25 transition-all duration-300 focus-visible:border-[oklch(0.68_0.09_65)] focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Digite a letra completa..."
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-xs tracking-wide uppercase text-white/50">
                Tom
              </Label>
              <Input
                id="tone"
                name="tone"
                className="h-11 border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/25 transition-all duration-300 focus-visible:border-[oklch(0.68_0.09_65)] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Ex: G, C, Eb"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bibleReference" className="text-xs tracking-wide uppercase text-white/50">
                Referência Bíblica
              </Label>
              <Input
                id="bibleReference"
                name="bibleReference"
                className="h-11 border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/25 transition-all duration-300 focus-visible:border-[oklch(0.68_0.09_65)] focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Ex: Salmos 23"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-xs tracking-wide uppercase text-white/50">
              Observação
            </Label>
            <Textarea
              id="note"
              name="note"
              rows={3}
              className="border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/25 transition-all duration-300 focus-visible:border-[oklch(0.68_0.09_65)] focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Algum comentário sobre a música?"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-[oklch(0.68_0.09_65)] text-sm tracking-wide text-white transition-all duration-300 hover:bg-[oklch(0.68_0.09_65)/0.9]"
          >
            {loading ? "Enviando..." : "Enviar Sugestão"}
          </Button>
        </form>
      </main>
    </div>
  )
}
