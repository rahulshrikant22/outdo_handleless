import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import {
  StatusBadge, SummaryCard, Button, TabBar, Modal,
} from "../../../components/shared";
import {
  opsTasks, getTasksByOrderId, categoryLabels, getTaskDashboardStats, type OpsTask,
} from "../../../data/opsTasks";
import { convertedOrders } from "../../../data/operations";
import {
  ClipboardList, CheckCircle2, Clock, AlertTriangle, ArrowLeft,
  Layers, ArrowRight,
} from "lucide-react";

export function ProjectTaskSummary() {
  const [searchParams] = useSearchParams();
  const initialProject = searchParams.get("project") || "";

  const [selectedProject, setSelectedProject] = useState(initialProject || convertedOrders[0]?.id || "");
  const [markDoneTask, setMarkDoneTask] = useState<OpsTask | null>(null);
  const [closureNote, setClosureNote] = useState("");
  const [markedDone, setMarkedDone] = useState<Set<string>>(new Set());

  const stats = getTaskDashboardStats();
  const projectTasks = getTasksByOrderId(selectedProject);
  const co = convertedOrders.find(c => c.id === selectedProject);

  const completed = projectTasks.filter(t => t.status === "completed" || markedDone.has(t.id)).length;
  const inProgress = projectTasks.filter(t => t.status === "in_progress" && !markedDone.has(t.id)).length;
  const pending = projectTasks.filter(t => (t.status === "pending" || t.status === "on_hold") && !markedDone.has(t.id)).length;
  const overdue = projectTasks.filter(t => t.isOverdue && !markedDone.has(t.id)).length;
  const pct = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;

  // Group by category
  const categories = [...new Set(projectTasks.map(t => t.category))];

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
        title="Project Task Summary"
        subtitle="Task progress per converted order"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/tasks/dashboard">
              <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>Dashboard</Button>
            </Link>
          </div>
        }
      >
        {/* Project Selector */}
        <div className="mb-6">
          <TabBar
            tabs={convertedOrders.map(c => ({
              key: c.id,
              label: `${c.id} — ${c.projectName}`,
              count: getTasksByOrderId(c.id).length,
            }))}
            active={selectedProject}
            onChange={setSelectedProject}
          />
        </div>

        {co && (
          <>
            {/* Project Header */}
            <div className="bg-card rounded-xl border border-border p-5 mb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600 }}>{co.projectName}</h3>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: 13.5 }}>
                    {co.accountName} · {co.city} · {co.id}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={co.productionStatus} size="sm" />
                  <StatusBadge status={co.dispatchStatus} size="sm" />
                  <Link to={`/admin/operations/${co.id}`}>
                    <Button variant="outline" size="sm" icon={<ArrowRight size={13} />}>View Order</Button>
                  </Link>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>Task Completion</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-emerald-600" style={{ fontSize: 12 }}>{completed} completed</span>
                  <span className="text-blue-600" style={{ fontSize: 12 }}>{inProgress} in progress</span>
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>{pending} pending</span>
                  {overdue > 0 && <span className="text-red-600" style={{ fontSize: 12 }}>{overdue} overdue</span>}
                </div>
              </div>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Total Tasks" value={projectTasks.length} icon={<ClipboardList size={18} />} accent="navy" />
              <StatCard label="Completed" value={completed} icon={<CheckCircle2 size={18} />} accent="green" />
              <StatCard label="In Progress" value={inProgress} icon={<Clock size={18} />} accent="blue" />
              <StatCard label="Overdue" value={overdue} icon={<AlertTriangle size={18} />} accent="red" />
            </div>

            {/* Tasks grouped by category */}
            <div className="space-y-6">
              {categories.map(cat => {
                const catTasks = projectTasks.filter(t => t.category === cat);
                const catCompleted = catTasks.filter(t => t.status === "completed" || markedDone.has(t.id)).length;
                return (
                  <SummaryCard
                    key={cat}
                    title={`${categoryLabels[cat]} (${catCompleted}/${catTasks.length})`}
                    actions={
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>
                        {catTasks.length > 0 ? Math.round((catCompleted / catTasks.length) * 100) : 0}% done
                      </span>
                    }
                  >
                    <div className="space-y-2">
                      {catTasks.map(t => {
                        const isDone = t.status === "completed" || markedDone.has(t.id);
                        return (
                          <div
                            key={t.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                              isDone ? "bg-emerald-50/50 border-emerald-200/50" : t.isOverdue ? "bg-red-50/50 border-red-200" : "bg-background border-border"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isDone ? "bg-emerald-100 text-emerald-600" :
                                t.isOverdue ? "bg-red-100 text-red-600" :
                                t.status === "in_progress" ? "bg-blue-100 text-blue-600" :
                                t.status === "on_hold" ? "bg-amber-100 text-amber-600" :
                                "bg-gray-100 text-gray-500"
                              }`}>
                                {isDone ? <CheckCircle2 size={14} /> : t.isOverdue ? <AlertTriangle size={14} /> : <Clock size={14} />}
                              </div>
                              <div className="min-w-0">
                                <Link to={`/admin/tasks/${t.id}`} className="hover:text-gold-dark">
                                  <p className={`truncate ${isDone ? "line-through text-muted-foreground" : ""}`} style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</p>
                                </Link>
                                <p className="text-muted-foreground" style={{ fontSize: 12 }}>
                                  {t.assigneeName} · Due: {t.dueDate}
                                  {t.completedDate && ` · Done: ${t.completedDate}`}
                                  {markedDone.has(t.id) && " · Done: 2026-03-17"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <StatusBadge status={t.priority} size="xs" />
                              {!isDone && t.isOverdue && (
                                <span className="text-red-600 px-1.5 py-0.5 rounded-full bg-red-50 border border-red-200" style={{ fontSize: 10 }}>
                                  {t.overdueDays}d
                                </span>
                              )}
                              {!isDone && (
                                <button
                                  onClick={() => setMarkDoneTask(t)}
                                  className="w-7 h-7 rounded-lg hover:bg-emerald-100 flex items-center justify-center transition-colors text-muted-foreground hover:text-emerald-600"
                                >
                                  <CheckCircle2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </SummaryCard>
                );
              })}
            </div>

            {/* Team assigned to this project */}
            <div className="mt-6">
              <SummaryCard title="Project Team">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {co.roles.map(r => {
                    const memberTasks = projectTasks.filter(t => t.assigneeId === r.userId);
                    const memberCompleted = memberTasks.filter(t => t.status === "completed" || markedDone.has(t.id)).length;
                    return (
                      <div key={r.role} className="p-3 rounded-lg bg-background border border-border">
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{r.userName}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{r.roleLabel}</p>
                        {memberTasks.length > 0 && (
                          <p className="text-emerald-600 mt-1" style={{ fontSize: 11.5 }}>
                            {memberCompleted}/{memberTasks.length} tasks done
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </SummaryCard>
            </div>
          </>
        )}
      </PageShell>

      {/* Mark Done Modal */}
      <Modal open={!!markDoneTask} onClose={() => { setMarkDoneTask(null); setClosureNote(""); }} title="Mark Task as Done" size="sm">
        {markDoneTask && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-gold/5 border border-gold/20">
              <p style={{ fontSize: 13, fontWeight: 500 }}>{markDoneTask.title}</p>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: 12 }}>{markDoneTask.id} · {markDoneTask.assigneeName}</p>
            </div>
            <div>
              <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Closure Note</label>
              <textarea
                value={closureNote}
                onChange={(e) => setClosureNote(e.target.value)}
                placeholder="What was completed?"
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
                style={{ fontSize: 14 }}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => { setMarkDoneTask(null); setClosureNote(""); }}>Cancel</Button>
              <Button variant="gold" size="sm" icon={<CheckCircle2 size={14} />} onClick={handleMarkDone}>Mark Done</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
