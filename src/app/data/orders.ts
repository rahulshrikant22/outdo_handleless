// ============================================================
// OutDo Orders & Quotations Module — Phase 3 Data Layer
// Correlated: CRM Accounts → Orders → Quotations → Line Items → Payments → Files
// ============================================================

import { crmAccounts, crmSalespeople, type CRMAccount } from "./crm";

// ---------- Types ----------
export type ProjectCategory = "kitchen" | "wardrobe" | "office" | "bathroom" | "villa" | "commercial";
export type OrderSource = "dealer" | "architect" | "direct" | "factory";
export type BusinessSource = "referral" | "exhibition" | "website" | "social_media" | "cold_call" | "partner";
export type QuotationOutcome = "open" | "under_discussion" | "negotiation" | "won" | "lost" | "hold";
export type OrderProgressStatus = "enquiry" | "quotation_sent" | "negotiation" | "order_confirmed" | "in_production" | "dispatched" | "delivered" | "cancelled";
export type DrawingStatus = "submitted" | "cad_conversion_pending" | "cad_ready" | "approval_pending" | "approved";
export type FileType = "cad" | "pdf" | "sketch" | "image" | "excel" | "other";
export type PaymentCollectionStatus = "not_started" | "advance_received" | "partial" | "full" | "overdue";

// ---------- Line Item ----------
export interface QuotationLineItem {
  id: string;
  serialNo: number;
  itemName: string;
  itemCategory: ProjectCategory;
  length: number;
  height: number;
  thickness: number;
  unit: "mm" | "ft" | "inch";
  area: number;
  quantity: number;
  rate: number;
  amount: number;
}

// ---------- Quotation Version ----------
export interface QuotationVersion {
  version: number;
  createdAt: string;
  createdBy: string;
  totalAmount: number;
  lineItems: QuotationLineItem[];
  remarks: string;
  isActive: boolean;
}

// ---------- Quotation ----------
export interface ProjectQuotation {
  id: string;
  orderId: string;
  accountId: string;
  projectName: string;
  outcome: QuotationOutcome;
  currentVersion: number;
  versions: QuotationVersion[];
  quotationAmount: number;
  receivedAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentCollectionStatus;
  lostReason?: string;
  holdReason?: string;
  sentAt?: string;
  wonAt?: string;
  lostAt?: string;
  createdAt: string;
  updatedAt: string;
  remarks: string;
}

// ---------- Order File ----------
export interface OrderFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
  drawingStatus?: DrawingStatus;
}

// ---------- Order Timeline ----------
export interface OrderTimelineEntry {
  id: string;
  date: string;
  action: string;
  description: string;
  user: string;
}

// ---------- Project Order ----------
export interface ProjectOrder {
  id: string;
  projectName: string;
  siteName: string;
  projectCategory: ProjectCategory;
  accountId: string;
  accountName: string;
  accountType: "dealer" | "factory" | "architect";
  city: string;
  state: string;
  zone: string;
  territory: string;
  salespersonId: string;
  salespersonName: string;
  orderSource: OrderSource;
  businessSource: BusinessSource;
  quotationStatus: QuotationOutcome;
  paymentStatus: PaymentCollectionStatus;
  orderStatus: OrderProgressStatus;
  createdAt: string;
  expectedClosureDate: string;
  customerRequiredDate: string;
  internalPromisedDate: string;
  quotationId?: string;
  totalQuotationValue: number;
  receivedAmount: number;
  notes: string;
  files: OrderFile[];
  timeline: OrderTimelineEntry[];
}

// ---------- Helper functions ----------
const getAccount = (id: string): CRMAccount | undefined => crmAccounts.find(a => a.id === id);

// ---------- Line Items Data ----------
const kitchenLineItems: QuotationLineItem[] = [
  { id: "LI001", serialNo: 1, itemName: "Base Cabinet Shutter - 600mm", itemCategory: "kitchen", length: 600, height: 720, thickness: 18, unit: "mm", area: 0.432, quantity: 4, rate: 4200, amount: 16800 },
  { id: "LI002", serialNo: 2, itemName: "Base Cabinet Shutter - 450mm", itemCategory: "kitchen", length: 450, height: 720, thickness: 18, unit: "mm", area: 0.324, quantity: 3, rate: 3800, amount: 11400 },
  { id: "LI003", serialNo: 3, itemName: "Wall Cabinet Shutter - 600mm", itemCategory: "kitchen", length: 600, height: 360, thickness: 18, unit: "mm", area: 0.216, quantity: 6, rate: 3200, amount: 19200 },
  { id: "LI004", serialNo: 4, itemName: "Tall Unit Shutter - 600mm", itemCategory: "kitchen", length: 600, height: 2100, thickness: 18, unit: "mm", area: 1.26, quantity: 2, rate: 8500, amount: 17000 },
  { id: "LI005", serialNo: 5, itemName: "Drawer Front Panel - 600mm", itemCategory: "kitchen", length: 600, height: 140, thickness: 18, unit: "mm", area: 0.084, quantity: 8, rate: 1800, amount: 14400 },
  { id: "LI006", serialNo: 6, itemName: "J-Profile Handle Strip", itemCategory: "kitchen", length: 600, height: 40, thickness: 3, unit: "mm", area: 0.024, quantity: 12, rate: 450, amount: 5400 },
  { id: "LI007", serialNo: 7, itemName: "Soft Close Hinge Set", itemCategory: "kitchen", length: 0, height: 0, thickness: 0, unit: "mm", area: 0, quantity: 20, rate: 280, amount: 5600 },
  { id: "LI008", serialNo: 8, itemName: "Installation & Alignment", itemCategory: "kitchen", length: 0, height: 0, thickness: 0, unit: "mm", area: 0, quantity: 1, rate: 15000, amount: 15000 },
];

