import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatusBadge, FilterBar, DataTable, Pagination, Button } from "../../../components/shared";
import { projectOrders, projectCategories, orderSources, quotationOutcomes, type ProjectOrder } from "../../../data/orders";
import { allCities, allStates, allZones, crmSalespeople } from "../../../data/crm";
import { Download, Plus, ArrowRight } from "lucide-react";
import { NewOrderModal } from "../../../components/orders/OrderModals";
import { handleExport } from "../../../components/shared/GlobalModals";

export function OrdersTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [quotationStatusFilter, setQuotationStatusFilter] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [spFilter, setSpFilter] = useState("");
  const [page, setPage] = useState(1);
  const [newOrderModal, setNewOrderModal] = useState(false);

  const filtered = projectOrders.filter(o => {
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.projectName.toLowerCase().includes(search.toLowerCase()) && !o.accountName.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && o.projectCategory !== categoryFilter) return false;
    if (sourceFilter && o.orderSource !== sourceFilter) return false;
    if (quotationStatusFilter && o.quotationStatus !== quotationStatusFilter) return false;
    if (accountTypeFilter && o.accountType !== accountTypeFilter) return false;
    if (zoneFilter && o.zone !== zoneFilter) return false;
    if (spFilter && o.salespersonId !== spFilter) return false;
    return true;
  });

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const hasFilters = search || categoryFilter || sourceFilter || quotationStatusFilter || accountTypeFilter || zoneFilter || spFilter;
  const clearFilters = () => { setSearch(""); setCategoryFilter(""); setSourceFilter(""); setQuotationStatusFilter(""); setAccountTypeFilter(""); setZoneFilter(""); setSpFilter(""); setPage(1); };

  return (
    <>
      <PageShell
        title="Orders"
        subtitle={`All project orders · ${projectOrders.length} total`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Orders")}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setNewOrderModal(true)}>New Order</Button>
          </div>
        }
      >
        <div className="mb-4">
          <FilterBar
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search by order ID, project, or account..."
            filters={[
              { label: "Category", value: categoryFilter, onChange: (v) => { setCategoryFilter(v); setPage(1); }, options: projectCategories.map(c => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c })) },
              { label: "Quotation Status", value: quotationStatusFilter, onChange: (v) => { setQuotationStatusFilter(v); setPage(1); }, options: quotationOutcomes.map(o => ({ label: o.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()), value: o })) },
              { label: "Account Type", value: accountTypeFilter, onChange: (v) => { setAccountTypeFilter(v); setPage(1); }, options: [{ label: "Dealer", value: "dealer" }, { label: "Architect", value: "architect" }, { label: "Factory", value: "factory" }] },
              { label: "Source", value: sourceFilter, onChange: (v) => { setSourceFilter(v); setPage(1); }, options: orderSources.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s })) },
              { label: "Zone", value: zoneFilter, onChange: (v) => { setZoneFilter(v); setPage(1); }, options: allZones.map(z => ({ label: z, value: z })) },
              { label: "Salesperson", value: spFilter, onChange: (v) => { setSpFilter(v); setPage(1); }, options: crmSalespeople.map(sp => ({ label: sp.name, value: sp.id })) },
            ]}
          />
        </div>

        {hasFilters && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-muted-foreground" style={{ fontSize: 13 }}>Showing {filtered.length} of {projectOrders.length} orders</span>
            <button onClick={clearFilters} className="text-gold-dark hover:text-gold transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Clear all filters</button>
          </div>
        )}

        <DataTable
          keyField="id"
          data={paged}
          onRowClick={(o) => navigate(`/admin/orders/${o.id}`)}
          emptyMessage={hasFilters ? "No orders match your filters." : "No orders yet."}
          columns={[
            { key: "id", label: "Order ID", width: "90px", render: (o) => <span className="text-navy" style={{ fontSize: 12, fontWeight: 600 }}>{o.id}</span> },
            { key: "projectName", label: "Project / Site", render: (o) => (
              <div>
                <p style={{ fontWeight: 500 }}>{o.projectName}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{o.siteName}</p>
              </div>
            )},
            { key: "category", label: "Category", render: (o) => <span className="text-muted-foreground">{o.projectCategory.charAt(0).toUpperCase() + o.projectCategory.slice(1)}</span> },
            { key: "account", label: "Account", render: (o) => (
              <div>
                <p style={{ fontSize: 13 }}>{o.accountName}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{o.accountType} · {o.city}</p>
              </div>
            )},
            { key: "salesperson", label: "Salesperson", render: (o) => <span style={{ fontSize: 13 }}>{o.salespersonName}</span> },
            { key: "quotationStatus", label: "Quotation", render: (o) => <StatusBadge status={o.quotationStatus} /> },
            { key: "paymentStatus", label: "Payment", render: (o) => <StatusBadge status={o.paymentStatus} size="xs" /> },
            { key: "orderStatus", label: "Order Status", render: (o) => <StatusBadge status={o.orderStatus} size="xs" /> },
            { key: "value", label: "Value", align: "right", render: (o) => <span style={{ fontWeight: 500 }}>₹{o.totalQuotationValue.toLocaleString("en-IN")}</span> },
            { key: "dates", label: "Dates", render: (o) => (
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>Created: {o.createdAt}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>Close: {o.expectedClosureDate}</p>
              </div>
            )},
          ]}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </PageShell>

      <NewOrderModal open={newOrderModal} onClose={() => setNewOrderModal(false)} />
    </>
  );
}