import { useState } from "react";
import { Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import {
  StatusBadge, SummaryCard, Button, TabBar, Drawer, DetailField,
} from "../../../components/shared";
import {
  getCityPerformance, getAccountPerformance, getSalesKPIs, inr,
  type CityPerf, type AccountPerf,
} from "../../../data/salesAnalytics";
import { projectOrders, projectQuotations } from "../../../data/orders";
import {
  MapPin, ArrowLeft, Building2, Globe, Target, TrendingUp,
  ChevronRight, DollarSign, ShoppingCart,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

export function TerritoryPerformance() {
  const cities = getCityPerformance();
  const accounts = getAccountPerformance();
  const kpi = getSalesKPIs();
  const [activeTab, setActiveTab] = useState("city");
  const [selectedAccount, setSelectedAccount] = useState<AccountPerf | null>(null);

  // Zone-level aggregate
  const zoneData = (() => {
    const zones: Record<string, { zone: string; orders: number; value: number; wonValue: number; cities: number }> = {};
    cities.forEach(c => {
      if (!zones[c.zone]) zones[c.zone] = { zone: c.zone, orders: 0, value: 0, wonValue: 0, cities: 0 };
      zones[c.zone].orders += c.totalOrders;
      zones[c.zone].value += c.totalValue;
      zones[c.zone].wonValue += c.wonValue;
      zones[c.zone].cities += 1;
    });
    return Object.values(zones).sort((a, b) => b.value - a.value);
  })();

  const zoneColors = ["#1B2A4A", "#EC6E63", "#3B82F6", "#10B981"];

  const cityChartData = cities.map(c => ({
    name: c.city,
    total: c.totalValue,
    won: c.wonValue,
    pipeline: c.pipelineValue,
  }));

  const accountTypeData = (() => {
    const types: Record<string, { type: string; count: number; value: number; color: string }> = {};
    const colors: Record<string, string> = { dealer: "#10B981", architect: "#8B5CF6", factory: "#F59E0B" };
    accounts.forEach(a => {
      if (!types[a.accountType]) types[a.accountType] = { type: a.accountType, count: 0, value: 0, color: colors[a.accountType] || "#9CA3AF" };
      types[a.accountType].count += 1;
      types[a.accountType].value += a.totalValue;
    });
    return Object.values(types);
  })();

  return (
    <>
      <PageShell
        title="Territory & Account Performance"
        subtitle={`${cities.length} cities · ${accounts.length} accounts · ${[...new Set(cities.map(c => c.zone))].length} zones`}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/sales/dashboard">
              <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>Dashboard</Button>
            </Link>
            <Link to="/admin/sales/salesperson">
              <Button variant="outline" size="sm" icon={<Target size={14} />}>Team View</Button>
            </Link>
          </div>
        }
      >
        <TabBar
          tabs={[
            { key: "city", label: "City / Territory", count: cities.length },
            { key: "account", label: "Account Performance", count: accounts.length },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === "city" && (
            <>
              {/* Zone KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {zoneData.map((z, i) => (
                  <div key={z.zone} className="p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zoneColors[i] || "#9CA3AF" }} />
                      <p className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>{z.zone} Zone</p>
                    </div>
                    <p style={{ fontSize: 20, fontWeight: 700 }}>{inr(z.value)}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-muted-foreground" style={{ fontSize: 11.5 }}>{z.orders} orders</span>
                      <span className="text-emerald-600" style={{ fontSize: 11.5 }}>{inr(z.wonValue)} won</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* City Chart */}
              <SummaryCard title="City-wise Value Distribution">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={cityChartData}>
                      <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                      <XAxis key="x-axis" dataKey="name" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                      <YAxis key="y-axis" tick={{ fontSize: 11, fill: "#6B7A90" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(v: number) => [inr(v), ""]} contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                      <Bar key="bar-won" dataKey="won" fill="#10B981" radius={[4, 4, 0, 0]} name="Won" stackId="a" />
                      <Bar key="bar-pipeline" dataKey="pipeline" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Pipeline" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SummaryCard>

              {/* City Table */}
              <div className="mt-6">
                <SummaryCard title="City Breakdown">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          {["City", "Zone / Territory", "Orders", "Total Value", "Won Value", "Pipeline", "Accounts"].map(h => (
                            <th key={h} className="px-3 py-2.5 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: "0.02em" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {cities.map(c => (
                          <tr key={c.city} className="hover:bg-gold/4 transition-colors">
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-muted-foreground" />
                                <span style={{ fontSize: 13.5, fontWeight: 500 }}>{c.city}</span>
                              </div>
                              <span className="text-muted-foreground ml-5" style={{ fontSize: 11.5 }}>{c.state}</span>
                            </td>
                            <td className="px-3 py-3 text-muted-foreground" style={{ fontSize: 12.5 }}>{c.zone} · {c.territory}</td>
                            <td className="px-3 py-3" style={{ fontSize: 13.5, fontWeight: 600 }}>{c.totalOrders}</td>
                            <td className="px-3 py-3" style={{ fontSize: 13, fontWeight: 600 }}>{inr(c.totalValue)}</td>
                            <td className="px-3 py-3 text-emerald-600" style={{ fontSize: 13, fontWeight: 500 }}>{inr(c.wonValue)}</td>
                            <td className="px-3 py-3 text-blue-600" style={{ fontSize: 13, fontWeight: 500 }}>{inr(c.pipelineValue)}</td>
                            <td className="px-3 py-3 text-muted-foreground" style={{ fontSize: 13 }}>{c.accounts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SummaryCard>
              </div>
            </>
          )}

          {activeTab === "account" && (
            <>
              {/* Account Type KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {accountTypeData.map(at => (
                  <div key={at.type} className="p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: at.color }} />
                      <p className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>
                        {at.type.charAt(0).toUpperCase() + at.type.slice(1)} Accounts
                      </p>
                    </div>
                    <p style={{ fontSize: 20, fontWeight: 700 }}>{inr(at.value)}</p>
                    <p className="text-muted-foreground mt-0.5" style={{ fontSize: 12 }}>{at.count} accounts</p>
                  </div>
                ))}
              </div>

              {/* Account Type Pie + Table */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SummaryCard title="Value by Account Type">
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie data={accountTypeData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3}>
                          {accountTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => [inr(v), "Value"]} contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {accountTypeData.map(at => (
                      <div key={at.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: at.color }} />
                          <span style={{ fontSize: 12.5 }}>{at.type.charAt(0).toUpperCase() + at.type.slice(1)}</span>
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{inr(at.value)}</span>
                      </div>
                    ))}
                  </div>
                </SummaryCard>

                <div className="lg:col-span-2">
                  <SummaryCard title="Account Details">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            {["Account", "Type", "City", "Orders", "Total Value", "Won", "Received"].map(h => (
                              <th key={h} className="px-3 py-2.5 text-left text-muted-foreground whitespace-nowrap" style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: "0.02em" }}>
                                {h}
                              </th>
                            ))}
                            <th className="px-3 py-2.5" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {accounts.map(a => (
                            <tr key={a.accountId} className="hover:bg-gold/4 cursor-pointer transition-colors" onClick={() => setSelectedAccount(a)}>
                              <td className="px-3 py-3">
                                <p style={{ fontSize: 13, fontWeight: 500 }}>{a.accountName}</p>
                                <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{a.accountId}</p>
                              </td>
                              <td className="px-3 py-3"><StatusBadge status={a.accountType} size="xs" /></td>
                              <td className="px-3 py-3 text-muted-foreground" style={{ fontSize: 12.5 }}>{a.city}</td>
                              <td className="px-3 py-3" style={{ fontSize: 13.5, fontWeight: 600 }}>{a.totalOrders}</td>
                              <td className="px-3 py-3" style={{ fontSize: 13, fontWeight: 600 }}>{inr(a.totalValue)}</td>
                              <td className="px-3 py-3 text-emerald-600" style={{ fontSize: 13, fontWeight: 500 }}>{inr(a.wonValue)}</td>
                              <td className="px-3 py-3 text-muted-foreground" style={{ fontSize: 12.5 }}>{inr(a.receivedAmount)}</td>
                              <td className="px-3 py-3"><ChevronRight size={14} className="text-muted-foreground" /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SummaryCard>
                </div>
              </div>
            </>
          )}
        </div>
      </PageShell>

      {/* Account drill-down Drawer */}
      <Drawer open={!!selectedAccount} onClose={() => setSelectedAccount(null)} title={selectedAccount?.accountName || ""}>
        {selectedAccount && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-3 bg-navy/5 rounded-xl border border-navy/10">
              <div className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center">
                <Building2 size={18} className="text-gold-dark" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{selectedAccount.accountName}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12.5 }}>
                  {selectedAccount.accountType.charAt(0).toUpperCase() + selectedAccount.accountType.slice(1)} · {selectedAccount.city} · {selectedAccount.zone}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-navy/5 border border-navy/10">
                <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>Total Value</p>
                <p style={{ fontSize: 18, fontWeight: 700 }}>{inr(selectedAccount.totalValue)}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-emerald-700" style={{ fontSize: 11.5 }}>Won Value</p>
                <p className="text-emerald-800" style={{ fontSize: 18, fontWeight: 700 }}>{inr(selectedAccount.wonValue)}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-blue-700" style={{ fontSize: 11.5 }}>Received</p>
                <p className="text-blue-800" style={{ fontSize: 18, fontWeight: 700 }}>{inr(selectedAccount.receivedAmount)}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-700" style={{ fontSize: 11.5 }}>Balance</p>
                <p className="text-red-800" style={{ fontSize: 18, fontWeight: 700 }}>{inr(selectedAccount.balanceAmount)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DetailField label="Total Orders" value={selectedAccount.totalOrders} />
              <DetailField label="Won Orders" value={selectedAccount.wonOrders} />
            </div>

            {/* Quotations */}
            <div>
              <p className="mb-2" style={{ fontSize: 13, fontWeight: 500 }}>Quotations ({selectedAccount.quotations.length})</p>
              <div className="space-y-2">
                {selectedAccount.quotations.map(q => (
                  <Link key={q.id} to={`/admin/orders/quotation/${q.id}`} className="block p-3 rounded-lg bg-background border border-border hover:border-gold/30 transition-all" onClick={() => setSelectedAccount(null)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{q.projectName}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{q.id}</p>
                      </div>
                      <div className="text-right">
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{inr(q.quotationAmount)}</p>
                        <StatusBadge status={q.outcome} size="xs" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link to={`/admin/crm/accounts/${selectedAccount.accountId}`} onClick={() => setSelectedAccount(null)}>
              <Button variant="outline" size="sm" icon={<Building2 size={14} />} className="w-full">
                View Full Account
              </Button>
            </Link>
          </div>
        )}
      </Drawer>
    </>
  );
}