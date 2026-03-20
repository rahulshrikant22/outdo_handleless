import { Link } from "react-router";
import { FileText, ArrowRight, RefreshCw, ShoppingCart } from "lucide-react";

export function QuotationIntegrationBlock() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-navy/4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
            <RefreshCw size={16} className="text-gold-dark" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Quotation Rate Integration</p>
            <p className="text-muted-foreground" style={{ fontSize: 12 }}>Pricing drives quotation line item rates</p>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-muted-foreground" style={{ fontSize: 13, lineHeight: 1.6 }}>
          Active pricing items feed directly into the Quotation Builder. When a salesperson
          creates a new quotation, item rates are auto-populated from this pricing catalog.
          Rate changes here will apply to <strong className="text-foreground">new quotations only</strong> — existing
          quotations retain their locked-in rates.
        </p>

        <div className="space-y-2">
          {[
            { label: "Pricing Catalog", desc: "Master rate card with effective dates", icon: <FileText size={14} />, path: "/admin/pricing/table" },
            { label: "Quotation Builder", desc: "Auto-populates rates from pricing", icon: <ShoppingCart size={14} />, path: "/admin/orders/quotation/new" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-gold/30 hover:bg-gold/4 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-gold-dark transition-colors shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</p>
                <p className="text-muted-foreground" style={{ fontSize: 12 }}>{item.desc}</p>
              </div>
              <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          ))}
        </div>

        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-blue-800" style={{ fontSize: 12, fontWeight: 500 }}>How it works</p>
          <ul className="text-blue-700 mt-1 space-y-1" style={{ fontSize: 12 }}>
            <li>1. Admin sets/updates item rates in Pricing Catalog</li>
            <li>2. Salesperson opens Quotation Builder → selects items</li>
            <li>3. Rates auto-fill from latest active pricing</li>
            <li>4. Salesperson can override rates if authorized</li>
            <li>5. Final quotation locks the applied rate</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
