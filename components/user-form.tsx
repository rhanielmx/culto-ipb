"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { createUser } from "@/lib/actions/users"

export function UserForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const result = await createUser({
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      role: form.get("role") as "MEMBER" | "REVIEWER" | "ADMIN",
    })

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success("Usuário criado!")
    router.refresh()
    ;(e.target as HTMLFormElement).reset()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" required placeholder="Nome completo" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="email@igreja.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha temporária</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Papel</Label>
        <Select name="role" defaultValue="MEMBER">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MEMBER">Membro do Louvor</SelectItem>
            <SelectItem value="REVIEWER">Comissão de Análise</SelectItem>
            <SelectItem value="ADMIN">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Criando..." : "Criar Usuário"}
      </Button>
    </form>
  )
}
