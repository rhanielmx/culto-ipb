import { prisma } from "@/lib/prisma"
import { CategoryForm } from "@/components/category-form"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { songs: true } },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Categorias</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Nova Categoria</h2>
          <CategoryForm />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Categorias Existentes</h2>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-3 rounded-lg border bg-card flex items-center justify-between"
              >
                <span className="font-medium">{cat.name}</span>
                <span className="text-sm text-muted-foreground">
                  {cat._count.songs} {cat._count.songs === 1 ? "música" : "músicas"}
                </span>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Nenhuma categoria cadastrada.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
