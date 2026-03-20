import { useState } from "react";
import { PageShell } from "../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, SortableDataTable, Button, Drawer,
  DetailField, SummaryCard, RowActions, Tooltip
} from "../../components/shared";
import { handleExport, handleDownloadPDF } from "../../components/shared/GlobalModals";
import { toast } from "sonner";
import { quotations, getAccountById, getSalespersonById, accounts } from "../../data";
import { FileText, Plus, Download } from "lucide-react";

const dealerAccIds = accounts.filter(a => a.dealerId === "U003" || a.dealerId === "U004").map(a => a.id);
const dealerQuotations = quotations.filter(q => dealerAccIds.includes(q.accountId));

export function DealerQuotations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<typeof quotations[0] | null>(null);

  const filtered = dealerQuotations.filter((q) => {
    const acc = getAccountById(q.accountId);
    if (search && !q.id.toLowerCase().includes(search.toLowerCase()) && !(acc?.company || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && q.status !== statusFilter) return false;
    return true;
  });

  return (
    <PageShell
      title="Quotations"
      subtitle={`${dealerQuotations.length} quotations · ${dealerQuotations.filter(q => q.status === "accepted").length} accepted · ₹${(dealerQuotations.reduce((s, q) => s + q.totalAmount, 0) / 100000).toFixed(1)}L total`}
      actions={
        <div className="flex items-center gap-2">
          <Tooltip text="Export quotations">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Quotations")}>Export</Button>
          </Tooltip>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => toast.info("Opening quotation builder...", { description: "Create a new quotation." })}>New Quotation</Button>
        </div>
      }
    >
      <div className="mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by ID or account..."
          filters={[
            {
              label: "All Statuses",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: "Draft", value: "draft" },
                { label: "Sent", value: "sent" },
                { label: "Accepted", value: "accepted" },
                { label: "Rejected", value: "rejected" },
                { label: "Expired", value: "expired" },
              ],
            },
          ]}
        />
      </div>

      <SortableDataTable
        data={filtered}
        keyField="id"
        pageSize={8}
        onRowClick={(q) => setSelected(q)}
        rowActions={(q) => <RowActions onView={() => setSelected(q)} onEdit={() => {}} />}
        columns={[
          { key: "id", label: "ID", width: "80px", sortable: true, render: (q) => <span style={{ fontSize: 13, fontWeight: 600 }}>{q.id}</span> },
          { key: "account", label: "Account", sortable: true, sortValue: (q) => getAccountById(q.accountId)?.company || "", render: (q) => <p style={{ fontSize: 13.5, fontWeight: 500 }}>{getAccountById(q.accountId)?.company}</p> },
          { key: "items", label: "Items", render: (q) => <span className="truncate block max-w-[200px]" style={{ fontSize: 13 }}>{q.items}</span> },
          { key: "totalAmount", label: "Amount", align: "right" as const, sortable: true, render: (q) => <span style={{ fontWeight: 500 }}>₹{q.totalAmount.toLocaleString("en-IN")}</span> },
          { key: "validUntil", label: "Valid Until", sortable: true, tooltip: "Quotation expiry date" },
          { key: "status", label: "Status", sortable: true, render: (q) => <StatusBadge status={q.status} /> },
        ]}
      />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected ? `Quotation ${selected.id}` : ""}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center">
                <FileText size={20} className="text-gold-dark" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 16, fontWeight: 600 }}>{selected.id}</p>
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>{getAccountById(selected.accountId)?.company}</p>
              </div>
              <StatusBadge status={selected.status} size="md" />
            </div>

            <SummaryCard title="Details">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Items" value={selected.items} className="col-span-2" />
                <DetailField label="Amount" value={`₹${selected.totalAmount.toLocaleString("en-IN")}`} />
                <DetailField label="Valid Until" value={selected.validUntil} />
                <DetailField label="Created" value={selected.createdAt} />
                <DetailField label="Linked Order" value={selected.orderId || "—"} />
              </div>
            </SummaryCard>

            <div className="flex gap-2">
              <Tooltip text="Download quotation as PDF">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownloadPDF(`Quotation ${selected.id}`)}>Download PDF</Button>
              </Tooltip>
              {!selected.orderId && <Button variant="gold" size="sm" className="flex-1" onClick={() => toast.info("Follow up scheduled", { description: `Follow up for ${selected.id} has been logged.` })}>Follow Up</Button>}
            </div>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}