import { useState } from "react";
import { PageShell } from "../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, Button, Drawer, DetailField, SummaryCard, Tooltip
} from "../../components/shared";
import { accounts, orders, getUserById, getOrdersByAccountId, getSalespersonById } from "../../data";
import { PenTool, Building2, Download } from "lucide-react";
import { handleExport } from "../../components/shared/GlobalModals";
import { toast } from "sonner";

const archProjects = accounts.filter(a => a.architectId === "U005" || a.architectId === "U006");

export function ArchitectProjects() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof accounts[0] | null>(null);

  const filtered = archProjects.filter((p) => {
    if (search && !p.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <PageShell
      title="Projects"
      subtitle={`${archProjects.length} assigned projects · ₹${(archProjects.reduce((s, p) => s + p.totalValue, 0) / 100000).toFixed(1)}L total value`}
      actions={
        <Tooltip text="Export project list">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Projects")}>Export</Button>
        </Tooltip>
      }
    >
      <div className="mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search projects..."
          filters={[
            {
              label: "All Statuses",
              value: "",
              onChange: () => {},
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
          ]}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((p) => {
          const projOrders = getOrdersByAccountId(p.id);
          return (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className="bg-card rounded-xl border border-border p-5 hover:border-violet-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                    <PenTool size={18} className="text-violet-600" />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{p.company}</p>
                    <p className="text-muted-foreground" style={{ fontSize: 12.5 }}>{p.contactName} · {p.city}</p>
                  </div>
                </div>
                <StatusBadge status={p.status} size="sm" />
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 11 }}>Value</p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>₹{(p.totalValue / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 11 }}>Orders</p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{projOrders.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 11 }}>Dealer</p>
                  <p style={{ fontSize: 13 }}>{p.dealerId ? getUserById(p.dealerId)?.name || "—" : "—"}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.company || ""}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                <Building2 size={20} className="text-violet-600" />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 16, fontWeight: 600 }}>{selected.company}</p>
                <p className="text-muted-foreground" style={{ fontSize: 13 }}>{selected.city}</p>
              </div>
              <StatusBadge status={selected.status} size="md" />
            </div>

            <SummaryCard title="Project Details">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Client" value={selected.contactName} />
                <DetailField label="Email" value={selected.email} />
                <DetailField label="Phone" value={selected.phone} />
                <DetailField label="Value" value={`₹${selected.totalValue.toLocaleString("en-IN")}`} />
                <DetailField label="Dealer" value={selected.dealerId ? getUserById(selected.dealerId)?.name || "—" : "None"} />
                <DetailField label="Salesperson" value={getSalespersonById(selected.salespersonId)?.name || "—"} />
              </div>
            </SummaryCard>

            <SummaryCard title={`Orders (${getOrdersByAccountId(selected.id).length})`}>
              <div className="space-y-2">
                {getOrdersByAccountId(selected.id).map((o) => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{o.id} — {o.items}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>Delivery: {o.expectedDelivery}</p>
                    </div>
                    <StatusBadge status={o.status} size="xs" />
                  </div>
                ))}
              </div>
            </SummaryCard>

            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info("Opening specifications...", { description: `Viewing specs for ${selected.projectName}` })}>View Specifications</Button>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}