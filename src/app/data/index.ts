// ============================================================
// OutDo Handleless Shutters — Correlated Dummy Data Model
// All records are cross-referenced: leads → accounts → orders → tasks → payments
// ============================================================

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type AccountStatus = "active" | "inactive" | "converted";
export type OrderStatus = "draft" | "confirmed" | "in_production" | "shipped" | "delivered" | "cancelled";
export type QuotationStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";
export type TaskStatus = "pending" | "in_progress" | "completed" | "on_hold";
export type PaymentStatus = "pending" | "partial" | "completed" | "overdue";
export type UserRole = "admin" | "dealer" | "architect" | "factory" | "customer";

// ---------- Users / Team ----------
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  avatar?: string;
}

export const users: User[] = [
  { id: "U001", name: "Rajesh Kumar", email: "rajesh@outdo.in", role: "admin", city: "Mumbai" },
  { id: "U002", name: "Priya Sharma", email: "priya@outdo.in", role: "admin", city: "Delhi" },
  { id: "U003", name: "Amit Patel", email: "amit@dealer.com", role: "dealer", city: "Ahmedabad" },
  { id: "U004", name: "Sneha Reddy", email: "sneha@dealer.com", role: "dealer", city: "Hyderabad" },
  { id: "U005", name: "Vikram Singh", email: "vikram@arch.com", role: "architect", city: "Bangalore" },
  { id: "U006", name: "Neha Gupta", email: "neha@arch.com", role: "architect", city: "Pune" },
  { id: "U007", name: "Suresh Menon", email: "suresh@factory.com", role: "factory", city: "Chennai" },
  { id: "U008", name: "Kavita Joshi", email: "kavita@factory.com", role: "factory", city: "Mumbai" },
];

// ---------- Salespersons ----------
export interface Salesperson {
  id: string;
  userId: string;
  name: string;
  city: string;
  region: string;
}

export const salespersons: Salesperson[] = [
  { id: "SP01", userId: "U001", name: "Rajesh Kumar", city: "Mumbai", region: "West" },
  { id: "SP02", userId: "U002", name: "Priya Sharma", city: "Delhi", region: "North" },
  { id: "SP03", userId: "U003", name: "Amit Patel", city: "Ahmedabad", region: "West" },
  { id: "SP04", userId: "U004", name: "Sneha Reddy", city: "Hyderabad", region: "South" },
];

// ---------- 8 Leads ----------
export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  source: string;
  status: LeadStatus;
  salespersonId: string;
  convertedAccountId?: string;
  createdAt: string;
  notes: string;
}

export const leads: Lead[] = [
  { id: "L001", name: "Anand Mehta", company: "Mehta Interiors", email: "anand@mehta.in", phone: "+91-9876543210", city: "Mumbai", source: "Website", status: "converted", salespersonId: "SP01", convertedAccountId: "A001", createdAt: "2025-11-15", notes: "Interested in kitchen shutters" },
  { id: "L002", name: "Deepika Nair", company: "Nair Designs", email: "deepika@nair.in", phone: "+91-9876543211", city: "Bangalore", source: "Referral", status: "converted", salespersonId: "SP04", convertedAccountId: "A002", createdAt: "2025-11-20", notes: "Large residential project" },
  { id: "L003", name: "Farhan Sheikh", company: "Sheikh Constructions", email: "farhan@sheikh.in", phone: "+91-9876543212", city: "Delhi", source: "Exhibition", status: "converted", salespersonId: "SP02", convertedAccountId: "A003", createdAt: "2025-12-01", notes: "Commercial project inquiry" },
  { id: "L004", name: "Geeta Rao", company: "Rao Homes", email: "geeta@rao.in", phone: "+91-9876543213", city: "Hyderabad", source: "Social Media", status: "converted", salespersonId: "SP04", convertedAccountId: "A004", createdAt: "2025-12-10", notes: "Modular kitchen requirements" },
  { id: "L005", name: "Harish Bhat", company: "Bhat Associates", email: "harish@bhat.in", phone: "+91-9876543214", city: "Pune", source: "Website", status: "converted", salespersonId: "SP03", convertedAccountId: "A005", createdAt: "2025-12-15", notes: "Wardrobe shutters needed" },
  { id: "L006", name: "Isha Kapoor", company: "Kapoor Studios", email: "isha@kapoor.in", phone: "+91-9876543215", city: "Mumbai", source: "Cold Call", status: "qualified", salespersonId: "SP01", createdAt: "2026-01-05", notes: "Exploring options for studio renovation" },
  { id: "L007", name: "Jayant Desai", company: "Desai Developers", email: "jayant@desai.in", phone: "+91-9876543216", city: "Ahmedabad", source: "Referral", status: "contacted", salespersonId: "SP03", createdAt: "2026-01-12", notes: "Builder project — bulk inquiry" },
  { id: "L008", name: "Kiran Malhotra", company: "Malhotra Group", email: "kiran@malhotra.in", phone: "+91-9876543217", city: "Delhi", source: "Exhibition", status: "new", salespersonId: "SP02", createdAt: "2026-02-01", notes: "First contact at HomeDeco Expo" },
];

