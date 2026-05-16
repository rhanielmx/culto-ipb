import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { SearchBar } from "@/components/search-bar"

interface SearchPageProps {
  searchParams: Promise<{ q?: string; categoria?: string }>
}

function escapeLike(value: string) {
  return value.replace(/[%_\\]/g, "\\$&")
}

async function searchSongs(q?: string, categoria?: string) {
  let ids: string[] | undefined

  if (q) {
    const term = `%${escapeLike(q)}%`
    const raw = await prisma.$queryRaw<{ id: string }[]>`
      SELECT s.id FROM "Song" s
      WHERE s.status = 'PUBLISHED'
        AND (
          unaccent(s.title) ILIKE unaccent(${term})
          OR unaccent(s.lyrics) ILIKE unaccent(${term})
          OR unaccent(s.author) ILIKE unaccent(${term})
        )
    `
    ids = raw.map((r) => r.id)
  }

  if (ids && ids.length === 0) return []

  return prisma.song.findMany({
    where: {
      status: "PUBLISHED",
      ...(ids ? { id: { in: ids } } : {}),
      ...(categoria
        ? { categories: { some: { category: { name: categoria } } } }
        : {}),
    },
    include: { categories: { include: { category: true } } },
    orderBy: [{ title: "asc" }],
  })
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, categoria } = await searchParams

  const songs = await searchSongs(q, categoria)

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs tracking-wide uppercase text-white/30 transition-all duration-300 hover:text-white/60"
            >
              <span className="inline-block w-4 h-px bg-white/30 transition-all duration-300 group-hover:w-6" />
              Voltar
            </Link>
          </div>
          <SearchBar />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {q && (
          <p className="font-[family-name:var(--font-serif)] text-sm italic text-white/40">
            Resultados para:{" "}
            <span className="not-italic text-white/70 font-[family-name:var(--font-sans)]">
              {q}
            </span>
          </p>
        )}
        {categoria && (
          <p className="font-[family-name:var(--font-serif)] text-sm italic text-white/40">
            Categoria:{" "}
            <span className="not-italic text-white/70 font-[family-name:var(--font-sans)]">
              {categoria}
            </span>
          </p>
        )}

        <div className="mt-8 space-y-1">
          {songs.map((song) => (
            <Link
              key={song.id}
              href={`/musicas/${song.id}`}
              className="group flex items-center justify-between border-l-2 border-transparent px-4 py-3 transition-all duration-300 hover:border-l-[oklch(0.68_0.09_65)] hover:bg-white/[0.03]"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-[family-name:var(--font-display)] text-base font-light text-white/70 transition-colors duration-300 group-hover:text-white">
                  {song.title}
                </h2>
                <p className="mt-0.5 font-[family-name:var(--font-serif)] text-sm italic text-white/30">
                  {song.author}
                </p>
              </div>
              <div className="ml-4 flex shrink-0 items-center gap-3">
                {song.tone && (
                  <span className="font-[family-name:var(--font-serif)] text-xs italic text-[oklch(0.68_0.09_65)]">
                    {song.tone}
                  </span>
                )}
                <div className="hidden gap-2 sm:flex">
                  {song.categories.map((sc) => (
                    <span
                      key={sc.category.id}
                      className="inline-block rounded-full border border-white/[0.06] px-2.5 py-0.5 font-[family-name:var(--font-serif)] text-[11px] italic text-white/25"
                    >
                      {sc.category.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {songs.length === 0 && (q || categoria) && (
          <div className="py-24 text-center">
            <p className="font-[family-name:var(--font-serif)] text-lg italic text-white/30">
              Nenhuma música encontrada
            </p>
            <p className="mt-2 font-[family-name:var(--font-serif)] text-sm italic text-white/20">
              Tente outros termos ou navegue pelas categorias
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
