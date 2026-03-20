import { useState } from "react";
import { PageShell } from "../layout/PageShell";
import { StatCard } from "../layout/StatCard";
import {
  StatusBadge, FilterBar, DataTable, Pagination, Button, Drawer,
  DetailField, TabBar, SummaryCard
} from "../shared";
import {
  convertedOrders, productionStatusLabels, dispatchStatusLabels,
  type ConvertedOrder, type ProductionStatus, type DispatchStatus,
} from "../../data/operations";
import {
  Package, Factory, Truck, DollarSign, CheckCircle2, Clock,
  Download, ArrowRight, CreditCard, MapPin, Calendar, Users
} from "lucide-react";

import { handleExport } from "../shared/GlobalModals";

// ---- Simplified status mapping for partner view ----
type SimpleStatus = "design_in_progress" | "production_in_progress" | "ready_for_dispatch" | "dispatched";

function getSimpleProductionStatus(ps: ProductionStatus, ds: DispatchStatus): SimpleStatus {
  if (["dispatched", "in_transit", "delivered"].includes(ds)) return "dispatched";
  if (["production_ready", "packaging", "ready_to_dispatch"].includes(ds) || ps === "production_ready") return "ready_for_dispatch";
  if (["material_procurement", "cutting", "edging", "assembly", "finishing", "quality_check"].includes(ps)) return "production_in_progress";
  return "design_in_progress";
}