const wardrobeLineItems: QuotationLineItem[] = [
  { id: "LI101", serialNo: 1, itemName: "Wardrobe Sliding Shutter - 900mm", itemCategory: "wardrobe", length: 900, height: 2400, thickness: 18, unit: "mm", area: 2.16, quantity: 4, rate: 12500, amount: 50000 },
  { id: "LI102", serialNo: 2, itemName: "Wardrobe Fixed Panel", itemCategory: "wardrobe", length: 900, height: 2400, thickness: 18, unit: "mm", area: 2.16, quantity: 2, rate: 8000, amount: 16000 },
  { id: "LI103", serialNo: 3, itemName: "Internal Drawer Front - 800mm", itemCategory: "wardrobe", length: 800, height: 200, thickness: 18, unit: "mm", area: 0.16, quantity: 6, rate: 2200, amount: 13200 },
  { id: "LI104", serialNo: 4, itemName: "Sliding Track System", itemCategory: "wardrobe", length: 1800, height: 0, thickness: 0, unit: "mm", area: 0, quantity: 2, rate: 4500, amount: 9000 },
  { id: "LI105", serialNo: 5, itemName: "Mirror Panel Insert", itemCategory: "wardrobe", length: 900, height: 2400, thickness: 6, unit: "mm", area: 2.16, quantity: 1, rate: 7500, amount: 7500 },
  { id: "LI106", serialNo: 6, itemName: "Soft Close Mechanism", itemCategory: "wardrobe", length: 0, height: 0, thickness: 0, unit: "mm", area: 0, quantity: 6, rate: 350, amount: 2100 },
];

const officeLineItems: QuotationLineItem[] = [
  { id: "LI201", serialNo: 1, itemName: "Partition Panel - 1200mm", itemCategory: "office", length: 1200, height: 2700, thickness: 25, unit: "mm", area: 3.24, quantity: 10, rate: 15000, amount: 150000 },
  { id: "LI202", serialNo: 2, itemName: "Partition Panel - 900mm", itemCategory: "office", length: 900, height: 2700, thickness: 25, unit: "mm", area: 2.43, quantity: 6, rate: 12000, amount: 72000 },
  { id: "LI203", serialNo: 3, itemName: "Door Panel - 900mm", itemCategory: "office", length: 900, height: 2100, thickness: 25, unit: "mm", area: 1.89, quantity: 4, rate: 18000, amount: 72000 },
  { id: "LI204", serialNo: 4, itemName: "Glass Insert Panel", itemCategory: "office", length: 600, height: 1200, thickness: 10, unit: "mm", area: 0.72, quantity: 8, rate: 5500, amount: 44000 },
  { id: "LI205", serialNo: 5, itemName: "Corner Post & Joinery", itemCategory: "office", length: 0, height: 2700, thickness: 0, unit: "mm", area: 0, quantity: 12, rate: 1200, amount: 14400 },
];

const villaLineItems: QuotationLineItem[] = [
  { id: "LI301", serialNo: 1, itemName: "Kitchen Base Shutter Set", itemCategory: "villa", length: 600, height: 720, thickness: 18, unit: "mm", area: 0.432, quantity: 8, rate: 4500, amount: 36000 },
  { id: "LI302", serialNo: 2, itemName: "Kitchen Wall Cabinet Set", itemCategory: "villa", length: 600, height: 360, thickness: 18, unit: "mm", area: 0.216, quantity: 10, rate: 3500, amount: 35000 },
  { id: "LI303", serialNo: 3, itemName: "Master Wardrobe Shutters", itemCategory: "villa", length: 900, height: 2400, thickness: 18, unit: "mm", area: 2.16, quantity: 6, rate: 13000, amount: 78000 },
  { id: "LI304", serialNo: 4, itemName: "Guest Wardrobe Shutters", itemCategory: "villa", length: 750, height: 2100, thickness: 18, unit: "mm", area: 1.575, quantity: 4, rate: 9500, amount: 38000 },
  { id: "LI305", serialNo: 5, itemName: "Bathroom Vanity Shutters", itemCategory: "bathroom", length: 600, height: 600, thickness: 18, unit: "mm", area: 0.36, quantity: 4, rate: 3800, amount: 15200 },
  { id: "LI306", serialNo: 6, itemName: "Utility Area Shutters", itemCategory: "kitchen", length: 450, height: 720, thickness: 18, unit: "mm", area: 0.324, quantity: 4, rate: 3200, amount: 12800 },
  { id: "LI307", serialNo: 7, itemName: "Hardware & Accessories Kit", itemCategory: "villa", length: 0, height: 0, thickness: 0, unit: "mm", area: 0, quantity: 1, rate: 28000, amount: 28000 },
  { id: "LI308", serialNo: 8, itemName: "Installation - Full Villa", itemCategory: "villa", length: 0, height: 0, thickness: 0, unit: "mm", area: 0, quantity: 1, rate: 35000, amount: 35000 },
];

