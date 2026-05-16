import { prisma } from "@/lib/prisma"
import { CategoryCard } from "@/components/category-card"
import { SearchBar } from "@/components/search-bar"
import Link from "next/link"

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { songs: true } },
      },
      orderBy: { name: "asc" },
    })
    return categories
  } catch {
    return []
  }
}

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-light tracking-tight text-white">
              Repertório
              <span className="text-[oklch(0.68_0.09_65)]"> IPB</span>
            </h1>
            <div className="flex items-center gap-6">
              <Link
                href="/busca"
                className="text-white/50 hover:text-white transition-all duration-300 text-sm tracking-wide uppercase"
              >
                Buscar
              </Link>
              <Link
                href="/auth/login"
                className="text-sm text-white/50 hover:text-white transition-all duration-300 tracking-wide uppercase"
              >
                Entrar
              </Link>
            </div>
          </div>
          <SearchBar />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12">
          <p className="font-[family-name:var(--font-serif)] text-white/40 text-sm italic tracking-wide">
            Navegue por categoria
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              count={category._count.songs}
            />
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-24">
            <p className="font-[family-name:var(--font-serif)] text-white/40 text-lg italic">
              Nenhuma categoria cadastrada ainda.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-[family-name:var(--font-serif)] text-white/30 text-xs italic text-center">
            Soli Deo Gloria
          </p>
        </div>
      </footer>
    </div>
  )
}
