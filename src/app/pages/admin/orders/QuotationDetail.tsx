import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import {
  StatusBadge, Button, DetailField, SummaryCard, AlertCard,
  EmptyState, TabBar
} from "../../../components/shared";
import { PaymentBlock } from "../../../components/orders/PaymentBlock";
import { QuotationOutcomeModal } from "../../../components/orders/OrderModals";
import { getProjectQuotationById, getProjectOrderById, formatProjectCategory, type ProjectQuotation, type QuotationLineItem } from "../../../data/orders";
import { getConvertedOrderByQuotationId } from "../../../data/operations";
import { financeRecords } from "../../../data/finance";
import {
  ArrowLeft, FileText, Edit, Send, Download, Plus, CheckCircle2,
  XCircle, Pause, Clock, GitBranch, ExternalLink, ArrowRight, ShoppingCart,
  Wrench, DollarSign,
} from "lucide-react";

import { handleDownloadPDF, handleSendAction } from "../../../components/shared/GlobalModals";
import { toast } from "sonner";

export function QuotationDetail() {
  const { quotationId } = useParams();
  const navigate = useNavigate();
  const quotation = getProjectQuotationById(quotationId || "");
  const order = quotation ? getProjectOrderById(quotation.orderId) : null;
  const convertedOrder = quotation ? getConvertedOrderByQuotationId(quotation.id) : null;
  const financeRecord = financeRecords.find(fr => fr.quotationId === quotation?.id);

  const [activeTab, setActiveTab] = useState("items");
  const [lostModal, setLostModal] = useState(false);
  const [holdModal, setHoldModal] = useState(false);

  if (!quotation) {
    return (
      <PageShell title="Quotation Not Found">
        <EmptyState
          icon={<FileText size={32} />}
          title="Quotation not found"
          message={`No quotation found with ID "${quotationId}".`}
          action={<Button variant="primary" onClick={() => navigate("/admin/orders/table")}>Back to Orders</Button>}
        />
      </PageShell>
    );
  }

  const activeVersion = quotation.versions.find(v => v.isActive) || quotation.versions[quotation.versions.length - 1];
  const lineItems = activeVersion.lineItems;
  const subtotal = lineItems.reduce((s, li) => s + li.amount, 0);
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  return (
    <>
      <PageShell
        title=""
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {quotation.outcome !== "won" && quotation.outcome !== "lost" && (
              <>
                <Button variant="outline" size="sm" icon={<Edit size={14} />} onClick={() => navigate(`/admin/orders/quotation/new?orderId=${quotation.orderId}`)}>Revise</Button>
                <Button variant="gold" size="sm" icon={<CheckCircle2 size={14} />} onClick={() => toast.success("Quotation marked as Won!", { description: `${quotation.id} has been marked as won.` })}>Mark as Won</Button>
                <Button variant="outline" size="sm" icon={<XCircle size={14} />} onClick={() => setLostModal(true)}>Mark Lost</Button>
                <Button variant="outline" size="sm" icon={<Pause size={14} />} onClick={() => setHoldModal(true)}>Hold</Button>
              </>
            )}
            <Button variant="outline" size="sm" icon={<Send size={14} />} onClick={() => handleSendAction(`Quotation ${quotation.id}`)}>Resend</Button>
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleDownloadPDF(`Quotation ${quotation.id}`)}>Download PDF</Button>
          </div>
        }
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 13 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
          <Link to="/admin/orders/table" className="text-muted-foreground hover:text-foreground" style={{ fontSize: 13 }}>Orders</Link>
          {order && (
            <>
              <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
              <Link to={`/admin/orders/${order.id}`} className="text-muted-foreground hover:text-foreground" style={{ fontSize: 13 }}>{order.id}</Link>
            </>
          )}
          <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{quotation.id}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gold/15 flex items-center justify-center text-gold-dark shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 style={{ fontSize: 22, fontWeight: 600 }}>{quotation.projectName}</h1>
                <StatusBadge status={quotation.outcome} size="md" />
              </div>
              <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>
                {quotation.id} · Version {quotation.currentVersion} · {order?.accountName || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {quotation.outcome === "lost" && quotation.lostReason && (
          <AlertCard type="error" title="Quotation Lost" message={`Reason: ${quotation.lostReason}`} />
        )}
        {quotation.outcome === "hold" && quotation.holdReason && (
          <AlertCard type="warning" title="Quotation on Hold" message={`Reason: ${quotation.holdReason}`} />
        )}
        {quotation.outcome === "won" && (
          <AlertCard type="success" title="Quotation Won" message={`Won on ${quotation.wonAt}. Order is in progress.`} />
        )}

        {/* Tabs */}
        <div className="mb-6 mt-4">
          <TabBar
            tabs={[
              { key: "items", label: "Line Items", count: lineItems.length },
              { key: "versions", label: "Versions", count: quotation.versions.length },
              { key: "payment", label: "Payment" },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {activeTab === "items" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              {/* Context Info */}
              <SummaryCard title="Project & Account">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {order && (
                    <>
                      <div>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>Order</p>
                        <Link to={`/admin/orders/${order.id}`} className="text-navy hover:text-gold transition-colors flex items-center gap-1" style={{ fontSize: 13, fontWeight: 500 }}>
                          {order.id} <ExternalLink size={11} />
                        </Link>
                      </div>
                      <div>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>Account</p>
                        <Link to={`/admin/crm/accounts/${order.accountId}`} className="text-navy hover:text-gold transition-colors flex items-center gap-1" style={{ fontSize: 13, fontWeight: 500 }}>
                          {order.accountName} <ExternalLink size={11} />
                        </Link>
                      </div>
                      <div>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>Category</p>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{formatProjectCategory(order.projectCategory)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground" style={{ fontSize: 12 }}>Salesperson</p>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{order.salespersonName}</p>
                      </div>
                    </>
                  )}
                </div>
              </SummaryCard>

              {/* Line Items Table */}
              <SummaryCard title={`Line Items — Version ${activeVersion.version}`}>
                <div className="overflow-x-auto -mx-5">
                  <table className="w-full" style={{ fontSize: 12.5, minWidth: 800 }}>
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["S.No", "Item Name", "Category", "L", "H", "T", "Unit", "Area", "Qty", "Rate (₹)", "Amount (₹)"].map(h => (
                          <th key={h} className="text-left px-3 py-2.5 text-muted-foreground whitespace-nowrap" style={{ fontWeight: 500, fontSize: 11 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {lineItems.map(li => (
                        <tr key={li.id} className="hover:bg-gold/4">
                          <td className="px-3 py-2.5 text-muted-foreground">{li.serialNo}</td>
                          <td className="px-3 py-2.5" style={{ fontWeight: 500 }}>{li.itemName}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{li.itemCategory}</td>
                          <td className="px-3 py-2.5 text-right">{li.length || "—"}</td>
                          <td className="px-3 py-2.5 text-right">{li.height || "—"}</td>
                          <td className="px-3 py-2.5 text-right">{li.thickness || "—"}</td>
                          <td className="px-3 py-2.5">{li.unit}</td>
                          <td className="px-3 py-2.5 text-right">{li.area > 0 ? li.area.toFixed(3) : "—"}</td>
                          <td className="px-3 py-2.5 text-right">{li.quantity}</td>
                          <td className="px-3 py-2.5 text-right">₹{li.rate.toLocaleString("en-IN")}</td>
                          <td className="px-3 py-2.5 text-right" style={{ fontWeight: 500 }}>₹{li.amount.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border">
                        <td colSpan={10} className="px-3 py-2.5 text-right text-muted-foreground" style={{ fontWeight: 500 }}>Subtotal</td>
                        <td className="px-3 py-2.5 text-right" style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr>
                        <td colSpan={10} className="px-3 py-2 text-right text-muted-foreground" style={{ fontSize: 12 }}>GST (18%)</td>
                        <td className="px-3 py-2 text-right" style={{ fontSize: 12 }}>₹{gst.toLocaleString("en-IN")}</td>
                      </tr>
                      <tr className="bg-navy/5">
                        <td colSpan={10} className="px-3 py-3 text-right" style={{ fontWeight: 600, fontSize: 14 }}>Grand Total</td>
                        <td className="px-3 py-3 text-right text-navy" style={{ fontWeight: 700, fontSize: 16 }}>₹{grandTotal.toLocaleString("en-IN")}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </SummaryCard>

              {/* Remarks */}
              <SummaryCard title="Remarks & History">
                <p style={{ fontSize: 14, lineHeight: 1.6 }}>{quotation.remarks || activeVersion.remarks}</p>
                {quotation.sentAt && <DetailField label="Sent On" value={quotation.sentAt} className="mt-3" />}
                {quotation.wonAt && <DetailField label="Won On" value={quotation.wonAt} className="mt-2" />}
                {quotation.lostAt && <DetailField label="Lost On" value={quotation.lostAt} className="mt-2" />}
              </SummaryCard>
            </div>

            {/* Right column — totals & status */}
            <div className="space-y-6">
              <SummaryCard title="Quotation Summary">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground" style={{ fontSize: 13 }}>Status</span>
                    <StatusBadge status={quotation.outcome} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground" style={{ fontSize: 13 }}>Version</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>v{quotation.currentVersion}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground" style={{ fontSize: 13 }}>Items</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{lineItems.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground" style={{ fontSize: 13 }}>Amount</span>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>₹{quotation.quotationAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground" style={{ fontSize: 13 }}>Created</span>
                    <span style={{ fontSize: 13 }}>{quotation.createdAt}</span>
                  </div>
                </div>
              </SummaryCard>

              {order && (
                <div
                  className="p-4 rounded-xl border border-border hover:border-gold/30 hover:bg-gold/4 cursor-pointer transition-all"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart size={16} className="text-navy" />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Linked Order</span>
                  </div>
                  <p style={{ fontSize: 13 }}>{order.id} — {order.projectName}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-gold-dark" style={{ fontSize: 12, fontWeight: 500 }}>
                    View Order <ArrowRight size={12} />
                  </div>
                </div>
              )}

              {/* Linked Converted Order */}
              {convertedOrder && (
                <Link to={`/admin/operations/${convertedOrder.id}`} className="block">
                  <div className="p-4 rounded-xl border border-border hover:border-gold/30 hover:bg-gold/4 cursor-pointer transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench size={16} className="text-navy" />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Converted Order</span>
                    </div>
                    <p style={{ fontSize: 13 }}>{convertedOrder.id} — {convertedOrder.projectName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={convertedOrder.productionStatus} size="xs" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-gold-dark" style={{ fontSize: 12, fontWeight: 500 }}>
                      View Operations <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              )}

              {/* Linked Finance Record */}
              {financeRecord && (
                <Link to={`/admin/finance/ledger/${financeRecord.id}`} className="block">
                  <div className="p-4 rounded-xl border border-border hover:border-gold/30 hover:bg-gold/4 cursor-pointer transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={16} className="text-emerald-600" />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Finance Ledger</span>
                    </div>
                    <p className="text-emerald-600" style={{ fontSize: 13, fontWeight: 600 }}>₹{financeRecord.receivedAmount.toLocaleString("en-IN")} received</p>
                    <p className="text-red-600" style={{ fontSize: 12 }}>₹{financeRecord.balanceAmount.toLocaleString("en-IN")} pending</p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-gold-dark" style={{ fontSize: 12, fontWeight: 500 }}>
                      View Finance <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              )}

              <div className="space-y-2">
                {quotation.outcome !== "won" && quotation.outcome !== "lost" && (
                  <Button variant="gold" size="sm" className="w-full" icon={<CheckCircle2 size={14} />} onClick={() => toast.success("Quotation marked as Won!", { description: `${quotation.id} has been marked as won.` })}>Mark as Won</Button>
                )}
                <Button variant="outline" size="sm" className="w-full" icon={<Plus size={14} />} onClick={() => navigate(`/admin/orders/quotation/new?orderId=${quotation.orderId}`)}>Create New Version</Button>
                <Button variant="outline" size="sm" className="w-full" icon={<Download size={14} />} onClick={() => handleDownloadPDF(`Quotation ${quotation.id}`)}>Download PDF</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "versions" && (
          <div className="max-w-3xl space-y-4">
            <SummaryCard
              title="Version History"
              actions={<Button variant="outline" size="sm" icon={<Plus size={13} />} onClick={() => navigate(`/admin/orders/quotation/new?orderId=${quotation.orderId}`)}>New Version</Button>}
            >
              {quotation.versions.slice().reverse().map(v => (
                <div key={v.version} className={`p-4 rounded-lg border ${v.isActive ? "border-gold/40 bg-gold/5" : "border-border"} mb-3 last:mb-0`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <GitBranch size={14} className={v.isActive ? "text-gold-dark" : "text-muted-foreground"} />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Version {v.version}</span>
                      {v.isActive && <span className="px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark" style={{ fontSize: 11, fontWeight: 500 }}>Active</span>}
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>₹{v.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: 13 }}>{v.remarks}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>{v.createdAt}</span>
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>·</span>
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>{v.createdBy}</span>
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>·</span>
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>{v.lineItems.length} items</span>
                  </div>
                </div>
              ))}
            </SummaryCard>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-blue-800" style={{ fontSize: 13, fontWeight: 500 }}>Compare Versions</p>
              <p className="text-blue-700 mt-0.5" style={{ fontSize: 12 }}>Select two versions to compare changes in line items and pricing.</p>
              <Button variant="outline" size="sm" className="mt-2" disabled>Compare (Coming Soon)</Button>
            </div>
          </div>
        )}

        {activeTab === "payment" && (
          <div className="max-w-lg">
            <PaymentBlock
              quotationAmount={quotation.quotationAmount}
              receivedAmount={quotation.receivedAmount}
              balanceAmount={quotation.balanceAmount}
              paymentStatus={quotation.paymentStatus}
            />
          </div>
        )}
      </PageShell>

      <QuotationOutcomeModal open={lostModal} onClose={() => setLostModal(false)} quotation={quotation} type="lost" />
      <QuotationOutcomeModal open={holdModal} onClose={() => setHoldModal(false)} quotation={quotation} type="hold" />
    </>
  );
}