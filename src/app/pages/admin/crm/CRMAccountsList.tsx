import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatCard } from "../../../components/layout/StatCard";
import {
  StatusBadge, FilterBar, DataTable, Pagination, Button, Drawer,
  DetailField, TabBar, SummaryCard, EmptyState
} from "../../../components/shared";
import type { CRMAccount } from "../../../data/crm";
import {
  crmAccounts, crmSalespeople, getActiveAccounts, getAccountsByType,
  formatClassification, formatCurrency, allCities, allStates, allZones
} from "../../../data/crm";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Plus, Download, Building2, Phone, Mail, MapPin, ArrowRight, ChevronRight, Edit, Wallet, CheckCircle2, CreditCard, TrendingUp, Users
} from "lucide-react";
import { handleExport, AddAccountModal } from "../../../components/shared/GlobalModals";
import { toast } from "sonner";

const healthColors: Record<string, string> = {
  excellent: "text-emerald-600", good: "text-blue-600", average: "text-amber-600",
  at_risk: "text-red-600", churned: "text-gray-400",
};

const healthBg: Record<string, string> = {
  excellent: "bg-emerald-50 border-emerald-200", good: "bg-blue-50 border-blue-200",
  average: "bg-amber-50 border-amber-200", at_risk: "bg-red-50 border-red-200",
  churned: "bg-gray-50 border-gray-200",
};

const PIE_COLORS = ["#1B2A4A", "#EC6E63", "#8B5CF6", "#10b981", "#ef4444"];

