export type CommodityCategory = "refined" | "precious" | "processed" | "gemstone";

export interface Commodity {
  id: string;
  name: string;
  category: CommodityCategory;
  price: number;
  stock: number;
  image: string;
  label: string;
}

export const commodities: Commodity[] = [
  { id: "bauxite", name: "Bauxite Ingot", category: "refined", price: 500, stock: 0, image: "🧱", label: "REFINED METAL" },
  { id: "iron", name: "Iron Ingot", category: "refined", price: 600, stock: 0, image: "⚙️", label: "REFINED METAL" },
  { id: "copper", name: "Copper Ingot", category: "refined", price: 650, stock: 0, image: "🔶", label: "REFINED METAL" },
  { id: "zinc", name: "Zinc Ingot", category: "refined", price: 700, stock: 0, image: "🔩", label: "REFINED METAL" },
  { id: "silver", name: "Silver Ingot", category: "precious", price: 900, stock: 0, image: "🪙", label: "PRECIOUS METAL" },
  { id: "gold", name: "Gold Ingot", category: "precious", price: 1600, stock: 0, image: "🌟", label: "PRECIOUS METAL" },
  { id: "coal", name: "Coal Pack", category: "processed", price: 350, stock: 0, image: "⚫", label: "PROCESSED MINERAL" },
  { id: "ruby", name: "Ruby Pack", category: "gemstone", price: 2600, stock: 0, image: "💎", label: "CUT GEMSTONE" },
  { id: "sapphire", name: "Sapphire Pack", category: "gemstone", price: 2900, stock: 0, image: "🔷", label: "CUT GEMSTONE" },
  { id: "diamond", name: "Diamond Pack", category: "gemstone", price: 4200, stock: 0, image: "💠", label: "CUT GEMSTONE" },
];

export const categoryFilters: { value: string; label: string }[] = [
  { value: "all", label: "All materials" },
  { value: "refined", label: "Ingots" },
  { value: "gemstone", label: "Gems & packs" },
];
