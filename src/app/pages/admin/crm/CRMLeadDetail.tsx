import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import {
  StatusBadge, Button, DetailField, Timeline, SummaryCard, AlertCard, EmptyState
} from "../../../components/shared";
import { FollowUpModal, ConvertLeadModal, BadLeadModal, SampleKitModal } from "../../../components/crm/CRMModals";
import { EditLeadModal } from "../../../components/shared/GlobalModals";
import { toast } from "sonner";
import { getCRMLeadById, getCRMAccountById, getLeadAgingDays } from "../../../data/crm";
import {
  ArrowLeft, Calendar, Phone, Mail, MessageSquare, MapPin, CheckCircle2,
  XCircle, Package, Edit, Flame, ThermometerSun, Snowflake, Building2,
  Clock, User, Globe, Target, ExternalLink
} from "lucide-react";

const qualityIcons: Record<string, React.ReactNode> = {
  hot: <Flame size={16} className="text-red-500" />,
  warm: <ThermometerSun size={16} className="text-amber-500" />,
  cold: <Snowflake size={16} className="text-sky-500" />,
  bad: <XCircle size={16} className="text-gray-400" />,
  account: <CheckCircle2 size={16} className="text-emerald-500" />,
};

const followUpTypeIcons: Record<string, React.ReactNode> = {
  call: <Phone size={14} />, email: <Mail size={14} />, meeting: <MapPin size={14} />,
  whatsapp: <MessageSquare size={14} />, visit: <MapPin size={14} />,
};

