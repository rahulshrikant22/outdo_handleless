// ============================================================
// OutDo Pricing Management Module — Phase 4 Data Layer
// Correlated: Pricing Items → Quotation Line Items → Orders
// ============================================================

import type { ProjectCategory } from "./orders";

// ---------- Types ----------
export type PricingUnit = "mm" | "ft" | "inch" | "sqft" | "set" | "nos" | "lump";
export type PricingStatus = "active" | "inactive" | "draft" | "discontinued";
export type PricingItemType = "shutter" | "panel" | "hardware" | "accessory" | "service" | "track" | "insert";

export interface PricingRateChange {
  id: string;
  previousRate: number;
  newRate: number;
  changedAt: string;
  changedBy: string;
  reason: string;
}

export interface PricingItem {
  id: string;
  itemName: string;
  category: ProjectCategory;
  itemType: PricingItemType;
  unit: PricingUnit;
  rate: number;
  minOrderQty: number;
  status: PricingStatus;
  effectiveFrom: string;
  effectiveTo: string | null; // null = no expiry
  description: string;
  dimensions?: { length?: number; height?: number; thickness?: number };
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  rateHistory: PricingRateChange[];
  tags: string[];
}

// ---------- Pricing Data ----------
// Items match the quotation line items from Phase 3 orders.ts
export const pricingItems: PricingItem[] = [
  // ===== KITCHEN =====
  {
    id: "PRC-001",
    itemName: "Base Cabinet Shutter - 600mm",
    category: "kitchen",
    itemType: "shutter",
    unit: "nos",
    rate: 4200,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-10-01",
    effectiveTo: null,
    description: "Standard 600mm base cabinet handleless shutter with J-profile groove. MDF core, premium laminate finish.",
    dimensions: { length: 600, height: 720, thickness: 18 },
    createdAt: "2025-09-15",
    updatedAt: "2026-01-10",
    updatedBy: "Rajesh Kumar",
    rateHistory: [
      { id: "RH001", previousRate: 3800, newRate: 4000, changedAt: "2025-10-01", changedBy: "Rajesh Kumar", reason: "Material cost increase — MDF prices up 8%" },
      { id: "RH002", previousRate: 4000, newRate: 4200, changedAt: "2026-01-10", changedBy: "Rajesh Kumar", reason: "Q1 2026 price revision — laminate cost adjustment" },
    ],
    tags: ["kitchen", "base", "600mm", "standard"],
  },
  {
    id: "PRC-002",
    itemName: "Base Cabinet Shutter - 450mm",
    category: "kitchen",
    itemType: "shutter",
    unit: "nos",
    rate: 3800,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-10-01",
    effectiveTo: null,
    description: "Narrow 450mm base cabinet handleless shutter. MDF core with premium finish.",
    dimensions: { length: 450, height: 720, thickness: 18 },
    createdAt: "2025-09-15",
    updatedAt: "2025-12-15",
    updatedBy: "Rajesh Kumar",
    rateHistory: [
      { id: "RH003", previousRate: 3500, newRate: 3800, changedAt: "2025-10-01", changedBy: "Rajesh Kumar", reason: "Initial pricing revision with 600mm line" },
    ],
    tags: ["kitchen", "base", "450mm"],
  },
  {
    id: "PRC-003",
    itemName: "Wall Cabinet Shutter - 600mm",
    category: "kitchen",
    itemType: "shutter",
    unit: "nos",
    rate: 3200,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-10-01",
    effectiveTo: null,
    description: "600mm wall cabinet handleless shutter. Lighter construction, same premium finish as base units.",
    dimensions: { length: 600, height: 360, thickness: 18 },
    createdAt: "2025-09-15",
    updatedAt: "2025-10-01",
    updatedBy: "Rajesh Kumar",
    rateHistory: [],
    tags: ["kitchen", "wall", "600mm"],
  },
  {
    id: "PRC-004",
    itemName: "Tall Unit Shutter - 600mm",
    category: "kitchen",
    itemType: "shutter",
    unit: "nos",
    rate: 8500,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-10-01",
    effectiveTo: null,
    description: "Full-height 2100mm tall unit shutter. Reinforced MDF core for structural rigidity.",
    dimensions: { length: 600, height: 2100, thickness: 18 },
    createdAt: "2025-09-15",
    updatedAt: "2026-02-01",
    updatedBy: "Priya Sharma",
    rateHistory: [
      { id: "RH004", previousRate: 7800, newRate: 8500, changedAt: "2026-02-01", changedBy: "Priya Sharma", reason: "Height premium + reinforcement cost" },
    ],
    tags: ["kitchen", "tall", "600mm", "premium"],
  },
  {
    id: "PRC-005",
    itemName: "Drawer Front Panel - 600mm",
    category: "kitchen",
    itemType: "panel",
    unit: "nos",
    rate: 1800,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-10-01",
    effectiveTo: null,
    description: "600mm drawer front panel with handleless profile. Standard 140mm height.",
    dimensions: { length: 600, height: 140, thickness: 18 },
    createdAt: "2025-09-15",
    updatedAt: "2025-10-01",
    updatedBy: "Rajesh Kumar",
    rateHistory: [],
    tags: ["kitchen", "drawer", "600mm"],
  },
  {
    id: "PRC-006",
    itemName: "J-Profile Handle Strip",
    category: "kitchen",
    itemType: "accessory",
    unit: "nos",
    rate: 450,
    minOrderQty: 4,
    status: "active",
    effectiveFrom: "2025-10-01",
    effectiveTo: null,
    description: "Aluminium J-profile handle strip, anodised finish. 600mm length, 40mm depth.",
    dimensions: { length: 600, height: 40, thickness: 3 },
    createdAt: "2025-09-15",
    updatedAt: "2026-01-15",
    updatedBy: "Rajesh Kumar",
    rateHistory: [
      { id: "RH005", previousRate: 400, newRate: 450, changedAt: "2026-01-15", changedBy: "Rajesh Kumar", reason: "Aluminium price increase" },
    ],
    tags: ["kitchen", "hardware", "j-profile", "handle"],
  },
  {
    id: "PRC-007",
    itemName: "Soft Close Hinge Set",
    category: "kitchen",
    itemType: "hardware",
    unit: "set",
    rate: 280,
    minOrderQty: 2,
    status: "active",
    effectiveFrom: "2025-10-01",
    effectiveTo: null,
    description: "Pair of soft-close concealed hinges, 110° opening. European quality, clip-on mount.",
    createdAt: "2025-09-15",
    updatedAt: "2025-10-01",
    updatedBy: "Rajesh Kumar",
    rateHistory: [],
    tags: ["kitchen", "hardware", "hinge", "soft-close"],
  },
  {
    id: "PRC-008",
    itemName: "Installation & Alignment",
    category: "kitchen",
    itemType: "service",
    unit: "lump",
    rate: 15000,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-10-01",
    effectiveTo: null,
    description: "On-site installation, alignment, and final adjustment for kitchen shutters (up to 20 shutters).",
    createdAt: "2025-09-15",
    updatedAt: "2026-03-01",
    updatedBy: "Priya Sharma",
    rateHistory: [
      { id: "RH006", previousRate: 12000, newRate: 15000, changedAt: "2026-03-01", changedBy: "Priya Sharma", reason: "Labour cost revision + travel included" },
    ],
    tags: ["kitchen", "service", "installation"],
  },
  // ===== WARDROBE =====
  {
    id: "PRC-009",
    itemName: "Wardrobe Sliding Shutter - 900mm",
    category: "wardrobe",
    itemType: "shutter",
    unit: "nos",
    rate: 12500,
    minOrderQty: 2,
    status: "active",
    effectiveFrom: "2025-11-01",
    effectiveTo: null,
    description: "900mm sliding wardrobe shutter, full-height 2400mm. Premium laminate with edge banding.",
    dimensions: { length: 900, height: 2400, thickness: 18 },
    createdAt: "2025-10-20",
    updatedAt: "2026-02-10",
    updatedBy: "Sneha Reddy",
    rateHistory: [
      { id: "RH007", previousRate: 11500, newRate: 12500, changedAt: "2026-02-10", changedBy: "Sneha Reddy", reason: "Added edge banding and premium finish as standard" },
    ],
    tags: ["wardrobe", "sliding", "900mm", "full-height"],
  },
  {
    id: "PRC-010",
    itemName: "Wardrobe Fixed Panel",
    category: "wardrobe",
    itemType: "panel",
    unit: "nos",
    rate: 8000,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-11-01",
    effectiveTo: null,
    description: "Fixed side panel for wardrobe system. Same finish as sliding shutters.",
    dimensions: { length: 900, height: 2400, thickness: 18 },
    createdAt: "2025-10-20",
    updatedAt: "2025-11-01",
    updatedBy: "Sneha Reddy",
    rateHistory: [],
    tags: ["wardrobe", "fixed", "panel"],
  },
  {
    id: "PRC-011",
    itemName: "Internal Drawer Front - 800mm",
    category: "wardrobe",
    itemType: "panel",
    unit: "nos",
    rate: 2200,
    minOrderQty: 2,
    status: "active",
    effectiveFrom: "2025-11-01",
    effectiveTo: null,
    description: "Internal drawer front for wardrobe. 800mm width, 200mm height.",
    dimensions: { length: 800, height: 200, thickness: 18 },
    createdAt: "2025-10-20",
    updatedAt: "2025-11-01",
    updatedBy: "Sneha Reddy",
    rateHistory: [],
    tags: ["wardrobe", "drawer", "internal"],
  },
  {
    id: "PRC-012",
    itemName: "Sliding Track System",
    category: "wardrobe",
    itemType: "track",
    unit: "set",
    rate: 4500,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-11-01",
    effectiveTo: null,
    description: "Top & bottom aluminium sliding track set, soft-close bumpers included. 1800mm span.",
    dimensions: { length: 1800 },
    createdAt: "2025-10-20",
    updatedAt: "2026-01-20",
    updatedBy: "Sneha Reddy",
    rateHistory: [
      { id: "RH008", previousRate: 4000, newRate: 4500, changedAt: "2026-01-20", changedBy: "Sneha Reddy", reason: "Upgraded to soft-close bumper system" },
    ],
    tags: ["wardrobe", "track", "sliding", "aluminium"],
  },
  {
    id: "PRC-013",
    itemName: "Mirror Panel Insert",
    category: "wardrobe",
    itemType: "insert",
    unit: "nos",
    rate: 7500,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-11-01",
    effectiveTo: null,
    description: "Full-height mirror panel insert, safety-backed. 900×2400mm.",
    dimensions: { length: 900, height: 2400, thickness: 6 },
    createdAt: "2025-10-20",
    updatedAt: "2025-11-01",
    updatedBy: "Sneha Reddy",
    rateHistory: [],
    tags: ["wardrobe", "mirror", "insert"],
  },
  {
    id: "PRC-014",
    itemName: "Soft Close Mechanism",
    category: "wardrobe",
    itemType: "hardware",
    unit: "nos",
    rate: 350,
    minOrderQty: 2,
    status: "active",
    effectiveFrom: "2025-11-01",
    effectiveTo: null,
    description: "Soft-close damper for sliding wardrobe doors. Universal fit.",
    createdAt: "2025-10-20",
    updatedAt: "2025-11-01",
    updatedBy: "Sneha Reddy",
    rateHistory: [],
    tags: ["wardrobe", "hardware", "soft-close"],
  },
  // ===== OFFICE =====
  {
    id: "PRC-015",
    itemName: "Partition Panel - 1200mm",
    category: "office",
    itemType: "panel",
    unit: "nos",
    rate: 15000,
    minOrderQty: 4,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "Commercial-grade partition panel, 1200×2700mm. 25mm thick, fire-rated core.",
    dimensions: { length: 1200, height: 2700, thickness: 25 },
    createdAt: "2025-11-15",
    updatedAt: "2026-02-20",
    updatedBy: "Priya Sharma",
    rateHistory: [
      { id: "RH009", previousRate: 14000, newRate: 15000, changedAt: "2026-02-20", changedBy: "Priya Sharma", reason: "Fire-rated core upgrade now standard" },
    ],
    tags: ["office", "partition", "1200mm", "commercial", "fire-rated"],
  },
  {
    id: "PRC-016",
    itemName: "Partition Panel - 900mm",
    category: "office",
    itemType: "panel",
    unit: "nos",
    rate: 12000,
    minOrderQty: 4,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "Narrower 900mm partition panel for office layouts. Same 25mm fire-rated spec.",
    dimensions: { length: 900, height: 2700, thickness: 25 },
    createdAt: "2025-11-15",
    updatedAt: "2025-12-01",
    updatedBy: "Priya Sharma",
    rateHistory: [],
    tags: ["office", "partition", "900mm", "commercial"],
  },
  {
    id: "PRC-017",
    itemName: "Door Panel - 900mm",
    category: "office",
    itemType: "panel",
    unit: "nos",
    rate: 18000,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "Office door panel with handleless profile. 900×2100mm, heavy-duty hinges included.",
    dimensions: { length: 900, height: 2100, thickness: 25 },
    createdAt: "2025-11-15",
    updatedAt: "2025-12-01",
    updatedBy: "Priya Sharma",
    rateHistory: [],
    tags: ["office", "door", "900mm"],
  },
  {
    id: "PRC-018",
    itemName: "Glass Insert Panel",
    category: "office",
    itemType: "insert",
    unit: "nos",
    rate: 5500,
    minOrderQty: 2,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "Toughened glass insert for office partitions. 600×1200mm, frosted option available.",
    dimensions: { length: 600, height: 1200, thickness: 10 },
    createdAt: "2025-11-15",
    updatedAt: "2025-12-01",
    updatedBy: "Priya Sharma",
    rateHistory: [],
    tags: ["office", "glass", "insert", "partition"],
  },
  {
    id: "PRC-019",
    itemName: "Corner Post & Joinery",
    category: "office",
    itemType: "hardware",
    unit: "nos",
    rate: 1200,
    minOrderQty: 4,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "Aluminium corner post and joinery system for partition assembly. 2700mm height.",
    dimensions: { height: 2700 },
    createdAt: "2025-11-15",
    updatedAt: "2025-12-01",
    updatedBy: "Priya Sharma",
    rateHistory: [],
    tags: ["office", "hardware", "corner", "joinery"],
  },
  // ===== BATHROOM =====
  {
    id: "PRC-020",
    itemName: "Bathroom Vanity Shutters",
    category: "bathroom",
    itemType: "shutter",
    unit: "nos",
    rate: 3800,
    minOrderQty: 2,
    status: "active",
    effectiveFrom: "2025-11-01",
    effectiveTo: null,
    description: "Moisture-resistant vanity shutter, 600×600mm. Marine-grade MDF with waterproof laminate.",
    dimensions: { length: 600, height: 600, thickness: 18 },
    createdAt: "2025-10-20",
    updatedAt: "2026-01-05",
    updatedBy: "Rajesh Kumar",
    rateHistory: [
      { id: "RH010", previousRate: 3500, newRate: 3800, changedAt: "2026-01-05", changedBy: "Rajesh Kumar", reason: "Marine-grade MDF premium" },
    ],
    tags: ["bathroom", "vanity", "moisture-resistant"],
  },
  // ===== VILLA (multi-room items) =====
  {
    id: "PRC-021",
    itemName: "Kitchen Base Shutter Set",
    category: "villa",
    itemType: "shutter",
    unit: "set",
    rate: 4500,
    minOrderQty: 4,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "Villa package: base cabinet shutter set for large kitchens. Premium finish bundle pricing.",
    dimensions: { length: 600, height: 720, thickness: 18 },
    createdAt: "2025-11-20",
    updatedAt: "2025-12-01",
    updatedBy: "Sneha Reddy",
    rateHistory: [],
    tags: ["villa", "kitchen", "bundle", "base"],
  },
  {
    id: "PRC-022",
    itemName: "Kitchen Wall Cabinet Set",
    category: "villa",
    itemType: "shutter",
    unit: "set",
    rate: 3500,
    minOrderQty: 4,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "Villa package: wall cabinet shutter set. Matches base cabinet set finish.",
    dimensions: { length: 600, height: 360, thickness: 18 },
    createdAt: "2025-11-20",
    updatedAt: "2025-12-01",
    updatedBy: "Sneha Reddy",
    rateHistory: [],
    tags: ["villa", "kitchen", "bundle", "wall"],
  },
  {
    id: "PRC-023",
    itemName: "Master Wardrobe Shutters",
    category: "villa",
    itemType: "shutter",
    unit: "nos",
    rate: 13000,
    minOrderQty: 4,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "Premium master bedroom wardrobe shutter. 900×2400mm with soft-close hardware included.",
    dimensions: { length: 900, height: 2400, thickness: 18 },
    createdAt: "2025-11-20",
    updatedAt: "2026-02-15",
    updatedBy: "Sneha Reddy",
    rateHistory: [
      { id: "RH011", previousRate: 12000, newRate: 13000, changedAt: "2026-02-15", changedBy: "Sneha Reddy", reason: "Soft-close hardware now bundled in price" },
    ],
    tags: ["villa", "wardrobe", "master", "premium"],
  },
  {
    id: "PRC-024",
    itemName: "Guest Wardrobe Shutters",
    category: "villa",
    itemType: "shutter",
    unit: "nos",
    rate: 9500,
    minOrderQty: 2,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "Guest bedroom wardrobe shutter. 750×2100mm, standard finish.",
    dimensions: { length: 750, height: 2100, thickness: 18 },
    createdAt: "2025-11-20",
    updatedAt: "2025-12-01",
    updatedBy: "Sneha Reddy",
    rateHistory: [],
    tags: ["villa", "wardrobe", "guest"],
  },
  {
    id: "PRC-025",
    itemName: "Hardware & Accessories Kit",
    category: "villa",
    itemType: "hardware",
    unit: "set",
    rate: 28000,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "Complete hardware kit for villa projects: hinges, handles, tracks, soft-close mechanisms.",
    createdAt: "2025-11-20",
    updatedAt: "2026-03-10",
    updatedBy: "Priya Sharma",
    rateHistory: [
      { id: "RH012", previousRate: 25000, newRate: 28000, changedAt: "2026-03-10", changedBy: "Priya Sharma", reason: "Added additional hinge sets and premium track upgrade" },
    ],
    tags: ["villa", "hardware", "kit", "complete"],
  },
  {
    id: "PRC-026",
    itemName: "Installation - Full Villa",
    category: "villa",
    itemType: "service",
    unit: "lump",
    rate: 35000,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "Full villa installation: kitchen, wardrobes, bathrooms. Includes alignment and final touches.",
    createdAt: "2025-11-20",
    updatedAt: "2026-03-01",
    updatedBy: "Priya Sharma",
    rateHistory: [
      { id: "RH013", previousRate: 30000, newRate: 35000, changedAt: "2026-03-01", changedBy: "Priya Sharma", reason: "Expanded to include bathroom vanity installation" },
    ],
    tags: ["villa", "service", "installation", "full"],
  },
  // ===== INACTIVE / DISCONTINUED =====
  {
    id: "PRC-027",
    itemName: "Kitchen Shutter - 500mm (Old)",
    category: "kitchen",
    itemType: "shutter",
    unit: "nos",
    rate: 3600,
    minOrderQty: 1,
    status: "discontinued",
    effectiveFrom: "2025-06-01",
    effectiveTo: "2025-09-30",
    description: "Legacy 500mm kitchen shutter. Replaced by 450mm and 600mm standard sizes.",
    dimensions: { length: 500, height: 720, thickness: 18 },
    createdAt: "2025-05-01",
    updatedAt: "2025-09-30",
    updatedBy: "Rajesh Kumar",
    rateHistory: [],
    tags: ["kitchen", "legacy", "discontinued"],
  },
  {
    id: "PRC-028",
    itemName: "Handle Profile Strip",
    category: "kitchen",
    itemType: "accessory",
    unit: "nos",
    rate: 400,
    minOrderQty: 4,
    status: "active",
    effectiveFrom: "2025-10-01",
    effectiveTo: null,
    description: "Budget-range handle profile strip, 600mm length. Powder-coated aluminium.",
    dimensions: { length: 600, height: 40, thickness: 3 },
    createdAt: "2025-09-15",
    updatedAt: "2025-10-01",
    updatedBy: "Rajesh Kumar",
    rateHistory: [],
    tags: ["kitchen", "handle", "budget"],
  },
  {
    id: "PRC-029",
    itemName: "Hardware Kit - Standard",
    category: "kitchen",
    itemType: "hardware",
    unit: "set",
    rate: 8500,
    minOrderQty: 1,
    status: "active",
    effectiveFrom: "2025-10-01",
    effectiveTo: null,
    description: "Standard kitchen hardware kit: hinges, runners, bumpers, screws. For up to 15 shutters.",
    createdAt: "2025-09-15",
    updatedAt: "2025-10-01",
    updatedBy: "Rajesh Kumar",
    rateHistory: [],
    tags: ["kitchen", "hardware", "kit", "standard"],
  },
  {
    id: "PRC-030",
    itemName: "Utility Area Shutters",
    category: "kitchen",
    itemType: "shutter",
    unit: "nos",
    rate: 3200,
    minOrderQty: 2,
    status: "active",
    effectiveFrom: "2025-12-01",
    effectiveTo: null,
    description: "450×720mm utility area shutter. Standard finish, same as base cabinet line.",
    dimensions: { length: 450, height: 720, thickness: 18 },
    createdAt: "2025-11-20",
    updatedAt: "2025-12-01",
    updatedBy: "Rajesh Kumar",
    rateHistory: [],
    tags: ["kitchen", "utility", "450mm"],
  },
  {
    id: "PRC-031",
    itemName: "Bathroom Mirror Cabinet Shutter",
    category: "bathroom",
    itemType: "shutter",
    unit: "nos",
    rate: 4200,
    minOrderQty: 1,
    status: "draft",
    effectiveFrom: "2026-04-01",
    effectiveTo: null,
    description: "New product: mirror cabinet shutter for bathrooms. Pending final pricing approval.",
    dimensions: { length: 450, height: 600, thickness: 18 },
    createdAt: "2026-03-10",
    updatedAt: "2026-03-10",
    updatedBy: "Rajesh Kumar",
    rateHistory: [],
    tags: ["bathroom", "mirror", "cabinet", "new"],
  },
  {
    id: "PRC-032",
    itemName: "Commercial Sliding Panel - 1500mm",
    category: "commercial",
    itemType: "panel",
    unit: "nos",
    rate: 22000,
    minOrderQty: 2,
    status: "inactive",
    effectiveFrom: "2025-08-01",
    effectiveTo: "2026-01-31",
    description: "Large commercial sliding panel. Temporarily inactive — awaiting new supplier contract.",
    dimensions: { length: 1500, height: 2700, thickness: 25 },
    createdAt: "2025-07-15",
    updatedAt: "2026-02-01",
    updatedBy: "Priya Sharma",
    rateHistory: [
      { id: "RH014", previousRate: 20000, newRate: 22000, changedAt: "2025-12-01", changedBy: "Priya Sharma", reason: "Supplier price increase" },
    ],
    tags: ["commercial", "sliding", "1500mm", "large"],
  },
];

