"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

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

const FREQUENCIES = ["Hourly", "Daily", "Weekly"]

export function SettingsPanel() {
  const [frequency, setFrequency] = useState("Daily")
  const [notifs, setNotifs] = useState({
    email: true,
    push: false,
    highRiskOnly: true,
    weekly: true,
  })

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Scan frequency */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">Scan frequency</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">How often ClauseGuard re-checks tracked documents.</p>
        <div className="mt-4 inline-flex rounded-lg border border-border bg-muted p-1">
          {FREQUENCIES.map((f) => (
            <button
              key={f}
              onClick={() => setFrequency(f)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                frequency === f
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
        </div>
        <ul className="divide-y divide-border">
          {[
            { key: "email", label: "Email alerts", desc: "Send changes to your inbox" },
            { key: "push", label: "Push notifications", desc: "Browser and mobile push" },
            { key: "highRiskOnly", label: "High-risk only", desc: "Only notify for high-risk changes" },
            { key: "weekly", label: "Weekly digest", desc: "A summary every Monday" },
          ].map((row) => (
            <li key={row.key} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{row.label}</p>
                <p className="text-xs text-muted-foreground">{row.desc}</p>
              </div>
              <Toggle
                on={notifs[row.key as keyof typeof notifs]}
                onClick={() =>
                  setNotifs((prev) => ({ ...prev, [row.key]: !prev[row.key as keyof typeof notifs] }))
                }
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Danger zone */}
      <section className="rounded-xl border border-destructive/30 bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">Data & privacy</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Export or permanently delete all of your scan data.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            Export data
          </button>
          <button className="rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
            Delete all data
          </button>
        </div>
      </section>
    </div>
  )
}
