import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-light text-white">
            Repertório
            <span className="text-[oklch(0.68_0.09_65)]"> IPB</span>
          </h1>
          <p className="mt-2 font-[family-name:var(--font-serif)] text-sm italic text-white/30">
            Entre com sua conta
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
