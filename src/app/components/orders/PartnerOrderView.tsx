import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../layout/PageShell";
import { StatCard } from "../layout/StatCard";
import {
  StatusBadge, FilterBar, DataTable, Pagination, Button, Drawer,
  DetailField, TabBar, SummaryCard
} from "../shared";
import { PaymentBlock } from "./PaymentBlock";
import { NewOrderModal } from "./OrderModals";
import { projectOrders, projectQuotations, getQuotationByOrderId, type ProjectOrder, type ProjectQuotation } from "../../data/orders";
import { formatCurrency } from "../../data/crm";
import {
  ShoppingCart, FileText, TrendingUp, Plus, Download,
  CheckCircle2, Clock, ArrowRight, CreditCard
} from "lucide-react";

import { handleExport } from "../shared/GlobalModals";

interface PartnerOrderViewProps {
  role: "dealer" | "architect" | "factory";
  partnerName: string;
}

export function PartnerOrderView({ role, partnerName }: PartnerOrderViewProps) {
  const navigate = useNavigate();

  // Filter orders visible to this partner
  const myOrders = projectOrders.filter(o => o.accountType === role || o.orderSource === role).slice(0, 6);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<ProjectOrder | null>(null);
  const [drawerTab, setDrawerTab] = useState("details");
  const [newOrderModal, setNewOrderModal] = useState(false);

  const filtered = myOrders.filter(o => {
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.projectName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && o.quotationStatus !== statusFilter) return false;
    return true;
  });

  const totalValue = myOrders.reduce((s, o) => s + o.totalQuotationValue, 0);
  const wonCount = myOrders.filter(o => o.quotationStatus === "won").length;
  const openCount = myOrders.filter(o => o.quotationStatus !== "won" && o.quotationStatus !== "lost").length;

  const selectedQuotation = selectedOrder ? getQuotationByOrderId(selectedOrder.id) : null;

  return (
    <>
      <PageShell
        title="My Orders"
        subtitle={`Orders for ${partnerName} · ${myOrders.length} total`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Orders")}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setNewOrderModal(true)}>New Order</Button>
          </div>
        }
      >
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Orders" value={myOrders.length} icon={<ShoppingCart size={18} />} accent="navy" />
          <StatCard label="Total Value" value={formatCurrency(totalValue)} icon={<TrendingUp size={18} />} accent="gold" />
          <StatCard label="Won" value={wonCount} icon={<CheckCircle2 size={18} />} accent="green" />
          <StatCard label="Open / Active" value={openCount} icon={<Clock size={18} />} accent="blue" />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FilterBar
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search orders..."
            filters={[
              { label: "Status", value: statusFilter, onChange: (v) => { setStatusFilter(v); setPage(1); }, options: [
                { label: "Open", value: "open" }, { label: "Under Discussion", value: "under_discussion" },
                { label: "Won", value: "won" }, { label: "Lost", value: "lost" }, { label: "Hold", value: "hold" },
              ]},
            ]}
          />
        </div>

        {/* Table */}
        <DataTable
          keyField="id"
          data={filtered}
          onRowClick={(o) => { setSelectedOrder(o); setDrawerTab("details"); }}
          emptyMessage="No orders yet."
          columns={[
            { key: "id", label: "Order ID", width: "90px", render: (o) => <span style={{ fontSize: 12, fontWeight: 600 }}>{o.id}</span> },
            { key: "projectName", label: "Project", render: (o) => (
              <div>
                <p style={{ fontWeight: 500 }}>{o.projectName}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{o.siteName}</p>
              </div>
            )},
            { key: "category", label: "Category", render: (o) => <span className="text-muted-foreground">{o.projectCategory}</span> },
            { key: "quotationStatus", label: "Status", render: (o) => <StatusBadge status={o.quotationStatus} /> },
            { key: "value", label: "Value", align: "right", render: (o) => <span style={{ fontWeight: 500 }}>₹{o.totalQuotationValue.toLocaleString("en-IN")}</span> },
            { key: "paymentStatus", label: "Payment", render: (o) => <StatusBadge status={o.paymentStatus} size="xs" /> },
            { key: "dates", label: "Created", render: (o) => <span className="text-muted-foreground" style={{ fontSize: 12 }}>{o.createdAt}</span> },
          ]}
        />
        <Pagination page={page} totalPages={Math.max(1, Math.ceil(filtered.length / 10))} onPageChange={setPage} />
      </PageShell>

      {/* Order Detail Drawer */}
      <Drawer open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={selectedOrder ? `Order ${selectedOrder.id}` : ""}>
        {selectedOrder && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-navy/8 flex items-center justify-center">
                <ShoppingCart size={20} className="text-navy" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 16, fontWeight: 600 }}>{selectedOrder.projectName}</p>
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>{selectedOrder.accountName}</p>
              </div>
              <StatusBadge status={selectedOrder.quotationStatus} size="md" />
            </div>

            <TabBar
              tabs={[
                { key: "details", label: "Details" },
                { key: "quotation", label: "Quotation" },
                { key: "payment", label: "Payment" },
              ]}
              active={drawerTab}
              onChange={setDrawerTab}
            />

            {drawerTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Project" value={selectedOrder.projectName} />
                  <DetailField label="Site" value={selectedOrder.siteName} />
                  <DetailField label="Category" value={selectedOrder.projectCategory} />
                  <DetailField label="Value" value={`₹${selectedOrder.totalQuotationValue.toLocaleString("en-IN")}`} />
                  <DetailField label="Created" value={selectedOrder.createdAt} />
                  <DetailField label="Expected Close" value={selectedOrder.expectedClosureDate} />
                  <DetailField label="Order Status" value={<StatusBadge status={selectedOrder.orderStatus} />} />
                  <DetailField label="Salesperson" value={selectedOrder.salespersonName} />
                </div>
                <DetailField label="Notes" value={selectedOrder.notes} />
              </div>
            )}

            {drawerTab === "quotation" && selectedQuotation && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gold/5 border border-gold/20">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{selectedQuotation.id}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>Version {selectedQuotation.currentVersion}</p>
                  </div>
                  <StatusBadge status={selectedQuotation.outcome} size="md" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <DetailField label="Amount" value={`₹${selectedQuotation.quotationAmount.toLocaleString("en-IN")}`} />
                  <DetailField label="Items" value={`${selectedQuotation.versions.find(v => v.isActive)?.lineItems.length || 0} line items`} />
                </div>

                {selectedQuotation.remarks && (
                  <DetailField label="Remarks" value={selectedQuotation.remarks} />
                )}
              </div>
            )}

            {drawerTab === "quotation" && !selectedQuotation && (
              <div className="text-center py-8">
                <p className="text-muted-foreground" style={{ fontSize: 14 }}>No quotation created yet.</p>
              </div>
            )}

            {drawerTab === "payment" && (
              <PaymentBlock
                quotationAmount={selectedOrder.totalQuotationValue}
                receivedAmount={selectedOrder.receivedAmount}
                balanceAmount={selectedOrder.totalQuotationValue - selectedOrder.receivedAmount}
                paymentStatus={selectedOrder.paymentStatus}
              />
            )}
          </div>
        )}
      </Drawer>

      <NewOrderModal open={newOrderModal} onClose={() => setNewOrderModal(false)} />
    </>
  );
}