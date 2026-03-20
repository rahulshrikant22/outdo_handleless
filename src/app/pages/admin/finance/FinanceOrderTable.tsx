import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { StatusBadge, FilterBar, Button, DataTable } from "../../../components/shared";
import {
  financeRecords, getAllPayments, inr, collectionHealthLabels, stageLabels,
  type FinanceRecord,
} from "../../../data/finance";
import {
  ArrowLeft, ArrowRight, DollarSign, ChevronRight, Download, Receipt,
  Eye, FileText, CheckCircle2, AlertTriangle,
} from "lucide-react";

import { handleExport } from "../../../components/shared/GlobalModals";
import { toast } from "sonner";

export function FinanceOrderTable() {
  const [search, setSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tab, setTab] = useState<"orders" | "receipts">("orders");
  const navigate = useNavigate();

  const allPayments = getAllPayments();

  // Filter finance records
  const filtered = financeRecords.filter(r => {
    const matchesSearch = !search ||
      r.projectName.toLowerCase().includes(search.toLowerCase()) ||
      r.accountName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchesHealth = !healthFilter || r.collectionHealth === healthFilter;
    const matchesStatus = !statusFilter || r.paymentStatus === statusFilter;
    return matchesSearch && matchesHealth && matchesStatus;
  });

  // Filter payments
  const filteredPayments = allPayments.filter(p => {
    if (!search) return true;
    return p.projectName.toLowerCase().includes(search.toLowerCase()) ||
           p.accountName.toLowerCase().includes(search.toLowerCase()) ||
           p.reference.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <PageShell
      title="Finance Order Table"
      subtitle="All converted orders with financial details, receipts and payment tracking"
      actions={
        <div className="flex gap-2">
          <Link to="/admin/finance/dashboard">
            <Button variant="outline" size="sm" icon={<ArrowLeft size={14} />}>Dashboard</Button>
          </Link>
          <Button variant="gold" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Finance Orders")}>Export</Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 rounded-md transition-all ${
              tab === "orders" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            Finance Orders ({financeRecords.length})
          </button>
          <button
            onClick={() => setTab("receipts")}
            className={`px-4 py-2 rounded-md transition-all ${
              tab === "receipts" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            Receipt History ({allPayments.length})
          </button>
        </div>

        {/* Filters */}
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={tab === "orders" ? "Search projects, accounts..." : "Search receipts, references..."}
          filters={tab === "orders" ? [
            {
              label: "Health",
              value: healthFilter,
              onChange: setHealthFilter,
              options: [
                { label: "On Track", value: "on_track" },
                { label: "At Risk", value: "at_risk" },
                { label: "Overdue", value: "overdue" },
                { label: "Critical", value: "critical" },
              ],
            },
            {
              label: "Payment Status",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: "Not Started", value: "not_started" },
                { label: "Advance Received", value: "advance_received" },
                { label: "Partial", value: "partial" },
                { label: "Full", value: "full" },
                { label: "Overdue", value: "overdue" },
              ],
            },
          ] : []}
        />

        {/* Finance Orders Table */}
        {tab === "orders" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Finance ID</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Project / Account</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Type</th>
                    <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Order Value</th>
                    <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Received</th>
                    <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Balance</th>
                    <th className="text-center px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Collection %</th>
                    <th className="text-center px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Health</th>
                    <th className="text-center px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Payment Status</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Next Milestone</th>
                    <th className="text-center px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(r => {
                    const pct = r.quotationAmount > 0 ? Math.round((r.receivedAmount / r.quotationAmount) * 100) : 0;
                    return (
                      <tr key={r.id} className="hover:bg-gold/4 transition-colors cursor-pointer" onClick={() => navigate(`/admin/finance/ledger/${r.id}`)}>
                        <td className="px-4 py-3">
                          <span className="text-navy" style={{ fontSize: 13, fontWeight: 600 }}>{r.id}</span>
                          <p className="text-muted-foreground" style={{ fontSize: 11 }}>{r.convertedOrderId}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p style={{ fontSize: 13.5, fontWeight: 500 }}>{r.projectName}</p>
                          <p className="text-muted-foreground" style={{ fontSize: 12 }}>{r.accountName} — {r.city}</p>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={r.accountType} size="xs" />
                        </td>
                        <td className="px-4 py-3 text-right" style={{ fontSize: 13.5, fontWeight: 600 }}>{inr(r.quotationAmount)}</td>
                        <td className="px-4 py-3 text-right text-emerald-600" style={{ fontSize: 13.5, fontWeight: 600 }}>{inr(r.receivedAmount)}</td>
                        <td className="px-4 py-3 text-right text-red-600" style={{ fontSize: 13.5, fontWeight: 600 }}>{inr(r.balanceAmount)}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-16 bg-gray-100 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500 }}>{pct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge status={r.collectionHealth} size="xs" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge status={r.paymentStatus} size="xs" />
                        </td>
                        <td className="px-4 py-3">
                          <p style={{ fontSize: 12 }}>{r.nextMilestonePayment}</p>
                          <p className="text-navy" style={{ fontSize: 12, fontWeight: 600 }}>{inr(r.nextMilestoneAmount)}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link to={`/admin/finance/ledger/${r.id}`} onClick={e => e.stopPropagation()}>
                            <button className="w-8 h-8 rounded-lg border border-border hover:bg-accent flex items-center justify-center transition-colors">
                              <Eye size={14} className="text-muted-foreground" />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground" style={{ fontSize: 14 }}>
                No finance records match filters
              </div>
            )}
          </div>
        )}

        {/* Receipt History Table */}
        {tab === "receipts" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Receipt ID</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Project / Account</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Date</th>
                    <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Amount</th>
                    <th className="text-center px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Method</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Reference</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Stage</th>
                    <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Received By</th>
                    <th className="text-center px-4 py-3 text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPayments.map(p => (
                    <tr key={p.id} className="hover:bg-gold/4 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-navy" style={{ fontSize: 13, fontWeight: 600 }}>{p.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{p.projectName}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>{p.accountName}</p>
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
                      <td className="px-4 py-3 text-center">
                        {p.proofUploaded ? (
                          <button className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-800 transition-colors" style={{ fontSize: 12 }} onClick={() => toast.info("Opening proof document...", { description: `Payment ${p.id} proof` })}>
                            <CheckCircle2 size={14} />
                            <span>View</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground" style={{ fontSize: 12 }}>
                            <AlertTriangle size={14} />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-navy/5 border border-navy/10 text-center">
            <p className="text-muted-foreground" style={{ fontSize: 12 }}>Total Orders</p>
            <p className="text-navy" style={{ fontSize: 22, fontWeight: 700 }}>{financeRecords.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-emerald-700" style={{ fontSize: 12 }}>Total Collected</p>
            <p className="text-emerald-800" style={{ fontSize: 22, fontWeight: 700 }}>
              {inr(financeRecords.reduce((s, r) => s + r.receivedAmount, 0))}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
            <p className="text-red-700" style={{ fontSize: 12 }}>Total Pending</p>
            <p className="text-red-800" style={{ fontSize: 22, fontWeight: 700 }}>
              {inr(financeRecords.reduce((s, r) => s + r.balanceAmount, 0))}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-center">
            <p className="text-gold-dark" style={{ fontSize: 12 }}>Total Receipts</p>
            <p className="text-navy" style={{ fontSize: 22, fontWeight: 700 }}>{allPayments.length}</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}