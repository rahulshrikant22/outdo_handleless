// ============================================================
// OutDo Task Management — Phase 6 Data Layer
// Correlated: Converted Orders → Tasks → Roles → Users
// Uses same opsStaff and convertedOrders from operations.ts
// ============================================================

import { convertedOrders, opsStaff, type ConvertedOrder, type OpsStaff } from "./operations";

// ---------- Types ----------
export type TaskStatus = "pending" | "in_progress" | "completed" | "on_hold" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent" | "critical";
export type TaskCategory =
  | "design" | "production" | "procurement" | "quality"
  | "packaging" | "dispatch" | "finance" | "management" | "communication";

export interface OpsTask {
  id: string;
  convertedOrderId: string;
  projectName: string;
  accountName: string;
  accountId: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  assigneeRole: string;
  assigneeDepartment: string;
  createdById: string;
  createdByName: string;
  allocatedDate: string;
  dueDate: string;
  completedDate: string | null;
  closureNote: string | null;
  isOverdue: boolean;
  overdueDays: number;
  dependencies: string[]; // task IDs
  tags: string[];
}

// ---------- Today for overdue calc ----------
const TODAY = "2026-03-17";

function calcOverdue(dueDate: string, status: TaskStatus, completedDate: string | null): { isOverdue: boolean; overdueDays: number } {
  if (status === "completed" || status === "cancelled") return { isOverdue: false, overdueDays: 0 };
  const due = new Date(dueDate);
  const now = new Date(TODAY);
  const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return { isOverdue: diff > 0, overdueDays: Math.max(0, diff) };
}

// ---------- Task Data ----------
// 23 tasks across 3 converted orders, fully correlated

