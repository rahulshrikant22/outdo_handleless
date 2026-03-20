// ============================================================
// OutDo Converted Orders / Operations Module — Phase 5A Data Layer
// Correlated: Won Quotations → Converted Orders → Role Assignments → Milestones → Production → Dispatch
// ============================================================

import { projectOrders, projectQuotations, type ProjectOrder, type ProjectQuotation } from "./orders";

// ---------- Types ----------
export type ProductionStatus =
  | "design_pending"
  | "cutlist_pending"
  | "material_procurement"
  | "cutting"
  | "edging"
  | "assembly"
  | "finishing"
  | "quality_check"
  | "production_ready";

export type DispatchStatus =
  | "not_ready"
  | "packaging"
  | "ready_to_dispatch"
  | "dispatched"
  | "in_transit"
  | "delivered";

export type OpsPaymentStatus = "not_started" | "advance_received" | "partial" | "full" | "overdue";

export type ConvertedOrderPriority = "normal" | "high" | "urgent" | "critical";

export type MilestoneStatus = "completed" | "in_progress" | "pending" | "skipped" | "delayed";

export type DelayReason = "material_shortage" | "design_revision" | "client_hold" | "production_bottleneck" | "payment_pending" | "logistics_delay" | "quality_issue" | "other";

// ---------- Role Assignment ----------
export interface RoleAssignment {
  role: string;
  roleLabel: string;
  userId: string;
  userName: string;
  assignedAt: string;
  assignedBy: string;
}

// ---------- Milestone ----------
export interface Milestone {
  id: string;
  label: string;
  status: MilestoneStatus;
  date: string | null; // null = not yet reached
  expectedDate: string;
  completedBy?: string;
  notes?: string;
}

// ---------- Payment Entry ----------
export interface OpsPaymentEntry {
  id: string;
  amount: number;
  method: "bank_transfer" | "cheque" | "upi" | "cash";
  date: string;
  reference: string;
  receivedBy: string;
  notes: string;
}

// ---------- Activity Entry ----------
export interface ActivityEntry {
  id: string;
  date: string;
  action: string;
  description: string;
  user: string;
  type: "status_update" | "assignment" | "payment" | "note" | "delay" | "file" | "milestone";
}

// ---------- Delay / Hold ----------
export interface DelayHoldEntry {
  id: string;
  type: "delay" | "hold";
  reason: DelayReason;
  description: string;
  raisedAt: string;
  raisedBy: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  impactDays: number;
  isActive: boolean;
}

// ---------- Converted Order ----------
export interface ConvertedOrder {
  id: string;
  orderId: string;
  quotationId: string;
  projectName: string;
  siteName: string;
  accountId: string;
  accountName: string;
  accountType: "dealer" | "factory" | "architect";
  city: string;
  state: string;
  zone: string;
  salespersonName: string;
  priority: ConvertedOrderPriority;
  productionStatus: ProductionStatus;
  dispatchStatus: DispatchStatus;
  paymentStatus: OpsPaymentStatus;
  currentPendingWith: string; // role label or person
  quotationAmount: number;
  receivedAmount: number;
  balanceAmount: number;
  convertedAt: string;
  expectedCompletionDate: string;
  actualCompletionDate: string | null;
  roles: RoleAssignment[];
  milestones: Milestone[];
  payments: OpsPaymentEntry[];
  activities: ActivityEntry[];
  delays: DelayHoldEntry[];
  notes: string;
}

// ---------- Internal Staff for Operations Roles ----------
export interface OpsStaff {
  id: string;
  name: string;
  role: string;
  department: string;
  city: string;
}

