"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitSuggestion(data: {
  title: string
  author: string
  lyrics: string
  tone?: string
  bibleReference?: string
  note?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Não autorizado" }
  }

  await prisma.suggestion.create({
    data: {
      title: data.title,
      author: data.author,
      lyrics: data.lyrics,
      tone: data.tone,
      bibleReference: data.bibleReference,
      note: data.note,
      suggestedBy: session.user.id,
    },
  })

  revalidatePath("/")
  return { success: true }
}

export async function reviewSuggestion(
  suggestionId: string,
  data: {
    status: "APPROVED" | "REJECTED"
    lyrics?: string
    tone?: string
    bibleReference?: string
    observation?: string
    reviewNote?: string
    categoryIds?: string[]
  }
) {
  const session = await auth()
  if (!session?.user?.id || !["REVIEWER", "ADMIN"].includes(session.user.role)) {
    return { error: "Não autorizado" }
  }

  const suggestion = await prisma.suggestion.findUnique({
    where: { id: suggestionId },
  })

  if (!suggestion) {
    return { error: "Sugestão não encontrada" }
  }

  if (data.status === "APPROVED") {
    const lyrics = data.lyrics || suggestion.lyrics
    const hasEdits = data.lyrics && data.lyrics !== suggestion.lyrics

    const songData = {
      title: suggestion.title,
      originalTitle: hasEdits ? suggestion.title : undefined,
      author: suggestion.author,
      lyrics,
      originalLyrics: hasEdits ? suggestion.lyrics : undefined,
      observation: data.observation,
      tone: data.tone || suggestion.tone,
      bibleReference: data.bibleReference || suggestion.bibleReference,
      status: "PUBLISHED" as const,
      createdBy: suggestion.suggestedBy,
    }

    const song = await prisma.song.create({ data: songData })

    if (data.categoryIds && data.categoryIds.length > 0) {
      await prisma.songCategory.createMany({
        data: data.categoryIds.map((categoryId) => ({
          songId: song.id,
          categoryId,
        })),
      })
    }

    await prisma.suggestion.update({
      where: { id: suggestionId },
      data: {
        status: "APPROVED",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        reviewNote: data.reviewNote,
        songId: song.id,
      },
    })
  } else {
    await prisma.suggestion.update({
      where: { id: suggestionId },
      data: {
        status: "REJECTED",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        reviewNote: data.reviewNote,
      },
    })
  }

  revalidatePath("/admin/sugestoes")
  return { success: true }
}
