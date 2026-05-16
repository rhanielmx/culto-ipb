"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { reviewSuggestion } from "@/lib/actions/suggestions"

interface ReviewFormProps {
  suggestion: {
    id: string
    title: string
    author: string
    lyrics: string
    tone: string | null
    bibleReference: string | null
  }
  categories: {
    id: string
    name: string
  }[]
}

export function ReviewForm({ suggestion, categories }: ReviewFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editedLyrics, setEditedLyrics] = useState(suggestion.lyrics)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    )
  }

  async function handleApprove(withEdits: boolean) {
    setLoading(true)

    const result = await reviewSuggestion(suggestion.id, {
      status: "APPROVED",
      lyrics: withEdits ? editedLyrics : undefined,
      observation: withEdits
        ? (document.getElementById("observation") as HTMLTextAreaElement)?.value
        : undefined,
      reviewNote: (document.getElementById("reviewNote") as HTMLTextAreaElement)?.value,
      tone: (document.getElementById("tone") as HTMLInputElement)?.value,
      bibleReference: (document.getElementById("bibleRef") as HTMLInputElement)
        ?.value,
      categoryIds: selectedCategories,
    })

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success("Sugestão aprovada!")
    router.push("/admin/sugestoes")
  }

  async function handleReject() {
    setLoading(true)
    const reviewNote = (document.getElementById("reviewNote") as HTMLTextAreaElement)
      ?.value

    const result = await reviewSuggestion(suggestion.id, {
      status: "REJECTED",
      reviewNote,
    })

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success("Sugestão rejeitada")
    router.push("/admin/sugestoes")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
          Letra Original (sugerida)
        </h2>
        <div className="p-4 rounded-lg border bg-muted/50">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {suggestion.lyrics}
          </pre>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Editar (se necessário)</h2>
          <Textarea
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
            rows={15}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-4 p-4 rounded-lg border">
          <h3 className="font-medium">Informações adicionais</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tom</Label>
              <Input
                id="tone"
                defaultValue={suggestion.tone || ""}
                placeholder="Ex: G"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bibleRef">Ref. Bíblica</Label>
              <Input
                id="bibleRef"
                defaultValue={suggestion.bibleReference || ""}
                placeholder="Ex: Salmos 23"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categorias *</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={selectedCategories.includes(cat.id)}
                    onCheckedChange={() => toggleCategory(cat.id)}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma categoria cadastrada.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observation">
              Justificativa da alteração
            </Label>
            <Textarea
              id="observation"
              placeholder="Explique por que a letra foi alterada..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewNote">Parecer (opcional)</Label>
            <Textarea
              id="reviewNote"
              placeholder="Comentário para o sugeridor..."
              rows={2}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => handleApprove(false)}
            disabled={loading || selectedCategories.length === 0}
            variant="default"
            className="flex-1 bg-green-700 hover:bg-green-800 text-white"
          >
            Aprovar
          </Button>
          <Button
            onClick={() => handleApprove(true)}
            disabled={loading || selectedCategories.length === 0}
            variant="outline"
            className="flex-1"
          >
            Aprovar com alterações
          </Button>
          <Button
            onClick={handleReject}
            disabled={loading}
            variant="destructive"
            className="flex-1"
          >
            Rejeitar
          </Button>
        </div>
      </div>
    </div>
  )
}
