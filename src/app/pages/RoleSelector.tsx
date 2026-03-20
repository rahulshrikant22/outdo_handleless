import { useState } from "react";
import { Link } from "react-router";
import {
  Shield, Store, PenTool, Factory, Globe, ArrowRight, ChevronRight,
  Users, Building2, ShoppingCart, FileText, ClipboardList, CreditCard,
  LayoutDashboard, Truck, ArrowDown, DollarSign, Wrench, BarChart3
} from "lucide-react";

const roles = [
  {
    key: "admin",
    label: "Admin Portal",
    desc: "Full system access — leads, accounts, orders, users, finance",
    icon: <Shield size={24} />,
    gradient: "from-navy to-navy-light",
    path: "/admin",
    pages: ["Dashboard", "Leads", "Accounts", "Orders", "Quotations", "Tasks", "Payments", "Users", "Settings"],
  },
  {
    key: "dealer",
    label: "Dealer Portal",
    desc: "Account management, orders, quotations, payment tracking",
    icon: <Store size={24} />,
    gradient: "from-emerald-600 to-emerald-500",
    path: "/dealer",
    pages: ["Dashboard", "Accounts", "Orders", "Converted Orders", "Quotations", "Payments"],
  },
  {
    key: "architect",
    label: "Architect Portal",
    desc: "Projects, specifications, design reviews, order tracking",
    icon: <PenTool size={24} />,
    gradient: "from-violet-600 to-violet-500",
    path: "/architect",
    pages: ["Dashboard", "Projects", "Specifications", "Orders", "Project Orders"],
  },
  {
    key: "factory",
    label: "Factory Hub",
    desc: "Production management, tasks, dispatch, logistics",
    icon: <Factory size={24} />,
    gradient: "from-amber-600 to-amber-500",
    path: "/factory",
    pages: ["Dashboard", "Orders", "Tasks", "Production", "Dispatch", "Production Orders"],
  },
  {
    key: "public",
    label: "Customer & Public",
    desc: "Browse products, request quotes, customer login",
    icon: <Globe size={24} />,
    gradient: "from-sky-600 to-sky-500",
    path: "/public",
    pages: ["Home", "Products", "Contact", "Request Quote"],
  },
];

const flowSteps = [
  { label: "Lead", icon: <Users size={16} />, count: 22, color: "bg-blue-500" },
  { label: "Account", icon: <Building2 size={16} />, count: 8, color: "bg-violet-500" },
  { label: "Order", icon: <ShoppingCart size={16} />, count: 7, color: "bg-navy" },
  { label: "Quotation", icon: <FileText size={16} />, count: 7, color: "bg-amber-500" },
  { label: "Task", icon: <ClipboardList size={16} />, count: 23, color: "bg-emerald-500" },
  { label: "Payment", icon: <CreditCard size={16} />, count: 4, color: "bg-gold-dark" },
  { label: "Dispatch", icon: <Truck size={16} />, count: 1, color: "bg-sky-500" },
  { label: "Converted", icon: <Wrench size={16} />, count: 3, color: "bg-orange-500" },
  { label: "Dashboard", icon: <LayoutDashboard size={16} />, count: null, color: "bg-navy" },
];

export function RoleSelector() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold flex items-center justify-center">
              <span style={{ fontSize: 16, fontWeight: 800, color: "#1B2A4A" }}>OD</span>
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: "white" }}>
                OutDo Handleless Shutters
              </h1>
              <p className="text-white/50" style={{ fontSize: 13 }}>Multi-Role Business Management System</p>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl" style={{ fontSize: 15, lineHeight: 1.6 }}>
            Enterprise-grade platform managing the complete lifecycle — from lead capture through production to delivery. 
            Select a role below to explore the application.
          </p>
        </div>
      </div>

      {/* Role Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Link
              key={role.key}
              to={role.path}
              className="group bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:border-gold/30 transition-all duration-200 relative overflow-hidden"
              onMouseEnter={() => setHoveredRole(role.key)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              {/* Accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white shrink-0`}>
                  {role.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-foreground" style={{ fontSize: 16, fontWeight: 600 }}>{role.label}</p>
                    <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: 13 }}>{role.desc}</p>
                  
                  {/* Pages preview */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {role.pages.slice(0, 5).map((page) => (
                      <span
                        key={page}
                        className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                        style={{ fontSize: 11, fontWeight: 500 }}
                      >
                        {page}
                      </span>
                    ))}
                    {role.pages.length > 5 && (
                      <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground" style={{ fontSize: 11 }}>
                        +{role.pages.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Master Flow Map */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>Master Data Flow</h2>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: 13 }}>
                Correlated data model: Lead to Account to Order to Delivery
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-gold/10 text-gold-dark" style={{ fontSize: 12, fontWeight: 500 }}>
              Live Data Model
            </span>
          </div>

          {/* Flow visualization */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {flowSteps.map((step, idx) => (
              <div key={step.label} className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center gap-1.5 min-w-[72px]">
                  <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center text-white`}>
                    {step.icon}
                  </div>
                  <p className="text-foreground" style={{ fontSize: 12, fontWeight: 600 }}>{step.label}</p>
                  {step.count !== null && (
                    <span className="text-muted-foreground" style={{ fontSize: 11 }}>{step.count} records</span>
                  )}
                </div>
                {idx < flowSteps.length - 1 && (
                  <ChevronRight size={16} className="text-border shrink-0 mx-0.5" />
                )}
              </div>
            ))}
          </div>

          {/* Partner visibility */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-muted-foreground mb-3" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.03em" }}>
              PARTNER PORTAL VISIBILITY
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { role: "Dealer", color: "border-emerald-200 bg-emerald-50/50", items: ["My Leads", "Accounts", "Orders", "Converted Orders", "Quotations", "Payments"] },
                { role: "Architect", color: "border-violet-200 bg-violet-50/50", items: ["My Leads", "Projects", "Specifications", "Orders", "Project Orders"] },
                { role: "Factory", color: "border-amber-200 bg-amber-50/50", items: ["My Leads", "Orders", "Tasks", "Production", "Dispatch", "Production Orders"] },
              ].map((p) => (
                <div key={p.role} className={`rounded-lg border ${p.color} p-3`}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{p.role} Portal</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.items.map((item) => (
                      <span key={item} className="px-2 py-0.5 rounded bg-white/80 text-muted-foreground" style={{ fontSize: 11 }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Admin Dashboard", path: "/admin", icon: <LayoutDashboard size={16} /> },
            { label: "Sales Analytics", path: "/admin/sales/dashboard", icon: <BarChart3 size={16} /> },
            { label: "Task Management", path: "/admin/tasks/dashboard", icon: <ClipboardList size={16} /> },
            { label: "Operations", path: "/admin/operations/dashboard", icon: <Wrench size={16} /> },
            { label: "CRM Lead Master", path: "/admin/crm/leads", icon: <Users size={16} /> },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-gold/30 hover:shadow-sm transition-all group"
            >
              <span className="text-muted-foreground group-hover:text-gold transition-colors">{link.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{link.label}</span>
              <ArrowRight size={14} className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}