import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { exportState, importState, loadState, saveState } from "@/lib/storage";
import { Download, Upload, Link2, Save } from "lucide-react";
import { toast } from "sonner";

export function DataSyncPanel() {
  const [globalWebhook, setGlobalWebhook] = useState(loadState().discordWebhookUrl || "");
  const [importText, setImportText] = useState("");

  const handleExport = () => {
    const blob = new Blob([exportState()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mine-attendance-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير البيانات");
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    if (importState(importText)) {
      setImportText("");
      toast.success("تم استيراد البيانات بنجاح");
    } else {
      toast.error("ملف JSON غير صالح");
    }
  };

  const saveWebhook = () => {
    const state = loadState();
    state.discordWebhookUrl = globalWebhook.trim();
    saveState(state);
    toast.success("تم حفظ رابط Discord");
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-bold text-foreground">المزامنة والإعدادات</div>

      <Card className="border-border bg-card/50">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Link2 className="h-4 w-4 text-primary" />
            رابط Discord Webhook العام
          </div>
          <Input
            placeholder="https://discord.com/api/webhooks/..."
            value={globalWebhook}
            onChange={(e) => setGlobalWebhook(e.target.value)}
            className="border-border bg-background"
          />
          <Button className="bg-primary" onClick={saveWebhook}>
            <Save className="ml-2 h-4 w-4" />
            حفظ الرابط
          </Button>
          <p className="text-xs text-muted-foreground">
            يُستخدم هذا الرابط لإرسال إشعارات الدخول والخروج والغفوات. يمكن لكل شخص أيضاً تعيين رابط خاص في بياناته (غير متاح هنا).
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Download className="h-4 w-4 text-primary" />
            تصدير البيانات
          </div>
          <p className="text-xs text-muted-foreground">
            احفظ نسخة JSON من البيانات لتشاركها مع الآخرين أو لاسترجاعها لاحقاً. يشمل: كلمات المرور (مشفّرة)، سجلات الدوام، والعمليات.
          </p>
          <Button variant="outline" className="border-border" onClick={handleExport}>
            <Download className="ml-2 h-4 w-4" />
            تحميل JSON
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/50">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Upload className="h-4 w-4 text-primary" />
            استيراد البيانات
          </div>
          <p className="text-xs text-muted-foreground">
            الصق محتوى ملف JSON المُصدّر سابقاً لاستعادة البيانات. سيتم استبدال البيانات المحلية الحالية.
          </p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="{ ... }"
            className="h-32 w-full rounded-md border border-border bg-background p-3 text-xs font-mono text-foreground"
          />
          <Button className="bg-primary" onClick={handleImport}>
            <Upload className="ml-2 h-4 w-4" />
            استيراد
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
