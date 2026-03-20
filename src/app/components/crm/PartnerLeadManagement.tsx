import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../layout/PageShell";
import { StatCard } from "../layout/StatCard";
import {
  StatusBadge, FilterBar, DataTable, Pagination, Button, Drawer,
  DetailField, Timeline, EmptyState, SummaryCard
} from "../shared";
import { FollowUpModal } from "./CRMModals";
import type { CRMLead } from "../../data/crm";
import { crmLeads, getLeadAgingDays } from "../../data/crm";
import {
  Users, Flame, ThermometerSun, Snowflake, CheckCircle2, XCircle,
  Phone, Mail, MessageSquare, MapPin, Calendar, ArrowRight, Download
} from "lucide-react";

import { handleExport } from "../shared/GlobalModals";

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

interface PartnerLeadManagementProps {
  role: "dealer" | "factory" | "architect";
  partnerName: string;
}

export function PartnerLeadManagement({ role, partnerName }: PartnerLeadManagementProps) {
  const navigate = useNavigate();

  // Simulate partner seeing leads assigned/transferred to them
  // In real app this would filter by logged-in user. Using leads from matching database + transferred organic leads.
  const myLeads = crmLeads.filter(l =>
    l.database === role ||
    (l.database === "organic" && l.transferredToPartner !== null)
  ).slice(0, 8); // Limit for demo

  const [search, setSearch] = useState("");
  const [qualityFilter, setQualityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [followUpModal, setFollowUpModal] = useState<CRMLead | null>(null);

  const filtered = myLeads.filter(l => {
    if (search && !l.businessName.toLowerCase().includes(search.toLowerCase()) && !l.contactPerson.toLowerCase().includes(search.toLowerCase())) return false;
    if (qualityFilter && l.quality !== qualityFilter) return false;
    return true;
  });

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const hot = myLeads.filter(l => l.quality === "hot").length;
  const warm = myLeads.filter(l => l.quality === "warm").length;
  const active = myLeads.filter(l => l.quality !== "bad" && l.quality !== "account").length;

  const roleTitles: Record<string, string> = {
    dealer: "My Leads",
    factory: "My Leads",
    architect: "My Leads",
  };

  return (
    <>
      <PageShell
        title={roleTitles[role]}
        subtitle={`Leads assigned or transferred to ${partnerName} · ${myLeads.length} total`}
        actions={
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Partner Leads")}>Export</Button>
        }
      >
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Leads" value={myLeads.length} icon={<Users size={18} />} accent="navy" />
          <StatCard label="Hot" value={hot} icon={<Flame size={18} />} accent="red" />
          <StatCard label="Warm" value={warm} icon={<ThermometerSun size={18} />} accent="gold" />
          <StatCard label="Active" value={active} icon={<CheckCircle2 size={18} />} accent="green" />
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FilterBar
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search leads..."
            filters={[
              { label: "Quality", value: qualityFilter, onChange: (v) => { setQualityFilter(v); setPage(1); }, options: [
                { label: "Hot", value: "hot" }, { label: "Warm", value: "warm" },
                { label: "Cold", value: "cold" }, { label: "Bad", value: "bad" },
              ]},
            ]}
          />
        </div>

        {/* Table */}
        <DataTable
          keyField="id"
          data={paged}
          onRowClick={setSelectedLead}
          emptyMessage="No leads assigned to you yet."
          columns={[
            { key: "id", label: "ID", width: "75px", render: (l) => <span className="text-muted-foreground" style={{ fontSize: 12 }}>{l.id}</span> },
            { key: "businessName", label: "Business / Contact", render: (l) => (
              <div>
                <p style={{ fontWeight: 500 }}>{l.businessName}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{l.contactPerson}</p>
              </div>
            )},
            { key: "city", label: "Location", render: (l) => (
              <div>
                <p>{l.city}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{l.state}</p>
              </div>
            )},
            { key: "quality", label: "Quality", render: (l) => (
              <div className="flex items-center gap-1.5">
                {qualityIcons[l.quality]}
                <StatusBadge status={l.quality} />
              </div>
            )},
            { key: "source", label: "Source", render: (l) => <span className="text-muted-foreground">{l.source}</span> },
            { key: "aging", label: "Aging", align: "right", render: (l) => {
              const days = getLeadAgingDays(l.createdAt);
              return <span className={days > 60 ? "text-red-600" : days > 30 ? "text-amber-600" : "text-muted-foreground"} style={{ fontSize: 13 }}>{days}d</span>;
            }},
            { key: "nextFollowUp", label: "Next F/U", render: (l) => (
              l.nextFollowUp ? (
                <span className={new Date(l.nextFollowUp) < new Date("2026-03-16") ? "text-red-600" : ""} style={{ fontSize: 13 }}>{l.nextFollowUp}</span>
              ) : <span className="text-muted-foreground" style={{ fontSize: 12 }}>—</span>
            )},
          ]}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </PageShell>

      {/* Lead Detail Drawer (Partner view) */}
      <Drawer open={!!selectedLead} onClose={() => setSelectedLead(null)} title="Lead Details">
        {selectedLead && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p style={{ fontSize: 18, fontWeight: 600 }}>{selectedLead.businessName}</p>
                <p className="text-muted-foreground mt-0.5" style={{ fontSize: 13 }}>{selectedLead.id} · {selectedLead.database}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {qualityIcons[selectedLead.quality]}
                <StatusBadge status={selectedLead.quality} size="md" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" icon={<Calendar size={14} />} onClick={() => { setSelectedLead(null); setFollowUpModal(selectedLead); }}>Log Follow-up</Button>
              <Button variant="outline" size="sm" icon={<Phone size={14} />}>
                <a href={`tel:${selectedLead.mobile}`}>Call</a>
              </Button>
            </div>

            <div className="space-y-4 pt-2 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Contact Person" value={selectedLead.contactPerson} />
                <DetailField label="Mobile" value={selectedLead.mobile} />
                <DetailField label="Email" value={selectedLead.email} />
                <DetailField label="Source" value={selectedLead.source} />
                <DetailField label="City" value={selectedLead.city} />
                <DetailField label="State" value={selectedLead.state} />
                <DetailField label="Created" value={selectedLead.createdAt} />
                <DetailField label="Aging" value={`${getLeadAgingDays(selectedLead.createdAt)} days`} />
              </div>

              {selectedLead.lostReason && (
                <DetailField label="Lost Reason" value={<span className="text-red-600">{selectedLead.lostReason}</span>} />
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
    </>
  );
}