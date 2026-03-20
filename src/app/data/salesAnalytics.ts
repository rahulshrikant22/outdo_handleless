// ============================================================
// OutDo Sales Analytics — Phase 7 Data Layer
// Correlated: CRM Leads → Accounts → Orders → Quotations → Converted Orders
// All metrics derived from real data in crm.ts, orders.ts, operations.ts
// ============================================================

import { crmSalespeople, type CRMSalesperson } from "./crm";
import {
  projectOrders, projectQuotations,
  type ProjectOrder, type ProjectQuotation, type QuotationOutcome,
} from "./orders";
import { convertedOrders } from "./operations";

// ---------- Formatters ----------
export const inr = (v: number) => `₹${v.toLocaleString("en-IN")}`;
export const pct = (v: number) => `${v}%`;

// ---------- Core KPI ----------
export function getSalesKPIs() {
  const totalOrders = projectOrders.length;
  const totalQuotations = projectQuotations.length;
  const totalQuotationValue = projectQuotations.reduce((s, q) => s + q.quotationAmount, 0);
  const totalConvertedOrders = convertedOrders.length;
  const totalConvertedValue = convertedOrders.reduce((s, co) => s + co.quotationAmount, 0);

  // By outcome
  const wonQuotations = projectQuotations.filter(q => q.outcome === "won");
  const lostQuotations = projectQuotations.filter(q => q.outcome === "lost");
  const holdQuotations = projectQuotations.filter(q => q.outcome === "hold");
  const openQuotations = projectQuotations.filter(q => q.outcome === "open");
  const underDiscussionQuotations = projectQuotations.filter(q => q.outcome === "under_discussion");
  const negotiationQuotations = projectQuotations.filter(q => q.outcome === "negotiation");

  const wonValue = wonQuotations.reduce((s, q) => s + q.quotationAmount, 0);
  const lostValue = lostQuotations.reduce((s, q) => s + q.quotationAmount, 0);
  const holdValue = holdQuotations.reduce((s, q) => s + q.quotationAmount, 0);
  const openValue = openQuotations.reduce((s, q) => s + q.quotationAmount, 0);
  const underDiscussionValue = underDiscussionQuotations.reduce((s, q) => s + q.quotationAmount, 0);
  const negotiationValue = negotiationQuotations.reduce((s, q) => s + q.quotationAmount, 0);
  const pipelineValue = openValue + underDiscussionValue + negotiationValue;

  // Collection
  const totalReceived = projectQuotations.reduce((s, q) => s + q.receivedAmount, 0);
  const totalBalance = projectQuotations.reduce((s, q) => s + q.balanceAmount, 0);
  const collectionRate = totalConvertedValue > 0 ? Math.round((totalReceived / totalConvertedValue) * 100) : 0;

  // Win rate
  const decidedQuotations = wonQuotations.length + lostQuotations.length;
  const winRate = decidedQuotations > 0 ? Math.round((wonQuotations.length / decidedQuotations) * 100) : 0;

  // Conversion rate (orders → converted)
  const conversionRate = totalOrders > 0 ? Math.round((totalConvertedOrders / totalOrders) * 100) : 0;

  return {
    totalOrders, totalQuotations, totalQuotationValue,
    totalConvertedOrders, totalConvertedValue,
    wonValue, lostValue, holdValue,
    openValue, underDiscussionValue, negotiationValue, pipelineValue,
    totalReceived, totalBalance, collectionRate,
    winRate, conversionRate,
    wonCount: wonQuotations.length,
    lostCount: lostQuotations.length,
    holdCount: holdQuotations.length,
    openCount: openQuotations.length,
    underDiscussionCount: underDiscussionQuotations.length,
    negotiationCount: negotiationQuotations.length,
  };
}

// ---------- Orders vs Converted comparison ----------
export function getOrdersVsConverted() {
  return projectOrders.map(o => {
    const co = convertedOrders.find(c => c.orderId === o.id);
    return {
      orderId: o.id,
      projectName: o.projectName,
      accountName: o.accountName,
      city: o.city,
      salesperson: o.salespersonName,
      quotationValue: o.totalQuotationValue,
      quotationStatus: o.quotationStatus,
      isConverted: !!co,
      convertedOrderId: co?.id || null,
      productionStatus: co?.productionStatus || null,
      dispatchStatus: co?.dispatchStatus || null,
      receivedAmount: co?.receivedAmount || o.receivedAmount,
    };
  });
}

