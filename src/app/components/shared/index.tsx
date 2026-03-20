import { useState, type ReactNode } from "react";
import {
  Search, Filter, X, ChevronLeft, ChevronRight, Upload, AlertCircle,
  CheckCircle2, AlertTriangle, Info, Clock, MoreHorizontal, Eye, Edit, Trash2,
  ArrowUpDown, ArrowUp, ArrowDown
} from "lucide-react";

// ======================== STATUS BADGE ========================
const badgeStyles: Record<string, string> = {
  // Lead statuses
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  qualified: "bg-purple-50 text-purple-700 border-purple-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  lost: "bg-red-50 text-red-700 border-red-200",
  // CRM Lead Quality
  hot: "bg-red-50 text-red-700 border-red-200",
  warm: "bg-amber-50 text-amber-700 border-amber-200",
  cold: "bg-sky-50 text-sky-700 border-sky-200",
  bad: "bg-gray-50 text-gray-600 border-gray-200",
  account: "bg-emerald-50 text-emerald-700 border-emerald-200",
  // CRM Database types
  dealer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  factory: "bg-amber-50 text-amber-700 border-amber-200",
  architect: "bg-violet-50 text-violet-700 border-violet-200",
  organic: "bg-sky-50 text-sky-700 border-sky-200",
  // CRM Sample statuses
  not_applicable: "bg-gray-50 text-gray-500 border-gray-200",
  provided: "bg-emerald-50 text-emerald-700 border-emerald-200",
  // Account health
  excellent: "bg-emerald-50 text-emerald-700 border-emerald-200",
  good: "bg-blue-50 text-blue-700 border-blue-200",
  average: "bg-amber-50 text-amber-700 border-amber-200",
  at_risk: "bg-red-50 text-red-700 border-red-200",
  churned: "bg-gray-50 text-gray-500 border-gray-200",
  // Collection health / finance
  on_track: "bg-emerald-50 text-emerald-700 border-emerald-200",
  // Account statuses
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-gray-50 text-gray-600 border-gray-200",
  // Order statuses
  draft: "bg-gray-50 text-gray-600 border-gray-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  in_production: "bg-amber-50 text-amber-700 border-amber-200",
  shipped: "bg-violet-50 text-violet-700 border-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  discontinued: "bg-gray-100 text-gray-500 border-gray-300",
  // Order progress statuses
  enquiry: "bg-gray-50 text-gray-600 border-gray-200",
  quotation_sent: "bg-blue-50 text-blue-700 border-blue-200",
  order_confirmed: "bg-indigo-50 text-indigo-700 border-indigo-200",
  dispatched: "bg-violet-50 text-violet-700 border-violet-200",
  // Quotation outcome statuses
  open: "bg-blue-50 text-blue-700 border-blue-200",
  under_discussion: "bg-amber-50 text-amber-700 border-amber-200",
  negotiation: "bg-orange-50 text-orange-700 border-orange-200",
  won: "bg-emerald-50 text-emerald-700 border-emerald-200",
  hold: "bg-purple-50 text-purple-700 border-purple-200",
  // Drawing statuses
  submitted: "bg-gray-50 text-gray-600 border-gray-200",
  cad_conversion_pending: "bg-amber-50 text-amber-700 border-amber-200",
  cad_ready: "bg-blue-50 text-blue-700 border-blue-200",
  approval_pending: "bg-orange-50 text-orange-700 border-orange-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  // Payment collection statuses
  not_started: "bg-gray-50 text-gray-500 border-gray-200",
  advance_received: "bg-blue-50 text-blue-700 border-blue-200",
  full: "bg-emerald-50 text-emerald-700 border-emerald-200",
  // Quotation statuses
  sent: "bg-blue-50 text-blue-700 border-blue-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-gray-50 text-gray-600 border-gray-200",
  // Task statuses
  pending: "bg-gray-50 text-gray-600 border-gray-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  on_hold: "bg-amber-50 text-amber-700 border-amber-200",
  // Payment statuses
  partial: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  // Finance payment stages
  advance: "bg-blue-50 text-blue-700 border-blue-200",
  progress: "bg-indigo-50 text-indigo-700 border-indigo-200",
  pre_dispatch: "bg-violet-50 text-violet-700 border-violet-200",
  on_delivery: "bg-teal-50 text-teal-700 border-teal-200",
  final: "bg-emerald-50 text-emerald-700 border-emerald-200",
  retention: "bg-amber-50 text-amber-700 border-amber-200",
  // Priority
  low: "bg-gray-50 text-gray-600 border-gray-200",
  medium: "bg-blue-50 text-blue-700 border-blue-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  urgent: "bg-red-50 text-red-700 border-red-200",
  critical: "bg-red-100 text-red-800 border-red-300",
  normal: "bg-gray-50 text-gray-600 border-gray-200",
  // Roles
  admin: "bg-navy/8 text-navy border-navy/20",
  dealer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  architect: "bg-violet-50 text-violet-700 border-violet-200",
  factory: "bg-amber-50 text-amber-700 border-amber-200",
  customer: "bg-sky-50 text-sky-700 border-sky-200",
  // Production statuses
  design_pending: "bg-gray-50 text-gray-600 border-gray-200",
  cutlist_pending: "bg-amber-50 text-amber-700 border-amber-200",
  material_procurement: "bg-violet-50 text-violet-700 border-violet-200",
  cutting: "bg-blue-50 text-blue-700 border-blue-200",
  edging: "bg-indigo-50 text-indigo-700 border-indigo-200",
  assembly: "bg-orange-50 text-orange-700 border-orange-200",
  finishing: "bg-pink-50 text-pink-700 border-pink-200",
  quality_check: "bg-teal-50 text-teal-700 border-teal-200",
  production_ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  // Dispatch statuses
  not_ready: "bg-gray-50 text-gray-600 border-gray-200",
  packaging: "bg-amber-50 text-amber-700 border-amber-200",
  ready_to_dispatch: "bg-blue-50 text-blue-700 border-blue-200",
  in_transit: "bg-violet-50 text-violet-700 border-violet-200",
};