// ---------- Helpers ----------
export const getPricingItemById = (id: string) => pricingItems.find(p => p.id === id);

export const pricingCategories: ProjectCategory[] = ["kitchen", "wardrobe", "office", "bathroom", "villa", "commercial"];
export const pricingItemTypes: PricingItemType[] = ["shutter", "panel", "hardware", "accessory", "service", "track", "insert"];
export const pricingUnits: PricingUnit[] = ["mm", "ft", "inch", "sqft", "set", "nos", "lump"];
export const pricingStatuses: PricingStatus[] = ["active", "inactive", "draft", "discontinued"];

export function formatPricingUnit(u: PricingUnit): string {
  const map: Record<PricingUnit, string> = {
    mm: "mm", ft: "ft", inch: "inch", sqft: "sq.ft", set: "Set", nos: "Nos", lump: "Lump Sum",
  };
  return map[u];
}

export function formatItemType(t: PricingItemType): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// ---------- Dashboard Aggregations ----------
export function getPricingDashboardStats() {
  const total = pricingItems.length;
  const active = pricingItems.filter(p => p.status === "active").length;
  const inactive = pricingItems.filter(p => p.status === "inactive").length;
  const draft = pricingItems.filter(p => p.status === "draft").length;
  const discontinued = pricingItems.filter(p => p.status === "discontinued").length;

  // Category counts
  const categoryCounts = pricingCategories.map(cat => ({
    category: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: pricingItems.filter(p => p.category === cat).length,
    active: pricingItems.filter(p => p.category === cat && p.status === "active").length,
  })).filter(c => c.count > 0);

  // Unit counts
  const unitCounts = pricingUnits.map(u => ({
    unit: formatPricingUnit(u),
    count: pricingItems.filter(p => p.unit === u).length,
  })).filter(u => u.count > 0);

  // Type counts
  const typeCounts = pricingItemTypes.map(t => ({
    type: formatItemType(t),
    count: pricingItems.filter(p => p.itemType === t).length,
  })).filter(t => t.count > 0);

  // Recent rate changes (across all items, sorted by date)
  const recentChanges = pricingItems
    .flatMap(p => p.rateHistory.map(rh => ({ ...rh, itemId: p.id, itemName: p.itemName, category: p.category })))
    .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
    .slice(0, 8);

  // Average rates by category
  const avgRates = pricingCategories.map(cat => {
    const items = pricingItems.filter(p => p.category === cat && p.status === "active");
    const avg = items.length > 0 ? Math.round(items.reduce((s, p) => s + p.rate, 0) / items.length) : 0;
    return { category: cat.charAt(0).toUpperCase() + cat.slice(1), avgRate: avg, items: items.length };
  }).filter(c => c.items > 0);

  return {
    total, active, inactive, draft, discontinued,
    categoryCounts, unitCounts, typeCounts,
    recentChanges, avgRates,
  };
}
