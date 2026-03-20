import { useState } from "react";
import { PageShell } from "../../components/layout/PageShell";
import { StatCard } from "../../components/layout/StatCard";
import {
  StatusBadge, SortableDataTable, FilterBar, Button, Drawer,
  DetailField, SummaryCard, Tooltip, RowActions
} from "../../components/shared";
import { payments, accounts, getAccountById } from "../../data";
import { CreditCard, IndianRupee, Download, Receipt } from "lucide-react";
import { handleExport, handleDownloadPDF } from "../../components/shared/GlobalModals";

const dealerAccIds = accounts.filter(a => a.dealerId === "U003" || a.dealerId === "U004").map(a => a.id);
const dealerPayments = payments.filter(p => dealerAccIds.includes(p.accountId));
const collected = dealerPayments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
const pending = dealerPayments.filter(p => p.status !== "completed").reduce((s, p) => s + p.amount, 0);

export function DealerPayments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<typeof payments[0] | null>(null);

  const filtered = dealerPayments.filter((p) => {
    const acc = getAccountById(p.accountId);
    if (search && !p.id.toLowerCase().includes(search.toLowerCase()) && !(acc?.company || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <PageShell
      title="Payments"
      subtitle={`Payment tracking for your accounts · ${dealerPayments.length} records`}
      actions={
        <Tooltip text="Download payment report">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Payments")}>Export</Button>
        </Tooltip>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Collected" value={`₹${(collected / 1000).toFixed(0)}K`} icon={<CreditCard size={18} />} accent="green" trendDirection="up" trend="Completed payments" />
        <StatCard label="Pending" value={`₹${(pending / 1000).toFixed(0)}K`} icon={<IndianRupee size={18} />} accent="gold" trend={`${dealerPayments.filter(p => p.status !== "completed").length} pending`} />
        <StatCard label="Total" value={`₹${((collected + pending) / 1000).toFixed(0)}K`} icon={<Receipt size={18} />} accent="navy" trend="Pipeline value" />
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
          ]}
        />
      </div>

      <SortableDataTable
        data={filtered}
        keyField="id"
        pageSize={8}
        onRowClick={(p) => setSelected(p)}
        rowActions={(p) => <RowActions onView={() => setSelected(p)} />}
        columns={[
          { key: "id", label: "ID", width: "70px", sortable: true, render: (p) => <span style={{ fontSize: 13, fontWeight: 600 }}>{p.id}</span> },
          { key: "account", label: "Account", sortable: true, sortValue: (p) => getAccountById(p.accountId)?.company || "", render: (p) => <p style={{ fontSize: 13.5, fontWeight: 500 }}>{getAccountById(p.accountId)?.company}</p> },
          { key: "orderId", label: "Order", sortable: true },
          { key: "amount", label: "Amount", align: "right" as const, sortable: true, render: (p) => <span style={{ fontWeight: 600 }}>₹{p.amount.toLocaleString("en-IN")}</span> },
          { key: "method", label: "Method", sortable: true, render: (p) => <span className="capitalize">{p.method.replace(/_/g, " ")}</span> },
          { key: "dueDate", label: "Due Date", sortable: true },
          { key: "status", label: "Status", sortable: true, render: (p) => <StatusBadge status={p.status} /> },
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
              </div>
            </SummaryCard>

            <Tooltip text="Download payment receipt PDF">
              <Button variant="outline" size="sm" className="w-full" icon={<Receipt size={14} />} onClick={() => handleDownloadPDF(`Receipt ${selected.id}`)}>Download Receipt</Button>
            </Tooltip>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}