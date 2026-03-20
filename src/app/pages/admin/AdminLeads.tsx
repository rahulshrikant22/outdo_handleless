import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, SortableDataTable, Button, Drawer,
  DetailField, SummaryCard, Timeline, RowActions, Tooltip, ActivityLog
} from "../../components/shared";
import { leads, getSalespersonById, getAccountById } from "../../data";
import { Plus, Download, Users, ArrowRight, CheckCircle2, Phone, Mail, Calendar } from "lucide-react";
import { handleExport, EditLeadModal } from "../../components/shared/GlobalModals";
import { toast } from "sonner";

const activityLog = [
  { id: "la1", user: "Rahul Sharma", action: "updated status to", target: "Qualified", time: "2 hours ago", type: "update" as const },
  { id: "la2", user: "Priya Patel", action: "added notes on", target: "L005 — Site visit scheduled", time: "5 hours ago", type: "update" as const },
  { id: "la3", user: "System", action: "auto-assigned lead L022 to", target: "Rahul Sharma", time: "Yesterday, 3:00 PM", type: "system" as const },
  { id: "la4", user: "Rahul Sharma", action: "converted lead to account:", target: "A001 — Mehta Interiors", time: "Mar 14, 2026", type: "create" as const },
  { id: "la5", user: "Priya Patel", action: "created new lead", target: "L022 — Kiran Malhotra", time: "Mar 13, 2026", type: "create" as const },
];

