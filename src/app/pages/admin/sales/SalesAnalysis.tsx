import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import {
  StatusBadge, SummaryCard, Button, TabBar, AlertCard,
} from "../../../components/shared";
import {
  getSourcePerformance, getCategoryPerformance, getChannelPerformance,
  getWinLossDetail, getSalesAlerts, getSalesRankings,
  getSalesKPIs, inr,
} from "../../../data/salesAnalytics";
import {
  BarChart3, ArrowLeft, TrendingUp, Award, AlertTriangle,
  CheckCircle2, XCircle, Clock, Target, Zap, Trophy,
  ArrowRight, Globe, Layers, Users,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export function SalesAnalysis() {
  const [activeTab, setActiveTab] = useState("winloss");
  const kpi = getSalesKPIs();
  const sourcePerf = getSourcePerformance();
  const categoryPerf = getCategoryPerformance();
  const channelPerf = getChannelPerformance();
  const winLoss = getWinLossDetail();
  const alerts = getSalesAlerts();
  const rankings = getSalesRankings();

  // Chart colors
  const sourceColors = ["#1B2A4A", "#EC6E63", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];
  const catColors = ["#1B2A4A", "#EC6E63", "#3B82F6", "#10B981"];

  const sourceChartData = sourcePerf.map(s => ({
    name: s.source,
    value: s.value,
    wonValue: s.wonValue,
    orders: s.orders,
  }));

  const categoryChartData = categoryPerf.map(c => ({
    name: c.category,
    value: c.value,
    wonValue: c.wonValue,
    orders: c.orders,
  }));

  const channelPieData = channelPerf.map((c, i) => ({
    name: c.channel,
    value: c.value,
    color: sourceColors[i % sourceColors.length],
  }));

  return (
    <PageShell
      title="Sales Analysis"
      subtitle="Win/Loss patterns, source analytics, alerts & rankings"
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/sales/dashboard">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>Dashboard</Button>
          </Link>
          <Link to="/admin/sales/salesperson">
            <Button variant="outline" size="sm" icon={<Users size={14} />}>Team</Button>
          </Link>
        </div>
      }
    >
      <TabBar
        tabs={[
          { key: "winloss", label: "Win / Loss / Hold" },
          { key: "source", label: "Source & Category" },
          { key: "alerts", label: "Alerts & Rankings", count: alerts.filter(a => a.type === "danger" || a.type === "warning").length },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {/* ===== WIN / LOSS / HOLD ===== */}
        {activeTab === "winloss" && (
          <div className="space-y-6">
            {/* Summary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Win Rate" value={`${kpi.winRate}%`} icon={<Trophy size={18} />} accent="green" trend={`${kpi.wonCount} of ${kpi.wonCount + kpi.lostCount} decided`} trendDirection="up" />
              <StatCard label="Won Value" value={inr(kpi.wonValue)} icon={<CheckCircle2 size={18} />} accent="green" />
              <StatCard label="Lost Value" value={inr(kpi.lostValue)} icon={<XCircle size={18} />} accent="red" />
              <StatCard label="On Hold" value={inr(kpi.holdValue)} icon={<Clock size={18} />} accent="purple" />
            </div>

            {/* Won deals */}
            <SummaryCard
              title={`Won Deals (${winLoss.won.length})`}
              actions={<span className="text-emerald-600" style={{ fontSize: 13, fontWeight: 600 }}>{inr(kpi.wonValue)}</span>}
            >
              <div className="space-y-2">
                {winLoss.won.map(q => (
                  <Link key={q.id} to={`/admin/orders/quotation/${q.id}`} className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/50 hover:border-emerald-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                      </div>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 500 }}>{q.projectName}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>
                          {q.id} · {q.order?.accountName} · {q.order?.salespersonName} · Won {q.wonAt}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-emerald-600" style={{ fontSize: 14, fontWeight: 600 }}>{inr(q.quotationAmount)}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>
                        {q.receivedAmount > 0 ? `${inr(q.receivedAmount)} received` : "No payment yet"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </SummaryCard>

            {/* Lost deals */}
            <SummaryCard
              title={`Lost Deals (${winLoss.lost.length})`}
              actions={<span className="text-red-600" style={{ fontSize: 13, fontWeight: 600 }}>{inr(kpi.lostValue)}</span>}
            >
              {winLoss.lost.length > 0 ? (
                <div className="space-y-2">
                  {winLoss.lost.map(q => (
                    <Link key={q.id} to={`/admin/orders/quotation/${q.id}`} className="flex items-center justify-between p-3 rounded-lg bg-red-50/50 border border-red-200/50 hover:border-red-300 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                          <XCircle size={14} className="text-red-600" />
                        </div>
                        <div>
                          <p style={{ fontSize: 13.5, fontWeight: 500 }}>{q.projectName}</p>
                          <p className="text-muted-foreground" style={{ fontSize: 12 }}>
                            {q.id} · {q.order?.accountName} · {q.order?.salespersonName} · Lost {q.lostAt}
                          </p>
                          {q.lostReason && (
                            <p className="text-red-600 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>
                              Reason: {q.lostReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-red-600" style={{ fontSize: 14, fontWeight: 600 }}>{inr(q.quotationAmount)}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>v{q.currentVersion} versions</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-4 text-center" style={{ fontSize: 14 }}>No lost deals</p>
              )}
            </SummaryCard>

            {/* Hold deals */}
            <SummaryCard
              title={`On Hold (${winLoss.hold.length})`}
              actions={<span className="text-violet-600" style={{ fontSize: 13, fontWeight: 600 }}>{inr(kpi.holdValue)}</span>}
            >
              {winLoss.hold.length > 0 ? (
                <div className="space-y-2">
                  {winLoss.hold.map(q => (
                    <Link key={q.id} to={`/admin/orders/quotation/${q.id}`} className="flex items-center justify-between p-3 rounded-lg bg-violet-50/50 border border-violet-200/50 hover:border-violet-300 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                          <Clock size={14} className="text-violet-600" />
                        </div>
                        <div>
                          <p style={{ fontSize: 13.5, fontWeight: 500 }}>{q.projectName}</p>
                          <p className="text-muted-foreground" style={{ fontSize: 12 }}>
                            {q.id} · {q.order?.accountName} · {q.order?.salespersonName}
                          </p>
                          {q.holdReason && (
                            <p className="text-violet-600 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>
                              Reason: {q.holdReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-violet-600" style={{ fontSize: 14, fontWeight: 600 }}>{inr(q.quotationAmount)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-4 text-center" style={{ fontSize: 14 }}>No deals on hold</p>
              )}
            </SummaryCard>
          </div>
        )}

        {/* ===== SOURCE & CATEGORY ===== */}
        {activeTab === "source" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Source */}
              <SummaryCard title="Business Source Performance">
                <div className="h-[240px] mb-4">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={sourceChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip formatter={(v: number) => [inr(v), ""]} contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                      <Bar dataKey="wonValue" fill="#10B981" radius={[0, 4, 4, 0]} name="Won" stackId="a" />
                      <Bar dataKey="value" fill="#1B2A4A" radius={[0, 4, 4, 0]} name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {["Source", "Orders", "Value", "Won", "Win Rate"].map(h => (
                          <th key={h} className="px-2 py-2 text-left text-muted-foreground" style={{ fontSize: 11, fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {sourcePerf.map(s => (
                        <tr key={s.sourceKey}>
                          <td className="px-2 py-2" style={{ fontSize: 12.5, fontWeight: 500 }}>{s.source}</td>
                          <td className="px-2 py-2" style={{ fontSize: 12.5 }}>{s.orders}</td>
                          <td className="px-2 py-2" style={{ fontSize: 12.5, fontWeight: 600 }}>{inr(s.value)}</td>
                          <td className="px-2 py-2 text-emerald-600" style={{ fontSize: 12.5 }}>{inr(s.wonValue)}</td>
                          <td className="px-2 py-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-10 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.winRate}%` }} />
                              </div>
                              <span style={{ fontSize: 11.5, fontWeight: 500 }}>{s.winRate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SummaryCard>

              {/* Channel (Order Source) */}
              <SummaryCard title="Channel Performance">
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                      <Pie data={channelPieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3}>
                        {channelPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [inr(v), "Value"]} contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {channelPerf.map((c, i) => (
                    <div key={c.channelKey} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sourceColors[i % sourceColors.length] }} />
                        <span style={{ fontSize: 12.5 }}>{c.channel}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground" style={{ fontSize: 12 }}>{c.orders} orders</span>
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{inr(c.value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </SummaryCard>
            </div>

            {/* Project Category */}
            <SummaryCard title="Project Category Performance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(v: number) => [inr(v), ""]} contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                      <Bar dataKey="value" fill="#1B2A4A" radius={[6, 6, 0, 0]} name="Total Value" />
                      <Bar dataKey="wonValue" fill="#EC6E63" radius={[6, 6, 0, 0]} name="Won Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {categoryPerf.map((c, i) => (
                    <div key={c.categoryKey} className="p-3 rounded-lg bg-background border border-border">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: catColors[i % catColors.length] }} />
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{c.category}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{inr(c.value)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground" style={{ fontSize: 12 }}>{c.orders} orders</span>
                        <span className="text-emerald-600" style={{ fontSize: 12 }}>{c.wonOrders} won ({inr(c.wonValue)})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SummaryCard>
          </div>
        )}

        {/* ===== ALERTS & RANKINGS ===== */}
        {activeTab === "alerts" && (
          <div className="space-y-6">
            {/* Alerts */}
            <SummaryCard title="Sales Alerts">
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id}>
                    {alert.link ? (
                      <Link to={alert.link} className="block">
                        <AlertCard type={alert.type === "danger" ? "error" : alert.type === "success" ? "success" : alert.type === "warning" ? "warning" : "info"} title={alert.title} message={alert.message} />
                      </Link>
                    ) : (
                      <AlertCard type={alert.type === "danger" ? "error" : alert.type === "success" ? "success" : alert.type === "warning" ? "warning" : "info"} title={alert.title} message={alert.message} />
                    )}
                  </div>
                ))}
              </div>
            </SummaryCard>

            {/* Rankings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue Ranking */}
              <SummaryCard title="Revenue Ranking">
                <div className="space-y-2">
                  {rankings.byRevenue.map((sp, idx) => (
                    <div key={sp.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        idx === 0 ? "bg-gold/20 text-gold-dark" : idx === 1 ? "bg-gray-200 text-gray-600" : idx === 2 ? "bg-orange-100 text-orange-600" : "bg-muted text-muted-foreground"
                      }`}>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>#{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: 13, fontWeight: 500 }}>{sp.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{sp.city} · {sp.territory}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-emerald-600" style={{ fontSize: 13.5, fontWeight: 600 }}>{inr(sp.wonValue)}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11 }}>{sp.wonOrders} deals</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SummaryCard>

              {/* Win Rate Ranking */}
              <SummaryCard title="Win Rate Ranking">
                <div className="space-y-2">
                  {rankings.byWinRate.map((sp, idx) => (
                    <div key={sp.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        idx === 0 ? "bg-gold/20 text-gold-dark" : idx === 1 ? "bg-gray-200 text-gray-600" : idx === 2 ? "bg-orange-100 text-orange-600" : "bg-muted text-muted-foreground"
                      }`}>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>#{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: 13, fontWeight: 500 }}>{sp.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{sp.totalOrders} orders total</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${sp.winRate >= 75 ? "bg-emerald-500" : sp.winRate >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${sp.winRate}%` }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{sp.winRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SummaryCard>

              {/* Pipeline Ranking */}
              <SummaryCard title="Active Pipeline">
                <div className="space-y-2">
                  {rankings.byPipeline.filter(sp => sp.pipelineValue > 0).map((sp, idx) => (
                    <div key={sp.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Target size={14} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: 13, fontWeight: 500 }}>{sp.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{sp.pipelineOrders} active deals</p>
                      </div>
                      <span className="text-blue-600 shrink-0" style={{ fontSize: 13.5, fontWeight: 600 }}>{inr(sp.pipelineValue)}</span>
                    </div>
                  ))}
                  {rankings.byPipeline.filter(sp => sp.pipelineValue > 0).length === 0 && (
                    <p className="text-muted-foreground text-center py-4" style={{ fontSize: 14 }}>No active pipeline</p>
                  )}
                </div>
              </SummaryCard>

              {/* Top Deals */}
              <SummaryCard title="Top Deals by Value">
                <div className="space-y-2">
                  {[...rankings.byRevenue]
                    .flatMap(sp => sp.quotations.filter(q => q.outcome === "won"))
                    .sort((a, b) => b.quotationAmount - a.quotationAmount)
                    .slice(0, 5)
                    .map((q, idx) => (
                      <Link key={q.id} to={`/admin/orders/quotation/${q.id}`} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border hover:border-gold/30 transition-all">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          idx === 0 ? "bg-gold/20 text-gold-dark" : "bg-emerald-100 text-emerald-600"
                        }`}>
                          {idx === 0 ? <Trophy size={14} /> : <CheckCircle2 size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate" style={{ fontSize: 13, fontWeight: 500 }}>{q.projectName}</p>
                          <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{q.id}</p>
                        </div>
                        <span className="text-emerald-600 shrink-0" style={{ fontSize: 13.5, fontWeight: 600 }}>{inr(q.quotationAmount)}</span>
                      </Link>
                    ))}
                </div>
              </SummaryCard>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}