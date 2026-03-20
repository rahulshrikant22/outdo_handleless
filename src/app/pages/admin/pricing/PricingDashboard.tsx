import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import { StatusBadge, Button, SummaryCard } from "../../../components/shared";
import { QuotationIntegrationBlock } from "../../../components/pricing/QuotationIntegrationBlock";
import { PricingFormModal } from "../../../components/pricing/PricingFormModal";
import { getPricingDashboardStats, pricingItems } from "../../../data/pricing";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import {
  DollarSign, Package, CheckCircle2, XCircle, FileEdit, Clock,
  Plus, Download, ArrowRight, TrendingUp, Tag, Layers
} from "lucide-react";

import { handleExport } from "../../../components/shared/GlobalModals";

const CATEGORY_COLORS = ["#1B2A4A", "#EC6E63", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
const TYPE_COLORS = ["#1B2A4A", "#EC6E63", "#3b82f6", "#f59e0b", "#10b981", "#f97316", "#8b5cf6"];

export function PricingDashboard() {
  const navigate = useNavigate();
  const stats = getPricingDashboardStats();
  const [addModal, setAddModal] = useState(false);

  return (
    <>
      <PageShell
        title="Pricing Dashboard"
        subtitle={`${stats.total} items · ${stats.active} active · Rate catalog management`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Pricing Rates")}>Export Rates</Button>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setAddModal(true)}>Add Item</Button>
          </div>
        }
      >
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <StatCard label="Total Items" value={stats.total} icon={<Package size={18} />} accent="navy" />
          <StatCard label="Active" value={stats.active} icon={<CheckCircle2 size={18} />} accent="green" />
          <StatCard label="Inactive" value={stats.inactive} icon={<XCircle size={18} />} accent="red" />
          <StatCard label="Draft" value={stats.draft} icon={<FileEdit size={18} />} accent="blue" />
          <StatCard label="Discontinued" value={stats.discontinued} icon={<Clock size={18} />} accent="gold" />
        </div>

        {/* Status Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.categoryCounts.map((cat, idx) => (
            <div key={cat.category} className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}15` }}>
                  <Tag size={16} style={{ color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
                </div>
                <span className="text-muted-foreground" style={{ fontSize: 11.5 }}>{cat.active} active</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700 }}>{cat.count}</p>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: 12 }}>{cat.category}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Category Distribution Pie */}
          <SummaryCard title="Category Distribution">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart id="pricing-cat-pie">
                  <Pie
                    key="pricing-cat-pie-data"
                    data={stats.categoryCounts}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    dataKey="count"
                    nameKey="category"
                    paddingAngle={3}
                    label={({ category, count }) => `${category}: ${count}`}
                  >
                    {stats.categoryCounts.map((_, idx) => (
                      <Cell key={`pricing-cat-cell-${idx}`} fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend key="pricing-cat-legend" wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip key="pricing-cat-tooltip" contentStyle={{ fontSize: 13, borderRadius: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </SummaryCard>

          {/* Item Type Bar Chart */}
          <SummaryCard title="Item Types">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={stats.typeCounts} margin={{ bottom: 5 }} id="pricing-type-bar">
                  <XAxis key="pricing-type-xaxis" dataKey="type" style={{ fontSize: 11 }} />
                  <YAxis key="pricing-type-yaxis" style={{ fontSize: 12 }} />
                  <Tooltip key="pricing-type-tooltip" contentStyle={{ fontSize: 13, borderRadius: 10 }} />
                  <Bar key="pricing-type-bar" dataKey="count" fill="#1B2A4A" name="Items" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SummaryCard>

          {/* Average Rates by Category */}
          <SummaryCard title="Average Rate by Category">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={stats.avgRates} layout="vertical" margin={{ left: 10 }} id="pricing-avg-bar">
                  <XAxis key="pricing-avg-xaxis" type="number" style={{ fontSize: 12 }} />
                  <YAxis key="pricing-avg-yaxis" type="category" dataKey="category" width={70} style={{ fontSize: 11 }} />
                  <Tooltip
                    key="pricing-avg-tooltip"
                    contentStyle={{ fontSize: 13, borderRadius: 10 }}
                    formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  />
                  <Bar key="pricing-avg-bar" dataKey="avgRate" fill="#EC6E63" name="Avg Rate" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SummaryCard>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Rate Changes */}
          <div className="lg:col-span-2">
            <SummaryCard
              title="Recent Rate Changes"
              actions={
                <Button variant="outline" size="sm" onClick={() => navigate("/admin/pricing/table")}>
                  View All Items <ArrowRight size={13} className="ml-1" />
                </Button>
              }
            >
              {stats.recentChanges.length === 0 ? (
                <p className="text-muted-foreground text-center py-6" style={{ fontSize: 14 }}>No recent rate changes.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ fontSize: 13 }}>
                    <thead>
                      <tr className="border-b border-border">
                        {["Item", "Category", "Previous", "New Rate", "Date", "Reason"].map(h => (
                          <th key={h} className="text-left py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentChanges.map(rc => (
                        <tr
                          key={rc.id}
                          className="border-b border-border/50 hover:bg-gold/4 cursor-pointer"
                          onClick={() => navigate(`/admin/pricing/${rc.itemId}`)}
                        >
                          <td className="py-2.5" style={{ fontWeight: 500 }}>{rc.itemName}</td>
                          <td className="py-2.5"><StatusBadge status={rc.category} size="xs" /></td>
                          <td className="py-2.5 text-muted-foreground line-through">₹{rc.previousRate.toLocaleString("en-IN")}</td>
                          <td className="py-2.5" style={{ fontWeight: 500 }}>₹{rc.newRate.toLocaleString("en-IN")}</td>
                          <td className="py-2.5 text-muted-foreground" style={{ fontSize: 12 }}>{rc.changedAt}</td>
                          <td className="py-2.5 text-muted-foreground max-w-[200px] truncate" style={{ fontSize: 12 }}>{rc.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SummaryCard>
          </div>

          {/* Quotation Integration Block */}
          <div>
            <QuotationIntegrationBlock />
          </div>
        </div>

        {/* Unit Distribution Quick View */}
        <div className="mt-6">
          <SummaryCard title="Unit Distribution">
            <div className="flex items-center gap-3 flex-wrap">
              {stats.unitCounts.map(uc => (
                <div key={uc.unit} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background">
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>{uc.unit}</span>
                  <span className="px-2 py-0.5 rounded-full bg-navy/8 text-navy" style={{ fontSize: 13, fontWeight: 600 }}>{uc.count}</span>
                </div>
              ))}
            </div>
          </SummaryCard>
        </div>
      </PageShell>

      <PricingFormModal open={addModal} onClose={() => setAddModal(false)} />
    </>
  );
}