import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../layout/PageShell";
import { StatCard } from "../layout/StatCard";
import {
  StatusBadge, FilterBar, DataTable, Pagination, Button, Drawer,
  DetailField, Timeline, EmptyState
} from "../shared";
import { FollowUpModal, ConvertLeadModal, BadLeadModal, SampleKitModal } from "./CRMModals";
import { handleExport, AddLeadToDBModal } from "../shared/GlobalModals";
import type { CRMLead, CRMDatabase } from "../../data/crm";
import {
  getLeadsByDatabase, getLeadAgingDays, allCities, allStates,
  crmSalespeople
} from "../../data/crm";
import {
  Plus, Download, Users, TrendingUp, Package, XCircle,
  Calendar, Phone, Mail, MessageSquare, MapPin, ArrowRight,
  Flame, Snowflake, ThermometerSun, CheckCircle2, Clock
} from "lucide-react";

const dbConfig: Record<CRMDatabase, { title: string; subtitle: string; icon: React.ReactNode }> = {
  dealer: { title: "Dealer Possibility Database", subtitle: "Track and manage potential dealer partnerships", icon: <Users size={18} /> },
  factory: { title: "Factory Possibility Database", subtitle: "Track potential manufacturing partners", icon: <Users size={18} /> },
  architect: { title: "Architect / Interior Possibility Database", subtitle: "Track potential architect and interior designer partnerships", icon: <Users size={18} /> },
  organic: { title: "Organic Lead Database", subtitle: "Website inquiries, referrals, and direct customer leads", icon: <Users size={18} /> },
};

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

