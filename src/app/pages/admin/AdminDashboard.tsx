import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { PageShell } from "../../components/layout/PageShell";
import { StatCard } from "../../components/layout/StatCard";
import { StatusBadge, TabBar, Button, SummaryCard, Timeline } from "../../components/shared";
import {
  leads, accounts, orders, tasks, payments, quotations,
  getAccountById, getUserById, getSalespersonById
} from "../../data";
import {
  Users, Building2, ShoppingCart, ClipboardList, CreditCard, FileText,
  TrendingUp, Plus, Download, ArrowRight, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from "recharts";

import { handleExport } from "../../components/shared/GlobalModals";

const totalRevenue = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
const pendingRevenue = payments.filter(p => p.status !== "completed").reduce((s, p) => s + p.amount, 0);

const monthlyData = [
  { month: "Oct", leads: 2, orders: 0, revenue: 0 },
  { month: "Nov", leads: 3, orders: 1, revenue: 122500 },
  { month: "Dec", leads: 2, orders: 2, revenue: 312500 },
  { month: "Jan", leads: 1, orders: 1, revenue: 175000 },
  { month: "Feb", leads: 0, orders: 0, revenue: 0 },
  { month: "Mar", leads: 0, orders: 0, revenue: 0 },
];

const statusDistribution = [
  { name: "In Production", value: 1, color: "#F59E0B" },
  { name: "Confirmed", value: 1, color: "#3B82F6" },
  { name: "Shipped", value: 1, color: "#8B5CF6" },
  { name: "Draft", value: 1, color: "#9CA3AF" },
];

const leadSourceData = [
  { source: "Website", count: 2 },
  { source: "Referral", count: 2 },
  { source: "Exhibition", count: 2 },
  { source: "Social Media", count: 1 },
  { source: "Cold Call", count: 1 },
];

const recentActivity = [
  { id: "1", title: "Order O003 shipped", description: "Sheikh Constructions — 20 partition panels", time: "2 hours ago", status: "completed" as const, icon: <ShoppingCart size={14} /> },
  { id: "2", title: "Payment P003 received (partial)", description: "₹1,75,000 from Sheikh Constructions", time: "5 hours ago", status: "active" as const, icon: <CreditCard size={14} /> },
  { id: "3", title: "Task T002 started", description: "CNC cutting for Mehta Interiors order", time: "Yesterday", status: "active" as const, icon: <ClipboardList size={14} /> },
  { id: "4", title: "New lead: Kiran Malhotra", description: "Malhotra Group — Exhibition contact", time: "2 days ago", status: "pending" as const, icon: <Users size={14} /> },
  { id: "5", title: "Quotation Q004 sent", description: "₹1,90,000 — Rao Homes modular kitchen", time: "3 days ago", status: "completed" as const, icon: <FileText size={14} /> },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  return (
    <PageShell
      title="Dashboard"
      subtitle="Business overview and key metrics"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Dashboard")}>Export</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => navigate("/admin/crm/leads")}>New Lead</Button>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <Link to="/admin/crm/leads">
          <StatCard
            label="Total Leads"
            value={leads.length}
            icon={<Users size={18} />}
            trend={`${leads.filter(l => l.status === "converted").length} converted`}
            trendDirection="up"
            accent="blue"
          />
        </Link>
        <Link to="/admin/crm/accounts">
          <StatCard
            label="Active Accounts"
            value={accounts.filter(a => a.status === "active").length}
            icon={<Building2 size={18} />}
            trend={`${accounts.length} total`}
            accent="purple"
          />
        </Link>
        <Link to="/admin/orders/table">
          <StatCard
            label="Active Orders"
            value={orders.filter(o => o.status !== "draft" && o.status !== "cancelled").length}
            icon={<ShoppingCart size={18} />}
            trend={`${orders.length} total`}
            trendDirection="up"
            accent="navy"
          />
        </Link>
        <Link to="/admin/orders/dashboard">
          <StatCard
            label="Quotations"
            value={quotations.length}
            icon={<FileText size={18} />}
            trend={`${quotations.filter(q => q.status === "accepted").length} accepted`}
            accent="gold"
          />
        </Link>
        <Link to="/admin/finance/dashboard">
          <StatCard
            label="Revenue"
            value={`₹${(totalRevenue / 1000).toFixed(0)}K`}
            icon={<CreditCard size={18} />}
            trend={`₹${(pendingRevenue / 1000).toFixed(0)}K pending`}
            trendDirection="up"
            accent="green"
          />
        </Link>
        <Link to="/admin/tasks/dashboard">
          <StatCard
            label="Active Tasks"
            value={tasks.filter(t => t.status === "in_progress").length}
            icon={<ClipboardList size={18} />}
            trend={`${tasks.filter(t => t.status === "pending").length} pending`}
            accent="gold"
          />
        </Link>
      </div>

      {/* Tabs */}
      <TabBar
        tabs={[
          { key: "overview", label: "Overview" },
          { key: "sales", label: "Sales" },
          { key: "activity", label: "Activity" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <SummaryCard title="Revenue Trend" actions={<span className="text-muted-foreground" style={{ fontSize: 12 }}>Last 6 months</span>}>
                <div className="h-[280px]">
                  <svg width={0} height={0} style={{ position: 'absolute' }}>
                    <defs>
                      <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC6E63" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#EC6E63" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={monthlyData} id="admin-revenue-chart">
                      <CartesianGrid key="admin-rev-grid" strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                      <XAxis key="admin-rev-x" dataKey="month" tick={{ fontSize: 12, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                      <YAxis key="admin-rev-y" tick={{ fontSize: 12, fill: "#6B7A90" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
                      <Tooltip
                        key="admin-rev-tooltip"
                        contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }}
                        formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                      />
                      <Area key="admin-rev-area" type="monotone" dataKey="revenue" stroke="#EC6E63" fill="url(#adminRevenueGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </SummaryCard>
            </div>

            {/* Order Status Distribution */}
            <SummaryCard title="Order Status">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart id="admin-status-pie">
                    <Pie key="admin-pie-data" data={statusDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                      {statusDistribution.map((entry, i) => (
                        <Cell key={`admin-status-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip key="admin-pie-tooltip" contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {statusDistribution.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-muted-foreground" style={{ fontSize: 12.5 }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </SummaryCard>
          </div>
        )}

        {activeTab === "sales" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Sources */}
            <SummaryCard title="Lead Sources">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={leadSourceData} layout="vertical" id="admin-lead-bar">
                    <CartesianGrid key="admin-bar-grid" strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" horizontal={false} />
                    <XAxis key="admin-bar-x" type="number" tick={{ fontSize: 12, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                    <YAxis key="admin-bar-y" dataKey="source" type="category" tick={{ fontSize: 12, fill: "#6B7A90" }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip key="admin-bar-tooltip" contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                    <Bar key="admin-bar-data" dataKey="count" fill="#1B2A4A" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SummaryCard>

            {/* Top Accounts */}
            <SummaryCard title="Top Accounts by Value">
              <div className="space-y-3">
                {accounts.sort((a, b) => b.totalValue - a.totalValue).map((acc, idx) => (
                  <div key={acc.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground" style={{ fontSize: 11, fontWeight: 600 }}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 13.5, fontWeight: 500 }}>{acc.company}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{acc.city} · {getSalespersonById(acc.salespersonId)?.name}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: 14, fontWeight: 600 }}>₹{(acc.totalValue / 1000).toFixed(0)}K</p>
                      <StatusBadge status={acc.status} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            </SummaryCard>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SummaryCard title="Recent Activity">
                <Timeline items={recentActivity} />
              </SummaryCard>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <SummaryCard title="Task Summary">
                <div className="space-y-3">
                  {[
                    { label: "Completed", count: tasks.filter(t => t.status === "completed").length, icon: <CheckCircle2 size={14} className="text-emerald-500" /> },
                    { label: "In Progress", count: tasks.filter(t => t.status === "in_progress").length, icon: <Clock size={14} className="text-blue-500" /> },
                    { label: "Pending", count: tasks.filter(t => t.status === "pending").length, icon: <AlertCircle size={14} className="text-amber-500" /> },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        {s.icon}
                        <span style={{ fontSize: 13 }}>{s.label}</span>
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 600 }}>{s.count}</span>
                    </div>
                  ))}
                </div>
              </SummaryCard>

              <SummaryCard title="Pipeline Value">
                <div className="text-center py-4">
                  <p className="text-gold-dark" style={{ fontSize: 32, fontWeight: 700 }}>
                    ₹{((totalRevenue + pendingRevenue) / 100000).toFixed(1)}L
                  </p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: 13 }}>Total pipeline value</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <div>
                      <p className="text-emerald-600" style={{ fontSize: 16, fontWeight: 600 }}>₹{(totalRevenue / 100000).toFixed(1)}L</p>
                      <p className="text-muted-foreground" style={{ fontSize: 11 }}>Collected</p>
                    </div>
                    <div className="w-px bg-border" />
                    <div>
                      <p className="text-amber-600" style={{ fontSize: 16, fontWeight: 600 }}>₹{(pendingRevenue / 100000).toFixed(1)}L</p>
                      <p className="text-muted-foreground" style={{ fontSize: 11 }}>Pending</p>
                    </div>
                  </div>
                </div>
              </SummaryCard>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}