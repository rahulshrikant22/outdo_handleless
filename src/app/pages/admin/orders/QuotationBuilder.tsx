import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { PageShell } from "../../../components/layout/PageShell";
import { Button, SummaryCard, InputField, SelectField, AlertCard } from "../../../components/shared";
import { ExcelImportModal } from "../../../components/orders/OrderModals";
import { getProjectOrderById, type QuotationLineItem } from "../../../data/orders";
import {
  ArrowLeft, Save, Send, Download, Plus, Copy, Trash2, Upload, FileSpreadsheet
} from "lucide-react";

import { handleSaveDraft, handleDownloadPDF, handleSendAction } from "../../../components/shared/GlobalModals";
import { toast } from "sonner";

const defaultItem = (): QuotationLineItem => ({
  id: `LI-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  serialNo: 0,
  itemName: "",
  itemCategory: "kitchen",
  length: 0,
  height: 0,
  thickness: 18,
  unit: "mm",
  area: 0,
  quantity: 1,
  rate: 0,
  amount: 0,
});

export function QuotationBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-001";
  const order = getProjectOrderById(orderId);

  const [items, setItems] = useState<QuotationLineItem[]>([
    { id: "NEW001", serialNo: 1, itemName: "Base Cabinet Shutter - 600mm", itemCategory: "kitchen", length: 600, height: 720, thickness: 18, unit: "mm", area: 0.432, quantity: 4, rate: 4200, amount: 16800 },
    { id: "NEW002", serialNo: 2, itemName: "Wall Cabinet Shutter - 600mm", itemCategory: "kitchen", length: 600, height: 360, thickness: 18, unit: "mm", area: 0.216, quantity: 6, rate: 3200, amount: 19200 },
  ]);
  const [remarks, setRemarks] = useState("");
  const [excelModal, setExcelModal] = useState(false);

  const updateItem = (idx: number, field: keyof QuotationLineItem, value: any) => {
    const updated = [...items];
    (updated[idx] as any)[field] = value;
    // Recalculate
    const li = updated[idx];
    if (li.length > 0 && li.height > 0) {
      li.area = parseFloat(((li.length * li.height) / 1000000).toFixed(3));
    }
    li.amount = li.quantity * li.rate;
    setItems(updated);
  };

  const addRow = () => {
    const newItem = defaultItem();
    newItem.serialNo = items.length + 1;
    setItems([...items, newItem]);
  };

  const duplicateRow = (idx: number) => {
    const dup = { ...items[idx], id: `LI-${Date.now()}`, serialNo: items.length + 1 };
    setItems([...items, dup]);
  };

  const deleteRow = (idx: number) => {
    const updated = items.filter((_, i) => i !== idx).map((li, i) => ({ ...li, serialNo: i + 1 }));
    setItems(updated);
  };

  const subtotal = items.reduce((s, li) => s + li.amount, 0);
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  return (
    <>
      <PageShell
        title=""
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" icon={<Save size={14} />} onClick={() => handleSaveDraft(`Quotation for ${order?.projectName || "order"}`)}>Save Draft</Button>
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleDownloadPDF(`Quotation for ${order?.projectName || "order"}`)}>Download PDF</Button>
            <Button variant="gold" size="sm" icon={<Send size={14} />} onClick={() => { handleSendAction(`Quotation for ${order?.projectName || "order"}`); navigate("/admin/orders/table"); }}>Send Quotation</Button>
          </div>
        }
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: 13 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-muted-foreground" style={{ fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>New Quotation</span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 600 }} className="mb-1">Quotation Builder</h1>
        <p className="text-muted-foreground mb-6" style={{ fontSize: 14 }}>
          {order ? `For: ${order.projectName} · ${order.accountName}` : "Create a new quotation"}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content — 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            {/* Project & Account Header */}
            {order && (
              <SummaryCard title="Project & Account Info">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>Order</p>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{order.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>Project</p>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{order.projectName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>Account</p>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{order.accountName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 12 }}>Category</p>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{order.projectCategory.charAt(0).toUpperCase() + order.projectCategory.slice(1)}</p>
                  </div>
                </div>
              </SummaryCard>
            )}

            {/* Quotation Info */}
            <SummaryCard title="Quotation Info">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>Quotation ID</p>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>QTN-NEW (Auto-generated)</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>Version</p>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>v1</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>Date</p>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>2026-03-16</p>
                </div>
              </div>
            </SummaryCard>

            {/* Line Items Table */}
            <SummaryCard
              title={`Line Items (${items.length})`}
              actions={
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" icon={<FileSpreadsheet size={13} />} onClick={() => setExcelModal(true)}>Import Excel</Button>
                  <Button variant="outline" size="sm" icon={<Plus size={13} />} onClick={addRow}>Add Row</Button>
                </div>
              }
            >
              <div className="overflow-x-auto -mx-5">
                <table className="w-full" style={{ fontSize: 12.5, minWidth: 900 }}>
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["S.No", "Item Name", "Category", "L", "H", "T", "Unit", "Area", "Qty", "Rate (₹)", "Amount (₹)", ""].map(h => (
                        <th key={h} className="text-left px-3 py-2.5 text-muted-foreground whitespace-nowrap" style={{ fontWeight: 500, fontSize: 11 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((li, idx) => (
                      <tr key={li.id} className="hover:bg-gold/4">
                        <td className="px-3 py-2 text-muted-foreground" style={{ width: 40 }}>{li.serialNo}</td>
                        <td className="px-3 py-2" style={{ minWidth: 180 }}>
                          <input
                            value={li.itemName}
                            onChange={(e) => updateItem(idx, "itemName", e.target.value)}
                            className="w-full px-2 py-1 rounded bg-background border border-border focus:outline-none focus:ring-1 focus:ring-gold/30"
                            style={{ fontSize: 12.5 }}
                          />
                        </td>
                        <td className="px-3 py-2" style={{ width: 90 }}>
                          <select
                            value={li.itemCategory}
                            onChange={(e) => updateItem(idx, "itemCategory", e.target.value)}
                            className="w-full px-1 py-1 rounded bg-background border border-border appearance-none"
                            style={{ fontSize: 12 }}
                          >
                            {["kitchen", "wardrobe", "office", "bathroom", "villa", "commercial"].map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2" style={{ width: 65 }}>
                          <input type="number" value={li.length || ""} onChange={(e) => updateItem(idx, "length", Number(e.target.value))} className="w-full px-2 py-1 rounded bg-background border border-border focus:outline-none text-right" style={{ fontSize: 12 }} />
                        </td>
                        <td className="px-3 py-2" style={{ width: 65 }}>
                          <input type="number" value={li.height || ""} onChange={(e) => updateItem(idx, "height", Number(e.target.value))} className="w-full px-2 py-1 rounded bg-background border border-border focus:outline-none text-right" style={{ fontSize: 12 }} />
                        </td>
                        <td className="px-3 py-2" style={{ width: 55 }}>
                          <input type="number" value={li.thickness || ""} onChange={(e) => updateItem(idx, "thickness", Number(e.target.value))} className="w-full px-2 py-1 rounded bg-background border border-border focus:outline-none text-right" style={{ fontSize: 12 }} />
                        </td>
                        <td className="px-3 py-2 text-muted-foreground" style={{ width: 40 }}>{li.unit}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground" style={{ width: 60 }}>{li.area.toFixed(3)}</td>
                        <td className="px-3 py-2" style={{ width: 55 }}>
                          <input type="number" value={li.quantity || ""} onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))} className="w-full px-2 py-1 rounded bg-background border border-border focus:outline-none text-right" style={{ fontSize: 12 }} />
                        </td>
                        <td className="px-3 py-2" style={{ width: 80 }}>
                          <input type="number" value={li.rate || ""} onChange={(e) => updateItem(idx, "rate", Number(e.target.value))} className="w-full px-2 py-1 rounded bg-background border border-border focus:outline-none text-right" style={{ fontSize: 12 }} />
                        </td>
                        <td className="px-3 py-2 text-right" style={{ width: 90, fontWeight: 500 }}>₹{li.amount.toLocaleString("en-IN")}</td>
                        <td className="px-3 py-2" style={{ width: 60 }}>
                          <div className="flex items-center gap-0.5">
                            <button onClick={() => duplicateRow(idx)} className="w-6 h-6 rounded hover:bg-accent flex items-center justify-center text-muted-foreground" title="Duplicate"><Copy size={12} /></button>
                            <button onClick={() => deleteRow(idx)} className="w-6 h-6 rounded hover:bg-red-50 flex items-center justify-center text-red-500" title="Delete"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" icon={<Plus size={13} />} onClick={addRow}>Add Row</Button>
              </div>
            </SummaryCard>

            {/* Remarks */}
            <SummaryCard title="Remarks">
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any remarks or terms & conditions..."
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                style={{ fontSize: 14 }}
              />
            </SummaryCard>
          </div>

          {/* Right Column — Totals */}
          <div className="space-y-6">
            <SummaryCard title="Totals">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>Subtotal</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground" style={{ fontSize: 13 }}>GST (18%)</span>
                  <span style={{ fontSize: 14 }}>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between py-3 bg-navy/5 -mx-5 px-5 rounded-lg">
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Grand Total</span>
                  <span className="text-navy" style={{ fontSize: 18, fontWeight: 700 }}>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </SummaryCard>

            <div className="space-y-2">
              <Button variant="gold" size="sm" className="w-full" icon={<Send size={14} />} onClick={() => { handleSendAction(`Quotation for ${order?.projectName || "order"}`); navigate("/admin/orders/table"); }}>Send Quotation</Button>
              <Button variant="outline" size="sm" className="w-full" icon={<Save size={14} />} onClick={() => handleSaveDraft("Quotation")}>Save Draft</Button>
              <Button variant="outline" size="sm" className="w-full" icon={<Download size={14} />} onClick={() => handleDownloadPDF("Quotation")}>Download PDF</Button>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-blue-800" style={{ fontSize: 12, fontWeight: 500 }}>Version Info</p>
              <p className="text-blue-700 mt-0.5" style={{ fontSize: 12 }}>This will be saved as Version 1. You can create revisions later.</p>
            </div>
          </div>
        </div>
      </PageShell>

      <ExcelImportModal open={excelModal} onClose={() => setExcelModal(false)} />
    </>
  );
}