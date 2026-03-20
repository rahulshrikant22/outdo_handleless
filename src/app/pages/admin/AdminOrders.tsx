import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, SortableDataTable, Button, Drawer,
  DetailField, SummaryCard, TabBar, RowActions, Tooltip, ActivityLog
} from "../../components/shared";
import {
  orders, getAccountById, getUserById, getTasksByOrderId, getPaymentsByOrderId
} from "../../data";
import { Plus, Download, ShoppingCart, ClipboardList, CreditCard, Printer } from "lucide-react";
import { handleExport, handlePrint, EditOrderModal } from "../../components/shared/GlobalModals";

const orderActivity = [
  { id: "oa1", user: "Factory Admin", action: "updated O003 status to", target: "Shipped", time: "2 hours ago", type: "update" as const },
  { id: "oa2", user: "Accounts Team", action: "received payment P003 for", target: "O003 — ₹1,75,000", time: "5 hours ago", type: "payment" as const },
  { id: "oa3", user: "Rahul Sharma", action: "created order", target: "O004 — Rao Homes Kitchen", time: "Mar 12, 2026", type: "create" as const },
  { id: "oa4", user: "System", action: "auto-flagged O002 — delivery date approaching", target: "", time: "Mar 11, 2026", type: "system" as const },
];

export function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<typeof orders[0] | null>(null);
  const [drawerTab, setDrawerTab] = useState("details");
  const [editOrderModalOpen, setEditOrderModalOpen] = useState(false);

  const navigate = useNavigate();

  const filtered = orders.filter((o) => {
    const account = getAccountById(o.accountId);
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !(account?.company || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && o.status !== statusFilter) return false;
    return true;
  });

  const statuses = [...new Set(orders.map(o => o.status))];

  return (
    <PageShell
      title="Orders"
      subtitle={`${orders.length} orders · ${orders.filter(o => o.status === "in_production" || o.status === "confirmed").length} active · ₹${(orders.reduce((s, o) => s + o.totalAmount, 0) / 100000).toFixed(1)}L total value`}
      actions={
        <div className="flex items-center gap-2">
          <Tooltip text="Export orders as CSV">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Orders")}>Export</Button>
          </Tooltip>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => navigate("/admin/orders/dashboard")}>New Order</Button>
        </div>
      }
    >
      <div className="mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by order ID or account..."
          filters={[{
            label: "All Statuses",
            value: statusFilter,
            onChange: setStatusFilter,
            options: statuses.map(s => ({ label: s.replace(/_/g, " "), value: s })),
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
        onRowClick={(o) => { setSelected(o); setDrawerTab("details"); }}
        rowActions={(o) => (
          <RowActions
            onView={() => { setSelected(o); setDrawerTab("details"); }}
            onEdit={() => {}}
          />
        )}
        columns={[
          { key: "id", label: "Order ID", width: "90px", sortable: true, render: (o) => <span style={{ fontSize: 13, fontWeight: 600 }}>{o.id}</span> },
          {
            key: "account", label: "Account", sortable: true,
            sortValue: (o) => getAccountById(o.accountId)?.company || "",
            render: (o) => {
              const acc = getAccountById(o.accountId);
              return (
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 500 }}>{acc?.company}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>{acc?.city}</p>
                </div>
              );
            },
          },
          { key: "items", label: "Items", render: (o) => <span className="truncate block max-w-[200px]" style={{ fontSize: 13 }}>{o.items}</span> },
          {
            key: "totalAmount", label: "Amount", align: "right" as const, sortable: true,
            tooltip: "Total order value including taxes",
            render: (o) => <span style={{ fontWeight: 500 }}>₹{o.totalAmount.toLocaleString("en-IN")}</span>,
          },
          { key: "expectedDelivery", label: "Delivery", sortable: true, tooltip: "Expected delivery date" },
          {
            key: "factory", label: "Factory",
            render: (o) => getUserById(o.factoryUserId)?.name || "—",
          },
          {
            key: "status", label: "Status", sortable: true,
            render: (o) => <StatusBadge status={o.status} />,
          },
        ]}
      />

      {/* Order Detail Drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Order ${selected.id}` : ""}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-navy/8 flex items-center justify-center">
                <ShoppingCart size={20} className="text-navy" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 16, fontWeight: 600 }}>{selected.id}</p>
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>{getAccountById(selected.accountId)?.company}</p>
              </div>
              <StatusBadge status={selected.status} size="md" />
            </div>

            <TabBar
              tabs={[
                { key: "details", label: "Details" },
                { key: "tasks", label: "Tasks", count: getTasksByOrderId(selected.id).length },
                { key: "payments", label: "Payments", count: getPaymentsByOrderId(selected.id).length },
                { key: "activity", label: "Activity" },
              ]}
              active={drawerTab}
              onChange={setDrawerTab}
            />

            {drawerTab === "details" && (
              <SummaryCard title="Order Information">
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Account" value={getAccountById(selected.accountId)?.company || "—"} />
                  <DetailField label="Quotation" value={selected.quotationId} />
                  <DetailField label="Items" value={selected.items} className="col-span-2" />
                  <DetailField label="Total Amount" value={`₹${selected.totalAmount.toLocaleString("en-IN")}`} />
                  <DetailField label="Factory" value={getUserById(selected.factoryUserId)?.name || "—"} />
                  <DetailField label="Created" value={selected.createdAt} />
                  <DetailField label="Expected Delivery" value={selected.expectedDelivery} />
                </div>
              </SummaryCard>
            )}

            {drawerTab === "tasks" && (
              <div className="space-y-3">
                {getTasksByOrderId(selected.id).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8" style={{ fontSize: 13 }}>No tasks assigned yet</p>
                ) : getTasksByOrderId(selected.id).map((task) => (
                  <div key={task.id} className="p-3 rounded-lg border border-border bg-background hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{task.title}</p>
                      <StatusBadge status={task.status} size="xs" />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-muted-foreground" style={{ fontSize: 11.5 }}>{getUserById(task.assigneeId)?.name}</span>
                      <span className="text-muted-foreground" style={{ fontSize: 11.5 }}>Due: {task.dueDate}</span>
                      <StatusBadge status={task.priority} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {drawerTab === "payments" && (
              <div className="space-y-3">
                {getPaymentsByOrderId(selected.id).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8" style={{ fontSize: 13 }}>No payments recorded</p>
                ) : getPaymentsByOrderId(selected.id).map((pay) => (
                  <div key={pay.id} className="p-3 rounded-lg border border-border bg-background hover:border-gold/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{pay.id}</p>
                      <StatusBadge status={pay.status} size="xs" />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>{pay.method.replace(/_/g, " ")} · Due: {pay.dueDate}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 600 }}>₹{pay.amount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {drawerTab === "activity" && (
              <ActivityLog entries={orderActivity} maxItems={5} />
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="primary" size="sm" className="flex-1" onClick={() => { setEditOrderModalOpen(true); }}>Edit Order</Button>
              <Tooltip text="Print order details">
                <Button variant="outline" size="sm" icon={<Printer size={14} />} onClick={() => handlePrint(`Order ${selected.id}`)}>Print</Button>
              </Tooltip>
            </div>
          </div>
        )}
      </Drawer>

      {/* Edit Order Modal */}
      <EditOrderModal
        open={editOrderModalOpen}
        onClose={() => setEditOrderModalOpen(false)}
        order={selected}
      />
    </PageShell>
  );
}