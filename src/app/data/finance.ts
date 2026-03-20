// ============================================================
// OutDo Finance Module — Phase 8 Data Layer
// Correlated: Quotations → Converted Orders → Payments → Finance Records
// ============================================================

import { projectOrders, projectQuotations, type ProjectOrder, type ProjectQuotation } from "./orders";
import { convertedOrders, type ConvertedOrder, type OpsPaymentEntry } from "./operations";

// ---------- Types ----------
export type FinancePaymentStage = "advance" | "progress" | "pre_dispatch" | "on_delivery" | "final" | "retention";
export type AgingBucket = "current" | "1_30" | "31_60" | "61_90" | "90_plus";
export type CollectionHealth = "on_track" | "at_risk" | "overdue" | "critical";

// ---------- Finance Record (one per converted order) ----------
export interface FinanceRecord {
  id: string;
  convertedOrderId: string;
  orderId: string;
  quotationId: string;
  projectName: string;
  accountId: string;
  accountName: string;
  accountType: "dealer" | "factory" | "architect";
  city: string;
  zone: string;
  salespersonName: string;
  quotationAmount: number;
  receivedAmount: number;
  balanceAmount: number;
  advancePercent: number;
  advanceExpected: number;
  advanceReceived: number;
  advancePending: number;
  finalExpected: number;
  finalReceived: number;
  finalPending: number;
  paymentStatus: "not_started" | "advance_received" | "partial" | "full" | "overdue";
  collectionHealth: CollectionHealth;
  agingBucket: AgingBucket;
  agingDays: number;
  dueDate: string;
  lastPaymentDate: string | null;
  nextMilestonePayment: string;
  nextMilestoneAmount: number;
  payments: FinancePayment[];
  milestoneSchedule: PaymentMilestone[];
  convertedAt: string;
  dispatchStatus: string;
  productionStatus: string;
}

export interface FinancePayment {
  id: string;
  amount: number;
  method: "bank_transfer" | "cheque" | "upi" | "cash";
  date: string;
  reference: string;
  receivedBy: string;
  stage: FinancePaymentStage;
  notes: string;
  proofUploaded: boolean;
  proofFileName?: string;
}

export interface PaymentMilestone {
  id: string;
  stage: FinancePaymentStage;
  label: string;
  percentage: number;
  expectedAmount: number;
  receivedAmount: number;
  status: "completed" | "partial" | "pending" | "overdue";
  dueDate: string;
  paidDate?: string;
}

