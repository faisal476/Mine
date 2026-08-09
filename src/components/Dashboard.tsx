import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  getActiveSession,
  getBreak,
  loadState,
  saveState,
  formatDuration,
  formatDateTime,
  type AppState,
  type SessionRecord,
  type User,
  type Break,
} from "@/lib/storage";
import { sendDiscordNotification } from "@/lib/discord";
import { HistoryTable } from "./HistoryTable";
import { AdminLedger } from "./AdminLedger";
import { DataSyncPanel } from "./DataSyncPanel";
import { Leaderboard } from "./Leaderboard";
import { Vault } from "./Vault";
import { Calculator } from "./Calculator";
import { Clock, LogIn, LogOut, Coffee, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

type TabId = "dashboard" | "history" | "ledger" | "sync" | "leaderboard" | "vault" | "calculator";

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [state, setState] = useState<AppState>(loadState());
  const [now, setNow] = useState<Date>(new Date());
  const [breakReason, setBreakReason] = useState("");
  const [breakDialogOpen, setBreakDialogOpen] = useState(false);
  const [breakError, setBreakError] = useState("");
  const [webhookStatus, setWebhookStatus] = useState<{ ok: boolean; error?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const refreshState = () => setState(loadState());

  const activeSession = useMemo(() => getActiveSession(state, user.id), [state, user.id]);
  const activeBreak = useMemo(() => (activeSession ? getBreak(activeSession) : undefined), [activeSession]);

  const elapsedMs = useMemo(() => {
    if (!activeSession) return 0;
    let base = new Date(activeSession.startedAt).getTime();
    let breakMs = 0;
    for (const b of activeSession.breaks) {
      const start = new Date(b.startedAt).getTime();
      const end = b.endedAt ? new Date(b.endedAt).getTime() : now.getTime();
      breakMs += Math.max(0, end - start);
    }
    return Math.max(0, now.getTime() - base - breakMs);
  }, [activeSession, now]);

  const breakElapsedMs = useMemo(() => {
    if (!activeBreak) return 0;
    return now.getTime() - new Date(activeBreak.startedAt).getTime();
  }, [activeBreak, now]);

  const showSessionWarning = elapsedMs > 15 * 60 * 60 * 1000;
  const showBreakWarning = activeBreak && breakElapsedMs > 2 * 60 * 60 * 1000;

  const handleStart = async () => {
    const current = loadState();
    if (getActiveSession(current, user.id)) return;
    const session: SessionRecord = {
      id: crypto.randomUUID(),
      userId: user.id,
      startedAt: new Date().toISOString(),
      endedAt: null,
      breaks: [],
    };
    current.sessions = [session, ...current.sessions];
    saveState(current);
    refreshState();
    const result = await sendDiscordNotification(current, user.id, "🟢 دخول إلى المنجم", [
      { name: "الوقت", value: formatDateTime(session.startedAt), inline: true },
      { name: "المستخدم", value: user.name, inline: true },
    ]);
    setWebhookStatus(result);
  };

  const handleEnd = async () => {
    const current = loadState();
    const session = getActiveSession(current, user.id);
    if (!session) return;
    if (getBreak(session)) {
      setBreakError("لا يمكن تسجيل الخروج وأنت في غفوة. أنهِ الغفوة أولاً.");
      return;
    }
    session.endedAt = new Date().toISOString();
    saveState(current);
    refreshState();
    const duration = new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime();
    let breakMs = 0;
    for (const b of session.breaks) {
      if (b.endedAt) breakMs += new Date(b.endedAt).getTime() - new Date(b.startedAt).getTime();
    }
    const worked = Math.max(0, duration - breakMs);
    const result = await sendDiscordNotification(current, user.id, "🔴 خروج من المنجم", [
      { name: "وقت الدخول", value: formatDateTime(session.startedAt), inline: true },
      { name: "وقت الخروج", value: formatDateTime(session.endedAt), inline: true },
      { name: "مدة العمل", value: formatDuration(worked), inline: true },
    ]);
    setWebhookStatus(result);
  };

  const handleBreakStart = () => {
    if (!breakReason.trim()) {
      setBreakError("اكتب سبب الغفوة");
      return;
    }
    const current = loadState();
    const session = getActiveSession(current, user.id);
    if (!session) return;
    const b: Break = {
      id: crypto.randomUUID(),
      startedAt: new Date().toISOString(),
      endedAt: null,
      reason: breakReason.trim(),
    };
    session.breaks.push(b);
    saveState(current);
    refreshState();
    setBreakDialogOpen(false);
    setBreakReason("");
    setBreakError("");
    sendDiscordNotification(current, user.id, "☕ بدء غفوة", [
      { name: "السبب", value: b.reason, inline: true },
      { name: "الوقت", value: formatDateTime(b.startedAt), inline: true },
    ]).then(setWebhookStatus);
  };

  const handleBreakEnd = async () => {
    const current = loadState();
    const session = getActiveSession(current, user.id);
    if (!session) return;
    const b = getBreak(session);
    if (!b) return;
    b.endedAt = new Date().toISOString();
    saveState(current);
    refreshState();
    const duration = new Date(b.endedAt).getTime() - new Date(b.startedAt).getTime();
    const result = await sendDiscordNotification(current, user.id, "✅ انتهاء غفوة", [
      { name: "السبب", value: b.reason, inline: true },
      { name: "المدة", value: formatDuration(duration), inline: true },
      { name: "انتهت عند", value: formatDateTime(b.endedAt), inline: true },
    ]);
    setWebhookStatus(result);
  };

  const currentTime = now.toLocaleString("ar-SA", { dateStyle: "full", timeStyle: "medium" });

  const tabs: { id: TabId; label: string }[] = [
    { id: "dashboard", label: "لوحة التحكم" },
    { id: "history", label: "سجل الدوام" },
    { id: "ledger", label: "سجل البيع والشراء" },
    { id: "leaderboard", label: "ترتيب الخوياي" },
    { id: "vault", label: "خزنة" },
    { id: "calculator", label: "حاسبة" },
    { id: "sync", label: "المزامنة" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/[0.03] p-4 lg:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-bold tracking-widest text-primary">MINE ATTENDANCE</div>
            <h1 className="text-2xl font-bold text-foreground">لوحة {user.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{currentTime}</span>
            </div>
            <Button variant="outline" className="border-border" onClick={() => setActiveTab("sync")}>
              مزامنة البيانات
            </Button>
            <Button variant="outline" className="border-border" onClick={onLogout}>
              تسجيل الخروج
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              className={cn(
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border bg-card/50">
                <CardContent className="p-4">
                  <div className="text-xs font-bold tracking-wider text-muted-foreground">حالة الدوام</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={activeSession ? "default" : "outline"}
                      className={cn(activeSession ? "bg-emerald-500 text-white" : "text-muted-foreground")}
                    >
                      {activeSession ? "داخل المنجم" : "خارج المنجم"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/50">
                <CardContent className="p-4">
                  <div className="text-xs font-bold tracking-wider text-muted-foreground">وقت العمل الحالي</div>
                  <div className={cn("mt-2 text-3xl font-bold tabular-nums", showSessionWarning && "text-red-500")}>
                    {activeSession ? formatDuration(elapsedMs) : "--:--:--"}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/50">
                <CardContent className="p-4">
                  <div className="text-xs font-bold tracking-wider text-muted-foreground">حالة الغفوة</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={activeBreak ? "default" : "outline"}
                      className={cn(activeBreak ? "bg-amber-500 text-white" : "text-muted-foreground")}
                    >
                      {activeBreak ? "في غفوة" : "لا يوجد غفوة"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/50">
                <CardContent className="p-4">
                  <div className="text-xs font-bold tracking-wider text-muted-foreground">مدة الغفوة الحالية</div>
                  <div className={cn("mt-2 text-3xl font-bold tabular-nums", showBreakWarning && "text-red-500")}>
                    {activeBreak ? formatDuration(breakElapsedMs) : "--:--:--"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {(showSessionWarning || showBreakWarning) && (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {showSessionWarning && "تجاوز الدوام 15 ساعة — يرجى مراجعة الحالة."}
                  {showSessionWarning && showBreakWarning && " | "}
                  {showBreakWarning && "تجاوزت الغفوة ساعتين — يرجى إنهاؤها."}
                </AlertDescription>
              </Alert>
            )}

            {webhookStatus && !webhookStatus.ok && (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertDescription>فشل إرسال إشعار Discord: {webhookStatus.error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <Button
                size="lg"
                className="h-16 bg-emerald-500 text-white hover:bg-emerald-600"
                onClick={handleStart}
                disabled={!!activeSession}
              >
                <LogIn className="ml-2 h-5 w-5" />
                تسجيل دخول
              </Button>
              <Button
                size="lg"
                className="h-16 bg-amber-500 text-white hover:bg-amber-600"
                onClick={() => setBreakDialogOpen(true)}
                disabled={!activeSession || !!activeBreak}
              >
                <Coffee className="ml-2 h-5 w-5" />
                بدء غفوة
              </Button>
              <Button
                size="lg"
                className="h-16 bg-red-500 text-white hover:bg-red-600"
                onClick={handleEnd}
                disabled={!activeSession || !!activeBreak}
              >
                <LogOut className="ml-2 h-5 w-5" />
                تسجيل خروج
              </Button>
            </div>

            {activeBreak && (
              <Card className="border-border bg-card/50">
                <CardContent className="p-4">
                  <div className="text-sm font-bold text-foreground">غفوة نشطة: {activeBreak.reason}</div>
                  <div className="mt-2 text-xs text-muted-foreground">بدأت: {formatDateTime(activeBreak.startedAt)}</div>
                  <Button className="mt-3 bg-primary" onClick={handleBreakEnd}>
                    إنهاء الغفوة
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "history" && <HistoryTable user={user} />}
        {activeTab === "ledger" && <AdminLedger />}
        {activeTab === "leaderboard" && <Leaderboard />}
        {activeTab === "vault" && <Vault />}
        {activeTab === "calculator" && <Calculator />}
        {activeTab === "sync" && <DataSyncPanel />}
      </div>

      <Dialog open={breakDialogOpen} onOpenChange={setBreakDialogOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>بدء غفوة</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              اكتب سبب الغفوة قبل البدء. لا يمكن تسجيل الخروج قبل إنهائها.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="مثال: الصلاة، الغداء، استراحة..."
            value={breakReason}
            onChange={(e) => setBreakReason(e.target.value)}
            className="border-border bg-background"
          />
          {breakError && <div className="text-sm text-destructive">{breakError}</div>}
          <DialogFooter>
            <Button variant="outline" className="border-border" onClick={() => { setBreakDialogOpen(false); setBreakError(""); setBreakReason(""); }}>
              إلغاء
            </Button>
            <Button className="bg-primary" onClick={handleBreakStart}>
              بدء الغفوة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}