// ---------- 5 Accounts (from converted leads), 4 active ----------
export interface Account {
  id: string;
  leadId: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  status: AccountStatus;
  dealerId?: string;
  architectId?: string;
  salespersonId: string;
  createdAt: string;
  totalValue: number;
}

export const accounts: Account[] = [
  { id: "A001", leadId: "L001", company: "Mehta Interiors", contactName: "Anand Mehta", email: "anand@mehta.in", phone: "+91-9876543210", city: "Mumbai", status: "active", dealerId: "U003", architectId: "U005", salespersonId: "SP01", createdAt: "2025-11-25", totalValue: 485000 },
  { id: "A002", leadId: "L002", company: "Nair Designs", contactName: "Deepika Nair", email: "deepika@nair.in", phone: "+91-9876543211", city: "Bangalore", status: "active", dealerId: "U004", architectId: "U005", salespersonId: "SP04", createdAt: "2025-12-01", totalValue: 720000 },
  { id: "A003", leadId: "L003", company: "Sheikh Constructions", contactName: "Farhan Sheikh", email: "farhan@sheikh.in", phone: "+91-9876543212", city: "Delhi", status: "active", dealerId: "U003", architectId: "U006", salespersonId: "SP02", createdAt: "2025-12-10", totalValue: 350000 },
  { id: "A004", leadId: "L004", company: "Rao Homes", contactName: "Geeta Rao", email: "geeta@rao.in", phone: "+91-9876543213", city: "Hyderabad", status: "active", dealerId: "U004", salespersonId: "SP04", createdAt: "2025-12-20", totalValue: 290000 },
  { id: "A005", leadId: "L005", company: "Bhat Associates", contactName: "Harish Bhat", email: "harish@bhat.in", phone: "+91-9876543214", city: "Pune", status: "inactive", dealerId: "U003", architectId: "U006", salespersonId: "SP03", createdAt: "2025-12-28", totalValue: 150000 },
];

// ---------- 4 Quotations ----------
export interface Quotation {
  id: string;
  accountId: string;
  orderId?: string;
  items: string;
  totalAmount: number;
  status: QuotationStatus;
  validUntil: string;
  createdAt: string;
  salespersonId: string;
}

