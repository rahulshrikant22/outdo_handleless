import { PageShell } from "../../components/layout/PageShell";
import { StatCard } from "../../components/layout/StatCard";
import { StatusBadge, SummaryCard, Button, AlertCard } from "../../components/shared";
import { accounts, orders, payments, quotations, getAccountById } from "../../data";
import { convertedOrders } from "../../data/operations";
import { Building2, ShoppingCart, CreditCard, FileText, TrendingUp, ArrowRight, Wrench } from "lucide-react";
import { Link } from "react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const dealerAccounts = accounts.filter(a => a.dealerId === "U003" || a.dealerId === "U004");
const dealerAccIds = dealerAccounts.map(a => a.id);
const dealerOrders = orders.filter(o => dealerAccIds.includes(o.accountId));
const dealerPayments = payments.filter(p => dealerAccIds.includes(p.accountId));
const dealerQuotations = quotations.filter(q => dealerAccIds.includes(q.accountId));
const totalValue = dealerAccounts.reduce((s, a) => s + a.totalValue, 0);
const collectedAmount = dealerPayments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);

const accountRevenue = dealerAccounts.map(a => ({
  name: a.company.split(" ")[0],
  value: a.totalValue / 1000,
}));

export function DealerDashboard() {
  return (
    <PageShell
      title="Dashboard"
      subtitle="Welcome back, Amit Patel"
      actions={<Button variant="gold" size="sm" icon={<FileText size={14} />} onClick={() => toast.info("Opening quotation builder...", { description: "Redirecting to create a new quotation." })}>New Quotation</Button>}
    >
      {/* Alert */}
      <div className="mb-6">
        <AlertCard
          type="info"
          title="1 pending quotation awaiting response"
          message="Q004 for Rao Homes — ₹1,90,000. Follow up recommended."
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/dealer/accounts">
          <StatCard label="My Accounts" value={dealerAccounts.length} icon={<Building2 size={18} />} accent="purple" trend={`${dealerAccounts.filter(a => a.status === "active").length} active`} trendDirection="up" />
        </Link>
        <Link to="/dealer/orders">
          <StatCard label="Active Orders" value={dealerOrders.filter(o => o.status !== "draft").length} icon={<ShoppingCart size={18} />} accent="navy" trend={`₹${(dealerOrders.reduce((s, o) => s + o.totalAmount, 0) / 100000).toFixed(1)}L value`} />
        </Link>
        <Link to="/dealer/payments">
          <StatCard label="Collected" value={`₹${(collectedAmount / 1000).toFixed(0)}K`} icon={<CreditCard size={18} />} accent="green" trendDirection="up" trend="From payments" />
        </Link>
        <Link to="/dealer/quotations">
          <StatCard label="Total Pipeline" value={`₹${(totalValue / 100000).toFixed(1)}L`} icon={<TrendingUp size={18} />} accent="gold" trend="Across all accounts" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Revenue Chart */}
        <div className="lg:col-span-2">
          <SummaryCard title="Account Values" actions={<span className="text-muted-foreground" style={{ fontSize: 12 }}>in ₹K</span>}>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={accountRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,74,0.06)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#6B7A90" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(27,42,74,0.1)", fontSize: 13 }} />
                  <Bar dataKey="value" fill="#EC6E63" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SummaryCard>
        </div>

        {/* Recent Orders */}
        <SummaryCard title="Recent Orders" actions={
          <Link to="/dealer/orders" className="text-gold-dark hover:underline" style={{ fontSize: 12, fontWeight: 500 }}>View All</Link>
        }>
          <div className="space-y-3">
            {dealerOrders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{o.id}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{getAccountById(o.accountId)?.company}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={o.status} size="xs" />
                  <p className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>₹{(o.totalAmount / 1000).toFixed(0)}K</p>
                </div>
              </div>
            ))}
          </div>
        </SummaryCard>
      </div>

      {/* Converted Orders Quick View */}
      {convertedOrders.filter(co => co.accountType === "dealer").length > 0 && (
        <div className="mt-6">
          <SummaryCard title="Converted Orders — Production Tracking" actions={
            <Link to="/dealer/converted-orders" className="text-gold-dark hover:underline flex items-center gap-1" style={{ fontSize: 12, fontWeight: 500 }}>
              View All <ArrowRight size={12} />
            </Link>
          }>
            <div className="space-y-3">
              {convertedOrders.filter(co => co.accountType === "dealer").map(co => (
                <Link key={co.id} to="/dealer/converted-orders" className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-gold/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-navy/8 flex items-center justify-center">
                      <Wrench size={16} className="text-navy" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 500 }}>{co.projectName}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{co.id} · {co.accountName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={co.productionStatus} size="xs" />
                    <p className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>₹{co.quotationAmount.toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </SummaryCard>
        </div>
      )}
    </PageShell>
  );
}