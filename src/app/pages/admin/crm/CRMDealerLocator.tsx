import { useState } from "react";
import { PageShell } from "../../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, DataTable, Pagination, Button, Drawer,
  DetailField, SummaryCard, AlertCard, Modal, InputField, SelectField
} from "../../../components/shared";
import type { CRMAccount } from "../../../data/crm";
import { formatClassification, allCities, allStates, allZones } from "../../../data/crm";
import { useAccounts } from "../../../lib/useAccounts";
import {
  MapPin, Globe, Edit, Eye, ToggleLeft, ToggleRight, ArrowUp, ArrowDown,
  Download, Building2, CheckCircle2, XCircle, Search
} from "lucide-react";

import { handleExport } from "../../../components/shared/GlobalModals";
import { toast } from "sonner";

export function CRMDealerLocator() {
  const { accounts: crmAccounts } = useAccounts();
  const allDealers = crmAccounts.filter(a => a.accountType === "dealer");
  const [search, setSearch] = useState("");
  const [locatorFilter, setLocatorFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedDealer, setSelectedDealer] = useState<CRMAccount | null>(null);
  const [editModal, setEditModal] = useState<CRMAccount | null>(null);

  // Manage locator settings locally for UI demo
  const [locatorSettings, setLocatorSettings] = useState(
    allDealers.reduce((acc, d) => ({
      ...acc,
      [d.id]: { show: d.showOnLocator, priority: d.locatorPriority }
    }), {} as Record<string, { show: boolean; priority: number }>)
  );

  const filtered = allDealers.filter(d => {
    if (search && !d.businessName.toLowerCase().includes(search.toLowerCase()) && !d.city.toLowerCase().includes(search.toLowerCase())) return false;
    if (locatorFilter === "visible" && !locatorSettings[d.id]?.show) return false;
    if (locatorFilter === "hidden" && locatorSettings[d.id]?.show) return false;
    if (cityFilter && d.city !== cityFilter) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => (locatorSettings[b.id]?.priority || 0) - (locatorSettings[a.id]?.priority || 0));
  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  const visibleCount = allDealers.filter(d => locatorSettings[d.id]?.show).length;
  const cities = [...new Set(allDealers.map(d => d.city))];

  const toggleVisibility = (id: string) => {
    setLocatorSettings(prev => ({
      ...prev,
      [id]: { ...prev[id], show: !prev[id]?.show }
    }));
  };

  return (
    <>
      <PageShell
        title="Dealer Locator Management"
        subtitle={`Manage which dealers appear on the public dealer locator · ${visibleCount} visible of ${allDealers.length}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Globe size={14} />} onClick={() => toast.info("Opening locator preview", { description: "Dealer locator map will open in a new tab." })}>Preview Locator</Button>
            <Button variant="primary" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Dealer Locator")}>Export</Button>
          </div>
        }
      >
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy/8 flex items-center justify-center text-navy"><Building2 size={20} /></div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: 12 }}>Total Dealers</p>
              <p style={{ fontSize: 20, fontWeight: 700 }}>{allDealers.length}</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle2 size={20} /></div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: 12 }}>Visible on Locator</p>
              <p style={{ fontSize: 20, fontWeight: 700 }}>{visibleCount}</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600"><XCircle size={20} /></div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: 12 }}>Hidden</p>
              <p style={{ fontSize: 20, fontWeight: 700 }}>{allDealers.length - visibleCount}</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold-dark"><MapPin size={20} /></div>
            <div>
              <p className="text-muted-foreground" style={{ fontSize: 12 }}>Cities Covered</p>
              <p style={{ fontSize: 20, fontWeight: 700 }}>{cities.length}</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <AlertCard
          type="info"
          title="Dealer Locator"
          message="Toggle visibility, set priority (higher = shown first), and manage dealer listings on the public-facing dealer locator page."
        />

        {/* Filters */}
        <div className="mt-4 mb-4">
          <FilterBar
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search dealer or city..."
            filters={[
              { label: "Visibility", value: locatorFilter, onChange: (v) => { setLocatorFilter(v); setPage(1); }, options: [
                { label: "Visible", value: "visible" }, { label: "Hidden", value: "hidden" },
              ]},
              { label: "City", value: cityFilter, onChange: (v) => { setCityFilter(v); setPage(1); }, options: cities.map(c => ({ label: c, value: c })) },
            ]}
          />
        </div>

        {/* Table */}
        <DataTable
          keyField="id"
          data={paged}
          onRowClick={setSelectedDealer}
          emptyMessage="No dealers match the filter."
          columns={[
            { key: "id", label: "ID", width: "70px", render: (d) => <span className="text-muted-foreground" style={{ fontSize: 12 }}>{d.id}</span> },
            { key: "businessName", label: "Dealer", render: (d) => (
              <div>
                <p style={{ fontWeight: 500 }}>{d.businessName}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{d.contactPerson}</p>
              </div>
            )},
            { key: "city", label: "Location", render: (d) => (
              <div>
                <p>{d.city}, {d.state}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{d.territory} · {d.zone}</p>
              </div>
            )},
            { key: "classification", label: "Classification", render: (d) => (
              <span className="text-muted-foreground" style={{ fontSize: 12 }}>{formatClassification(d.classification)}</span>
            )},
            { key: "showOnLocator", label: "Visible", align: "center", render: (d) => (
              <button onClick={(e) => { e.stopPropagation(); toggleVisibility(d.id); }} className="inline-flex items-center gap-1">
                {locatorSettings[d.id]?.show
                  ? <ToggleRight size={22} className="text-emerald-500" />
                  : <ToggleLeft size={22} className="text-gray-300" />
                }
              </button>
            )},
            { key: "priority", label: "Priority", align: "center", render: (d) => (
              <div className="flex items-center gap-1 justify-center">
                <span className="w-8 text-center" style={{ fontSize: 14, fontWeight: 600 }}>{locatorSettings[d.id]?.priority || 0}</span>
                <div className="flex flex-col">
                  <button onClick={(e) => { e.stopPropagation(); setLocatorSettings(prev => ({ ...prev, [d.id]: { ...prev[d.id], priority: (prev[d.id]?.priority || 0) + 1 } })); }} className="text-muted-foreground hover:text-foreground">
                    <ArrowUp size={12} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setLocatorSettings(prev => ({ ...prev, [d.id]: { ...prev[d.id], priority: Math.max(0, (prev[d.id]?.priority || 0) - 1) } })); }} className="text-muted-foreground hover:text-foreground">
                    <ArrowDown size={12} />
                  </button>
                </div>
              </div>
            )},
            { key: "health", label: "Health", render: (d) => <StatusBadge status={d.health} /> },
            { key: "displayInstalled", label: "Display", align: "center", render: (d) => (
              d.displayInstalled
                ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                : <XCircle size={16} className="text-gray-300 mx-auto" />
            )},
          ]}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </PageShell>

      {/* Dealer Detail Drawer */}
      <Drawer open={!!selectedDealer} onClose={() => setSelectedDealer(null)} title="Dealer Locator Settings">
        {selectedDealer && (
          <div className="space-y-5">
            <div>
              <p style={{ fontSize: 18, fontWeight: 600 }}>{selectedDealer.businessName}</p>
              <p className="text-muted-foreground" style={{ fontSize: 13 }}>{selectedDealer.id} · {selectedDealer.city}, {selectedDealer.state}</p>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 14, fontWeight: 500 }}>Visible on Locator</span>
                <button onClick={() => toggleVisibility(selectedDealer.id)}>
                  {locatorSettings[selectedDealer.id]?.show
                    ? <ToggleRight size={28} className="text-emerald-500" />
                    : <ToggleLeft size={28} className="text-gray-300" />
                  }
                </button>
              </div>
              <div>
                <p className="text-muted-foreground mb-1" style={{ fontSize: 12 }}>Priority</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setLocatorSettings(prev => ({ ...prev, [selectedDealer.id]: { ...prev[selectedDealer.id], priority: Math.max(0, (prev[selectedDealer.id]?.priority || 0) - 1) } }))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent">
                    <ArrowDown size={14} />
                  </button>
                  <span className="w-12 text-center" style={{ fontSize: 18, fontWeight: 700 }}>{locatorSettings[selectedDealer.id]?.priority || 0}</span>
                  <button onClick={() => setLocatorSettings(prev => ({ ...prev, [selectedDealer.id]: { ...prev[selectedDealer.id], priority: (prev[selectedDealer.id]?.priority || 0) + 1 } }))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent">
                    <ArrowUp size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <DetailField label="Contact" value={selectedDealer.contactPerson} />
              <DetailField label="Mobile" value={selectedDealer.mobile} />
              <DetailField label="Classification" value={formatClassification(selectedDealer.classification)} />
              <DetailField label="Display Installed" value={selectedDealer.displayInstalled ? "Yes" : "No"} />
              <DetailField label="Address" value={selectedDealer.address} />
              <DetailField label="Health" value={<StatusBadge status={selectedDealer.health} />} />
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-muted-foreground mb-2" style={{ fontSize: 12, fontWeight: 500 }}>Coordinates</p>
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Latitude" value={selectedDealer.latitude.toFixed(4)} />
                <DetailField label="Longitude" value={selectedDealer.longitude.toFixed(4)} />
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}