import { useState, type ReactNode } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import {
  StatusBadge, Button, DetailField, SummaryCard, TabBar, EmptyState, AlertCard
} from "../../../components/shared";
import { MilestoneTimeline } from "../../../components/operations/MilestoneTimeline";
import { DelayHoldBlock } from "../../../components/operations/DelayHoldBlock";
import { FinanceBlock } from "../../../components/operations/FinanceBlock";
import { ProductionDispatchBlock } from "../../../components/operations/ProductionDispatchBlock";
import { RoleAssignmentModal } from "../../../components/operations/RoleAssignmentModal";
import {
  getConvertedOrderById, productionStatusLabels, dispatchStatusLabels,
  priorityLabels, type RoleAssignment
} from "../../../data/operations";
import { financeRecords } from "../../../data/finance";
import {
  ArrowLeft, Building2, Package, UserPlus, Edit, Calendar, MapPin,
  Users, FileText, Clock, StickyNote, Paperclip, AlertTriangle,
  DollarSign, Factory, Truck, CheckCircle2, ClipboardList
} from "lucide-react";

import { toast } from "sonner";
import { handleDownloadPDF, RecordPaymentModal } from "../../../components/shared/GlobalModals";

export function ConvertedOrderDetail() {
  const { coId } = useParams();
  const navigate = useNavigate();
  const order = getConvertedOrderById(coId || "");
  const [activeTab, setActiveTab] = useState("overview");
  const [roleModal, setRoleModal] = useState(false);
  const [editRole, setEditRole] = useState<RoleAssignment | null>(null);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);

  if (!order) {
    return (
      <PageShell title="Order Not Found">
        <EmptyState
          icon={<Package size={32} />}
          title="Converted order not found"
          message={`No converted order found with ID "${coId}".`}
          action={
            <Button variant="primary" size="sm" onClick={() => navigate("/admin/operations/table")}>
              Back to Orders
            </Button>
          }
        />
      </PageShell>
    );
  }

  const activeDelays = order.delays.filter(d => d.isActive);
  const hasActiveDelays = activeDelays.length > 0;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "production", label: "Production & Dispatch" },
    { key: "finance", label: "Finance" },
    { key: "milestones", label: "Milestones" },
    { key: "delays", label: "Delays / Holds", count: activeDelays.length || undefined },
    { key: "activity", label: "Activity", count: order.activities.length },
  ];

  return (
    <PageShell
      title={order.projectName}
      subtitle={`${order.id} · ${order.accountName} · ${order.city}`}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate("/admin/operations/table")}>
            Back
          </Button>
          <Button variant="outline" size="sm" icon={<UserPlus size={14} />} onClick={() => { setEditRole(null); setRoleModal(true); }}>
            Assign Role
          </Button>
          <Link to={`/admin/tasks/projects?project=${order.id}`}>
            <Button variant="gold" size="sm" icon={<ClipboardList size={14} />} onClick={() => toast.success("Status updated", { description: `${order.id} production status advancing.` })}>
              Task Summary
            </Button>
          </Link>
          {financeRecords.find(fr => fr.convertedOrderId === order.id) && (
            <Link to={`/admin/finance/ledger/${financeRecords.find(fr => fr.convertedOrderId === order.id)!.id}`}>
              <Button variant="outline" size="sm" icon={<DollarSign size={14} />} onClick={() => setRecordPaymentOpen(true)}>
                Finance Ledger
              </Button>
            </Link>
          )}
          <Link to={`/admin/orders/${order.orderId}`}>
            <Button variant="outline" size="sm" icon={<FileText size={14} />} onClick={() => handleDownloadPDF(`Report for ${order.id}`)}>
              View Order
            </Button>
          </Link>
        </div>
      }
    >
      {/* Alert for active delays */}
      {hasActiveDelays && (
        <div className="mb-5">
          <AlertCard
            type="warning"
            title={`${activeDelays.length} active ${activeDelays.length === 1 ? "issue" : "issues"} on this order`}
            message={activeDelays.map(d => `${d.type === "delay" ? "Delay" : "Hold"}: ${d.description.substring(0, 80)}`).join(" | ")}
          />
        </div>
      )}

      {/* Header Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-card border border-border flex flex-col gap-1">
          <span className="text-muted-foreground" style={{ fontSize: 12 }}>Priority</span>
          <StatusBadge status={order.priority} size="md" />
        </div>
        <div className="p-4 rounded-xl bg-card border border-border flex flex-col gap-1">
          <span className="text-muted-foreground" style={{ fontSize: 12 }}>Production</span>
          <StatusBadge status={order.productionStatus} size="md" />
        </div>
        <div className="p-4 rounded-xl bg-card border border-border flex flex-col gap-1">
          <span className="text-muted-foreground" style={{ fontSize: 12 }}>Dispatch</span>
          <StatusBadge status={order.dispatchStatus} size="md" />
        </div>
        <div className="p-4 rounded-xl bg-card border border-border flex flex-col gap-1">
          <span className="text-muted-foreground" style={{ fontSize: 12 }}>Payment</span>
          <StatusBadge status={order.paymentStatus} size="md" />
        </div>
        <div className="p-4 rounded-xl bg-card border border-border flex flex-col gap-1">
          <span className="text-muted-foreground" style={{ fontSize: 12 }}>Pending With</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{order.currentPendingWith}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Information */}
            <SummaryCard title="Project Information">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Converted Order ID" value={order.id} />
                <DetailField label="Order ID" value={
                  <Link to={`/admin/orders/${order.orderId}`} className="text-navy hover:underline">{order.orderId}</Link>
                } />
                <DetailField label="Quotation ID" value={
                  <Link to={`/admin/orders/quotation/${order.quotationId}`} className="text-navy hover:underline">{order.quotationId}</Link>
                } />
                <DetailField label="Project Name" value={order.projectName} />
                <DetailField label="Site" value={order.siteName} />
                <DetailField label="Converted Date" value={order.convertedAt} />
                <DetailField label="Expected Completion" value={order.expectedCompletionDate} />
                <DetailField label="Actual Completion" value={order.actualCompletionDate || "In Progress"} />
              </div>
            </SummaryCard>

            {/* Account Information */}
            <SummaryCard title="Account Information">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Account Name" value={
                  <Link to={`/admin/crm/accounts/${order.accountId}`} className="text-navy hover:underline">{order.accountName}</Link>
                } />
                <DetailField label="Account Type" value={<StatusBadge status={order.accountType} size="sm" />} />
                <DetailField label="City" value={order.city} />
                <DetailField label="State" value={order.state} />
                <DetailField label="Zone" value={order.zone} />
                <DetailField label="Salesperson" value={order.salespersonName} />
              </div>
            </SummaryCard>
          </div>

          {/* Commercial Summary */}
          <SummaryCard title="Commercial Summary">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-navy/5 border border-navy/10">
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>Quotation Amount</p>
                <p className="text-navy mt-1" style={{ fontSize: 22, fontWeight: 700 }}>
                  ₹{order.quotationAmount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-emerald-700" style={{ fontSize: 12 }}>Received</p>
                <p className="text-emerald-800 mt-1" style={{ fontSize: 22, fontWeight: 700 }}>
                  ₹{order.receivedAmount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-700" style={{ fontSize: 12 }}>Balance</p>
                <p className="text-red-800 mt-1" style={{ fontSize: 22, fontWeight: 700 }}>
                  ₹{order.balanceAmount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
                <p className="text-gold-dark" style={{ fontSize: 12 }}>Collection Rate</p>
                <p className="text-gold-dark mt-1" style={{ fontSize: 22, fontWeight: 700 }}>
                  {order.quotationAmount > 0 ? Math.round((order.receivedAmount / order.quotationAmount) * 100) : 0}%
                </p>
              </div>
            </div>
          </SummaryCard>

          {/* Assigned Users */}
          <SummaryCard
            title="Assigned Users"
            actions={
              <Button variant="outline" size="sm" icon={<UserPlus size={13} />} onClick={() => { setEditRole(null); setRoleModal(true); }}>
                Assign / Reassign
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {order.roles.map(r => (
                <div
                  key={r.role}
                  className="p-3 rounded-lg border border-border bg-muted/20 hover:border-gold/30 transition-colors cursor-pointer"
                  onClick={() => { setEditRole(r); setRoleModal(true); }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: 11.5, fontWeight: 500 }}>{r.roleLabel}</span>
                    <Edit size={12} className="text-muted-foreground" />
                  </div>
                  <p className="mt-1" style={{ fontSize: 14, fontWeight: 600 }}>{r.userName}</p>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: 11.5 }}>
                    Since {r.assignedAt}
                  </p>
                </div>
              ))}
            </div>
          </SummaryCard>

          {/* Notes */}
          {order.notes && (
            <SummaryCard title="Notes">
              <p className="text-muted-foreground" style={{ fontSize: 14, lineHeight: 1.6 }}>{order.notes}</p>
            </SummaryCard>
          )}
        </div>
      )}

      {activeTab === "production" && (
        <SummaryCard title="Production & Dispatch Tracking">
          <ProductionDispatchBlock order={order} />
        </SummaryCard>
      )}

      {activeTab === "finance" && (
        <SummaryCard title="Finance & Payments">
          <FinanceBlock order={order} />
        </SummaryCard>
      )}

      {activeTab === "milestones" && (
        <SummaryCard title="Milestone Timeline">
          <MilestoneTimeline milestones={order.milestones} />
        </SummaryCard>
      )}

      {activeTab === "delays" && (
        <SummaryCard title="Delays & Holds">
          <DelayHoldBlock delays={order.delays} />
        </SummaryCard>
      )}

      {activeTab === "activity" && (
        <SummaryCard title="Activity Log">
          <div className="space-y-0">
            {order.activities.map((act, idx) => {
              const isLast = idx === order.activities.length - 1;
              const typeConfig: Record<string, { bg: string; color: string; icon: ReactNode }> = {
                milestone: { bg: "bg-emerald-100", color: "text-emerald-600", icon: <CheckCircle2 size={14} /> },
                assignment: { bg: "bg-blue-100", color: "text-blue-600", icon: <Users size={14} /> },
                payment: { bg: "bg-gold/20", color: "text-gold-dark", icon: <DollarSign size={14} /> },
                status_update: { bg: "bg-violet-100", color: "text-violet-600", icon: <Factory size={14} /> },
                note: { bg: "bg-gray-100", color: "text-gray-600", icon: <StickyNote size={14} /> },
                delay: { bg: "bg-red-100", color: "text-red-600", icon: <AlertTriangle size={14} /> },
                file: { bg: "bg-sky-100", color: "text-sky-600", icon: <Paperclip size={14} /> },
              };
              const cfg = typeConfig[act.type] || typeConfig.note;

              return (
                <div key={act.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.color}`}>
                      {cfg.icon}
                    </div>
                    {!isLast && <div className="w-0.5 flex-1 min-h-[20px] bg-border" />}
                  </div>
                  <div className="pb-4 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontSize: 13.5, fontWeight: 500 }}>{act.action}</span>
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontSize: 10.5 }}>
                        {act.type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-0.5" style={{ fontSize: 13 }}>{act.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>{act.date}</span>
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>·</span>
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>{act.user}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SummaryCard>
      )}

      {/* Role Assignment Modal */}
      <RoleAssignmentModal
        open={roleModal}
        onClose={() => { setRoleModal(false); setEditRole(null); }}
        order={order}
        editRole={editRole}
      />
      <RecordPaymentModal open={recordPaymentOpen} onClose={() => setRecordPaymentOpen(false)} context={order.projectName} />
    </PageShell>
  );
}