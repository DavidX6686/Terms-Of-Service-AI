"use client"

import { cn } from "@/lib/utils"
import { ShieldCheck, LayoutGrid, SlidersHorizontal, Radar, Settings, UserRound } from "lucide-react"

export type TabId = "overview" | "advanced" | "tracking" | "settings" | "account"

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "advanced", label: "Advanced", icon: SlidersHorizontal },
  { id: "tracking", label: "Tracking", icon: Radar },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "account", label: "Account", icon: UserRound },
]

export function TopNav({
  active,
  onChange,
}: {
  active: TabId
  onChange: (tab: TabId) => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* Brand */}
        <div className="flex shrink-0 items-center gap-2 py-3 pr-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">ClauseGuard</span>
        </div>

        {/* Tabs */}
        <nav aria-label="Primary" className="flex flex-1 items-stretch overflow-x-auto">
          <ul className="flex items-stretch gap-1">
            {TABS.map((tab) => {
              const isActive = tab.id === active
              const Icon = tab.icon
              return (
                <li key={tab.id} className="flex">
                  <button
                    type="button"
                    onClick={() => onChange(tab.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-2 whitespace-nowrap px-3 py-4 text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    <span
                      className={cn(
                        "absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-colors",
                        isActive ? "bg-primary" : "bg-transparent",
                      )}
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
