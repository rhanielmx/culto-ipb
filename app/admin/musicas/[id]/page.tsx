import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { EditSongForm } from "@/components/edit-song-form"

interface EditSongPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSongPage({ params }: EditSongPageProps) {
  const { id } = await params

  const song = await prisma.song.findUnique({
    where: { id },
    include: {
      categories: {
        include: { category: true },
      },
      videos: true,
    },
  })

  if (!song) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Editar: {song.title}</h1>
      <EditSongForm song={song} categories={categories} />
    </div>
  )
}
