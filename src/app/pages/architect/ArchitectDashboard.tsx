import { PageShell } from "../../components/layout/PageShell";
import { StatCard } from "../../components/layout/StatCard";
import { StatusBadge, SummaryCard, AlertCard } from "../../components/shared";
import { accounts, orders, tasks, getAccountById } from "../../data";
import { convertedOrders } from "../../data/operations";
import { PenTool, ShoppingCart, ClipboardList, BookOpen, ArrowRight, Wrench } from "lucide-react";
import { Link } from "react-router";

const archAccounts = accounts.filter(a => a.architectId === "U005" || a.architectId === "U006");
const archAccIds = archAccounts.map(a => a.id);
const archOrders = orders.filter(o => archAccIds.includes(o.accountId));
const archTasks = tasks.filter(t => t.assigneeId === "U005" || t.assigneeId === "U006");

export function ArchitectDashboard() {
  return (
    <PageShell title="Dashboard" subtitle="Welcome back, Vikram Singh">
      {/* Alert */}
      <div className="mb-6">
        <AlertCard
          type="info"
          title="2 tasks assigned to you"
          message="Design validation for wardrobe specs (completed) and design approval for Rao Homes (pending)"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/architect/projects">
          <StatCard label="Assigned Projects" value={archAccounts.length} icon={<PenTool size={18} />} accent="purple" trend={`${archAccounts.filter(a => a.status === "active").length} active`} trendDirection="up" />
        </Link>
        <Link to="/architect/orders">
          <StatCard label="Related Orders" value={archOrders.length} icon={<ShoppingCart size={18} />} accent="navy" trend={`₹${(archOrders.reduce((s, o) => s + o.totalAmount, 0) / 100000).toFixed(1)}L value`} />
        </Link>
        <Link to="/architect/converted-orders">
          <StatCard label="My Tasks" value={archTasks.length} icon={<ClipboardList size={18} />} accent="gold" trend={`${archTasks.filter(t => t.status === "completed").length} completed`} trendDirection="up" />
        </Link>
        <Link to="/architect/specifications">
          <StatCard label="Specifications" value={4} icon={<BookOpen size={18} />} accent="blue" trend="Material library" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Overview */}
        <SummaryCard title="My Projects" actions={
          <Link to="/architect/projects" className="text-gold-dark hover:underline" style={{ fontSize: 12, fontWeight: 500 }}>View All</Link>
        }>
          <div className="space-y-3">
            {archAccounts.map((acc) => {
              const accOrders = orders.filter(o => o.accountId === acc.id);
              return (
                <div key={acc.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 500 }}>{acc.company}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>{acc.city} · {accOrders.length} orders</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={acc.status} size="xs" />
                    <p className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>₹{(acc.totalValue / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SummaryCard>

        {/* Tasks */}
        <SummaryCard title="My Tasks" actions={
          <span className="text-muted-foreground" style={{ fontSize: 12 }}>{archTasks.length} total</span>
        }>
          <div className="space-y-3">
            {archTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{task.title}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{task.orderId} · Due: {task.dueDate}</p>
                </div>
                <StatusBadge status={task.status} size="xs" />
              </div>
            ))}
          </div>
        </SummaryCard>
      </div>

      {/* Converted Orders Quick View */}
      {convertedOrders.filter(co => co.accountType === "architect").length > 0 && (
        <div className="mt-6">
          <SummaryCard title="Project Orders — Production Tracking" actions={
            <Link to="/architect/converted-orders" className="text-gold-dark hover:underline flex items-center gap-1" style={{ fontSize: 12, fontWeight: 500 }}>
              View All <ArrowRight size={12} />
            </Link>
          }>
            <div className="space-y-3">
              {convertedOrders.filter(co => co.accountType === "architect").map(co => (
                <Link key={co.id} to="/architect/converted-orders" className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-gold/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
                      <Wrench size={16} className="text-violet-600" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 500 }}>{co.projectName}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{co.id} · {co.accountName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={co.productionStatus} size="xs" />
                    <p className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>₹{co.quotationAmount.toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </SummaryCard>
        </div>
      )}
    </PageShell>
  );
}