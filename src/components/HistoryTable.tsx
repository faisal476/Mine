import { useState } from "react";
import { loadState, type User, type SessionRecord } from "@/lib/storage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryTableProps {
  user: User;
}

function sessionDuration(session: SessionRecord): number {
  if (!session.endedAt) return 0;
  let total = new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime();
  let breakMs = 0;
  for (const b of session.breaks) {
    if (b.endedAt) breakMs += new Date(b.endedAt).getTime() - new Date(b.startedAt).getTime();
  }
  return Math.max(0, total - breakMs);
}

function formatDuration(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "medium" });
}

export function HistoryTable({ user }: HistoryTableProps) {
  const [sessions] = useState(() =>
    loadState()
      .sessions.filter((s) => s.userId === user.id)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
  );

  return (
    <div className="space-y-4">
      <div className="text-xl font-bold text-foreground">سجل الدوام</div>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">التاريخ</TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">الدخول</TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">الخروج</TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">المدة</TableHead>
              <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">الغفوات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 && (
              <TableRow className="border-border">
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  لا توجد سجلات دوام بعد
                </TableCell>
              </TableRow>
            )}
            {sessions.map((session) => {
              const duration = sessionDuration(session);
              const longShift = duration > 15 * 60 * 60 * 1000;
              const longBreak = session.breaks.some((b) => {
                if (!b.endedAt) return false;
                return new Date(b.endedAt).getTime() - new Date(b.startedAt).getTime() > 2 * 60 * 60 * 1000;
              });
              return (
                <TableRow key={session.id} className="border-border hover:bg-secondary/30">
                  <TableCell className="text-sm text-foreground">
                    {new Date(session.startedAt).toLocaleDateString("ar-SA")}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">{formatDateTime(session.startedAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {session.endedAt ? formatDateTime(session.endedAt) : "—"}
                  </TableCell>
                  <TableCell>
                    <div className={cn("flex items-center gap-2 font-mono font-medium", longShift && "text-red-500")}>
                      {formatDuration(duration)}
                      {longShift && <AlertTriangle className="h-4 w-4" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {session.breaks.length === 0 && (
                        <span className="text-xs text-muted-foreground">لا يوجد</span>
                      )}
                      {session.breaks.map((b) => (
                        <div key={b.id} className={cn("text-xs", longBreak && "text-red-500")}>
                          {b.reason}: {b.endedAt ? formatDuration(new Date(b.endedAt).getTime() - new Date(b.startedAt).getTime()) : "جارية"}
                        </div>
                      ))}
                    </div>
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