export const opsStaff: OpsStaff[] = [
  { id: "OPS01", name: "Rajesh Kumar", role: "Project Manager", department: "Operations", city: "Mumbai" },
  { id: "OPS02", name: "Priya Sharma", role: "Operations Head", department: "Operations", city: "Delhi" },
  { id: "OPS03", name: "Suresh Menon", role: "Production Manager", department: "Production", city: "Chennai" },
  { id: "OPS04", name: "Kavita Joshi", role: "Packaging Manager", department: "Production", city: "Mumbai" },
  { id: "OPS05", name: "Anil Deshmukh", role: "Cutlist Designer", department: "Design", city: "Pune" },
  { id: "OPS06", name: "Meena Iyer", role: "Cutlist Designer", department: "Design", city: "Bangalore" },
  { id: "OPS07", name: "Ravi Kulkarni", role: "Procurement Manager", department: "Procurement", city: "Mumbai" },
  { id: "OPS08", name: "Deepa Nambiar", role: "Dispatch Manager", department: "Logistics", city: "Chennai" },
  { id: "OPS09", name: "Sanjay Gupta", role: "Finance Manager", department: "Finance", city: "Delhi" },
  { id: "OPS10", name: "Pooja Verma", role: "Finance Manager", department: "Finance", city: "Mumbai" },
  { id: "OPS11", name: "Arjun Reddy", role: "Production Manager", department: "Production", city: "Hyderabad" },
  { id: "OPS12", name: "Nisha Pillai", role: "Project Manager", department: "Operations", city: "Bangalore" },
];

// ---------- Converted Orders Data ----------
// Only "won" quotations get converted: QTN-001 (ORD-001), QTN-002 (ORD-002), QTN-003 (ORD-003)

