"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Scale, Database, Eye, Gavel, RefreshCw, Ban } from "lucide-react"

const CLAUSE_CATEGORIES = [
  { id: "data", label: "Data collection & sharing", icon: Database, on: true },
  { id: "license", label: "Content licensing rights", icon: Scale, on: true },
  { id: "tracking", label: "Tracking & profiling", icon: Eye, on: true },
  { id: "arbitration", label: "Arbitration & class-action waivers", icon: Gavel, on: false },
  { id: "termination", label: "Account termination terms", icon: Ban, on: false },
  { id: "changes", label: "Unilateral change clauses", icon: RefreshCw, on: true },
]

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        on ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-card shadow transition-transform",
          on ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  )
}

export function AdvancedPanel() {
  const [categories, setCategories] = useState(CLAUSE_CATEGORIES)
  const [sensitivity, setSensitivity] = useState(65)
  const [keywords, setKeywords] = useState<string[]>(["perpetual license", "sell your data", "waive"])
  const [draft, setDraft] = useState("")

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Clause detection */}
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Clause detection</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Choose which clause types the scanner flags.</p>
        </div>
        <ul className="divide-y divide-border">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <li key={cat.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="flex-1 text-sm text-foreground">{cat.label}</span>
                <Toggle
                  on={cat.on}
                  onClick={() =>
                    setCategories((prev) =>
                      prev.map((c) => (c.id === cat.id ? { ...c, on: !c.on } : c)),
                    )
                  }
                />
              </li>
            )
          })}
        </ul>
      </section>

      <div className="space-y-6">
        {/* Sensitivity */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Risk sensitivity</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Higher sensitivity flags more borderline clauses.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={100}
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
            />
            <span className="w-10 text-right text-sm font-semibold text-foreground">{sensitivity}</span>
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Conservative</span>
            <span>Aggressive</span>
          </div>
        </section>

        {/* Custom keywords */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Custom watch keywords</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Get alerted whenever these phrases appear in a document.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              const val = draft.trim()
              if (val && !keywords.includes(val)) setKeywords((k) => [...k, val])
              setDraft("")
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a keyword…"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Add
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
              >
                {kw}
                <button
                  type="button"
                  aria-label={`Remove ${kw}`}
                  onClick={() => setKeywords((k) => k.filter((x) => x !== kw))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
