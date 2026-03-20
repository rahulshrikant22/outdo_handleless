import { useState } from "react";
import { PageShell } from "../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, SortableDataTable, Button, Drawer,
  DetailField, SummaryCard, RowActions, Tooltip
} from "../../components/shared";
import { accounts, getSalespersonById, getUserById, getOrdersByAccountId } from "../../data";
import { Building2, Download, Plus } from "lucide-react";
import { handleExport } from "../../components/shared/GlobalModals";
import { toast } from "sonner";

const dealerAccounts = accounts.filter(a => a.dealerId === "U003" || a.dealerId === "U004");

export function DealerAccounts() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<typeof accounts[0] | null>(null);

  const filtered = dealerAccounts.filter((a) => {
    if (search && !a.company.toLowerCase().includes(search.toLowerCase()) && !a.contactName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <PageShell
      title="My Accounts"
      subtitle={`${dealerAccounts.length} assigned accounts · ${dealerAccounts.filter(a => a.status === "active").length} active · ₹${(dealerAccounts.reduce((s, a) => s + a.totalValue, 0) / 100000).toFixed(1)}L total value`}
      actions={
        <div className="flex items-center gap-2">
          <Tooltip text="Export accounts">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Accounts")}>Export</Button>
          </Tooltip>
          <Button variant="gold" size="sm" icon={<Plus size={14} />} onClick={() => toast.info("Opening quotation builder...", { description: "Create a new quotation for your accounts." })}>New Quotation</Button>
        </div>
      }
    >
      <div className="mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by company or contact..."
          filters={[
            {
              label: "All Statuses",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
          ]}
        />
      </div>

      <SortableDataTable
        data={filtered}
        keyField="id"
        pageSize={8}
        onRowClick={(a) => setSelected(a)}
        rowActions={(a) => (
          <RowActions onView={() => setSelected(a)} onEdit={() => {}} />
        )}
        columns={[
          { key: "id", label: "ID", width: "70px", sortable: true, render: (a) => <span className="text-muted-foreground" style={{ fontSize: 12.5 }}>{a.id}</span> },
          {
            key: "company", label: "Company", sortable: true,
            render: (a) => (
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 500 }}>{a.company}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{a.contactName}</p>
              </div>
            ),
          },
          { key: "city", label: "City", sortable: true },
          {
            key: "totalValue", label: "Value", align: "right" as const, sortable: true,
            render: (a) => <span style={{ fontWeight: 500 }}>₹{a.totalValue.toLocaleString("en-IN")}</span>,
          },
          {
            key: "orders", label: "Orders", align: "center" as const, sortable: true,
            sortValue: (a) => getOrdersByAccountId(a.id).length,
            render: (a) => <span style={{ fontWeight: 500 }}>{getOrdersByAccountId(a.id).length}</span>,
          },
          {
            key: "status", label: "Status", sortable: true,
            render: (a) => <StatusBadge status={a.status} />,
          },
        ]}
      />

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.company || ""}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Building2 size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 16, fontWeight: 600 }}>{selected.company}</p>
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>{selected.contactName} · {selected.city}</p>
              </div>
              <StatusBadge status={selected.status} size="md" />
            </div>

            <SummaryCard title="Account Details">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Contact" value={selected.contactName} />
                <DetailField label="Email" value={selected.email} />
                <DetailField label="Phone" value={selected.phone} />
                <DetailField label="City" value={selected.city} />
                <DetailField label="Total Value" value={`₹${selected.totalValue.toLocaleString("en-IN")}`} />
                <DetailField label="Created" value={selected.createdAt} />
              </div>
            </SummaryCard>

            <SummaryCard title={`Orders (${getOrdersByAccountId(selected.id).length})`}>
              <div className="space-y-2">
                {getOrdersByAccountId(selected.id).map((o) => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-accent/20 rounded px-1 -mx-1 transition-colors">
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{o.id}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{o.items}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>₹{o.totalAmount.toLocaleString("en-IN")}</span>
                      <StatusBadge status={o.status} size="xs" />
                    </div>
                  </div>
                ))}
                {getOrdersByAccountId(selected.id).length === 0 && (
                  <p className="text-muted-foreground text-center py-4" style={{ fontSize: 13 }}>No orders yet</p>
                )}
              </div>
            </SummaryCard>

            <Button variant="gold" size="sm" className="w-full" onClick={() => toast.info("Opening quotation builder...", { description: `Creating quotation for ${selected.company}` })}>Create Quotation</Button>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}