export function AdminLeads() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = leads.filter((l) => {
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.company.toLowerCase().includes(search.toLowerCase()) && !l.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && l.status !== statusFilter) return false;
    if (cityFilter && l.city !== cityFilter) return false;
    return true;
  });

  const cities = [...new Set(leads.map(l => l.city))];
  const statuses = [...new Set(leads.map(l => l.status))];

  const activeFiltersCount = [statusFilter, cityFilter].filter(Boolean).length;

  return (
    <PageShell
      title="Leads"
      subtitle={`${leads.length} total leads · ${leads.filter(l => l.status === "converted").length} converted · ${leads.filter(l => l.status === "new").length} new`}
      actions={
        <div className="flex items-center gap-2">
          <Tooltip text="Export leads as CSV">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Leads")}>Export</Button>
          </Tooltip>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => navigate("/admin/crm/leads")}>Add Lead</Button>
        </div>
      }
    >
      {/* Filters */}
      <div className="mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name, company, or ID..."
          filters={[
            {
              label: "All Statuses",
              value: statusFilter,
              onChange: setStatusFilter,
              options: statuses.map(s => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s })),
            },
            {
              label: "All Cities",
              value: cityFilter,
              onChange: setCityFilter,
              options: cities.map(c => ({ label: c, value: c })),
            },
          ]}
          actions={
            activeFiltersCount > 0 ? (
              <button
                onClick={() => { setStatusFilter(""); setCityFilter(""); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontSize: 12.5 }}
              >
                Clear {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}
              </button>
            ) : undefined
          }
        />
      </div>

      {/* Sortable Data Table */}
      <SortableDataTable
        data={filtered}
        keyField="id"
        pageSize={8}
        onRowClick={(lead) => setSelectedLead(lead)}
        rowActions={(lead) => (
          <RowActions
            onView={() => setSelectedLead(lead)}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        )}
        columns={[
          {
            key: "id", label: "ID", width: "80px", sortable: true,
            render: (l) => <span className="text-muted-foreground" style={{ fontSize: 12.5 }}>{l.id}</span>,
          },
          {
            key: "name", label: "Lead", sortable: true,
            render: (l) => (
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 500 }}>{l.name}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{l.company}</p>
              </div>
            ),
          },
          { key: "city", label: "City", sortable: true },
          {
            key: "salesperson", label: "Salesperson", sortable: true,
            sortValue: (l) => getSalespersonById(l.salespersonId)?.name || "",
            render: (l) => getSalespersonById(l.salespersonId)?.name || "—",
          },
          {
            key: "createdAt", label: "Created", sortable: true,
            tooltip: "Lead creation date",
          },
          {
            key: "status", label: "Status", sortable: true,
            render: (l) => <StatusBadge status={l.status} />,
          },
        ]}
      />

      {/* Lead Detail Drawer */}
      <Drawer
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title={selectedLead ? `Lead: ${selectedLead.name}` : ""}
      >
        {selectedLead && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-navy/8 flex items-center justify-center">
                <Users size={20} className="text-navy" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 16, fontWeight: 600 }}>{selectedLead.name}</p>
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>{selectedLead.company}</p>
              </div>
              <StatusBadge status={selectedLead.status} size="md" />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Tooltip text="Call lead">
                <button className="flex-1 h-10 rounded-lg border border-border flex items-center justify-center gap-2 hover:bg-accent transition-colors" style={{ fontSize: 13 }} onClick={() => toast.info("Initiating call...", { description: `Calling ${selectedLead.contact}` })}>
                  <Phone size={14} className="text-muted-foreground" /> Call
                </button>
              </Tooltip>
              <Tooltip text="Send email">
                <button className="flex-1 h-10 rounded-lg border border-border flex items-center justify-center gap-2 hover:bg-accent transition-colors" style={{ fontSize: 13 }} onClick={() => toast.info("Opening email...", { description: `Emailing ${selectedLead.email}` })}>
                  <Mail size={14} className="text-muted-foreground" /> Email
                </button>
              </Tooltip>
              <Tooltip text="Schedule follow-up">
                <button className="flex-1 h-10 rounded-lg border border-border flex items-center justify-center gap-2 hover:bg-accent transition-colors" style={{ fontSize: 13 }} onClick={() => toast.info("Opening follow-up scheduler...", { description: `Scheduling follow-up for ${selectedLead.company}` })}>
                  <Calendar size={14} className="text-muted-foreground" /> Follow-up
                </button>
              </Tooltip>
            </div>

            {/* Details */}
            <SummaryCard title="Contact Information">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Email" value={selectedLead.email} />
                <DetailField label="Phone" value={selectedLead.phone} />
                <DetailField label="City" value={selectedLead.city} />
                <DetailField label="Salesperson" value={getSalespersonById(selectedLead.salespersonId)?.name || "—"} />
                <DetailField label="Created" value={selectedLead.createdAt} />
              </div>
            </SummaryCard>

            <SummaryCard title="Notes">
              <p className="text-muted-foreground" style={{ fontSize: 13.5 }}>{selectedLead.notes}</p>
            </SummaryCard>

            {selectedLead.convertedAccountId && (
              <SummaryCard title="Conversion">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <div className="flex-1">
                    <p className="text-emerald-800" style={{ fontSize: 13.5, fontWeight: 500 }}>
                      Converted to Account
                    </p>
                    <p className="text-emerald-600" style={{ fontSize: 12 }}>
                      {getAccountById(selectedLead.convertedAccountId)?.company} ({selectedLead.convertedAccountId})
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-emerald-400" />
                </div>
              </SummaryCard>
            )}

            {/* Activity Log */}
            <SummaryCard title="Recent Activity">
              <ActivityLog entries={activityLog} maxItems={4} />
            </SummaryCard>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="primary" size="sm" className="flex-1" onClick={() => setEditLeadOpen(true)}>Edit Lead</Button>
              {selectedLead.status !== "converted" && (
                <Button variant="gold" size="sm" className="flex-1" onClick={() => { toast.success("Lead converted to Account", { description: `${selectedLead.company} is now an active account.` }); setSelectedLead(null); }}>Convert to Account</Button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      <EditLeadModal open={editLeadOpen} onClose={() => setEditLeadOpen(false)} lead={selectedLead} />
    </PageShell>
  );
}