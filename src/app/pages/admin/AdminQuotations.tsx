import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, SortableDataTable, Button, Drawer,
  DetailField, SummaryCard, RowActions, Tooltip
} from "../../components/shared";
import { quotations, getAccountById, getSalespersonById } from "../../data";
import { Plus, Download, FileText, Printer } from "lucide-react";
import { handleExport, handleDownloadPDF, EditQuotationModal, ConvertQuotationModal } from "../../components/shared/GlobalModals";
import { toast } from "sonner";

export function AdminQuotations() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<typeof quotations[0] | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = quotations.filter((q) => {
    const acc = getAccountById(q.accountId);
    if (search && !q.id.toLowerCase().includes(search.toLowerCase()) && !(acc?.company || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && q.status !== statusFilter) return false;
    return true;
  });

  return (
    <PageShell
      title="Quotations"
      subtitle={`${quotations.length} quotations · ${quotations.filter(q => q.status === "accepted").length} accepted · ₹${(quotations.reduce((s, q) => s + q.totalAmount, 0) / 100000).toFixed(1)}L pipeline`}
      actions={
        <div className="flex items-center gap-2">
          <Tooltip text="Export quotation data">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Quotations")}>Export</Button>
          </Tooltip>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => navigate("/admin/orders/quotation/new")}>New Quotation</Button>
        </div>
      }
    >
      <div className="mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by ID or account..."
          filters={[{
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
          }]}
          actions={statusFilter ? (
            <button onClick={() => setStatusFilter("")} className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 12.5 }}>
              Clear filter
            </button>
          ) : undefined}
        />
      </div>

      <SortableDataTable
        data={filtered}
        keyField="id"
        pageSize={8}
        onRowClick={(q) => setSelected(q)}
        rowActions={(q) => (
          <RowActions onView={() => setSelected(q)} onEdit={() => { setSelected(q); setEditModalOpen(true); }} onDelete={() => toast.success("Quotation deleted", { description: `${q.id} has been removed.`})} />
        )}
        columns={[
          { key: "id", label: "ID", width: "80px", sortable: true, render: (q) => <span style={{ fontSize: 13, fontWeight: 600 }}>{q.id}</span> },
          {
            key: "account", label: "Account", sortable: true,
            sortValue: (q) => getAccountById(q.accountId)?.company || "",
            render: (q) => <p style={{ fontSize: 13.5, fontWeight: 500 }}>{getAccountById(q.accountId)?.company}</p>,
          },
          { key: "items", label: "Items", render: (q) => <span className="truncate block max-w-[220px]" style={{ fontSize: 13 }}>{q.items}</span> },
          {
            key: "totalAmount", label: "Amount", align: "right" as const, sortable: true,
            render: (q) => <span style={{ fontWeight: 500 }}>₹{q.totalAmount.toLocaleString("en-IN")}</span>,
          },
          {
            key: "salesperson", label: "Salesperson", sortable: true,
            sortValue: (q) => getSalespersonById(q.salespersonId)?.name || "",
            render: (q) => getSalespersonById(q.salespersonId)?.name || "—",
          },
          { key: "validUntil", label: "Valid Until", sortable: true, tooltip: "Quotation validity expiry" },
          {
            key: "status", label: "Status", sortable: true,
            render: (q) => <StatusBadge status={q.status} />,
          },
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

            <SummaryCard title="Quotation Details">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Account" value={getAccountById(selected.accountId)?.company || "—"} />
                <DetailField label="Salesperson" value={getSalespersonById(selected.salespersonId)?.name || "—"} />
                <DetailField label="Items" value={selected.items} className="col-span-2" />
                <DetailField label="Total Amount" value={`₹${selected.totalAmount.toLocaleString("en-IN")}`} />
                <DetailField label="Valid Until" value={selected.validUntil} />
                <DetailField label="Created" value={selected.createdAt} />
                <DetailField label="Linked Order" value={selected.orderId || "Not yet converted"} />
              </div>
            </SummaryCard>

            <div className="flex gap-2 pt-2">
              <Button variant="primary" size="sm" className="flex-1" onClick={() => setEditModalOpen(true)}>Edit</Button>
              {selected.status === "sent" && <Button variant="gold" size="sm" className="flex-1" onClick={() => setConvertModalOpen(true)}>Convert to Order</Button>}
              <Tooltip text="Generate PDF">
                <Button variant="outline" size="sm" icon={<Printer size={14} />} onClick={() => handleDownloadPDF(`Quotation ${selected.id}`)}>PDF</Button>
              </Tooltip>
            </div>
          </div>
        )}
      </Drawer>

      <EditQuotationModal open={editModalOpen} onClose={() => setEditModalOpen(false)} quotation={selected} />
      <ConvertQuotationModal open={convertModalOpen} onClose={() => setConvertModalOpen(false)} quotation={selected} />
    </PageShell>
  );
}