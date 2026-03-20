import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import { StatusBadge, SummaryCard, Button, TabBar } from "../../../components/shared";
import {
  getSalesKPIs, getOutcomeDistribution, getOrdersVsConverted,
  getMonthlyTrend, inr,
} from "../../../data/salesAnalytics";
import { projectOrders, projectQuotations } from "../../../data/orders";
import { convertedOrders, productionStatusLabels, dispatchStatusLabels } from "../../../data/operations";
import {
  ShoppingCart, FileText, DollarSign, TrendingUp, CheckCircle2,
  ArrowRight, Target, BarChart3, Users, Award,
  AlertTriangle, Package, Clock,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

export function SalesDashboard() {
  const kpi = getSalesKPIs();
  const outcomes = getOutcomeDistribution();
  const ordersVsConverted = getOrdersVsConverted();
  const monthlyTrend = getMonthlyTrend();
  const [chartTab, setChartTab] = useState("funnel");

  // Value comparison for bar chart
  const valueComparison = [
    { name: "Total Quotation", value: kpi.totalQuotationValue, fill: "#1B2A4A" },
    { name: "Won", value: kpi.wonValue, fill: "#10B981" },
    { name: "Pipeline", value: kpi.pipelineValue, fill: "#3B82F6" },
    { name: "Lost", value: kpi.lostValue, fill: "#EF4444" },
    { name: "Hold", value: kpi.holdValue, fill: "#8B5CF6" },
  ];

  return (
    <PageShell
      title="Sales Dashboard"
      subtitle={`${kpi.totalOrders} orders · ${kpi.totalQuotations} quotations · ${kpi.totalConvertedOrders} converted`}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/sales/salesperson">
            <Button variant="outline" size="sm" icon={<Users size={14} />}>Team Performance</Button>
          </Link>
          <Link to="/admin/sales/analysis">
            <Button variant="gold" size="sm" icon={<BarChart3 size={14} />}>Analysis</Button>
          </Link>
        </div>
      }
    >
      {/* Top KPIs — 5 cards row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <Link to="/admin/orders/table">
          <StatCard label="Total Orders" value={kpi.totalOrders} icon={<ShoppingCart size={18} />} accent="navy" />
        </Link>
        <Link to="/admin/orders/dashboard">
          <StatCard label="Total Quotations" value={kpi.totalQuotations} icon={<FileText size={18} />} accent="blue" />
        </Link>
        <StatCard label="Total Quotation Value" value={inr(kpi.totalQuotationValue)} icon={<DollarSign size={18} />} accent="navy" />
        <Link to="/admin/operations/table">
          <StatCard label="Converted Orders" value={kpi.totalConvertedOrders} icon={<CheckCircle2 size={18} />} accent="green" trend={`${kpi.conversionRate}% rate`} trendDirection="up" />
        </Link>
        <StatCard label="Converted Value" value={inr(kpi.totalConvertedValue)} icon={<TrendingUp size={18} />} accent="green" trend={`${kpi.collectionRate}% collected`} trendDirection="up" />
      </div>

      {/* Row 2 — pipeline / outcome KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Open Pipeline" value={inr(kpi.pipelineValue)} icon={<Target size={18} />} accent="blue" trend={`${kpi.openCount + kpi.underDiscussionCount + kpi.negotiationCount} deals`} />
        <StatCard label="Under Discussion" value={inr(kpi.underDiscussionValue)} icon={<Clock size={18} />} accent="gold" trend={`${kpi.underDiscussionCount} deal${kpi.underDiscussionCount !== 1 ? "s" : ""}`} />
        <StatCard label="Won Value" value={inr(kpi.wonValue)} icon={<Award size={18} />} accent="green" trend={`${kpi.winRate}% win rate`} trendDirection="up" />
        <StatCard label="Lost Value" value={inr(kpi.lostValue)} icon={<AlertTriangle size={18} />} accent="red" trend={`${kpi.lostCount} deal${kpi.lostCount !== 1 ? "s" : ""}`} trendDirection="down" />
        <StatCard label="Hold Value" value={inr(kpi.holdValue)} icon={<Package size={18} />} accent="purple" trend={`${kpi.holdCount} deal${kpi.holdCount !== 1 ? "s" : ""}`} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Outcome Distribution Pie */}
        <SummaryCard title="Quotation Outcomes">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie data={outcomes} dataKey="count" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3}>
                  {outcomes.map((entry, i) => <Cell key={`outcome-${i}`} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [`${value} deals`, props.payload.label]}
                  contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {outcomes.map(o => (
              <div key={o.outcome} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: o.color }} />
                  <span style={{ fontSize: 12.5 }}>{o.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>{o.count}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{inr(o.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </SummaryCard>

        {/* Charts area with tabs */}
        <div className="lg:col-span-2">
          <SummaryCard
            title="Sales Analytics"
            actions={
              <TabBar
                tabs={[
                  { key: "funnel", label: "Value Funnel" },
                  { key: "trend", label: "Monthly Trend" },
                ]}
                active={chartTab}
                onChange={setChartTab}
              />
            }
          >
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                {chartTab === "funnel" ? (
                  <BarChart data={valueComparison}>
                    <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                    <XAxis key="x-axis" dataKey="name" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                    <YAxis key="y-axis" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Tooltip
                      formatter={(value: number) => [inr(value), "Value"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={48}>
                      {valueComparison.map((entry, i) => <Cell key={`val-cell-${i}`} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                ) : (
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                    <XAxis key="x-axis" dataKey="month" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                    <YAxis key="y-axis" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line key="line-new" type="monotone" dataKey="newOrders" stroke="#1B2A4A" strokeWidth={2} name="New Orders" dot={{ r: 4 }} />
                    <Line key="line-won" type="monotone" dataKey="wonCount" stroke="#10B981" strokeWidth={2} name="Won" dot={{ r: 4 }} />
                    <Line key="line-lost" type="monotone" dataKey="lostCount" stroke="#EF4444" strokeWidth={2} name="Lost" dot={{ r: 4 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </SummaryCard>
        </div>
      </div>

      {/* Orders vs Converted Table */}
      <SummaryCard
        title="Orders vs Converted — Full Pipeline"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/operations/table" className="text-gold-dark hover:underline flex items-center gap-1" style={{ fontSize: 12, fontWeight: 500 }}>
              Converted Orders <ArrowRight size={12} />
            </Link>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Order", "Project", "Account", "City", "Salesperson", "Value", "Outcome", "Converted", "Status"].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: "0.02em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ordersVsConverted.map(row => (
                <tr key={row.orderId} className="hover:bg-gold/4 transition-colors">
                  <td className="px-3 py-2.5">
                    <Link to={`/admin/orders/${row.orderId}`} className="text-gold-dark hover:underline" style={{ fontSize: 12, fontWeight: 600 }}>
                      {row.orderId}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5" style={{ fontSize: 13 }}>{row.projectName}</td>
                  <td className="px-3 py-2.5" style={{ fontSize: 13 }}>{row.accountName}</td>
                  <td className="px-3 py-2.5 text-muted-foreground" style={{ fontSize: 12.5 }}>{row.city}</td>
                  <td className="px-3 py-2.5" style={{ fontSize: 12.5 }}>{row.salesperson}</td>
                  <td className="px-3 py-2.5" style={{ fontSize: 13, fontWeight: 600 }}>{inr(row.quotationValue)}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={row.quotationStatus} size="xs" /></td>
                  <td className="px-3 py-2.5">
                    {row.isConverted ? (
                      <Link to={`/admin/operations/${row.convertedOrderId}`} className="text-emerald-600 hover:underline flex items-center gap-1" style={{ fontSize: 12, fontWeight: 500 }}>
                        <CheckCircle2 size={13} /> {row.convertedOrderId}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {row.productionStatus ? (
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={row.productionStatus} size="xs" />
                      </div>
                    ) : (
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SummaryCard>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Salesperson Performance", path: "/admin/sales/salesperson", icon: <Users size={18} />, desc: "Team metrics & drill-down" },
          { label: "Territory Analysis", path: "/admin/sales/territory", icon: <Target size={18} />, desc: "City & zone breakdown" },
          { label: "Win/Loss Analysis", path: "/admin/sales/analysis", icon: <BarChart3 size={18} />, desc: "Outcome patterns & alerts" },
          { label: "Orders Dashboard", path: "/admin/orders/dashboard", icon: <ShoppingCart size={18} />, desc: "Orders & quotations" },
        ].map(link => (
          <Link key={link.path} to={link.path} className="block p-4 bg-card rounded-xl border border-border hover:border-gold/30 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy/8 flex items-center justify-center text-navy">{link.icon}</div>
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 500 }}>{link.label}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{link.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}