const rawTasks: Omit<OpsTask, "isOverdue" | "overdueDays" | "projectName" | "accountName" | "accountId" | "assigneeName" | "assigneeRole" | "assigneeDepartment" | "createdByName">[] = [
  // ===== CO-001: Mehta Premium Kitchen (Assembly phase) =====
  {
    id: "TSK-001", convertedOrderId: "CO-001",
    title: "Design validation — kitchen layout",
    description: "Validate L-shaped kitchen design against site measurements and client requirements. Confirm handle-less shutter specifications.",
    category: "design", status: "completed", priority: "high",
    assigneeId: "OPS05", createdById: "OPS01",
    allocatedDate: "2026-01-07", dueDate: "2026-01-12", completedDate: "2026-01-11",
    closureNote: "Design validated. Minor adjustment to corner unit dimensions applied.",
    dependencies: [], tags: ["kitchen", "design-review"],
  },
  {
    id: "TSK-002", convertedOrderId: "CO-001",
    title: "Cutlist preparation — kitchen panels",
    description: "Prepare detailed cutlist for 14 kitchen shutter panels including all edge banding specs.",
    category: "design", status: "completed", priority: "high",
    assigneeId: "OPS05", createdById: "OPS01",
    allocatedDate: "2026-01-12", dueDate: "2026-01-18", completedDate: "2026-01-20",
    closureNote: "Cutlist completed — 2 days delayed due to complex L-shape design. All 14 panels specified.",
    dependencies: ["TSK-001"], tags: ["kitchen", "cutlist"],
  },
  {
    id: "TSK-003", convertedOrderId: "CO-001",
    title: "Material procurement — MDF sheets & hardware",
    description: "Procure 18mm MDF sheets (Greenlam), Hettich hardware, and edge banding tape for kitchen order.",
    category: "procurement", status: "completed", priority: "high",
    assigneeId: "OPS07", createdById: "OPS01",
    allocatedDate: "2026-01-15", dueDate: "2026-01-22", completedDate: "2026-01-21",
    closureNote: "All materials procured. Greenlam sheets delivered to factory.",
    dependencies: ["TSK-002"], tags: ["procurement", "materials"],
  },
  {
    id: "TSK-004", convertedOrderId: "CO-001",
    title: "CNC cutting — kitchen panels",
    description: "Execute CNC cutting for all 14 panels as per approved cutlist. Maintain 0.5mm tolerance.",
    category: "production", status: "completed", priority: "medium",
    assigneeId: "OPS03", createdById: "OPS01",
    allocatedDate: "2026-01-25", dueDate: "2026-02-05", completedDate: "2026-02-03",
    closureNote: "All panels cut to spec. QC passed.",
    dependencies: ["TSK-003"], tags: ["production", "cnc"],
  },
  {
    id: "TSK-005", convertedOrderId: "CO-001",
    title: "Edge banding — kitchen panels",
    description: "Apply edge banding to all 14 panels. Use matching laminate tape for visible edges.",
    category: "production", status: "completed", priority: "medium",
    assigneeId: "OPS03", createdById: "OPS01",
    allocatedDate: "2026-02-05", dueDate: "2026-02-12", completedDate: "2026-02-10",
    closureNote: "Edge banding completed. Finish quality approved.",
    dependencies: ["TSK-004"], tags: ["production", "edge-banding"],
  },
  {
    id: "TSK-006", convertedOrderId: "CO-001",
    title: "Assembly supervision — kitchen units",
    description: "Supervise assembly of kitchen base units, wall units, and tall units. Verify hardware fitment.",
    category: "production", status: "in_progress", priority: "high",
    assigneeId: "OPS03", createdById: "OPS01",
    allocatedDate: "2026-02-15", dueDate: "2026-03-20", completedDate: null,
    closureNote: null,
    dependencies: ["TSK-005"], tags: ["production", "assembly"],
  },
  {
    id: "TSK-007", convertedOrderId: "CO-001",
    title: "Quality check — assembled kitchen",
    description: "Final QC inspection of all assembled kitchen units before packaging. Check alignment, finish, hardware.",
    category: "quality", status: "pending", priority: "high",
    assigneeId: "OPS03", createdById: "OPS01",
    allocatedDate: "2026-02-15", dueDate: "2026-03-22", completedDate: null,
    closureNote: null,
    dependencies: ["TSK-006"], tags: ["quality", "inspection"],
  },
  {
    id: "TSK-008", convertedOrderId: "CO-001",
    title: "Payment collection — 2nd installment",
    description: "Follow up and collect 20% progress payment (₹20,960) from Mehta Interiors.",
    category: "finance", status: "completed", priority: "medium",
    assigneeId: "OPS10", createdById: "OPS01",
    allocatedDate: "2026-02-01", dueDate: "2026-02-20", completedDate: "2026-02-15",
    closureNote: "₹20,960 received via UPI. Reference: UPI/2026/0215/042.",
    dependencies: [], tags: ["finance", "collection"],
  },
  {
    id: "TSK-009", convertedOrderId: "CO-001",
    title: "Packaging preparation — kitchen units",
    description: "Prepare protective packaging for all kitchen units. Use foam + cardboard protection for handleless surfaces.",
    category: "packaging", status: "pending", priority: "medium",
    assigneeId: "OPS04", createdById: "OPS03",
    allocatedDate: "2026-03-01", dueDate: "2026-03-25", completedDate: null,
    closureNote: null,
    dependencies: ["TSK-007"], tags: ["packaging"],
  },

  // ===== CO-002: Nair Villa Complete Interiors (Cutlist pending) =====
  {
    id: "TSK-010", convertedOrderId: "CO-002",
    title: "Site measurement verification",
    description: "Verify architect-provided measurements for all 4 rooms (kitchen, 2 wardrobes, bathroom). Cross-check with site visit.",
    category: "management", status: "completed", priority: "high",
    assigneeId: "OPS12", createdById: "OPS02",
    allocatedDate: "2026-01-08", dueDate: "2026-01-12", completedDate: "2026-01-10",
    closureNote: "All room measurements verified. Minor discrepancy in bathroom width noted and communicated to architect.",
    dependencies: [], tags: ["site-visit", "measurement"],
  },
  {
    id: "TSK-011", convertedOrderId: "CO-002",
    title: "Kitchen cutlist design — villa",
    description: "Design cutlist for premium U-shaped kitchen with island. 22 panels including tall pantry unit.",
    category: "design", status: "in_progress", priority: "urgent",
    assigneeId: "OPS06", createdById: "OPS12",
    allocatedDate: "2026-01-15", dueDate: "2026-02-15", completedDate: null,
    closureNote: null,
    dependencies: ["TSK-010"], tags: ["kitchen", "cutlist", "villa"],
  },
  {
    id: "TSK-012", convertedOrderId: "CO-002",
    title: "Wardrobe cutlist design — master & guest",
    description: "Design cutlist for 2 walk-in wardrobes. Master: 8 panels, Guest: 6 panels. Handleless sliding system.",
    category: "design", status: "in_progress", priority: "high",
    assigneeId: "OPS06", createdById: "OPS12",
    allocatedDate: "2026-01-20", dueDate: "2026-02-20", completedDate: null,
    closureNote: null,
    dependencies: ["TSK-010"], tags: ["wardrobe", "cutlist", "villa"],
  },
  {
    id: "TSK-013", convertedOrderId: "CO-002",
    title: "Bathroom vanity cutlist",
    description: "Design cutlist for bathroom vanity unit — waterproof marine ply with laminate finish. Pending architect sign-off on final layout.",
    category: "design", status: "on_hold", priority: "medium",
    assigneeId: "OPS06", createdById: "OPS12",
    allocatedDate: "2026-01-25", dueDate: "2026-03-05", completedDate: null,
    closureNote: null,
    dependencies: ["TSK-010"], tags: ["bathroom", "cutlist", "villa"],
  },
  {
    id: "TSK-014", convertedOrderId: "CO-002",
    title: "Advance payment follow-up",
    description: "Follow up and confirm 30% advance payment (₹83,400) receipt from Nair Designs.",
    category: "finance", status: "completed", priority: "high",
    assigneeId: "OPS09", createdById: "OPS12",
    allocatedDate: "2026-01-08", dueDate: "2026-01-15", completedDate: "2026-01-12",
    closureNote: "₹83,400 advance received via NEFT. Reference: NEFT/2026/0112/003.",
    dependencies: [], tags: ["finance", "advance"],
  },
  {
    id: "TSK-015", convertedOrderId: "CO-002",
    title: "Material estimation — villa project",
    description: "Prepare complete material estimation for all 4 rooms. Include MDF, marine ply, hardware, edge tape, and accessories.",
    category: "procurement", status: "pending", priority: "medium",
    assigneeId: "OPS07", createdById: "OPS12",
    allocatedDate: "2026-02-01", dueDate: "2026-03-25", completedDate: null,
    closureNote: null,
    dependencies: ["TSK-011", "TSK-012", "TSK-013"], tags: ["procurement", "estimation"],
  },
  {
    id: "TSK-016", convertedOrderId: "CO-002",
    title: "Architect coordination — design approval",
    description: "Coordinate with Nair Designs architect for final approval on all room layouts before production release.",
    category: "communication", status: "in_progress", priority: "urgent",
    assigneeId: "OPS12", createdById: "OPS02",
    allocatedDate: "2026-02-10", dueDate: "2026-03-15", completedDate: null,
    closureNote: null,
    dependencies: ["TSK-011", "TSK-012"], tags: ["architect", "approval"],
  },

  // ===== CO-003: Sheikh Office Partitions (Dispatched) =====
  {
    id: "TSK-017", convertedOrderId: "CO-003",
    title: "Cutlist finalization — office partitions",
    description: "Finalize cutlist for 20 office partition panels. Standard dimensions, batch production spec.",
    category: "design", status: "completed", priority: "medium",
    assigneeId: "OPS05", createdById: "OPS01",
    allocatedDate: "2026-01-17", dueDate: "2026-01-25", completedDate: "2026-01-25",
    closureNote: "Cutlist finalized for all 20 panels. Standard partition specs applied.",
    dependencies: [], tags: ["office", "cutlist", "partition"],
  },
  {
    id: "TSK-018", convertedOrderId: "CO-003",
    title: "Bulk production oversight — 20 panels",
    description: "Oversee bulk production of 20 partition panels. CNC cutting, edge banding, and finishing in batch mode.",
    category: "production", status: "completed", priority: "high",
    assigneeId: "OPS03", createdById: "OPS01",
    allocatedDate: "2026-01-28", dueDate: "2026-02-25", completedDate: "2026-02-24",
    closureNote: "All 20 panels produced. Batch production completed 1 day ahead.",
    dependencies: ["TSK-017"], tags: ["production", "bulk", "partition"],
  },
  {
    id: "TSK-019", convertedOrderId: "CO-003",
    title: "Quality inspection — partition panels",
    description: "Quality inspection of all 20 partition panels. Check dimensions, finish, and structural integrity.",
    category: "quality", status: "completed", priority: "high",
    assigneeId: "OPS03", createdById: "OPS01",
    allocatedDate: "2026-02-25", dueDate: "2026-02-27", completedDate: "2026-02-26",
    closureNote: "All panels passed QC. Minor edge touch-up on 2 panels completed.",
    dependencies: ["TSK-018"], tags: ["quality", "partition"],
  },
  {
    id: "TSK-020", convertedOrderId: "CO-003",
    title: "Packaging — partition panels",
    description: "Package all 20 partition panels for transport. Use protective foam wrapping for each panel.",
    category: "packaging", status: "completed", priority: "medium",
    assigneeId: "OPS04", createdById: "OPS03",
    allocatedDate: "2026-02-27", dueDate: "2026-03-01", completedDate: "2026-02-28",
    closureNote: "All panels packaged. Ready for dispatch.",
    dependencies: ["TSK-019"], tags: ["packaging", "partition"],
  },
  {
    id: "TSK-021", convertedOrderId: "CO-003",
    title: "Dispatch coordination — Delhi shipment",
    description: "Coordinate logistics for Delhi shipment. Arrange transport, prepare dispatch documents, update tracking.",
    category: "dispatch", status: "completed", priority: "high",
    assigneeId: "OPS08", createdById: "OPS01",
    allocatedDate: "2026-03-01", dueDate: "2026-03-05", completedDate: "2026-03-05",
    closureNote: "Dispatched via BlueDart Logistics. Tracking: BD2026030512. Estimated delivery: Mar 8.",
    dependencies: ["TSK-020"], tags: ["dispatch", "logistics"],
  },
  {
    id: "TSK-022", convertedOrderId: "CO-003",
    title: "Balance payment collection — ₹1,05,720",
    description: "Collect remaining balance of ₹1,05,720 from Sheikh Constructions. Client confirmed payment by March 25.",
    category: "finance", status: "in_progress", priority: "urgent",
    assigneeId: "OPS09", createdById: "OPS01",
    allocatedDate: "2026-03-05", dueDate: "2026-03-15", completedDate: null,
    closureNote: null,
    dependencies: ["TSK-021"], tags: ["finance", "collection", "overdue"],
  },
  {
    id: "TSK-023", convertedOrderId: "CO-003",
    title: "Project closure report",
    description: "Prepare project closure report for Sheikh Office Partitions. Include timeline analysis, cost summary, and client feedback.",
    category: "management", status: "pending", priority: "low",
    assigneeId: "OPS01", createdById: "OPS02",
    allocatedDate: "2026-03-10", dueDate: "2026-03-30", completedDate: null,
    closureNote: null,
    dependencies: ["TSK-022"], tags: ["management", "closure"],
  },
];