const homeRenovationItems: QuotationLineItem[] = [
  { id: "LI401", serialNo: 1, itemName: "Kitchen Shutter - 600mm", itemCategory: "kitchen", length: 600, height: 720, thickness: 18, unit: "mm", area: 0.432, quantity: 6, rate: 4000, amount: 24000 },
  { id: "LI402", serialNo: 2, itemName: "Kitchen Wall Shutter - 600mm", itemCategory: "kitchen", length: 600, height: 360, thickness: 18, unit: "mm", area: 0.216, quantity: 4, rate: 3000, amount: 12000 },
  { id: "LI403", serialNo: 3, itemName: "Drawer Front - 600mm", itemCategory: "kitchen", length: 600, height: 140, thickness: 18, unit: "mm", area: 0.084, quantity: 6, rate: 1600, amount: 9600 },
  { id: "LI404", serialNo: 4, itemName: "Handle Profile Strip", itemCategory: "kitchen", length: 600, height: 40, thickness: 3, unit: "mm", area: 0.024, quantity: 10, rate: 400, amount: 4000 },
  { id: "LI405", serialNo: 5, itemName: "Hardware Kit", itemCategory: "kitchen", length: 0, height: 0, thickness: 0, unit: "mm", area: 0, quantity: 1, rate: 8500, amount: 8500 },
];

