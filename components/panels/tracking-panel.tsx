"use client"

import { cn } from "@/lib/utils"
import { Plus, Dot } from "lucide-react"
import { useState } from "react"

const TRACKED = [
  { name: "Spotify", url: "spotify.com/legal", status: "Change detected", checked: "2h ago", active: true },
  { name: "Notion", url: "notion.so/terms", status: "Up to date", checked: "5h ago", active: true },
  { name: "Dropbox", url: "dropbox.com/terms", status: "Change detected", checked: "1d ago", active: true },
  { name: "Figma", url: "figma.com/legal", status: "Up to date", checked: "2d ago", active: true },
  { name: "GitHub", url: "github.com/terms", status: "Up to date", checked: "3d ago", active: false },
]

const TIMELINE = [
  { service: "Spotify", change: "Added broad content license for user uploads", when: "Today, 09:14", risk: "high" },
  { service: "Dropbox", change: "Updated mandatory arbitration clause", when: "Yesterday, 16:40", risk: "medium" },
  { service: "X (Twitter)", change: "Expanded data usage for AI training", when: "Jul 12", risk: "high" },
  { service: "Notion", change: "Clarified data retention window (no risk)", when: "Jul 10", risk: "low" },
]

function riskDot(risk: string) {
  if (risk === "high") return "text-destructive"
  if (risk === "medium") return "text-warning"
  return "text-success"
}

export function TrackingPanel() {
  const [items, setItems] = useState(TRACKED)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Tracked services */}
      <section className="rounded-xl border border-border bg-card lg:col-span-3">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Tracked services</h2>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
            <Plus className="h-3.5 w-3.5" /> Track new
          </button>
        </div>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.name} className="flex items-center gap-4 px-5 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-secondary-foreground">
                {item.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                <p className="truncate text-xs text-muted-foreground">{item.url}</p>
              </div>
              <div className="hidden text-right sm:block">
                <span
                  className={cn(
                    "text-xs font-medium",
                    item.status === "Change detected" ? "text-destructive" : "text-success",
                  )}
                >
                  {item.status}
                </span>
                <p className="text-xs text-muted-foreground">Checked {item.checked}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={item.active}
                aria-label={`Toggle monitoring for ${item.name}`}
                onClick={() =>
                  setItems((prev) =>
                    prev.map((i) => (i.name === item.name ? { ...i, active: !i.active } : i)),
                  )
                }
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                  item.active ? "bg-primary" : "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-card shadow transition-transform",
                    item.active ? "translate-x-5" : "translate-x-0.5",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Update timeline */}
      <section className="rounded-xl border border-border bg-card lg:col-span-2">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Update history</h2>
        </div>
        <ol className="p-5">
          {TIMELINE.map((event, i) => (
            <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
              {i !== TIMELINE.length - 1 && (
                <span className="absolute left-[7px] top-5 h-full w-px bg-border" aria-hidden />
              )}
              <Dot className={cn("h-4 w-4 shrink-0", riskDot(event.risk))} strokeWidth={6} />
              <div className="-mt-0.5">
                <p className="text-sm font-medium text-foreground">{event.service}</p>
                <p className="text-xs text-muted-foreground">{event.change}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/70">{event.when}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