// ---------- Build enriched tasks ----------
function enrichTask(raw: typeof rawTasks[0]): OpsTask {
  const co = convertedOrders.find(c => c.id === raw.convertedOrderId)!;
  const assignee = opsStaff.find(s => s.id === raw.assigneeId)!;
  const creator = opsStaff.find(s => s.id === raw.createdById)!;
  const { isOverdue, overdueDays } = calcOverdue(raw.dueDate, raw.status, raw.completedDate);

  return {
    ...raw,
    projectName: co.projectName,
    accountName: co.accountName,
    accountId: co.accountId,
    assigneeName: assignee.name,
    assigneeRole: assignee.role,
    assigneeDepartment: assignee.department,
    createdByName: creator.name,
    isOverdue,
    overdueDays,
  };
}

export const opsTasks: OpsTask[] = rawTasks.map(enrichTask);

// ---------- Helpers ----------
export const getTaskById = (id: string) => opsTasks.find(t => t.id === id);
export const getTasksByOrderId = (coId: string) => opsTasks.filter(t => t.convertedOrderId === coId);
export const getTasksByAssignee = (userId: string) => opsTasks.filter(t => t.assigneeId === userId);
export const getTasksByStatus = (status: TaskStatus) => opsTasks.filter(t => t.status === status);
export const getTasksByCategory = (cat: TaskCategory) => opsTasks.filter(t => t.category === cat);

