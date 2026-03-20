import { createBrowserRouter, Navigate } from "react-router";

import { RoleSelector } from "./pages/RoleSelector";
import { AppShell } from "./components/layout/AppShell";

// Admin pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminLeads } from "./pages/admin/AdminLeads";
import { AdminAccounts } from "./pages/admin/AdminAccounts";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminQuotations } from "./pages/admin/AdminQuotations";
import { AdminTasks } from "./pages/admin/AdminTasks";
import { AdminPayments } from "./pages/admin/AdminPayments";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminSettings } from "./pages/admin/AdminSettings";

// Admin CRM pages
import { CRMLeadMaster } from "./pages/admin/crm/CRMLeadMaster";
import { CRMLeadDetail } from "./pages/admin/crm/CRMLeadDetail";
import { CRMDealerLeads } from "./pages/admin/crm/CRMDealerLeads";
import { CRMFactoryLeads } from "./pages/admin/crm/CRMFactoryLeads";
import { CRMArchitectLeads } from "./pages/admin/crm/CRMArchitectLeads";
import { CRMOrganicLeads } from "./pages/admin/crm/CRMOrganicLeads";
import { CRMAccountsList } from "./pages/admin/crm/CRMAccountsList";
import { CRMAccountDetail } from "./pages/admin/crm/CRMAccountDetail";
import { CRMDealerLocator } from "./pages/admin/crm/CRMDealerLocator";

// Admin Orders & Quotations (Phase 3)
import { OrdersDashboard } from "./pages/admin/orders/OrdersDashboard";
import { OrdersTable } from "./pages/admin/orders/OrdersTable";
import { OrderDetail } from "./pages/admin/orders/OrderDetail";
import { QuotationBuilder } from "./pages/admin/orders/QuotationBuilder";
import { QuotationDetail } from "./pages/admin/orders/QuotationDetail";

// Admin Pricing Management (Phase 4)
import { PricingDashboard } from "./pages/admin/pricing/PricingDashboard";
import { PricingTable } from "./pages/admin/pricing/PricingTable";
import { PricingDetail } from "./pages/admin/pricing/PricingDetail";

// Admin Operations (Phase 5A)
import { OperationsDashboard } from "./pages/admin/operations/OperationsDashboard";
import { ConvertedOrdersTable } from "./pages/admin/operations/ConvertedOrdersTable";
import { ConvertedOrderDetail } from "./pages/admin/operations/ConvertedOrderDetail";

// Admin Task Management (Phase 6)
import { TaskDashboard } from "./pages/admin/tasks/TaskDashboard";
import { TaskMasterTable } from "./pages/admin/tasks/TaskMasterTable";
import { TaskDetailPage } from "./pages/admin/tasks/TaskDetailPage";
import { TaskForm } from "./pages/admin/tasks/TaskForm";
import { MyTasks } from "./pages/admin/tasks/MyTasks";
import { ProjectTaskSummary } from "./pages/admin/tasks/ProjectTaskSummary";

// Admin Sales Analytics (Phase 7)
import { SalesDashboard } from "./pages/admin/sales/SalesDashboard";
import { SalespersonPerformance } from "./pages/admin/sales/SalespersonPerformance";
import { TerritoryPerformance } from "./pages/admin/sales/TerritoryPerformance";
import { SalesAnalysis } from "./pages/admin/sales/SalesAnalysis";

// Admin Finance (Phase 8)
import { FinanceDashboard } from "./pages/admin/finance/FinanceDashboard";
import { FinanceOrderTable } from "./pages/admin/finance/FinanceOrderTable";
import { FinanceLedger } from "./pages/admin/finance/FinanceLedger";

// Dealer pages
import { DealerDashboard } from "./pages/dealer/DealerDashboard";
import { DealerLeads } from "./pages/dealer/DealerLeads";
import { DealerAccounts } from "./pages/dealer/DealerAccounts";
import { DealerOrders } from "./pages/dealer/DealerOrders";
import { DealerQuotations } from "./pages/dealer/DealerQuotations";
import { DealerPayments } from "./pages/dealer/DealerPayments";
import { DealerConvertedOrders } from "./pages/dealer/DealerConvertedOrders";

// Architect pages
import { ArchitectDashboard } from "./pages/architect/ArchitectDashboard";
import { ArchitectLeads } from "./pages/architect/ArchitectLeads";
import { ArchitectProjects } from "./pages/architect/ArchitectProjects";
import { ArchitectSpecifications } from "./pages/architect/ArchitectSpecifications";
import { ArchitectOrders } from "./pages/architect/ArchitectOrders";
import { ArchitectConvertedOrders } from "./pages/architect/ArchitectConvertedOrders";

// Factory pages
import { FactoryDashboard } from "./pages/factory/FactoryDashboard";
import { FactoryLeads } from "./pages/factory/FactoryLeads";
import { FactoryOrders } from "./pages/factory/FactoryOrders";
import { FactoryTasks } from "./pages/factory/FactoryTasks";
import { FactoryProduction } from "./pages/factory/FactoryProduction";
import { FactoryDispatch } from "./pages/factory/FactoryDispatch";
import { FactoryConvertedOrders } from "./pages/factory/FactoryConvertedOrders";

// Public pages
import { PublicHome } from "./pages/public/PublicHome";
import { PublicProducts } from "./pages/public/PublicProducts";
import { PublicContact } from "./pages/public/PublicContact";
import { PublicQuote } from "./pages/public/PublicQuote";

