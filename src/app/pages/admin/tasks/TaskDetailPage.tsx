import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import {
  StatusBadge, Button, TabBar, SummaryCard, DetailField, Modal,
} from "../../../components/shared";
import {
  opsTasks, getTaskById, getTasksByOrderId, categoryLabels, type OpsTask,
} from "../../../data/opsTasks";
import { getConvertedOrderById } from "../../../data/operations";
import {
  ClipboardList, CheckCircle2, Clock, AlertTriangle, ArrowLeft,
  User, Calendar, Layers, Tag, Link as LinkIcon, Edit, MessageSquare,
} from "lucide-react";

export function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const task = getTaskById(taskId || "");
  const [activeTab, setActiveTab] = useState("details");
  const [markDoneOpen, setMarkDoneOpen] = useState(false);
  const [closureNote, setClosureNote] = useState("");
  const [isMarkedDone, setIsMarkedDone] = useState(false);

  if (!task) {
    return (
      <PageShell title="Task Not Found" subtitle="The requested task could not be found.">
        <Link to="/admin/tasks/table">
          <Button variant="outline" size="sm" icon={<ArrowLeft size={14} />}>Back to Tasks</Button>
        </Link>
      </PageShell>
    );
  }

  const co = getConvertedOrderById(task.convertedOrderId);
  const projectTasks = getTasksByOrderId(task.convertedOrderId);
  const depTasks = task.dependencies.map(id => opsTasks.find(t => t.id === id)).filter(Boolean) as OpsTask[];
  const dependentOn = opsTasks.filter(t => t.dependencies.includes(task.id));

  const currentStatus = isMarkedDone ? "completed" : task.status;

  const handleMarkDone = () => {
    setIsMarkedDone(true);
    setMarkDoneOpen(false);
  };

  return (
    <>
      <PageShell
        title={task.id}
        subtitle={task.title}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/tasks/table">
              <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>Back</Button>
            </Link>
            <Link to={`/admin/tasks/${task.id}/edit`}>
              <Button variant="outline" size="sm" icon={<Edit size={14} />}>Edit</Button>
            </Link>
            {currentStatus !== "completed" && currentStatus !== "cancelled" && (
              <Button variant="gold" size="sm" icon={<CheckCircle2 size={14} />} onClick={() => setMarkDoneOpen(true)}>
                Mark Done
              </Button>
            )}
          </div>
        }
      >
        {/* Header Card */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              currentStatus === "completed" ? "bg-emerald-100 text-emerald-600" :
              task.isOverdue ? "bg-red-100 text-red-600" :
              currentStatus === "in_progress" ? "bg-blue-100 text-blue-600" :
              currentStatus === "on_hold" ? "bg-amber-100 text-amber-600" :
              "bg-gray-100 text-gray-500"
            }`}>
              {currentStatus === "completed" ? <CheckCircle2 size={22} /> :
               task.isOverdue ? <AlertTriangle size={22} /> :
               <ClipboardList size={22} />}
            </div>
            <div className="flex-1 min-w-0">
              <h2 style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>{task.title}</h2>
              <p className="text-muted-foreground mt-1" style={{ fontSize: 14, lineHeight: 1.5 }}>{task.description}</p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <StatusBadge status={currentStatus} size="md" />
                <StatusBadge status={task.priority} size="md" />
                <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>
                  {categoryLabels[task.category]}
                </span>
                {task.isOverdue && !isMarkedDone && (
                  <span className="text-red-600 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 flex items-center gap-1" style={{ fontSize: 12, fontWeight: 500 }}>
                    <AlertTriangle size={12} /> {task.overdueDays} days overdue
                  </span>
                )}
                {isMarkedDone && (
                  <span className="text-emerald-600 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center gap-1" style={{ fontSize: 12, fontWeight: 500 }}>
                    <CheckCircle2 size={12} /> Just completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <TabBar
          tabs={[
            { key: "details", label: "Details" },
            { key: "dependencies", label: "Dependencies", count: depTasks.length + dependentOn.length },
            { key: "project", label: "Project Tasks", count: projectTasks.length },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === "details" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assignment Info */}
              <SummaryCard title="Assignment">
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Assignee" value={
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-navy/8 flex items-center justify-center">
                        <User size={13} className="text-navy" />
                      </div>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 500 }}>{task.assigneeName}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{task.assigneeRole}</p>
                      </div>
                    </div>
                  } />
                  <DetailField label="Department" value={task.assigneeDepartment} />
                  <DetailField label="Created By" value={task.createdByName} />
                  <DetailField label="Task ID" value={task.id} />
                </div>
              </SummaryCard>

              {/* Dates */}
              <SummaryCard title="Timeline">
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Allocated Date" value={
                    <span className="flex items-center gap-1.5"><Calendar size={13} className="text-muted-foreground" /> {task.allocatedDate}</span>
                  } />
                  <DetailField label="Due Date" value={
                    <span className={`flex items-center gap-1.5 ${task.isOverdue && !isMarkedDone ? "text-red-600" : ""}`}>
                      <Calendar size={13} className={task.isOverdue && !isMarkedDone ? "text-red-500" : "text-muted-foreground"} />
                      {task.dueDate}
                    </span>
                  } />
                  <DetailField label="Completed Date" value={
                    isMarkedDone ? (
                      <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={13} /> 2026-03-17</span>
                    ) : task.completedDate ? (
                      <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={13} /> {task.completedDate}</span>
                    ) : "—"
                  } />
                  <DetailField label="Duration" value={
                    task.completedDate
                      ? `${Math.ceil((new Date(task.completedDate).getTime() - new Date(task.allocatedDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                      : `${Math.ceil((new Date("2026-03-17").getTime() - new Date(task.allocatedDate).getTime()) / (1000 * 60 * 60 * 24))} days (ongoing)`
                  } />
                </div>
              </SummaryCard>

              {/* Project Context */}
              <SummaryCard title="Project Context">
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Converted Order" value={
                    <Link to={`/admin/operations/${task.convertedOrderId}`} className="text-gold-dark hover:underline flex items-center gap-1">
                      <LinkIcon size={12} /> {task.convertedOrderId}
                    </Link>
                  } />
                  <DetailField label="Project" value={task.projectName} />
                  <DetailField label="Account" value={task.accountName} />
                  <DetailField label="Account ID" value={task.accountId} />
                </div>
                {co && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>Production Status</p>
                      <StatusBadge status={co.productionStatus} size="xs" />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>Dispatch Status</p>
                      <StatusBadge status={co.dispatchStatus} size="xs" />
                    </div>
                  </div>
                )}
              </SummaryCard>

              {/* Tags & Notes */}
              <SummaryCard title="Tags & Notes">
                <div className="mb-3">
                  <p className="text-muted-foreground mb-2" style={{ fontSize: 12, fontWeight: 500 }}>Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-gold/10 text-gold-dark border border-gold/20" style={{ fontSize: 11.5 }}>
                        <Tag size={10} className="inline mr-1" />{tag}
                      </span>
                    ))}
                  </div>
                </div>
                {(task.closureNote || isMarkedDone) && (
                  <div>
                    <p className="text-muted-foreground mb-1" style={{ fontSize: 12, fontWeight: 500 }}>Closure Note</p>
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <p className="text-emerald-800" style={{ fontSize: 13, lineHeight: 1.5 }}>
                        {isMarkedDone && closureNote ? closureNote : task.closureNote}
                      </p>
                    </div>
                  </div>
                )}
              </SummaryCard>
            </div>
          )}

          {activeTab === "dependencies" && (
            <div className="space-y-6">
              {depTasks.length > 0 && (
                <SummaryCard title="Depends On (Prerequisites)">
                  <div className="space-y-2">
                    {depTasks.map(dt => (
                      <Link key={dt.id} to={`/admin/tasks/${dt.id}`} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-gold/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            dt.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
                          }`}>
                            {dt.status === "completed" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 500 }}>{dt.title}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 12 }}>{dt.id} · {dt.assigneeName}</p>
                          </div>
                        </div>
                        <StatusBadge status={dt.status} size="xs" />
                      </Link>
                    ))}
                  </div>
                </SummaryCard>
              )}

              {dependentOn.length > 0 && (
                <SummaryCard title="Blocks (Downstream Tasks)">
                  <div className="space-y-2">
                    {dependentOn.map(dt => (
                      <Link key={dt.id} to={`/admin/tasks/${dt.id}`} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-gold/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            dt.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                          }`}>
                            {dt.status === "completed" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 500 }}>{dt.title}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 12 }}>{dt.id} · {dt.assigneeName}</p>
                          </div>
                        </div>
                        <StatusBadge status={dt.status} size="xs" />
                      </Link>
                    ))}
                  </div>
                </SummaryCard>
              )}

              {depTasks.length === 0 && dependentOn.length === 0 && (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <Layers size={28} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground" style={{ fontSize: 14, fontWeight: 500 }}>No dependencies</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "project" && (
            <SummaryCard title={`Tasks for ${task.projectName}`}>
              <div className="space-y-2">
                {projectTasks.map(pt => (
                  <Link
                    key={pt.id}
                    to={`/admin/tasks/${pt.id}`}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      pt.id === task.id ? "bg-gold/5 border-gold/30" : "bg-background border-border hover:border-gold/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        pt.id === task.id && isMarkedDone ? "bg-emerald-100 text-emerald-600" :
                        pt.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                        pt.status === "in_progress" ? "bg-blue-100 text-blue-600" :
                        pt.status === "on_hold" ? "bg-amber-100 text-amber-600" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {(pt.status === "completed" || (pt.id === task.id && isMarkedDone)) ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate" style={{ fontSize: 13, fontWeight: pt.id === task.id ? 600 : 500 }}>
                          {pt.title} {pt.id === task.id && <span className="text-gold-dark">(current)</span>}
                        </p>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>{pt.assigneeName} · {categoryLabels[pt.category]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={pt.id === task.id && isMarkedDone ? "completed" : pt.status} size="xs" />
                      {pt.isOverdue && !(pt.id === task.id && isMarkedDone) && (
                        <span className="text-red-500" style={{ fontSize: 10 }}><AlertTriangle size={12} /></span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </SummaryCard>
          )}
        </div>
      </PageShell>

      {/* Mark Done Modal */}
      <Modal open={markDoneOpen} onClose={() => setMarkDoneOpen(false)} title="Mark Task as Done" size="sm">
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-gold/5 border border-gold/20">
            <p style={{ fontSize: 13, fontWeight: 500 }}>{task.title}</p>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: 12 }}>{task.id} · {task.assigneeName}</p>
          </div>

          <div>
            <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>
              Closure Note <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              value={closureNote}
              onChange={(e) => setClosureNote(e.target.value)}
              placeholder="Add a note about what was completed..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
              style={{ fontSize: 14 }}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setMarkDoneOpen(false)}>Cancel</Button>
            <Button variant="gold" size="sm" icon={<CheckCircle2 size={14} />} onClick={handleMarkDone}>
              Confirm — Mark Done
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
