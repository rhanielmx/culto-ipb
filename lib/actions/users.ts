"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function createUser(data: {
  name: string
  email: string
  password: string
  role: "MEMBER" | "REVIEWER" | "ADMIN"
}) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { error: "Não autorizado" }
  }

  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existing) {
    return { error: "Email já cadastrado" }
  }

  const hashedPassword = await bcrypt.hash(data.password, 12)

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  })

  revalidatePath("/admin/usuarios")
  return { success: true }
}