export const convertedOrders: ConvertedOrder[] = [
  // ===== CO-001: Mehta Premium Kitchen — in production, partial payment =====
  {
    id: "CO-001",
    orderId: "ORD-001",
    quotationId: "QTN-001",
    projectName: "Mehta Premium Kitchen",
    siteName: "Mehta Residence, LBS Road",
    accountId: "A001",
    accountName: "Mehta Interiors",
    accountType: "dealer",
    city: "Mumbai",
    state: "Maharashtra",
    zone: "West",
    salespersonName: "Rajesh Kumar",
    priority: "high",
    productionStatus: "assembly",
    dispatchStatus: "not_ready",
    paymentStatus: "partial",
    currentPendingWith: "Production Manager",
    quotationAmount: 104800,
    receivedAmount: 52400,
    balanceAmount: 52400,
    convertedAt: "2026-01-05",
    expectedCompletionDate: "2026-04-05",
    actualCompletionDate: null,
    roles: [
      { role: "project_manager", roleLabel: "Project Manager", userId: "OPS01", userName: "Rajesh Kumar", assignedAt: "2026-01-06", assignedBy: "Priya Sharma" },
      { role: "cutlist_designer", roleLabel: "Cutlist Designer", userId: "OPS05", userName: "Anil Deshmukh", assignedAt: "2026-01-07", assignedBy: "Rajesh Kumar" },
      { role: "operations_head", roleLabel: "Operations Head", userId: "OPS02", userName: "Priya Sharma", assignedAt: "2026-01-05", assignedBy: "System" },
      { role: "production_manager", roleLabel: "Production Manager", userId: "OPS03", userName: "Suresh Menon", assignedAt: "2026-01-15", assignedBy: "Priya Sharma" },
      { role: "procurement_manager", roleLabel: "Procurement Manager", userId: "OPS07", userName: "Ravi Kulkarni", assignedAt: "2026-01-10", assignedBy: "Rajesh Kumar" },
      { role: "packaging_manager", roleLabel: "Packaging Manager", userId: "OPS04", userName: "Kavita Joshi", assignedAt: "2026-01-15", assignedBy: "Suresh Menon" },
      { role: "dispatch_manager", roleLabel: "Dispatch Manager", userId: "OPS08", userName: "Deepa Nambiar", assignedAt: "2026-01-15", assignedBy: "Priya Sharma" },
      { role: "finance_manager", roleLabel: "Finance Manager", userId: "OPS10", userName: "Pooja Verma", assignedAt: "2026-01-06", assignedBy: "Priya Sharma" },
    ],
    milestones: [
      { id: "MS001", label: "Order Converted", status: "completed", date: "2026-01-05", expectedDate: "2026-01-05", completedBy: "Rajesh Kumar", notes: "Quotation QTN-001 v2 won and converted" },
      { id: "MS002", label: "PM Assigned", status: "completed", date: "2026-01-06", expectedDate: "2026-01-07", completedBy: "Priya Sharma" },
      { id: "MS003", label: "Designer Assigned", status: "completed", date: "2026-01-07", expectedDate: "2026-01-08", completedBy: "Rajesh Kumar" },
      { id: "MS004", label: "Cutlist Ready", status: "completed", date: "2026-01-20", expectedDate: "2026-01-18", completedBy: "Anil Deshmukh", notes: "2 days delayed — complex design" },
      { id: "MS005", label: "Production Started", status: "completed", date: "2026-01-25", expectedDate: "2026-01-22", completedBy: "Suresh Menon" },
      { id: "MS006", label: "Packaging Ready", status: "in_progress", date: null, expectedDate: "2026-03-25" },
      { id: "MS007", label: "Dispatch Ready", status: "pending", date: null, expectedDate: "2026-03-28" },
      { id: "MS008", label: "Dispatched", status: "pending", date: null, expectedDate: "2026-04-01" },
      { id: "MS009", label: "Completion", status: "pending", date: null, expectedDate: "2026-04-05" },
    ],
    payments: [
      { id: "PAY001", amount: 31440, method: "bank_transfer", date: "2026-01-10", reference: "NEFT/2026/0110/001", receivedBy: "Pooja Verma", notes: "30% advance payment" },
      { id: "PAY002", amount: 20960, method: "upi", date: "2026-02-15", reference: "UPI/2026/0215/042", receivedBy: "Pooja Verma", notes: "20% progress payment after cutlist approval" },
    ],
    activities: [
      { id: "ACT001", date: "2026-01-05", action: "Order Converted", description: "QTN-001 converted to CO-001 after winning quotation", user: "Rajesh Kumar", type: "milestone" },
      { id: "ACT002", date: "2026-01-06", action: "PM Assigned", description: "Rajesh Kumar assigned as Project Manager", user: "Priya Sharma", type: "assignment" },
      { id: "ACT003", date: "2026-01-07", action: "Designer Assigned", description: "Anil Deshmukh assigned for cutlist design", user: "Rajesh Kumar", type: "assignment" },
      { id: "ACT004", date: "2026-01-10", action: "Payment Received", description: "₹31,440 advance received via NEFT", user: "Pooja Verma", type: "payment" },
      { id: "ACT005", date: "2026-01-15", action: "Roles Assigned", description: "Production, packaging, dispatch roles assigned", user: "Priya Sharma", type: "assignment" },
      { id: "ACT006", date: "2026-01-20", action: "Cutlist Ready", description: "Cutlist completed — 2 days behind schedule due to complex design", user: "Anil Deshmukh", type: "milestone" },
      { id: "ACT007", date: "2026-01-25", action: "Production Started", description: "Material procurement complete, CNC cutting started", user: "Suresh Menon", type: "status_update" },
      { id: "ACT008", date: "2026-02-15", action: "Payment Received", description: "₹20,960 progress payment received via UPI", user: "Pooja Verma", type: "payment" },
      { id: "ACT009", date: "2026-03-01", action: "Production Update", description: "Cutting and edging complete. Assembly phase started.", user: "Suresh Menon", type: "status_update" },
      { id: "ACT010", date: "2026-03-10", action: "Note", description: "Client requested finish sample before final assembly — provided", user: "Rajesh Kumar", type: "note" },
    ],
    delays: [
      { id: "DL001", type: "delay", reason: "design_revision", description: "Complex L-shaped kitchen required additional cutlist iterations", raisedAt: "2026-01-18", raisedBy: "Anil Deshmukh", resolvedAt: "2026-01-20", resolvedBy: "Anil Deshmukh", impactDays: 2, isActive: false },
    ],
    notes: "Premium kitchen project. High-priority dealer client. Finish quality is critical.",
  },

  // ===== CO-002: Nair Villa Complete Interiors — design phase, advance received =====
  {
    id: "CO-002",
    orderId: "ORD-002",
    quotationId: "QTN-002",
    projectName: "Nair Villa Complete Interiors",
    siteName: "Nair Villa, Indiranagar",
    accountId: "A002",
    accountName: "Nair Designs",
    accountType: "architect",
    city: "Bangalore",
    state: "Karnataka",
    zone: "South",
    salespersonName: "Sneha Reddy",
    priority: "urgent",
    productionStatus: "cutlist_pending",
    dispatchStatus: "not_ready",
    paymentStatus: "advance_received",
    currentPendingWith: "Cutlist Designer",
    quotationAmount: 278000,
    receivedAmount: 139000,
    balanceAmount: 139000,
    convertedAt: "2026-01-05",
    expectedCompletionDate: "2026-04-15",
    actualCompletionDate: null,
    roles: [
      { role: "project_manager", roleLabel: "Project Manager", userId: "OPS12", userName: "Nisha Pillai", assignedAt: "2026-01-06", assignedBy: "Priya Sharma" },
      { role: "cutlist_designer", roleLabel: "Cutlist Designer", userId: "OPS06", userName: "Meena Iyer", assignedAt: "2026-01-08", assignedBy: "Nisha Pillai" },
      { role: "operations_head", roleLabel: "Operations Head", userId: "OPS02", userName: "Priya Sharma", assignedAt: "2026-01-05", assignedBy: "System" },
      { role: "production_manager", roleLabel: "Production Manager", userId: "OPS11", userName: "Arjun Reddy", assignedAt: "2026-01-10", assignedBy: "Priya Sharma" },
      { role: "procurement_manager", roleLabel: "Procurement Manager", userId: "OPS07", userName: "Ravi Kulkarni", assignedAt: "2026-01-10", assignedBy: "Nisha Pillai" },
      { role: "packaging_manager", roleLabel: "Packaging Manager", userId: "OPS04", userName: "Kavita Joshi", assignedAt: "2026-01-10", assignedBy: "Priya Sharma" },
      { role: "dispatch_manager", roleLabel: "Dispatch Manager", userId: "OPS08", userName: "Deepa Nambiar", assignedAt: "2026-01-10", assignedBy: "Priya Sharma" },
      { role: "finance_manager", roleLabel: "Finance Manager", userId: "OPS09", userName: "Sanjay Gupta", assignedAt: "2026-01-06", assignedBy: "Priya Sharma" },
    ],
    milestones: [
      { id: "MS010", label: "Order Converted", status: "completed", date: "2026-01-05", expectedDate: "2026-01-05", completedBy: "Sneha Reddy" },
      { id: "MS011", label: "PM Assigned", status: "completed", date: "2026-01-06", expectedDate: "2026-01-07", completedBy: "Priya Sharma" },
      { id: "MS012", label: "Designer Assigned", status: "completed", date: "2026-01-08", expectedDate: "2026-01-09", completedBy: "Nisha Pillai" },
      { id: "MS013", label: "Cutlist Ready", status: "delayed", date: null, expectedDate: "2026-02-01", notes: "Villa project — multi-room cutlist in progress" },
      { id: "MS014", label: "Production Started", status: "pending", date: null, expectedDate: "2026-02-15" },
      { id: "MS015", label: "Packaging Ready", status: "pending", date: null, expectedDate: "2026-03-30" },
      { id: "MS016", label: "Dispatch Ready", status: "pending", date: null, expectedDate: "2026-04-05" },
      { id: "MS017", label: "Dispatched", status: "pending", date: null, expectedDate: "2026-04-10" },
      { id: "MS018", label: "Completion", status: "pending", date: null, expectedDate: "2026-04-15" },
    ],
    payments: [
      { id: "PAY003", amount: 83400, method: "bank_transfer", date: "2026-01-12", reference: "NEFT/2026/0112/003", receivedBy: "Sanjay Gupta", notes: "30% advance" },
      { id: "PAY004", amount: 55600, method: "cheque", date: "2026-02-01", reference: "CHQ/2026/44782", receivedBy: "Sanjay Gupta", notes: "20% progress payment" },
    ],
    activities: [
      { id: "ACT011", date: "2026-01-05", action: "Order Converted", description: "QTN-002 converted — full villa scope", user: "Sneha Reddy", type: "milestone" },
      { id: "ACT012", date: "2026-01-06", action: "PM Assigned", description: "Nisha Pillai assigned for Bangalore-based villa project", user: "Priya Sharma", type: "assignment" },
      { id: "ACT013", date: "2026-01-08", action: "Designer Assigned", description: "Meena Iyer assigned — Bangalore team", user: "Nisha Pillai", type: "assignment" },
      { id: "ACT014", date: "2026-01-12", action: "Payment Received", description: "₹83,400 advance via NEFT", user: "Sanjay Gupta", type: "payment" },
      { id: "ACT015", date: "2026-02-01", action: "Payment Received", description: "₹55,600 progress payment via cheque", user: "Sanjay Gupta", type: "payment" },
      { id: "ACT016", date: "2026-02-10", action: "Delay Raised", description: "Cutlist delayed — architect provided revised bathroom specs", user: "Meena Iyer", type: "delay" },
      { id: "ACT017", date: "2026-03-05", action: "Design Update", description: "Kitchen and wardrobe cutlists 80% complete. Bathroom pending architect sign-off.", user: "Meena Iyer", type: "status_update" },
      { id: "ACT018", date: "2026-03-12", action: "Note", description: "Architect confirmed final bathroom layout. Cutlist to be completed by Mar 20.", user: "Nisha Pillai", type: "note" },
    ],
    delays: [
      { id: "DL002", type: "delay", reason: "design_revision", description: "Architect provided revised bathroom specifications after initial cutlist was started. Kitchen and wardrobe rooms unaffected.", raisedAt: "2026-02-10", raisedBy: "Meena Iyer", resolvedAt: null, resolvedBy: null, impactDays: 15, isActive: true },
      { id: "DL003", type: "hold", reason: "client_hold", description: "Bathroom vanity design on hold pending client finish selection", raisedAt: "2026-02-15", raisedBy: "Nisha Pillai", resolvedAt: "2026-03-12", resolvedBy: "Nisha Pillai", impactDays: 25, isActive: false },
    ],
    notes: "Multi-room villa project. Architect-led. Complex scope with kitchen + wardrobes + bathrooms. Priority client.",
  },

  // ===== CO-003: Sheikh Office Partitions — dispatched, partial payment remaining =====
  {
    id: "CO-003",
    orderId: "ORD-003",
    quotationId: "QTN-003",
    projectName: "Sheikh Office Partitions",
    siteName: "Sheikh Commercial Tower, Kirti Nagar",
    accountId: "A003",
    accountName: "Sheikh Constructions",
    accountType: "dealer",
    city: "Delhi",
    state: "Delhi",
    zone: "North",
    salespersonName: "Priya Sharma",
    priority: "normal",
    productionStatus: "production_ready",
    dispatchStatus: "dispatched",
    paymentStatus: "partial",
    currentPendingWith: "Finance Manager",
    quotationAmount: 352400,
    receivedAmount: 246680,
    balanceAmount: 105720,
    convertedAt: "2026-01-15",
    expectedCompletionDate: "2026-03-10",
    actualCompletionDate: null,
    roles: [
      { role: "project_manager", roleLabel: "Project Manager", userId: "OPS01", userName: "Rajesh Kumar", assignedAt: "2026-01-16", assignedBy: "Priya Sharma" },
      { role: "cutlist_designer", roleLabel: "Cutlist Designer", userId: "OPS05", userName: "Anil Deshmukh", assignedAt: "2026-01-17", assignedBy: "Rajesh Kumar" },
      { role: "operations_head", roleLabel: "Operations Head", userId: "OPS02", userName: "Priya Sharma", assignedAt: "2026-01-15", assignedBy: "System" },
      { role: "production_manager", roleLabel: "Production Manager", userId: "OPS03", userName: "Suresh Menon", assignedAt: "2026-01-20", assignedBy: "Priya Sharma" },
      { role: "procurement_manager", roleLabel: "Procurement Manager", userId: "OPS07", userName: "Ravi Kulkarni", assignedAt: "2026-01-18", assignedBy: "Rajesh Kumar" },
      { role: "packaging_manager", roleLabel: "Packaging Manager", userId: "OPS04", userName: "Kavita Joshi", assignedAt: "2026-01-20", assignedBy: "Suresh Menon" },
      { role: "dispatch_manager", roleLabel: "Dispatch Manager", userId: "OPS08", userName: "Deepa Nambiar", assignedAt: "2026-01-20", assignedBy: "Priya Sharma" },
      { role: "finance_manager", roleLabel: "Finance Manager", userId: "OPS09", userName: "Sanjay Gupta", assignedAt: "2026-01-16", assignedBy: "Priya Sharma" },
    ],
    milestones: [
      { id: "MS019", label: "Order Converted", status: "completed", date: "2026-01-15", expectedDate: "2026-01-15", completedBy: "Priya Sharma" },
      { id: "MS020", label: "PM Assigned", status: "completed", date: "2026-01-16", expectedDate: "2026-01-17", completedBy: "Priya Sharma" },
      { id: "MS021", label: "Designer Assigned", status: "completed", date: "2026-01-17", expectedDate: "2026-01-18", completedBy: "Rajesh Kumar" },
      { id: "MS022", label: "Cutlist Ready", status: "completed", date: "2026-01-25", expectedDate: "2026-01-25", completedBy: "Anil Deshmukh" },
      { id: "MS023", label: "Production Started", status: "completed", date: "2026-01-28", expectedDate: "2026-01-28", completedBy: "Suresh Menon" },
      { id: "MS024", label: "Packaging Ready", status: "completed", date: "2026-02-28", expectedDate: "2026-03-01", completedBy: "Kavita Joshi" },
      { id: "MS025", label: "Dispatch Ready", status: "completed", date: "2026-03-02", expectedDate: "2026-03-03", completedBy: "Deepa Nambiar" },
      { id: "MS026", label: "Dispatched", status: "completed", date: "2026-03-05", expectedDate: "2026-03-05", completedBy: "Deepa Nambiar" },
      { id: "MS027", label: "Completion", status: "in_progress", date: null, expectedDate: "2026-03-20", notes: "Pending balance payment collection" },
    ],
    payments: [
      { id: "PAY005", amount: 105720, method: "bank_transfer", date: "2026-01-20", reference: "NEFT/2026/0120/005", receivedBy: "Sanjay Gupta", notes: "30% advance" },
      { id: "PAY006", amount: 70480, method: "cheque", date: "2026-02-10", reference: "CHQ/2026/55891", receivedBy: "Sanjay Gupta", notes: "20% progress payment" },
      { id: "PAY007", amount: 70480, method: "bank_transfer", date: "2026-03-01", reference: "NEFT/2026/0301/008", receivedBy: "Sanjay Gupta", notes: "Pre-dispatch payment" },
    ],
    activities: [
      { id: "ACT019", date: "2026-01-15", action: "Order Converted", description: "QTN-003 v3 converted after negotiation", user: "Priya Sharma", type: "milestone" },
      { id: "ACT020", date: "2026-01-16", action: "PM Assigned", description: "Rajesh Kumar assigned as PM", user: "Priya Sharma", type: "assignment" },
      { id: "ACT021", date: "2026-01-17", action: "Designer Assigned", description: "Anil Deshmukh assigned for commercial cutlist", user: "Rajesh Kumar", type: "assignment" },
      { id: "ACT022", date: "2026-01-20", action: "Payment Received", description: "₹1,05,720 advance via NEFT", user: "Sanjay Gupta", type: "payment" },
      { id: "ACT023", date: "2026-01-25", action: "Cutlist Ready", description: "Commercial partition cutlist completed on schedule", user: "Anil Deshmukh", type: "milestone" },
      { id: "ACT024", date: "2026-01-28", action: "Production Started", description: "Bulk production started — 20+ panels", user: "Suresh Menon", type: "status_update" },
      { id: "ACT025", date: "2026-02-10", action: "Payment Received", description: "₹70,480 progress payment via cheque", user: "Sanjay Gupta", type: "payment" },
      { id: "ACT026", date: "2026-02-28", action: "Packaging Complete", description: "All panels packaged and ready", user: "Kavita Joshi", type: "milestone" },
      { id: "ACT027", date: "2026-03-01", action: "Payment Received", description: "₹70,480 pre-dispatch payment via NEFT", user: "Sanjay Gupta", type: "payment" },
      { id: "ACT028", date: "2026-03-05", action: "Dispatched", description: "Full shipment dispatched via logistics partner", user: "Deepa Nambiar", type: "milestone" },
      { id: "ACT029", date: "2026-03-10", action: "Note", description: "Balance ₹1,05,720 pending. Client confirmed payment by March 25.", user: "Sanjay Gupta", type: "note" },
    ],
    delays: [],
    notes: "Bulk commercial project — delivered on schedule. Balance payment pending.",
  },
];

