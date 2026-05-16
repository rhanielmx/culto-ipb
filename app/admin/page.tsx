import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function AdminDashboard() {
  const [pendingCount, songsCount, categoriesCount] = await Promise.all([
    prisma.suggestion.count({ where: { status: "PENDING" } }),
    prisma.song.count({ where: { status: "PUBLISHED" } }),
    prisma.category.count(),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/sugestoes"
          className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <p className="text-3xl font-bold text-[#ce9768]">{pendingCount}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Sugestões pendentes
          </p>
        </Link>
        <div className="p-6 rounded-lg border bg-card">
          <p className="text-3xl font-bold text-[#0e4f35]">{songsCount}</p>
          <p className="text-sm text-muted-foreground mt-1">Músicas publicadas</p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <p className="text-3xl font-bold text-[#0e4f35]">{categoriesCount}</p>
          <p className="text-sm text-muted-foreground mt-1">Categorias</p>
        </div>
      </div>
    </div>
  )
}
