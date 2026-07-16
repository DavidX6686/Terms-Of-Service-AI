import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export function AccountPanel() {
  const usagePct = 24 / 50

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
            AR
          </div>
          <div>
            <p className="text-base font-medium text-foreground">Alex Rivera</p>
            <p className="text-sm text-muted-foreground">alex.rivera@example.com</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Full name</label>
            <input
              defaultValue="Alex Rivera"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
            <input
              defaultValue="alex.rivera@example.com"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="mt-4">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Save changes
          </button>
        </div>
      </section>

      {/* Plan & usage */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Current plan</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Pro — billed monthly</p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Pro</span>
        </div>

        <div className="mt-5">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Services tracked</span>
            <span className="font-medium text-foreground">24 / 50</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${usagePct * 100}%` }} />
          </div>
        </div>

        <ul className="mt-5 space-y-2">
          {["Unlimited scans", "Hourly monitoring", "Custom watch keywords", "Priority alerts"].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-foreground">
              <Check className="h-4 w-4 text-success" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap gap-3">
          <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            Manage billing
          </button>
          <button
            className={cn(
              "rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground",
            )}
          >
            Change plan
          </button>
        </div>
      </section>
    </div>
  )
}