// ---------- Helpers ----------
export const getConvertedOrderById = (id: string) => convertedOrders.find(co => co.id === id);
export const getConvertedOrderByOrderId = (orderId: string) => convertedOrders.find(co => co.orderId === orderId);
export const getConvertedOrderByQuotationId = (qid: string) => convertedOrders.find(co => co.quotationId === qid);

export const productionStatusLabels: Record<ProductionStatus, string> = {
  design_pending: "Design Pending",
  cutlist_pending: "Cutlist Pending",
  material_procurement: "Material Procurement",
  cutting: "Cutting",
  edging: "Edging",
  assembly: "Assembly",
  finishing: "Finishing",
  quality_check: "Quality Check",
  production_ready: "Production Ready",
};

export const dispatchStatusLabels: Record<DispatchStatus, string> = {
  not_ready: "Not Ready",
  packaging: "Packaging",
  ready_to_dispatch: "Ready to Dispatch",
  dispatched: "Dispatched",
  in_transit: "In Transit",
  delivered: "Delivered",
};

export const priorityLabels: Record<ConvertedOrderPriority, string> = {
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
  critical: "Critical",
};

export const delayReasonLabels: Record<DelayReason, string> = {
  material_shortage: "Material Shortage",
  design_revision: "Design Revision",
  client_hold: "Client Hold",
  production_bottleneck: "Production Bottleneck",
  payment_pending: "Payment Pending",
  logistics_delay: "Logistics Delay",
  quality_issue: "Quality Issue",
  other: "Other",
};

