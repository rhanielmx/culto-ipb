import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id || !["REVIEWER", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { id } = await params
  const data = await request.json()

  const song = await prisma.song.findUnique({ where: { id } })
  if (!song) {
    return NextResponse.json({ error: "Música não encontrada" }, { status: 404 })
  }

  await prisma.song.update({
    where: { id },
    data: {
      title: data.title,
      author: data.author,
      lyrics: data.lyrics,
      tone: data.tone,
      hymnNumber: data.hymnNumber,
      bibleReference: data.bibleReference,
      observation: data.observation,
    },
  })

  if (data.categoryIds) {
    await prisma.songCategory.deleteMany({ where: { songId: id } })
    await prisma.songCategory.createMany({
      data: data.categoryIds.map((categoryId: string) => ({
        songId: id,
        categoryId,
      })),
    })
  }

  return NextResponse.json({ success: true })
}
