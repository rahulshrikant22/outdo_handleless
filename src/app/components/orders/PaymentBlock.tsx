import { StatusBadge } from "../shared";
import { CreditCard } from "lucide-react";
import type { PaymentCollectionStatus } from "../../data/orders";

interface PaymentBlockProps {
  quotationAmount: number;
  receivedAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentCollectionStatus;
  compact?: boolean;
}

export function PaymentBlock({ quotationAmount, receivedAmount, balanceAmount, paymentStatus, compact }: PaymentBlockProps) {
  const pct = quotationAmount > 0 ? Math.round((receivedAmount / quotationAmount) * 100) : 0;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <span className="text-muted-foreground shrink-0" style={{ fontSize: 12 }}>{pct}%</span>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center">
            <CreditCard size={18} className="text-gold-dark" />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600 }}>Payment Summary</p>
        </div>
        <StatusBadge status={paymentStatus} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground" style={{ fontSize: 13 }}>Quotation Amount</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>₹{quotationAmount.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground" style={{ fontSize: 13 }}>Received Amount</span>
          <span className="text-emerald-600" style={{ fontSize: 14, fontWeight: 600 }}>₹{receivedAmount.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground" style={{ fontSize: 13 }}>Balance Amount</span>
          <span className={balanceAmount > 0 ? "text-amber-600" : "text-emerald-600"} style={{ fontSize: 14, fontWeight: 600 }}>₹{balanceAmount.toLocaleString("en-IN")}</span>
        </div>
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-muted-foreground" style={{ fontSize: 12 }}>Collection Progress</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