// ---------- Project Orders (7 orders correlated to CRM accounts) ----------
export const projectOrders: ProjectOrder[] = [
  {
    id: "ORD-001",
    projectName: "Mehta Premium Kitchen",
    siteName: "Mehta Residence, LBS Road",
    projectCategory: "kitchen",
    accountId: "A001",
    accountName: "Mehta Interiors",
    accountType: "dealer",
    city: "Mumbai",
    state: "Maharashtra",
    zone: "West",
    territory: "West-1",
    salespersonId: "SP01",
    salespersonName: "Rajesh Kumar",
    orderSource: "dealer",
    businessSource: "referral",
    quotationStatus: "won",
    paymentStatus: "partial",
    orderStatus: "in_production",
    createdAt: "2025-12-10",
    expectedClosureDate: "2026-03-30",
    customerRequiredDate: "2026-04-15",
    internalPromisedDate: "2026-04-05",
    quotationId: "QTN-001",
    totalQuotationValue: 104800,
    receivedAmount: 52400,
    notes: "Premium kitchen project for Mehta's client. High-end finish required.",
    files: [
      { id: "F001", name: "Kitchen_Layout_v2.dwg", type: "cad", size: "2.4 MB", uploadedBy: "Rajesh Kumar", uploadedAt: "2025-12-12", tags: ["kitchen", "layout", "final"], drawingStatus: "approved" },
      { id: "F002", name: "Kitchen_Elevation.pdf", type: "pdf", size: "1.1 MB", uploadedBy: "Anand Mehta", uploadedAt: "2025-12-11", tags: ["elevation", "reference"], drawingStatus: "approved" },
      { id: "F003", name: "Material_Specs.pdf", type: "pdf", size: "340 KB", uploadedBy: "Rajesh Kumar", uploadedAt: "2025-12-15", tags: ["specs", "material"] },
    ],
    timeline: [
      { id: "TL001", date: "2025-12-10", action: "Order Created", description: "New order created from dealer Mehta Interiors", user: "Rajesh Kumar" },
      { id: "TL002", date: "2025-12-12", action: "Files Uploaded", description: "CAD files and elevation drawings uploaded", user: "Rajesh Kumar" },
      { id: "TL003", date: "2025-12-18", action: "Quotation Sent", description: "QTN-001 v1 sent to dealer for approval", user: "Rajesh Kumar" },
      { id: "TL004", date: "2025-12-28", action: "Quotation Revised", description: "QTN-001 v2 created after negotiation", user: "Rajesh Kumar" },
      { id: "TL005", date: "2026-01-05", action: "Quotation Won", description: "QTN-001 v2 accepted by dealer", user: "Rajesh Kumar" },
      { id: "TL006", date: "2026-01-10", action: "Advance Received", description: "50% advance payment of Rs.52,400 received", user: "Priya Sharma" },
      { id: "TL007", date: "2026-01-15", action: "Production Started", description: "Order moved to production queue", user: "Suresh Menon" },
      { id: "TL008", date: "2026-02-20", action: "Drawing Approved", description: "Final CAD drawings approved for production", user: "Rajesh Kumar" },
    ],
  },
  {
    id: "ORD-002",
    projectName: "Nair Villa Complete Interiors",
    siteName: "Nair Villa, Indiranagar",
    projectCategory: "villa",
    accountId: "A002",
    accountName: "Nair Designs",
    accountType: "architect",
    city: "Bangalore",
    state: "Karnataka",
    zone: "South",
    territory: "South-1",
    salespersonId: "SP04",
    salespersonName: "Sneha Reddy",
    orderSource: "architect",
    businessSource: "referral",
    quotationStatus: "won",
    paymentStatus: "advance_received",
    orderStatus: "order_confirmed",
    createdAt: "2025-12-15",
    expectedClosureDate: "2026-04-20",
    customerRequiredDate: "2026-05-01",
    internalPromisedDate: "2026-04-15",
    quotationId: "QTN-002",
    totalQuotationValue: 278000,
    receivedAmount: 139000,
    notes: "Complete villa interiors — kitchen, wardrobes, bathroom vanities. Architect-specified project.",
    files: [
      { id: "F004", name: "Villa_Kitchen_Plan.dwg", type: "cad", size: "3.8 MB", uploadedBy: "Deepika Nair", uploadedAt: "2025-12-16", tags: ["kitchen", "villa", "plan"], drawingStatus: "approved" },
      { id: "F005", name: "Wardrobe_Specs.pdf", type: "pdf", size: "890 KB", uploadedBy: "Deepika Nair", uploadedAt: "2025-12-16", tags: ["wardrobe", "specs"] },
      { id: "F006", name: "Hand_Sketch_Bathroom.jpg", type: "sketch", size: "1.2 MB", uploadedBy: "Deepika Nair", uploadedAt: "2025-12-18", tags: ["bathroom", "sketch"], drawingStatus: "cad_ready" },
      { id: "F007", name: "Material_Selection.xlsx", type: "excel", size: "245 KB", uploadedBy: "Sneha Reddy", uploadedAt: "2025-12-20", tags: ["material", "selection"] },
    ],
    timeline: [
      { id: "TL009", date: "2025-12-15", action: "Order Created", description: "New order from architect Nair Designs for villa project", user: "Sneha Reddy" },
      { id: "TL010", date: "2025-12-18", action: "Files Uploaded", description: "CAD files, specs, and hand sketches uploaded", user: "Deepika Nair" },
      { id: "TL011", date: "2025-12-22", action: "Quotation Sent", description: "QTN-002 v1 sent for architect review", user: "Sneha Reddy" },
      { id: "TL012", date: "2026-01-05", action: "Quotation Won", description: "QTN-002 accepted after architect approval", user: "Sneha Reddy" },
      { id: "TL013", date: "2026-01-12", action: "Advance Received", description: "50% advance payment received", user: "Priya Sharma" },
      { id: "TL014", date: "2026-01-20", action: "Order Confirmed", description: "Order confirmed and queued for production", user: "Sneha Reddy" },
    ],
  },
  {
    id: "ORD-003",
    projectName: "Sheikh Office Partitions",
    siteName: "Sheikh Commercial Tower, Kirti Nagar",
    projectCategory: "office",
    accountId: "A003",
    accountName: "Sheikh Constructions",
    accountType: "dealer",
    city: "Delhi",
    state: "Delhi",
    zone: "North",
    territory: "North-1",
    salespersonId: "SP02",
    salespersonName: "Priya Sharma",
    orderSource: "dealer",
    businessSource: "exhibition",
    quotationStatus: "won",
    paymentStatus: "partial",
    orderStatus: "dispatched",
    createdAt: "2025-12-20",
    expectedClosureDate: "2026-03-15",
    customerRequiredDate: "2026-03-20",
    internalPromisedDate: "2026-03-10",
    quotationId: "QTN-003",
    totalQuotationValue: 352400,
    receivedAmount: 246680,
    notes: "Commercial office partition project. Bulk order with tight timeline.",
    files: [
      { id: "F008", name: "Office_Layout_Final.dwg", type: "cad", size: "5.2 MB", uploadedBy: "Priya Sharma", uploadedAt: "2025-12-22", tags: ["office", "layout", "final"], drawingStatus: "approved" },
      { id: "F009", name: "Partition_Specs.pdf", type: "pdf", size: "1.5 MB", uploadedBy: "Farhan Sheikh", uploadedAt: "2025-12-21", tags: ["partition", "specs"] },
    ],
    timeline: [
      { id: "TL015", date: "2025-12-20", action: "Order Created", description: "Bulk partition order from Sheikh Constructions", user: "Priya Sharma" },
      { id: "TL016", date: "2025-12-25", action: "Quotation Sent", description: "QTN-003 v1 sent", user: "Priya Sharma" },
      { id: "TL017", date: "2026-01-05", action: "Quotation Revised", description: "v2 created — volume discount applied", user: "Priya Sharma" },
      { id: "TL018", date: "2026-01-10", action: "Quotation Revised", description: "v3 — final negotiated rate", user: "Priya Sharma" },
      { id: "TL019", date: "2026-01-15", action: "Quotation Won", description: "QTN-003 v3 accepted", user: "Priya Sharma" },
      { id: "TL020", date: "2026-01-20", action: "Production Started", description: "Fast-tracked production", user: "Suresh Menon" },
      { id: "TL021", date: "2026-03-01", action: "Production Complete", description: "All panels ready for dispatch", user: "Kavita Joshi" },
      { id: "TL022", date: "2026-03-05", action: "Dispatched", description: "Full shipment dispatched via logistics partner", user: "Kavita Joshi" },
    ],
  },
  {
    id: "ORD-004",
    projectName: "Rao Home Kitchen Renovation",
    siteName: "Rao Residence, Jubilee Hills",
    projectCategory: "kitchen",
    accountId: "A004",
    accountName: "Rao Homes",
    accountType: "dealer",
    city: "Hyderabad",
    state: "Telangana",
    zone: "South",
    territory: "South-2",
    salespersonId: "SP04",
    salespersonName: "Sneha Reddy",
    orderSource: "dealer",
    businessSource: "social_media",
    quotationStatus: "under_discussion",
    paymentStatus: "not_started",
    orderStatus: "quotation_sent",
    createdAt: "2026-01-10",
    expectedClosureDate: "2026-04-15",
    customerRequiredDate: "2026-05-01",
    internalPromisedDate: "2026-04-20",
    quotationId: "QTN-004",
    totalQuotationValue: 58100,
    receivedAmount: 0,
    notes: "Kitchen renovation project. Discussing finish options and timeline.",
    files: [
      { id: "F010", name: "Kitchen_Current_Photo.jpg", type: "image", size: "3.1 MB", uploadedBy: "Geeta Rao", uploadedAt: "2026-01-12", tags: ["photo", "current"] },
      { id: "F011", name: "Rough_Layout.pdf", type: "pdf", size: "520 KB", uploadedBy: "Sneha Reddy", uploadedAt: "2026-01-15", tags: ["layout", "rough"], drawingStatus: "cad_conversion_pending" },
    ],
    timeline: [
      { id: "TL023", date: "2026-01-10", action: "Order Created", description: "Kitchen renovation enquiry from Rao Homes", user: "Sneha Reddy" },
      { id: "TL024", date: "2026-01-15", action: "Files Uploaded", description: "Current photos and rough layout uploaded", user: "Sneha Reddy" },
      { id: "TL025", date: "2026-01-20", action: "Quotation Sent", description: "QTN-004 v1 sent for review", user: "Sneha Reddy" },
      { id: "TL026", date: "2026-02-15", action: "Discussion", description: "Dealer discussing finish options with client", user: "Sneha Reddy" },
    ],
  },
  {
    id: "ORD-005",
    projectName: "Nagpur Showroom Kitchen Display",
    siteName: "Nagpur Modern Interiors Showroom",
    projectCategory: "kitchen",
    accountId: "CA001",
    accountName: "Nagpur Modern Interiors",
    accountType: "dealer",
    city: "Nagpur",
    state: "Maharashtra",
    zone: "West",
    territory: "West-1",
    salespersonId: "SP01",
    salespersonName: "Rajesh Kumar",
    orderSource: "dealer",
    businessSource: "partner",
    quotationStatus: "open",
    paymentStatus: "not_started",
    orderStatus: "enquiry",
    createdAt: "2026-02-15",
    expectedClosureDate: "2026-05-01",
    customerRequiredDate: "2026-05-15",
    internalPromisedDate: "2026-05-10",
    quotationId: "QTN-005",
    totalQuotationValue: 82500,
    receivedAmount: 0,
    notes: "Showroom display kitchen — need premium finish to showcase products.",
    files: [
      { id: "F012", name: "Showroom_Concept.pdf", type: "pdf", size: "1.8 MB", uploadedBy: "Rahul Deshpande", uploadedAt: "2026-02-18", tags: ["concept", "showroom"], drawingStatus: "submitted" },
    ],
    timeline: [
      { id: "TL027", date: "2026-02-15", action: "Order Created", description: "Showroom display kitchen order from new dealer", user: "Rajesh Kumar" },
      { id: "TL028", date: "2026-02-18", action: "Files Uploaded", description: "Showroom concept PDF uploaded", user: "Rahul Deshpande" },
      { id: "TL029", date: "2026-02-25", action: "Quotation Created", description: "QTN-005 v1 drafted — awaiting review", user: "Rajesh Kumar" },
    ],
  },
  {
    id: "ORD-006",
    projectName: "Hyd Studio Residential Project",
    siteName: "Client Apartment, Banjara Hills",
    projectCategory: "kitchen",
    accountId: "CA003",
    accountName: "Hyderabad Home Studio",
    accountType: "architect",
    city: "Hyderabad",
    state: "Telangana",
    zone: "South",
    territory: "South-2",
    salespersonId: "SP04",
    salespersonName: "Sneha Reddy",
    orderSource: "architect",
    businessSource: "referral",
    quotationStatus: "lost",
    paymentStatus: "not_started",
    orderStatus: "enquiry",
    createdAt: "2026-01-25",
    expectedClosureDate: "2026-03-15",
    customerRequiredDate: "2026-04-01",
    internalPromisedDate: "2026-03-25",
    quotationId: "QTN-006",
    totalQuotationValue: 145000,
    receivedAmount: 0,
    notes: "Architect project — client went with competitor on price. May re-engage.",
    files: [
      { id: "F013", name: "Apartment_Layout.dwg", type: "cad", size: "2.9 MB", uploadedBy: "Ananya Rao", uploadedAt: "2026-01-28", tags: ["apartment", "layout"], drawingStatus: "cad_ready" },
    ],
    timeline: [
      { id: "TL030", date: "2026-01-25", action: "Order Created", description: "Residential project enquiry from architect", user: "Sneha Reddy" },
      { id: "TL031", date: "2026-02-01", action: "Quotation Sent", description: "QTN-006 v1 sent to architect", user: "Sneha Reddy" },
      { id: "TL032", date: "2026-02-15", action: "Quotation Revised", description: "QTN-006 v2 with reduced scope", user: "Sneha Reddy" },
      { id: "TL033", date: "2026-03-10", action: "Quotation Lost", description: "Client chose competitor — price was the main factor", user: "Sneha Reddy" },
    ],
  },
  {
    id: "ORD-007",
    projectName: "Mysore Factory Sample Batch",
    siteName: "Mysore Woodcraft Factory Unit",
    projectCategory: "kitchen",
    accountId: "CA002",
    accountName: "Mysore Woodcraft Industries",
    accountType: "factory",
    city: "Mysore",
    state: "Karnataka",
    zone: "South",
    territory: "South-1",
    salespersonId: "SP05",
    salespersonName: "Vikram Menon",
    orderSource: "factory",
    businessSource: "partner",
    quotationStatus: "hold",
    paymentStatus: "not_started",
    orderStatus: "enquiry",
    createdAt: "2026-02-20",
    expectedClosureDate: "2026-04-30",
    customerRequiredDate: "2026-05-15",
    internalPromisedDate: "2026-05-01",
    quotationId: "QTN-007",
    totalQuotationValue: 65000,
    receivedAmount: 0,
    notes: "Sample production batch to validate factory capability. On hold pending QC review.",
    files: [
      { id: "F014", name: "Sample_Specs.pdf", type: "pdf", size: "680 KB", uploadedBy: "Vikram Menon", uploadedAt: "2026-02-22", tags: ["sample", "specs"] },
      { id: "F015", name: "Factory_QC_Template.xlsx", type: "excel", size: "120 KB", uploadedBy: "Prakash Hegde", uploadedAt: "2026-02-25", tags: ["qc", "template"] },
    ],
    timeline: [
      { id: "TL034", date: "2026-02-20", action: "Order Created", description: "Sample batch order for factory validation", user: "Vikram Menon" },
      { id: "TL035", date: "2026-02-25", action: "Quotation Created", description: "QTN-007 v1 drafted for sample batch", user: "Vikram Menon" },
      { id: "TL036", date: "2026-03-05", action: "Order on Hold", description: "Pending QC review of trial batch", user: "Vikram Menon" },
    ],
  },
];

