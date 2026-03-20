import { useState } from "react";
import { Link, useParams } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import {
  StatusBadge, SummaryCard, Button, DetailField, Modal,
  InputField, SelectField, DateField, Timeline, AlertCard, UploadBox,
} from "../../../components/shared";
import {
  getFinanceRecordById, inr, collectionHealthLabels, stageLabels,
  type FinanceRecord, type FinancePayment, type PaymentMilestone,
  type FinancePaymentStage,
} from "../../../data/finance";
import {
  ArrowLeft, DollarSign, CheckCircle2, AlertTriangle, Clock, Download,
  CreditCard, Receipt, FileText, Building2, MapPin, User, Calendar,
  ChevronRight, Plus, Eye, Upload, Wallet, TrendingUp, Shield, Edit,
  AlertCircle, Printer,
} from "lucide-react";

import { handleExport, handlePrint, handleDownloadPDF } from "../../../components/shared/GlobalModals";
import { toast } from "sonner";

const healthColor: Record<string, string> = {
  on_track: "text-emerald-600",
  at_risk: "text-amber-600",
  overdue: "text-red-600",
  critical: "text-red-800",
};

const healthBg: Record<string, string> = {
  on_track: "bg-emerald-50 border-emerald-200",
  at_risk: "bg-amber-50 border-amber-200",
  overdue: "bg-red-50 border-red-200",
  critical: "bg-red-100 border-red-300",
};

const milestoneStatusIcon: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 size={16} className="text-emerald-600" />,
  partial: <Clock size={16} className="text-amber-600" />,
  pending: <Clock size={16} className="text-gray-400" />,
  overdue: <AlertTriangle size={16} className="text-red-600" />,
};

const milestoneStatusBg: Record<string, string> = {
  completed: "bg-emerald-50 border-emerald-200",
  partial: "bg-amber-50 border-amber-200",
  pending: "bg-gray-50 border-gray-200",
  overdue: "bg-red-50 border-red-200",
};

