import { PageShell } from "../../components/layout/PageShell";
import { StatusBadge, SummaryCard, Button, TabBar } from "../../components/shared";
import { orders, tasks, getAccountById, getTasksByOrderId } from "../../data";
import { useState } from "react";
import { Factory, ArrowRight } from "lucide-react";

const stages = ["Material Procurement", "CNC Cutting", "Edge Banding", "Finishing", "Quality Check", "Packaging"];

const productionOrders = orders.filter(o => o.status === "in_production" || o.status === "confirmed");

export function FactoryProduction() {
  const [view, setView] = useState("pipeline");

  return (
    <PageShell title="Production" subtitle="Production line management and tracking">
      <TabBar
        tabs={[
          { key: "pipeline", label: "Pipeline View" },
          { key: "stages", label: "Production Stages" },
        ]}
        active={view}
        onChange={setView}
      />

      <div className="mt-6">
        {view === "pipeline" && (
          <div className="space-y-4">
            {productionOrders.map((order) => {
              const acc = getAccountById(order.accountId);
              const orderTasks = getTasksByOrderId(order.id);
              const completed = orderTasks.filter(t => t.status === "completed").length;
              const progress = orderTasks.length > 0 ? Math.round((completed / orderTasks.length) * 100) : 0;

              return (
                <div key={order.id} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Factory size={18} className="text-amber-600" />
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{order.id} — {acc?.company}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 12.5 }}>{order.items}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={order.status} size="sm" />
                      <p className="text-muted-foreground mt-1" style={{ fontSize: 11.5 }}>Delivery: {order.expectedDelivery}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground" style={{ fontSize: 12 }}>Overall Progress</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{progress}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${progress}%`,
                          background: "linear-gradient(90deg, #EC6E63, #1B2A4A)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Task chips */}
                  <div className="flex flex-wrap gap-2">
                    {orderTasks.map((t) => (
                      <div
                        key={t.id}
                        className={`px-3 py-1.5 rounded-lg border ${
                          t.status === "completed"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : t.status === "in_progress"
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-gray-50 border-gray-200 text-gray-600"
                        }`}
                        style={{ fontSize: 12, fontWeight: 500 }}
                      >
                        {t.title.split("—")[0].trim()}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "stages" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
              {stages.map((stage, idx) => (
                <div key={stage} className="flex items-center gap-2 shrink-0">
                  <div className="px-4 py-3 rounded-xl bg-card border border-border text-center min-w-[140px]">
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{stage}</p>
                    <p className="text-muted-foreground mt-0.5" style={{ fontSize: 11 }}>Stage {idx + 1}</p>
                  </div>
                  {idx < stages.length - 1 && <ArrowRight size={16} className="text-border" />}
                </div>
              ))}
            </div>

            <SummaryCard title="Capacity Overview">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { stage: "CNC Cutting", load: 75, orders: 2 },
                  { stage: "Edge Banding", load: 30, orders: 1 },
                  { stage: "Finishing", load: 0, orders: 0 },
                  { stage: "Quality Check", load: 0, orders: 0 },
                  { stage: "Packaging", load: 0, orders: 0 },
                  { stage: "Dispatch", load: 50, orders: 1 },
                ].map((s) => (
                  <div key={s.stage} className="p-3 rounded-lg bg-background border border-border">
                    <p style={{ fontSize: 12.5, fontWeight: 500 }}>{s.stage}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.load}%`,
                            backgroundColor: s.load > 70 ? "#F59E0B" : s.load > 40 ? "#3B82F6" : "#10B981",
                          }}
                        />
                      </div>
                      <span className="text-muted-foreground" style={{ fontSize: 11 }}>{s.load}%</span>
                    </div>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: 11 }}>{s.orders} orders</p>
                  </div>
                ))}
              </div>
            </SummaryCard>
          </div>
        )}
      </div>
    </PageShell>
  );
}