// ---------- Quotations (7, linked to orders) ----------
export const projectQuotations: ProjectQuotation[] = [
  {
    id: "QTN-001", orderId: "ORD-001", accountId: "A001", projectName: "Mehta Premium Kitchen",
    outcome: "won", currentVersion: 2,
    versions: [
      { version: 1, createdAt: "2025-12-18", createdBy: "Rajesh Kumar", totalAmount: 112000, lineItems: kitchenLineItems, remarks: "Initial quotation — standard rates", isActive: false },
      { version: 2, createdAt: "2025-12-28", createdBy: "Rajesh Kumar", totalAmount: 104800, lineItems: kitchenLineItems.map(li => ({ ...li, rate: Math.round(li.rate * 0.94), amount: Math.round(li.amount * 0.94) })), remarks: "Revised with 6% dealer discount applied", isActive: true },
    ],
    quotationAmount: 104800, receivedAmount: 52400, balanceAmount: 52400, paymentStatus: "partial",
    sentAt: "2025-12-18", wonAt: "2026-01-05", createdAt: "2025-12-18", updatedAt: "2026-01-05",
    remarks: "Dealer negotiated 6% discount. Approved by management.",
  },
  {
    id: "QTN-002", orderId: "ORD-002", accountId: "A002", projectName: "Nair Villa Complete Interiors",
    outcome: "won", currentVersion: 1,
    versions: [
      { version: 1, createdAt: "2025-12-22", createdBy: "Sneha Reddy", totalAmount: 278000, lineItems: villaLineItems, remarks: "Complete villa package — kitchen, wardrobes, bathrooms", isActive: true },
    ],
    quotationAmount: 278000, receivedAmount: 139000, balanceAmount: 139000, paymentStatus: "advance_received",
    sentAt: "2025-12-22", wonAt: "2026-01-05", createdAt: "2025-12-22", updatedAt: "2026-01-05",
    remarks: "Architect-approved specification. Premium finish selected.",
  },
  {
    id: "QTN-003", orderId: "ORD-003", accountId: "A003", projectName: "Sheikh Office Partitions",
    outcome: "won", currentVersion: 3,
    versions: [
      { version: 1, createdAt: "2025-12-25", createdBy: "Priya Sharma", totalAmount: 385000, lineItems: officeLineItems, remarks: "Standard commercial rates", isActive: false },
      { version: 2, createdAt: "2026-01-05", createdBy: "Priya Sharma", totalAmount: 365000, lineItems: officeLineItems.map(li => ({ ...li, rate: Math.round(li.rate * 0.95), amount: Math.round(li.amount * 0.95) })), remarks: "5% volume discount for 20+ panels", isActive: false },
      { version: 3, createdAt: "2026-01-10", createdBy: "Priya Sharma", totalAmount: 352400, lineItems: officeLineItems.map(li => ({ ...li, rate: Math.round(li.rate * 0.92), amount: Math.round(li.amount * 0.92) })), remarks: "Final negotiated rate — 8% overall discount", isActive: true },
    ],
    quotationAmount: 352400, receivedAmount: 246680, balanceAmount: 105720, paymentStatus: "partial",
    sentAt: "2025-12-25", wonAt: "2026-01-15", createdAt: "2025-12-25", updatedAt: "2026-01-15",
    remarks: "Tight delivery timeline. Priority production scheduled.",
  },
  {
    id: "QTN-004", orderId: "ORD-004", accountId: "A004", projectName: "Rao Home Kitchen Renovation",
    outcome: "under_discussion", currentVersion: 1,
    versions: [
      { version: 1, createdAt: "2026-01-20", createdBy: "Sneha Reddy", totalAmount: 58100, lineItems: homeRenovationItems, remarks: "Standard kitchen renovation package", isActive: true },
    ],
    quotationAmount: 58100, receivedAmount: 0, balanceAmount: 58100, paymentStatus: "not_started",
    sentAt: "2026-01-20", createdAt: "2026-01-20", updatedAt: "2026-02-15",
    remarks: "Client reviewing finish options. Expected decision by end of March.",
  },
  {
    id: "QTN-005", orderId: "ORD-005", accountId: "CA001", projectName: "Nagpur Showroom Kitchen Display",
    outcome: "open", currentVersion: 1,
    versions: [
      { version: 1, createdAt: "2026-02-25", createdBy: "Rajesh Kumar", totalAmount: 82500, lineItems: kitchenLineItems.map((li, i) => ({ ...li, id: `LI5${i}1`, rate: Math.round(li.rate * 0.85), amount: Math.round(li.amount * 0.85) })), remarks: "Showroom display — discounted dealer rate", isActive: true },
    ],
    quotationAmount: 82500, receivedAmount: 0, balanceAmount: 82500, paymentStatus: "not_started",
    createdAt: "2026-02-25", updatedAt: "2026-02-25",
    remarks: "New dealer showroom display. Special pricing for display unit.",
  },
  {
    id: "QTN-006", orderId: "ORD-006", accountId: "CA003", projectName: "Hyd Studio Residential Project",
    outcome: "lost", currentVersion: 2,
    versions: [
      { version: 1, createdAt: "2026-02-01", createdBy: "Sneha Reddy", totalAmount: 168000, lineItems: villaLineItems.slice(0, 4).map((li, i) => ({ ...li, id: `LI6${i}1` })), remarks: "Full scope — kitchen + wardrobes", isActive: false },
      { version: 2, createdAt: "2026-02-15", createdBy: "Sneha Reddy", totalAmount: 145000, lineItems: villaLineItems.slice(0, 3).map((li, i) => ({ ...li, id: `LI6${i}2`, rate: Math.round(li.rate * 0.9), amount: Math.round(li.amount * 0.9) })), remarks: "Reduced scope — kitchen + master wardrobe only", isActive: true },
    ],
    quotationAmount: 145000, receivedAmount: 0, balanceAmount: 145000, paymentStatus: "not_started",
    sentAt: "2026-02-01", lostAt: "2026-03-10", lostReason: "Client chose competitor — price was the main factor",
    createdAt: "2026-02-01", updatedAt: "2026-03-10",
    remarks: "Lost to competitor. May re-engage for future projects.",
  },
  {
    id: "QTN-007", orderId: "ORD-007", accountId: "CA002", projectName: "Mysore Factory Sample Batch",
    outcome: "hold", currentVersion: 1,
    versions: [
      { version: 1, createdAt: "2026-02-25", createdBy: "Vikram Menon", totalAmount: 65000, lineItems: kitchenLineItems.slice(0, 5).map((li, i) => ({ ...li, id: `LI7${i}1`, quantity: 2, amount: li.rate * 2 })), remarks: "Sample batch for factory validation", isActive: true },
    ],
    quotationAmount: 65000, receivedAmount: 0, balanceAmount: 65000, paymentStatus: "not_started",
    holdReason: "Pending QC review of initial trial batch quality",
    createdAt: "2026-02-25", updatedAt: "2026-03-05",
    remarks: "On hold pending quality control review.",
  },
];

