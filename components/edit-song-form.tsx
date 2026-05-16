"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

interface EditSongFormProps {
  song: {
    id: string
    title: string
    originalTitle: string | null
    author: string
    originalAuthor: string | null
    lyrics: string
    originalLyrics: string | null
    observation: string | null
    tone: string | null
    hymnNumber: string | null
    bibleReference: string | null
    categories: { category: { id: string; name: string } }[]
  }
  categories: { id: string; name: string }[]
}

export function EditSongForm({ song, categories }: EditSongFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    song.categories.map((sc) => sc.category.id)
  )

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    const res = await fetch(`/api/musicas/${song.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        author: form.get("author"),
        lyrics: form.get("lyrics"),
        tone: form.get("tone") || null,
        hymnNumber: form.get("hymnNumber") || null,
        bibleReference: form.get("bibleReference") || null,
        observation: form.get("observation") || null,
        categoryIds: selectedCategories,
      }),
    })

    if (!res.ok) {
      toast.error("Erro ao salvar")
      setLoading(false)
      return
    }

    toast.success("Música atualizada!")
    router.refresh()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            defaultValue={song.title}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Autor</Label>
          <Input
            id="author"
            name="author"
            defaultValue={song.author}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tone">Tom</Label>
          <Input
            id="tone"
            name="tone"
            defaultValue={song.tone || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hymnNumber">Nº Hinário</Label>
          <Input
            id="hymnNumber"
            name="hymnNumber"
            defaultValue={song.hymnNumber || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bibleReference">Ref. Bíblica</Label>
          <Input
            id="bibleReference"
            name="bibleReference"
            defaultValue={song.bibleReference || ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lyrics">Letra</Label>
        <Textarea
          id="lyrics"
          name="lyrics"
          defaultValue={song.lyrics}
          rows={15}
          className="font-mono text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observation">Justificativa (se editada)</Label>
        <Textarea
          id="observation"
          name="observation"
          defaultValue={song.observation || ""}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Categorias</Label>
        <div className="grid grid-cols-3 gap-2">
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
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  )
}