// ---------- Dashboard Aggregations ----------
export function getTaskDashboardStats() {
  const total = opsTasks.length;
  const completed = opsTasks.filter(t => t.status === "completed").length;
  const inProgress = opsTasks.filter(t => t.status === "in_progress").length;
  const pending = opsTasks.filter(t => t.status === "pending").length;
  const onHold = opsTasks.filter(t => t.status === "on_hold").length;
  const overdue = opsTasks.filter(t => t.isOverdue).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // By role
  const byRole: Record<string, { total: number; completed: number; inProgress: number; pending: number }> = {};
  opsTasks.forEach(t => {
    if (!byRole[t.assigneeRole]) byRole[t.assigneeRole] = { total: 0, completed: 0, inProgress: 0, pending: 0 };
    byRole[t.assigneeRole].total++;
    if (t.status === "completed") byRole[t.assigneeRole].completed++;
    if (t.status === "in_progress") byRole[t.assigneeRole].inProgress++;
    if (t.status === "pending" || t.status === "on_hold") byRole[t.assigneeRole].pending++;
  });

  // By priority
  const byPriority = (["critical", "urgent", "high", "medium", "low"] as TaskPriority[]).map(p => ({
    priority: p,
    count: opsTasks.filter(t => t.priority === p).length,
  })).filter(p => p.count > 0);

  // By category
  const categories: TaskCategory[] = ["design", "production", "procurement", "quality", "packaging", "dispatch", "finance", "management", "communication"];
  const byCategory = categories.map(c => ({
    category: c,
    count: opsTasks.filter(t => t.category === c).length,
  })).filter(c => c.count > 0);

  // By assignee
  const byAssignee: Record<string, { name: string; role: string; total: number; completed: number; inProgress: number; overdue: number }> = {};
  opsTasks.forEach(t => {
    if (!byAssignee[t.assigneeId]) byAssignee[t.assigneeId] = { name: t.assigneeName, role: t.assigneeRole, total: 0, completed: 0, inProgress: 0, overdue: 0 };
    byAssignee[t.assigneeId].total++;
    if (t.status === "completed") byAssignee[t.assigneeId].completed++;
    if (t.status === "in_progress") byAssignee[t.assigneeId].inProgress++;
    if (t.isOverdue) byAssignee[t.assigneeId].overdue++;
  });

  // By converted order
  const byProject = convertedOrders.map(co => ({
    coId: co.id,
    projectName: co.projectName,
    accountName: co.accountName,
    total: opsTasks.filter(t => t.convertedOrderId === co.id).length,
    completed: opsTasks.filter(t => t.convertedOrderId === co.id && t.status === "completed").length,
    inProgress: opsTasks.filter(t => t.convertedOrderId === co.id && t.status === "in_progress").length,
    pending: opsTasks.filter(t => t.convertedOrderId === co.id && (t.status === "pending" || t.status === "on_hold")).length,
    overdue: opsTasks.filter(t => t.convertedOrderId === co.id && t.isOverdue).length,
  }));

  return {
    total, completed, inProgress, pending, onHold, overdue, completionRate,
    byRole: Object.entries(byRole).map(([role, data]) => ({ role, ...data })),
    byPriority, byCategory,
    byAssignee: Object.entries(byAssignee).map(([id, data]) => ({ id, ...data })),
    byProject,
  };
}