// ---------- Helpers ----------
export const getProjectOrderById = (id: string) => projectOrders.find(o => o.id === id);
export const getProjectQuotationById = (id: string) => projectQuotations.find(q => q.id === id);
export const getQuotationByOrderId = (orderId: string) => projectQuotations.find(q => q.orderId === orderId);
export const getOrdersByAccount = (accountId: string) => projectOrders.filter(o => o.accountId === accountId);
export const getQuotationsByAccount = (accountId: string) => projectQuotations.filter(q => q.accountId === accountId);

export const projectCategories: ProjectCategory[] = ["kitchen", "wardrobe", "office", "bathroom", "villa", "commercial"];
export const orderSources: OrderSource[] = ["dealer", "architect", "direct", "factory"];
export const businessSources: BusinessSource[] = ["referral", "exhibition", "website", "social_media", "cold_call", "partner"];
export const quotationOutcomes: QuotationOutcome[] = ["open", "under_discussion", "negotiation", "won", "lost", "hold"];

export function formatProjectCategory(c: ProjectCategory): string {
  return c.charAt(0).toUpperCase() + c.slice(1);
}

export function formatQuotationOutcome(o: QuotationOutcome): string {
  return o.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export function formatOrderStatus(s: OrderProgressStatus): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export function formatDrawingStatus(s: DrawingStatus): string {
  const map: Record<DrawingStatus, string> = {
    submitted: "Original Submitted",
    cad_conversion_pending: "CAD Conversion Pending",
    cad_ready: "CAD Ready",
    approval_pending: "Approval Pending",
    approved: "Approved for Production",
  };
  return map[s];
}

// ---------- Dashboard Aggregations ----------
export function getOrdersDashboardStats() {
  const totalOrders = projectOrders.length;
  const totalQuotations = projectQuotations.length;
  const totalQuotationValue = projectQuotations.reduce((s, q) => s + q.quotationAmount, 0);
  const open = projectQuotations.filter(q => q.outcome === "open").length;
  const underDiscussion = projectQuotations.filter(q => q.outcome === "under_discussion").length;
  const negotiation = projectQuotations.filter(q => q.outcome === "negotiation").length;
  const won = projectQuotations.filter(q => q.outcome === "won").length;
  const lost = projectQuotations.filter(q => q.outcome === "lost").length;
  const hold = projectQuotations.filter(q => q.outcome === "hold").length;
  const totalReceived = projectQuotations.reduce((s, q) => s + q.receivedAmount, 0);
  const totalBalance = projectQuotations.reduce((s, q) => s + q.balanceAmount, 0);

  // Category split
  const categorySplit = projectCategories.map(cat => ({
    category: formatProjectCategory(cat),
    count: projectOrders.filter(o => o.projectCategory === cat).length,
    value: projectOrders.filter(o => o.projectCategory === cat).reduce((s, o) => s + o.totalQuotationValue, 0),
  })).filter(c => c.count > 0);

  // Source summary
  const sourceSummary = orderSources.map(src => ({
    source: src.charAt(0).toUpperCase() + src.slice(1),
    orders: projectOrders.filter(o => o.orderSource === src).length,
    value: projectOrders.filter(o => o.orderSource === src).reduce((s, o) => s + o.totalQuotationValue, 0),
  })).filter(s => s.orders > 0);

  // Quotation aging
  const quotationAging = projectQuotations
    .filter(q => q.outcome !== "won" && q.outcome !== "lost")
    .map(q => {
      const created = new Date(q.createdAt);
      const now = new Date("2026-03-16");
      const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return { id: q.id, projectName: q.projectName, days, outcome: q.outcome };
    });

  return {
    totalOrders, totalQuotations, totalQuotationValue,
    open, underDiscussion, negotiation, won, lost, hold,
    totalReceived, totalBalance,
    categorySplit, sourceSummary, quotationAging,
    winRate: totalQuotations > 0 ? Math.round((won / totalQuotations) * 100) : 0,
  };
}
