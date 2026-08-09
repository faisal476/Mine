export interface CrewMember {
  id: string;
  name: string;
  role: string;
  joinedAt: string;
  totalCollected: number;
  lastEntry: string | null;
  status: "active" | "idle" | "scammer";
  collections: CollectionRecord[];
}

export interface CollectionRecord {
  id: string;
  material: string;
  amount: number;
  value: number;
  timestamp: string;
}

export const crewMembers: CrewMember[] = [
  {
    id: "1",
    name: "Ahmed",
    role: "Miner",
    joinedAt: "2026-08-01T08:00:00Z",
    totalCollected: 12400,
    lastEntry: "2026-08-09T14:30:00Z",
    status: "active",
    collections: [
      { id: "c1", material: "Gold Ingot", amount: 3, value: 4800, timestamp: "2026-08-09T14:30:00Z" },
      { id: "c2", material: "Iron Ingot", amount: 10, value: 6000, timestamp: "2026-08-09T12:00:00Z" },
      { id: "c3", material: "Coal Pack", amount: 4, value: 1400, timestamp: "2026-08-09T09:15:00Z" },
    ],
  },
  {
    id: "2",
    name: "Khalid",
    role: "Foreman",
    joinedAt: "2026-08-02T10:00:00Z",
    totalCollected: 8900,
    lastEntry: "2026-08-09T13:45:00Z",
    status: "active",
    collections: [
      { id: "c4", material: "Diamond Pack", amount: 1, value: 4200, timestamp: "2026-08-09T13:45:00Z" },
      { id: "c5", material: "Copper Ingot", amount: 5, value: 3250, timestamp: "2026-08-09T11:20:00Z" },
      { id: "c6", material: "Coal Pack", amount: 4, value: 1400, timestamp: "2026-08-09T08:00:00Z" },
    ],
  },
  {
    id: "3",
    name: "Saud",
    role: "Miner",
    joinedAt: "2026-08-03T07:30:00Z",
    totalCollected: 0,
    lastEntry: null,
    status: "scammer",
    collections: [],
  },
  {
    id: "4",
    name: "Faisal",
    role: "Engineer",
    joinedAt: "2026-08-05T09:00:00Z",
    totalCollected: 5200,
    lastEntry: "2026-08-09T10:00:00Z",
    status: "idle",
    collections: [
      { id: "c7", material: "Silver Ingot", amount: 4, value: 3600, timestamp: "2026-08-09T10:00:00Z" },
      { id: "c8", material: "Coal Pack", amount: 2, value: 700, timestamp: "2026-08-09T07:30:00Z" },
      { id: "c9", material: "Zinc Ingot", amount: 1, value: 700, timestamp: "2026-08-08T18:00:00Z" },
    ],
  },
];
