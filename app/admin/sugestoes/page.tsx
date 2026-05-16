import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const statusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" as const,
  APPROVED: "bg-green-500/10 text-green-600 border-green-500/20" as const,
  REJECTED: "bg-red-500/10 text-red-600 border-red-500/20" as const,
}

const statusLabels = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
}

export default async function SuggestionsPage() {
  const suggestions = await prisma.suggestion.findMany({
    include: {
      suggester: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Sugestões</h1>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-4 rounded-lg border bg-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {suggestion.author} — Sugerido por {suggestion.suggester.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(suggestion.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={statusColors[suggestion.status]}
                >
                  {statusLabels[suggestion.status]}
                </Badge>
                {suggestion.status === "PENDING" && (
                  <Link href={`/admin/sugestoes/${suggestion.id}`}>
                    <Button variant="outline" size="sm">
                      Revisar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            {suggestion.reviewNote && (
              <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                <span className="font-medium">Parecer:</span> {suggestion.reviewNote}
              </p>
            )}
          </div>
        ))}

        {suggestions.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            Nenhuma sugestão ainda.
          </div>
        )}
      </div>
    </div>
  )
}
