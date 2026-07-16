import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">ClauseGuard</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Giant blank hero — content to be added later */}
      <main className="flex flex-1 items-center justify-center px-4">
        <span className="sr-only">Home</span>
      </main>
    </div>
  )
}
