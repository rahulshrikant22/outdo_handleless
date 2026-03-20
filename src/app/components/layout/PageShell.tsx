import type { ReactNode } from "react";
import { useLocation, Link } from "react-router";
import { ChevronRight, Home } from "lucide-react";

interface PageShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  noPadding?: boolean;
  breadcrumbs?: { label: string; path?: string }[];
}

const AUTO_BREADCRUMB_MAP: Record<string, string> = {
  admin: "Admin",
  dealer: "Dealer Portal",
  architect: "Architect Portal",
  factory: "Factory Portal",
  public: "Website",
  crm: "CRM",
  orders: "Orders",
  quotations: "Quotations",
  tasks: "Tasks",
  payments: "Payments",
  users: "Users",
  settings: "Settings",
  pricing: "Pricing",
  operations: "Operations",
  sales: "Sales Analytics",
  finance: "Finance",
  dashboard: "Dashboard",
  table: "Table",
  leads: "Leads",
  accounts: "Accounts",
  "converted-orders": "Converted Orders",
  projects: "Projects",
  specifications: "Specifications",
  production: "Production",
  dispatch: "Dispatch",
  "my-tasks": "My Tasks",
  salesperson: "Team Performance",
  territory: "Territory & Accounts",
  analysis: "Analysis & Alerts",
  locator: "Dealer Locator",
};

function generateBreadcrumbs(pathname: string): { label: string; path?: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return [];

  const crumbs: { label: string; path?: string }[] = [];
  let currentPath = "";

  for (let i = 0; i < segments.length - 1; i++) {
    currentPath += `/${segments[i]}`;
    const label = AUTO_BREADCRUMB_MAP[segments[i]] || segments[i].charAt(0).toUpperCase() + segments[i].slice(1);
    crumbs.push({ label, path: currentPath });
  }

  return crumbs;
}

export function PageShell({ title, subtitle, actions, children, noPadding, breadcrumbs }: PageShellProps) {
  const location = useLocation();
  const crumbs = breadcrumbs || generateBreadcrumbs(location.pathname);

  return (
    <div className={noPadding ? "" : "p-3 sm:p-4 lg:p-6 max-w-[1440px]"}>
      {/* Breadcrumbs */}
      {crumbs.length > 0 && (
        <nav className="flex items-center gap-1 mb-3 overflow-x-auto scrollbar-hide" aria-label="Breadcrumb">
          <Link
            to={`/${location.pathname.split("/")[1] || ""}`}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <Home size={13} />
          </Link>
          {crumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <ChevronRight size={12} className="text-muted-foreground/50" />
              {crumb.path ? (
                <Link
                  to={crumb.path}
                  className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                  style={{ fontSize: 12 }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-muted-foreground whitespace-nowrap" style={{ fontSize: 12 }}>{crumb.label}</span>
              )}
            </div>
          ))}
          <div className="flex items-center gap-1 shrink-0">
            <ChevronRight size={12} className="text-muted-foreground/50" />
            <span className="text-foreground whitespace-nowrap" style={{ fontSize: 12, fontWeight: 500 }}>{title}</span>
          </div>
        </nav>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 sm:mb-6">
        <div className="min-w-0">
          <h1 className="truncate" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.3 }}>{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-0.5 line-clamp-2" style={{ fontSize: 13 }}>{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
