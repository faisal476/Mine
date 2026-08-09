import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadState, formatDuration } from "@/lib/storage";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function Leaderboard() {
  const state = loadState();
  const now = new Date();

  const ranking = useMemo(() => {
    return state.users
      .map((user) => {
        const userSessions = state.sessions.filter((s) => s.userId === user.id);
        let totalMs = 0;
        for (const session of userSessions) {
          const start = new Date(session.startedAt).getTime();
          const end = session.endedAt ? new Date(session.endedAt).getTime() : now.getTime();
          let breakMs = 0;
          for (const b of session.breaks) {
            const bStart = new Date(b.startedAt).getTime();
            const bEnd = b.endedAt ? new Date(b.endedAt).getTime() : now.getTime();
            breakMs += Math.max(0, bEnd - bStart);
          }
          totalMs += Math.max(0, end - start - breakMs);
        }
        return { user, totalMs, sessionsCount: userSessions.length };
      })
      .sort((a, b) => b.totalMs - a.totalMs);
  }, [state]);

  const medal = (index: number) => (index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null);

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Trophy className="h-5 w-5 text-primary" />
          ترتيب الخوياي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {ranking.map((entry, index) => (
          <div
            key={entry.user.id}
            className={cn(
              "flex items-center justify-between rounded-md border border-border bg-background/40 p-3",
              index === 0 && "border-primary/50 bg-primary/5"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center text-lg">{medal(index) ?? index + 1}</span>
              <span className="font-medium text-foreground">{entry.user.name}</span>
              {entry.user.isAdmin && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  مشرف
                </Badge>
              )}
            </div>
            <div className="text-left">
              <div className="font-bold tabular-nums text-foreground">{formatDuration(entry.totalMs)}</div>
              <div className="text-xs text-muted-foreground">{entry.sessionsCount} جلسة</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}