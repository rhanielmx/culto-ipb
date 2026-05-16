import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface MusicPageProps {
  params: Promise<{ id: string }>
}

export default async function MusicPage({ params }: MusicPageProps) {
  const { id } = await params

  const song = await prisma.song.findUnique({
    where: { id },
    include: {
      categories: {
        include: { category: true },
      },
      videos: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!song || song.status !== "PUBLISHED") {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs tracking-wide uppercase text-white/30 transition-all duration-300 hover:text-white/60"
        >
          <span className="inline-block w-4 h-px bg-white/30 transition-all duration-300 group-hover:w-6" />
          Voltar
        </Link>
      </div>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        <header className="mb-12">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-light leading-tight text-white">
            {song.title}
          </h1>

          {song.author && (
            <p className="mt-3 font-[family-name:var(--font-serif)] text-base italic text-white/40">
              {song.author}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {song.categories.map((sc) => (
              <span
                key={sc.category.id}
                className="inline-block rounded-full border border-white/[0.08] px-3 py-1 font-[family-name:var(--font-serif)] text-xs italic text-white/40"
              >
                {sc.category.name}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/30">
            {song.tone && (
              <span>
                Tom:{" "}
                <span className="text-[oklch(0.68_0.09_65)]">
                  {song.tone}
                </span>
              </span>
            )}
            {song.hymnNumber && <span>Hinário nº {song.hymnNumber}</span>}
            {song.bibleReference && <span>{song.bibleReference}</span>}
          </div>
        </header>

        <Separator className="bg-white/[0.06]" />

        <section className="mt-10">
          <div className="font-[family-name:var(--font-serif)] leading-[1.8] text-white/85 text-[1.05rem] whitespace-pre-wrap tracking-wide">
            {song.lyrics}
          </div>
        </section>

        {song.observation && (
          <div className="mt-10 border-l-2 border-[oklch(0.68_0.09_65)] bg-[oklch(0.68_0.09_65)]/[0.04] px-5 py-4">
            <p className="font-[family-name:var(--font-serif)] text-xs italic uppercase tracking-wider text-[oklch(0.68_0.09_65)]">
              Observação sobre a letra
            </p>
            <p className="mt-2 font-[family-name:var(--font-serif)] text-sm leading-relaxed text-white/60">
              {song.observation}
            </p>
          </div>
        )}

        {song.videos.length > 0 && (
          <>
            <Separator className="my-12 bg-white/[0.06]" />
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-white">
                Vídeos
              </h2>
              <div className="mt-6 space-y-8">
                {song.videos.map((video) => (
                  <div key={video.id}>
                    {video.label && (
                      <p className="mb-3 font-[family-name:var(--font-serif)] text-sm italic text-white/30">
                        {video.label}
                      </p>
                    )}
                    <div className="overflow-hidden rounded-sm border border-white/[0.06]">
                      <div className="aspect-video">
                        <iframe
                          src={video.url.replace("watch?v=", "embed/")}
                          className="size-full"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
