import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import { StatusBadge, SummaryCard, Button, TabBar } from "../../../components/shared";
import {
  opsTasks, getTaskDashboardStats, categoryLabels, categoryColors,
  type TaskCategory,
} from "../../../data/opsTasks";
import {
  ClipboardList, CheckCircle2, Clock, AlertTriangle, Users,
  ArrowRight, BarChart3, TrendingUp, Layers,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

export function TaskDashboard() {
  const stats = getTaskDashboardStats();
  const [chartView, setChartView] = useState("role");

  // Chart data
  const roleChartData = stats.byRole.map(r => ({
    name: r.role.split(" ")[0],
    completed: r.completed,
    inProgress: r.inProgress,
    pending: r.pending,
  }));

  const categoryChartData = stats.byCategory.map(c => ({
    name: categoryLabels[c.category as TaskCategory],
    count: c.count,
    fill: categoryColors[c.category as TaskCategory],
  }));

  const priorityChartData = stats.byPriority.map(p => ({
    name: p.priority,
    count: p.count,
    fill: p.priority === "critical" ? "#DC2626" : p.priority === "urgent" ? "#EF4444" : p.priority === "high" ? "#F97316" : p.priority === "medium" ? "#3B82F6" : "#9CA3AF",
  }));

  const statusPieData = [
    { name: "Completed", value: stats.completed, color: "#10B981" },
    { name: "In Progress", value: stats.inProgress, color: "#3B82F6" },
    { name: "Pending", value: stats.pending, color: "#9CA3AF" },
    { name: "On Hold", value: stats.onHold, color: "#F59E0B" },
  ].filter(d => d.value > 0);

  return (
    <PageShell
      title="Task Dashboard"
      subtitle={`${stats.total} tasks across ${stats.byProject.length} projects`}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/tasks/table">
            <Button variant="outline" size="sm" icon={<ClipboardList size={14} />}>All Tasks</Button>
          </Link>
          <Link to="/admin/tasks/new">
            <Button variant="gold" size="sm" icon={<ClipboardList size={14} />}>New Task</Button>
          </Link>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard label="Total Tasks" value={stats.total} icon={<ClipboardList size={18} />} accent="navy" />
        <StatCard label="Completed" value={stats.completed} icon={<CheckCircle2 size={18} />} accent="green" trend={`${stats.completionRate}%`} trendDirection="up" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<TrendingUp size={18} />} accent="blue" />
        <StatCard label="Pending" value={stats.pending} icon={<Clock size={18} />} accent="purple" />
        <StatCard label="On Hold" value={stats.onHold} icon={<AlertTriangle size={18} />} accent="gold" />
        <Link to="/admin/tasks/table?status=overdue">
          <StatCard label="Overdue" value={stats.overdue} icon={<AlertTriangle size={18} />} accent="red" trend="Action needed" />
        </Link>
      </div>

      {/* Completion Rate Banner */}
      <div className="bg-card rounded-xl border border-border p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BarChart3 size={20} className="text-emerald-600" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Overall Completion Rate</p>
              <p className="text-muted-foreground" style={{ fontSize: 12.5 }}>
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>
          </div>
          <span className="text-emerald-600" style={{ fontSize: 28, fontWeight: 700 }}>{stats.completionRate}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" style={{ width: `${stats.completionRate}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Status Breakdown Pie */}
        <SummaryCard title="Status Breakdown">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart id="task-status-pie">
                <Pie key="task-status-pie-data" data={statusPieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {statusPieData.map((entry, i) => <Cell key={`task-status-cell-${i}`} fill={entry.color} />)}
                </Pie>
                <Tooltip key="task-status-tooltip" contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {statusPieData.map(s => (
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

        {/* Tasks by Role/Category Chart */}
        <div className="lg:col-span-2">
          <SummaryCard
            title="Task Distribution"
            actions={
              <TabBar
                tabs={[
                  { key: "role", label: "By Role" },
                  { key: "priority", label: "By Priority" },
                  { key: "category", label: "By Category" },
                ]}
                active={chartView}
                onChange={setChartView}
              />
            }
          >
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                {chartView === "role" ? (
                  <BarChart data={roleChartData} id="task-role-bar">
                    <CartesianGrid key="task-role-grid" strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                    <XAxis key="task-role-xaxis" dataKey="name" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                    <YAxis key="task-role-yaxis" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                    <Tooltip key="task-role-tooltip" contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                    <Bar key="task-role-completed" dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" name="Completed" />
                    <Bar key="task-role-inprogress" dataKey="inProgress" fill="#3B82F6" radius={[4, 4, 0, 0]} stackId="a" name="In Progress" />
                    <Bar key="task-role-pending" dataKey="pending" fill="#9CA3AF" radius={[4, 4, 0, 0]} stackId="a" name="Pending" />
                  </BarChart>
                ) : chartView === "priority" ? (
                  <BarChart data={priorityChartData} id="task-priority-bar">
                    <CartesianGrid key="task-prio-grid" strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                    <XAxis key="task-prio-xaxis" dataKey="name" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                    <YAxis key="task-prio-yaxis" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                    <Tooltip key="task-prio-tooltip" contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                    <Bar key="task-prio-bar" dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
                      {priorityChartData.map((entry, i) => <Cell key={`task-prio-cell-${i}`} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                ) : (
                  <BarChart data={categoryChartData} layout="vertical" id="task-category-bar">
                    <CartesianGrid key="task-cat-grid" strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                    <XAxis key="task-cat-xaxis" type="number" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                    <YAxis key="task-cat-yaxis" type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip key="task-cat-tooltip" contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                    <Bar key="task-cat-bar" dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                      {categoryChartData.map((entry, i) => <Cell key={`task-cat-cell-${i}`} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </SummaryCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Project Task Summary */}
        <SummaryCard title="Project Task Summary" actions={
          <Link to="/admin/tasks/projects" className="text-gold-dark hover:underline flex items-center gap-1" style={{ fontSize: 12, fontWeight: 500 }}>
            View All <ArrowRight size={12} />
          </Link>
        }>
          <div className="space-y-3">
            {stats.byProject.map(p => {
              const pct = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
              return (
                <Link key={p.coId} to={`/admin/tasks/projects?project=${p.coId}`} className="block p-3 rounded-lg bg-background border border-border hover:border-gold/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 500 }}>{p.projectName}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{p.coId} · {p.accountName}</p>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-muted-foreground shrink-0" style={{ fontSize: 11.5 }}>{p.completed}/{p.total}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-emerald-600" style={{ fontSize: 11.5 }}>{p.completed} done</span>
                    <span className="text-blue-600" style={{ fontSize: 11.5 }}>{p.inProgress} active</span>
                    <span className="text-muted-foreground" style={{ fontSize: 11.5 }}>{p.pending} pending</span>
                    {p.overdue > 0 && <span className="text-red-600" style={{ fontSize: 11.5 }}>{p.overdue} overdue</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </SummaryCard>

        {/* Team Workload */}
        <SummaryCard title="Team Workload" actions={
          <Link to="/admin/tasks/my-tasks" className="text-gold-dark hover:underline flex items-center gap-1" style={{ fontSize: 12, fontWeight: 500 }}>
            My Tasks <ArrowRight size={12} />
          </Link>
        }>
          <div className="space-y-2">
            {stats.byAssignee.sort((a, b) => b.total - a.total).map(a => {
              const pct = a.total > 0 ? Math.round((a.completed / a.total) * 100) : 0;
              return (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border">
                  <div className="w-9 h-9 rounded-full bg-navy/8 flex items-center justify-center shrink-0">
                    <Users size={14} className="text-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="truncate" style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</p>
                      <span className="text-muted-foreground ml-2" style={{ fontSize: 11.5 }}>{pct}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-muted-foreground" style={{ fontSize: 11 }}>{a.role}</span>
                      <span className="text-muted-foreground" style={{ fontSize: 11 }}>·</span>
                      <span className="text-emerald-600" style={{ fontSize: 11 }}>{a.completed}</span>
                      <span className="text-blue-600" style={{ fontSize: 11 }}>{a.inProgress} active</span>
                      {a.overdue > 0 && <span className="text-red-600" style={{ fontSize: 11 }}>{a.overdue} overdue</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SummaryCard>
      </div>

      {/* Recent / Overdue Tasks */}
      <SummaryCard title="Attention Required" actions={
        <Link to="/admin/tasks/table" className="text-gold-dark hover:underline flex items-center gap-1" style={{ fontSize: 12, fontWeight: 500 }}>
          View All <ArrowRight size={12} />
        </Link>
      }>
        <div className="space-y-2">
          {opsTasks
            .filter(t => t.isOverdue || t.status === "on_hold" || (t.status === "in_progress" && t.priority === "urgent"))
            .sort((a, b) => b.overdueDays - a.overdueDays)
            .map(t => (
              <Link key={t.id} to={`/admin/tasks/${t.id}`} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-gold/30 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    t.isOverdue ? "bg-red-100 text-red-600" : t.status === "on_hold" ? "bg-amber-100 text-amber-600" : "bg-orange-100 text-orange-600"
                  }`}>
                    {t.isOverdue ? <AlertTriangle size={14} /> : <Clock size={14} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate" style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>{t.id} · {t.projectName} · {t.assigneeName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {t.isOverdue && (
                    <span className="text-red-600 px-2 py-0.5 rounded-full bg-red-50 border border-red-200" style={{ fontSize: 10.5, fontWeight: 500 }}>
                      {t.overdueDays}d overdue
                    </span>
                  )}
                  <StatusBadge status={t.status} size="xs" />
                  <StatusBadge status={t.priority} size="xs" />
                </div>
              </Link>
            ))}
          {opsTasks.filter(t => t.isOverdue || t.status === "on_hold" || (t.status === "in_progress" && t.priority === "urgent")).length === 0 && (
            <div className="text-center py-8">
              <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
              <p className="text-muted-foreground" style={{ fontSize: 14 }}>All tasks are on track!</p>
            </div>
          )}
        </div>
      </SummaryCard>
    </PageShell>
  );
}