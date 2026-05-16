"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createCategory(name: string) {
  const session = await auth()
  if (!session?.user?.id || !["REVIEWER", "ADMIN"].includes(session.user.role)) {
    return { error: "Não autorizado" }
  }

  const trimmed = name.trim()
  if (!trimmed) {
    return { error: "Nome é obrigatório" }
  }

  const existing = await prisma.category.findUnique({
    where: { name: trimmed },
  })

  if (existing) {
    return { error: "Categoria já existe" }
  }

  await prisma.category.create({ data: { name: trimmed } })

  revalidatePath("/admin/categorias")
  return { success: true }
}
