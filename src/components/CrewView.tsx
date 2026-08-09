import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { crewMembers } from "@/data/crew";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { UserCheck, UserX, AlertTriangle } from "lucide-react";

export function CrewView() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <div className="text-xs font-bold tracking-widest text-primary">CREW MANAGEMENT</div>
        <h1 className="mt-1 text-3xl font-bold text-gradient">Crew & Collection</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track who entered the mine, what they collected, and identify inactive or flagged members.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">TOTAL CREW</div>
            <div className="mt-2 text-4xl font-bold text-foreground">{crewMembers.length}</div>
            <div className="text-xs text-muted-foreground">Registered miners</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">TOTAL COLLECTED</div>
            <div className="mt-2 text-4xl font-bold text-foreground">
              ${crewMembers.reduce((sum, c) => sum + c.totalCollected, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Combined value</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">FLAGGED</div>
            <div className="mt-2 text-4xl font-bold text-foreground">
              {crewMembers.filter((c) => c.status === "scammer").length}
            </div>
            <div className="text-xs text-muted-foreground">Inactive / suspicious</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-1 w-6 rounded-full bg-primary" />
          <span className="text-sm font-bold tracking-wider text-foreground">MEMBER ACTIVITY</span>
        </div>
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-bold tracking-wider text-muted-foreground">Member</TableHead>
                <TableHead className="text-xs font-bold tracking-wider text-muted-foreground">Role</TableHead>
                <TableHead className="text-xs font-bold tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-bold tracking-wider text-muted-foreground">Last Entry</TableHead>
                <TableHead className="text-right text-xs font-bold tracking-wider text-muted-foreground">Collected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crewMembers.map((member) => (
                <TableRow key={member.id} className="border-border hover:bg-secondary/30">
                  <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{member.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1 text-[10px]",
                        member.status === "active" && "border-emerald-500/30 text-emerald-500",
                        member.status === "idle" && "border-amber-500/30 text-amber-500",
                        member.status === "scammer" && "border-red-500/30 text-red-500"
                      )}
                    >
                      {member.status === "active" && <UserCheck className="h-3 w-3" />}
                      {member.status === "idle" && <AlertTriangle className="h-3 w-3" />}
                      {member.status === "scammer" && <UserX className="h-3 w-3" />}
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {member.lastEntry
                      ? formatDistanceToNow(new Date(member.lastEntry), { addSuffix: true })
                      : "Never entered"}
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground">
                    ${member.totalCollected.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-1 w-6 rounded-full bg-primary" />
          <span className="text-sm font-bold tracking-wider text-foreground">RECENT COLLECTIONS</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {crewMembers
            .flatMap((m) => m.collections.map((c) => ({ ...c, member: m.name })))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 9)
            .map((record) => (
              <Card key={record.id} className="border-border bg-card/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">{record.material}</span>
                    <span className="text-xs font-medium text-muted-foreground">{record.member}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{record.amount} units</span>
                    <span className="font-bold text-primary">${record.value.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
