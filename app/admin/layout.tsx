import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  if (!["REVIEWER", "ADMIN"].includes(session.user.role)) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold text-lg">
              Painel
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link
                href="/admin/sugestoes"
                className="text-muted-foreground hover:text-foreground"
              >
                Sugestões
              </Link>
              <Link
                href="/admin/musicas"
                className="text-muted-foreground hover:text-foreground"
              >
                Músicas
              </Link>
              <Link
                href="/admin/categorias"
                className="text-muted-foreground hover:text-foreground"
              >
                Categorias
              </Link>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin/usuarios"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Usuários
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{session.user.name}</span>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Site
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
