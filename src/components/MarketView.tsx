import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { commodities, categoryFilters } from "@/data/commodities";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function MarketView() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? commodities : commodities.filter((c) => c.category === filter);
  const totalListings = commodities.length;
  const availableStock = commodities.reduce((sum, c) => sum + c.stock, 0);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <div className="text-xs font-bold tracking-widest text-primary">COMMODITY DESK</div>
        <h1 className="mt-1 text-3xl font-bold text-gradient">Mineral Exchange</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sell processed minerals at the live listed rate. Settlements go directly to your bank account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">MARKET LISTINGS</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{totalListings}</div>
            <div className="text-xs text-muted-foreground">Processed commodities</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">AVAILABLE STOCK</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{availableStock}</div>
            <div className="text-xs text-muted-foreground">Units ready to sell</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">SETTLEMENT</div>
            <div className="mt-2 text-2xl font-bold text-foreground">Bank</div>
            <div className="text-xs text-muted-foreground">Immediate deposit</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1 w-6 rounded-full bg-primary" />
          <span className="text-sm font-bold tracking-wider text-foreground">MARKET INVENTORY</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              className={cn(
                "text-xs",
                filter === f.value
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id} className="group border-border bg-card/50 transition-colors hover:border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-bold tracking-wider text-muted-foreground">{item.label}</div>
                  <div className="text-lg font-bold text-foreground">{item.name}</div>
                </div>
                <div className="text-4xl">{item.image}</div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs font-bold tracking-wider text-muted-foreground">MARKET RATE</div>
                <div className="text-xl font-bold text-foreground">
                  ${item.price.toLocaleString()}
                  <span className="text-xs font-normal text-muted-foreground"> / unit</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-md border border-border bg-secondary/50 px-2 py-1.5">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                  −
                </Button>
                <span className="text-sm font-semibold text-foreground">1</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                  +
                </Button>
                <span className="text-xs font-bold text-primary">MAX</span>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.stock} available</span>
              </div>
              <Button
                disabled={item.stock === 0}
                className="mt-2 w-full bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50"
              >
                {item.stock === 0 ? "No stock" : "Sell now"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
