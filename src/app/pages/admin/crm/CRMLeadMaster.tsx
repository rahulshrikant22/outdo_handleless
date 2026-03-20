import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import {
  StatusBadge, FilterBar, DataTable, Pagination, Button, Drawer,
  DetailField, Timeline, TabBar, SummaryCard, EmptyState
} from "../../../components/shared";
import { FollowUpModal, ConvertLeadModal, BadLeadModal, SampleKitModal } from "../../../components/crm/CRMModals";
import { handleExport } from "../../../components/shared/GlobalModals";
import { useLeads } from "../../../lib/useLeads";
import type { CRMLead } from "../../../data/crm";
import {
  crmSalespeople, allCities, allStates,
  allTerritoryNames, getLeadAgingDays,
  getCitySummary, getSalespersonSummary, getLeadsByDatabase
} from "../../../data/crm";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Users, TrendingUp, Flame, ThermometerSun, Snowflake, CheckCircle2,
  XCircle, Download, Plus, Calendar, Phone, Mail, MessageSquare,
  MapPin, ArrowRight, Package, Filter as FilterIcon, BarChart3,
  Database, Send, UserPlus, X
} from "lucide-react";

const qualityIcons: Record<string, React.ReactNode> = {
  hot: <Flame size={13} className="text-red-500" />,
  warm: <ThermometerSun size={13} className="text-amber-500" />,
  cold: <Snowflake size={13} className="text-sky-500" />,
  bad: <XCircle size={13} className="text-gray-400" />,
  account: <CheckCircle2 size={13} className="text-emerald-500" />,
};

const followUpTypeIcons: Record<string, React.ReactNode> = {
  call: <Phone size={14} />, email: <Mail size={14} />, meeting: <MapPin size={14} />,
  whatsapp: <MessageSquare size={14} />, visit: <MapPin size={14} />,
};

const PIE_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#9ca3af", "#10b981"];