// ---------- Build Finance Records from Converted Orders ----------
export const financeRecords: FinanceRecord[] = [
  // FR-001: Mehta Premium Kitchen (CO-001)
  // Quotation: ₹1,04,800 | Received: ₹52,400 | Balance: ₹52,400
  {
    id: "FR-001",
    convertedOrderId: "CO-001",
    orderId: "ORD-001",
    quotationId: "QTN-001",
    projectName: "Mehta Premium Kitchen",
    accountId: "A001",
    accountName: "Mehta Interiors",
    accountType: "dealer",
    city: "Mumbai",
    zone: "West",
    salespersonName: "Rajesh Kumar",
    quotationAmount: 104800,
    receivedAmount: 52400,
    balanceAmount: 52400,
    advancePercent: 50,
    advanceExpected: 52400,
    advanceReceived: 52400,
    advancePending: 0,
    finalExpected: 52400,
    finalReceived: 0,
    finalPending: 52400,
    paymentStatus: "partial",
    collectionHealth: "on_track",
    agingBucket: "current",
    agingDays: 0,
    dueDate: "2026-04-05",
    lastPaymentDate: "2026-02-15",
    nextMilestonePayment: "Pre-dispatch payment",
    nextMilestoneAmount: 31440,
    payments: [
      {
        id: "FPAY-001", amount: 31440, method: "bank_transfer", date: "2026-01-10",
        reference: "NEFT/2026/0110/001", receivedBy: "Pooja Verma",
        stage: "advance", notes: "30% advance payment", proofUploaded: true, proofFileName: "NEFT_receipt_0110.pdf",
      },
      {
        id: "FPAY-002", amount: 20960, method: "upi", date: "2026-02-15",
        reference: "UPI/2026/0215/042", receivedBy: "Pooja Verma",
        stage: "progress", notes: "20% progress payment after cutlist approval", proofUploaded: true, proofFileName: "UPI_screenshot_0215.png",
      },
    ],
    milestoneSchedule: [
      { id: "FMS-001", stage: "advance", label: "Advance (30%)", percentage: 30, expectedAmount: 31440, receivedAmount: 31440, status: "completed", dueDate: "2026-01-10", paidDate: "2026-01-10" },
      { id: "FMS-002", stage: "progress", label: "Progress (20%)", percentage: 20, expectedAmount: 20960, receivedAmount: 20960, status: "completed", dueDate: "2026-02-15", paidDate: "2026-02-15" },
      { id: "FMS-003", stage: "pre_dispatch", label: "Pre-dispatch (30%)", percentage: 30, expectedAmount: 31440, receivedAmount: 0, status: "pending", dueDate: "2026-03-28" },
      { id: "FMS-004", stage: "final", label: "Final (20%)", percentage: 20, expectedAmount: 20960, receivedAmount: 0, status: "pending", dueDate: "2026-04-05" },
    ],
    convertedAt: "2026-01-05",
    dispatchStatus: "not_ready",
    productionStatus: "assembly",
  },

  // FR-002: Nair Villa Complete Interiors (CO-002)
  // Quotation: ₹2,78,000 | Received: ₹1,39,000 | Balance: ₹1,39,000
  {
    id: "FR-002",
    convertedOrderId: "CO-002",
    orderId: "ORD-002",
    quotationId: "QTN-002",
    projectName: "Nair Villa Complete Interiors",
    accountId: "A002",
    accountName: "Nair Designs",
    accountType: "architect",
    city: "Bangalore",
    zone: "South",
    salespersonName: "Sneha Reddy",
    quotationAmount: 278000,
    receivedAmount: 139000,
    balanceAmount: 139000,
    advancePercent: 50,
    advanceExpected: 139000,
    advanceReceived: 139000,
    advancePending: 0,
    finalExpected: 139000,
    finalReceived: 0,
    finalPending: 139000,
    paymentStatus: "advance_received",
    collectionHealth: "at_risk",
    agingBucket: "1_30",
    agingDays: 15,
    dueDate: "2026-04-15",
    lastPaymentDate: "2026-02-01",
    nextMilestonePayment: "Production start payment",
    nextMilestoneAmount: 55600,
    payments: [
      {
        id: "FPAY-003", amount: 83400, method: "bank_transfer", date: "2026-01-12",
        reference: "NEFT/2026/0112/003", receivedBy: "Sanjay Gupta",
        stage: "advance", notes: "30% advance", proofUploaded: true, proofFileName: "NEFT_receipt_0112.pdf",
      },
      {
        id: "FPAY-004", amount: 55600, method: "cheque", date: "2026-02-01",
        reference: "CHQ/2026/44782", receivedBy: "Sanjay Gupta",
        stage: "progress", notes: "20% progress payment", proofUploaded: false,
      },
    ],
    milestoneSchedule: [
      { id: "FMS-005", stage: "advance", label: "Advance (30%)", percentage: 30, expectedAmount: 83400, receivedAmount: 83400, status: "completed", dueDate: "2026-01-12", paidDate: "2026-01-12" },
      { id: "FMS-006", stage: "progress", label: "Progress (20%)", percentage: 20, expectedAmount: 55600, receivedAmount: 55600, status: "completed", dueDate: "2026-02-01", paidDate: "2026-02-01" },
      { id: "FMS-007", stage: "pre_dispatch", label: "Pre-dispatch (20%)", percentage: 20, expectedAmount: 55600, receivedAmount: 0, status: "pending", dueDate: "2026-03-30" },
      { id: "FMS-008", stage: "on_delivery", label: "On Delivery (20%)", percentage: 20, expectedAmount: 55600, receivedAmount: 0, status: "pending", dueDate: "2026-04-10" },
      { id: "FMS-009", stage: "retention", label: "Retention (10%)", percentage: 10, expectedAmount: 27800, receivedAmount: 0, status: "pending", dueDate: "2026-04-15" },
    ],
    convertedAt: "2026-01-05",
    dispatchStatus: "not_ready",
    productionStatus: "cutlist_pending",
  },

  // FR-003: Sheikh Office Partitions (CO-003)
  // Quotation: ₹3,52,400 | Received: ₹2,46,680 | Balance: ₹1,05,720
  {
    id: "FR-003",
    convertedOrderId: "CO-003",
    orderId: "ORD-003",
    quotationId: "QTN-003",
    projectName: "Sheikh Office Partitions",
    accountId: "A003",
    accountName: "Sheikh Constructions",
    accountType: "dealer",
    city: "Delhi",
    zone: "North",
    salespersonName: "Priya Sharma",
    quotationAmount: 352400,
    receivedAmount: 246680,
    balanceAmount: 105720,
    advancePercent: 70,
    advanceExpected: 246680,
    advanceReceived: 246680,
    advancePending: 0,
    finalExpected: 105720,
    finalReceived: 0,
    finalPending: 105720,
    paymentStatus: "partial",
    collectionHealth: "overdue",
    agingBucket: "31_60",
    agingDays: 12,
    dueDate: "2026-03-25",
    lastPaymentDate: "2026-03-01",
    nextMilestonePayment: "Final balance payment",
    nextMilestoneAmount: 105720,
    payments: [
      {
        id: "FPAY-005", amount: 105720, method: "bank_transfer", date: "2026-01-20",
        reference: "NEFT/2026/0120/005", receivedBy: "Sanjay Gupta",
        stage: "advance", notes: "30% advance", proofUploaded: true, proofFileName: "NEFT_receipt_0120.pdf",
      },
      {
        id: "FPAY-006", amount: 70480, method: "cheque", date: "2026-02-10",
        reference: "CHQ/2026/55891", receivedBy: "Sanjay Gupta",
        stage: "progress", notes: "20% progress payment", proofUploaded: true, proofFileName: "Cheque_scan_55891.pdf",
      },
      {
        id: "FPAY-007", amount: 70480, method: "bank_transfer", date: "2026-03-01",
        reference: "NEFT/2026/0301/008", receivedBy: "Sanjay Gupta",
        stage: "pre_dispatch", notes: "Pre-dispatch payment", proofUploaded: true, proofFileName: "NEFT_receipt_0301.pdf",
      },
    ],
    milestoneSchedule: [
      { id: "FMS-010", stage: "advance", label: "Advance (30%)", percentage: 30, expectedAmount: 105720, receivedAmount: 105720, status: "completed", dueDate: "2026-01-20", paidDate: "2026-01-20" },
      { id: "FMS-011", stage: "progress", label: "Progress (20%)", percentage: 20, expectedAmount: 70480, receivedAmount: 70480, status: "completed", dueDate: "2026-02-10", paidDate: "2026-02-10" },
      { id: "FMS-012", stage: "pre_dispatch", label: "Pre-dispatch (20%)", percentage: 20, expectedAmount: 70480, receivedAmount: 70480, status: "completed", dueDate: "2026-03-01", paidDate: "2026-03-01" },
      { id: "FMS-013", stage: "final", label: "Final Balance (30%)", percentage: 30, expectedAmount: 105720, receivedAmount: 0, status: "overdue", dueDate: "2026-03-25" },
    ],
    convertedAt: "2026-01-15",
    dispatchStatus: "dispatched",
    productionStatus: "production_ready",
  },
];

