import { useState } from "react";
import { PageShell } from "../../components/layout/PageShell";
import { StatCard } from "../../components/layout/StatCard";
import {
  StatusBadge, FilterBar, SortableDataTable, Button, Drawer,
  DetailField, SummaryCard, RowActions, Tooltip
} from "../../components/shared";
import { payments, getAccountById, getOrderById } from "../../data";
import { Plus, Download, CreditCard, IndianRupee, Receipt, AlertCircle } from "lucide-react";
import { handleExport, RecordPaymentModal } from "../../components/shared/GlobalModals";
import { toast } from "sonner";

const totalCollected = payments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
const totalPending = payments.filter(p => p.status !== "completed").reduce((s, p) => s + p.amount, 0);

export function AdminPayments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [selected, setSelected] = useState<typeof payments[0] | null>(null);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);

  const filtered = payments.filter((p) => {
    const acc = getAccountById(p.accountId);
    if (search && !p.id.toLowerCase().includes(search.toLowerCase()) && !(acc?.company || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (methodFilter && p.method !== methodFilter) return false;
    return true;
  });

  const methods = [...new Set(payments.map(p => p.method))];
  const activeFilters = [statusFilter, methodFilter].filter(Boolean).length;

  return (
    <PageShell
      title="Payments"
      subtitle={`${payments.length} payment records · ₹${(totalCollected / 100000).toFixed(1)}L collected`}
      actions={
        <div className="flex items-center gap-2">
          <Tooltip text="Export payment records">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Payments")}>Export</Button>
          </Tooltip>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setRecordPaymentOpen(true)}>Record Payment</Button>
        </div>
      }
    >
      {/* Payment Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Collected" value={`₹${(totalCollected / 1000).toFixed(0)}K`} icon={<CreditCard size={18} />} accent="green" trendDirection="up" trend="50% of pipeline" />
        <StatCard label="Pending" value={`₹${(totalPending / 1000).toFixed(0)}K`} icon={<IndianRupee size={18} />} accent="gold" trend={`${payments.filter(p => p.status === "pending").length} invoices`} />
        <StatCard label="Overdue" value={payments.filter(p => p.status === "overdue").length} icon={<AlertCircle size={18} />} accent="red" trend="Needs attention" trendDirection="down" />
        <StatCard label="Avg. Collection" value="18 days" icon={<Receipt size={18} />} accent="blue" trend="Within SLA" />
      </div>

      <div className="mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by payment ID or account..."
          filters={[
            {
              label: "All Statuses",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: "Pending", value: "pending" },
                { label: "Partial", value: "partial" },
                { label: "Completed", value: "completed" },
                { label: "Overdue", value: "overdue" },
              ],
            },
            {
              label: "All Methods",
              value: methodFilter,
              onChange: setMethodFilter,
              options: methods.map(m => ({ label: m.replace(/_/g, " "), value: m })),
            },
          ]}
          actions={activeFilters > 0 ? (
            <button onClick={() => { setStatusFilter(""); setMethodFilter(""); }} className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 12.5 }}>
              Clear {activeFilters} filter{activeFilters > 1 ? "s" : ""}
            </button>
          ) : undefined}
        />
      </div>

      <SortableDataTable
        data={filtered}
        keyField="id"
        pageSize={8}
        onRowClick={(p) => setSelected(p)}
        rowActions={(p) => (
          <RowActions
            onView={() => setSelected(p)}
            onEdit={() => {}}
          />
        )}
        columns={[
          { key: "id", label: "ID", width: "80px", sortable: true, render: (p) => <span style={{ fontSize: 13, fontWeight: 600 }}>{p.id}</span> },
          {
            key: "account", label: "Account", sortable: true,
            sortValue: (p) => getAccountById(p.accountId)?.company || "",
            render: (p) => <p style={{ fontSize: 13.5, fontWeight: 500 }}>{getAccountById(p.accountId)?.company}</p>,
          },
          { key: "orderId", label: "Order", sortable: true },
          {
            key: "amount", label: "Amount", align: "right" as const, sortable: true,
            render: (p) => <span style={{ fontWeight: 600 }}>₹{p.amount.toLocaleString("en-IN")}</span>,
          },
          {
            key: "method", label: "Method", sortable: true,
            render: (p) => <span className="capitalize">{p.method.replace(/_/g, " ")}</span>,
          },
          { key: "dueDate", label: "Due Date", sortable: true, tooltip: "Payment due date" },
          {
            key: "status", label: "Status", sortable: true,
            render: (p) => <StatusBadge status={p.status} />,
          },
        ]}
      />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected ? `Payment ${selected.id}` : ""}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CreditCard size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 22, fontWeight: 700 }}>₹{selected.amount.toLocaleString("en-IN")}</p>
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>{getAccountById(selected.accountId)?.company}</p>
              </div>
              <StatusBadge status={selected.status} size="md" />
            </div>

            <SummaryCard title="Payment Details">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Order" value={selected.orderId} />
                <DetailField label="Method" value={selected.method.replace(/_/g, " ")} />
                <DetailField label="Due Date" value={selected.dueDate} />
                <DetailField label="Paid At" value={selected.paidAt || "Not yet"} />
                <DetailField label="Created" value={selected.createdAt} />
                <DetailField label="Account" value={getAccountById(selected.accountId)?.company || "—"} />
              </div>
            </SummaryCard>

            <div className="flex gap-2 pt-2">
              {selected.status !== "completed" && <Button variant="gold" size="sm" className="flex-1" onClick={() => toast.success("Payment marked as paid", { description: `${selected.id} has been marked as completed.` })}>Mark as Paid</Button>}
              <Tooltip text="Download receipt">
                <Button variant="outline" size="sm" className="flex-1" icon={<Receipt size={14} />} onClick={() => { toast.success("Generating receipt...", { description: `Receipt for ${selected.id}` }); }}>Receipt</Button>
              </Tooltip>
            </div>
          </div>
        )}
      </Drawer>

      <RecordPaymentModal open={recordPaymentOpen} onClose={() => setRecordPaymentOpen(false)} />
    </PageShell>
  );
}