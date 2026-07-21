"use client"

import { useState } from "react"
import { TopNav, type TabId } from "@/components/top-nav"
import { OverviewPanel } from "@/components/panels/overview-panel"
import { AdvancedPanel } from "@/components/panels/advanced-panel"
import { TrackingPanel } from "@/components/panels/tracking-panel"
import { SettingsPanel } from "@/components/panels/settings-panel"
import { AccountPanel } from "@/components/panels/account-panel"

const TITLES: Record<TabId, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "A snapshot of everything ClauseGuard is watching for you." },
  advanced: { title: "Advanced", subtitle: "Fine-tune how documents are analyzed and flagged." },
  tracking: { title: "Tracking", subtitle: "Manage monitored services and review recent changes." },
  settings: { title: "Settings", subtitle: "Control scan frequency, notifications, and your data." },
  account: { title: "Account", subtitle: "Manage your profile, plan, and usage." },
}

export function Dashboard() {
  const [tab, setTab] = useState<TabId>("overview")
  const meta = TITLES[tab]

  return (
    <div className="min-h-screen bg-background">
      <TopNav active={tab} onChange={setTab} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">{meta.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">{meta.subtitle}</p>
        </div>

        {tab === "overview" && <OverviewPanel />}
        {tab === "advanced" && <AdvancedPanel />}
        {tab === "tracking" && <TrackingPanel />}
        {tab === "settings" && <SettingsPanel />}
        {tab === "account" && <AccountPanel />}
      </main>
    </div>
  )
}