// Wrapper components
function AdminShell() { return <AppShell role="admin" />; }
function DealerShell() { return <AppShell role="dealer" />; }
function ArchitectShell() { return <AppShell role="architect" />; }
function FactoryShell() { return <AppShell role="factory" />; }
function PublicShell() { return <AppShell role="public" />; }

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RoleSelector,
  },
  // Admin
  {
    path: "/admin",
    Component: AdminShell,
    children: [
      { index: true, Component: AdminDashboard },
      // Legacy routes (kept for backward compat)
      { path: "leads", element: <Navigate to="/admin/crm/leads" replace /> },
      { path: "accounts", element: <Navigate to="/admin/crm/accounts" replace /> },
      // CRM Module
      { path: "crm/leads", Component: CRMLeadMaster },
      { path: "crm/leads/:leadId", Component: CRMLeadDetail },
      { path: "crm/dealer", Component: CRMDealerLeads },
      { path: "crm/factory", Component: CRMFactoryLeads },
      { path: "crm/architect", Component: CRMArchitectLeads },
      { path: "crm/organic", Component: CRMOrganicLeads },
      { path: "crm/accounts", Component: CRMAccountsList },
      { path: "crm/accounts/:accountId", Component: CRMAccountDetail },
      { path: "crm/locator", Component: CRMDealerLocator },
      // Orders & Quotations Module (Phase 3)
      { path: "orders/dashboard", Component: OrdersDashboard },
      { path: "orders/table", Component: OrdersTable },
      { path: "orders/:orderId", Component: OrderDetail },
      { path: "orders/quotation/new", Component: QuotationBuilder },
      { path: "orders/quotation/:quotationId", Component: QuotationDetail },
      // Pricing Management Module (Phase 4)
      { path: "pricing/dashboard", Component: PricingDashboard },
      { path: "pricing/table", Component: PricingTable },
      { path: "pricing/:pricingId", Component: PricingDetail },
      // Converted Orders / Operations Module (Phase 5A)
      { path: "operations/dashboard", Component: OperationsDashboard },
      { path: "operations/table", Component: ConvertedOrdersTable },
      { path: "operations/:coId", Component: ConvertedOrderDetail },
      // Task Management Module (Phase 6)
      { path: "tasks/dashboard", Component: TaskDashboard },
      { path: "tasks/table", Component: TaskMasterTable },
      { path: "tasks/new", Component: TaskForm },
      { path: "tasks/my-tasks", Component: MyTasks },
      { path: "tasks/projects", Component: ProjectTaskSummary },
      { path: "tasks/:taskId", Component: TaskDetailPage },
      { path: "tasks/:taskId/edit", Component: TaskForm },
      // Sales Analytics Module (Phase 7)
      { path: "sales/dashboard", Component: SalesDashboard },
      { path: "sales/salesperson", Component: SalespersonPerformance },
      { path: "sales/territory", Component: TerritoryPerformance },
      { path: "sales/analysis", Component: SalesAnalysis },
      // Finance Module (Phase 8)
      { path: "finance/dashboard", Component: FinanceDashboard },
      { path: "finance/table", Component: FinanceOrderTable },
      { path: "finance/ledger/:financeId", Component: FinanceLedger },
      // Legacy operations
      { path: "orders", Component: AdminOrders },
      { path: "quotations", Component: AdminQuotations },
      { path: "tasks", Component: AdminTasks },
      { path: "payments", Component: AdminPayments },
      { path: "users", Component: AdminUsers },
      { path: "settings", Component: AdminSettings },
    ],
  },
  // Dealer
  {
    path: "/dealer",
    Component: DealerShell,
    children: [
      { index: true, Component: DealerDashboard },
      { path: "leads", Component: DealerLeads },
      { path: "accounts", Component: DealerAccounts },
      { path: "orders", Component: DealerOrders },
      { path: "quotations", Component: DealerQuotations },
      { path: "payments", Component: DealerPayments },
      { path: "converted-orders", Component: DealerConvertedOrders },
    ],
  },
  // Architect
  {
    path: "/architect",
    Component: ArchitectShell,
    children: [
      { index: true, Component: ArchitectDashboard },
      { path: "leads", Component: ArchitectLeads },
      { path: "projects", Component: ArchitectProjects },
      { path: "specifications", Component: ArchitectSpecifications },
      { path: "orders", Component: ArchitectOrders },
      { path: "converted-orders", Component: ArchitectConvertedOrders },
    ],
  },
  // Factory
  {
    path: "/factory",
    Component: FactoryShell,
    children: [
      { index: true, Component: FactoryDashboard },
      { path: "leads", Component: FactoryLeads },
      { path: "orders", Component: FactoryOrders },
      { path: "tasks", Component: FactoryTasks },
      { path: "production", Component: FactoryProduction },
      { path: "dispatch", Component: FactoryDispatch },
      { path: "converted-orders", Component: FactoryConvertedOrders },
    ],
  },
  // Public / Customer
  {
    path: "/public",
    Component: PublicShell,
    children: [
      { index: true, Component: PublicHome },
      { path: "products", Component: PublicProducts },
      { path: "contact", Component: PublicContact },
      { path: "quote", Component: PublicQuote },
    ],
  },
]);