export function FinanceLedger() {
  const { financeId } = useParams();
  const record = getFinanceRecordById(financeId || "");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<FinancePayment | null>(null);
  const [tab, setTab] = useState<"overview" | "milestones" | "receipts" | "timeline">("overview");

  if (!record) {
    return (
      <PageShell title="Finance Ledger" subtitle="Record not found">
        <AlertCard type="error" title="Record Not Found" message={`Finance record "${financeId}" does not exist.`} />
        <div className="mt-4">
          <Link to="/admin/finance/table">
            <Button variant="outline" size="sm" icon={<ArrowLeft size={14} />}>Back to Finance Table</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  const collectionPct = record.quotationAmount > 0
    ? Math.round((record.receivedAmount / record.quotationAmount) * 100)
    : 0;

  const completedMilestones = record.milestoneSchedule.filter(m => m.status === "completed").length;
  const totalMilestones = record.milestoneSchedule.length;

  // Build timeline from payments
  const timelineItems = [
    ...record.payments.map(p => ({
      id: p.id,
      title: `${stageLabels[p.stage]} Payment — ${inr(p.amount)}`,
      description: `${p.method.replace(/_/g, " ")} | Ref: ${p.reference} | By: ${p.receivedBy}`,
      time: p.date,
      icon: <CreditCard size={14} />,
      status: "completed" as const,
    })),
    {
      id: "next-milestone",
      title: `Next: ${record.nextMilestonePayment}`,
      description: `Expected amount: ${inr(record.nextMilestoneAmount)}`,
      time: record.dueDate,
      icon: <Clock size={14} />,
      status: "active" as const,
    },
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <PageShell
      title="Finance Ledger"
      subtitle={`${record.id} — ${record.projectName}`}
      actions={
        <div className="flex gap-2">
          <Link to="/admin/finance/table">
            <Button variant="outline" size="sm" icon={<ArrowLeft size={14} />}>Back</Button>
          </Link>
          <Button variant="outline" size="sm" icon={<Printer size={14} />} onClick={() => handlePrint(`Finance Ledger ${record.id}`)}>Print</Button>
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Finance Ledger")}>Export</Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setPaymentModalOpen(true)}>
            Record Payment
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Health Alert Banner */}
        {(record.collectionHealth === "overdue" || record.collectionHealth === "critical") && (
          <AlertCard
            type="error"
            title={`Collection ${collectionHealthLabels[record.collectionHealth]}`}
            message={`Balance of ${inr(record.balanceAmount)} is ${record.agingDays > 0 ? `${record.agingDays} days past due` : "due soon"}. Next payment: ${record.nextMilestonePayment} (${inr(record.nextMilestoneAmount)}).`}
          />
        )}
        {record.collectionHealth === "at_risk" && (
          <AlertCard
            type="warning"
            title="Collection At Risk"
            message={`Balance of ${inr(record.balanceAmount)} is aging. ${record.agingDays} days in current aging bucket. Proactive follow-up recommended.`}
          />
        )}

        {/* Header Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Project Info */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-navy/8 flex items-center justify-center">
                <FileText size={18} className="text-navy" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{record.projectName}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{record.id} | {record.convertedOrderId} | {record.orderId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <DetailField label="Account" value={record.accountName} />
              <DetailField label="Type" value={<StatusBadge status={record.accountType} size="xs" />} />
              <DetailField label="City" value={record.city} />
              <DetailField label="Zone" value={record.zone} />
              <DetailField label="Salesperson" value={record.salespersonName} />
              <DetailField label="Converted" value={record.convertedAt} />
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
                <DollarSign size={18} className="text-gold-dark" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600 }}>Financial Summary</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{collectionPct}% collected</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Order Value</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{inr(record.quotationAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Received</span>
                <span className="text-emerald-600" style={{ fontSize: 15, fontWeight: 700 }}>{inr(record.receivedAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Balance</span>
                <span className="text-red-600" style={{ fontSize: 15, fontWeight: 700 }}>{inr(record.balanceAmount)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mt-1">
                <div className="h-2.5 rounded-full bg-emerald-500 transition-all" style={{ width: `${collectionPct}%` }} />
              </div>
              <div className="pt-2 border-t border-border grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 11 }}>Advance Pending</p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{inr(record.advancePending)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 11 }}>Final Pending</p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{inr(record.finalPending)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Operations */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Shield size={18} className="text-blue-600" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600 }}>Status & Health</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>Operational status</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Collection Health</span>
                <span className={`${healthColor[record.collectionHealth]} px-2 py-0.5 rounded-full ${healthBg[record.collectionHealth]} border`} style={{ fontSize: 12, fontWeight: 600 }}>
                  {collectionHealthLabels[record.collectionHealth]}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Payment Status</span>
                <StatusBadge status={record.paymentStatus} size="xs" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Aging</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{record.agingDays} days ({record.agingBucket.replace(/_/g, "-")})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Production</span>
                <StatusBadge status={record.productionStatus} size="xs" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Dispatch</span>
                <StatusBadge status={record.dispatchStatus} size="xs" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Due Date</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{record.dueDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Milestones</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{completedMilestones}/{totalMilestones} completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-border">
          {(["overview", "milestones", "receipts", "timeline"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 border-b-2 transition-colors ${
                tab === t ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontSize: 13.5, fontWeight: tab === t ? 500 : 400 }}
            >
              {t === "overview" ? "Ledger Overview" :
               t === "milestones" ? `Payment Milestones (${totalMilestones})` :
               t === "receipts" ? `Receipt History (${record.payments.length})` :
               "Payment Timeline"}
            </button>
          ))}
        </div>

        {/* ======================== OVERVIEW TAB ======================== */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Next Milestone Card */}
            <SummaryCard title="Next Payment Milestone">
              <div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
                    <Wallet size={18} className="text-gold-dark" />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{record.nextMilestonePayment}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>Expected by {record.dueDate}</p>
                  </div>
                </div>
                <p className="text-navy" style={{ fontSize: 28, fontWeight: 700 }}>{inr(record.nextMilestoneAmount)}</p>
                <div className="mt-4">
                  <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setPaymentModalOpen(true)}>
                    Record This Payment
                  </Button>
                </div>
              </div>
              {record.lastPaymentDate && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-emerald-700" style={{ fontSize: 12 }}>Last Payment Received</p>
                  <p className="text-emerald-800" style={{ fontSize: 14, fontWeight: 600 }}>
                    {record.lastPaymentDate} — {inr(record.payments[record.payments.length - 1]?.amount || 0)}
                  </p>
                </div>
              )}
            </SummaryCard>

            {/* Quick Milestone Progress */}
            <SummaryCard title="Milestone Progress">
              <div className="space-y-3">
                {record.milestoneSchedule.map((ms, idx) => {
                  const pct = ms.expectedAmount > 0 ? Math.round((ms.receivedAmount / ms.expectedAmount) * 100) : 0;
                  return (
                    <div key={ms.id} className={`flex items-center gap-3 p-3 rounded-lg border ${milestoneStatusBg[ms.status]}`}>
                      <div className="shrink-0">{milestoneStatusIcon[ms.status]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p style={{ fontSize: 13, fontWeight: 500 }}>{ms.label}</p>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{inr(ms.expectedAmount)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-white/60 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-muted-foreground" style={{ fontSize: 11 }}>{pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SummaryCard>

            {/* Advance vs Final Breakdown */}
            <SummaryCard title="Payment Breakdown">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-blue-700" style={{ fontSize: 13, fontWeight: 500 }}>Advance Component</p>
                    <span className="text-blue-800" style={{ fontSize: 11 }}>{record.advancePercent}% of order</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-blue-600" style={{ fontSize: 11 }}>Expected</p>
                      <p className="text-blue-800" style={{ fontSize: 14, fontWeight: 600 }}>{inr(record.advanceExpected)}</p>
                    </div>
                    <div>
                      <p className="text-blue-600" style={{ fontSize: 11 }}>Received</p>
                      <p className="text-emerald-700" style={{ fontSize: 14, fontWeight: 600 }}>{inr(record.advanceReceived)}</p>
                    </div>
                    <div>
                      <p className="text-blue-600" style={{ fontSize: 11 }}>Pending</p>
                      <p className={record.advancePending > 0 ? "text-red-700" : "text-emerald-700"} style={{ fontSize: 14, fontWeight: 600 }}>
                        {inr(record.advancePending)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-purple-700" style={{ fontSize: 13, fontWeight: 500 }}>Final / Balance Component</p>
                    <span className="text-purple-800" style={{ fontSize: 11 }}>{100 - record.advancePercent}% of order</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-purple-600" style={{ fontSize: 11 }}>Expected</p>
                      <p className="text-purple-800" style={{ fontSize: 14, fontWeight: 600 }}>{inr(record.finalExpected)}</p>
                    </div>
                    <div>
                      <p className="text-purple-600" style={{ fontSize: 11 }}>Received</p>
                      <p className="text-emerald-700" style={{ fontSize: 14, fontWeight: 600 }}>{inr(record.finalReceived)}</p>
                    </div>
                    <div>
                      <p className="text-purple-600" style={{ fontSize: 11 }}>Pending</p>
                      <p className={record.finalPending > 0 ? "text-red-700" : "text-emerald-700"} style={{ fontSize: 14, fontWeight: 600 }}>
                        {inr(record.finalPending)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SummaryCard>

            {/* Cross-references */}
            <SummaryCard title="Linked Records">
              <div className="space-y-3">
                <Link to={`/admin/orders/${record.orderId}`} className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-gold/40 hover:bg-gold/4 transition-all">
                    <FileText size={16} className="text-navy" />
                    <div className="flex-1">
                      <p style={{ fontSize: 13, fontWeight: 500 }}>Order: {record.orderId}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{record.projectName}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </Link>
                <Link to={`/admin/orders/quotation/${record.quotationId}`} className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-gold/40 hover:bg-gold/4 transition-all">
                    <Receipt size={16} className="text-gold-dark" />
                    <div className="flex-1">
                      <p style={{ fontSize: 13, fontWeight: 500 }}>Quotation: {record.quotationId}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{inr(record.quotationAmount)}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </Link>
                <Link to={`/admin/operations/${record.convertedOrderId}`} className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-gold/40 hover:bg-gold/4 transition-all">
                    <Shield size={16} className="text-blue-600" />
                    <div className="flex-1">
                      <p style={{ fontSize: 13, fontWeight: 500 }}>Converted Order: {record.convertedOrderId}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>Production: {record.productionStatus.replace(/_/g, " ")}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </Link>
                <Link to={`/admin/crm/accounts/${record.accountId}`} className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-gold/40 hover:bg-gold/4 transition-all">
                    <Building2 size={16} className="text-emerald-600" />
                    <div className="flex-1">
                      <p style={{ fontSize: 13, fontWeight: 500 }}>Account: {record.accountName}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{record.accountType} | {record.city}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </Link>
              </div>
            </SummaryCard>
          </div>
        )}

        {/* ======================== MILESTONES TAB ======================== */}
        {tab === "milestones" && (
          <SummaryCard title="Payment Milestone Schedule">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>#</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Stage</th>
                    <th className="text-center px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>%</th>
                    <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Expected</th>
                    <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Received</th>
                    <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Pending</th>
                    <th className="text-center px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Status</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Due Date</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Paid Date</th>
                    <th className="text-center px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {record.milestoneSchedule.map((ms, idx) => {
                    const pending = ms.expectedAmount - ms.receivedAmount;
                    return (
                      <tr key={ms.id} className={`${milestoneStatusBg[ms.status].replace("border-", "hover:bg-").split(" ")[0]}/30 transition-colors`}>
                        <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 600 }}>{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {milestoneStatusIcon[ms.status]}
                            <span style={{ fontSize: 13.5, fontWeight: 500 }}>{ms.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center" style={{ fontSize: 13 }}>{ms.percentage}%</td>
                        <td className="px-4 py-3 text-right" style={{ fontSize: 13.5, fontWeight: 600 }}>{inr(ms.expectedAmount)}</td>
                        <td className="px-4 py-3 text-right text-emerald-600" style={{ fontSize: 13.5, fontWeight: 600 }}>{inr(ms.receivedAmount)}</td>
                        <td className="px-4 py-3 text-right" style={{ fontSize: 13.5, fontWeight: 600 }}>
                          <span className={pending > 0 ? "text-red-600" : "text-emerald-600"}>{inr(pending)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge status={ms.status} size="xs" />
                        </td>
                        <td className="px-4 py-3" style={{ fontSize: 13 }}>{ms.dueDate}</td>
                        <td className="px-4 py-3" style={{ fontSize: 13 }}>
                          {ms.paidDate || <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {ms.status !== "completed" && (
                            <Button variant="ghost" size="sm" icon={<Edit size={12} />} onClick={() => setPaymentModalOpen(true)}>
                              Update
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-navy/20 bg-navy/3">
                    <td colSpan={2} className="px-4 py-3" style={{ fontSize: 13, fontWeight: 600 }}>Total</td>
                    <td className="px-4 py-3 text-center" style={{ fontSize: 13, fontWeight: 600 }}>100%</td>
                    <td className="px-4 py-3 text-right" style={{ fontSize: 14, fontWeight: 700 }}>{inr(record.quotationAmount)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600" style={{ fontSize: 14, fontWeight: 700 }}>{inr(record.receivedAmount)}</td>
                    <td className="px-4 py-3 text-right text-red-600" style={{ fontSize: 14, fontWeight: 700 }}>{inr(record.balanceAmount)}</td>
                    <td colSpan={4} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </SummaryCard>
        )}

        {/* ======================== RECEIPTS TAB ======================== */}
        {tab === "receipts" && (
          <SummaryCard
            title="Receipt History"
            actions={
              <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setPaymentModalOpen(true)}>
                Record Payment
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Receipt ID</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Date</th>
                    <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Amount</th>
                    <th className="text-center px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Method</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Reference</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Stage</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Received By</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Notes</th>
                    <th className="text-center px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {record.payments.map(p => (
                    <tr key={p.id} className="hover:bg-gold/4 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-navy" style={{ fontSize: 13, fontWeight: 600 }}>{p.id}</span>
                      </td>
                      <td className="px-4 py-3" style={{ fontSize: 13 }}>{p.date}</td>
                      <td className="px-4 py-3 text-right text-emerald-600" style={{ fontSize: 14, fontWeight: 700 }}>{inr(p.amount)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-navy/8 text-navy" style={{ fontSize: 11.5, fontWeight: 500 }}>
                          {p.method.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground" style={{ fontSize: 12 }}>{p.reference}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.stage} size="xs" />
                      </td>
                      <td className="px-4 py-3" style={{ fontSize: 13 }}>{p.receivedBy}</td>
                      <td className="px-4 py-3">
                        <span className="text-muted-foreground" style={{ fontSize: 12 }}>{p.notes}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p.proofUploaded ? (
                          <button
                            onClick={() => { setSelectedPayment(p); setProofModalOpen(true); }}
                            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-800 transition-colors"
                            style={{ fontSize: 12 }}
                          >
                            <CheckCircle2 size={14} />
                            <span>{p.proofFileName || "View"}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => { setSelectedPayment(p); setProofModalOpen(true); }}
                            className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 transition-colors"
                            style={{ fontSize: 12 }}
                          >
                            <AlertTriangle size={14} />
                            <span>Upload</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {record.payments.length === 0 && (
              <div className="py-12 text-center text-muted-foreground" style={{ fontSize: 14 }}>
                No payments recorded yet
              </div>
            )}

            {/* Receipt Summary */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                  <p className="text-emerald-700" style={{ fontSize: 11 }}>Total Receipts</p>
                  <p className="text-emerald-800" style={{ fontSize: 18, fontWeight: 700 }}>{record.payments.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                  <p className="text-emerald-700" style={{ fontSize: 11 }}>Total Received</p>
                  <p className="text-emerald-800" style={{ fontSize: 18, fontWeight: 700 }}>{inr(record.receivedAmount)}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
                  <p className="text-blue-700" style={{ fontSize: 11 }}>Proof Uploaded</p>
                  <p className="text-blue-800" style={{ fontSize: 18, fontWeight: 700 }}>
                    {record.payments.filter(p => p.proofUploaded).length}/{record.payments.length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-center">
                  <p className="text-red-700" style={{ fontSize: 11 }}>Remaining Balance</p>
                  <p className="text-red-800" style={{ fontSize: 18, fontWeight: 700 }}>{inr(record.balanceAmount)}</p>
                </div>
              </div>
            </div>
          </SummaryCard>
        )}

        {/* ======================== TIMELINE TAB ======================== */}
        {tab === "timeline" && (
          <SummaryCard title="Payment Timeline">
            <Timeline items={timelineItems} />
          </SummaryCard>
        )}
      </div>

      {/* ======================== PAYMENT UPDATE MODAL ======================== */}
      <PaymentUpdateModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        record={record}
      />

      {/* ======================== PROOF MODAL ======================== */}
      <Modal open={proofModalOpen} onClose={() => { setProofModalOpen(false); setSelectedPayment(null); }} title="Payment Proof" size="md">
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Receipt ID" value={selectedPayment.id} />
              <DetailField label="Amount" value={inr(selectedPayment.amount)} />
              <DetailField label="Date" value={selectedPayment.date} />
              <DetailField label="Method" value={selectedPayment.method.replace(/_/g, " ").toUpperCase()} />
              <DetailField label="Reference" value={selectedPayment.reference} />
              <DetailField label="Stage" value={stageLabels[selectedPayment.stage]} />
            </div>
            <div className="border-t border-border pt-4">
              {selectedPayment.proofUploaded ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <p className="text-emerald-800" style={{ fontSize: 14, fontWeight: 500 }}>Proof Uploaded</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-emerald-200">
                    <FileText size={18} className="text-navy" />
                    <div className="flex-1">
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{selectedPayment.proofFileName}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>Uploaded with payment</p>
                    </div>
                    <Button variant="outline" size="sm" icon={<Eye size={12} />} onClick={() => toast.info("Opening preview...", { description: selectedPayment.proofFileName })}>Preview</Button>
                    <Button variant="outline" size="sm" icon={<Download size={12} />} onClick={() => handleDownloadPDF(selectedPayment.proofFileName || "Payment Proof")}>Download</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-amber-700 mb-3" style={{ fontSize: 13, fontWeight: 500 }}>
                    <AlertTriangle size={14} className="inline mr-1" />
                    No proof uploaded for this payment
                  </p>
                  <UploadBox label="Upload Payment Proof" hint="PDF, JPG, PNG — max 10MB" />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </PageShell>
  );
}

// ======================== PAYMENT UPDATE MODAL COMPONENT ========================
function PaymentUpdateModal({
  open, onClose, record
}: {
  open: boolean;
  onClose: () => void;
  record: FinanceRecord;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const [date, setDate] = useState("2026-03-17");
  const [reference, setReference] = useState("");
  const [stage, setStage] = useState("pre_dispatch");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setAmount("");
      setReference("");
      setNotes("");
    }, 1500);
  };

  return (
    <Modal open={open} onClose={onClose} title="Record Payment" size="lg">
      {submitted ? (
        <div className="py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <p style={{ fontSize: 18, fontWeight: 600 }}>Payment Recorded</p>
          <p className="text-muted-foreground mt-2" style={{ fontSize: 14 }}>
            Payment has been recorded for {record.projectName}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Context */}
          <div className="p-4 rounded-xl bg-navy/5 border border-navy/10">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{record.projectName}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>
                  {record.accountName} | {record.id} | Balance: {inr(record.balanceAmount)}
                </p>
              </div>
              <StatusBadge status={record.collectionHealth} size="xs" />
            </div>
          </div>

          {/* Next milestone info */}
          <div className="p-3 rounded-lg bg-gold/5 border border-gold/20">
            <p className="text-muted-foreground" style={{ fontSize: 12 }}>Next expected milestone</p>
            <p style={{ fontSize: 14, fontWeight: 500 }}>
              {record.nextMilestonePayment} — <span className="text-navy">{inr(record.nextMilestoneAmount)}</span>
            </p>
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Amount (₹)"
              placeholder={record.nextMilestoneAmount.toString()}
              value={amount}
              onChange={setAmount}
              type="number"
            />
            <SelectField
              label="Payment Method"
              value={method}
              onChange={setMethod}
              options={[
                { label: "Bank Transfer (NEFT/RTGS)", value: "bank_transfer" },
                { label: "Cheque", value: "cheque" },
                { label: "UPI", value: "upi" },
                { label: "Cash", value: "cash" },
              ]}
            />
            <DateField label="Payment Date" value={date} onChange={setDate} />
            <SelectField
              label="Payment Stage"
              value={stage}
              onChange={setStage}
              options={[
                { label: "Advance", value: "advance" },
                { label: "Progress", value: "progress" },
                { label: "Pre-Dispatch", value: "pre_dispatch" },
                { label: "On Delivery", value: "on_delivery" },
                { label: "Final", value: "final" },
                { label: "Retention", value: "retention" },
              ]}
            />
            <div className="col-span-2">
              <InputField
                label="Reference Number"
                placeholder="NEFT/2026/0317/001"
                value={reference}
                onChange={setReference}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
              <textarea
                placeholder="Payment notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
                style={{ fontSize: 14 }}
              />
            </div>
            <div className="col-span-2">
              <UploadBox label="Upload Payment Proof" hint="PDF, JPG, PNG — max 10MB (optional)" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-muted-foreground" style={{ fontSize: 12 }}>
              Recording as: <span className="text-foreground" style={{ fontWeight: 500 }}>Finance Manager</span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="md" onClick={onClose}>Cancel</Button>
              <Button variant="primary" size="md" icon={<CheckCircle2 size={14} />} onClick={handleSubmit}>
                Record Payment
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}