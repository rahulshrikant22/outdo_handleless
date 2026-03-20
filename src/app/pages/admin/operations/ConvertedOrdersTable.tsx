import { useState } from "react";
import { useNavigate } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { FilterBar, StatusBadge, Button, Pagination } from "../../../components/shared";
import {
  convertedOrders, priorityLabels, productionStatusLabels, dispatchStatusLabels,
  type ConvertedOrder,
} from "../../../data/operations";
import { Download, ArrowLeft, Eye } from "lucide-react";
import { handleExport } from "../../../components/shared/GlobalModals";

export function ConvertedOrdersTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [productionFilter, setProductionFilter] = useState("");
  const [dispatchFilter, setDispatchFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = convertedOrders.filter(co => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      co.id.toLowerCase().includes(q) ||
      co.projectName.toLowerCase().includes(q) ||
      co.accountName.toLowerCase().includes(q) ||
      co.city.toLowerCase().includes(q) ||
      co.salespersonName.toLowerCase().includes(q) ||
      co.currentPendingWith.toLowerCase().includes(q);
    const matchPriority = !priorityFilter || co.priority === priorityFilter;
    const matchProduction = !productionFilter || co.productionStatus === productionFilter;
    const matchDispatch = !dispatchFilter || co.dispatchStatus === dispatchFilter;
    const matchPayment = !paymentFilter || co.paymentStatus === paymentFilter;
    return matchSearch && matchPriority && matchProduction && matchDispatch && matchPayment;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const getRoleUser = (co: ConvertedOrder, role: string) => {
    const r = co.roles.find(r => r.role === role);
    return r ? r.userName : "—";
  };

  return (
    <PageShell
      title="Converted Orders Table"
      subtitle={`${filtered.length} of ${convertedOrders.length} orders`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate("/admin/operations/dashboard")}>
            Dashboard
          </Button>
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Converted Orders")}>Export</Button>
        </div>
      }
    >
      {/* Filters */}
      <div className="mb-5">
        <FilterBar
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Search orders, projects, accounts..."
          filters={[
            {
              label: "Priority",
              options: Object.entries(priorityLabels).map(([k, v]) => ({ label: v, value: k })),
              value: priorityFilter,
              onChange: (v) => { setPriorityFilter(v); setPage(1); },
            },
            {
              label: "Production",
              options: Object.entries(productionStatusLabels).map(([k, v]) => ({ label: v, value: k })),
              value: productionFilter,
              onChange: (v) => { setProductionFilter(v); setPage(1); },
            },
            {
              label: "Dispatch",
              options: Object.entries(dispatchStatusLabels).map(([k, v]) => ({ label: v, value: k })),
              value: dispatchFilter,
              onChange: (v) => { setDispatchFilter(v); setPage(1); },
            },
            {
              label: "Payment",
              options: [
                { label: "Not Started", value: "not_started" },
                { label: "Advance Received", value: "advance_received" },
                { label: "Partial", value: "partial" },
                { label: "Full", value: "full" },
                { label: "Overdue", value: "overdue" },
              ],
              value: paymentFilter,
              onChange: (v) => { setPaymentFilter(v); setPage(1); },
            },
          ]}
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  "CO ID", "Project Name", "Account", "Type", "City",
                  "Salesperson", "Project Mgr", "Cutlist Designer",
                  "Production Mgr", "Finance Mgr",
                  "Payment", "Production", "Dispatch",
                  "Pending With", "Priority",
                  "Quotation Amt", "Received", "Balance",
                ].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-muted-foreground whitespace-nowrap" style={{ fontSize: 11.5, fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.map(co => (
                <tr
                  key={co.id}
                  className="cursor-pointer hover:bg-gold/4 transition-colors"
                  onClick={() => navigate(`/admin/operations/${co.id}`)}
                >
                  <td className="px-3 py-3" style={{ fontSize: 13, fontWeight: 600 }}>{co.id}</td>
                  <td className="px-3 py-3" style={{ fontSize: 13 }}>
                    <div className="min-w-[140px]">{co.projectName}</div>
                  </td>
                  <td className="px-3 py-3" style={{ fontSize: 13 }}>{co.accountName}</td>
                  <td className="px-3 py-3"><StatusBadge status={co.accountType} size="xs" /></td>
                  <td className="px-3 py-3 text-muted-foreground" style={{ fontSize: 12.5 }}>{co.city}</td>
                  <td className="px-3 py-3" style={{ fontSize: 12.5 }}>{co.salespersonName}</td>
                  <td className="px-3 py-3" style={{ fontSize: 12.5 }}>{getRoleUser(co, "project_manager")}</td>
                  <td className="px-3 py-3" style={{ fontSize: 12.5 }}>{getRoleUser(co, "cutlist_designer")}</td>
                  <td className="px-3 py-3" style={{ fontSize: 12.5 }}>{getRoleUser(co, "production_manager")}</td>
                  <td className="px-3 py-3" style={{ fontSize: 12.5 }}>{getRoleUser(co, "finance_manager")}</td>
                  <td className="px-3 py-3"><StatusBadge status={co.paymentStatus} size="xs" /></td>
                  <td className="px-3 py-3"><StatusBadge status={co.productionStatus} size="xs" /></td>
                  <td className="px-3 py-3"><StatusBadge status={co.dispatchStatus} size="xs" /></td>
                  <td className="px-3 py-3 text-muted-foreground" style={{ fontSize: 12 }}>{co.currentPendingWith}</td>
                  <td className="px-3 py-3"><StatusBadge status={co.priority} size="xs" /></td>
                  <td className="px-3 py-3" style={{ fontSize: 13, fontWeight: 600 }}>₹{co.quotationAmount.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-3 text-emerald-700" style={{ fontSize: 13, fontWeight: 500 }}>₹{co.receivedAmount.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-3 text-red-700" style={{ fontSize: 13, fontWeight: 500 }}>₹{co.balanceAmount.toLocaleString("en-IN")}</td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={18} className="px-4 py-12 text-center text-muted-foreground" style={{ fontSize: 14 }}>
                    No converted orders match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </PageShell>
  );
}