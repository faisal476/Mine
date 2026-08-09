import { cn } from "@/lib/utils";
import { Gem, Gauge, Pickaxe, Fuel, AlertCircle, Users } from "lucide-react";

export type TabId = "overview" | "market" | "crew" | "upgrades" | "fuel" | "logs";

interface MineSidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  { id: "overview" as TabId, label: "Overview", icon: Gauge },
  { id: "market" as TabId, label: "Market", icon: Gem },
  { id: "crew" as TabId, label: "Crew", icon: Users },
  { id: "upgrades" as TabId, label: "Upgrades", icon: Pickaxe },
  { id: "fuel" as TabId, label: "Fuel", icon: Fuel },
  { id: "logs" as TabId, label: "Logs", icon: AlertCircle },
];

export function MineSidebar({ activeTab, onTabChange }: MineSidebarProps) {
  return (
    <aside className="w-full border-b border-border/60 bg-sidebar p-2 lg:w-64 lg:border-b-0 lg:border-r lg:p-4">
      <div className="mb-4 hidden px-3 text-xs font-bold tracking-widest text-muted-foreground lg:block">
        MINE SYSTEMS
      </div>
      <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "min-w-fit whitespace-nowrap",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/80"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-sidebar-border pt-4 lg:block">
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
          <div className="text-xs font-semibold text-muted-foreground">ACTIVE PROPERTY</div>
          <div className="mt-1 text-sm font-bold text-foreground">Shaft Delta-4</div>
          <div className="text-xs text-muted-foreground">Crew operational access</div>
        </div>
      </div>
    </aside>
  );
}
