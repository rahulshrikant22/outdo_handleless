import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, DataTable, Pagination, Button,
} from "../../../components/shared";
import {
  opsTasks, categoryLabels, type OpsTask, type TaskStatus, type TaskPriority, type TaskCategory,
} from "../../../data/opsTasks";
import { convertedOrders } from "../../../data/operations";
import {
  ClipboardList, Plus, Download, AlertTriangle,
} from "lucide-react";

import { handleExport } from "../../../components/shared/GlobalModals";

export function TaskMasterTable() {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus === "overdue" ? "" : initialStatus);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showOverdueOnly, setShowOverdueOnly] = useState(initialStatus === "overdue");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = opsTasks.filter(t => {
    const q = search.toLowerCase();
    if (search && !t.id.toLowerCase().includes(q) && !t.title.toLowerCase().includes(q) && !t.assigneeName.toLowerCase().includes(q) && !t.projectName.toLowerCase().includes(q)) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    if (projectFilter && t.convertedOrderId !== projectFilter) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    if (showOverdueOnly && !t.isOverdue) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <PageShell
      title="Task Master Table"
      subtitle={`${filtered.length} of ${opsTasks.length} tasks`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Tasks")}>Export</Button>
          <Link to="/admin/tasks/new">
            <Button variant="gold" size="sm" icon={<Plus size={14} />}>New Task</Button>
          </Link>
        </div>
      }
    >
      {/* Overdue Toggle */}
      {opsTasks.some(t => t.isOverdue) && (
        <div className="mb-4">
          <button
            onClick={() => { setShowOverdueOnly(!showOverdueOnly); setPage(1); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              showOverdueOnly ? "bg-red-50 border-red-200 text-red-700" : "bg-card border-border text-muted-foreground hover:border-red-200"
            }`}
            style={{ fontSize: 12.5, fontWeight: 500 }}
          >
            <AlertTriangle size={14} />
            Show Overdue Only ({opsTasks.filter(t => t.isOverdue).length})
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Search tasks, projects, assignees..."
          filters={[
            {
              label: "Status", value: statusFilter,
              onChange: (v) => { setStatusFilter(v); setPage(1); },
              options: [
                { label: "Pending", value: "pending" },
                { label: "In Progress", value: "in_progress" },
                { label: "Completed", value: "completed" },
                { label: "On Hold", value: "on_hold" },
              ],
            },
            {
              label: "Priority", value: priorityFilter,
              onChange: (v) => { setPriorityFilter(v); setPage(1); },
              options: [
                { label: "Critical", value: "critical" },
                { label: "Urgent", value: "urgent" },
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },
              ],
            },
            {
              label: "Project", value: projectFilter,
              onChange: (v) => { setProjectFilter(v); setPage(1); },
              options: convertedOrders.map(co => ({ label: `${co.id} — ${co.projectName}`, value: co.id })),
            },
            {
              label: "Category", value: categoryFilter,
              onChange: (v) => { setCategoryFilter(v); setPage(1); },
              options: Object.entries(categoryLabels).map(([k, v]) => ({ label: v, value: k })),
            },
          ]}
        />
      </div>

      {/* Table */}
      <DataTable<OpsTask>
        keyField="id"
        data={paged}
        onRowClick={() => {}}
        emptyMessage="No tasks match your filters."
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
            key: "title", label: "Task",
            render: (t) => (
              <Link to={`/admin/tasks/${t.id}`} className="block min-w-0" onClick={(e) => e.stopPropagation()}>
                <p className="truncate max-w-[280px] hover:text-gold-dark" style={{ fontWeight: 500 }}>{t.title}</p>
                <p className="text-muted-foreground truncate max-w-[280px]" style={{ fontSize: 12 }}>{t.projectName}</p>
              </Link>
            ),
          },
          {
            key: "category", label: "Category", width: "100px",
            render: (t) => (
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontSize: 11 }}>
                {categoryLabels[t.category]}
              </span>
            ),
          },
          {
            key: "assignee", label: "Assignee",
            render: (t) => (
              <div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{t.assigneeName}</p>
                <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{t.assigneeRole}</p>
              </div>
            ),
          },
          {
            key: "status", label: "Status", width: "110px",
            render: (t) => (
              <div className="flex flex-col gap-1">
                <StatusBadge status={t.status} size="xs" />
                {t.isOverdue && (
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
            key: "due", label: "Due Date", width: "90px",
            render: (t) => (
              <span className={t.isOverdue ? "text-red-600" : "text-muted-foreground"} style={{ fontSize: 12, fontWeight: t.isOverdue ? 600 : 400 }}>
                {t.dueDate}
              </span>
            ),
          },
          {
            key: "completed", label: "Completed", width: "90px",
            render: (t) => (
              <span className={t.completedDate ? "text-emerald-600" : "text-muted-foreground"} style={{ fontSize: 12 }}>
                {t.completedDate || "—"}
              </span>
            ),
          },
        ]}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </PageShell>
  );
}