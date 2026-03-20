import { useState } from "react";
import { PageShell } from "../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, Button, Drawer, DetailField, SummaryCard, TabBar, Tooltip
} from "../../components/shared";
import { tasks, getUserById, getOrderById, getAccountById } from "../../data";
import { ClipboardList, CheckCircle2, Clock, AlertCircle, Play, Download } from "lucide-react";
import { handleExport } from "../../components/shared/GlobalModals";
import { toast } from "sonner";

const factoryTasks = tasks.filter(t => t.assigneeId === "U007" || t.assigneeId === "U008");

export function FactoryTasks() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<typeof tasks[0] | null>(null);

  const filteredTasks = statusFilter === "all" ? factoryTasks : factoryTasks.filter(t => t.status === statusFilter);

  const statusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 size={16} className="text-emerald-500" />;
    if (status === "in_progress") return <Clock size={16} className="text-blue-500" />;
    return <AlertCircle size={16} className="text-gray-400" />;
  };

  return (
    <PageShell
      title="Tasks"
      subtitle={`${factoryTasks.length} factory tasks · ${factoryTasks.filter(t => t.status === "in_progress").length} in progress`}
      actions={
        <Tooltip text="Export task list">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Factory Tasks")}>Export</Button>
        </Tooltip>
      }
    >
      <div className="mb-4">
        <FilterBar
          searchValue=""
          onSearchChange={() => {}}
          searchPlaceholder="Search tasks..."
          filters={[]}
        />
      </div>

      <TabBar
        tabs={[
          { key: "all", label: "All", count: factoryTasks.length },
          { key: "in_progress", label: "In Progress", count: factoryTasks.filter(t => t.status === "in_progress").length },
          { key: "pending", label: "Pending", count: factoryTasks.filter(t => t.status === "pending").length },
          { key: "completed", label: "Completed", count: factoryTasks.filter(t => t.status === "completed").length },
        ]}
        active={statusFilter}
        onChange={setStatusFilter}
      />

      <div className="mt-4 space-y-2">
        {filteredTasks.map((task) => {
          const order = getOrderById(task.orderId);
          const acc = order ? getAccountById(order.accountId) : null;
          return (
            <div
              key={task.id}
              onClick={() => setSelected(task)}
              className="bg-card rounded-xl border border-border p-4 hover:border-amber-300 transition-all cursor-pointer flex items-center gap-4"
            >
              {statusIcon(task.status)}
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 13.5, fontWeight: 500 }}>{task.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>{task.orderId}</span>
                  {acc && <span className="text-muted-foreground" style={{ fontSize: 12 }}>{acc.company}</span>}
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>Due: {task.dueDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={task.priority} size="xs" />
                <StatusBadge status={task.status} size="xs" />
              </div>
            </div>
          );
        })}
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.title || ""}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <ClipboardList size={20} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 15, fontWeight: 600 }}>{selected.title}</p>
                <StatusBadge status={selected.status} size="sm" />
              </div>
            </div>

            <SummaryCard title="Task Details">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Assignee" value={getUserById(selected.assigneeId)?.name || "—"} />
                <DetailField label="Priority" value={<StatusBadge status={selected.priority} size="sm" />} />
                <DetailField label="Order" value={selected.orderId} />
                <DetailField label="Due Date" value={selected.dueDate} />
                <DetailField label="Created" value={selected.createdAt} />
                {getOrderById(selected.orderId) && (
                  <DetailField label="Client" value={getAccountById(getOrderById(selected.orderId)!.accountId)?.company || "—"} />
                )}
              </div>
            </SummaryCard>

            <div className="flex gap-2 pt-2">
              {selected.status === "pending" && (
                <Button variant="primary" size="sm" className="flex-1" icon={<Play size={14} />} onClick={() => toast.success("Task started", { description: `${selected.title} is now in progress.` })}>Start Task</Button>
              )}
              {selected.status === "in_progress" && (
                <Button variant="gold" size="sm" className="flex-1" icon={<CheckCircle2 size={14} />} onClick={() => toast.success("Task completed", { description: `${selected.title} marked as complete.` })}>Mark Complete</Button>
              )}
              <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.info("Opening task editor...", { description: `Editing ${selected.title}` })}>Edit</Button>
            </div>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}