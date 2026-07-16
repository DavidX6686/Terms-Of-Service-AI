"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<"form" | "verify">("form")
  const [code, setCode] = useState("")

  const isSignup = mode === "signup"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSignup) {
      // Move to the code-verification step. Wording is enumeration-safe:
      // we never reveal whether the address already has an account.
      setStep("verify")
      return
    }
    // Placeholder auth — wire up a real backend later.
    router.push("/dashboard")
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    // Placeholder verification — wire up a real backend later.
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">ClauseGuard</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {isSignup && step === "verify" ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
                  Check your email
                </h1>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">
                  {"If an account exists for "}
                  <span className="font-medium text-foreground">{email || "that address"}</span>
                  {", we've sent it a 6-digit verification code. Enter it below to continue."}
                </p>
              </div>

              <form
                onSubmit={handleVerify}
                className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="code" className="text-sm font-medium text-foreground">
                    Verification code
                  </label>
                  <input
                    id="code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="rounded-md border border-border bg-background px-3 py-2 text-center text-lg tracking-[0.5em] text-foreground outline-none transition-colors focus:border-primary"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Verify and continue
                </button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="font-medium text-primary hover:underline"
                  >
                    Resend code
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              {isSignup
                ? "Start scanning and monitoring Terms of Service."
                : "Log in to your ClauseGuard dashboard."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
            {isSignup && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Jane Doe"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {isSignup ? "Sign up" : "Log in"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-medium text-primary hover:underline"
            >
              {isSignup ? "Log in" : "Sign up"}
            </Link>
          </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
