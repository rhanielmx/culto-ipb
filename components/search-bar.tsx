import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  return (
    <form action="/busca" method="GET" className="relative mx-auto max-w-xl">
      <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />
      <Input
        name="q"
        placeholder="Buscar música, autor, letra..."
        className="h-12 border border-white/[0.08] bg-white/[0.04] pl-11 text-sm text-white/80 placeholder:text-white/25 transition-all duration-300 focus-visible:border-[oklch(0.68_0.09_65)] focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </form>
  )
}