// Add Lead Modal Component
function AddLeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    database: "dealer" as string,
    businessName: "",
    contactPerson: "",
    mobile: "",
    email: "",
    city: "",
    state: "",
    territory: "",
    quality: "cold" as string,
    assignedUserId: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ database: "dealer", businessName: "", contactPerson: "", mobile: "", email: "", city: "", state: "", territory: "", quality: "cold", assignedUserId: "", notes: "" });
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Add New Lead</h2>
            <p className="text-muted-foreground" style={{ fontSize: 13 }}>Create a new lead and assign to a salesperson</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent transition-colors"><X size={18} /></button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600 }}>Lead Created Successfully!</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 13 }}>Lead has been added and assigned.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>Database *</label>
              <select value={form.database} onChange={(e) => setForm({ ...form, database: e.target.value })} className="w-full h-10 rounded-lg border border-border px-3 bg-background" style={{ fontSize: 13.5 }} required>
                <option value="dealer">Dealer Possibility</option>
                <option value="factory">Factory Possibility</option>
                <option value="architect">Architect / Interior</option>
                <option value="organic">Organic</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>Business Name *</label>
                <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="w-full h-10 rounded-lg border border-border px-3" style={{ fontSize: 13.5 }} required placeholder="Enter business name" />
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>Contact Person *</label>
                <input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} className="w-full h-10 rounded-lg border border-border px-3" style={{ fontSize: 13.5 }} required placeholder="Enter contact name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>Mobile *</label>
                <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full h-10 rounded-lg border border-border px-3" style={{ fontSize: 13.5 }} required placeholder="+91-XXXXXXXXXX" />
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 rounded-lg border border-border px-3" style={{ fontSize: 13.5 }} type="email" placeholder="email@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full h-10 rounded-lg border border-border px-3" style={{ fontSize: 13.5 }} placeholder="City" />
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>State</label>
                <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full h-10 rounded-lg border border-border px-3 bg-background" style={{ fontSize: 13.5 }}>
                  <option value="">Select State</option>
                  {allStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>Territory</label>
                <select value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })} className="w-full h-10 rounded-lg border border-border px-3 bg-background" style={{ fontSize: 13.5 }}>
                  <option value="">Select Territory</option>
                  {allTerritoryNames.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>Lead Quality</label>
                <select value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} className="w-full h-10 rounded-lg border border-border px-3 bg-background" style={{ fontSize: 13.5 }}>
                  <option value="cold">Cold</option>
                  <option value="warm">Warm</option>
                  <option value="hot">Hot</option>
                </select>
              </div>
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>Assign to Salesperson *</label>
                <select value={form.assignedUserId} onChange={(e) => setForm({ ...form, assignedUserId: e.target.value })} className="w-full h-10 rounded-lg border border-border px-3 bg-background" style={{ fontSize: 13.5 }} required>
                  <option value="">Select Salesperson</option>
                  {crmSalespeople.map((sp) => <option key={sp.id} value={sp.id}>{sp.name} — {sp.territory}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-lg border border-border px-3 py-2 resize-none" style={{ fontSize: 13.5 }} rows={3} placeholder="Additional notes..." />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={onClose} className="flex-1">Cancel</Button>
              <Button variant="primary" size="sm" type="submit" className="flex-1" icon={<Plus size={14} />}>Create Lead</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Transfer from Database Modal
function TransferModal({ open, onClose, database }: { open: boolean; onClose: () => void; database: string }) {
  const dbLeads = database ? getLeadsByDatabase(database as any) : [];
  const transferable = dbLeads.filter(l => l.quality !== "account" && l.quality !== "bad");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [assignTo, setAssignTo] = useState("");
  const [done, setDone] = useState(false);

  if (!open) return null;

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleTransfer = () => {
    if (selected.size === 0 || !assignTo) return;
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setSelected(new Set());
      setAssignTo("");
      onClose();
    }, 1500);
  };

  const dbLabel: Record<string, string> = { dealer: "Dealer", factory: "Factory", architect: "Architect", organic: "Organic" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Transfer from {dbLabel[database] || database} Database</h2>
            <p className="text-muted-foreground" style={{ fontSize: 13 }}>Select leads to transfer to Lead Master and assign a salesperson</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent transition-colors"><X size={18} /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600 }}>{selected.size} Lead{selected.size > 1 ? "s" : ""} Transferred!</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 13 }}>Assigned to salesperson and added to Lead Master.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {transferable.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground" style={{ fontSize: 13 }}>No transferable leads in this database.</div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => setSelected(selected.size === transferable.length ? new Set() : new Set(transferable.map(l => l.id)))} className="text-navy hover:underline" style={{ fontSize: 12.5, fontWeight: 500 }}>
                      {selected.size === transferable.length ? "Deselect All" : "Select All"}
                    </button>
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>({selected.size} selected)</span>
                  </div>
                  {transferable.map((lead) => (
                    <label key={lead.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selected.has(lead.id) ? "border-navy bg-navy/5" : "border-border hover:bg-accent"}`}>
                      <input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggleSelect(lead.id)} className="w-4 h-4 rounded border-border accent-navy" />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 13.5, fontWeight: 500 }}>{lead.businessName}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>{lead.contactPerson} · {lead.city}, {lead.state}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {qualityIcons[lead.quality]}
                        <StatusBadge status={lead.quality} size="xs" />
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-border space-y-3">
              <div>
                <label className="block text-muted-foreground mb-1.5" style={{ fontSize: 12.5, fontWeight: 500 }}>Assign to Salesperson *</label>
                <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)} className="w-full h-10 rounded-lg border border-border px-3 bg-background" style={{ fontSize: 13.5 }}>
                  <option value="">Select Salesperson</option>
                  {crmSalespeople.map((sp) => <option key={sp.id} value={sp.id}>{sp.name} — {sp.territory}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={onClose} className="flex-1">Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleTransfer} className="flex-1" icon={<Send size={14} />}>
                  Transfer {selected.size > 0 ? `${selected.size} Lead${selected.size > 1 ? "s" : ""}` : ""}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function CRMLeadMaster() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  const { leads: crmLeads, loading, refresh } = useLeads();

  // Filters
  const [search, setSearch] = useState("");
  const [dbFilter, setDbFilter] = useState("");
  const [qualityFilter, setQualityFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [territoryFilter, setTerritoryFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);

  // Modals
  const [followUpModal, setFollowUpModal] = useState<CRMLead | null>(null);
  const [convertModal, setConvertModal] = useState<CRMLead | null>(null);
  const [badModal, setBadModal] = useState<CRMLead | null>(null);
  const [sampleModal, setSampleModal] = useState<CRMLead | null>(null);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [transferDb, setTransferDb] = useState<string | null>(null);

  // Filter logic
  const filtered = crmLeads.filter((l) => {
    if (search && !l.businessName.toLowerCase().includes(search.toLowerCase()) && !l.contactPerson.toLowerCase().includes(search.toLowerCase()) && !l.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (dbFilter && l.database !== dbFilter) return false;
    if (qualityFilter && l.quality !== qualityFilter) return false;
    if (cityFilter && l.city !== cityFilter) return false;
    if (stateFilter && l.state !== stateFilter) return false;
    if (territoryFilter && l.territory !== territoryFilter) return false;
    if (assigneeFilter && l.assignedUserId !== assigneeFilter) return false;
    return true;
  });

  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  // Stats
  const hot = crmLeads.filter(l => l.quality === "hot").length;
  const warm = crmLeads.filter(l => l.quality === "warm").length;
  const cold = crmLeads.filter(l => l.quality === "cold").length;
  const bad = crmLeads.filter(l => l.quality === "bad").length;
  const converted = crmLeads.filter(l => l.quality === "account").length;

  // Analytics
  const citySummary = getCitySummary();
  const spSummary = getSalespersonSummary();

  const qualityPieData = [
    { name: "Hot", value: hot },
    { name: "Warm", value: warm },
    { name: "Cold", value: cold },
    { name: "Bad", value: bad },
    { name: "Converted", value: converted },
  ];

  // Database summary data
  const dbSummary = (["dealer", "factory", "architect", "organic"] as const).map(db => {
    const leads = getLeadsByDatabase(db);
    return {
      database: db,
      label: db === "architect" ? "Architect" : db.charAt(0).toUpperCase() + db.slice(1),
      total: leads.length,
      hot: leads.filter(l => l.quality === "hot").length,
      warm: leads.filter(l => l.quality === "warm").length,
      cold: leads.filter(l => l.quality === "cold").length,
      bad: leads.filter(l => l.quality === "bad").length,
      converted: leads.filter(l => l.quality === "account").length,
    };
  });

  const cityBarData = Object.entries(citySummary)
    .map(([city, data]) => ({ city, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const hasFilters = search || dbFilter || qualityFilter || cityFilter || stateFilter || territoryFilter || assigneeFilter;
  const clearFilters = () => { setSearch(""); setDbFilter(""); setQualityFilter(""); setCityFilter(""); setStateFilter(""); setTerritoryFilter(""); setAssigneeFilter(""); setPage(1); };

  return (
    <>
      <PageShell
        title="Lead Master"
        subtitle={`All leads across all databases · ${crmLeads.length} total`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Lead Master")}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setAddLeadOpen(true)}>Add Lead</Button>
          </div>
        }
      >
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <StatCard label="Total Leads" value={crmLeads.length} icon={<Users size={18} />} accent="navy" />
          <StatCard label="Hot" value={hot} icon={<Flame size={18} />} accent="red" />
          <StatCard label="Warm" value={warm} icon={<ThermometerSun size={18} />} accent="gold" />
          <StatCard label="Cold" value={cold} icon={<Snowflake size={18} />} accent="blue" />
          <StatCard label="Bad / Lost" value={bad} icon={<XCircle size={18} />} accent="purple" />
          <StatCard label="Converted" value={converted} icon={<CheckCircle2 size={18} />} accent="green" trend={`${Math.round((converted / crmLeads.length) * 100)}%`} trendDirection="up" />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <TabBar
            tabs={[
              { key: "list", label: "All Leads", count: crmLeads.length },
              { key: "database", label: "Database Summary" },
              { key: "city", label: "City Summary" },
              { key: "salesperson", label: "Salesperson Summary" },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {activeTab === "list" && (
          <>
            {/* Transfer from Databases Banner */}
            <div className="mb-4 p-4 rounded-xl border border-border bg-accent/30">
              <div className="flex items-center gap-2 mb-3">
                <Database size={16} className="text-navy" />
                <p style={{ fontSize: 13.5, fontWeight: 600 }}>Transfer Leads from Databases</p>
                <span className="text-muted-foreground" style={{ fontSize: 12 }}>— Pull data from source databases and assign to salespersons</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["dealer", "factory", "architect", "organic"] as const).map(db => {
                  const count = getLeadsByDatabase(db).filter(l => l.quality !== "account" && l.quality !== "bad").length;
                  const labels: Record<string, string> = { dealer: "Dealer DB", factory: "Factory DB", architect: "Architect DB", organic: "Organic DB" };
                  return (
                    <button key={db} onClick={() => setTransferDb(db)} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-navy/5 hover:border-navy/30 transition-colors" style={{ fontSize: 13 }}>
                      <Send size={13} className="text-navy" />
                      <span style={{ fontWeight: 500 }}>{labels[db]}</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-navy/10 text-navy" style={{ fontSize: 11, fontWeight: 600 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="mb-4">
              <FilterBar
                searchValue={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search by name, contact, or ID..."
                filters={[
                  { label: "Database", value: dbFilter, onChange: (v) => { setDbFilter(v); setPage(1); }, options: [
                    { label: "Dealer", value: "dealer" }, { label: "Factory", value: "factory" },
                    { label: "Architect", value: "architect" }, { label: "Organic", value: "organic" },
                  ]},
                  { label: "Quality", value: qualityFilter, onChange: (v) => { setQualityFilter(v); setPage(1); }, options: [
                    { label: "Hot", value: "hot" }, { label: "Warm", value: "warm" }, { label: "Cold", value: "cold" },
                    { label: "Bad", value: "bad" }, { label: "Account", value: "account" },
                  ]},
                  { label: "State", value: stateFilter, onChange: (v) => { setStateFilter(v); setPage(1); }, options: allStates.map(s => ({ label: s, value: s })) },
                  { label: "City", value: cityFilter, onChange: (v) => { setCityFilter(v); setPage(1); }, options: allCities.map(c => ({ label: c, value: c })) },
                  { label: "Assigned", value: assigneeFilter, onChange: (v) => { setAssigneeFilter(v); setPage(1); }, options: crmSalespeople.map(sp => ({ label: sp.name, value: sp.id })) },
                ]}
              />
            </div>

            {hasFilters && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>
                  Showing {filtered.length} of {crmLeads.length} leads
                </span>
                <button onClick={clearFilters} className="text-gold-dark hover:text-gold transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Clear all filters</button>
              </div>
            )}

            {/* Table */}
            <DataTable
              keyField="id"
              data={paged}
              onRowClick={(l) => setSelectedLead(l)}
              emptyMessage={hasFilters ? "No leads match your filters. Try adjusting your search criteria." : "No leads yet."}
              columns={[
                { key: "id", label: "ID", width: "75px", render: (l) => <span className="text-muted-foreground" style={{ fontSize: 12 }}>{l.id}</span> },
                { key: "database", label: "DB", width: "70px", render: (l) => <StatusBadge status={l.database} size="xs" /> },
                { key: "businessName", label: "Business / Contact", render: (l) => (
                  <div>
                    <p style={{ fontWeight: 500 }}>{l.businessName}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>{l.contactPerson}</p>
                  </div>
                )},
                { key: "city", label: "Location", render: (l) => (
                  <div>
                    <p>{l.city}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>{l.state} · {l.territory}</p>
                  </div>
                )},
                { key: "quality", label: "Quality", render: (l) => (
                  <div className="flex items-center gap-1.5">
                    {qualityIcons[l.quality]}
                    <StatusBadge status={l.quality} />
                  </div>
                )},
                { key: "assignedUserName", label: "Assigned", render: (l) => <span>{l.assignedUserName}</span> },
                { key: "nextFollowUp", label: "Next F/U", render: (l) => (
                  l.nextFollowUp ? (
                    <span className={new Date(l.nextFollowUp) < new Date("2026-03-16") ? "text-red-600" : ""} style={{ fontSize: 13 }}>
                      {l.nextFollowUp}
                    </span>
                  ) : <span className="text-muted-foreground" style={{ fontSize: 12 }}>—</span>
                )},
              ]}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}

        {activeTab === "database" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SummaryCard title="Leads by Database">
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={dbSummary} margin={{ bottom: 5 }}>
                    <XAxis dataKey="label" style={{ fontSize: 12 }} />
                    <YAxis style={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ fontSize: 13, borderRadius: 10 }} />
                    <Bar dataKey="total" fill="#1B2A4A" name="Total" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="converted" fill="#10b981" name="Converted" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SummaryCard>
            <SummaryCard title="Quality Distribution">
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie data={qualityPieData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" paddingAngle={3} label={({ name, value }) => `${name}: ${value}`}>
                      {qualityPieData.map((_, i) => <Cell key={`quality-pie-${i}`} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ fontSize: 13, borderRadius: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SummaryCard>
            <SummaryCard title="Database-wise Breakdown" actions={<Button variant="outline" size="sm" icon={<Download size={13} />} onClick={() => handleExport("Database Summary")}>Export</Button>}>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: 13 }}>
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Database</th>
                      <th className="text-center py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Total</th>
                      <th className="text-center py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Hot</th>
                      <th className="text-center py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Warm</th>
                      <th className="text-center py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Cold</th>
                      <th className="text-center py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Bad</th>
                      <th className="text-center py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Converted</th>
                      <th className="text-center py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbSummary.map((d) => (
                      <tr key={d.database} className="border-b border-border/50">
                        <td className="py-2" style={{ fontWeight: 500 }}>
                          <button onClick={() => navigate(`/admin/crm/${d.database}`)} className="text-navy hover:underline">{d.label}</button>
                        </td>
                        <td className="text-center py-2">{d.total}</td>
                        <td className="text-center py-2 text-red-600">{d.hot || "—"}</td>
                        <td className="text-center py-2 text-amber-600">{d.warm || "—"}</td>
                        <td className="text-center py-2 text-sky-600">{d.cold || "—"}</td>
                        <td className="text-center py-2 text-gray-400">{d.bad || "—"}</td>
                        <td className="text-center py-2 text-emerald-600">{d.converted || "—"}</td>
                        <td className="text-center py-2">
                          <button onClick={() => setTransferDb(d.database)} className="text-navy hover:underline flex items-center gap-1 mx-auto" style={{ fontSize: 12 }}>
                            <Send size={11} /> Transfer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SummaryCard>
          </div>
        )}

        {activeTab === "city" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SummaryCard title="Leads by City">
              <div style={{ height: 360 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={cityBarData} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" style={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="city" width={90} style={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 13, borderRadius: 10 }} />
                    <Bar dataKey="total" fill="#1B2A4A" radius={[0, 4, 4, 0]} name="Total" />
                    <Bar dataKey="converted" fill="#EC6E63" radius={[0, 4, 4, 0]} name="Converted" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SummaryCard>
            <SummaryCard title="City-wise Breakdown" actions={<Button variant="outline" size="sm" icon={<Download size={13} />} onClick={() => handleExport("City Summary")}>Export</Button>}>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: 13 }}>
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>City</th>
                      <th className="text-center py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Total</th>
                      <th className="text-center py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Active</th>
                      <th className="text-center py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Converted</th>
                      <th className="text-center py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>Conv %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(citySummary).sort((a, b) => b[1].total - a[1].total).map(([city, d]) => (
                      <tr key={city} className="border-b border-border/50">
                        <td className="py-2" style={{ fontWeight: 500 }}>{city}</td>
                        <td className="text-center py-2">{d.total}</td>
                        <td className="text-center py-2">{d.active}</td>
                        <td className="text-center py-2 text-emerald-600">{d.converted}</td>
                        <td className="text-center py-2">{d.total > 0 ? `${Math.round((d.converted / d.total) * 100)}%` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SummaryCard>
          </div>
        )}

        {activeTab === "salesperson" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SummaryCard title="Salesperson Conversion Performance">
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={spSummary} margin={{ bottom: 5 }}>
                      <XAxis dataKey="name" style={{ fontSize: 11 }} />
                      <YAxis style={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ fontSize: 13, borderRadius: 10 }} />
                      <Bar dataKey="totalLeads" fill="#1B2A4A" name="Total Leads" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="convertedLeads" fill="#10b981" name="Converted" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SummaryCard>
              <SummaryCard title="Account Value by Salesperson">
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={spSummary} margin={{ bottom: 5 }}>
                      <XAxis dataKey="name" style={{ fontSize: 11 }} />
                      <YAxis style={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                      <Tooltip contentStyle={{ fontSize: 13, borderRadius: 10 }} formatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Bar dataKey="totalAccountValue" fill="#EC6E63" name="Account Value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SummaryCard>
            </div>
            <SummaryCard title="Detailed Salesperson Summary" actions={<Button variant="outline" size="sm" icon={<Download size={13} />} onClick={() => handleExport("Salesperson Summary")}>Export</Button>}>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: 13 }}>
                  <thead>
                    <tr className="border-b border-border">
                      {["Name", "Territory", "Leads", "Converted", "Conv %", "Avg Days", "Accounts", "Total Value"].map(h => (
                        <th key={h} className="text-left py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {spSummary.map(sp => (
                      <tr key={sp.id} className="border-b border-border/50">
                        <td className="py-2" style={{ fontWeight: 500 }}>{sp.name}</td>
                        <td className="py-2 text-muted-foreground">{sp.territory}</td>
                        <td className="py-2">{sp.totalLeads}</td>
                        <td className="py-2 text-emerald-600">{sp.convertedLeads}</td>
                        <td className="py-2">{sp.conversionRate}%</td>
                        <td className="py-2">{sp.avgDaysToConvert}d</td>
                        <td className="py-2">{sp.totalAccounts}</td>
                        <td className="py-2" style={{ fontWeight: 500 }}>₹{(sp.totalAccountValue / 1000).toFixed(0)}K</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SummaryCard>
          </div>
        )}
      </PageShell>

      {/* Lead Detail Drawer */}
      <Drawer open={!!selectedLead} onClose={() => setSelectedLead(null)} title="Lead Details">
        {selectedLead && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p style={{ fontSize: 18, fontWeight: 600 }}>{selectedLead.businessName}</p>
                <p className="text-muted-foreground mt-0.5" style={{ fontSize: 13 }}>{selectedLead.id} · {selectedLead.database} database</p>
              </div>
              <div className="flex items-center gap-1.5">
                {qualityIcons[selectedLead.quality]}
                <StatusBadge status={selectedLead.quality} size="md" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" icon={<Calendar size={14} />} onClick={() => { setSelectedLead(null); setFollowUpModal(selectedLead); }}>Log Follow-up</Button>
              {selectedLead.quality !== "account" && selectedLead.quality !== "bad" && (
                <Button variant="gold" size="sm" icon={<CheckCircle2 size={14} />} onClick={() => { setSelectedLead(null); setConvertModal(selectedLead); }}>Convert</Button>
              )}
              {selectedLead.quality !== "bad" && selectedLead.quality !== "account" && (
                <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => { setSelectedLead(null); setBadModal(selectedLead); }}>Mark Bad</Button>
              )}
              <Button variant="outline" size="sm" icon={<Package size={14} />} onClick={() => { setSelectedLead(null); setSampleModal(selectedLead); }}>Sample Kit</Button>
            </div>
            <Button variant="primary" size="sm" className="w-full" icon={<ArrowRight size={14} />} onClick={() => { setSelectedLead(null); navigate(`/admin/crm/leads/${selectedLead.id}`); }}>Open Full Detail</Button>
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Contact Person" value={selectedLead.contactPerson} />
                <DetailField label="Mobile" value={selectedLead.mobile} />
                <DetailField label="Email" value={selectedLead.email} />
                <DetailField label="Database" value={selectedLead.database.charAt(0).toUpperCase() + selectedLead.database.slice(1)} />
                <DetailField label="City" value={selectedLead.city} />
                <DetailField label="State" value={selectedLead.state} />
                <DetailField label="Territory" value={selectedLead.territory} />
                <DetailField label="Assigned To" value={selectedLead.assignedUserName} />
              </div>
              {selectedLead.lostReason && <DetailField label="Lost Reason" value={<span className="text-red-600">{selectedLead.lostReason}</span>} />}
              {selectedLead.conversionDate && (
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Converted On" value={selectedLead.conversionDate} />
                  <DetailField label="Converted By" value={selectedLead.convertedBy} />
                  <DetailField label="Days to Convert" value={`${selectedLead.daysToConvert} days`} />
                </div>
              )}
              <DetailField label="Notes" value={selectedLead.notes} />
            </div>
            {selectedLead.followUpHistory.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p style={{ fontSize: 14, fontWeight: 500 }} className="mb-3">Follow-up History</p>
                <Timeline
                  items={selectedLead.followUpHistory.slice().reverse().map((fu) => ({
                    id: fu.id,
                    title: `${fu.type.charAt(0).toUpperCase() + fu.type.slice(1)} — ${fu.outcome}`,
                    description: fu.notes,
                    time: fu.date,
                    icon: followUpTypeIcons[fu.type],
                    status: "completed" as const,
                  }))}
                />
              </div>
            )}
          </div>
        )}
      </Drawer>

      <FollowUpModal open={!!followUpModal} onClose={() => setFollowUpModal(null)} lead={followUpModal} />
      <ConvertLeadModal open={!!convertModal} onClose={() => setConvertModal(null)} lead={convertModal} />
      <BadLeadModal open={!!badModal} onClose={() => setBadModal(null)} lead={badModal} />
      <SampleKitModal open={!!sampleModal} onClose={() => setSampleModal(null)} lead={sampleModal} />
      <AddLeadModal open={addLeadOpen} onClose={() => setAddLeadOpen(false)} />
      <TransferModal open={!!transferDb} onClose={() => setTransferDb(null)} database={transferDb || ""} />
    </>
  );
}