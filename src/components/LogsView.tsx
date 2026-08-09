import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { webhookLogs } from "@/data/logs";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, AlertCircle, XCircle, Webhook } from "lucide-react";

export function LogsView() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <div className="text-xs font-bold tracking-widest text-primary">WEBHOOK MONITOR</div>
        <h1 className="mt-1 text-3xl font-bold text-gradient">Event Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time webhook feed for crew activity, market sales, fuel alerts, and scammer detections.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">TOTAL EVENTS</div>
            <div className="mt-2 text-4xl font-bold text-foreground">{webhookLogs.length}</div>
            <div className="text-xs text-muted-foreground">Last 24 hours</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">ALERTS</div>
            <div className="mt-2 text-4xl font-bold text-foreground">
              {webhookLogs.filter((l) => l.status !== "success").length}
            </div>
            <div className="text-xs text-muted-foreground">Warnings and errors</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">LAST PING</div>
            <div className="mt-2 text-2xl font-bold text-foreground">
              {formatDistanceToNow(new Date(webhookLogs[0].timestamp), { addSuffix: true })}
            </div>
            <div className="text-xs text-muted-foreground">Webhook latency normal</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/50">
        <CardContent className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <Webhook className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold tracking-wider text-foreground">WEBHOOK ENDPOINT</span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/50 p-3">
            <code className="flex-1 text-xs font-mono text-muted-foreground">
              https://rork.app/pa/yld1fv4mn7ndipkswqrkw/webhook/mine-events
            </code>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-500">
              ACTIVE
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-bold tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold tracking-wider text-muted-foreground">Event</TableHead>
              <TableHead className="text-xs font-bold tracking-wider text-muted-foreground">Source</TableHead>
              <TableHead className="text-xs font-bold tracking-wider text-muted-foreground">Time</TableHead>
              <TableHead className="text-xs font-bold tracking-wider text-muted-foreground">Payload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhookLogs.map((log) => (
              <TableRow key={log.id} className="border-border hover:bg-secondary/30">
                <TableCell>
                  {log.status === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {log.status === "warning" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                  {log.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-semibold text-foreground">{log.event}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{log.source}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <code className="max-w-[200px] truncate text-xs font-mono text-muted-foreground">
                    {log.payload}
                  </code>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