export const opsRoleOptions = [
  "Project Manager", "Cutlist Designer", "Operations Head",
  "Production Manager", "Procurement Manager", "Packaging Manager",
  "Dispatch Manager", "Finance Manager",
];

// ---------- Dashboard Aggregations ----------
export function getOperationsDashboardStats() {
  const total = convertedOrders.length;
  const designPending = convertedOrders.filter(co => co.productionStatus === "design_pending" || co.productionStatus === "cutlist_pending").length;
  const productionPending = convertedOrders.filter(co => co.productionStatus === "material_procurement").length;
  const productionInProgress = convertedOrders.filter(co => ["cutting", "edging", "assembly", "finishing", "quality_check"].includes(co.productionStatus)).length;
  const readyToDispatch = convertedOrders.filter(co => co.dispatchStatus === "ready_to_dispatch" || co.productionStatus === "production_ready").length;
  const dispatched = convertedOrders.filter(co => co.dispatchStatus === "dispatched" || co.dispatchStatus === "in_transit").length;
  const delivered = convertedOrders.filter(co => co.dispatchStatus === "delivered").length;
  const paymentPending = convertedOrders.filter(co => co.balanceAmount > 0).length;

  // Delayed orders
  const delayed = convertedOrders.filter(co => co.delays.some(d => d.isActive)).length;

  // Priority split
  const prioritySplit = (["critical", "urgent", "high", "normal"] as ConvertedOrderPriority[]).map(p => ({
    priority: priorityLabels[p],
    count: convertedOrders.filter(co => co.priority === p).length,
  })).filter(p => p.count > 0);

  // Bottlenecks (who has the most pending items)
  const pendingWithCounts: Record<string, number> = {};
  convertedOrders.forEach(co => {
    pendingWithCounts[co.currentPendingWith] = (pendingWithCounts[co.currentPendingWith] || 0) + 1;
  });
  const bottlenecks = Object.entries(pendingWithCounts)
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count);

  // Financial summary
  const totalQuotationValue = convertedOrders.reduce((s, co) => s + co.quotationAmount, 0);
  const totalReceived = convertedOrders.reduce((s, co) => s + co.receivedAmount, 0);
  const totalBalance = convertedOrders.reduce((s, co) => s + co.balanceAmount, 0);
  const collectionRate = totalQuotationValue > 0 ? Math.round((totalReceived / totalQuotationValue) * 100) : 0;

  // Production status distribution
  const productionDistribution = Object.entries(productionStatusLabels).map(([key, label]) => ({
    status: label,
    count: convertedOrders.filter(co => co.productionStatus === key).length,
  })).filter(p => p.count > 0);

  return {
    total, designPending, productionPending, productionInProgress,
    readyToDispatch, dispatched, delivered, delayed, paymentPending,
    prioritySplit, bottlenecks,
    totalQuotationValue, totalReceived, totalBalance, collectionRate,
    productionDistribution,
  };
}
