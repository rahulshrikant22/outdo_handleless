import { PageShell } from "../../components/layout/PageShell";
import { StatCard } from "../../components/layout/StatCard";
import { StatusBadge, SummaryCard, AlertCard } from "../../components/shared";
import { orders, tasks, getAccountById, getUserById } from "../../data";
import { convertedOrders } from "../../data/operations";
import { ShoppingCart, ClipboardList, Factory, Truck, AlertTriangle, ArrowRight, Wrench } from "lucide-react";
import { Link } from "react-router";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const factoryTasks = tasks.filter(t => t.assigneeId === "U007" || t.assigneeId === "U008");
const taskStatusData = [
  { name: "Completed", value: factoryTasks.filter(t => t.status === "completed").length, color: "#10B981" },
  { name: "In Progress", value: factoryTasks.filter(t => t.status === "in_progress").length, color: "#3B82F6" },
  { name: "Pending", value: factoryTasks.filter(t => t.status === "pending").length, color: "#9CA3AF" },
];

export function FactoryDashboard() {
  return (
    <PageShell title="Dashboard" subtitle="Production and task overview">
      {/* Urgent Alerts */}
      <div className="mb-6">
        <AlertCard
          type="warning"
          title="1 order shipped — dispatch coordination needed"
          message="O003 Sheikh Constructions — 20 partition panels. Logistics coordination in progress."
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/factory/orders">
          <StatCard label="Total Orders" value={orders.length} icon={<ShoppingCart size={18} />} accent="navy" trend={`${orders.filter(o => o.status !== "draft" && o.status !== "cancelled").length} active`} trendDirection="up" />
        </Link>
        <Link to="/factory/production">
          <StatCard label="In Production" value={orders.filter(o => o.status === "in_production").length} icon={<Factory size={18} />} accent="gold" trend="Manufacturing" />
        </Link>
        <Link to="/factory/tasks">
          <StatCard label="Active Tasks" value={factoryTasks.filter(t => t.status === "in_progress").length} icon={<ClipboardList size={18} />} accent="blue" trend={`${factoryTasks.length} total`} />
        </Link>
        <Link to="/factory/dispatch">
          <StatCard label="Shipped" value={orders.filter(o => o.status === "shipped").length} icon={<Truck size={18} />} accent="green" trendDirection="up" trend="Dispatched" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status */}
        <SummaryCard title="Task Status Overview">
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie data={taskStatusData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4}>
                  {taskStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {taskStatusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span style={{ fontSize: 12.5 }}>{s.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </SummaryCard>

        {/* Order Pipeline */}
        <div className="lg:col-span-2">
          <SummaryCard title="Order Pipeline" actions={
            <Link to="/factory/orders" className="text-gold-dark hover:underline" style={{ fontSize: 12, fontWeight: 500 }}>View All</Link>
          }>
            <div className="space-y-3">
              {orders.map((o) => {
                const acc = getAccountById(o.accountId);
                const orderTasks = tasks.filter(t => t.orderId === o.id);
                const completedTasks = orderTasks.filter(t => t.status === "completed").length;
                const progress = orderTasks.length > 0 ? Math.round((completedTasks / orderTasks.length) * 100) : 0;
                return (
                  <div key={o.id} className="p-4 rounded-lg border border-border bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 500 }}>{o.id} — {acc?.company}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>{o.items}</p>
                      </div>
                      <StatusBadge status={o.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-muted-foreground shrink-0" style={{ fontSize: 11.5 }}>{completedTasks}/{orderTasks.length} tasks</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SummaryCard>
        </div>
      </div>

      {/* Converted Orders / Production Orders */}
      <div className="mt-6">
        <SummaryCard title="Production Orders — Converted" actions={
          <Link to="/factory/converted-orders" className="text-gold-dark hover:underline flex items-center gap-1" style={{ fontSize: 12, fontWeight: 500 }}>
            View All <ArrowRight size={12} />
          </Link>
        }>
          <div className="space-y-3">
            {convertedOrders.map(co => (
              <Link key={co.id} to="/factory/converted-orders" className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-gold/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Wrench size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 500 }}>{co.projectName}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>
                      {co.id} · PM: {co.roles.find(r => r.role === "production_manager")?.userName || "—"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={co.productionStatus} size="xs" />
                  <p className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>
                    <StatusBadge status={co.dispatchStatus} size="xs" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </SummaryCard>
      </div>
    </PageShell>
  );
}