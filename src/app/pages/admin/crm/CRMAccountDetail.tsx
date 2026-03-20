import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import {
  StatusBadge, Button, DetailField, SummaryCard, AlertCard, EmptyState, TabBar
} from "../../../components/shared";
import {
  getCRMAccountById, getCRMLeadById, crmLeads, formatClassification,
  formatCurrency
} from "../../../data/crm";
import { projectOrders } from "../../../data/orders";
import { getConvertedOrderByOrderId } from "../../../data/operations";
import { financeRecords } from "../../../data/finance";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import {
  ArrowLeft, Building2, Edit, Phone, Mail, MapPin, CheckCircle2,
  ShoppingCart, CreditCard, TrendingUp, Package, Star, XCircle,
  ExternalLink, Calendar, Globe, Shield
} from "lucide-react";

import { EditAccountModal } from "../../../components/shared/GlobalModals";
import { toast } from "sonner";

const healthColors: Record<string, { text: string; bg: string; border: string }> = {
  excellent: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  good: { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  average: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  at_risk: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  churned: { text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
};

// Mock performance data for charts
const monthlyPerformance = [
  { month: "Oct", orders: 0, value: 0 },
  { month: "Nov", orders: 0, value: 0 },
  { month: "Dec", orders: 1, value: 85000 },
  { month: "Jan", orders: 1, value: 120000 },
  { month: "Feb", orders: 1, value: 95000 },
  { month: "Mar", orders: 1, value: 150000 },
];

export function CRMAccountDetail() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const account = getCRMAccountById(accountId || "");
  const [activeTab, setActiveTab] = useState("overview");
  const [editAccountOpen, setEditAccountOpen] = useState(false);

  if (!account) {
    return (
      <PageShell title="Account Not Found">
        <EmptyState
          icon={<XCircle size={32} />}
          title="Account not found"
          message={`No account found with ID "${accountId}".`}
          action={<Button variant="primary" onClick={() => navigate("/admin/crm/accounts")}>Back to Accounts</Button>}
        />
      </PageShell>
    );
  }

  const linkedLead = getCRMLeadById(account.fromLeadId);
  const hc = healthColors[account.health] || healthColors.good;

  return (
    <PageShell
      title=""
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" icon={<Edit size={14} />} onClick={() => setEditAccountOpen(true)}>Edit Account</Button>
          <Button variant="outline" size="sm" icon={<Phone size={14} />} onClick={() => toast.info("Calling...", { description: `Dialing ${account.contactPerson} at ${account.mobile}` })}>Call</Button>
          <Button variant="primary" size="sm" icon={<ShoppingCart size={14} />} onClick={() => navigate(`/admin/orders/dashboard`)}>New Order</Button>
        </div>
      }
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
        <Link to="/admin/crm/accounts" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 13 }}>Accounts</Link>
        <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{account.id}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4 mb-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-navy/8 flex items-center justify-center text-navy shrink-0">
          <Building2 size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="truncate" style={{ fontSize: 20, fontWeight: 600 }}>{account.businessName}</h1>
            <StatusBadge status={account.accountType} size="md" />
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${hc.bg} ${hc.border} ${hc.text}`} style={{ fontSize: 12, fontWeight: 500 }}>
              <span className={`w-1.5 h-1.5 rounded-full ${hc.text.replace("text-", "bg-")}`} />
              {account.health.replace(/_/g, " ")}
            </span>
            <StatusBadge status={account.isActive ? "active" : "inactive"} />
          </div>
          <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>
            {account.id} · {formatClassification(account.classification)} · {account.city}, {account.state}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {account.health === "at_risk" && (
        <AlertCard type="warning" title="Account at Risk" message="This account shows declining activity. Consider re-engagement strategies." />
      )}
      {!account.isActive && (
        <div className="mt-3">
          <AlertCard type="error" title="Inactive Account" message="This account is currently inactive and may need intervention." />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 mb-6">
        <StatCard label="Total Value" value={formatCurrency(account.totalOrderValue)} icon={<TrendingUp size={18} />} accent="gold" />
        <StatCard label="Orders" value={account.totalOrders} icon={<ShoppingCart size={18} />} accent="navy" />
        <StatCard label="Outstanding" value={formatCurrency(account.outstandingAmount)} icon={<CreditCard size={18} />} accent={account.outstandingAmount > 0 ? "red" : "green"} />
        <StatCard label="Sample Kits" value={account.sampleKitsProvided} icon={<Package size={18} />} accent="blue" />
        <StatCard label="Days to Convert" value={account.daysToConvert} icon={<Calendar size={18} />} accent="purple" />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <TabBar
          tabs={[
            { key: "overview", label: "Overview" },
            { key: "performance", label: "Performance" },
            { key: "orders", label: "Orders" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <SummaryCard title="Contact Information">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <DetailField label="Contact Person" value={account.contactPerson} />
                <DetailField label="Mobile" value={
                  <a href={`tel:${account.mobile}`} className="text-navy hover:text-gold transition-colors flex items-center gap-1">
                    <Phone size={13} /> {account.mobile}
                  </a>
                } />
                <DetailField label="Email" value={
                  <a href={`mailto:${account.email}`} className="text-navy hover:text-gold transition-colors flex items-center gap-1">
                    <Mail size={13} /> {account.email}
                  </a>
                } />
                <DetailField label="GST Number" value={account.gstNumber} />
                <DetailField label="Address" value={account.address} />
              </div>
            </SummaryCard>

            {/* Territory */}
            <SummaryCard title="Territory & Location">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <DetailField label="City" value={account.city} />
                <DetailField label="State" value={account.state} />
                <DetailField label="Territory" value={account.territory} />
                <DetailField label="Zone" value={account.zone} />
              </div>
            </SummaryCard>

            {/* Account Details */}
            <SummaryCard title="Account Classification">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <DetailField label="Account Type" value={<StatusBadge status={account.accountType} />} />
                <DetailField label="Classification" value={formatClassification(account.classification)} />
                <DetailField label="Display Installed" value={
                  account.displayInstalled
                    ? <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={14} /> Yes</span>
                    : <span className="text-muted-foreground">No</span>
                } />
                <DetailField label="Sample Kits Provided" value={account.sampleKitsProvided} />
                <DetailField label="Locator Visible" value={account.showOnLocator ? "Yes" : "No"} />
                <DetailField label="Locator Priority" value={account.locatorPriority || "—"} />
              </div>
            </SummaryCard>

            {/* Notes */}
            <SummaryCard title="Notes">
              <p style={{ fontSize: 14, lineHeight: 1.6 }}>{account.notes}</p>
            </SummaryCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Conversion */}
            <SummaryCard title="Conversion Info">
              <div className="space-y-3">
                <DetailField label="Converted By" value={account.convertedBy} />
                <DetailField label="Conversion Date" value={account.conversionDate} />
                <DetailField label="Days to Convert" value={`${account.daysToConvert} days`} />
                {linkedLead && (
                  <Link to={`/admin/crm/leads/${linkedLead.id}`} className="flex items-center gap-2 p-3 rounded-lg bg-navy/5 border border-navy/10 hover:bg-navy/8 transition-colors">
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500 }} className="text-muted-foreground">Original Lead</p>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{linkedLead.businessName} ({linkedLead.id})</p>
                    </div>
                    <ExternalLink size={14} className="text-muted-foreground ml-auto" />
                  </Link>
                )}
              </div>
            </SummaryCard>

            {/* Account Manager */}
            <SummaryCard title="Account Manager">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white shrink-0">
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{account.assignedUserName.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{account.assignedUserName}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>{account.assignedUserId} · {account.territory}</p>
                </div>
              </div>
            </SummaryCard>

            {/* Financial Summary */}
            <SummaryCard title="Financial Summary">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Total Value</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{formatCurrency(account.totalOrderValue)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Outstanding</span>
                  <span className={account.outstandingAmount > 0 ? "text-red-600" : "text-emerald-600"} style={{ fontSize: 14, fontWeight: 600 }}>{formatCurrency(account.outstandingAmount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Avg Order Value</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{account.totalOrders > 0 ? formatCurrency(Math.round(account.totalOrderValue / account.totalOrders)) : "—"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Last Order</span>
                  <span style={{ fontSize: 13 }}>{account.lastOrderDate || "—"}</span>
                </div>
              </div>
            </SummaryCard>
          </div>
        </div>
      )}

      {activeTab === "performance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SummaryCard title="Monthly Order Value">
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={monthlyPerformance}>
                    <XAxis dataKey="month" style={{ fontSize: 12 }} />
                    <YAxis style={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ fontSize: 13, borderRadius: 10 }} formatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Bar dataKey="value" fill="#1B2A4A" radius={[4, 4, 0, 0]} name="Order Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SummaryCard>
            <SummaryCard title="Order Trend">
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <LineChart data={monthlyPerformance}>
                    <XAxis dataKey="month" style={{ fontSize: 12 }} />
                    <YAxis style={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ fontSize: 13, borderRadius: 10 }} />
                    <Line type="monotone" dataKey="orders" stroke="#EC6E63" strokeWidth={2} name="Orders" dot={{ fill: "#EC6E63" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SummaryCard>
          </div>

          {/* Performance KPIs */}
          <SummaryCard title="Performance KPIs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-xl bg-navy/5">
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>Collection Rate</p>
                <p className="text-navy mt-1" style={{ fontSize: 24, fontWeight: 700 }}>
                  {account.totalOrderValue > 0 ? Math.round(((account.totalOrderValue - account.outstandingAmount) / account.totalOrderValue) * 100) : 0}%
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gold/8">
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>Avg Order Size</p>
                <p className="text-gold-dark mt-1" style={{ fontSize: 24, fontWeight: 700 }}>
                  {account.totalOrders > 0 ? formatCurrency(Math.round(account.totalOrderValue / account.totalOrders)) : "—"}
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-emerald-50">
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>Order Frequency</p>
                <p className="text-emerald-700 mt-1" style={{ fontSize: 24, fontWeight: 700 }}>
                  {account.totalOrders}/Q
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-blue-50">
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>Account Age</p>
                <p className="text-blue-700 mt-1" style={{ fontSize: 24, fontWeight: 700 }}>
                  {Math.round((new Date("2026-03-16").getTime() - new Date(account.conversionDate).getTime()) / (1000 * 60 * 60 * 24))}d
                </p>
              </div>
            </div>
          </SummaryCard>
        </div>
      )}

      {activeTab === "orders" && (
        <SummaryCard title="Order History">
          {(() => {
            const accountOrders = projectOrders.filter(o => o.accountId === account.id);
            if (accountOrders.length === 0) {
              return (
                <EmptyState
                  icon={<ShoppingCart size={28} />}
                  title="No orders yet"
                  message="This account has no orders in the system."
                  action={<Button variant="primary" size="sm" onClick={() => navigate("/admin/orders/dashboard")}>Create Order</Button>}
                />
              );
            }
            return (
              <div className="space-y-3">
                {accountOrders.map(o => {
                  const co = getConvertedOrderByOrderId(o.id);
                  const fr = financeRecords.find(f => f.orderId === o.id);
                  return (
                    <Link key={o.id} to={`/admin/orders/${o.id}`} className="block">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-gold/30 hover:bg-gold/4 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-navy/8 flex items-center justify-center">
                            <ShoppingCart size={16} className="text-navy" />
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>{o.projectName}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 12 }}>
                              {o.id} · {o.quotationId || "No quotation"} · {o.createdAt}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusBadge status={o.quotationStatus} size="xs" />
                              <StatusBadge status={o.orderStatus} size="xs" />
                              {co && <StatusBadge status={co.productionStatus} size="xs" />}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p style={{ fontSize: 16, fontWeight: 700 }}>{formatCurrency(o.totalQuotationValue)}</p>
                          {fr && (
                            <p className="text-emerald-600 mt-0.5" style={{ fontSize: 12 }}>
                              {formatCurrency(fr.receivedAmount)} received
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })()}
        </SummaryCard>
      )}
      <EditAccountModal open={editAccountOpen} onClose={() => setEditAccountOpen(false)} account={account} />
    </PageShell>
  );
}