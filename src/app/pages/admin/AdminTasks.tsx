import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, SortableDataTable, Button, Drawer,
  DetailField, SummaryCard, RowActions, Tooltip
} from "../../components/shared";
import { tasks, getUserById, getOrderById, getAccountById } from "../../data";
import { Plus, Download, ClipboardList, Play, CheckCircle2 } from "lucide-react";
import { handleExport, EditTaskModal } from "../../components/shared/GlobalModals";
import { toast } from "sonner";

export function AdminTasks() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selected, setSelected] = useState<typeof tasks[0] | null>(null);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    return true;
  });

  const activeFilters = [statusFilter, priorityFilter].filter(Boolean).length;

  return (
    <PageShell
      title="Tasks"
      subtitle={`${tasks.length} tasks · ${tasks.filter(t => t.status === "in_progress").length} in progress · ${tasks.filter(t => t.status === "pending").length} pending`}
      actions={
        <div className="flex items-center gap-2">
          <Tooltip text="Export task list">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Tasks")}>Export</Button>
          </Tooltip>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => navigate("/admin/tasks/new")}>New Task</Button>
        </div>
      }
    >
      <div className="mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by task name or ID..."
          filters={[
            {
              label: "All Statuses",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: "Pending", value: "pending" },
                { label: "In Progress", value: "in_progress" },
                { label: "Completed", value: "completed" },
                { label: "On Hold", value: "on_hold" },
              ],
            },
            {
              label: "All Priorities",
              value: priorityFilter,
              onChange: setPriorityFilter,
              options: [
                { label: "Low", value: "low" },
                { label: "Medium", value: "medium" },
                { label: "High", value: "high" },
                { label: "Urgent", value: "urgent" },
              ],
            },
          ]}
          actions={activeFilters > 0 ? (
            <button onClick={() => { setStatusFilter(""); setPriorityFilter(""); }} className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 12.5 }}>
              Clear {activeFilters} filter{activeFilters > 1 ? "s" : ""}
            </button>
          ) : undefined}
        />
      </div>

      <SortableDataTable
        data={filtered}
        keyField="id"
        pageSize={8}
        onRowClick={(t) => setSelected(t)}
        rowActions={(t) => (
          <RowActions onView={() => setSelected(t)} onEdit={() => {}} onDelete={() => {}} />
        )}
        columns={[
          { key: "id", label: "ID", width: "70px", sortable: true, render: (t) => <span className="text-muted-foreground" style={{ fontSize: 12.5 }}>{t.id}</span> },
          {
            key: "title", label: "Task", sortable: true,
            render: (t) => <p style={{ fontSize: 13.5, fontWeight: 500 }}>{t.title}</p>,
          },
          {
            key: "orderId", label: "Order", sortable: true,
            render: (t) => {
              const order = getOrderById(t.orderId);
              const acc = order ? getAccountById(order.accountId) : null;
              return (
                <div>
                  <p style={{ fontSize: 13 }}>{t.orderId}</p>
                  {acc && <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{acc.company}</p>}
                </div>
              );
            },
          },
          {
            key: "assignee", label: "Assignee", sortable: true,
            sortValue: (t) => getUserById(t.assigneeId)?.name || "",
            render: (t) => getUserById(t.assigneeId)?.name || "—",
          },
          {
            key: "priority", label: "Priority", sortable: true,
            render: (t) => <StatusBadge status={t.priority} size="xs" />,
          },
          { key: "dueDate", label: "Due Date", sortable: true, tooltip: "Task deadline" },
          {
            key: "status", label: "Status", sortable: true,
            render: (t) => <StatusBadge status={t.status} />,
          },
        ]}
      />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected ? selected.title : ""}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-navy/8 flex items-center justify-center">
                <ClipboardList size={20} className="text-navy" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 15, fontWeight: 600 }}>{selected.title}</p>
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>{selected.id} · {selected.orderId}</p>
              </div>
              <StatusBadge status={selected.status} size="md" />
            </div>

            <SummaryCard title="Task Details">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Assignee" value={getUserById(selected.assigneeId)?.name || "—"} />
                <DetailField label="Priority" value={<StatusBadge status={selected.priority} size="sm" />} />
                <DetailField label="Order" value={selected.orderId} />
                <DetailField label="Due Date" value={selected.dueDate} />
                <DetailField label="Created" value={selected.createdAt} />
                <DetailField label="Status" value={<StatusBadge status={selected.status} size="sm" />} />
              </div>
            </SummaryCard>

            <div className="flex gap-2 pt-2">
              {selected.status === "pending" && (
                <Button variant="primary" size="sm" className="flex-1" icon={<Play size={14} />} onClick={() => toast.success("Task started", { description: `${selected.title} is now in progress.` })}>Start Task</Button>
              )}
              {selected.status === "in_progress" && (
                <Button variant="gold" size="sm" className="flex-1" icon={<CheckCircle2 size={14} />} onClick={() => toast.success("Task completed", { description: `${selected.title} marked as complete.` })}>Complete</Button>
              )}
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditTaskOpen(true)}>Edit</Button>
            </div>
          </div>
        )}
      </Drawer>

      <EditTaskModal open={editTaskOpen} onClose={() => setEditTaskOpen(false)} task={selected} />
    </PageShell>
  );
}
