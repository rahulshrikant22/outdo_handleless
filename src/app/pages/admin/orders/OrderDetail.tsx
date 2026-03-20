import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import {
  StatusBadge, Button, DetailField, SummaryCard, AlertCard,
  EmptyState, TabBar, Timeline
} from "../../../components/shared";
import { PaymentBlock } from "../../../components/orders/PaymentBlock";
import { FileUploadArea } from "../../../components/orders/FileUploadArea";
import { DrawingStatusBlock } from "../../../components/orders/DrawingStatus";
import { getProjectOrderById, getQuotationByOrderId, formatProjectCategory, type DrawingStatus } from "../../../data/orders";
import { getConvertedOrderByOrderId } from "../../../data/operations";
import { financeRecords } from "../../../data/finance";
import {
  ArrowLeft, ShoppingCart, Building2, FileText, Edit, Plus,
  Calendar, MapPin, User, ExternalLink, CheckCircle2, Clock,
  Wrench, DollarSign, ArrowRight,
} from "lucide-react";
import { EditOrderModal } from "../../../components/shared/GlobalModals";

export function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = getProjectOrderById(orderId || "");
  const quotation = order ? getQuotationByOrderId(order.id) : null;
  const convertedOrder = order ? getConvertedOrderByOrderId(order.id) : null;
  const financeRecord = financeRecords.find(fr => fr.orderId === order?.id);
  const [activeTab, setActiveTab] = useState("overview");
  const [editOrderOpen, setEditOrderOpen] = useState(false);

  if (!order) {
    return (
      <PageShell title="Order Not Found">
        <EmptyState
          icon={<ShoppingCart size={32} />}
          title="Order not found"
          message={`No order found with ID "${orderId}".`}
          action={<Button variant="primary" onClick={() => navigate("/admin/orders/table")}>Back to Orders</Button>}
        />
      </PageShell>
    );
  }

  // Get primary drawing status from files
  const drawingFile = order.files.find(f => f.drawingStatus);
  const primaryDrawingStatus: DrawingStatus = drawingFile?.drawingStatus || "submitted";

  return (
    <PageShell
      title=""
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" icon={<Edit size={14} />} onClick={() => setEditOrderOpen(true)}>Edit Order</Button>
          {!quotation ? (
            <Button variant="gold" size="sm" icon={<Plus size={14} />} onClick={() => navigate(`/admin/orders/quotation/new?orderId=${order.id}`)}>Create Quotation</Button>
          ) : (
            <Button variant="outline" size="sm" icon={<FileText size={14} />} onClick={() => navigate(`/admin/orders/quotation/${quotation.id}`)}>View Quotation</Button>
          )}
        </div>
      }
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
        <Link to="/admin/orders/table" className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 13 }}>Orders</Link>
        <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{order.id}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-navy/8 flex items-center justify-center text-navy shrink-0">
            <ShoppingCart size={24} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="truncate" style={{ fontSize: 20, fontWeight: 600 }}>{order.projectName}</h1>
              <StatusBadge status={order.quotationStatus} size="md" />
              <StatusBadge status={order.orderStatus} size="md" />
            </div>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>
              {order.id} · {order.accountName} · {formatProjectCategory(order.projectCategory)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <TabBar
          tabs={[
            { key: "overview", label: "Overview" },
            { key: "files", label: "Files", count: order.files.length },
            { key: "timeline", label: "Timeline", count: order.timeline.length },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Project Summary */}
            <SummaryCard title="Project Summary">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <DetailField label="Project Name" value={order.projectName} />
                <DetailField label="Site Name" value={order.siteName} />
                <DetailField label="Category" value={formatProjectCategory(order.projectCategory)} />
                <DetailField label="Order Source" value={order.orderSource.charAt(0).toUpperCase() + order.orderSource.slice(1)} />
                <DetailField label="Business Source" value={order.businessSource.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} />
                <DetailField label="Created" value={order.createdAt} />
              </div>
            </SummaryCard>

            {/* Account Summary */}
            <SummaryCard
              title="Account Summary"
              actions={
                <Link to={`/admin/crm/accounts/${order.accountId}`} className="flex items-center gap-1 text-gold-dark hover:text-gold transition-colors" style={{ fontSize: 12, fontWeight: 500 }}>
                  View Account <ExternalLink size={12} />
                </Link>
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <DetailField label="Account Name" value={order.accountName} />
                <DetailField label="Account Type" value={<StatusBadge status={order.accountType} />} />
                <DetailField label="City" value={order.city} />
                <DetailField label="State" value={order.state} />
                <DetailField label="Zone / Territory" value={`${order.zone} · ${order.territory}`} />
                <DetailField label="Salesperson" value={order.salespersonName} />
              </div>
            </SummaryCard>

            {/* Dates */}
            <SummaryCard title="Key Dates">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <DetailField label="Created" value={order.createdAt} />
                <DetailField label="Expected Closure" value={order.expectedClosureDate} />
                <DetailField label="Customer Required" value={order.customerRequiredDate} />
                <DetailField label="Internal Promised" value={order.internalPromisedDate} />
              </div>
            </SummaryCard>

            {/* Drawing Status */}
            {drawingFile && <DrawingStatusBlock currentStatus={primaryDrawingStatus} />}

            {/* Notes */}
            <SummaryCard title="Notes">
              <p style={{ fontSize: 14, lineHeight: 1.6 }}>{order.notes}</p>
            </SummaryCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Linked Quotation */}
            {quotation ? (
              <SummaryCard title="Linked Quotation">
                <div
                  className="p-4 rounded-lg border border-border hover:border-gold/30 hover:bg-gold/4 cursor-pointer transition-all"
                  onClick={() => navigate(`/admin/orders/quotation/${quotation.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{quotation.id}</span>
                    <StatusBadge status={quotation.outcome} />
                  </div>
                  <p className="text-muted-foreground" style={{ fontSize: 13 }}>Version {quotation.currentVersion}</p>
                  <p style={{ fontSize: 16, fontWeight: 600 }} className="mt-2">₹{quotation.quotationAmount.toLocaleString("en-IN")}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-gold-dark" style={{ fontSize: 12, fontWeight: 500 }}>
                    View Quotation <ArrowLeft size={12} className="rotate-180" />
                  </div>
                </div>
              </SummaryCard>
            ) : (
              <SummaryCard title="Quotation">
                <EmptyState
                  icon={<FileText size={24} />}
                  title="No quotation yet"
                  message="Create a quotation for this order."
                  action={<Button variant="gold" size="sm" icon={<Plus size={14} />} onClick={() => navigate(`/admin/orders/quotation/new?orderId=${order.id}`)}>Create Quotation</Button>}
                />
              </SummaryCard>
            )}

            {/* Payment Status */}
            <PaymentBlock
              quotationAmount={order.totalQuotationValue}
              receivedAmount={order.receivedAmount}
              balanceAmount={order.totalQuotationValue - order.receivedAmount}
              paymentStatus={order.paymentStatus}
            />

            {/* Order Status Card */}
            <SummaryCard title="Order Status">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Quotation</span>
                  <StatusBadge status={order.quotationStatus} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Payment</span>
                  <StatusBadge status={order.paymentStatus} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Order Progress</span>
                  <StatusBadge status={order.orderStatus} />
                </div>
              </div>
            </SummaryCard>

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
                    <StatusBadge status={convertedOrder.dispatchStatus} size="xs" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-gold-dark" style={{ fontSize: 12, fontWeight: 500 }}>
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
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>Received</span>
                    <span className="text-emerald-600" style={{ fontSize: 13, fontWeight: 600 }}>₹{financeRecord.receivedAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>Balance</span>
                    <span className="text-red-600" style={{ fontSize: 13, fontWeight: 600 }}>₹{financeRecord.balanceAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-gold-dark" style={{ fontSize: 12, fontWeight: 500 }}>
                    View Finance <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {activeTab === "files" && (
        <div className="max-w-4xl">
          <SummaryCard title={`Project Files (${order.files.length})`}>
            <FileUploadArea files={order.files} showUpload={true} />
          </SummaryCard>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="max-w-3xl">
          <SummaryCard title={`Order Timeline (${order.timeline.length})`}>
            <Timeline
              items={order.timeline.slice().reverse().map(t => ({
                id: t.id,
                title: t.action,
                description: t.description,
                time: `${t.date} · ${t.user}`,
                status: "completed" as const,
              }))}
            />
          </SummaryCard>
        </div>
      )}
      <EditOrderModal open={editOrderOpen} onClose={() => setEditOrderOpen(false)} order={order} />
    </PageShell>
  );
}