// ---------- Aggregation Functions ----------
export function inr(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export function getFinanceKPIs() {
  const totalQuotationAmount = financeRecords.reduce((s, r) => s + r.quotationAmount, 0);
  const totalReceivedAmount = financeRecords.reduce((s, r) => s + r.receivedAmount, 0);
  const totalBalanceAmount = financeRecords.reduce((s, r) => s + r.balanceAmount, 0);
  const totalConvertedOrderAmount = totalQuotationAmount; // same for converted orders

  const pendingAccounts = financeRecords.filter(r => r.balanceAmount > 0).length;
  const overdueReceivables = financeRecords
    .filter(r => r.collectionHealth === "overdue" || r.collectionHealth === "critical")
    .reduce((s, r) => s + r.balanceAmount, 0);

  const advancePending = financeRecords.reduce((s, r) => s + r.advancePending, 0);
  const finalPending = financeRecords.reduce((s, r) => s + r.finalPending, 0);

  const collectionRate = totalQuotationAmount > 0
    ? Math.round((totalReceivedAmount / totalQuotationAmount) * 100)
    : 0;

  return {
    totalQuotationAmount,
    totalConvertedOrderAmount,
    totalReceivedAmount,
    totalBalanceAmount,
    pendingAccounts,
    overdueReceivables,
    advancePending,
    finalPending,
    collectionRate,
  };
}

export function getPaymentAging() {
  const buckets: { label: string; key: AgingBucket; count: number; amount: number }[] = [
    { label: "Current", key: "current", count: 0, amount: 0 },
    { label: "1-30 Days", key: "1_30", count: 0, amount: 0 },
    { label: "31-60 Days", key: "31_60", count: 0, amount: 0 },
    { label: "61-90 Days", key: "61_90", count: 0, amount: 0 },
    { label: "90+ Days", key: "90_plus", count: 0, amount: 0 },
  ];

  financeRecords.forEach(r => {
    if (r.balanceAmount > 0) {
      const bucket = buckets.find(b => b.key === r.agingBucket);
      if (bucket) {
        bucket.count++;
        bucket.amount += r.balanceAmount;
      }
    }
  });

  return buckets;
}

export function getOutstandingRanking() {
  return [...financeRecords]
    .filter(r => r.balanceAmount > 0)
    .sort((a, b) => b.balanceAmount - a.balanceAmount);
}

export function getTopBillingAccounts() {
  return [...financeRecords]
    .sort((a, b) => b.quotationAmount - a.quotationAmount);
}

export function getCollectionMonitoring() {
  const healthCounts = {
    on_track: financeRecords.filter(r => r.collectionHealth === "on_track").length,
    at_risk: financeRecords.filter(r => r.collectionHealth === "at_risk").length,
    overdue: financeRecords.filter(r => r.collectionHealth === "overdue").length,
    critical: financeRecords.filter(r => r.collectionHealth === "critical").length,
  };

  return healthCounts;
}

export function getAllPayments(): (FinancePayment & { financeRecordId: string; projectName: string; accountName: string })[] {
  return financeRecords.flatMap(r =>
    r.payments.map(p => ({
      ...p,
      financeRecordId: r.id,
      projectName: r.projectName,
      accountName: r.accountName,
    }))
  ).sort((a, b) => b.date.localeCompare(a.date));
}

export function getMonthlyCollectionTrend() {
  const months: { name: string; month: string; received: number; expected: number }[] = [
    { name: "jan", month: "Jan 2026", received: 0, expected: 0 },
    { name: "feb", month: "Feb 2026", received: 0, expected: 0 },
    { name: "mar", month: "Mar 2026", received: 0, expected: 0 },
    { name: "apr", month: "Apr 2026", received: 0, expected: 0 },
  ];

  const allPayments = financeRecords.flatMap(r => r.payments);
  allPayments.forEach(p => {
    const m = new Date(p.date).getMonth();
    if (m === 0) months[0].received += p.amount;
    else if (m === 1) months[1].received += p.amount;
    else if (m === 2) months[2].received += p.amount;
    else if (m === 3) months[3].received += p.amount;
  });

  // Expected from milestones
  const allMilestones = financeRecords.flatMap(r => r.milestoneSchedule);
  allMilestones.forEach(ms => {
    const m = new Date(ms.dueDate).getMonth();
    if (m === 0) months[0].expected += ms.expectedAmount;
    else if (m === 1) months[1].expected += ms.expectedAmount;
    else if (m === 2) months[2].expected += ms.expectedAmount;
    else if (m === 3) months[3].expected += ms.expectedAmount;
  });

  return months;
}

export const getFinanceRecordById = (id: string) => financeRecords.find(r => r.id === id);

export const collectionHealthLabels: Record<CollectionHealth, string> = {
  on_track: "On Track",
  at_risk: "At Risk",
  overdue: "Overdue",
  critical: "Critical",
};

export const stageLabels: Record<FinancePaymentStage, string> = {
  advance: "Advance",
  progress: "Progress",
  pre_dispatch: "Pre-Dispatch",
  on_delivery: "On Delivery",
  final: "Final",
  retention: "Retention",
};