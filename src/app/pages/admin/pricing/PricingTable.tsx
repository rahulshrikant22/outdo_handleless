import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatusBadge, FilterBar, DataTable, Pagination, Button, RowActions } from "../../../components/shared";
import { PricingFormModal } from "../../../components/pricing/PricingFormModal";
import {
  pricingItems, pricingCategories, pricingItemTypes, pricingStatuses, pricingUnits,
  formatPricingUnit, formatItemType,
  type PricingItem,
} from "../../../data/pricing";
import { Plus, Download, DollarSign } from "lucide-react";
import { handleExport } from "../../../components/shared/GlobalModals";

export function PricingTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState<PricingItem | null>(null);

  const filtered = pricingItems.filter(p => {
    if (search && !p.id.toLowerCase().includes(search.toLowerCase()) && !p.itemName.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (typeFilter && p.itemType !== typeFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (unitFilter && p.unit !== unitFilter) return false;
    return true;
  });

  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const hasFilters = search || categoryFilter || typeFilter || statusFilter || unitFilter;
  const clearFilters = () => {
    setSearch(""); setCategoryFilter(""); setTypeFilter(""); setStatusFilter(""); setUnitFilter(""); setPage(1);
  };

  return (
    <>
      <PageShell
        title="Pricing Catalog"
        subtitle={`All pricing items · ${pricingItems.length} total`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Pricing Items")}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setAddModal(true)}>Add Item</Button>
          </div>
        }
      >
        <div className="mb-4">
          <FilterBar
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search by ID or item name..."
            filters={[
              {
                label: "Category", value: categoryFilter,
                onChange: (v) => { setCategoryFilter(v); setPage(1); },
                options: pricingCategories.map(c => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c })),
              },
              {
                label: "Type", value: typeFilter,
                onChange: (v) => { setTypeFilter(v); setPage(1); },
                options: pricingItemTypes.map(t => ({ label: formatItemType(t), value: t })),
              },
              {
                label: "Status", value: statusFilter,
                onChange: (v) => { setStatusFilter(v); setPage(1); },
                options: pricingStatuses.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s })),
              },
              {
                label: "Unit", value: unitFilter,
                onChange: (v) => { setUnitFilter(v); setPage(1); },
                options: pricingUnits.map(u => ({ label: formatPricingUnit(u), value: u })),
              },
            ]}
          />
        </div>

        {hasFilters && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-muted-foreground" style={{ fontSize: 13 }}>
              Showing {filtered.length} of {pricingItems.length} items
            </span>
            <button onClick={clearFilters} className="text-gold-dark hover:text-gold transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>
              Clear all filters
            </button>
          </div>
        )}

        <DataTable
          keyField="id"
          data={paged}
          onRowClick={(p) => navigate(`/admin/pricing/${p.id}`)}
          emptyMessage={hasFilters ? "No items match your filters." : "No pricing items yet."}
          columns={[
            {
              key: "id", label: "Item ID", width: "90px",
              render: (p) => <span className="text-navy" style={{ fontSize: 12, fontWeight: 600 }}>{p.id}</span>,
            },
            {
              key: "itemName", label: "Item Name",
              render: (p) => (
                <div>
                  <p style={{ fontWeight: 500 }}>{p.itemName}</p>
                  {p.dimensions && (
                    <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>
                      {[p.dimensions.length && `${p.dimensions.length}mm`, p.dimensions.height && `×${p.dimensions.height}mm`, p.dimensions.thickness && `×${p.dimensions.thickness}mm`].filter(Boolean).join("")}
                    </p>
                  )}
                </div>
              ),
            },
            {
              key: "category", label: "Category",
              render: (p) => <StatusBadge status={p.category} size="xs" />,
            },
            {
              key: "itemType", label: "Type",
              render: (p) => <span className="text-muted-foreground">{formatItemType(p.itemType)}</span>,
            },
            {
              key: "unit", label: "Unit",
              render: (p) => <span className="text-muted-foreground">{formatPricingUnit(p.unit)}</span>,
            },
            {
              key: "rate", label: "Rate", align: "right",
              render: (p) => <span style={{ fontWeight: 600 }}>₹{p.rate.toLocaleString("en-IN")}</span>,
            },
            {
              key: "status", label: "Status",
              render: (p) => <StatusBadge status={p.status} />,
            },
            {
              key: "effective", label: "Effective",
              render: (p) => (
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>From: {p.effectiveFrom}</p>
                  {p.effectiveTo && <p className="text-muted-foreground" style={{ fontSize: 12 }}>To: {p.effectiveTo}</p>}
                </div>
              ),
            },
            {
              key: "updatedAt", label: "Last Updated",
              render: (p) => (
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>{p.updatedAt}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 11 }}>{p.updatedBy}</p>
                </div>
              ),
            },
            {
              key: "actions", label: "", width: "48px",
              render: (p) => (
                <RowActions
                  onView={() => navigate(`/admin/pricing/${p.id}`)}
                  onEdit={() => setEditItem(p)}
                />
              ),
            },
          ]}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </PageShell>

      <PricingFormModal open={addModal} onClose={() => setAddModal(false)} />
      <PricingFormModal open={!!editItem} onClose={() => setEditItem(null)} editItem={editItem} />
    </>
  );
}