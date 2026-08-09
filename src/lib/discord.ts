import { getWebhookUrl, type AppState } from "./storage";

export async function sendDiscordNotification(
  state: AppState,
  userId: string,
  title: string,
  fields: { name: string; value: string; inline?: boolean }[]
): Promise<{ ok: boolean; error?: string }> {
  const url = getWebhookUrl(state, userId);
  if (!url) return { ok: false, error: "No webhook configured" };

  const user = state.users.find((u) => u.id === userId);

  const payload = {
    username: "Mine Attendance Bot",
    embeds: [
      {
        title,
        color: 0xf97316,
        fields,
        footer: { text: `User: ${user?.name ?? userId}` },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error" };
  }
}
