import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import { StatusBadge, Button, TabBar, SummaryCard } from "../../../components/shared";
import { getOrdersDashboardStats, projectOrders, projectQuotations, formatQuotationOutcome } from "../../../data/orders";
import { formatCurrency } from "../../../data/crm";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import {
  ShoppingCart, FileText, TrendingUp, CreditCard, CheckCircle2, XCircle,
  Clock, Pause, MessageSquare, Download, ArrowRight, Plus
} from "lucide-react";
import { NewOrderModal } from "../../../components/orders/OrderModals";
import { handleExport } from "../../../components/shared/GlobalModals";
import { toast } from "sonner";

const OUTCOME_COLORS: Record<string, string> = {
  Open: "#3b82f6", "Under Discussion": "#f59e0b", Negotiation: "#f97316",
  Won: "#10b981", Lost: "#ef4444", Hold: "#8b5cf6",
};

export function OrdersDashboard() {
  const navigate = useNavigate();
  const stats = getOrdersDashboardStats();
  const [newOrderModal, setNewOrderModal] = useState(false);

  const outcomePieData = [
    { name: "Open", value: stats.open },
    { name: "Under Discussion", value: stats.underDiscussion },
    { name: "Won", value: stats.won },
    { name: "Lost", value: stats.lost },
    { name: "Hold", value: stats.hold },
  ].filter(d => d.value > 0);

  const categoryBarData = stats.categorySplit;
  const sourceBarData = stats.sourceSummary;

  return (
    <>
      <PageShell
        title="Orders & Quotations Dashboard"
        subtitle={`${stats.totalOrders} orders · ${stats.totalQuotations} quotations · ${stats.winRate}% win rate`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Orders Dashboard")}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setNewOrderModal(true)}>New Order</Button>
          </div>
        }
      >
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          <StatCard label="Total Orders" value={stats.totalOrders} icon={<ShoppingCart size={18} />} accent="navy" />
          <StatCard label="Total Quotations" value={stats.totalQuotations} icon={<FileText size={18} />} accent="gold" />
          <StatCard label="Quotation Value" value={formatCurrency(stats.totalQuotationValue)} icon={<TrendingUp size={18} />} accent="blue" />
          <StatCard label="Collected" value={formatCurrency(stats.totalReceived)} icon={<CreditCard size={18} />} accent="green" trend={`${Math.round((stats.totalReceived / stats.totalQuotationValue) * 100)}%`} trendDirection="up" />
          <StatCard label="Balance" value={formatCurrency(stats.totalBalance)} icon={<Clock size={18} />} accent="red" />
        </div>

        {/* Quotation Status Cards */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Open", value: stats.open, icon: <FileText size={16} />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Under Discussion", value: stats.underDiscussion, icon: <MessageSquare size={16} />, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Negotiation", value: stats.negotiation, icon: <TrendingUp size={16} />, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Won", value: stats.won, icon: <CheckCircle2 size={16} />, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Lost", value: stats.lost, icon: <XCircle size={16} />, color: "text-red-600", bg: "bg-red-50" },
            { label: "Hold", value: stats.hold, icon: <Pause size={16} />, color: "text-purple-600", bg: "bg-purple-50" },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-4 text-center hover:shadow-sm transition-shadow">
              <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mx-auto mb-2`}>{s.icon}</div>
              <p style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</p>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: 11.5 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Quotation Outcome Pie */}
          <SummaryCard title="Quotation Outcomes">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart id="orders-outcome-pie">
                  <Pie key="orders-pie-data" data={outcomePieData} cx="50%" cy="50%" outerRadius={85} innerRadius={45} dataKey="value" paddingAngle={3}>
                    {outcomePieData.map((d, i) => <Cell key={`outcome-cell-${i}`} fill={OUTCOME_COLORS[d.name] || "#9ca3af"} />)}
                  </Pie>
                  <Tooltip key="orders-pie-tooltip" contentStyle={{ fontSize: 13, borderRadius: 10 }} />
                  <Legend key="orders-pie-legend" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </SummaryCard>

          {/* Category Split */}
          <SummaryCard title="Project Category Split">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={categoryBarData} margin={{ bottom: 5 }} id="orders-category-bar">
                  <XAxis key="cat-x" dataKey="category" style={{ fontSize: 11 }} />
                  <YAxis key="cat-y" style={{ fontSize: 12 }} />
                  <Tooltip key="cat-tooltip" contentStyle={{ fontSize: 13, borderRadius: 10 }} />
                  <Bar key="cat-bar" dataKey="count" fill="#1B2A4A" name="Orders" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SummaryCard>

          {/* Source Summary */}
          <SummaryCard title="Source-wise Orders">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={sourceBarData} layout="vertical" margin={{ left: 10 }} id="orders-source-bar">
                  <XAxis key="src-x" type="number" style={{ fontSize: 12 }} />
                  <YAxis key="src-y" type="category" dataKey="source" width={70} style={{ fontSize: 11 }} />
                  <Tooltip key="src-tooltip" contentStyle={{ fontSize: 13, borderRadius: 10 }} formatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                  <Bar key="src-bar" dataKey="orders" fill="#1B2A4A" name="Orders" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SummaryCard>
        </div>

        {/* Quotation Aging Table */}
        {stats.quotationAging.length > 0 && (
          <SummaryCard title="Open Quotation Aging" actions={<Button variant="outline" size="sm" onClick={() => navigate("/admin/orders/table")}>View All Orders <ArrowRight size={13} className="ml-1" /></Button>}>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontSize: 13 }}>
                <thead>
                  <tr className="border-b border-border">
                    {["Quotation", "Project", "Status", "Age (Days)", "Action"].map(h => (
                      <th key={h} className="text-left py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.quotationAging.sort((a, b) => b.days - a.days).map(q => (
                    <tr key={q.id} className="border-b border-border/50 hover:bg-gold/4 cursor-pointer" onClick={() => navigate(`/admin/orders/quotation/${q.id}`)}>
                      <td className="py-2" style={{ fontWeight: 500 }}>{q.id}</td>
                      <td className="py-2">{q.projectName}</td>
                      <td className="py-2"><StatusBadge status={q.outcome} /></td>
                      <td className="py-2">
                        <span className={q.days > 45 ? "text-red-600" : q.days > 20 ? "text-amber-600" : ""} style={{ fontWeight: 500 }}>{q.days}d</span>
                      </td>
                      <td className="py-2">
                        <Button variant="ghost" size="sm" icon={<ArrowRight size={13} />} onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate(`/admin/orders/quotation/${q.id}`); }}>View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SummaryCard>
        )}

        {/* Recent Orders Quick Links */}
        <div className="mt-6">
          <SummaryCard title="Recent Orders">
            <div className="space-y-2">
              {projectOrders.slice(0, 5).map(o => (
                <div
                  key={o.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-gold/30 hover:bg-gold/4 cursor-pointer transition-all"
                  onClick={() => navigate(`/admin/orders/${o.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{o.id}</span>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 500 }}>{o.projectName}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{o.accountName} · {o.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={o.quotationStatus} size="xs" />
                    <StatusBadge status={o.orderStatus} size="xs" />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>₹{o.totalQuotationValue.toLocaleString("en-IN")}</span>
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </SummaryCard>
        </div>
      </PageShell>

      <NewOrderModal open={newOrderModal} onClose={() => setNewOrderModal(false)} onComplete={() => navigate("/admin/orders/table")} />
    </>
  );
}