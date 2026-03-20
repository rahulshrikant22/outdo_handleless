import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, SortableDataTable, Button, Drawer,
  DetailField, SummaryCard, TabBar, RowActions, Tooltip
} from "../../components/shared";
import {
  accounts, getSalespersonById, getUserById,
  getOrdersByAccountId, leads
} from "../../data";
import { Plus, Download, Building2 } from "lucide-react";
import { handleExport, AddAccountModal, EditAccountModal } from "../../components/shared/GlobalModals";

export function AdminAccounts() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [selected, setSelected] = useState<typeof accounts[0] | null>(null);
  const [drawerTab, setDrawerTab] = useState("details");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = accounts.filter((a) => {
    if (search && !a.company.toLowerCase().includes(search.toLowerCase()) && !a.contactName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    if (cityFilter && a.city !== cityFilter) return false;
    return true;
  });

  const cities = [...new Set(accounts.map(a => a.city))];

  return (
    <PageShell
      title="Accounts"
      subtitle={`${accounts.length} accounts · ${accounts.filter(a => a.status === "active").length} active · ₹${(accounts.reduce((s, a) => s + a.totalValue, 0) / 100000).toFixed(1)}L total value`}
      actions={
        <div className="flex items-center gap-2">
          <Tooltip text="Export accounts as CSV">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Accounts")}>Export</Button>
          </Tooltip>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setAddModalOpen(true)}>Add Account</Button>
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
            {
              label: "All Cities",
              value: cityFilter,
              onChange: setCityFilter,
              options: cities.map(c => ({ label: c, value: c })),
            },
          ]}
        />
      </div>

      <SortableDataTable
        data={filtered}
        keyField="id"
        pageSize={8}
        onRowClick={(acc) => { setSelected(acc); setDrawerTab("details"); }}
        rowActions={(acc) => (
          <RowActions
            onView={() => { setSelected(acc); setDrawerTab("details"); }}
            onEdit={() => {}}
          />
        )}
        columns={[
          { key: "id", label: "ID", width: "80px", sortable: true, render: (a) => <span className="text-muted-foreground" style={{ fontSize: 12.5 }}>{a.id}</span> },
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
            key: "salesperson", label: "Salesperson", sortable: true,
            sortValue: (a) => getSalespersonById(a.salespersonId)?.name || "",
            render: (a) => getSalespersonById(a.salespersonId)?.name || "—",
          },
          {
            key: "dealer", label: "Dealer",
            render: (a) => a.dealerId ? getUserById(a.dealerId)?.name || "—" : "—",
          },
          {
            key: "totalValue", label: "Value", align: "right" as const, sortable: true,
            tooltip: "Total account value",
            render: (a) => <span style={{ fontWeight: 500 }}>₹{a.totalValue.toLocaleString("en-IN")}</span>,
          },
          {
            key: "status", label: "Status", sortable: true,
            render: (a) => <StatusBadge status={a.status} />,
          },
        ]}
      />

      {/* Account Detail Drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? selected.company : ""}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-navy/8 flex items-center justify-center">
                <Building2 size={20} className="text-navy" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 16, fontWeight: 600 }}>{selected.company}</p>
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>{selected.city}</p>
              </div>
              <StatusBadge status={selected.status} size="md" />
            </div>

            <TabBar
              tabs={[
                { key: "details", label: "Details" },
                { key: "orders", label: "Orders", count: getOrdersByAccountId(selected.id).length },
              ]}
              active={drawerTab}
              onChange={setDrawerTab}
            />

            {drawerTab === "details" && (
              <div className="space-y-5">
                <SummaryCard title="Account Information">
                  <div className="grid grid-cols-2 gap-4">
                    <DetailField label="Contact" value={selected.contactName} />
                    <DetailField label="Email" value={selected.email} />
                    <DetailField label="Phone" value={selected.phone} />
                    <DetailField label="City" value={selected.city} />
                    <DetailField label="Salesperson" value={getSalespersonById(selected.salespersonId)?.name || "—"} />
                    <DetailField label="Dealer" value={selected.dealerId ? getUserById(selected.dealerId)?.name || "—" : "None"} />
                    <DetailField label="Architect" value={selected.architectId ? getUserById(selected.architectId)?.name || "—" : "None"} />
                    <DetailField label="Total Value" value={`₹${selected.totalValue.toLocaleString("en-IN")}`} />
                    <DetailField label="Created" value={selected.createdAt} />
                    <DetailField label="Source Lead" value={leads.find(l => l.id === selected.leadId)?.name || selected.leadId} />
                  </div>
                </SummaryCard>
              </div>
            )}

            {drawerTab === "orders" && (
              <div className="space-y-3">
                {getOrdersByAccountId(selected.id).map((order) => (
                  <div key={order.id} className="p-4 rounded-lg border border-border bg-background hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p style={{ fontSize: 13.5, fontWeight: 500 }}>{order.id}</p>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                    <p className="text-muted-foreground" style={{ fontSize: 12.5 }}>{order.items}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>Delivery: {order.expectedDelivery}</span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
                {getOrdersByAccountId(selected.id).length === 0 && (
                  <p className="text-center text-muted-foreground py-8" style={{ fontSize: 13 }}>No orders yet</p>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="primary" size="sm" className="flex-1" onClick={() => setEditModalOpen(true)}>Edit Account</Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate("/admin/orders/dashboard")}>Create Order</Button>
            </div>
          </div>
        )}
      </Drawer>

      <AddAccountModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <EditAccountModal open={editModalOpen} onClose={() => setEditModalOpen(false)} account={selected} />
    </PageShell>
  );
}