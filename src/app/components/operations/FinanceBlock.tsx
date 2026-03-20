import { useState } from "react";
import { Modal, Button, InputField, SelectField, SummaryCard, DetailField, StatusBadge } from "../shared";
import { type ConvertedOrder, type OpsPaymentEntry } from "../../data/operations";
import { DollarSign, Plus, CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";

interface FinanceBlockProps {
  order: ConvertedOrder;
}

export function FinanceBlock({ order }: FinanceBlockProps) {
  const [addPaymentModal, setAddPaymentModal] = useState(false);
  const percent = order.quotationAmount > 0 ? Math.round((order.receivedAmount / order.quotationAmount) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-navy/5 border border-navy/10">
          <p className="text-muted-foreground" style={{ fontSize: 12 }}>Quotation Amount</p>
          <p className="text-navy mt-1" style={{ fontSize: 20, fontWeight: 700 }}>
            ₹{order.quotationAmount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <p className="text-emerald-700" style={{ fontSize: 12 }}>Received</p>
          <p className="text-emerald-800 mt-1" style={{ fontSize: 20, fontWeight: 700 }}>
            ₹{order.receivedAmount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-700" style={{ fontSize: 12 }}>Balance</p>
          <p className="text-red-800 mt-1" style={{ fontSize: 20, fontWeight: 700 }}>
            ₹{order.balanceAmount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
          <p className="text-gold-dark" style={{ fontSize: 12 }}>Collection Rate</p>
          <p className="text-gold-dark mt-1" style={{ fontSize: 20, fontWeight: 700 }}>
            {percent}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-muted-foreground" style={{ fontSize: 12 }}>Payment Progress</span>
          <StatusBadge status={order.paymentStatus} />
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all bg-gradient-to-r from-emerald-500 to-emerald-400"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Payment Entries */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p style={{ fontSize: 14, fontWeight: 600 }}>Payment Entries ({order.payments.length})</p>
          <Button variant="outline" size="sm" icon={<Plus size={13} />} onClick={() => setAddPaymentModal(true)}>
            Add Payment
          </Button>
        </div>
        {order.payments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground" style={{ fontSize: 13 }}>
            No payments recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: 13 }}>
              <thead>
                <tr className="border-b border-border">
                  {["Date", "Amount", "Method", "Reference", "Received By", "Notes"].map(h => (
                    <th key={h} className="text-left py-2 text-muted-foreground" style={{ fontWeight: 500, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.payments.map(pay => (
                  <tr key={pay.id} className="border-b border-border/50">
                    <td className="py-2.5">{pay.date}</td>
                    <td className="py-2.5" style={{ fontWeight: 600 }}>₹{pay.amount.toLocaleString("en-IN")}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontSize: 11 }}>
                        {pay.method.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted-foreground" style={{ fontSize: 12 }}>{pay.reference}</td>
                    <td className="py-2.5">{pay.receivedBy}</td>
                    <td className="py-2.5 text-muted-foreground max-w-[160px] truncate" style={{ fontSize: 12 }}>{pay.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      <AddPaymentModal open={addPaymentModal} onClose={() => setAddPaymentModal(false)} order={order} />
    </div>
  );
}

function AddPaymentModal({ open, onClose, order }: { open: boolean; onClose: () => void; order: ConvertedOrder }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <Modal open={open} onClose={onClose} title="Record Payment" size="md">
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-navy/5 border border-navy/10">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground" style={{ fontSize: 12 }}>Balance Due</span>
            <span style={{ fontSize: 16, fontWeight: 700 }}>₹{order.balanceAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <InputField label="Amount (₹)" placeholder="Enter amount..." value={amount} onChange={setAmount} type="number" />
        <SelectField
          label="Payment Method"
          options={[
            { label: "Bank Transfer (NEFT/RTGS)", value: "bank_transfer" },
            { label: "Cheque", value: "cheque" },
            { label: "UPI", value: "upi" },
            { label: "Cash", value: "cash" },
          ]}
          value={method}
          onChange={setMethod}
        />
        <InputField label="Reference Number" placeholder="e.g., NEFT/2026/..." value={reference} onChange={setReference} />
        <InputField label="Notes" placeholder="Payment notes..." value={notes} onChange={setNotes} />

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="gold" size="sm" className="flex-1" icon={<CreditCard size={14} />} onClick={onClose}>
            Record Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
}