export function LeadDatabasePage({ database }: { database: CRMDatabase }) {
  const navigate = useNavigate();
  const config = dbConfig[database];
  const allLeads = getLeadsByDatabase(database);

  const [search, setSearch] = useState("");
  const [qualityFilter, setQualityFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [sampleFilter, setSampleFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);

  // Modal states
  const [followUpModal, setFollowUpModal] = useState<CRMLead | null>(null);
  const [convertModal, setConvertModal] = useState<CRMLead | null>(null);
  const [badModal, setBadModal] = useState<CRMLead | null>(null);
  const [sampleModal, setSampleModal] = useState<CRMLead | null>(null);
  const [addLeadModal, setAddLeadModal] = useState(false);

  // Filter
  const filtered = allLeads.filter((l) => {
    if (search && !l.businessName.toLowerCase().includes(search.toLowerCase()) && !l.contactPerson.toLowerCase().includes(search.toLowerCase()) && !l.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (qualityFilter && l.quality !== qualityFilter) return false;
    if (cityFilter && l.city !== cityFilter) return false;
    if (stateFilter && l.state !== stateFilter) return false;
    if (sampleFilter && l.sampleStatus !== sampleFilter) return false;
    if (assigneeFilter && l.assignedUserId !== assigneeFilter) return false;
    return true;
  });

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  // Stats
  const hot = allLeads.filter((l) => l.quality === "hot").length;
  const warm = allLeads.filter((l) => l.quality === "warm").length;
  const cold = allLeads.filter((l) => l.quality === "cold").length;
  const converted = allLeads.filter((l) => l.quality === "account").length;

  const cities = [...new Set(allLeads.map((l) => l.city))];
  const states = [...new Set(allLeads.map((l) => l.state))];

  return (
    <>
      <PageShell
        title={config.title}
        subtitle={config.subtitle}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport(`${database} Leads`)}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setAddLeadModal(true)}>Add Lead</Button>
          </div>
        }
      >
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard label="Total Leads" value={allLeads.length} icon={<Users size={18} />} accent="navy" />
          <StatCard label="Hot" value={hot} icon={<Flame size={18} />} accent="red" trend={`${hot > 0 ? Math.round((hot / allLeads.length) * 100) : 0}%`} trendDirection="up" />
          <StatCard label="Warm" value={warm} icon={<ThermometerSun size={18} />} accent="gold" />
          <StatCard label="Cold" value={cold} icon={<Snowflake size={18} />} accent="blue" />
          <StatCard label="Converted" value={converted} icon={<CheckCircle2 size={18} />} accent="green" trend={`${converted > 0 ? Math.round((converted / allLeads.length) * 100) : 0}%`} trendDirection="up" />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FilterBar
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search by name, person, or ID..."
            filters={[
              { label: "Quality", value: qualityFilter, onChange: (v) => { setQualityFilter(v); setPage(1); }, options: [
                { label: "Hot", value: "hot" }, { label: "Warm", value: "warm" }, { label: "Cold", value: "cold" },
                { label: "Bad", value: "bad" }, { label: "Account", value: "account" },
              ]},
              { label: "City", value: cityFilter, onChange: (v) => { setCityFilter(v); setPage(1); }, options: cities.map((c) => ({ label: c, value: c })) },
              { label: "State", value: stateFilter, onChange: (v) => { setStateFilter(v); setPage(1); }, options: states.map((s) => ({ label: s, value: s })) },
              ...(database !== "organic" ? [{ label: "Sample", value: sampleFilter, onChange: (v: string) => { setSampleFilter(v); setPage(1); }, options: [
                { label: "Pending", value: "pending" }, { label: "Provided", value: "provided" },
              ]}] : []),
              { label: "Assigned To", value: assigneeFilter, onChange: (v) => { setAssigneeFilter(v); setPage(1); }, options: crmSalespeople.map((sp) => ({ label: sp.name, value: sp.id })) },
            ]}
          />
        </div>

        {/* Active filters count */}
        {(search || qualityFilter || cityFilter || stateFilter || sampleFilter || assigneeFilter) && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-muted-foreground" style={{ fontSize: 13 }}>
              Showing {filtered.length} of {allLeads.length} leads
            </span>
            <button onClick={() => { setSearch(""); setQualityFilter(""); setCityFilter(""); setStateFilter(""); setSampleFilter(""); setAssigneeFilter(""); setPage(1); }} className="text-gold-dark hover:text-gold transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>
              Clear all filters
            </button>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          keyField="id"
          data={paged}
          onRowClick={(l) => setSelectedLead(l)}
          emptyMessage={search || qualityFilter || cityFilter ? "No leads match your filters. Try adjusting your search criteria." : "No leads in this database yet."}
          columns={[
            { key: "id", label: "ID", width: "80px", render: (l) => <span className="text-muted-foreground" style={{ fontSize: 12 }}>{l.id}</span> },
            { key: "businessName", label: "Business Name", render: (l) => (
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
            ...(database !== "organic" ? [{ key: "sampleStatus" as string, label: "Sample", render: (l: CRMLead) => <StatusBadge status={l.sampleStatus} size="xs" /> }] : []),
            { key: "assignedUserName", label: "Assigned To", render: (l) => <span>{l.assignedUserName}</span> },
            { key: "aging", label: "Aging", align: "right" as const, render: (l) => {
              const days = getLeadAgingDays(l.createdAt);
              return <span className={days > 60 ? "text-red-600" : days > 30 ? "text-amber-600" : "text-muted-foreground"} style={{ fontSize: 13 }}>{days}d</span>;
            }},
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
      </PageShell>

      {/* Lead Detail Drawer */}
      <Drawer open={!!selectedLead} onClose={() => setSelectedLead(null)} title="Lead Details">
        {selectedLead && (
          <div className="space-y-5">
            {/* Header */}
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

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" icon={<Calendar size={14} />} onClick={() => { setSelectedLead(null); setFollowUpModal(selectedLead); }}>Log Follow-up</Button>
              {selectedLead.quality !== "account" && selectedLead.quality !== "bad" && (
                <Button variant="gold" size="sm" icon={<CheckCircle2 size={14} />} onClick={() => { setSelectedLead(null); setConvertModal(selectedLead); }}>Convert</Button>
              )}
              {selectedLead.quality !== "bad" && selectedLead.quality !== "account" && (
                <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => { setSelectedLead(null); setBadModal(selectedLead); }}>Mark Bad</Button>
              )}
              {database !== "organic" && (
                <Button variant="outline" size="sm" icon={<Package size={14} />} onClick={() => { setSelectedLead(null); setSampleModal(selectedLead); }}>Sample Kit</Button>
              )}
            </div>

            <Button variant="primary" size="sm" className="w-full" icon={<ArrowRight size={14} />} onClick={() => { setSelectedLead(null); navigate(`/admin/crm/leads/${selectedLead.id}`); }}>
              Open Full Detail Page
            </Button>

            {/* Details */}
            <div className="space-y-4 pt-2 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Contact Person" value={selectedLead.contactPerson} />
                <DetailField label="Mobile" value={selectedLead.mobile} />
                <DetailField label="Email" value={selectedLead.email} />
                <DetailField label="City" value={selectedLead.city} />
                <DetailField label="State" value={selectedLead.state} />
                <DetailField label="Territory" value={selectedLead.territory} />
                <DetailField label="Assigned To" value={selectedLead.assignedUserName} />
                <DetailField label="Sample Status" value={<StatusBadge status={selectedLead.sampleStatus} />} />
                <DetailField label="Created" value={selectedLead.createdAt} />
                <DetailField label="Aging" value={`${getLeadAgingDays(selectedLead.createdAt)} days`} />
              </div>

              {selectedLead.lostReason && (
                <DetailField label="Lost Reason" value={<span className="text-red-600">{selectedLead.lostReason}</span>} />
              )}

              {selectedLead.conversionDate && (
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Converted On" value={selectedLead.conversionDate} />
                  <DetailField label="Converted By" value={selectedLead.convertedBy} />
                  <DetailField label="Days to Convert" value={`${selectedLead.daysToConvert} days`} />
                  <DetailField label="Account ID" value={selectedLead.convertedAccountId} />
                </div>
              )}

              <DetailField label="Notes" value={selectedLead.notes} />
            </div>

            {/* Follow-up History */}
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

      {/* Modals */}
      <FollowUpModal open={!!followUpModal} onClose={() => setFollowUpModal(null)} lead={followUpModal} />
      <ConvertLeadModal open={!!convertModal} onClose={() => setConvertModal(null)} lead={convertModal} />
      <BadLeadModal open={!!badModal} onClose={() => setBadModal(null)} lead={badModal} />
      <SampleKitModal open={!!sampleModal} onClose={() => setSampleModal(null)} lead={sampleModal} />
      <AddLeadToDBModal open={addLeadModal} onClose={() => setAddLeadModal(false)} database={database} />
    </>
  );
}