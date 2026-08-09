import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { HardHat } from "lucide-react";

export interface LoggedInUser {
  id: string;
  name: string;
  isAdmin: boolean;
  discordWebhookUrl: string;
}

interface LoginScreenProps {
  onLogin: (user: LoggedInUser) => void;
}

const TEAM_MEMBERS = [
  { key: "ibrahim", name: "إبراهيم" },
  { key: "rayan", name: "ريان" },
  { key: "faisal", name: "فيصل" },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [userKey, setUserKey] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedMember = TEAM_MEMBERS.find((m) => m.key === userKey);

  const handleSelectUser = async (key: string) => {
    setUserKey(key);
    setPassword("");
    setConfirmPassword("");
    setError("");
    setChecking(true);

    const { data, error } = await supabase.rpc("user_exists", { p_user_key: key });

    setChecking(false);

    if (error) {
      setError("تعذر التحقق من الحساب، حاول مرة أخرى");
      return;
    }

    setIsRegistering(!data);
  };

  const handleLogin = async () => {
    setError("");
    if (!userKey) {
      setError("اختر اسمك من القائمة");
      return;
    }
    if (!password) {
      setError("اكتب كلمة المرور");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.rpc("login_user", {
      p_user_key: userKey,
      p_password: password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const row = data?.[0];
    if (!row) {
      setError("تعذر تسجيل الدخول");
      return;
    }

    onLogin({
      id: row.id,
      name: row.name,
      isAdmin: row.is_admin,
      discordWebhookUrl: row.discord_webhook_url || "",
    });
  };

  const handleRegister = async () => {
    setError("");
    if (!password || password.length < 4) {
      setError("كلمة المرور يجب تكون 4 أحرف على الأقل");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    if (!selectedMember) return;

    setLoading(true);
    const { data, error } = await supabase.rpc("register_user", {
      p_user_key: selectedMember.key,
      p_name: selectedMember.name,
      p_password: password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const row = data?.[0];
    if (!row) {
      setError("تعذر إنشاء الحساب");
      return;
    }

    onLogin({
      id: row.id,
      name: row.name,
      isAdmin: row.is_admin,
      discordWebhookUrl: "",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/[0.04] p-4">
      <Card className="w-full max-w-md border-border bg-card/80 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <HardHat className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Mine Attendance</CardTitle>
          <CardDescription className="text-muted-foreground">تسجيل الدخول إلى نظام دوام المنجم</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={userKey} onValueChange={handleSelectUser}>
            <SelectTrigger className="border-border bg-background text-right">
              <SelectValue placeholder="اختر اسمك" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover">
              {TEAM_MEMBERS.map((m) => (
                <SelectItem key={m.key} value={m.key} className="text-right">
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isRegistering && userKey && !checking && (
            <div className="rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
              أول مرة لـ {selectedMember?.name} — أنشئ كلمة مرور
            </div>
          )}

          <Input
            type="password"
            placeholder={isRegistering ? "كلمة المرور الجديدة" : "كلمة المرور"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-border bg-background text-right"
            disabled={!userKey || checking}
          />

          {isRegistering && (
            <Input
              type="password"
              placeholder="أكد كلمة المرور"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-border bg-background text-right"
            />
          )}

          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isRegistering ? (
            <Button className="w-full bg-primary" onClick={handleRegister} disabled={loading || checking}>
              {loading ? "جاري الإنشاء..." : "إنشاء كلمة المرور"}
            </Button>
          ) : (
            <Button className="w-full bg-primary" onClick={handleLogin} disabled={loading || checking || !userKey}>
              {loading ? "جاري الدخول..." : "دخول"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}