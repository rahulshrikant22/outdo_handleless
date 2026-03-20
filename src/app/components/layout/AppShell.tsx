import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { useScrollRestoration, useWindowScrollRestoration } from "./ScrollRestoration";
import {
  LayoutDashboard, Users, ShoppingCart, FileText, ClipboardList,
  CreditCard, UserCog, Building2, Factory, Globe, ChevronLeft,
  Menu, LogOut, Home, Package, Phone, BookOpen, Settings, Truck, PenTool,
  Bell, Search, ChevronDown, MapPin, DollarSign, Wrench, BarChart3, Target,
  Wallet, Receipt, TrendingUp, X,
} from "lucide-react";

type NavItem = { label: string; path: string; icon: React.ReactNode };
type NavSection = { section?: string; items: NavItem[] };

const roleConfig: Record<string, { label: string; subtitle: string; accentClass: string; nav: NavSection[] }> = {
  admin: {
    label: "Admin",
    subtitle: "Full Access",
    accentClass: "bg-gold/20 text-gold",
    nav: [
      {
        section: "Overview",
        items: [
          { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
        ],
      },
      {
        section: "CRM",
        items: [
          { label: "Lead Master", path: "/admin/crm/leads", icon: <Users size={18} /> },
          { label: "Dealer DB", path: "/admin/crm/dealer", icon: <Building2 size={18} /> },
          { label: "Factory DB", path: "/admin/crm/factory", icon: <Factory size={18} /> },
          { label: "Architect DB", path: "/admin/crm/architect", icon: <PenTool size={18} /> },
          { label: "Organic Leads", path: "/admin/crm/organic", icon: <Globe size={18} /> },
          { label: "Accounts", path: "/admin/crm/accounts", icon: <Building2 size={18} /> },
          { label: "Dealer Locator", path: "/admin/crm/locator", icon: <MapPin size={18} /> },
        ],
      },
      {
        section: "Operations",
        items: [
          { label: "Orders Dashboard", path: "/admin/orders/dashboard", icon: <ShoppingCart size={18} /> },
          { label: "Orders Table", path: "/admin/orders/table", icon: <ClipboardList size={18} /> },
          { label: "Quotations", path: "/admin/quotations", icon: <FileText size={18} /> },
          { label: "Ops Dashboard", path: "/admin/operations/dashboard", icon: <Wrench size={18} /> },
          { label: "Converted Orders", path: "/admin/operations/table", icon: <Factory size={18} /> },
          { label: "Pricing Dashboard", path: "/admin/pricing/dashboard", icon: <DollarSign size={18} /> },
          { label: "Pricing Catalog", path: "/admin/pricing/table", icon: <Package size={18} /> },
          { label: "Payments", path: "/admin/payments", icon: <CreditCard size={18} /> },
        ],
      },
      {
        section: "Tasks",
        items: [
          { label: "Task Dashboard", path: "/admin/tasks/dashboard", icon: <ClipboardList size={18} /> },
          { label: "All Tasks", path: "/admin/tasks/table", icon: <ClipboardList size={18} /> },
          { label: "My Tasks", path: "/admin/tasks/my-tasks", icon: <Users size={18} /> },
          { label: "Project Tasks", path: "/admin/tasks/projects", icon: <Wrench size={18} /> },
        ],
      },
      {
        section: "Sales Analytics",
        items: [
          { label: "Sales Dashboard", path: "/admin/sales/dashboard", icon: <BarChart3 size={18} /> },
          { label: "Team Performance", path: "/admin/sales/salesperson", icon: <Users size={18} /> },
          { label: "Territory & Accounts", path: "/admin/sales/territory", icon: <Target size={18} /> },
          { label: "Analysis & Alerts", path: "/admin/sales/analysis", icon: <BarChart3 size={18} /> },
        ],
      },
      {
        section: "Finance",
        items: [
          { label: "Finance Dashboard", path: "/admin/finance/dashboard", icon: <Wallet size={18} /> },
          { label: "Finance Orders", path: "/admin/finance/table", icon: <Receipt size={18} /> },
        ],
      },
      {
        section: "System",
        items: [
          { label: "Users", path: "/admin/users", icon: <UserCog size={18} /> },
          { label: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
        ],
      },
    ],
  },
  dealer: {
    label: "Dealer",
    subtitle: "Partner Portal",
    accentClass: "bg-emerald-500/20 text-emerald-400",
    nav: [
      {
        items: [
          { label: "Dashboard", path: "/dealer", icon: <LayoutDashboard size={18} /> },
          { label: "My Leads", path: "/dealer/leads", icon: <Users size={18} /> },
          { label: "My Accounts", path: "/dealer/accounts", icon: <Building2 size={18} /> },
          { label: "Orders", path: "/dealer/orders", icon: <ShoppingCart size={18} /> },
          { label: "Converted Orders", path: "/dealer/converted-orders", icon: <Wrench size={18} /> },
          { label: "Quotations", path: "/dealer/quotations", icon: <FileText size={18} /> },
          { label: "Payments", path: "/dealer/payments", icon: <CreditCard size={18} /> },
        ],
      },
    ],
  },
  architect: {
    label: "Architect",
    subtitle: "Design Portal",
    accentClass: "bg-violet-500/20 text-violet-400",
    nav: [
      {
        items: [
          { label: "Dashboard", path: "/architect", icon: <LayoutDashboard size={18} /> },
          { label: "My Leads", path: "/architect/leads", icon: <Users size={18} /> },
          { label: "Projects", path: "/architect/projects", icon: <PenTool size={18} /> },
          { label: "Specifications", path: "/architect/specifications", icon: <BookOpen size={18} /> },
          { label: "Orders", path: "/architect/orders", icon: <ShoppingCart size={18} /> },
          { label: "Project Orders", path: "/architect/converted-orders", icon: <Wrench size={18} /> },
        ],
      },
    ],
  },
  factory: {
    label: "Factory",
    subtitle: "Production Hub",
    accentClass: "bg-amber-500/20 text-amber-400",
    nav: [
      {
        items: [
          { label: "Dashboard", path: "/factory", icon: <LayoutDashboard size={18} /> },
          { label: "My Leads", path: "/factory/leads", icon: <Users size={18} /> },
          { label: "Orders", path: "/factory/orders", icon: <ShoppingCart size={18} /> },
          { label: "Tasks", path: "/factory/tasks", icon: <ClipboardList size={18} /> },
          { label: "Production", path: "/factory/production", icon: <Factory size={18} /> },
          { label: "Dispatch", path: "/factory/dispatch", icon: <Truck size={18} /> },
          { label: "Production Orders", path: "/factory/converted-orders", icon: <Wrench size={18} /> },
        ],
      },
    ],
  },
  public: {
    label: "Customer",
    subtitle: "Public Portal",
    accentClass: "bg-sky-500/20 text-sky-400",
    nav: [
      {
        items: [
          { label: "Home", path: "/public", icon: <Home size={18} /> },
          { label: "Products", path: "/public/products", icon: <Package size={18} /> },
          { label: "Contact", path: "/public/contact", icon: <Phone size={18} /> },
          { label: "Request Quote", path: "/public/quote", icon: <FileText size={18} /> },
        ],
      },
    ],
  },
};

// Get page title from pathname
function getPageTitle(pathname: string, role: string): string {
  const config = roleConfig[role];
  if (!config) return "";
  for (const section of config.nav) {
    for (const item of section.items) {
      if (pathname === item.path || (item.path !== `/${role}` && pathname.startsWith(item.path + "/"))) {
        return item.label;
      }
    }
  }
  return "Dashboard";
}

export function AppShell({ role }: { role: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const config = roleConfig[role] || roleConfig.admin;
  const pageTitle = getPageTitle(location.pathname, role);
  const mainRef = useRef<HTMLDivElement>(null);
  useScrollRestoration(mainRef);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Public role uses a different shell
  if (role === "public") {
    return <PublicShellLayout config={config} />;
  }

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="flex items-center justify-between gap-3 px-4 h-16 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center shrink-0">
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1B2A4A" }}>OD</span>
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="min-w-0">
              <p className="text-white truncate" style={{ fontSize: 14, fontWeight: 600 }}>OutDo</p>
              <p className="text-white/50 truncate" style={{ fontSize: 11 }}>{config.subtitle}</p>
            </div>
          )}
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        {config.nav.map((section, sIdx) => (
          <div key={sIdx} className={sIdx > 0 ? "mt-5" : ""}>
            {section.section && (!collapsed || mobileOpen) && (
              <p className="px-3 mb-2 text-white/35 uppercase tracking-wider" style={{ fontSize: 10.5, fontWeight: 600 }}>
                {section.section}
              </p>
            )}
            {section.section && collapsed && !mobileOpen && sIdx > 0 && (
              <div className="mx-3 mb-2 border-t border-white/10" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== `/${role}` && location.pathname.startsWith(item.path + "/"));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 group ${
                      isActive
                        ? "bg-white/12 text-white"
                        : "text-white/55 hover:bg-white/6 hover:text-white/90"
                    }`}
                    title={collapsed && !mobileOpen ? item.label : undefined}
                  >
                    <span className={`shrink-0 ${isActive ? "text-gold" : "text-white/45 group-hover:text-white/70"}`}>
                      {item.icon}
                    </span>
                    {(!collapsed || mobileOpen) && (
                      <span style={{ fontSize: 13.5, fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
                    )}
                    {isActive && (!collapsed || mobileOpen) && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-white/8 p-2.5 space-y-0.5 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/45 hover:bg-white/6 hover:text-white/80 transition-all"
          title={collapsed && !mobileOpen ? "Switch Role" : undefined}
        >
          <LogOut size={18} />
          {(!collapsed || mobileOpen) && <span style={{ fontSize: 13 }}>Switch Role</span>}
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: static, Mobile: overlay drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 lg:static lg:z-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          ${collapsed && !mobileOpen ? "lg:w-[68px]" : "w-[260px] lg:w-[248px]"}
          flex flex-col bg-navy transition-all duration-300 shrink-0
        `}
      >
        {sidebarContent}

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-sm hidden lg:flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          {collapsed ? <Menu size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-14 lg:h-16 bg-card border-b border-border flex items-center justify-between px-3 sm:px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg hover:bg-accent flex items-center justify-center transition-colors text-muted-foreground shrink-0"
            >
              <Menu size={20} />
            </button>
            {/* Mobile Logo */}
            <div className="lg:hidden w-7 h-7 rounded-md bg-gold flex items-center justify-center shrink-0">
              <span style={{ fontSize: 10, fontWeight: 700, color: "#1B2A4A" }}>OD</span>
            </div>
            <div className="min-w-0">
              <h2 className="truncate" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.2 }}>{pageTitle}</h2>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    placeholder="Search anything..."
                    className="h-9 w-40 sm:w-56 pl-9 pr-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                    style={{ fontSize: 13 }}
                    onBlur={() => setSearchOpen(false)}
                  />
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 rounded-lg hover:bg-accent flex items-center justify-center transition-colors text-muted-foreground"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Notifications */}
            <button className="w-9 h-9 rounded-lg hover:bg-accent flex items-center justify-center transition-colors text-muted-foreground relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold" />
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-border mx-0.5 sm:mx-1 hidden sm:block" />

            {/* User */}
            <button className="flex items-center gap-2 px-1.5 sm:px-2 py-1.5 rounded-lg hover:bg-accent transition-colors">
              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center">
                <span className="text-white" style={{ fontSize: 12, fontWeight: 600 }}>RK</span>
              </div>
              <div className="text-left hidden md:block">
                <p style={{ fontSize: 13, fontWeight: 500 }}>Rajesh Kumar</p>
                <p className="text-muted-foreground" style={{ fontSize: 11 }}>{config.label}</p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden md:block" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Public/Customer Shell with different layout
function PublicShellLayout({ config }: { config: typeof roleConfig.public }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useWindowScrollRestoration();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Public Topbar / Navbar */}
      <header className="h-14 md:h-16 bg-navy flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/public" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1B2A4A" }}>OD</span>
            </div>
            <span className="text-white hidden sm:inline" style={{ fontSize: 16, fontWeight: 600 }}>OutDo Shutters</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {config.nav[0].items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isActive ? "bg-white/12 text-white" : "text-white/60 hover:text-white hover:bg-white/6"
                  }`}
                  style={{ fontSize: 13.5, fontWeight: isActive ? 500 : 400 }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="px-3 sm:px-4 py-2 rounded-lg bg-gold text-navy hover:bg-gold-light transition-colors"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <span className="hidden sm:inline">Login / Portal</span>
            <span className="sm:hidden">Login</span>
          </Link>
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy border-b border-white/10 px-4 pb-4">
          <nav className="flex flex-col gap-1">
            {config.nav[0].items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? "bg-white/12 text-white" : "text-white/60 hover:text-white hover:bg-white/6"
                  }`}
                  style={{ fontSize: 14, fontWeight: isActive ? 500 : 400 }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white/60 py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center">
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1B2A4A" }}>OD</span>
              </div>
              <span className="text-white" style={{ fontSize: 15, fontWeight: 600 }}>OutDo Handleless Shutters</span>
            </div>
            <p style={{ fontSize: 13 }}>Premium handleless shutter solutions for modern spaces.</p>
          </div>
          <div className="flex gap-8 sm:gap-12">
            <div>
              <p className="text-white/40 uppercase mb-2" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em" }}>Products</p>
              <div className="space-y-1.5">
                {["Kitchen", "Wardrobe", "Office", "Bathroom"].map(c => (
                  <p key={c} style={{ fontSize: 13 }} className="hover:text-white cursor-pointer transition-colors">{c} Shutters</p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/40 uppercase mb-2" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em" }}>Company</p>
              <div className="space-y-1.5">
                {["About Us", "Partners", "Careers", "Blog"].map(c => (
                  <p key={c} style={{ fontSize: 13 }} className="hover:text-white cursor-pointer transition-colors">{c}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}