const simpleStatusConfig: Record<SimpleStatus, { label: string; color: string; bg: string; border: string }> = {
  design_in_progress: { label: "Design in Progress", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  production_in_progress: { label: "Production in Progress", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  ready_for_dispatch: { label: "Ready for Dispatch", color: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  dispatched: { label: "Dispatched", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
};

function SimpleStatusBadge({ status }: { status: SimpleStatus }) {
  const cfg = simpleStatusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color} whitespace-nowrap`} style={{ fontSize: 11.5, fontWeight: 500 }}>
      {cfg.label}
    </span>
  );
}

// ---- Simple production progress bar ----
function SimpleProgressBar({ status }: { status: SimpleStatus }) {
  const steps: { key: SimpleStatus; label: string }[] = [
    { key: "design_in_progress", label: "Design" },
    { key: "production_in_progress", label: "Production" },
    { key: "ready_for_dispatch", label: "Ready" },
    { key: "dispatched", label: "Dispatched" },
  ];
  const currentIdx = steps.findIndex(s => s.key === status);

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step.key} className="flex items-center flex-1 min-w-0">
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-2 rounded-full ${
                isCompleted ? "bg-emerald-400" : isCurrent ? "bg-gold" : "bg-gray-200"
              }`} />
              <span className={`${isCurrent ? "text-foreground" : "text-muted-foreground"} whitespace-nowrap`} style={{ fontSize: 10.5, fontWeight: isCurrent ? 600 : 400 }}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Simple payment summary for partner view ----
function PartnerPaymentSummary({ order }: { order: ConvertedOrder }) {
  const pct = order.quotationAmount > 0 ? Math.round((order.receivedAmount / order.quotationAmount) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-navy/5 border border-navy/10 text-center">
          <p className="text-muted-foreground" style={{ fontSize: 11 }}>Quotation</p>
          <p className="text-navy mt-0.5" style={{ fontSize: 16, fontWeight: 700 }}>
            ₹{order.quotationAmount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
          <p className="text-emerald-700" style={{ fontSize: 11 }}>Received</p>
          <p className="text-emerald-800 mt-0.5" style={{ fontSize: 16, fontWeight: 700 }}>
            ₹{order.receivedAmount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center">
          <p className="text-red-700" style={{ fontSize: 11 }}>Balance</p>
          <p className="text-red-800 mt-0.5" style={{ fontSize: 16, fontWeight: 700 }}>
            ₹{order.balanceAmount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-muted-foreground" style={{ fontSize: 12 }}>Collection Progress</span>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.paymentStatus} size="xs" />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{pct}%</span>
          </div>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Payment entries list */}
      {order.payments.length > 0 && (
        <div>
          <p className="text-muted-foreground mb-2" style={{ fontSize: 12, fontWeight: 500 }}>Payment History</p>
          <div className="space-y-2">
            {order.payments.map(pay => (
              <div key={pay.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>₹{pay.amount.toLocaleString("en-IN")}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{pay.date} · {pay.method.replace(/_/g, " ")}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200" style={{ fontSize: 10.5 }}>
                  received
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ======================== Main Component ========================
interface PartnerConvertedOrderViewProps {
  role: "dealer" | "architect" | "factory";
  partnerName: string;
}

export function PartnerConvertedOrderView({ role, partnerName }: PartnerConvertedOrderViewProps) {
  // Filter orders by partner role
  const myOrders = role === "factory"
    ? convertedOrders // Factory sees all converted orders
    : convertedOrders.filter(co => co.accountType === role);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<ConvertedOrder | null>(null);
  const [drawerTab, setDrawerTab] = useState("overview");

  // Enrich orders with simple status
  const enriched = myOrders.map(co => ({
    ...co,
    simpleStatus: getSimpleProductionStatus(co.productionStatus, co.dispatchStatus),
  }));

  const filtered = enriched.filter(co => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      co.id.toLowerCase().includes(q) ||
      co.projectName.toLowerCase().includes(q) ||
      co.accountName.toLowerCase().includes(q) ||
      co.city.toLowerCase().includes(q);
    const matchStatus = !statusFilter || co.simpleStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalValue = myOrders.reduce((s, co) => s + co.quotationAmount, 0);
  const totalReceived = myOrders.reduce((s, co) => s + co.receivedAmount, 0);
  const totalBalance = myOrders.reduce((s, co) => s + co.balanceAmount, 0);

  const selectedSimpleStatus = selectedOrder
    ? getSimpleProductionStatus(selectedOrder.productionStatus, selectedOrder.dispatchStatus)
    : "design_in_progress";

  const roleLabels: Record<string, { title: string; subtitle: string }> = {
    dealer: { title: "Converted Orders", subtitle: `Orders for ${partnerName}` },
    architect: { title: "Project Orders", subtitle: `Projects for ${partnerName}` },
    factory: { title: "Production Orders", subtitle: "All converted orders in pipeline" },
  };

  const info = roleLabels[role] || roleLabels.dealer;

  return (
    <>
      <PageShell
        title={info.title}
        subtitle={`${info.subtitle} · ${myOrders.length} order${myOrders.length !== 1 ? "s" : ""}`}
        actions={
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Orders")}>Export</Button>
        }
      >
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Orders" value={myOrders.length} icon={<Package size={18} />} accent="navy" />
          <StatCard
            label="Order Value"
            value={`₹${totalValue >= 100000 ? (totalValue / 100000).toFixed(1) + "L" : (totalValue / 1000).toFixed(0) + "K"}`}
            icon={<DollarSign size={18} />}
            accent="gold"
          />
          <StatCard
            label="Received"
            value={`₹${totalReceived >= 100000 ? (totalReceived / 100000).toFixed(1) + "L" : (totalReceived / 1000).toFixed(0) + "K"}`}
            icon={<CheckCircle2 size={18} />}
            accent="green"
          />
          <StatCard
            label="Balance"
            value={`₹${totalBalance >= 100000 ? (totalBalance / 100000).toFixed(1) + "L" : (totalBalance / 1000).toFixed(0) + "K"}`}
            icon={<Clock size={18} />}
            accent="red"
          />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FilterBar
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search orders..."
            filters={[
              {
                label: "Status",
                value: statusFilter,
                onChange: (v) => { setStatusFilter(v); setPage(1); },
                options: [
                  { label: "Design in Progress", value: "design_in_progress" },
                  { label: "Production in Progress", value: "production_in_progress" },
                  { label: "Ready for Dispatch", value: "ready_for_dispatch" },
                  { label: "Dispatched", value: "dispatched" },
                ],
              },
            ]}
          />
        </div>

        {/* Order Cards (mobile-friendly) */}
        <div className="space-y-3">
          {filtered.map(co => (
            <div
              key={co.id}
              className="bg-card rounded-xl border border-border p-4 cursor-pointer hover:border-gold/30 hover:shadow-sm transition-all"
              onClick={() => { setSelectedOrder(co); setDrawerTab("overview"); }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 600 }}>{co.id}</span>
                    <SimpleStatusBadge status={co.simpleStatus} />
                  </div>
                  <p className="mt-1" style={{ fontSize: 15, fontWeight: 600 }}>{co.projectName}</p>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: 13 }}>
                    {co.accountName} · {co.city}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p style={{ fontSize: 15, fontWeight: 700 }}>₹{co.quotationAmount.toLocaleString("en-IN")}</p>
                  <StatusBadge status={co.paymentStatus} size="xs" />
                </div>
              </div>

              {/* Simple progress bar */}
              <div className="mt-3">
                <SimpleProgressBar status={co.simpleStatus} />
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: 12 }}>
                    <Calendar size={12} /> {co.convertedAt}
                  </span>
                  {role !== "factory" && (
                    <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: 12 }}>
                      <Users size={12} /> {co.roles.find(r => r.role === "project_manager")?.userName || "—"}
                    </span>
                  )}
                  {role === "factory" && (
                    <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: 12 }}>
                      <Factory size={12} /> {co.roles.find(r => r.role === "production_manager")?.userName || "—"}
                    </span>
                  )}
                </div>
                <ArrowRight size={14} className="text-muted-foreground" />
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Package size={28} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground" style={{ fontSize: 14, fontWeight: 500 }}>No converted orders found</p>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: 13 }}>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </PageShell>

      {/* Order Detail Drawer */}
      <Drawer
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `${selectedOrder.id} — ${selectedOrder.projectName}` : ""}
      >
        {selectedOrder && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-navy/8 flex items-center justify-center shrink-0">
                <Package size={20} className="text-navy" />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 16, fontWeight: 600 }}>{selectedOrder.projectName}</p>
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>{selectedOrder.accountName} · {selectedOrder.city}</p>
              </div>
            </div>

            {/* Simple Status */}
            <div className="p-3 rounded-xl border border-border bg-muted/20">
              <SimpleStatusBadge status={selectedSimpleStatus} />
              <div className="mt-3">
                <SimpleProgressBar status={selectedSimpleStatus} />
              </div>
            </div>

            {/* Tabs */}
            <TabBar
              tabs={[
                { key: "overview", label: "Overview" },
                { key: "payment", label: "Payment" },
                { key: "timeline", label: "Timeline" },
              ]}
              active={drawerTab}
              onChange={setDrawerTab}
            />

            {drawerTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <DetailField label="Converted Order" value={selectedOrder.id} />
                  <DetailField label="Order ID" value={selectedOrder.orderId} />
                  <DetailField label="Quotation ID" value={selectedOrder.quotationId} />
                  <DetailField label="Account" value={selectedOrder.accountName} />
                  <DetailField label="Site" value={selectedOrder.siteName} />
                  <DetailField label="City" value={`${selectedOrder.city}, ${selectedOrder.state}`} />
                  <DetailField label="Converted Date" value={selectedOrder.convertedAt} />
                  <DetailField label="Expected Completion" value={selectedOrder.expectedCompletionDate} />
                </div>

                {/* Status Summary */}
                <SummaryCard title="Current Status">
                  <div className="grid grid-cols-2 gap-3">
                    <DetailField label="Production" value={<StatusBadge status={selectedOrder.productionStatus} size="sm" />} />
                    <DetailField label="Dispatch" value={<StatusBadge status={selectedOrder.dispatchStatus} size="sm" />} />
                    <DetailField label="Payment" value={<StatusBadge status={selectedOrder.paymentStatus} size="sm" />} />
                    <DetailField label="Pending With" value={selectedOrder.currentPendingWith} />
                  </div>
                </SummaryCard>

                {/* Assigned Team (simplified) */}
                <SummaryCard title="Assigned Team">
                  <div className="space-y-2">
                    {selectedOrder.roles
                      .filter(r => ["project_manager", "production_manager", "dispatch_manager"].includes(r.role))
                      .map(r => (
                        <div key={r.role} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                          <span className="text-muted-foreground" style={{ fontSize: 12.5 }}>{r.roleLabel}</span>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{r.userName}</span>
                        </div>
                      ))
                    }
                  </div>
                </SummaryCard>

                {selectedOrder.notes && (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <p className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Notes</p>
                    <p className="mt-1" style={{ fontSize: 13, lineHeight: 1.5 }}>{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            )}

            {drawerTab === "payment" && (
              <PartnerPaymentSummary order={selectedOrder} />
            )}

            {drawerTab === "timeline" && (
              <div className="space-y-0">
                {selectedOrder.milestones.map((ms, idx) => {
                  const isLast = idx === selectedOrder.milestones.length - 1;
                  const isCompleted = ms.status === "completed";
                  const isCurrent = ms.status === "in_progress";
                  const isDelayed = ms.status === "delayed";

                  return (
                    <div key={ms.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted ? "bg-emerald-100 text-emerald-600" :
                          isCurrent ? "bg-gold/15 text-gold-dark" :
                          isDelayed ? "bg-red-100 text-red-600" :
                          "bg-gray-100 text-gray-400"
                        }`}>
                          {isCompleted ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                        </div>
                        {!isLast && <div className={`w-0.5 flex-1 min-h-[16px] ${isCompleted ? "bg-emerald-300" : "bg-gray-200"}`} />}
                      </div>
                      <div className="pb-3 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{ms.label}</span>
                          <span className={`px-1.5 py-0.5 rounded-full ${
                            isCompleted ? "bg-emerald-50 text-emerald-600" :
                            isCurrent ? "bg-gold/10 text-gold-dark" :
                            isDelayed ? "bg-red-50 text-red-600" :
                            "bg-gray-50 text-gray-500"
                          }`} style={{ fontSize: 10 }}>
                            {ms.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>
                          {ms.date || `Expected: ${ms.expectedDate}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
}