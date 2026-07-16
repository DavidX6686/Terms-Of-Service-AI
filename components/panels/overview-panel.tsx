"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import {
  FileSearch,
  AlertTriangle,
  Bell,
  Gauge,
  ArrowUpRight,
  CircleCheck,
  MoreVertical,
  Timer,
} from "lucide-react"

const STATS = [
  { label: "Services tracked", value: "24", icon: FileSearch, delta: "+3 this month" },
  { label: "Clauses flagged", value: "137", icon: AlertTriangle, delta: "12 high risk" },
  { label: "Updates this week", value: "6", icon: Bell, delta: "2 need review" },
  { label: "Avg. risk score", value: "58", icon: Gauge, delta: "Moderate" },
]

const RECENT_SCANS = [
  { name: "Spotify", risk: "High", score: 78, when: "2h ago", note: "Broad content license clause" },
  { name: "Notion", risk: "Low", score: 24, when: "5h ago", note: "No concerning changes" },
  { name: "Dropbox", risk: "Medium", score: 51, when: "1d ago", note: "Arbitration clause updated" },
  { name: "Figma", risk: "Low", score: 19, when: "2d ago", note: "Clear data handling terms" },
  { name: "X (Twitter)", risk: "High", score: 83, when: "3d ago", note: "Expanded data usage rights" },
]

const SCAN_INTERVAL_MS = 24 * 60 * 60 * 1000

function riskStyles(risk: string) {
  switch (risk) {
    case "High":
      return "bg-destructive/10 text-destructive"
    case "Medium":
      return "bg-warning/20 text-warning-foreground"
    default:
      return "bg-success/15 text-success"
  }
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export function OverviewPanel() {
  // Timestamp of the next daily scan. Initialized to 24h from mount.
  const [nextScan, setNextScan] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(SCAN_INTERVAL_MS)

  // Menu open state + per-service tracking preferences.
  const [menuOpen, setMenuOpen] = useState(false)
  const [tracked, setTracked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(RECENT_SCANS.map((s) => [s.name, true])),
  )
  const menuRef = useRef<HTMLDivElement>(null)

  // Establish the next scan time on the client to avoid hydration mismatch.
  useEffect(() => {
    setNextScan(Date.now() + SCAN_INTERVAL_MS)
  }, [])

  // Tick the countdown every second; roll over to the next day when it hits 0.
  useEffect(() => {
    if (nextScan === null) return
    const id = setInterval(() => {
      const diff = nextScan - Date.now()
      if (diff <= 0) {
        setNextScan(Date.now() + SCAN_INTERVAL_MS)
        setRemaining(SCAN_INTERVAL_MS)
      } else {
        setRemaining(diff)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [nextScan])

  // Close the menu when clicking outside of it.
  useEffect(() => {
    if (!menuOpen) return
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [menuOpen])

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{stat.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{stat.delta}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent scans */}
        <div className="rounded-xl border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <h2 className="text-sm font-semibold text-foreground">Recent scans</h2>
              {/* Daily rescan countdown */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                <Timer className="h-3.5 w-3.5 text-primary" />
                <span className="tabular-nums">{formatCountdown(remaining)}</span>
                <span className="hidden text-muted-foreground sm:inline">until daily scan</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
              {/* Three-dot tracking menu */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-label="Manage tracked services"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-border bg-popover p-2 shadow-lg"
                  >
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-semibold text-popover-foreground">Track terms of service</p>
                      <p className="text-xs text-muted-foreground">
                        Choose which agreed services to keep scanning daily.
                      </p>
                    </div>
                    <ul className="mt-1 max-h-64 space-y-0.5 overflow-y-auto">
                      {RECENT_SCANS.map((scan) => {
                        const isOn = tracked[scan.name]
                        return (
                          <li key={scan.name}>
                            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-secondary">
                              <span className="flex min-w-0 items-center gap-2.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
                                  {scan.name.charAt(0)}
                                </span>
                                <span className="truncate text-sm text-popover-foreground">{scan.name}</span>
                              </span>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={isOn}
                                aria-label={`Track ${scan.name}`}
                                onClick={() =>
                                  setTracked((prev) => ({ ...prev, [scan.name]: !prev[scan.name] }))
                                }
                                className={cn(
                                  "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
                                  isOn ? "bg-primary" : "bg-muted",
                                )}
                              >
                                <span
                                  className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                                    isOn ? "translate-x-4" : "translate-x-0.5",
                                  )}
                                />
                              </button>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ul className="divide-y divide-border">
            {RECENT_SCANS.map((scan) => {
              const isTracked = tracked[scan.name]
              return (
                <li key={scan.name} className={cn("flex items-center gap-4 px-5 py-3.5", !isTracked && "opacity-50")}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-secondary-foreground">
                    {scan.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{scan.name}</p>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", riskStyles(scan.risk))}>
                        {scan.risk}
                      </span>
                      {!isTracked && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          Paused
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{scan.note}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="text-sm font-semibold text-foreground">{scan.score}</div>
                    <div className="text-xs text-muted-foreground">risk</div>
                  </div>
                  <div className="w-16 shrink-0 text-right text-xs text-muted-foreground">{scan.when}</div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Monitoring status */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Monitoring status</h2>
          </div>
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-3 rounded-lg bg-success/10 p-3">
              <CircleCheck className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium text-foreground">All monitors active</p>
                <p className="text-xs text-muted-foreground">Next sweep in 42 minutes</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "High risk", value: 12, total: 137, color: "bg-destructive" },
                { label: "Medium risk", value: 41, total: 137, color: "bg-warning" },
                { label: "Low risk", value: 84, total: 137, color: "bg-success" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-foreground">{row.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", row.color)}
                      style={{ width: `${(row.value / row.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
