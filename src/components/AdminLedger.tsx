import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { loadState, saveState, type TradeRecord } from "@/lib/storage";
import { sendDiscordNotification } from "@/lib/discord";
import { Plus, DollarSign } from "lucide-react";

export function AdminLedger() {
  const [state, setState] = useState(loadState);
  const [material, setMaterial] = useState("");
  const [boughtQty, setBoughtQty] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [soldQty, setSoldQty] = useState("");
  const [soldPrice, setSoldPrice] = useState("");

  const refresh = () => setState(loadState());

  const addTrade = () => {
    const bq = Number(boughtQty) || 0;
    const paid = Number(paidAmount) || 0;
    const sq = Number(soldQty) || 0;
    const price = Number(soldPrice) || 0;
    if (!material.trim() || bq <= 0 || paid <= 0) return;

    const trade: TradeRecord = {
      id: crypto.randomUUID(),
      userId: "ibrahim",
      material: material.trim(),
      boughtQty: bq,
      paidAmount: paid,
      soldQty: sq,
      soldPrice: price,
      createdAt: new Date().toISOString(),
    };
    const current = loadState();
    current.trades = [trade, ...current.trades];
    saveState(current);
    refresh();
    setMaterial("");
    setBoughtQty("");
    setPaidAmount("");
    setSoldQty("");
    setSoldPrice("");

    sendDiscordNotification(current, "ibrahim", "💰 عملية بيع/شراء جديدة", [
      { name: "المادة", value: trade.material, inline: true },
      { name: "إجمالي الشراء", value: `$${trade.paidAmount.toLocaleString()}`, inline: true },
      { name: "إجمالي البيع", value: `$${(trade.soldQty * trade.soldPrice).toLocaleString()}`, inline: true },
    ]);
  };

  const totalBought = state.trades.reduce((sum, t) => sum + t.paidAmount, 0);
  const totalSold = state.trades.reduce((sum, t) => sum + t.soldQty * t.soldPrice, 0);
  const profit = totalSold - totalBought;

  return (
    <div className="space-y-6">
      <div className="text-xl font-bold text-foreground">سجل البيع والشراء</div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-wider text-muted-foreground">إجمالي الشراء</div>
            <div className="mt-2 text-2xl font-bold text-foreground">${totalBought.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-wider text-muted-foreground">إجمالي البيع</div>
            <div className="mt-2 text-2xl font-bold text-foreground">${totalSold.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-wider text-muted-foreground">الربح</div>
            <div className={["mt-2 text-2xl font-bold", profit >= 0 ? "text-emerald-500" : "text-red-500"].join(" ")}>
              {profit >= 0 ? "+" : ""}${profit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/50">
        <CardContent className="space-y-3 p-4">
          <div className="text-sm font-bold text-foreground">إضافة عملية جديدة</div>
          <div className="grid gap-2 sm:grid-cols-5">
            <Input
              placeholder="اسم المادة"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="border-border bg-background"
            />
            <Input
              type="number"
              placeholder="كمية شراء"
              value={boughtQty}
              onChange={(e) => setBoughtQty(e.target.value)}
              className="border-border bg-background"
            />
            <Input
              type="number"
              placeholder="مبلغ شراء ($)"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="border-border bg-background"
            />
            <Input
              type="number"
              placeholder="كمية بيع"
              value={soldQty}
              onChange={(e) => setSoldQty(e.target.value)}
              className="border-border bg-background"
            />
            <Input
              type="number"
              placeholder="سعر بيع الوحدة ($)"
              value={soldPrice}
              onChange={(e) => setSoldPrice(e.target.value)}
              className="border-border bg-background"
            />
          </div>
          <Button className="bg-primary" onClick={addTrade}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة
          </Button>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">المادة</TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">كمية شراء</TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">مبلغ شراء</TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">كمية بيع</TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">سعر بيع</TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">إجمالي بيع</TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">الربح</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.trades.length === 0 && (
              <TableRow className="border-border">
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  لا توجد عمليات بعد
                </TableCell>
              </TableRow>
            )}
            {state.trades.map((t) => {
              const soldTotal = t.soldQty * t.soldPrice;
              const rowProfit = soldTotal - t.paidAmount;
              return (
                <TableRow key={t.id} className="border-border hover:bg-secondary/30">
                  <TableCell className="font-medium text-foreground">{t.material}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.boughtQty}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">${t.paidAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.soldQty}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">${t.soldPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-foreground">${soldTotal.toLocaleString()}</TableCell>
                  <TableCell className={["text-sm font-bold", rowProfit >= 0 ? "text-emerald-500" : "text-red-500"].join(" ")}>
                    {rowProfit >= 0 ? "+" : ""}${rowProfit.toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