// ---------- Quotation outcome distribution (for pie/bar) ----------
export function getOutcomeDistribution() {
  const outcomes: QuotationOutcome[] = ["won", "under_discussion", "open", "negotiation", "hold", "lost"];
  const colors: Record<string, string> = {
    won: "#10B981", under_discussion: "#F59E0B", open: "#3B82F6",
    negotiation: "#F97316", hold: "#8B5CF6", lost: "#EF4444",
  };
  const labels: Record<string, string> = {
    won: "Won", under_discussion: "Under Discussion", open: "Open",
    negotiation: "Negotiation", hold: "Hold", lost: "Lost",
  };

  return outcomes.map(o => ({
    outcome: o,
    label: labels[o],
    color: colors[o],
    count: projectQuotations.filter(q => q.outcome === o).length,
    value: projectQuotations.filter(q => q.outcome === o).reduce((s, q) => s + q.quotationAmount, 0),
  })).filter(d => d.count > 0);
}

// ---------- Salesperson Performance ----------
export interface SalespersonPerf {
  id: string;
  name: string;
  city: string;
  territory: string;
  zone: string;
  leadsAssigned: number;
  accountsConverted: number;
  totalOrders: number;
  totalQuotationValue: number;
  wonOrders: number;
  wonValue: number;
  lostOrders: number;
  lostValue: number;
  pipelineOrders: number;
  pipelineValue: number;
  receivedAmount: number;
  winRate: number;
  avgDealSize: number;
  orders: ProjectOrder[];
  quotations: ProjectQuotation[];
}

export function getSalespersonPerformance(): SalespersonPerf[] {
  return crmSalespeople.map(sp => {
    const orders = projectOrders.filter(o => o.salespersonId === sp.id);
    const quotations = projectQuotations.filter(q => orders.some(o => o.quotationId === q.id));
    const wonQ = quotations.filter(q => q.outcome === "won");
    const lostQ = quotations.filter(q => q.outcome === "lost");
    const pipelineQ = quotations.filter(q => ["open", "under_discussion", "negotiation"].includes(q.outcome));
    const decided = wonQ.length + lostQ.length;

    return {
      id: sp.id,
      name: sp.name,
      city: sp.city,
      territory: sp.territory,
      zone: sp.zone,
      leadsAssigned: sp.leadsAssigned,
      accountsConverted: sp.accountsConverted,
      totalOrders: orders.length,
      totalQuotationValue: quotations.reduce((s, q) => s + q.quotationAmount, 0),
      wonOrders: wonQ.length,
      wonValue: wonQ.reduce((s, q) => s + q.quotationAmount, 0),
      lostOrders: lostQ.length,
      lostValue: lostQ.reduce((s, q) => s + q.quotationAmount, 0),
      pipelineOrders: pipelineQ.length,
      pipelineValue: pipelineQ.reduce((s, q) => s + q.quotationAmount, 0),
      receivedAmount: wonQ.reduce((s, q) => s + q.receivedAmount, 0),
      winRate: decided > 0 ? Math.round((wonQ.length / decided) * 100) : 0,
      avgDealSize: wonQ.length > 0 ? Math.round(wonQ.reduce((s, q) => s + q.quotationAmount, 0) / wonQ.length) : 0,
      orders,
      quotations,
    };
  });
}

// ---------- City/Territory Performance ----------
export interface CityPerf {
  city: string;
  state: string;
  zone: string;
  territory: string;
  totalOrders: number;
  totalValue: number;
  wonOrders: number;
  wonValue: number;
  lostOrders: number;
  pipelineValue: number;
  accounts: number;
}

export function getCityPerformance(): CityPerf[] {
  const cities = [...new Set(projectOrders.map(o => o.city))];
  return cities.map(city => {
    const orders = projectOrders.filter(o => o.city === city);
    const quotations = orders.map(o => projectQuotations.find(q => q.orderId === o.id)).filter(Boolean) as ProjectQuotation[];
    const won = quotations.filter(q => q.outcome === "won");
    const lost = quotations.filter(q => q.outcome === "lost");
    const pipeline = quotations.filter(q => ["open", "under_discussion", "negotiation"].includes(q.outcome));
    const sample = orders[0];
    const accountIds = [...new Set(orders.map(o => o.accountId))];

    return {
      city,
      state: sample?.state || "",
      zone: sample?.zone || "",
      territory: sample?.territory || "",
      totalOrders: orders.length,
      totalValue: quotations.reduce((s, q) => s + q.quotationAmount, 0),
      wonOrders: won.length,
      wonValue: won.reduce((s, q) => s + q.quotationAmount, 0),
      lostOrders: lost.length,
      pipelineValue: pipeline.reduce((s, q) => s + q.quotationAmount, 0),
      accounts: accountIds.length,
    };
  }).sort((a, b) => b.totalValue - a.totalValue);
}

