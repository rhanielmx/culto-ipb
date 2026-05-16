"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { createCategory } from "@/lib/actions/categories"

export function CategoryForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const name = form.get("name") as string

    const result = await createCategory(name)
    if (result.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success("Categoria criada!")
    router.refresh()
    ;(e.target as HTMLFormElement).reset()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1">
        <Label htmlFor="name" className="sr-only">
          Nome
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex: Abertura, Ceia..."
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "..." : "Criar"}
      </Button>
    </form>
  )
}
