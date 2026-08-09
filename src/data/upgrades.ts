export interface Upgrade {
  id: string;
  name: string;
  description: string;
  tier: string;
  maxTier: string;
  progress: number;
  requirement: string;
  cost: number;
  installed: boolean;
  locked: boolean;
}

export interface Pickaxe {
  id: string;
  name: string;
  remainingCells: number;
  maxCells: number;
  operational: boolean;
}

export const pickaxes: Pickaxe[] = [
  { id: "p1", name: "Pickaxe 1", remainingCells: 12, maxCells: 300, operational: true },
  { id: "p2", name: "Pickaxe 2", remainingCells: 160, maxCells: 300, operational: true },
  { id: "p3", name: "Pickaxe 3", remainingCells: 4, maxCells: 300, operational: true },
];

export const upgrades: Upgrade[] = [
  {
    id: "u1",
    name: "Crew Equipment Rack",
    description: "Expands the shared pickaxe and helmet rack for larger crews.",
    tier: "2",
    maxTier: "3",
    progress: 67,
    requirement: "Mine Level 4",
    cost: 4800,
    installed: false,
    locked: false,
  },
  {
    id: "u2",
    name: "Ore Sorter & Storage",
    description: "Installs the sorter, conveyor, mineral bins, and packing stations.",
    tier: "1",
    maxTier: "1",
    progress: 100,
    requirement: "Processing line",
    cost: 0,
    installed: true,
    locked: false,
  },
  {
    id: "u3",
    name: "Rail Infrastructure",
    description: "Constructs the starter track and unlocks rail supply purchases.",
    tier: "1",
    maxTier: "1",
    progress: 100,
    requirement: "Starter rail network",
    cost: 0,
    installed: true,
    locked: false,
  },
  {
    id: "u4",
    name: "Minecart Fleet",
    description: "Adds another persistent ore cart to the mine rail network.",
    tier: "0",
    maxTier: "4",
    progress: 100,
    requirement: "Mine Level 2",
    cost: 2000,
    installed: false,
    locked: true,
  },
  {
    id: "u5",
    name: "Controlled Blasting",
    description: "Unlocks dynamite supplies and side-shaft excavation.",
    tier: "1",
    maxTier: "1",
    progress: 100,
    requirement: "Blasting permit",
    cost: 0,
    installed: true,
    locked: false,
  },
  {
    id: "u6",
    name: "Mining Locomotive",
    description: "Installs the locomotive used to haul purchased minecarts.",
    tier: "0",
    maxTier: "1",
    progress: 100,
    requirement: "Mine Level 3",
    cost: 12000,
    installed: false,
    locked: true,
  },
  {
    id: "u7",
    name: "Iron Furnace",
    description: "The starter furnace included with every new mining claim.",
    tier: "1",
    maxTier: "1",
    progress: 54,
    requirement: "Iron casting",
    cost: 0,
    installed: true,
    locked: false,
  },
  {
    id: "u8",
    name: "Copper Furnace",
    description: "Installs a dedicated copper heating and casting line.",
    tier: "1",
    maxTier: "1",
    progress: 56,
    requirement: "Copper casting",
    cost: 0,
    installed: true,
    locked: false,
  },
  {
    id: "u9",
    name: "Silver Furnace",
    description: "Installs a dedicated silver heating and casting line.",
    tier: "1",
    maxTier: "1",
    progress: 86,
    requirement: "Silver casting",
    cost: 0,
    installed: true,
    locked: false,
  },
  {
    id: "u10",
    name: "Gold Furnace",
    description: "Installs a secured precious-metal casting line.",
    tier: "0",
    maxTier: "1",
    progress: 100,
    requirement: "Mine Level 4",
    cost: 12000,
    installed: false,
    locked: true,
  },
  {
    id: "u11",
    name: "Bauxite Furnace",
    description: "Installs the mine's highest-temperature casting line.",
    tier: "0",
    maxTier: "1",
    progress: 100,
    requirement: "Mine Level 5",
    cost: 16000,
    installed: false,
    locked: true,
  },
  {
    id: "u12",
    name: "Nickel Furnace",
    description: "Installs a high-temperature nickel casting line.",
    tier: "1",
    maxTier: "1",
    progress: 74,
    requirement: "Nickel casting",
    cost: 0,
    installed: true,
    locked: false,
  },
];

export interface StorageItem {
  id: string;
  name: string;
  units: number;
}

export const processedStorage: StorageItem[] = [
  { id: "bauxite", name: "Bauxite", units: 256 },
  { id: "sapphire", name: "Sapphire", units: 21 },
  { id: "coal", name: "Coal", units: 50 },
  { id: "diamond", name: "Diamond", units: 5 },
  { id: "gold", name: "Gold", units: 173 },
  { id: "iron", name: "Iron", units: 9 },
  { id: "silver", name: "Silver", units: 0 },
  { id: "nickel", name: "Nickel", units: 11 },
  { id: "copper", name: "Copper", units: 18 },
  { id: "ruby", name: "Ruby", units: 33 },
];

export interface SupplyItem {
  id: string;
  name: string;
  inStock: number;
  cost: number;
}

export const propertySupplies: SupplyItem[] = [
  { id: "rail", name: "Rail", inStock: 0, cost: 500 },
  { id: "dynamite", name: "Dynamite", inStock: 2, cost: 1200 },
  { id: "lamp", name: "Lamp", inStock: 2, cost: 250 },
];
