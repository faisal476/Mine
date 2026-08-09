const STORAGE_KEY = "mine-attendance-v1";

export interface Break {
  id: string;
  startedAt: string;
  endedAt: string | null;
  reason: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string | null;
  breaks: Break[];
}

export interface TradeRecord {
  id: string;
  userId: string;
  material: string;
  boughtQty: number;
  paidAmount: number;
  soldQty: number;
  soldPrice: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  passwordHash: string;
  isAdmin: boolean;
  discordWebhookUrl: string;
  failedAttempts: number;
  lockedUntil: number | null;
}

export interface NoteRecord {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface AppState {
  users: User[];
  sessions: SessionRecord[];
  trades: TradeRecord[];
  notes: NoteRecord[];          // ⬅️ جديد
  discordWebhookUrl: string;
}

export const defaultState: AppState = {
  users: [
    { id: "ibrahim", name: "إبراهيم", passwordHash: "", isAdmin: true, discordWebhookUrl: "", failedAttempts: 0, lockedUntil: null },
    { id: "rayan", name: "ريان", passwordHash: "", isAdmin: false, discordWebhookUrl: "", failedAttempts: 0, lockedUntil: null },
    { id: "faisal", name: "فيصل", passwordHash: "", isAdmin: false, discordWebhookUrl: "", failedAttempts: 0, lockedUntil: null },
  ],
  sessions: [],
  trades: [],
  notes: [],                    // ⬅️ جديد
  discordWebhookUrl: "",
};

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    const parsed = JSON.parse(raw) as AppState;
    return {
      ...defaultState,
      ...parsed,
      users: defaultState.users.map((u) => {
        const existing = parsed.users.find((eu) => eu.id === u.id);
        return existing ? { ...u, ...existing, isAdmin: u.isAdmin } : u;
      }),
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportState(): string {
  return JSON.stringify(loadState(), null, 2);
}

export function importState(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as AppState;
    if (!parsed.users || !parsed.sessions || !parsed.trades) return false;
    saveState(parsed);
    return true;
  } catch {
    return false;
  }
}

export function getActiveSession(state: AppState, userId: string): SessionRecord | undefined {
  return state.sessions.find((s) => s.userId === userId && !s.endedAt);
}

export function getBreak(session: SessionRecord): Break | undefined {
  return session.breaks.find((b) => !b.endedAt);
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "medium" });
}

export function getWebhookUrl(state: AppState, userId: string): string {
  const user = state.users.find((u) => u.id === userId);
  return user?.discordWebhookUrl?.trim() || state.discordWebhookUrl?.trim() || "";
}