export function StatusBadge({ status, size = "sm" }: { status: string; size?: "xs" | "sm" | "md" }) {
  const style = badgeStyles[status] || "bg-gray-50 text-gray-600 border-gray-200";
  const sizeClass = size === "xs" ? "px-1.5 py-0.5" : size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const fontSize = size === "xs" ? 10.5 : size === "sm" ? 11.5 : 13;
  return (
    <span
      className={`inline-flex items-center rounded-full border ${style} ${sizeClass} whitespace-nowrap`}
      style={{ fontSize, fontWeight: 500 }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ======================== BUTTONS ========================
interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function Button({ children, variant = "primary", size = "md", icon, onClick, className = "", disabled }: ButtonProps) {
  const variants: Record<string, string> = {
    primary: "bg-navy text-white hover:bg-navy-light shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-card text-foreground hover:bg-accent",
    ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    gold: "bg-gold text-navy hover:bg-gold-light shadow-sm",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 gap-1.5 rounded-lg",
    md: "h-9 px-4 gap-2 rounded-lg",
    lg: "h-11 px-5 gap-2 rounded-xl",
  };
  const fontSizes: Record<string, number> = { sm: 12.5, md: 13.5, lg: 14 };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      style={{ fontSize: fontSizes[size], fontWeight: 500 }}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// ======================== SEARCH BAR ========================
export function SearchBar({ placeholder = "Search...", value, onChange, className = "" }: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-9 w-full pl-9 pr-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
        style={{ fontSize: 13 }}
      />
    </div>
  );
}

// ======================== FILTER BAR ========================
interface FilterOption { label: string; value: string; }
interface FilterBarProps {
  filters: { label: string; options: FilterOption[]; value: string; onChange: (v: string) => void }[];
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  actions?: ReactNode;
}

export function FilterBar({ filters, searchValue, onSearchChange, searchPlaceholder, actions }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
      {onSearchChange && (
        <SearchBar
          placeholder={searchPlaceholder || "Search..."}
          value={searchValue}
          onChange={onSearchChange}
          className="w-full sm:w-64"
        />
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <div key={f.label} className="relative">
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="h-9 pl-3 pr-8 rounded-lg bg-card border border-border text-foreground appearance-none cursor-pointer hover:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
              style={{ fontSize: 13 }}
            >
              <option value="">{f.label}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <Filter size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        ))}
      </div>
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ======================== CHIP ========================
export function Chip({ label, onRemove, color = "default" }: { label: string; onRemove?: () => void; color?: "default" | "gold" | "navy" | "green" | "red" }) {
  const colors: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    gold: "bg-gold/10 text-gold-dark",
    navy: "bg-navy/8 text-navy",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${colors[color]}`} style={{ fontSize: 12 }}>
      {label}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
          <X size={12} />
        </button>
      )}
    </span>
  );
}

// ======================== DATA TABLE ========================
interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns, data, keyField, onRowClick, emptyMessage = "No data found"
}: DataTableProps<T>) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-muted-foreground whitespace-nowrap ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                  style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.02em', width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground" style={{ fontSize: 14 }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item[keyField]}
                  className={`transition-colors ${onRowClick ? "cursor-pointer hover:bg-gold/4" : "hover:bg-accent/30"}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
                      style={{ fontSize: 13.5 }}
                    >
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ======================== PAGINATION ========================
export function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-muted-foreground" style={{ fontSize: 13 }}>
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
          Math.max(0, page - 3), Math.min(totalPages, page + 2)
        ).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              p === page ? "bg-navy text-white" : "border border-border hover:bg-accent"
            }`}
            style={{ fontSize: 13 }}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ======================== TABS ========================
export function TabBar({ tabs, active, onChange }: { tabs: { key: string; label: string; count?: number }[]; active: string; onChange: (key: string) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-border overflow-x-auto scrollbar-hide -mx-1 px-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-3 sm:px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            active === tab.key
              ? "border-gold text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
          style={{ fontSize: 13, fontWeight: active === tab.key ? 500 : 400 }}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontSize: 11 }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ======================== MODAL / DRAWER ========================
export function Modal({ open, onClose, title, children, size = "md" }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; size?: "sm" | "md" | "lg"
}) {
  if (!open) return null;
  const sizes: Record<string, string> = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-card rounded-2xl border border-border shadow-2xl w-full ${sizes[size]} mx-4 max-h-[85vh] flex flex-col`}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-md border-l border-border shadow-2xl flex flex-col h-full">
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <h3>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// ======================== UPLOAD BOX ========================
export function UploadBox({ label = "Upload File", hint }: { label?: string; hint?: string }) {
  return (
    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-gold/40 transition-colors cursor-pointer">
      <Upload size={24} className="mx-auto text-muted-foreground mb-3" />
      <p className="text-foreground" style={{ fontSize: 14, fontWeight: 500 }}>{label}</p>
      {hint && <p className="text-muted-foreground mt-1" style={{ fontSize: 12.5 }}>{hint}</p>}
    </div>
  );
}

// ======================== ALERT CARD ========================
export function AlertCard({ type = "info", title, message }: {
  type?: "info" | "success" | "warning" | "error"; title: string; message?: string;
}) {
  const configs: Record<string, { icon: ReactNode; bg: string; border: string; text: string }> = {
    info: { icon: <Info size={18} />, bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
    success: { icon: <CheckCircle2 size={18} />, bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800" },
    warning: { icon: <AlertTriangle size={18} />, bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800" },
    error: { icon: <AlertCircle size={18} />, bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
  };
  const c = configs[type];
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${c.bg} ${c.border}`}>
      <span className={`${c.text} shrink-0 mt-0.5`}>{c.icon}</span>
      <div>
        <p className={c.text} style={{ fontSize: 14, fontWeight: 500 }}>{title}</p>
        {message && <p className={`${c.text} opacity-80 mt-0.5`} style={{ fontSize: 13 }}>{message}</p>}
      </div>
    </div>
  );
}

// ======================== TIMELINE ========================
interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: ReactNode;
  status?: "completed" | "active" | "pending";
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative">
      {items.map((item, idx) => (
        <div key={item.id} className="flex gap-4 pb-6 last:pb-0">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              item.status === "completed" ? "bg-emerald-100 text-emerald-600" :
              item.status === "active" ? "bg-gold/15 text-gold-dark" :
              "bg-muted text-muted-foreground"
            }`}>
              {item.icon || <Clock size={14} />}
            </div>
            {idx < items.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
          </div>
          <div className="pb-2 min-w-0">
            <p className="text-foreground" style={{ fontSize: 13.5, fontWeight: 500 }}>{item.title}</p>
            {item.description && <p className="text-muted-foreground mt-0.5" style={{ fontSize: 12.5 }}>{item.description}</p>}
            <p className="text-muted-foreground mt-1" style={{ fontSize: 11.5 }}>{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ======================== SUMMARY CARD ========================
export function SummaryCard({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h4>{title}</h4>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ======================== DETAIL FIELD ========================
export function DetailField({ label, value, className = "" }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-muted-foreground mb-0.5" style={{ fontSize: 12, fontWeight: 500 }}>{label}</p>
      <p className="text-foreground" style={{ fontSize: 14 }}>{value}</p>
    </div>
  );
}

// ======================== ROW ACTIONS ========================
export function RowActions({ onView, onEdit, onDelete }: { onView?: () => void; onEdit?: () => void; onDelete?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors"
      >
        <MoreHorizontal size={16} className="text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-card rounded-xl border border-border shadow-lg py-1 min-w-[140px]">
            {onView && (
              <button onClick={() => { onView(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent transition-colors text-left" style={{ fontSize: 13 }}>
                <Eye size={14} className="text-muted-foreground" /> View
              </button>
            )}
            {onEdit && (
              <button onClick={() => { onEdit(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent transition-colors text-left" style={{ fontSize: 13 }}>
                <Edit size={14} className="text-muted-foreground" /> Edit
              </button>
            )}
            {onDelete && (
              <button onClick={() => { onDelete(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent transition-colors text-left text-red-600" style={{ fontSize: 13 }}>
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ======================== INPUT FIELD ========================
export function InputField({ label, placeholder, value, onChange, type = "text" }: {
  label: string; placeholder?: string; value?: string; onChange?: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full px-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
        style={{ fontSize: 14 }}
      />
    </div>
  );
}

// ======================== SELECT FIELD ========================
export function SelectField({ label, options, value, onChange, placeholder }: {
  label: string; options: { label: string; value: string }[]; value?: string; onChange?: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full px-3 rounded-lg bg-background border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
        style={{ fontSize: 14 }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ======================== DATE FIELD ========================
export function DateField({ label, value, onChange }: {
  label: string; value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full px-3 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
        style={{ fontSize: 14 }}
      />
    </div>
  );
}

// ======================== EMPTY STATE ========================
export function EmptyState({ icon, title, message, action }: {
  icon?: ReactNode; title: string; message?: string; action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">{icon}</div>}
      <p className="text-foreground" style={{ fontSize: 16, fontWeight: 500 }}>{title}</p>
      {message && <p className="text-muted-foreground mt-1 max-w-sm" style={{ fontSize: 14 }}>{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ======================== TOOLTIP ========================
export function Tooltip({ children, text }: { children: ReactNode; text: string }) {
  return (
    <div className="relative group/tooltip inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-navy text-white rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg" style={{ fontSize: 12 }}>
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-navy" />
      </div>
    </div>
  );
}

// ======================== SORTABLE DATA TABLE ========================
type SortDirection = "asc" | "desc" | null;

interface SortableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortValue?: (item: T) => string | number;
  tooltip?: string;
}

interface SortableDataTableProps<T> {
  columns: SortableColumn<T>[];
  data: T[];
  keyField: string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  pageSize?: number;
  showRowCount?: boolean;
  rowActions?: (item: T) => ReactNode;
}

export function SortableDataTable<T extends Record<string, any>>({
  columns, data, keyField, onRowClick, emptyMessage = "No records found",
  emptyIcon, pageSize = 10, showRowCount = true, rowActions,
}: SortableDataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [page, setPage] = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc");
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  let sorted = [...data];
  if (sortKey && sortDir) {
    const col = columns.find(c => c.key === sortKey);
    sorted.sort((a, b) => {
      const aVal = col?.sortValue ? col.sortValue(a) : a[sortKey];
      const bVal = col?.sortValue ? col.sortValue(b) : b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const aStr = String(aVal || "").toLowerCase();
      const bStr = String(bVal || "").toLowerCase();
      return sortDir === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const allCols = rowActions
    ? [...columns, { key: "__actions__", label: "", width: "50px", align: "center" as const }]
    : columns;

  return (
    <div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {allCols.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-muted-foreground whitespace-nowrap select-none ${
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                    } ${"sortable" in col && col.sortable ? "cursor-pointer hover:text-foreground transition-colors group" : ""}`}
                    style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.02em", width: col.width }}
                    onClick={() => "sortable" in col && col.sortable && handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {"tooltip" in col && col.tooltip ? (
                        <Tooltip text={col.tooltip}><span>{col.label}</span></Tooltip>
                      ) : (
                        col.label
                      )}
                      {"sortable" in col && col.sortable && (
                        <span className="inline-flex">
                          {sortKey === col.key && sortDir === "asc" ? (
                            <ArrowUp size={13} className="text-gold" />
                          ) : sortKey === col.key && sortDir === "desc" ? (
                            <ArrowDown size={13} className="text-gold" />
                          ) : (
                            <ArrowUpDown size={13} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={allCols.length} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      {emptyIcon && <div className="text-muted-foreground">{emptyIcon}</div>}
                      <p className="text-muted-foreground" style={{ fontSize: 14 }}>{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr
                    key={item[keyField]}
                    className={`transition-colors ${onRowClick ? "cursor-pointer hover:bg-gold/4" : "hover:bg-accent/30"}`}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
                        style={{ fontSize: 13.5 }}
                      >
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    {rowActions && (
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {rowActions(item)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer with row count and pagination */}
      <div className="flex items-center justify-between mt-3">
        {showRowCount ? (
          <span className="text-muted-foreground" style={{ fontSize: 12.5 }}>
            Showing {Math.min((page - 1) * pageSize + 1, sorted.length)}–{Math.min(page * pageSize, sorted.length)} of {sorted.length} records
          </span>
        ) : <span />}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    p === page ? "bg-navy text-white" : "border border-border hover:bg-accent"
                  }`}
                  style={{ fontSize: 13 }}
                >
                  {p}
                </button>
              ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ======================== ACTIVITY LOG ========================
interface ActivityLogEntry {
  id: string;
  user: string;
  action: string;
  target?: string;
  time: string;
  type?: "create" | "update" | "delete" | "system" | "payment";
}

export function ActivityLog({ entries, maxItems = 8 }: { entries: ActivityLogEntry[]; maxItems?: number }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? entries : entries.slice(0, maxItems);

  const typeColors: Record<string, string> = {
    create: "bg-emerald-100 text-emerald-600",
    update: "bg-blue-100 text-blue-600",
    delete: "bg-red-100 text-red-600",
    system: "bg-gray-100 text-gray-600",
    payment: "bg-gold/15 text-gold-dark",
  };

  return (
    <div className="space-y-1">
      {displayed.map((entry) => (
        <div key={entry.id} className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0 hover:bg-accent/20 rounded-lg px-2 -mx-2 transition-colors">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${typeColors[entry.type || "system"]}`}>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{entry.user.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 13 }}>
              <span style={{ fontWeight: 500 }}>{entry.user}</span>
              <span className="text-muted-foreground"> {entry.action}</span>
              {entry.target && <span style={{ fontWeight: 500 }}> {entry.target}</span>}
            </p>
            <p className="text-muted-foreground" style={{ fontSize: 11.5 }}>{entry.time}</p>
          </div>
        </div>
      ))}
      {entries.length > maxItems && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-center text-muted-foreground hover:text-foreground transition-colors"
          style={{ fontSize: 12.5, fontWeight: 500 }}
        >
          {showAll ? "Show less" : `View all ${entries.length} entries`}
        </button>
      )}
    </div>
  );
}