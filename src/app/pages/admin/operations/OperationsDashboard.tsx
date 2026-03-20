import { useNavigate, Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import { Button, StatusBadge, SummaryCard } from "../../../components/shared";
import { getOperationsDashboardStats, convertedOrders, priorityLabels, productionStatusLabels } from "../../../data/operations";
import { formatCurrency } from "../../../data/crm";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Factory, Truck, AlertTriangle, Clock, DollarSign, Package,
  CheckCircle2, ArrowRight, Download, ShieldCheck, Layers
} from "lucide-react";

import { handleExport } from "../../../components/shared/GlobalModals";

const PRIORITY_COLORS: Record<string, string> = {
  Normal: "#6b7280", High: "#f97316", Urgent: "#ef4444", Critical: "#dc2626",
};
const PRODUCTION_COLORS: Record<string, string> = {
  "Design Pending": "#94a3b8", "Cutlist Pending": "#f59e0b", "Material Procurement": "#8b5cf6",
  "Cutting": "#3b82f6", "Edging": "#6366f1", "Assembly": "#f97316",
  "Finishing": "#ec4899", "Quality Check": "#14b8a6", "Production Ready": "#10b981",
};

export function OperationsDashboard() {
  const navigate = useNavigate();
  const stats = getOperationsDashboardStats();

  return (
    <PageShell
      title="Converted Orders / Operations"
      subtitle={`${stats.total} converted orders · ₹${(stats.totalQuotationValue / 100000).toFixed(1)}L total value · ${stats.collectionRate}% collected`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Operations")}>Export</Button>
          <Button variant="primary" size="sm" icon={<ArrowRight size={14} />} onClick={() => navigate("/admin/operations/table")}>
            View All Orders
          </Button>
        </div>
      }
    >
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        <Link to="/admin/operations/table">
          <StatCard label="Total Converted" value={stats.total} icon={<Package size={18} />} accent="navy" />
        </Link>
        <Link to="/admin/operations/table">
          <StatCard label="Design Pending" value={stats.designPending} icon={<Clock size={18} />} accent="gold" />
        </Link>
        <Link to="/admin/operations/table">
          <StatCard label="In Production" value={stats.productionInProgress} icon={<Factory size={18} />} accent="blue" />
        </Link>
        <Link to="/admin/operations/table">
          <StatCard label="Dispatched" value={stats.dispatched} icon={<Truck size={18} />} accent="purple" />
        </Link>
        <Link to="/admin/finance/dashboard">
          <StatCard label="Payment Pending" value={stats.paymentPending} icon={<DollarSign size={18} />} accent="red" />
        </Link>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-xl bg-navy/5 border border-navy/10">
          <p className="text-muted-foreground" style={{ fontSize: 12 }}>Total Order Value</p>
          <p className="text-navy mt-1" style={{ fontSize: 24, fontWeight: 700 }}>
            ₹{stats.totalQuotationValue.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-emerald-700" style={{ fontSize: 12 }}>Amount Received</p>
          <p className="text-emerald-800 mt-1" style={{ fontSize: 24, fontWeight: 700 }}>
            ₹{stats.totalReceived.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-700" style={{ fontSize: 12 }}>Balance Outstanding</p>
          <p className="text-red-800 mt-1" style={{ fontSize: 24, fontWeight: 700 }}>
            ₹{stats.totalBalance.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-gold/10 border border-gold/20">
          <p className="text-gold-dark" style={{ fontSize: 12 }}>Collection Rate</p>
          <p className="text-gold-dark mt-1" style={{ fontSize: 24, fontWeight: 700 }}>
            {stats.collectionRate}%
          </p>
          <div className="h-2 w-full bg-gold/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light" style={{ width: `${stats.collectionRate}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Production Status Distribution */}
        <SummaryCard title="Production Status Distribution">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={stats.productionDistribution} layout="vertical" margin={{ left: 10, right: 20 }} id="ops-production-bar">
                <XAxis key="ops-prod-xaxis" type="number" allowDecimals={false} style={{ fontSize: 12 }} />
                <YAxis key="ops-prod-yaxis" type="category" dataKey="status" width={130} style={{ fontSize: 12 }} />
                <Tooltip
                  key="ops-prod-tooltip"
                  contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }}
                  formatter={(val: number) => [`${val} order${val !== 1 ? "s" : ""}`, "Count"]}
                />
                <Bar key="ops-prod-bar" dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {stats.productionDistribution.map((entry, idx) => (
                    <Cell key={`ops-prod-cell-${idx}`} fill={PRODUCTION_COLORS[entry.status] || "#6b7280"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SummaryCard>

        {/* Priority Split */}
        <SummaryCard title="Priority Split">
          <div className="h-[260px] flex items-center justify-center">
            {stats.prioritySplit.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart id="ops-priority-pie">
                  <Pie
                    key="ops-priority-pie-data"
                    data={stats.prioritySplit}
                    dataKey="count"
                    nameKey="priority"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={3}
                    label={({ priority, count }) => `${priority}: ${count}`}
                    style={{ fontSize: 12 }}
                  >
                    {stats.prioritySplit.map((entry, idx) => (
                      <Cell key={`ops-prio-cell-${idx}`} fill={PRIORITY_COLORS[entry.priority] || "#6b7280"} />
                    ))}
                  </Pie>
                  <Tooltip key="ops-prio-tooltip" contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground" style={{ fontSize: 13 }}>No data</p>
            )}
          </div>
        </SummaryCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bottlenecks */}
        <SummaryCard title="Current Bottlenecks">
          <div className="space-y-3">
            {stats.bottlenecks.map((b) => (
              <div key={b.role} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertTriangle size={14} className="text-red-600" />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{b.role}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200" style={{ fontSize: 12, fontWeight: 600 }}>
                  {b.count} order{b.count !== 1 ? "s" : ""} pending
                </span>
              </div>
            ))}
            {stats.bottlenecks.length === 0 && (
              <div className="text-center py-6">
                <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>No bottlenecks detected</p>
              </div>
            )}
          </div>
        </SummaryCard>

        {/* Delayed Orders */}
        <SummaryCard title="Active Delays & Holds">
          <div className="space-y-3">
            {convertedOrders.filter(co => co.delays.some(d => d.isActive)).length > 0 ? (
              convertedOrders
                .filter(co => co.delays.some(d => d.isActive))
                .map(co => {
                  const activeDelay = co.delays.find(d => d.isActive)!;
                  return (
                    <div
                      key={co.id}
                      className="p-3 rounded-lg border border-red-200 bg-red-50/50 cursor-pointer hover:bg-red-50 transition-colors"
                      onClick={() => navigate(`/admin/operations/${co.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600 }}>{co.projectName}</p>
                          <p className="text-muted-foreground mt-0.5" style={{ fontSize: 12 }}>
                            {co.id} · {co.accountName}
                          </p>
                        </div>
                        <StatusBadge status={co.priority} size="xs" />
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <AlertTriangle size={13} className="text-red-600" />
                        <span className="text-red-700" style={{ fontSize: 12 }}>
                          {activeDelay.type === "delay" ? "Delayed" : "On Hold"}: {activeDelay.description.substring(0, 60)}...
                        </span>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>No active delays or holds</p>
              </div>
            )}
          </div>
        </SummaryCard>
      </div>

      {/* Recent Converted Orders */}
      <SummaryCard
        title="Recent Converted Orders"
        actions={
          <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />} onClick={() => navigate("/admin/operations/table")}>
            View All
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 13 }}>
            <thead>
              <tr className="border-b border-border">
                {["ID", "Project", "Account", "Priority", "Production", "Dispatch", "Payment", "Pending With", "Value"].map(h => (
                  <th key={h} className="text-left py-2.5 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {convertedOrders.map(co => (
                <tr
                  key={co.id}
                  className="border-b border-border/50 cursor-pointer hover:bg-gold/4 transition-colors"
                  onClick={() => navigate(`/admin/operations/${co.id}`)}
                >
                  <td className="py-3" style={{ fontWeight: 600 }}>{co.id}</td>
                  <td className="py-3">{co.projectName}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1.5">
                      <span>{co.accountName}</span>
                      <StatusBadge status={co.accountType} size="xs" />
                    </div>
                  </td>
                  <td className="py-3"><StatusBadge status={co.priority} size="xs" /></td>
                  <td className="py-3"><StatusBadge status={co.productionStatus} size="xs" /></td>
                  <td className="py-3"><StatusBadge status={co.dispatchStatus} size="xs" /></td>
                  <td className="py-3"><StatusBadge status={co.paymentStatus} size="xs" /></td>
                  <td className="py-3 text-muted-foreground" style={{ fontSize: 12 }}>{co.currentPendingWith}</td>
                  <td className="py-3" style={{ fontWeight: 600 }}>₹{co.quotationAmount.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SummaryCard>
    </PageShell>
  );
}