export function CRMLeadDetail() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const lead = getCRMLeadById(leadId || "");

  const [followUpModal, setFollowUpModal] = useState(false);
  const [convertModal, setConvertModal] = useState(false);
  const [badModal, setBadModal] = useState(false);
  const [sampleModal, setSampleModal] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);

  if (!lead) {
    return (
      <PageShell title="Lead Not Found">
        <EmptyState
          icon={<XCircle size={32} />}
          title="Lead not found"
          message={`No lead found with ID "${leadId}". It may have been deleted or the URL is incorrect.`}
          action={<Button variant="primary" onClick={() => navigate("/admin/crm/leads")}>Back to Lead Master</Button>}
        />
      </PageShell>
    );
  }

  const aging = getLeadAgingDays(lead.createdAt);
  const linkedAccount = lead.convertedAccountId ? getCRMAccountById(lead.convertedAccountId) : null;
  const isOverdueFollowUp = lead.nextFollowUp && new Date(lead.nextFollowUp) < new Date("2026-03-16");

  return (
    <>
      <PageShell
        title=""
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" icon={<Edit size={14} />} onClick={() => setEditLeadOpen(true)}>Edit Lead</Button>
            <Button variant="outline" size="sm" icon={<Calendar size={14} />} onClick={() => setFollowUpModal(true)}>Log Follow-up</Button>
            {lead.quality !== "account" && lead.quality !== "bad" && (
              <Button variant="gold" size="sm" icon={<CheckCircle2 size={14} />} onClick={() => setConvertModal(true)}>Convert to Account</Button>
            )}
            {lead.quality !== "bad" && lead.quality !== "account" && (
              <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={() => setBadModal(true)}>Mark Bad</Button>
            )}
          </div>
        }
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 13 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
          <Link to="/admin/crm/leads" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 13 }}>Lead Master</Link>
          <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{lead.id}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-navy/8 flex items-center justify-center text-navy shrink-0">
              <Building2 size={24} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="truncate" style={{ fontSize: 20, fontWeight: 600 }}>{lead.businessName}</h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted">
                  {qualityIcons[lead.quality]}
                  <StatusBadge status={lead.quality} size="md" />
                </div>
              </div>
              <p className="text-muted-foreground mt-1 truncate" style={{ fontSize: 13 }}>
                {lead.id} · {lead.database.charAt(0).toUpperCase() + lead.database.slice(1)} Database · {lead.source}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-3 mb-6">
          {isOverdueFollowUp && (
            <AlertCard type="error" title="Overdue Follow-up" message={`Follow-up was due on ${lead.nextFollowUp}. Please take action immediately.`} />
          )}
          {lead.quality === "bad" && lead.lostReason && (
            <AlertCard type="warning" title="Lead Marked as Bad / Lost" message={`Reason: ${lead.lostReason} (${lead.lostDate})`} />
          )}
          {lead.quality === "account" && linkedAccount && (
            <AlertCard type="success" title="Lead Converted to Account" message={`Account: ${linkedAccount.businessName} (${linkedAccount.id}) — Converted on ${lead.conversionDate} by ${lead.convertedBy}`} />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <SummaryCard title="Contact Information">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <DetailField label="Contact Person" value={lead.contactPerson} />
                <DetailField label="Mobile" value={
                  <a href={`tel:${lead.mobile}`} className="text-navy hover:text-gold transition-colors flex items-center gap-1">
                    <Phone size={13} /> {lead.mobile}
                  </a>
                } />
                <DetailField label="Email" value={
                  <a href={`mailto:${lead.email}`} className="text-navy hover:text-gold transition-colors flex items-center gap-1">
                    <Mail size={13} /> {lead.email}
                  </a>
                } />
                <DetailField label="Business Name" value={lead.businessName} />
                <DetailField label="Database" value={<StatusBadge status={lead.database} />} />
              </div>
            </SummaryCard>

            {/* Territory Information */}
            <SummaryCard title="Territory & Location">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <DetailField label="City" value={lead.city} />
                <DetailField label="State" value={lead.state} />
                <DetailField label="Territory" value={lead.territory} />
              </div>
            </SummaryCard>

            {/* Notes */}
            <SummaryCard title="Notes">
              <p style={{ fontSize: 14, lineHeight: 1.6 }} className="text-foreground">{lead.notes}</p>
            </SummaryCard>

            {/* Follow-up History */}
            <SummaryCard
              title={`Follow-up History (${lead.followUpHistory.length})`}
              actions={
                <Button variant="outline" size="sm" icon={<Calendar size={14} />} onClick={() => setFollowUpModal(true)}>
                  Log New
                </Button>
              }
            >
              {lead.followUpHistory.length === 0 ? (
                <EmptyState
                  icon={<Calendar size={28} />}
                  title="No follow-ups recorded"
                  message="Start tracking interactions with this lead."
                  action={<Button variant="primary" size="sm" icon={<Calendar size={14} />} onClick={() => setFollowUpModal(true)}>Log First Follow-up</Button>}
                />
              ) : (
                <div className="space-y-4">
                  {lead.followUpHistory.slice().reverse().map((fu) => (
                    <div key={fu.id} className="flex gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="w-9 h-9 rounded-full bg-navy/8 flex items-center justify-center text-navy shrink-0 mt-0.5">
                        {followUpTypeIcons[fu.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p style={{ fontSize: 14, fontWeight: 500 }}>{fu.type.charAt(0).toUpperCase() + fu.type.slice(1)}</p>
                          <span className="text-muted-foreground" style={{ fontSize: 12 }}>{fu.date}</span>
                        </div>
                        <p className="text-muted-foreground mt-0.5" style={{ fontSize: 13 }}>{fu.notes}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700" style={{ fontSize: 12 }}>Outcome: {fu.outcome}</span>
                          <span className="text-muted-foreground" style={{ fontSize: 12 }}>Next: {fu.nextAction}</span>
                        </div>
                        <p className="text-muted-foreground mt-1" style={{ fontSize: 11.5 }}>By {fu.updatedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SummaryCard>
          </div>

          {/* Right Column — Summary Cards */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <SummaryCard title="Lead Metrics">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Lead Age</span>
                  <span className={`${aging > 60 ? "text-red-600" : aging > 30 ? "text-amber-600" : "text-foreground"}`} style={{ fontSize: 14, fontWeight: 600 }}>{aging} days</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Quality</span>
                  <div className="flex items-center gap-1.5">
                    {qualityIcons[lead.quality]}
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{lead.quality.charAt(0).toUpperCase() + lead.quality.slice(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Sample Status</span>
                  <StatusBadge status={lead.sampleStatus} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Follow-ups</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{lead.followUpHistory.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Created</span>
                  <span style={{ fontSize: 13 }}>{lead.createdAt}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Last Follow-up</span>
                  <span style={{ fontSize: 13 }}>{lead.lastFollowUp || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Next Follow-up</span>
                  <span className={isOverdueFollowUp ? "text-red-600" : ""} style={{ fontSize: 13, fontWeight: isOverdueFollowUp ? 600 : 400 }}>
                    {lead.nextFollowUp || "—"}
                  </span>
                </div>
              </div>
            </SummaryCard>

            {/* Assignment */}
            <SummaryCard title="Assignment">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white shrink-0">
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{lead.assignedUserName.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{lead.assignedUserName}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>{lead.assignedUserId} · {lead.territory}</p>
                </div>
              </div>
              {lead.transferredToPartner && (
                <div className="p-3 rounded-lg bg-gold/8 border border-gold/20">
                  <p className="text-gold-dark" style={{ fontSize: 12, fontWeight: 500 }}>Transferred to Partner</p>
                  <p className="text-foreground mt-0.5" style={{ fontSize: 13 }}>{lead.transferredToPartner}</p>
                </div>
              )}
            </SummaryCard>

            {/* Conversion Info */}
            {lead.quality === "account" && (
              <SummaryCard title="Conversion Details">
                <div className="space-y-3">
                  <DetailField label="Converted By" value={lead.convertedBy || "—"} />
                  <DetailField label="Conversion Date" value={lead.conversionDate || "—"} />
                  <DetailField label="Days to Convert" value={lead.daysToConvert ? `${lead.daysToConvert} days` : "—"} />
                  {linkedAccount && (
                    <Link to={`/admin/crm/accounts/${linkedAccount.id}`} className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                      <Building2 size={16} className="text-emerald-600" />
                      <div>
                        <p className="text-emerald-800" style={{ fontSize: 13, fontWeight: 500 }}>{linkedAccount.businessName}</p>
                        <p className="text-emerald-600" style={{ fontSize: 12 }}>{linkedAccount.id} · View Account</p>
                      </div>
                      <ExternalLink size={14} className="text-emerald-500 ml-auto" />
                    </Link>
                  )}
                </div>
              </SummaryCard>
            )}

            {/* Lost Info */}
            {lead.quality === "bad" && (
              <SummaryCard title="Lost / Rejected">
                <div className="space-y-3">
                  <DetailField label="Reason" value={<span className="text-red-600">{lead.lostReason}</span>} />
                  <DetailField label="Date" value={lead.lostDate || "—"} />
                </div>
              </SummaryCard>
            )}

            {/* Quick Actions */}
            <SummaryCard title="Quick Actions">
              <div className="space-y-2">
                {lead.database !== "organic" && (
                  <Button variant="outline" size="sm" className="w-full" icon={<Package size={14} />} onClick={() => setSampleModal(true)}>Update Sample Kit</Button>
                )}
                <Button variant="outline" size="sm" className="w-full" icon={<Phone size={14} />}>
                  <a href={`tel:${lead.mobile}`}>Call {lead.contactPerson}</a>
                </Button>
                <Button variant="outline" size="sm" className="w-full" icon={<Mail size={14} />}>
                  <a href={`mailto:${lead.email}`}>Send Email</a>
                </Button>
              </div>
            </SummaryCard>
          </div>
        </div>
      </PageShell>

      <FollowUpModal open={followUpModal} onClose={() => setFollowUpModal(false)} lead={lead} />
      <ConvertLeadModal open={convertModal} onClose={() => setConvertModal(false)} lead={lead} />
      <BadLeadModal open={badModal} onClose={() => setBadModal(false)} lead={lead} />
      <SampleKitModal open={sampleModal} onClose={() => setSampleModal(false)} lead={lead} />
      <EditLeadModal open={editLeadOpen} onClose={() => setEditLeadOpen(false)} lead={lead} />
    </>
  );
}