import { cn } from "@/lib/utils"
import { FileSearch, AlertTriangle, Bell, Gauge, ArrowUpRight, CircleCheck } from "lucide-react"

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

export function OverviewPanel() {
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
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Recent scans</h2>
            <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="divide-y divide-border">
            {RECENT_SCANS.map((scan) => (
              <li key={scan.name} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-secondary-foreground">
                  {scan.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{scan.name}</p>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", riskStyles(scan.risk))}>
                      {scan.risk}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{scan.note}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-semibold text-foreground">{scan.score}</div>
                  <div className="text-xs text-muted-foreground">risk</div>
                </div>
                <div className="w-16 shrink-0 text-right text-xs text-muted-foreground">{scan.when}</div>
              </li>
            ))}
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
