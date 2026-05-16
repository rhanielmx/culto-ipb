import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ReviewForm } from "@/components/review-form"

interface ReviewPageProps {
  params: Promise<{ id: string }>
}

export default async function ReviewSuggestionPage({ params }: ReviewPageProps) {
  const { id } = await params

  const suggestion = await prisma.suggestion.findUnique({
    where: { id },
    include: {
      suggester: { select: { name: true } },
    },
  })

  if (!suggestion || suggestion.status !== "PENDING") {
    notFound()
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{suggestion.title}</h1>
        <p className="text-muted-foreground">
          {suggestion.author} — Sugerido por {suggestion.suggester.name}
        </p>
      </div>

      <ReviewForm suggestion={suggestion} categories={categories} />
    </div>
  )
}
