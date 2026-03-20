import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import {
  StatusBadge, FilterBar, DataTable, Pagination, Button, Modal, SummaryCard,
} from "../../../components/shared";
import {
  opsTasks, getTasksByAssignee, roleViewFilters, categoryLabels, type OpsTask,
} from "../../../data/opsTasks";
import { opsStaff } from "../../../data/operations";
import {
  ClipboardList, CheckCircle2, Clock, AlertTriangle, User, Eye,
} from "lucide-react";

export function MyTasks() {
  const [selectedRole, setSelectedRole] = useState("project_manager_rk");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [markDoneTask, setMarkDoneTask] = useState<OpsTask | null>(null);
  const [closureNote, setClosureNote] = useState("");
  const [markedDone, setMarkedDone] = useState<Set<string>>(new Set());
  const perPage = 10;

  const roleInfo = roleViewFilters[selectedRole];
  const staff = opsStaff.find(s => s.id === roleInfo.userId);

  // For Ops Head, show all tasks; for others, show their assigned tasks
  const myTasks = selectedRole === "operations_head"
    ? opsTasks
    : getTasksByAssignee(roleInfo.userId);

  const filtered = myTasks.filter(t => {
    const q = search.toLowerCase();
    if (search && !t.id.toLowerCase().includes(q) && !t.title.toLowerCase().includes(q) && !t.projectName.toLowerCase().includes(q)) return false;
    if (statusFilter === "overdue") return t.isOverdue && !markedDone.has(t.id);
    if (statusFilter && (markedDone.has(t.id) ? "completed" : t.status) !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const completed = myTasks.filter(t => t.status === "completed" || markedDone.has(t.id)).length;
  const inProgress = myTasks.filter(t => t.status === "in_progress" && !markedDone.has(t.id)).length;
  const overdue = myTasks.filter(t => t.isOverdue && !markedDone.has(t.id)).length;

  const handleMarkDone = () => {
    if (markDoneTask) {
      setMarkedDone(prev => new Set(prev).add(markDoneTask.id));
      setMarkDoneTask(null);
      setClosureNote("");
    }
  };

  return (
    <>
      <PageShell
        title="My Tasks"
        subtitle={`${roleInfo.label} — ${staff?.name || "All"}`}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/tasks/dashboard">
              <Button variant="ghost" size="sm" icon={<Eye size={14} />}>Dashboard</Button>
            </Link>
          </div>
        }
      >
        {/* Role Switcher */}
        <div className="mb-6">
          <p className="text-muted-foreground mb-2" style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.03em" }}>
            VIEW AS ROLE
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(roleViewFilters).map(([key, val]) => (
              <button
                key={key}
                onClick={() => { setSelectedRole(key); setPage(1); setSearch(""); setStatusFilter(""); }}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  selectedRole === key
                    ? "bg-navy text-white border-navy"
                    : "bg-card border-border text-muted-foreground hover:border-gold/30"
                }`}
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Tasks" value={myTasks.length} icon={<ClipboardList size={18} />} accent="navy" />
          <StatCard label="Completed" value={completed} icon={<CheckCircle2 size={18} />} accent="green" trend={`${myTasks.length > 0 ? Math.round((completed / myTasks.length) * 100) : 0}%`} trendDirection="up" />
          <StatCard label="In Progress" value={inProgress} icon={<Clock size={18} />} accent="blue" />
          <StatCard label="Overdue" value={overdue} icon={<AlertTriangle size={18} />} accent="red" />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FilterBar
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search my tasks..."
            filters={[
              {
                label: "Status", value: statusFilter,
                onChange: (v) => { setStatusFilter(v); setPage(1); },
                options: [
                  { label: "Pending", value: "pending" },
                  { label: "In Progress", value: "in_progress" },
                  { label: "Completed", value: "completed" },
                  { label: "On Hold", value: "on_hold" },
                  { label: "Overdue", value: "overdue" },
                ],
              },
            ]}
          />
        </div>

        {/* Table */}
        <DataTable<OpsTask>
          keyField="id"
          data={paged}
          onRowClick={() => {}}
          emptyMessage="No tasks found for this role."
          columns={[
            {
              key: "id", label: "ID", width: "80px",
              render: (t) => (
                <Link to={`/admin/tasks/${t.id}`} className="text-gold-dark hover:underline" style={{ fontSize: 12, fontWeight: 600 }} onClick={(e) => e.stopPropagation()}>
                  {t.id}
                </Link>
              ),
            },
            {
              key: "project", label: "Project / Account",
              render: (t) => (
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{t.projectName}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>{t.accountName} · {t.convertedOrderId}</p>
                </div>
              ),
            },
            {
              key: "title", label: "Task",
              render: (t) => (
                <div>
                  <p className="truncate max-w-[220px]" style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{categoryLabels[t.category]}</p>
                </div>
              ),
            },
            {
              key: "status", label: "Status", width: "110px",
              render: (t) => (
                <div className="flex flex-col gap-1">
                  <StatusBadge status={markedDone.has(t.id) ? "completed" : t.status} size="xs" />
                  {t.isOverdue && !markedDone.has(t.id) && (
                    <span className="text-red-600 px-1.5 py-0.5 rounded-full bg-red-50 border border-red-200 inline-flex items-center gap-1 w-fit" style={{ fontSize: 10 }}>
                      <AlertTriangle size={10} /> {t.overdueDays}d
                    </span>
                  )}
                </div>
              ),
            },
            {
              key: "priority", label: "Priority", width: "80px",
              render: (t) => <StatusBadge status={t.priority} size="xs" />,
            },
            {
              key: "allocated", label: "Allocated", width: "90px",
              render: (t) => <span className="text-muted-foreground" style={{ fontSize: 12 }}>{t.allocatedDate}</span>,
            },
            {
              key: "due", label: "Due", width: "90px",
              render: (t) => (
                <span className={t.isOverdue && !markedDone.has(t.id) ? "text-red-600" : "text-muted-foreground"} style={{ fontSize: 12, fontWeight: t.isOverdue && !markedDone.has(t.id) ? 600 : 400 }}>
                  {t.dueDate}
                </span>
              ),
            },
            {
              key: "completed", label: "Completed", width: "90px",
              render: (t) => (
                <span className={t.completedDate || markedDone.has(t.id) ? "text-emerald-600" : "text-muted-foreground"} style={{ fontSize: 12 }}>
                  {markedDone.has(t.id) ? "2026-03-17" : t.completedDate || "—"}
                </span>
              ),
            },
            {
              key: "action", label: "", width: "90px",
              render: (t) => (
                t.status !== "completed" && !markedDone.has(t.id) ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<CheckCircle2 size={13} />}
                    onClick={(e: any) => { e?.stopPropagation?.(); setMarkDoneTask(t); }}
                  >
                    Done
                  </Button>
                ) : (
                  <span className="text-emerald-500"><CheckCircle2 size={16} /></span>
                )
              ),
            },
          ]}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </PageShell>

      {/* Mark Done Modal */}
      <Modal open={!!markDoneTask} onClose={() => { setMarkDoneTask(null); setClosureNote(""); }} title="Mark Task as Done" size="sm">
        {markDoneTask && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-gold/5 border border-gold/20">
              <p style={{ fontSize: 13, fontWeight: 500 }}>{markDoneTask.title}</p>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: 12 }}>{markDoneTask.id} · {markDoneTask.projectName}</p>
            </div>

            {markDoneTask.isOverdue && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-600" />
                <p className="text-red-700" style={{ fontSize: 12.5 }}>
                  This task is {markDoneTask.overdueDays} days overdue (due: {markDoneTask.dueDate})
                </p>
              </div>
            )}

            <div>
              <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>
                Closure Note
              </label>
              <textarea
                value={closureNote}
                onChange={(e) => setClosureNote(e.target.value)}
                placeholder="What was completed? Any notes?"
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
                style={{ fontSize: 14 }}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => { setMarkDoneTask(null); setClosureNote(""); }}>Cancel</Button>
              <Button variant="gold" size="sm" icon={<CheckCircle2 size={14} />} onClick={handleMarkDone}>
                Mark Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
