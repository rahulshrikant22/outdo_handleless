import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import { StatusBadge, SummaryCard, TabBar, Button } from "../../../components/shared";
import {
  getFinanceKPIs, getPaymentAging, getOutstandingRanking, getTopBillingAccounts,
  getCollectionMonitoring, getMonthlyCollectionTrend, financeRecords,
  inr, collectionHealthLabels, stageLabels,
} from "../../../data/finance";
import {
  DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Clock, ArrowRight,
  CreditCard, Wallet, Receipt, BarChart3, Target, Users, Shield,
  AlertCircle, Building2, ChevronRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = {
  navy: "#1B2A4A",
  gold: "#EC6E63",
  green: "#10B981",
  blue: "#3B82F6",
  red: "#EF4444",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  gray: "#94A3B8",
};

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

export function FinanceDashboard() {
  const kpi = getFinanceKPIs();
  const aging = getPaymentAging();
  const outstanding = getOutstandingRanking();
  const topBilling = getTopBillingAccounts();
  const health = getCollectionMonitoring();
  const trend = getMonthlyCollectionTrend();
  const [tab, setTab] = useState("overview");

  const agingChartData = aging.filter(b => b.amount > 0);

  const collectionPieData = [
    { name: "Received", value: kpi.totalReceivedAmount, fill: COLORS.green },
    { name: "Balance", value: kpi.totalBalanceAmount, fill: COLORS.red },
  ];

  const healthPieData = [
    { name: "On Track", value: health.on_track, fill: COLORS.green },
    { name: "At Risk", value: health.at_risk, fill: COLORS.amber },
    { name: "Overdue", value: health.overdue, fill: COLORS.red },
    { name: "Critical", value: health.critical, fill: COLORS.purple },
  ].filter(d => d.value > 0);

  const agingBarData = agingChartData.map((entry, idx) => ({
    ...entry,
    name: entry.label,
    fill: entry.key === "current" ? COLORS.green :
          entry.key === "1_30" ? COLORS.blue :
          entry.key === "31_60" ? COLORS.amber :
          entry.key === "61_90" ? COLORS.red :
          COLORS.purple,
  }));

  return (
    <PageShell
      title="Finance Dashboard"
      subtitle="Payment collection, receivables & financial health monitoring"
      actions={
        <Link to="/admin/finance/table">
          <Button variant="primary" size="sm" icon={<ArrowRight size={14} />}>
            Finance Orders
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* KPI Cards - 8 metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Quotation Amount"
            value={inr(kpi.totalQuotationAmount)}
            icon={<FileIcon />}
            accent="navy"
          />
          <StatCard
            label="Total Converted Order Amount"
            value={inr(kpi.totalConvertedOrderAmount)}
            icon={<DollarSign size={18} />}
            accent="gold"
          />
          <StatCard
            label="Total Received Amount"
            value={inr(kpi.totalReceivedAmount)}
            icon={<CheckCircle2 size={18} />}
            accent="green"
            trend={`${kpi.collectionRate}% collected`}
            trendDirection="up"
          />
          <StatCard
            label="Total Balance Amount"
            value={inr(kpi.totalBalanceAmount)}
            icon={<Wallet size={18} />}
            accent="red"
            trend={`${100 - kpi.collectionRate}% pending`}
            trendDirection="down"
          />
          <StatCard
            label="Pending Accounts"
            value={kpi.pendingAccounts}
            icon={<Building2 size={18} />}
            accent="blue"
            trend={`of ${financeRecords.length} total`}
          />
          <StatCard
            label="Overdue Receivables"
            value={inr(kpi.overdueReceivables)}
            icon={<AlertTriangle size={18} />}
            accent="red"
          />
          <StatCard
            label="Advance Pending"
            value={inr(kpi.advancePending)}
            icon={<Clock size={18} />}
            accent="blue"
            trend="All advances collected"
            trendDirection="up"
          />
          <StatCard
            label="Final Payment Pending"
            value={inr(kpi.finalPending)}
            icon={<CreditCard size={18} />}
            accent="purple"
          />
        </div>

        {/* Tabs */}
        <TabBar
          tabs={[
            { key: "overview", label: "Collection Overview" },
            { key: "aging", label: "Payment Aging" },
            { key: "outstanding", label: "Outstanding Ranking" },
            { key: "billing", label: "Top Billing" },
            { key: "monitoring", label: "Collection Monitoring" },
            { key: "milestones", label: "Payment Milestones" },
          ]}
          active={tab}
          onChange={setTab}
        />

        {/* Tab Content */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Collection vs Balance Pie */}
            <SummaryCard title="Collection Status">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={collectionPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {collectionPieData.map((entry, idx) => (
                        <Cell key={`coll-${idx}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => inr(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="text-center p-3 rounded-lg bg-emerald-50">
                  <p className="text-emerald-700" style={{ fontSize: 12 }}>Collected</p>
                  <p className="text-emerald-800" style={{ fontSize: 18, fontWeight: 700 }}>{inr(kpi.totalReceivedAmount)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50">
                  <p className="text-red-700" style={{ fontSize: 12 }}>Pending</p>
                  <p className="text-red-800" style={{ fontSize: 18, fontWeight: 700 }}>{inr(kpi.totalBalanceAmount)}</p>
                </div>
              </div>
            </SummaryCard>

            {/* Monthly Collection Trend */}
            <SummaryCard title="Monthly Collection Trend">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => inr(v)} />
                    <Legend />
                    <Bar dataKey="expected" name="Expected" fill={COLORS.navy} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="received" name="Received" fill={COLORS.green} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SummaryCard>

            {/* Quick Finance Table */}
            <div className="lg:col-span-2">
              <SummaryCard
                title="Finance Orders Summary"
                actions={
                  <Link to="/admin/finance/table">
                    <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />}>View All</Button>
                  </Link>
                }
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-3 py-2 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Project</th>
                        <th className="text-left px-3 py-2 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Account</th>
                        <th className="text-right px-3 py-2 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Order Value</th>
                        <th className="text-right px-3 py-2 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Received</th>
                        <th className="text-right px-3 py-2 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Balance</th>
                        <th className="text-center px-3 py-2 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Health</th>
                        <th className="text-center px-3 py-2 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {financeRecords.map(r => (
                        <tr key={r.id} className="hover:bg-gold/4 transition-colors">
                          <td className="px-3 py-3">
                            <p className="text-foreground" style={{ fontSize: 13.5, fontWeight: 500 }}>{r.projectName}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 12 }}>{r.id} | {r.convertedOrderId}</p>
                          </td>
                          <td className="px-3 py-3">
                            <p style={{ fontSize: 13 }}>{r.accountName}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{r.city}</p>
                          </td>
                          <td className="px-3 py-3 text-right" style={{ fontSize: 13.5, fontWeight: 600 }}>{inr(r.quotationAmount)}</td>
                          <td className="px-3 py-3 text-right text-emerald-600" style={{ fontSize: 13.5, fontWeight: 600 }}>{inr(r.receivedAmount)}</td>
                          <td className="px-3 py-3 text-right text-red-600" style={{ fontSize: 13.5, fontWeight: 600 }}>{inr(r.balanceAmount)}</td>
                          <td className="px-3 py-3 text-center">
                            <StatusBadge status={r.collectionHealth} size="xs" />
                          </td>
                          <td className="px-3 py-3 text-center">
                            <Link to={`/admin/finance/ledger/${r.id}`}>
                              <button className="text-navy hover:text-gold transition-colors">
                                <ChevronRight size={16} />
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SummaryCard>
            </div>
          </div>
        )}

        {tab === "aging" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SummaryCard title="Payment Aging Analysis">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={agingBarData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
                    <Tooltip formatter={(v: number) => inr(v)} />
                    <Bar dataKey="amount" name="Outstanding" radius={[0, 4, 4, 0]}>
                      {agingBarData.map((entry, idx) => (
                        <Cell
                          key={`aging-${entry.key}`}
                          fill={entry.fill}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SummaryCard>

            <SummaryCard title="Aging Breakdown">
              <div className="space-y-3">
                {aging.map(bucket => (
                  <div key={bucket.key} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        bucket.key === "current" ? "bg-emerald-500" :
                        bucket.key === "1_30" ? "bg-blue-500" :
                        bucket.key === "31_60" ? "bg-amber-500" :
                        bucket.key === "61_90" ? "bg-red-500" :
                        "bg-purple-500"
                      }`} />
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 500 }}>{bucket.label}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>{bucket.count} account{bucket.count !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{inr(bucket.amount)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-navy/5 border border-navy/10">
                <div className="flex justify-between">
                  <p style={{ fontSize: 13, fontWeight: 500 }}>Total Outstanding</p>
                  <p style={{ fontSize: 15, fontWeight: 700 }}>{inr(kpi.totalBalanceAmount)}</p>
                </div>
              </div>
            </SummaryCard>
          </div>
        )}

        {tab === "outstanding" && (
          <SummaryCard title="Outstanding Ranking — Highest Balance First">
            <div className="space-y-3">
              {outstanding.map((r, idx) => {
                const percent = r.quotationAmount > 0 ? Math.round((r.receivedAmount / r.quotationAmount) * 100) : 0;
                return (
                  <Link key={r.id} to={`/admin/finance/ledger/${r.id}`} className="block">
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-gold/40 hover:bg-gold/4 transition-all cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-navy/8 flex items-center justify-center shrink-0" style={{ fontSize: 14, fontWeight: 700 }}>
                        #{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p style={{ fontSize: 14, fontWeight: 600 }}>{r.projectName}</p>
                          <StatusBadge status={r.collectionHealth} size="xs" />
                        </div>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>{r.accountName} | {r.city}</p>
                        <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="text-muted-foreground mt-1" style={{ fontSize: 11.5 }}>{percent}% collected</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-red-600" style={{ fontSize: 18, fontWeight: 700 }}>{inr(r.balanceAmount)}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>of {inr(r.quotationAmount)}</p>
                      </div>
                      <ChevronRight size={18} className="text-muted-foreground shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </SummaryCard>
        )}

        {tab === "billing" && (
          <SummaryCard title="Top Billing Accounts — Highest Order Value">
            <div className="space-y-3">
              {topBilling.map((r, idx) => {
                const percent = r.quotationAmount > 0 ? Math.round((r.receivedAmount / r.quotationAmount) * 100) : 0;
                return (
                  <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-accent/30 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      idx === 0 ? "bg-gold/15 text-gold-dark" :
                      idx === 1 ? "bg-gray-100 text-gray-600" :
                      "bg-amber-50 text-amber-700"
                    }`}>
                      <Target size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{r.accountName}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{r.projectName} | {r.city} | {r.accountType}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-navy" style={{ fontSize: 18, fontWeight: 700 }}>{inr(r.quotationAmount)}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>
                        <span className="text-emerald-600">{inr(r.receivedAmount)}</span> received ({percent}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SummaryCard>
        )}

        {tab === "monitoring" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SummaryCard title="Collection Health Distribution">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={healthPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {healthPieData.map((entry, idx) => (
                        <Cell key={`health-${idx}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SummaryCard>

            <SummaryCard title="Account-wise Collection Status">
              <div className="space-y-3">
                {financeRecords.map(r => (
                  <Link key={r.id} to={`/admin/finance/ledger/${r.id}`} className="block">
                    <div className={`p-4 rounded-xl border ${healthBg[r.collectionHealth]} hover:shadow-sm transition-all cursor-pointer`}>
                      <div className="flex items-center justify-between mb-2">
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{r.accountName}</p>
                        <span className={`${healthColor[r.collectionHealth]}`} style={{ fontSize: 12, fontWeight: 600 }}>
                          {collectionHealthLabels[r.collectionHealth]}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2" style={{ fontSize: 12 }}>{r.projectName}</p>
                      <div className="flex items-center gap-4" style={{ fontSize: 12 }}>
                        <span>Due: {r.dueDate}</span>
                        <span>Next: {r.nextMilestonePayment}</span>
                        <span className="ml-auto" style={{ fontWeight: 600 }}>{inr(r.nextMilestoneAmount)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </SummaryCard>
          </div>
        )}

        {tab === "milestones" && (
          <SummaryCard title="Payment Milestone View — All Orders">
            <div className="space-y-6">
              {financeRecords.map(r => (
                <div key={r.id} className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600 }}>{r.projectName}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{r.accountName} | {inr(r.quotationAmount)} total</p>
                    </div>
                    <Link to={`/admin/finance/ledger/${r.id}`}>
                      <Button variant="outline" size="sm" icon={<ArrowRight size={14} />}>Ledger</Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {r.milestoneSchedule.map(ms => (
                      <div
                        key={ms.id}
                        className={`p-3 rounded-lg border ${
                          ms.status === "completed" ? "bg-emerald-50 border-emerald-200" :
                          ms.status === "overdue" ? "bg-red-50 border-red-200" :
                          ms.status === "partial" ? "bg-amber-50 border-amber-200" :
                          "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <p style={{ fontSize: 11.5, fontWeight: 500 }} className={
                          ms.status === "completed" ? "text-emerald-700" :
                          ms.status === "overdue" ? "text-red-700" :
                          "text-muted-foreground"
                        }>{ms.label}</p>
                        <p className="mt-1" style={{ fontSize: 15, fontWeight: 700 }}>{inr(ms.expectedAmount)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {ms.status === "completed" && <CheckCircle2 size={12} className="text-emerald-600" />}
                          {ms.status === "overdue" && <AlertTriangle size={12} className="text-red-600" />}
                          {ms.status === "pending" && <Clock size={12} className="text-gray-400" />}
                          <span style={{ fontSize: 11 }}>
                            {ms.status === "completed" ? `Paid ${ms.paidDate}` :
                             ms.status === "overdue" ? `Due ${ms.dueDate}` :
                             `Due ${ms.dueDate}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SummaryCard>
        )}
      </div>
    </PageShell>
  );
}

function FileIcon() {
  return <Receipt size={18} />;
}