export const quotations: Quotation[] = [
  { id: "Q001", accountId: "A001", orderId: "O001", items: "Kitchen Handleless Shutters x 12", totalAmount: 245000, status: "accepted", validUntil: "2026-02-15", createdAt: "2025-12-05", salespersonId: "SP01" },
  { id: "Q002", accountId: "A002", orderId: "O002", items: "Wardrobe Shutters x 8, Kitchen Shutters x 6", totalAmount: 380000, status: "accepted", validUntil: "2026-02-20", createdAt: "2025-12-12", salespersonId: "SP04" },
  { id: "Q003", accountId: "A003", orderId: "O003", items: "Office Partition Shutters x 20", totalAmount: 350000, status: "accepted", validUntil: "2026-03-01", createdAt: "2025-12-18", salespersonId: "SP02" },
  { id: "Q004", accountId: "A004", items: "Modular Kitchen Shutters x 10", totalAmount: 190000, status: "sent", validUntil: "2026-03-15", createdAt: "2026-01-10", salespersonId: "SP04" },
];

// ---------- 4 Orders (3 converted / active, 1 draft) ----------
export interface Order {
  id: string;
  accountId: string;
  quotationId: string;
  items: string;
  totalAmount: number;
  status: OrderStatus;
  factoryUserId: string;
  createdAt: string;
  expectedDelivery: string;
}

export const orders: Order[] = [
  { id: "O001", accountId: "A001", quotationId: "Q001", items: "Kitchen Handleless Shutters x 12", totalAmount: 245000, status: "in_production", factoryUserId: "U007", createdAt: "2025-12-15", expectedDelivery: "2026-02-15" },
  { id: "O002", accountId: "A002", quotationId: "Q002", items: "Wardrobe Shutters x 8, Kitchen Shutters x 6", totalAmount: 380000, status: "confirmed", factoryUserId: "U008", createdAt: "2025-12-22", expectedDelivery: "2026-03-01" },
  { id: "O003", accountId: "A003", quotationId: "Q003", items: "Office Partition Shutters x 20", totalAmount: 350000, status: "shipped", factoryUserId: "U007", createdAt: "2026-01-05", expectedDelivery: "2026-02-28" },
  { id: "O004", accountId: "A004", quotationId: "Q004", items: "Modular Kitchen Shutters x 10", totalAmount: 190000, status: "draft", factoryUserId: "U008", createdAt: "2026-01-20", expectedDelivery: "2026-04-01" },
];

// ---------- 12 Tasks (linked to orders) ----------
export interface Task {
  id: string;
  orderId: string;
  title: string;
  assigneeId: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  createdAt: string;
}

export const tasks: Task[] = [
  // O001 tasks (4)
  { id: "T001", orderId: "O001", title: "Material procurement — MDF boards", assigneeId: "U007", status: "completed", priority: "high", dueDate: "2025-12-25", createdAt: "2025-12-16" },
  { id: "T002", orderId: "O001", title: "CNC cutting — kitchen panels", assigneeId: "U007", status: "in_progress", priority: "high", dueDate: "2026-01-15", createdAt: "2025-12-26" },
  { id: "T003", orderId: "O001", title: "Edge banding & finishing", assigneeId: "U008", status: "pending", priority: "medium", dueDate: "2026-01-30", createdAt: "2025-12-26" },
  { id: "T004", orderId: "O001", title: "Quality check & packaging", assigneeId: "U008", status: "pending", priority: "medium", dueDate: "2026-02-10", createdAt: "2025-12-26" },
  // O002 tasks (3)
  { id: "T005", orderId: "O002", title: "Design validation — wardrobe specs", assigneeId: "U005", status: "completed", priority: "high", dueDate: "2025-12-28", createdAt: "2025-12-23" },
  { id: "T006", orderId: "O002", title: "Material procurement — laminate sheets", assigneeId: "U007", status: "in_progress", priority: "medium", dueDate: "2026-01-20", createdAt: "2025-12-29" },
  { id: "T007", orderId: "O002", title: "Production — wardrobe & kitchen shutters", assigneeId: "U008", status: "pending", priority: "high", dueDate: "2026-02-15", createdAt: "2025-12-29" },
  // O003 tasks (3)
  { id: "T008", orderId: "O003", title: "Material procurement — commercial grade", assigneeId: "U007", status: "completed", priority: "urgent", dueDate: "2026-01-10", createdAt: "2026-01-06" },
  { id: "T009", orderId: "O003", title: "Bulk production — partition panels", assigneeId: "U007", status: "completed", priority: "urgent", dueDate: "2026-02-01", createdAt: "2026-01-11" },
  { id: "T010", orderId: "O003", title: "Dispatch & logistics coordination", assigneeId: "U008", status: "in_progress", priority: "high", dueDate: "2026-02-20", createdAt: "2026-02-02" },
  // O004 tasks (2)
  { id: "T011", orderId: "O004", title: "Measurement verification", assigneeId: "U004", status: "pending", priority: "medium", dueDate: "2026-02-01", createdAt: "2026-01-21" },
  { id: "T012", orderId: "O004", title: "Design approval from client", assigneeId: "U006", status: "pending", priority: "low", dueDate: "2026-02-10", createdAt: "2026-01-21" },
];

