"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      toast.error("Email ou senha inválidos")
      setLoading(false)
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs tracking-wide uppercase text-white/50">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="h-11 border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/25 transition-all duration-300 focus-visible:border-[oklch(0.68_0.09_65)] focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="seu@email.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs tracking-wide uppercase text-white/50">
          Senha
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="h-11 border-white/[0.08] bg-white/[0.04] text-sm text-white/80 placeholder:text-white/25 transition-all duration-300 focus-visible:border-[oklch(0.68_0.09_65)] focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="••••••••"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-[oklch(0.68_0.09_65)] text-sm tracking-wide text-white transition-all duration-300 hover:bg-[oklch(0.68_0.09_65)/0.9]"
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  )
}
