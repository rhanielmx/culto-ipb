import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserForm } from "@/components/user-form"
import { Badge } from "@/components/ui/badge"

const roleLabels: Record<string, string> = {
  MEMBER: "Membro",
  REVIEWER: "Revisor",
  ADMIN: "Admin",
}

const roleColors: Record<string, string> = {
  MEMBER: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  REVIEWER: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  ADMIN: "bg-red-500/10 text-red-600 border-red-500/20",
}

export default async function AdminUsersPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin")
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Usuários</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Novo Usuário</h2>
          <UserForm />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Usuários Cadastrados</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-3 rounded-lg border bg-card flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{user.name || "Sem nome"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge
                  variant="outline"
                  className={roleColors[user.role]}
                >
                  {roleLabels[user.role]}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
