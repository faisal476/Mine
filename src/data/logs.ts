export interface WebhookLog {
  id: string;
  event: string;
  timestamp: string;
  status: "success" | "warning" | "error";
  payload: string;
  source: string;
}

export const webhookLogs: WebhookLog[] = [
  {
    id: "w1",
    event: "crew.member.joined",
    timestamp: "2026-08-09T14:30:00Z",
    status: "success",
    payload: '{"member":"Ahmed","role":"Miner"}',
    source: "mine-api",
  },
  {
    id: "w2",
    event: "commodity.sold",
    timestamp: "2026-08-09T14:28:00Z",
    status: "success",
    payload: '{"material":"Gold Ingot","amount":3,"value":4800}',
    source: "market-api",
  },
  {
    id: "w3",
    event: "fuel.low",
    timestamp: "2026-08-09T14:15:00Z",
    status: "warning",
    payload: '{"level":18,"capacity":25}',
    source: "fuel-monitor",
  },
  {
    id: "w4",
    event: "scammer.detected",
    timestamp: "2026-08-09T13:50:00Z",
    status: "error",
    payload: '{"member":"Saud","reason":"No collection activity"}',
    source: "anti-cheat",
  },
  {
    id: "w5",
    event: "upgrade.installed",
    timestamp: "2026-08-09T12:00:00Z",
    status: "success",
    payload: '{"upgrade":"Ore Sorter & Storage"}',
    source: "mine-api",
  },
  {
    id: "w6",
    event: "pickaxe.damaged",
    timestamp: "2026-08-09T11:45:00Z",
    status: "warning",
    payload: '{"pickaxe":"Pickaxe 3","remaining":4}',
    source: "equipment-monitor",
  },
  {
    id: "w7",
    event: "fuel.delivery",
    timestamp: "2026-08-09T09:00:00Z",
    status: "success",
    payload: '{"amount":7,"cost":350}',
    source: "fuel-monitor",
  },
  {
    id: "w8",
    event: "crew.member.left",
    timestamp: "2026-08-08T22:00:00Z",
    status: "success",
    payload: '{"member":"Omar","duration":"4h 12m"}',
    source: "mine-api",
  },
];
