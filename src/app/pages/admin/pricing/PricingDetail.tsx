import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import {
  StatusBadge, Button, DetailField, SummaryCard, AlertCard,
  EmptyState, TabBar, Timeline
} from "../../../components/shared";
import { PricingFormModal } from "../../../components/pricing/PricingFormModal";
import { QuotationIntegrationBlock } from "../../../components/pricing/QuotationIntegrationBlock";
import {
  getPricingItemById, formatPricingUnit, formatItemType,
  type PricingItem,
} from "../../../data/pricing";
import {
  ArrowLeft, DollarSign, Edit, Tag, Package, Calendar,
  Ruler, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, XCircle, FileEdit
} from "lucide-react";

export function PricingDetail() {
  const { pricingId } = useParams();
  const navigate = useNavigate();
  const item = getPricingItemById(pricingId || "");
  const [activeTab, setActiveTab] = useState("overview");
  const [editModal, setEditModal] = useState(false);

  if (!item) {
    return (
      <PageShell title="Item Not Found">
        <EmptyState
          icon={<DollarSign size={32} />}
          title="Pricing item not found"
          message={`No pricing item found with ID "${pricingId}".`}
          action={<Button variant="primary" onClick={() => navigate("/admin/pricing/table")}>Back to Catalog</Button>}
        />
      </PageShell>
    );
  }

  const statusIcon = {
    active: <CheckCircle2 size={16} className="text-emerald-600" />,
    inactive: <XCircle size={16} className="text-red-500" />,
    draft: <FileEdit size={16} className="text-blue-600" />,
    discontinued: <Clock size={16} className="text-amber-600" />,
  }[item.status];

  // Calculate rate change stats
  const totalChanges = item.rateHistory.length;
  const lastChange = item.rateHistory[item.rateHistory.length - 1];
  const rateChangePercent = lastChange
    ? Math.round(((lastChange.newRate - lastChange.previousRate) / lastChange.previousRate) * 100)
    : 0;

  return (
    <>
      <PageShell
        title=""
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Edit size={14} />} onClick={() => setEditModal(true)}>Edit Item</Button>
          </div>
        }
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 13 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
          <Link to="/admin/pricing/table" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 13 }}>Pricing</Link>
          <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{item.id}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gold/15 flex items-center justify-center text-gold-dark shrink-0">
              <DollarSign size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 style={{ fontSize: 22, fontWeight: 600 }}>{item.itemName}</h1>
                <StatusBadge status={item.status} size="md" />
                <StatusBadge status={item.category} size="md" />
              </div>
              <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>
                {item.id} · {formatItemType(item.itemType)} · {formatPricingUnit(item.unit)}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {item.status === "discontinued" && (
          <AlertCard type="warning" title="Discontinued Item" message={`This item was discontinued on ${item.effectiveTo || item.updatedAt}. It will not appear in new quotations.`} />
        )}
        {item.status === "inactive" && (
          <AlertCard type="error" title="Inactive Item" message="This item is currently inactive and will not be available in the Quotation Builder." />
        )}
        {item.status === "draft" && (
          <AlertCard type="info" title="Draft Item" message="This item is in draft status. Activate it to make it available for quotations." />
        )}

        {/* Tabs */}
        <div className="mb-6 mt-4">
          <TabBar
            tabs={[
              { key: "overview", label: "Overview" },
              { key: "history", label: "Rate History", count: totalChanges },
              { key: "integration", label: "Integration" },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Item Summary */}
              <SummaryCard title="Item Summary">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  <DetailField label="Item Name" value={item.itemName} />
                  <DetailField label="Item ID" value={item.id} />
                  <DetailField label="Category" value={<StatusBadge status={item.category} />} />
                  <DetailField label="Item Type" value={formatItemType(item.itemType)} />
                  <DetailField label="Unit" value={formatPricingUnit(item.unit)} />
                  <DetailField label="Min Order Qty" value={item.minOrderQty.toString()} />
                </div>
              </SummaryCard>

              {/* Description */}
              <SummaryCard title="Description">
                <p style={{ fontSize: 14, lineHeight: 1.7 }}>{item.description}</p>
                {item.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-4 flex-wrap">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground" style={{ fontSize: 12 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </SummaryCard>

              {/* Dimensions */}
              {item.dimensions && (
                <SummaryCard title="Dimensions">
                  <div className="grid grid-cols-3 gap-5">
                    {item.dimensions.length !== undefined && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Ruler size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-muted-foreground" style={{ fontSize: 12 }}>Length</p>
                          <p style={{ fontSize: 16, fontWeight: 600 }}>{item.dimensions.length} mm</p>
                        </div>
                      </div>
                    )}
                    {item.dimensions.height !== undefined && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Ruler size={18} className="text-emerald-600 rotate-90" />
                        </div>
                        <div>
                          <p className="text-muted-foreground" style={{ fontSize: 12 }}>Height</p>
                          <p style={{ fontSize: 16, fontWeight: 600 }}>{item.dimensions.height} mm</p>
                        </div>
                      </div>
                    )}
                    {item.dimensions.thickness !== undefined && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Package size={18} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-muted-foreground" style={{ fontSize: 12 }}>Thickness</p>
                          <p style={{ fontSize: 16, fontWeight: 600 }}>{item.dimensions.thickness} mm</p>
                        </div>
                      </div>
                    )}
                  </div>
                </SummaryCard>
              )}

              {/* Effective Dates */}
              <SummaryCard title="Effective Dates">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <DetailField label="Effective From" value={item.effectiveFrom} />
                  <DetailField label="Effective To" value={item.effectiveTo || "No expiry"} />
                  <DetailField label="Created" value={item.createdAt} />
                  <DetailField label="Last Updated" value={`${item.updatedAt} by ${item.updatedBy}`} />
                </div>
              </SummaryCard>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Rate Card */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-gold/5">
                  <p style={{ fontSize: 14, fontWeight: 600 }}>Current Rate</p>
                </div>
                <div className="p-5">
                  <div className="text-center mb-4">
                    <p className="text-navy" style={{ fontSize: 32, fontWeight: 700 }}>
                      ₹{item.rate.toLocaleString("en-IN")}
                    </p>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: 13 }}>
                      per {formatPricingUnit(item.unit)}
                    </p>
                  </div>

                  {lastChange && (
                    <div className={`flex items-center justify-center gap-2 p-2.5 rounded-lg ${rateChangePercent > 0 ? "bg-red-50" : "bg-emerald-50"}`}>
                      {rateChangePercent > 0 ? (
                        <ArrowUpRight size={16} className="text-red-600" />
                      ) : (
                        <ArrowDownRight size={16} className="text-emerald-600" />
                      )}
                      <span className={rateChangePercent > 0 ? "text-red-700" : "text-emerald-700"} style={{ fontSize: 13, fontWeight: 500 }}>
                        {rateChangePercent > 0 ? "+" : ""}{rateChangePercent}% from ₹{lastChange.previousRate.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground" style={{ fontSize: 13 }}>Status</span>
                      <div className="flex items-center gap-1.5">
                        {statusIcon}
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground" style={{ fontSize: 13 }}>Rate Changes</span>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{totalChanges}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground" style={{ fontSize: 13 }}>Min Qty</span>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{item.minOrderQty}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button variant="gold" size="sm" className="w-full" icon={<Edit size={14} />} onClick={() => setEditModal(true)}>
                  Edit Pricing Item
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/admin/pricing/table")}>
                  Back to Catalog
                </Button>
              </div>

              {/* Change Summary */}
              {totalChanges > 0 && (
                <SummaryCard title="Last Change">
                  <div className="space-y-2">
                    <DetailField label="Date" value={lastChange!.changedAt} />
                    <DetailField label="Changed By" value={lastChange!.changedBy} />
                    <DetailField label="Reason" value={lastChange!.reason} />
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-muted-foreground line-through" style={{ fontSize: 13 }}>
                        ₹{lastChange!.previousRate.toLocaleString("en-IN")}
                      </span>
                      <span className="text-muted-foreground" style={{ fontSize: 13 }}>→</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        ₹{lastChange!.newRate.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </SummaryCard>
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="max-w-3xl space-y-6">
            <SummaryCard title={`Rate History (${totalChanges} changes)`}>
              {totalChanges === 0 ? (
                <EmptyState
                  icon={<TrendingUp size={24} />}
                  title="No rate changes"
                  message="This item's rate has not been changed since creation."
                />
              ) : (
                <div className="space-y-4">
                  {/* Current rate */}
                  <div className="p-4 rounded-lg border border-gold/40 bg-gold/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-gold-dark" />
                        <span style={{ fontSize: 14, fontWeight: 600 }}>Current Rate</span>
                        <span className="px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark" style={{ fontSize: 11, fontWeight: 500 }}>Active</span>
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 700 }}>₹{item.rate.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: 12 }}>Since {item.updatedAt} · Updated by {item.updatedBy}</p>
                  </div>

                  {/* Historical changes in reverse order */}
                  {item.rateHistory.slice().reverse().map((change, idx) => (
                    <div key={change.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${change.newRate > change.previousRate ? "bg-red-50" : "bg-emerald-50"}`}>
                            {change.newRate > change.previousRate ? (
                              <TrendingUp size={14} className="text-red-600" />
                            ) : (
                              <TrendingDown size={14} className="text-emerald-600" />
                            )}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{change.changedAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground line-through" style={{ fontSize: 13 }}>₹{change.previousRate.toLocaleString("en-IN")}</span>
                          <span className="text-muted-foreground">→</span>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>₹{change.newRate.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground" style={{ fontSize: 13 }}>{change.reason}</p>
                      <p className="text-muted-foreground mt-1" style={{ fontSize: 12 }}>Changed by {change.changedBy}</p>
                    </div>
                  ))}

                  {/* Original rate */}
                  <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Original Rate (Created)</span>
                      </div>
                      <span className="text-muted-foreground" style={{ fontSize: 14, fontWeight: 500 }}>
                        ₹{(item.rateHistory[0]?.previousRate || item.rate).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: 12 }}>Created on {item.createdAt}</p>
                  </div>
                </div>
              )}
            </SummaryCard>
          </div>
        )}

        {activeTab === "integration" && (
          <div className="max-w-2xl space-y-6">
            <QuotationIntegrationBlock />

            <SummaryCard title="Linked Quotation Items">
              <p className="text-muted-foreground" style={{ fontSize: 14, lineHeight: 1.6 }}>
                This pricing item (<strong className="text-foreground">{item.itemName}</strong>) at ₹{item.rate.toLocaleString("en-IN")} / {formatPricingUnit(item.unit)} is referenced
                in quotation line items across active orders. Rate changes here will only affect <strong className="text-foreground">future quotations</strong>.
              </p>
              <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-emerald-800" style={{ fontSize: 13, fontWeight: 500 }}>Currently in use</p>
                <p className="text-emerald-700 mt-0.5" style={{ fontSize: 12 }}>
                  This item appears in quotation line items across multiple active orders. Existing quotation amounts remain unchanged.
                </p>
              </div>
            </SummaryCard>
          </div>
        )}
      </PageShell>

      <PricingFormModal open={editModal} onClose={() => setEditModal(false)} editItem={item} />
    </>
  );
}
