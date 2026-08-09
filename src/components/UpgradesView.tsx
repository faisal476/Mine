import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pickaxes, upgrades } from "@/data/upgrades";
import { cn } from "@/lib/utils";

export function UpgradesView() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <div className="text-xs font-bold tracking-widest text-primary">PROPERTY DEVELOPMENT</div>
        <h1 className="mt-1 text-3xl font-bold text-gradient">Mine Equipment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Production machinery wears down through use. Replace expired equipment to resume operations.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-primary" />
            <span className="text-sm font-bold tracking-wider text-foreground">INDIVIDUAL PICKAXES</span>
          </div>
          <span className="text-xs text-muted-foreground">Each tool has its own 300-cell service life</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {pickaxes.map((pick) => {
            const health = Math.round((pick.remainingCells / pick.maxCells) * 100);
            return (
              <Card key={pick.id} className="border-border bg-card/50">
                <CardContent className="p-4">
                  <div className="text-sm font-semibold text-foreground">{pick.name}</div>
                  <div className="mt-1 text-2xl font-bold text-foreground">
                    {pick.remainingCells}
                    <span className="ml-1 text-xs font-medium text-muted-foreground">CELLS</span>
                    <span className="ml-1 text-xs font-medium text-muted-foreground">REMAINING</span>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        health > 50 ? "bg-emerald-500" : health > 20 ? "bg-amber-500" : "bg-red-500"
                      )}
                      style={{ width: `${health}%` }}
                    />
                  </div>
                  <Button
                    disabled={pick.operational}
                    className="mt-3 w-full bg-primary/20 text-xs font-bold text-primary hover:bg-primary/30 disabled:opacity-50"
                  >
                    {pick.operational ? "Operational" : "Repair"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-primary" />
            <span className="text-sm font-bold tracking-wider text-foreground">DEVELOPMENT CATALOG</span>
          </div>
          <span className="text-xs text-muted-foreground">Mine Level 5</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {upgrades.map((upgrade) => (
            <Card
              key={upgrade.id}
              className={cn(
                "border-border bg-card/50 transition-colors",
                upgrade.installed && "border-primary/30"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="text-base font-bold text-foreground">{upgrade.name}</div>
                  <Badge variant="outline" className="border-border text-[10px] text-muted-foreground">
                    TIER {upgrade.tier}/{upgrade.maxTier}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{upgrade.description}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={cn("font-semibold", upgrade.progress >= 100 ? "text-emerald-500" : "text-primary")}>
                      {upgrade.requirement}
                    </span>
                    <span className="text-muted-foreground">{upgrade.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        upgrade.progress >= 100 ? "bg-emerald-500" : "bg-primary"
                      )}
                      style={{ width: `${upgrade.progress}%` }}
                    />
                  </div>
                </div>

                <Button
                  disabled={upgrade.locked || upgrade.installed}
                  className={cn(
                    "mt-4 w-full text-xs font-bold",
                    upgrade.installed
                      ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
                      : upgrade.locked
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/20 text-primary hover:bg-primary/30"
                  )}
                >
                  {upgrade.installed
                    ? "Installed"
                    : upgrade.locked
                      ? "Purchase permission required"
                      : `Buy - $${upgrade.cost.toLocaleString()}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