// ---------- 4 Payments ----------
export interface Payment {
  id: string;
  orderId: string;
  accountId: string;
  amount: number;
  status: PaymentStatus;
  method: "bank_transfer" | "cheque" | "upi" | "cash";
  paidAt?: string;
  dueDate: string;
  createdAt: string;
}

export const payments: Payment[] = [
  { id: "P001", orderId: "O001", accountId: "A001", amount: 122500, status: "completed", method: "bank_transfer", paidAt: "2025-12-20", dueDate: "2025-12-20", createdAt: "2025-12-15" },
  { id: "P002", orderId: "O002", accountId: "A002", amount: 190000, status: "completed", method: "upi", paidAt: "2025-12-28", dueDate: "2025-12-28", createdAt: "2025-12-22" },
  { id: "P003", orderId: "O003", accountId: "A003", amount: 175000, status: "partial", method: "cheque", paidAt: "2026-01-10", dueDate: "2026-01-10", createdAt: "2026-01-05" },
  { id: "P004", orderId: "O004", accountId: "A004", amount: 57000, status: "pending", method: "bank_transfer", dueDate: "2026-02-15", createdAt: "2026-01-20" },
];

// ---------- Products (for public catalog) ----------
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  priceRange: string;
}

export const products: Product[] = [
  { id: "PR01", name: "Kitchen Handleless Shutters", category: "Kitchen", description: "Sleek, modern handleless shutters for modular kitchens", priceRange: "₹15,000 - ₹25,000 per unit" },
  { id: "PR02", name: "Wardrobe Handleless Shutters", category: "Bedroom", description: "Premium handleless wardrobe doors with soft-close mechanism", priceRange: "₹18,000 - ₹30,000 per unit" },
  { id: "PR03", name: "Office Partition Shutters", category: "Commercial", description: "Durable partition panels for commercial spaces", priceRange: "₹12,000 - ₹20,000 per unit" },
  { id: "PR04", name: "Bathroom Vanity Shutters", category: "Bathroom", description: "Moisture-resistant handleless shutters for bathroom vanities", priceRange: "₹10,000 - ₹18,000 per unit" },
];

// ---------- Helper: lookup functions ----------
export const getUserById = (id: string) => users.find((u) => u.id === id);
export const getAccountById = (id: string) => accounts.find((a) => a.id === id);
export const getLeadById = (id: string) => leads.find((l) => l.id === id);
export const getOrderById = (id: string) => orders.find((o) => o.id === id);
export const getQuotationById = (id: string) => quotations.find((q) => q.id === id);
export const getTasksByOrderId = (orderId: string) => tasks.filter((t) => t.orderId === orderId);
export const getPaymentsByOrderId = (orderId: string) => payments.filter((p) => p.orderId === orderId);
export const getOrdersByAccountId = (accountId: string) => orders.filter((o) => o.accountId === accountId);
export const getSalespersonById = (id: string) => salespersons.find((s) => s.id === id);
