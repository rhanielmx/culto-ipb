import Link from "next/link"

interface CategoryCardProps {
  name: string
  count: number
}

export function CategoryCard({ name, count }: CategoryCardProps) {
  return (
    <Link
      href={`/busca?categoria=${encodeURIComponent(name)}`}
      className="group relative block rounded-sm border-l-2 border-white/[0.06] bg-white/[0.03] px-5 py-5 transition-all duration-300 hover:border-l-[oklch(0.68_0.09_65)] hover:bg-white/[0.06]"
    >
      <h3 className="font-[family-name:var(--font-display)] text-lg font-light text-white/80 transition-colors duration-300 group-hover:text-white">
        {name}
      </h3>
      <p className="mt-1 font-[family-name:var(--font-serif)] text-sm italic text-white/30">
        {count} {count === 1 ? "música" : "músicas"}
      </p>
    </Link>
  )
}
