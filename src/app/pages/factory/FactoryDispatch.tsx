import { useState } from "react";
import { PageShell } from "../../components/layout/PageShell";
import { StatCard } from "../../components/layout/StatCard";
import {
  StatusBadge, SummaryCard, Button, Timeline, FilterBar, TabBar,
  Tooltip, ActivityLog
} from "../../components/shared";
import { orders, getAccountById } from "../../data";
import { Truck, Package, MapPin, CheckCircle2, Clock, AlertCircle, Download, Search } from "lucide-react";

import { handleExport } from "../../components/shared/GlobalModals";
import { toast } from "sonner";

const shippedOrders = orders.filter(o => o.status === "shipped" || o.status === "delivered");
const pendingDispatch = orders.filter(o => o.status === "in_production" || o.status === "confirmed");

const dispatchActivity = [
  { id: "da1", user: "Warehouse Team", action: "completed packaging for", target: "O003 — 20 panels", time: "Today, 10:30 AM", type: "update" as const },
  { id: "da2", user: "QC Inspector", action: "approved quality check for", target: "O003", time: "Yesterday, 4:00 PM", type: "update" as const },
  { id: "da3", user: "Logistics", action: "booked transport for", target: "O001 — Kitchen shutters", time: "Mar 15, 2026", type: "create" as const },
  { id: "da4", user: "System", action: "flagged delivery deadline approaching:", target: "O002 — 5 days remaining", time: "Mar 14, 2026", type: "system" as const },
  { id: "da5", user: "Factory Admin", action: "updated dispatch ETA for", target: "O001 — Mar 25, 2026", time: "Mar 13, 2026", type: "update" as const },
];

export function FactoryDispatch() {
  const [activeTab, setActiveTab] = useState("dispatched");
  const [search, setSearch] = useState("");

  const filteredShipped = shippedOrders.filter(o => {
    if (!search) return true;
    const acc = getAccountById(o.accountId);
    return o.id.toLowerCase().includes(search.toLowerCase()) || (acc?.company || "").toLowerCase().includes(search.toLowerCase());
  });

  const filteredPending = pendingDispatch.filter(o => {
    if (!search) return true;
    const acc = getAccountById(o.accountId);
    return o.id.toLowerCase().includes(search.toLowerCase()) || (acc?.company || "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <PageShell
      title="Dispatch"
      subtitle={`Shipping and logistics management · ${shippedOrders.length} shipped · ${pendingDispatch.length} awaiting`}
      actions={
        <Tooltip text="Export dispatch report">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Dispatch Report")}>Export Report</Button>
        </Tooltip>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Shipped" value={shippedOrders.length} icon={<Truck size={18} />} accent="green" trendDirection="up" trend="Dispatched" />
        <StatCard label="Awaiting Dispatch" value={pendingDispatch.length} icon={<Package size={18} />} accent="gold" trend="In production/confirmed" />
        <StatCard label="Total Orders" value={orders.length} icon={<MapPin size={18} />} accent="navy" />
        <StatCard label="On-time Rate" value="92%" icon={<CheckCircle2 size={18} />} accent="blue" trend="Last 30 days" trendDirection="up" />
      </div>

      {/* Search */}
      <div className="mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by order ID or account..."
          filters={[]}
        />
      </div>

      {/* Tabs */}
      <TabBar
        tabs={[
          { key: "dispatched", label: "Dispatched", count: shippedOrders.length },
          { key: "pending", label: "Awaiting Dispatch", count: pendingDispatch.length },
          { key: "activity", label: "Activity Log" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-4">
        {activeTab === "dispatched" && (
          <div className="space-y-3">
            {filteredShipped.map((o) => {
              const acc = getAccountById(o.accountId);
              return (
                <div key={o.id} className="p-4 rounded-xl border border-border bg-card hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-emerald-500" />
                      <p style={{ fontSize: 13.5, fontWeight: 500 }}>{o.id}</p>
                    </div>
                    <StatusBadge status={o.status} size="sm" />
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: 12.5 }}>{acc?.company} · {acc?.city}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>{o.items}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>ETA: {o.expectedDelivery}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 13, fontWeight: 500 }}>₹{o.totalAmount.toLocaleString("en-IN")}</span>
                      <Button variant="outline" size="sm" onClick={() => toast.info("Opening tracking...", { description: `Tracking shipment for ${o.id}` })}>Track</Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredShipped.length === 0 && (
              <p className="text-center text-muted-foreground py-8" style={{ fontSize: 13 }}>No dispatches match your search</p>
            )}
          </div>
        )}

        {activeTab === "pending" && (
          <div className="space-y-3">
            {filteredPending.map((o) => {
              const acc = getAccountById(o.accountId);
              return (
                <div key={o.id} className="p-4 rounded-xl border border-border bg-card hover:border-amber-200 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-amber-500" />
                      <p style={{ fontSize: 13.5, fontWeight: 500 }}>{o.id}</p>
                    </div>
                    <StatusBadge status={o.status} size="sm" />
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: 12.5 }}>{acc?.company} · {acc?.city}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>{o.items}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>Target: {o.expectedDelivery}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 13, fontWeight: 500 }}>₹{o.totalAmount.toLocaleString("en-IN")}</span>
                      <Button variant="gold" size="sm" onClick={() => toast.success("Dispatch scheduled", { description: `Dispatch for ${o.id} has been scheduled.` })}>Schedule</Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredPending.length === 0 && (
              <p className="text-center text-muted-foreground py-8" style={{ fontSize: 13 }}>No pending dispatches match your search</p>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <SummaryCard title="Dispatch Activity Log">
            <ActivityLog entries={dispatchActivity} maxItems={10} />
          </SummaryCard>
        )}
      </div>
    </PageShell>
  );
}