// ---------- Account Performance ----------
export interface AccountPerf {
  accountId: string;
  accountName: string;
  accountType: string;
  city: string;
  zone: string;
  totalOrders: number;
  totalValue: number;
  wonOrders: number;
  wonValue: number;
  receivedAmount: number;
  balanceAmount: number;
  quotations: ProjectQuotation[];
}

export function getAccountPerformance(): AccountPerf[] {
  const accountIds = [...new Set(projectOrders.map(o => o.accountId))];
  return accountIds.map(accId => {
    const orders = projectOrders.filter(o => o.accountId === accId);
    const quotations = orders.map(o => projectQuotations.find(q => q.orderId === o.id)).filter(Boolean) as ProjectQuotation[];
    const won = quotations.filter(q => q.outcome === "won");
    const sample = orders[0];

    return {
      accountId: accId,
      accountName: sample?.accountName || "",
      accountType: sample?.accountType || "",
      city: sample?.city || "",
      zone: sample?.zone || "",
      totalOrders: orders.length,
      totalValue: quotations.reduce((s, q) => s + q.quotationAmount, 0),
      wonOrders: won.length,
      wonValue: won.reduce((s, q) => s + q.quotationAmount, 0),
      receivedAmount: quotations.reduce((s, q) => s + q.receivedAmount, 0),
      balanceAmount: quotations.reduce((s, q) => s + q.balanceAmount, 0),
      quotations,
    };
  }).sort((a, b) => b.totalValue - a.totalValue);
}

// ---------- Source & Category Performance ----------
export function getSourcePerformance() {
  const sources = [...new Set(projectOrders.map(o => o.businessSource))];
  return sources.map(src => {
    const orders = projectOrders.filter(o => o.businessSource === src);
    const quotations = orders.map(o => projectQuotations.find(q => q.orderId === o.id)).filter(Boolean) as ProjectQuotation[];
    const won = quotations.filter(q => q.outcome === "won");
    return {
      source: src.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      sourceKey: src,
      orders: orders.length,
      value: quotations.reduce((s, q) => s + q.quotationAmount, 0),
      wonOrders: won.length,
      wonValue: won.reduce((s, q) => s + q.quotationAmount, 0),
      winRate: (won.length + quotations.filter(q => q.outcome === "lost").length) > 0
        ? Math.round((won.length / (won.length + quotations.filter(q => q.outcome === "lost").length)) * 100)
        : 0,
    };
  }).sort((a, b) => b.value - a.value);
}

export function getCategoryPerformance() {
  const categories = [...new Set(projectOrders.map(o => o.projectCategory))];
  return categories.map(cat => {
    const orders = projectOrders.filter(o => o.projectCategory === cat);
    const quotations = orders.map(o => projectQuotations.find(q => q.orderId === o.id)).filter(Boolean) as ProjectQuotation[];
    const won = quotations.filter(q => q.outcome === "won");
    return {
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      categoryKey: cat,
      orders: orders.length,
      value: quotations.reduce((s, q) => s + q.quotationAmount, 0),
      wonOrders: won.length,
      wonValue: won.reduce((s, q) => s + q.quotationAmount, 0),
    };
  }).sort((a, b) => b.value - a.value);
}

// ---------- Channel Performance (orderSource) ----------
export function getChannelPerformance() {
  const channels = [...new Set(projectOrders.map(o => o.orderSource))];
  return channels.map(ch => {
    const orders = projectOrders.filter(o => o.orderSource === ch);
    const quotations = orders.map(o => projectQuotations.find(q => q.orderId === o.id)).filter(Boolean) as ProjectQuotation[];
    const won = quotations.filter(q => q.outcome === "won");
    return {
      channel: ch.charAt(0).toUpperCase() + ch.slice(1),
      channelKey: ch,
      orders: orders.length,
      value: quotations.reduce((s, q) => s + q.quotationAmount, 0),
      wonOrders: won.length,
      wonValue: won.reduce((s, q) => s + q.quotationAmount, 0),
    };
  }).sort((a, b) => b.value - a.value);
}

// ---------- Win/Loss detail ----------
export function getWinLossDetail() {
  const won = projectQuotations.filter(q => q.outcome === "won").map(q => {
    const order = projectOrders.find(o => o.quotationId === q.id);
    return { ...q, order };
  });
  const lost = projectQuotations.filter(q => q.outcome === "lost").map(q => {
    const order = projectOrders.find(o => o.quotationId === q.id);
    return { ...q, order };
  });
  const hold = projectQuotations.filter(q => q.outcome === "hold").map(q => {
    const order = projectOrders.find(o => o.quotationId === q.id);
    return { ...q, order };
  });

  return { won, lost, hold };
}

