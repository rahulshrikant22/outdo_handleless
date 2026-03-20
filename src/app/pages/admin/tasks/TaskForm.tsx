import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import {
  Button, InputField, SelectField, DateField, SummaryCard,
} from "../../../components/shared";
import { getTaskById, categoryLabels, type TaskCategory, type TaskPriority, type TaskStatus } from "../../../data/opsTasks";
import { convertedOrders, opsStaff } from "../../../data/operations";
import { ArrowLeft, Save, ClipboardList } from "lucide-react";

export function TaskForm() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!taskId;
  const existing = isEdit ? getTaskById(taskId) : null;

  const [form, setForm] = useState({
    title: existing?.title || "",
    description: existing?.description || "",
    convertedOrderId: existing?.convertedOrderId || "",
    category: existing?.category || "",
    priority: existing?.priority || "medium",
    status: existing?.status || "pending",
    assigneeId: existing?.assigneeId || "",
    allocatedDate: existing?.allocatedDate || "2026-03-17",
    dueDate: existing?.dueDate || "",
    tags: existing?.tags.join(", ") || "",
  });

  const [saved, setSaved] = useState(false);

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      if (isEdit) {
        navigate(`/admin/tasks/${taskId}`);
      } else {
        navigate("/admin/tasks/table");
      }
    }, 1200);
  };

  return (
    <PageShell
      title={isEdit ? `Edit ${taskId}` : "New Task"}
      subtitle={isEdit ? existing?.title : "Create a new task linked to a converted order"}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/tasks/table">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>Back</Button>
          </Link>
          <Button
            variant="gold"
            size="sm"
            icon={saved ? undefined : <Save size={14} />}
            onClick={handleSave}
            disabled={saved || !form.title || !form.convertedOrderId || !form.assigneeId || !form.dueDate}
          >
            {saved ? "Saved!" : isEdit ? "Update Task" : "Create Task"}
          </Button>
        </div>
      }
    >
      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <ClipboardList size={16} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-emerald-800" style={{ fontSize: 14, fontWeight: 500 }}>
              Task {isEdit ? "updated" : "created"} successfully!
            </p>
            <p className="text-emerald-700" style={{ fontSize: 12.5 }}>Redirecting...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <SummaryCard title="Task Information">
          <div className="space-y-4">
            <InputField
              label="Task Title *"
              placeholder="e.g., Design validation — kitchen layout"
              value={form.title}
              onChange={(v) => update("title", v)}
            />
            <div>
              <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the task in detail..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
                style={{ fontSize: 14 }}
              />
            </div>
            <SelectField
              label="Category *"
              value={form.category}
              onChange={(v) => update("category", v)}
              placeholder="Select category"
              options={Object.entries(categoryLabels).map(([k, v]) => ({ label: v, value: k }))}
            />
            <InputField
              label="Tags"
              placeholder="kitchen, cutlist, design-review (comma separated)"
              value={form.tags}
              onChange={(v) => update("tags", v)}
            />
          </div>
        </SummaryCard>

        {/* Assignment & Project */}
        <SummaryCard title="Assignment & Project">
          <div className="space-y-4">
            <SelectField
              label="Converted Order *"
              value={form.convertedOrderId}
              onChange={(v) => update("convertedOrderId", v)}
              placeholder="Select project"
              options={convertedOrders.map(co => ({
                label: `${co.id} — ${co.projectName} (${co.accountName})`,
                value: co.id,
              }))}
            />
            <SelectField
              label="Assignee *"
              value={form.assigneeId}
              onChange={(v) => update("assigneeId", v)}
              placeholder="Select team member"
              options={opsStaff.map(s => ({
                label: `${s.name} — ${s.role} (${s.department})`,
                value: s.id,
              }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Priority"
                value={form.priority}
                onChange={(v) => update("priority", v)}
                options={[
                  { label: "Critical", value: "critical" },
                  { label: "Urgent", value: "urgent" },
                  { label: "High", value: "high" },
                  { label: "Medium", value: "medium" },
                  { label: "Low", value: "low" },
                ]}
              />
              <SelectField
                label="Status"
                value={form.status}
                onChange={(v) => update("status", v)}
                options={[
                  { label: "Pending", value: "pending" },
                  { label: "In Progress", value: "in_progress" },
                  { label: "Completed", value: "completed" },
                  { label: "On Hold", value: "on_hold" },
                  { label: "Cancelled", value: "cancelled" },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DateField
                label="Allocated Date"
                value={form.allocatedDate}
                onChange={(v) => update("allocatedDate", v)}
              />
              <DateField
                label="Due Date *"
                value={form.dueDate}
                onChange={(v) => update("dueDate", v)}
              />
            </div>
          </div>
        </SummaryCard>
      </div>

      {/* Selected project preview */}
      {form.convertedOrderId && (
        <div className="mt-6">
          <SummaryCard title="Project Preview">
            {(() => {
              const co = convertedOrders.find(c => c.id === form.convertedOrderId);
              if (!co) return null;
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>Project</p>
                    <p style={{ fontSize: 13.5, fontWeight: 500 }}>{co.projectName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>Account</p>
                    <p style={{ fontSize: 13.5, fontWeight: 500 }}>{co.accountName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>City</p>
                    <p style={{ fontSize: 13.5, fontWeight: 500 }}>{co.city}, {co.state}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>Value</p>
                    <p style={{ fontSize: 13.5, fontWeight: 500 }}>₹{co.quotationAmount.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              );
            })()}
          </SummaryCard>
        </div>
      )}
    </PageShell>
  );
}
