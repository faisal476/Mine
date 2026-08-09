import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { processedStorage, propertySupplies } from "@/data/upgrades";
import { crewMembers } from "@/data/crew";
import { Gauge } from "lucide-react";

export function OverviewView() {
  const activeCrew = crewMembers.filter((c) => c.status === "active").length;
  const totalXp = 6981;
  const mineLevel = 5;
  const fuelLevel = 18;
  const fuelCapacity = 25;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <div className="text-xs font-bold tracking-widest text-primary">OPERATIONS SNAPSHOT</div>
        <h1 className="mt-1 text-3xl font-bold text-gradient">Mine Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review permanent progression, shared stock, production, and available property supplies.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">MINE LEVEL</div>
            <div className="mt-2 text-4xl font-bold text-foreground">{mineLevel}</div>
            <div className="text-xs text-muted-foreground">{totalXp.toLocaleString()} total XP</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">ACTIVE CREW</div>
            <div className="mt-2 text-4xl font-bold text-foreground">{activeCrew}</div>
            <div className="text-xs text-muted-foreground">Owner and invited miners</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">FUEL RESERVE</div>
            <div className="mt-2 text-4xl font-bold text-foreground">{fuelLevel} L</div>
            <div className="text-xs text-muted-foreground">{fuelCapacity} L capacity</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-primary" />
            <span className="text-sm font-bold tracking-wider text-foreground">PROPERTY SUPPLIES</span>
          </div>
          <span className="text-xs text-muted-foreground">Purchase permission required</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {propertySupplies.map((supply) => (
            <Card key={supply.id} className="border-border bg-card/50">
              <CardContent className="p-4">
                <div className="text-sm font-semibold text-foreground">{supply.name}</div>
                <div className="mt-1 text-2xl font-bold text-foreground">
                  {supply.inStock}
                  <span className="ml-1 text-xs font-medium text-muted-foreground">IN STOCK</span>
                </div>
                <button className="mt-3 w-full rounded-md bg-primary/20 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/30">
                  Buy one - ${supply.cost.toLocaleString()}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-primary" />
            <span className="text-sm font-bold tracking-wider text-foreground">PROCESSED STORAGE</span>
          </div>
          <span className="text-xs text-muted-foreground">Persistent shared inventory</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {processedStorage.map((item) => (
            <Card key={item.id} className="border-border bg-card/50">
              <CardContent className="p-3">
                <div className="text-xs font-medium text-muted-foreground">{item.name}</div>
                <div className="mt-1 text-2xl font-bold text-foreground">
                  {item.units}
                  <span className="ml-1 text-[10px] font-bold text-muted-foreground">UNITS</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card/50 p-4">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold tracking-wider text-muted-foreground">ACTIVE PROPERTY</span>
        </div>
        <div className="mt-2 text-sm font-bold text-foreground">Mine unavailable</div>
        <div className="text-xs text-muted-foreground">Crew operational access</div>
      </div>
    </div>
  );
}