// ---------- Category labels ----------
export const categoryLabels: Record<TaskCategory, string> = {
  design: "Design",
  production: "Production",
  procurement: "Procurement",
  quality: "Quality",
  packaging: "Packaging",
  dispatch: "Dispatch",
  finance: "Finance",
  management: "Management",
  communication: "Communication",
};

export const categoryColors: Record<TaskCategory, string> = {
  design: "#8B5CF6",
  production: "#3B82F6",
  procurement: "#F59E0B",
  quality: "#10B981",
  packaging: "#EC4899",
  dispatch: "#6366F1",
  finance: "#C5A87E",
  management: "#1B2A4A",
  communication: "#06B6D4",
};

// ---------- Role-wise views ----------
export const roleViewFilters: Record<string, { label: string; userId: string; departments: string[] }> = {
  operations_head: { label: "Operations Head", userId: "OPS02", departments: ["Operations", "Production", "Design", "Procurement", "Logistics", "Finance"] },
  project_manager_rk: { label: "PM — Rajesh Kumar", userId: "OPS01", departments: ["Operations"] },
  project_manager_np: { label: "PM — Nisha Pillai", userId: "OPS12", departments: ["Operations"] },
  designer_ad: { label: "Designer — Anil Deshmukh", userId: "OPS05", departments: ["Design"] },
  designer_mi: { label: "Designer — Meena Iyer", userId: "OPS06", departments: ["Design"] },
  production_sm: { label: "Production — Suresh Menon", userId: "OPS03", departments: ["Production"] },
  dispatch_dn: { label: "Dispatch — Deepa Nambiar", userId: "OPS08", departments: ["Logistics"] },
  finance_sg: { label: "Finance — Sanjay Gupta", userId: "OPS09", departments: ["Finance"] },
  finance_pv: { label: "Finance — Pooja Verma", userId: "OPS10", departments: ["Finance"] },
};
