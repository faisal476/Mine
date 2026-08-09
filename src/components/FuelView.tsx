import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function FuelView() {
  const [delivery, setDelivery] = useState([1]);
  const fuelLevel = 18;
  const fuelCapacity = 25;
  const pricePerLiter = 50;
  const available = fuelCapacity - fuelLevel;
  const percentage = Math.round((fuelLevel / fuelCapacity) * 100);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <div className="text-xs font-bold tracking-widest text-primary">FURNACE SUPPLY</div>
        <h1 className="mt-1 text-3xl font-bold text-gradient">Shared Fuel Tank</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the exact delivery in liters. Every active furnace draws from this reserve.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="col-span-2 border-border bg-card/50">
          <CardContent className="space-y-6 p-5">
            <div className="space-y-1">
              <div className="text-xs font-bold tracking-widest text-muted-foreground">TANK LEVEL</div>
              <div className="flex items-end justify-between">
                <div className="text-4xl font-bold text-foreground">{fuelLevel} L</div>
                <div className="text-xs text-muted-foreground">of {fuelCapacity} liters</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{percentage}% full</span>
                <span>{available} L available</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold tracking-widest text-muted-foreground">DELIVERY AMOUNT</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-foreground">{delivery[0]} liters</div>
                <div className="text-xs text-muted-foreground">${pricePerLiter} per liter</div>
              </div>
              <Slider
                value={delivery}
                onValueChange={setDelivery}
                max={available}
                min={1}
                step={1}
                className="py-2"
              />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Order total</div>
                  <div className="text-xl font-bold text-foreground">${(delivery[0] * pricePerLiter).toLocaleString()}</div>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Order fuel</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/50">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold tracking-widest text-muted-foreground">TANK CAPACITY</div>
              <Badge variant="outline" className="border-border text-[10px] text-muted-foreground">
                TIER 1/4
              </Badge>
            </div>
            <div className="text-sm font-bold text-foreground">Furnace Fuel Tank</div>
            <p className="text-xs text-muted-foreground">
              Expands the shared underground fuel tank used by every running furnace.
            </p>

            <div className="text-4xl font-bold text-foreground">
              {fuelCapacity} L
              <span className="ml-2 text-sm font-normal text-muted-foreground">Current capacity</span>
            </div>

            <div className="rounded-md border border-border bg-secondary/50 p-3">
              <div className="text-xs font-bold text-primary">75 liter reserve tank</div>
              <div className="text-xs text-muted-foreground">Mine Level 2 - $2,500</div>
            </div>

            <Button disabled className="w-full bg-muted text-xs font-bold text-muted-foreground">
              Purchase permission required
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
