import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function AdminSongsPage() {
  const songs = await prisma.song.findMany({
    include: {
      categories: {
        include: { category: true },
      },
    },
    orderBy: { title: "asc" },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Músicas</h1>

      <div className="space-y-3">
        {songs.map((song) => (
          <div
            key={song.id}
            className="p-4 rounded-lg border bg-card flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">{song.title}</h3>
              <p className="text-sm text-muted-foreground">{song.author}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {song.categories.map((sc) => (
                  <Badge key={sc.category.id} variant="outline" className="text-xs">
                    {sc.category.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/musicas/${song.id}`}>
                <Button variant="outline" size="sm">
                  Ver
                </Button>
              </Link>
              <Link href={`/admin/musicas/${song.id}`}>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </Link>
            </div>
          </div>
        ))}

        {songs.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            Nenhuma música cadastrada.
          </div>
        )}
      </div>
    </div>
  )
}