export function CRMAccountsList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [healthFilter, setHealthFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<CRMAccount | null>(null);
  const [addAccountOpen, setAddAccountOpen] = useState(false);

  const filtered = crmAccounts.filter(a => {
    if (search && !a.businessName.toLowerCase().includes(search.toLowerCase()) && !a.contactPerson.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter && a.accountType !== typeFilter) return false;
    if (healthFilter && a.health !== healthFilter) return false;
    if (cityFilter && a.city !== cityFilter) return false;
    if (stateFilter && a.state !== stateFilter) return false;
    if (zoneFilter && a.zone !== zoneFilter) return false;
    if (assigneeFilter && a.assignedUserId !== assigneeFilter) return false;
    return true;
  });

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  // Stats
  const active = getActiveAccounts().length;
  const dealers = getAccountsByType("dealer").length;
  const factories = getAccountsByType("factory").length;
  const architects = getAccountsByType("architect").length;
  const totalValue = crmAccounts.reduce((s, a) => s + a.totalOrderValue, 0);
  const totalOutstanding = crmAccounts.reduce((s, a) => s + a.outstandingAmount, 0);

  // Charts
  const typePieData = [
    { name: "Dealer", value: dealers },
    { name: "Factory", value: factories },
    { name: "Architect", value: architects },
  ];

  const healthPieData = [
    { name: "Excellent", value: crmAccounts.filter(a => a.health === "excellent").length },
    { name: "Good", value: crmAccounts.filter(a => a.health === "good").length },
    { name: "Average", value: crmAccounts.filter(a => a.health === "average").length },
    { name: "At Risk", value: crmAccounts.filter(a => a.health === "at_risk").length },
    { name: "Churned", value: crmAccounts.filter(a => a.health === "churned").length },
  ].filter(d => d.value > 0);

  const accountBarData = crmAccounts.map(a => ({
    name: a.businessName.length > 15 ? a.businessName.slice(0, 15) + "..." : a.businessName,
    value: a.totalOrderValue,
    outstanding: a.outstandingAmount,
  })).sort((a, b) => b.value - a.value);

  const hasFilters = search || typeFilter || healthFilter || cityFilter || stateFilter || zoneFilter || assigneeFilter;
  const clearFilters = () => { setSearch(""); setTypeFilter(""); setHealthFilter(""); setCityFilter(""); setStateFilter(""); setZoneFilter(""); setAssigneeFilter(""); setPage(1); };

  const cities = [...new Set(crmAccounts.map(a => a.city))];
  const states = [...new Set(crmAccounts.map(a => a.state))];

  return (
    <>
      <PageShell
        title="Accounts"
        subtitle={`${crmAccounts.length} accounts · ${active} active`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Accounts")}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setAddAccountOpen(true)}>Add Account</Button>
          </div>
        }
      >
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <StatCard label="Total Accounts" value={crmAccounts.length} icon={<Building2 size={18} />} accent="navy" />
          <StatCard label="Active" value={active} icon={<CheckCircle2 size={18} />} accent="green" />
          <StatCard label="Dealers" value={dealers} icon={<Users size={18} />} accent="gold" />
          <StatCard label="Factories" value={factories} icon={<Building2 size={18} />} accent="blue" />
          <StatCard label="Total Value" value={formatCurrency(totalValue)} icon={<TrendingUp size={18} />} accent="green" />
          <StatCard label="Outstanding" value={formatCurrency(totalOutstanding)} icon={<CreditCard size={18} />} accent="red" />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <TabBar
            tabs={[
              { key: "list", label: "All Accounts", count: crmAccounts.length },
              { key: "dashboard", label: "Dashboard" },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {activeTab === "list" && (
          <>
            <div className="mb-4">
              <FilterBar
                searchValue={search}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                searchPlaceholder="Search by name, contact, or ID..."
                filters={[
                  { label: "Type", value: typeFilter, onChange: (v) => { setTypeFilter(v); setPage(1); }, options: [
                    { label: "Dealer", value: "dealer" }, { label: "Factory", value: "factory" }, { label: "Architect", value: "architect" },
                  ]},
                  { label: "Health", value: healthFilter, onChange: (v) => { setHealthFilter(v); setPage(1); }, options: [
                    { label: "Excellent", value: "excellent" }, { label: "Good", value: "good" },
                    { label: "Average", value: "average" }, { label: "At Risk", value: "at_risk" },
                  ]},
                  { label: "City", value: cityFilter, onChange: (v) => { setCityFilter(v); setPage(1); }, options: cities.map(c => ({ label: c, value: c })) },
                  { label: "State", value: stateFilter, onChange: (v) => { setStateFilter(v); setPage(1); }, options: states.map(s => ({ label: s, value: s })) },
                  { label: "Zone", value: zoneFilter, onChange: (v) => { setZoneFilter(v); setPage(1); }, options: allZones.map(z => ({ label: z, value: z })) },
                  { label: "Manager", value: assigneeFilter, onChange: (v) => { setAssigneeFilter(v); setPage(1); }, options: crmSalespeople.map(sp => ({ label: sp.name, value: sp.id })) },
                ]}
              />
            </div>

            {hasFilters && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Showing {filtered.length} of {crmAccounts.length}</span>
                <button onClick={clearFilters} className="text-gold-dark hover:text-gold transition-colors" style={{ fontSize: 13, fontWeight: 500 }}>Clear all</button>
              </div>
            )}

            <DataTable
              keyField="id"
              data={paged}
              onRowClick={(a) => setSelectedAccount(a)}
              emptyMessage={hasFilters ? "No accounts match your filters." : "No accounts yet."}
              columns={[
                { key: "id", label: "ID", width: "80px", render: (a) => <span className="text-muted-foreground" style={{ fontSize: 12 }}>{a.id}</span> },
                { key: "businessName", label: "Business / Contact", render: (a) => (
                  <div>
                    <p style={{ fontWeight: 500 }}>{a.businessName}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>{a.contactPerson}</p>
                  </div>
                )},
                { key: "accountType", label: "Type", render: (a) => <StatusBadge status={a.accountType} /> },
                { key: "classification", label: "Classification", render: (a) => (
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>{formatClassification(a.classification)}</span>
                )},
                { key: "city", label: "Location", render: (a) => (
                  <div>
                    <p>{a.city}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>{a.state}</p>
                  </div>
                )},
                { key: "health", label: "Health", render: (a) => (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${healthBg[a.health]}`} style={{ fontSize: 12, fontWeight: 500 }}>
                    <span className={`w-1.5 h-1.5 rounded-full ${healthColors[a.health].replace("text-", "bg-")}`} />
                    {a.health.replace(/_/g, " ")}
                  </span>
                )},
                { key: "totalOrderValue", label: "Value", align: "right", render: (a) => (
                  <span style={{ fontWeight: 500 }}>{formatCurrency(a.totalOrderValue)}</span>
                )},
                { key: "totalOrders", label: "Orders", align: "center", render: (a) => <span>{a.totalOrders}</span> },
                { key: "isActive", label: "Status", render: (a) => (
                  <StatusBadge status={a.isActive ? "active" : "inactive"} />
                )},
              ]}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SummaryCard title="Account Type Distribution">
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                      <Pie data={typePieData} cx="50%" cy="50%" outerRadius={90} innerRadius={45} dataKey="value" paddingAngle={4} label={({ name, value }) => `${name}: ${value}`}>
                        {typePieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ fontSize: 13, borderRadius: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </SummaryCard>
              <SummaryCard title="Account Health Overview">
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                      <Pie data={healthPieData} cx="50%" cy="50%" outerRadius={90} innerRadius={45} dataKey="value" paddingAngle={4} label={({ name, value }) => `${name}: ${value}`}>
                        {healthPieData.map((_, i) => <Cell key={i} fill={["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#9ca3af"][i]} />)}
                      </Pie>
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ fontSize: 13, borderRadius: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </SummaryCard>
            </div>
            <SummaryCard title="Account Performance Comparison">
              <div style={{ height: 340 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={accountBarData} layout="vertical" margin={{ left: 10 }}>
                    <XAxis type="number" style={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                    <YAxis type="category" dataKey="name" width={120} style={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 13, borderRadius: 10 }} formatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Bar dataKey="value" fill="#1B2A4A" name="Total Value" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="outstanding" fill="#ef4444" name="Outstanding" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SummaryCard>
          </div>
        )}
      </PageShell>

      {/* Account Detail Drawer */}
      <Drawer open={!!selectedAccount} onClose={() => setSelectedAccount(null)} title="Account Details">
        {selectedAccount && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p style={{ fontSize: 18, fontWeight: 600 }}>{selectedAccount.businessName}</p>
                <p className="text-muted-foreground mt-0.5" style={{ fontSize: 13 }}>{selectedAccount.id} · {formatClassification(selectedAccount.classification)}</p>
              </div>
              <StatusBadge status={selectedAccount.accountType} size="md" />
            </div>

            <div className={`flex items-center gap-2 p-3 rounded-lg border ${healthBg[selectedAccount.health]}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${healthColors[selectedAccount.health].replace("text-", "bg-")}`} />
              <span className={healthColors[selectedAccount.health]} style={{ fontSize: 13, fontWeight: 500 }}>
                Health: {selectedAccount.health.replace(/_/g, " ").charAt(0).toUpperCase() + selectedAccount.health.replace(/_/g, " ").slice(1)}
              </span>
            </div>

            <Button variant="primary" size="sm" className="w-full" icon={<ArrowRight size={14} />}
              onClick={() => { setSelectedAccount(null); navigate(`/admin/crm/accounts/${selectedAccount.id}`); }}>
              Open Full Detail
            </Button>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <DetailField label="Contact Person" value={selectedAccount.contactPerson} />
              <DetailField label="Mobile" value={selectedAccount.mobile} />
              <DetailField label="Email" value={selectedAccount.email} />
              <DetailField label="GST" value={selectedAccount.gstNumber} />
              <DetailField label="City" value={selectedAccount.city} />
              <DetailField label="State" value={selectedAccount.state} />
              <DetailField label="Territory" value={selectedAccount.territory} />
              <DetailField label="Account Manager" value={selectedAccount.assignedUserName} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <DetailField label="Total Orders" value={selectedAccount.totalOrders} />
              <DetailField label="Total Value" value={formatCurrency(selectedAccount.totalOrderValue)} />
              <DetailField label="Outstanding" value={<span className={selectedAccount.outstandingAmount > 0 ? "text-red-600" : "text-emerald-600"}>{formatCurrency(selectedAccount.outstandingAmount)}</span>} />
              <DetailField label="Last Order" value={selectedAccount.lastOrderDate || "—"} />
              <DetailField label="Converted By" value={selectedAccount.convertedBy} />
              <DetailField label="Conversion Date" value={selectedAccount.conversionDate} />
              <DetailField label="Days to Convert" value={`${selectedAccount.daysToConvert} days`} />
              <DetailField label="Display Installed" value={selectedAccount.displayInstalled ? "Yes" : "No"} />
            </div>

            <DetailField label="Address" value={selectedAccount.address} />
            <DetailField label="Notes" value={selectedAccount.notes} />
          </div>
        )}
      </Drawer>

      <AddAccountModal open={addAccountOpen} onClose={() => setAddAccountOpen(false)} />
    </>
  );
}