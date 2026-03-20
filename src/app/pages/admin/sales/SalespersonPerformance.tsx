import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import {
  StatusBadge, SummaryCard, Button, DataTable, Drawer, DetailField, TabBar,
} from "../../../components/shared";
import {
  getSalespersonPerformance, getSalesKPIs, inr,
  type SalespersonPerf,
} from "../../../data/salesAnalytics";
import {
  Users, ArrowLeft, Award, Target, TrendingUp, DollarSign,
  ChevronRight, MapPin, ShoppingCart, FileText, CheckCircle2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

export function SalespersonPerformance() {
  const spPerf = getSalespersonPerformance();
  const kpi = getSalesKPIs();
  const [selected, setSelected] = useState<SalespersonPerf | null>(null);
  const [chartView, setChartView] = useState("revenue");

  // Chart data
  const chartData = spPerf.map(sp => ({
    name: sp.name.split(" ")[0],
    wonValue: sp.wonValue,
    pipelineValue: sp.pipelineValue,
    lostValue: sp.lostValue,
    orders: sp.totalOrders,
    winRate: sp.winRate,
  }));

  // Radar data for selected person
  const getRadarData = (sp: SalespersonPerf) => {
    const max = Math.max(...spPerf.map(s => s.totalOrders), 1);
    const maxVal = Math.max(...spPerf.map(s => s.wonValue), 1);
    const maxLeads = Math.max(...spPerf.map(s => s.leadsAssigned), 1);
    return [
      { metric: "Orders", value: Math.round((sp.totalOrders / max) * 100) },
      { metric: "Revenue", value: Math.round((sp.wonValue / maxVal) * 100) },
      { metric: "Win Rate", value: sp.winRate },
      { metric: "Leads", value: Math.round((sp.leadsAssigned / maxLeads) * 100) },
      { metric: "Pipeline", value: sp.pipelineValue > 0 ? Math.min(100, Math.round((sp.pipelineValue / maxVal) * 100)) : 0 },
      { metric: "Collection", value: sp.wonValue > 0 ? Math.round((sp.receivedAmount / sp.wonValue) * 100) : 0 },
    ];
  };

  return (
    <>
      <PageShell
        title="Salesperson Performance"
        subtitle={`${spPerf.length} salespeople across ${[...new Set(spPerf.map(s => s.zone))].length} zones`}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/sales/dashboard">
              <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>Dashboard</Button>
            </Link>
            <Link to="/admin/sales/territory">
              <Button variant="outline" size="sm" icon={<MapPin size={14} />}>Territory View</Button>
            </Link>
          </div>
        }
      >
        {/* Team KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Team Size" value={spPerf.length} icon={<Users size={18} />} accent="navy" />
          <StatCard label="Total Won" value={inr(kpi.wonValue)} icon={<Award size={18} />} accent="green" trend={`${kpi.winRate}% win rate`} trendDirection="up" />
          <StatCard label="Active Pipeline" value={inr(kpi.pipelineValue)} icon={<Target size={18} />} accent="blue" />
          <StatCard label="Avg Deal Size" value={inr(Math.round(kpi.wonValue / Math.max(kpi.wonCount, 1)))} icon={<TrendingUp size={18} />} accent="gold" />
        </div>

        {/* Chart */}
        <SummaryCard
          title="Team Comparison"
          actions={
            <TabBar
              tabs={[
                { key: "revenue", label: "Revenue" },
                { key: "orders", label: "Orders" },
                { key: "winrate", label: "Win Rate" },
              ]}
              active={chartView}
              onChange={setChartView}
            />
          }
        >
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              {chartView === "revenue" ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: number) => [inr(v), ""]} contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                  <Bar dataKey="wonValue" fill="#10B981" radius={[4, 4, 0, 0]} name="Won" stackId="a" />
                  <Bar dataKey="pipelineValue" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Pipeline" stackId="a" />
                  <Bar dataKey="lostValue" fill="#EF4444" radius={[4, 4, 0, 0]} name="Lost" stackId="a" />
                </BarChart>
              ) : chartView === "orders" ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                  <Bar dataKey="orders" radius={[6, 6, 0, 0]} barSize={40} fill="#1B2A4A" name="Orders">
                    {chartData.map((_, i) => <Cell key={i} fill={i === 0 ? "#EC6E63" : "#1B2A4A"} />)}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v: number) => [`${v}%`, "Win Rate"]} contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                  <Bar dataKey="winRate" radius={[6, 6, 0, 0]} barSize={40} name="Win Rate">
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.winRate >= 75 ? "#10B981" : entry.winRate >= 50 ? "#F59E0B" : "#EF4444"} />)}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </SummaryCard>

        {/* Salesperson Table */}
        <div className="mt-6">
          <SummaryCard title="Individual Performance">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Salesperson", "Territory", "Orders", "Won / Lost", "Won Value", "Pipeline", "Win Rate", "Collection", ""].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: "0.02em" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {spPerf.sort((a, b) => b.wonValue - a.wonValue).map((sp, idx) => (
                    <tr key={sp.id} className="hover:bg-gold/4 cursor-pointer transition-colors" onClick={() => setSelected(sp)}>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${idx === 0 ? "bg-gold/15 text-gold-dark" : "bg-navy/8 text-navy"}`}>
                            {idx === 0 ? <Award size={14} /> : <Users size={14} />}
                          </div>
                          <div>
                            <p style={{ fontSize: 13.5, fontWeight: 500 }}>{sp.name}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{sp.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-muted-foreground" style={{ fontSize: 12.5 }}>{sp.zone} · {sp.territory}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{sp.totalOrders}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-600" style={{ fontSize: 12.5, fontWeight: 500 }}>{sp.wonOrders}W</span>
                          <span className="text-muted-foreground" style={{ fontSize: 12 }}>/</span>
                          <span className="text-red-500" style={{ fontSize: 12.5, fontWeight: 500 }}>{sp.lostOrders}L</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-emerald-600" style={{ fontSize: 13, fontWeight: 600 }}>{inr(sp.wonValue)}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-blue-600" style={{ fontSize: 13, fontWeight: 500 }}>{inr(sp.pipelineValue)}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${sp.winRate >= 75 ? "bg-emerald-500" : sp.winRate >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${sp.winRate}%` }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{sp.winRate}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-muted-foreground" style={{ fontSize: 12.5 }}>{inr(sp.receivedAmount)}</span>
                      </td>
                      <td className="px-3 py-3">
                        <ChevronRight size={14} className="text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SummaryCard>
        </div>
      </PageShell>

      {/* Drill-down Drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.name} — Performance` : ""}>
        {selected && (
          <div className="space-y-5">
            {/* Profile header */}
            <div className="flex items-center gap-3 p-3 bg-navy/5 rounded-xl border border-navy/10">
              <div className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center">
                <Award size={18} className="text-gold-dark" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{selected.name}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12.5 }}>{selected.city} · {selected.zone} · {selected.territory}</p>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-emerald-700" style={{ fontSize: 11.5 }}>Won Value</p>
                <p className="text-emerald-800" style={{ fontSize: 18, fontWeight: 700 }}>{inr(selected.wonValue)}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-blue-700" style={{ fontSize: 11.5 }}>Pipeline</p>
                <p className="text-blue-800" style={{ fontSize: 18, fontWeight: 700 }}>{inr(selected.pipelineValue)}</p>
              </div>
              <div className="p-3 rounded-lg bg-navy/5 border border-navy/10">
                <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>Win Rate</p>
                <p style={{ fontSize: 18, fontWeight: 700 }}>{selected.winRate}%</p>
              </div>
              <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
                <p className="text-gold-dark" style={{ fontSize: 11.5 }}>Avg Deal</p>
                <p className="text-gold-dark" style={{ fontSize: 18, fontWeight: 700 }}>{inr(selected.avgDealSize)}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <DetailField label="Total Orders" value={selected.totalOrders} />
              <DetailField label="Total Value" value={inr(selected.totalQuotationValue)} />
              <DetailField label="Leads Assigned" value={selected.leadsAssigned} />
              <DetailField label="Accounts Converted" value={selected.accountsConverted} />
              <DetailField label="Collection" value={inr(selected.receivedAmount)} />
              <DetailField label="Won / Lost" value={`${selected.wonOrders}W / ${selected.lostOrders}L`} />
            </div>

            {/* Radar chart */}
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="mb-2" style={{ fontSize: 13, fontWeight: 500 }}>Performance Radar</p>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <RadarChart data={getRadarData(selected)}>
                    <PolarGrid stroke="rgba(27,42,74,0.1)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#6B7A90" }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="value" stroke="#EC6E63" fill="#EC6E63" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Orders list */}
            <div>
              <p className="mb-2" style={{ fontSize: 13, fontWeight: 500 }}>Orders ({selected.orders.length})</p>
              <div className="space-y-2">
                {selected.orders.map(o => {
                  const q = selected.quotations.find(qt => qt.orderId === o.id);
                  return (
                    <Link key={o.id} to={`/admin/orders/${o.id}`} className="block p-3 rounded-lg bg-background border border-border hover:border-gold/30 transition-all" onClick={() => setSelected(null)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500 }}>{o.projectName}</p>
                          <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{o.id} · {o.accountName} · {o.city}</p>
                        </div>
                        <div className="text-right">
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{inr(o.totalQuotationValue)}</p>
                          {q && <StatusBadge status={q.outcome} size="xs" />}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}