// ---------- Alerts & Rankings ----------
export function getSalesAlerts() {
  const alerts: { id: string; type: "warning" | "danger" | "info" | "success"; title: string; message: string; link?: string }[] = [];

  // Overdue payments
  const overduePayments = projectQuotations.filter(q => q.outcome === "won" && q.balanceAmount > 0);
  overduePayments.forEach(q => {
    const order = projectOrders.find(o => o.quotationId === q.id);
    if (order && new Date(order.expectedClosureDate) <= new Date("2026-03-17")) {
      alerts.push({
        id: `alert-pay-${q.id}`,
        type: "danger",
        title: `Payment overdue: ${q.projectName}`,
        message: `Balance ₹${q.balanceAmount.toLocaleString("en-IN")} pending. Expected closure: ${order.expectedClosureDate}`,
        link: `/admin/orders/${order.id}`,
      });
    }
  });

  // Stale pipeline
  const staleQuotations = projectQuotations.filter(q =>
    ["open", "under_discussion"].includes(q.outcome) &&
    (new Date("2026-03-17").getTime() - new Date(q.createdAt).getTime()) > 45 * 24 * 60 * 60 * 1000
  );
  staleQuotations.forEach(q => {
    const order = projectOrders.find(o => o.quotationId === q.id);
    const age = Math.floor((new Date("2026-03-17").getTime() - new Date(q.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    alerts.push({
      id: `alert-stale-${q.id}`,
      type: "warning",
      title: `Stale quotation: ${q.projectName}`,
      message: `${q.outcome.replace(/_/g, " ")} for ${age} days. Value: ₹${q.quotationAmount.toLocaleString("en-IN")}`,
      link: order ? `/admin/orders/${order.id}` : undefined,
    });
  });

  // Lost deals
  const recentLost = projectQuotations.filter(q => q.outcome === "lost");
  recentLost.forEach(q => {
    alerts.push({
      id: `alert-lost-${q.id}`,
      type: "info",
      title: `Lost: ${q.projectName}`,
      message: `Value: ₹${q.quotationAmount.toLocaleString("en-IN")}. Reason: ${q.lostReason || "Not specified"}`,
      link: `/admin/orders/quotation/${q.id}`,
    });
  });

  // Won celebrations
  const recentWon = projectQuotations.filter(q => q.outcome === "won");
  recentWon.forEach(q => {
    alerts.push({
      id: `alert-won-${q.id}`,
      type: "success",
      title: `Won: ${q.projectName}`,
      message: `Value: ₹${q.quotationAmount.toLocaleString("en-IN")}. Converted to production.`,
      link: `/admin/orders/quotation/${q.id}`,
    });
  });

  return alerts;
}

// ---------- Rankings ----------
export function getSalesRankings() {
  const spPerf = getSalespersonPerformance();

  const byRevenue = [...spPerf].sort((a, b) => b.wonValue - a.wonValue);
  const byWinRate = [...spPerf].filter(s => s.totalOrders > 0).sort((a, b) => b.winRate - a.winRate);
  const byPipeline = [...spPerf].sort((a, b) => b.pipelineValue - a.pipelineValue);
  const byDeals = [...spPerf].sort((a, b) => b.wonOrders - a.wonOrders);

  return { byRevenue, byWinRate, byPipeline, byDeals };
}

// ---------- Monthly trend (simulated from order dates) ----------
export function getMonthlyTrend() {
  const months = [
    { month: "Dec 2025", key: "2025-12" },
    { month: "Jan 2026", key: "2026-01" },
    { month: "Feb 2026", key: "2026-02" },
    { month: "Mar 2026", key: "2026-03" },
  ];

  return months.map(m => {
    const monthOrders = projectOrders.filter(o => o.createdAt.startsWith(m.key));
    const monthWon = projectQuotations.filter(q => q.outcome === "won" && q.wonAt && q.wonAt.startsWith(m.key));
    const monthLost = projectQuotations.filter(q => q.outcome === "lost" && q.lostAt && q.lostAt.startsWith(m.key));

    return {
      month: m.month,
      newOrders: monthOrders.length,
      orderValue: monthOrders.reduce((s, o) => s + o.totalQuotationValue, 0),
      wonCount: monthWon.length,
      wonValue: monthWon.reduce((s, q) => s + q.quotationAmount, 0),
      lostCount: monthLost.length,
      lostValue: monthLost.reduce((s, q) => s + q.quotationAmount, 0),
    };
  });
}