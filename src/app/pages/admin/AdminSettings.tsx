import { useState } from "react";
import { PageShell } from "../../components/layout/PageShell";
import { TabBar, Button, SummaryCard, InputField, SelectField, AlertCard, Tooltip, ActivityLog } from "../../components/shared";
import { Building2, Bell, Shield, Link, CreditCard, Database, Save, CheckCircle2 } from "lucide-react";
import { handleExport, handleDownloadPDF } from "../../components/shared/GlobalModals";
import { toast } from "sonner";

const auditLog = [
  { id: "s1", user: "Admin", action: "updated company GST number", target: "", time: "Mar 15, 2026 — 3:45 PM", type: "update" as const },
  { id: "s2", user: "Admin", action: "enabled WhatsApp integration", target: "", time: "Mar 10, 2026 — 11:00 AM", type: "create" as const },
  { id: "s3", user: "System", action: "auto-renewed Enterprise Plan billing", target: "", time: "Mar 1, 2026 — 12:00 AM", type: "system" as const },
  { id: "s4", user: "Admin", action: "updated notification preferences for", target: "Daily Digest", time: "Feb 25, 2026", type: "update" as const },
  { id: "s5", user: "Admin", action: "exported full backup", target: "— 2.3 MB", time: "Feb 15, 2026", type: "system" as const },
];

const sections = [
  { key: "company", label: "Company", icon: <Building2 size={16} /> },
  { key: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { key: "permissions", label: "Permissions", icon: <Shield size={16} /> },
  { key: "integrations", label: "Integrations", icon: <Link size={16} /> },
  { key: "billing", label: "Billing", icon: <CreditCard size={16} /> },
  { key: "data", label: "Data & Audit", icon: <Database size={16} /> },
];

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <PageShell
      title="Settings"
      subtitle="System configuration, permissions, and audit trail"
      actions={
        <Tooltip text="Save all pending changes">
          <Button variant="primary" size="sm" icon={<Save size={14} />} onClick={() => toast.success("Settings saved", { description: "All changes have been applied." })}>Save Changes</Button>
        </Tooltip>
      }
    >
      <TabBar
        tabs={sections.map(s => ({ key: s.key, label: s.label }))}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6 max-w-2xl">
        {activeTab === "company" && (
          <div className="space-y-6">
            <SummaryCard title="Company Profile">
              <div className="space-y-4">
                <InputField label="Company Name" value="OutDo Handleless Shutters" />
                <InputField label="Business Email" value="info@outdo.in" type="email" />
                <InputField label="Phone" value="+91-22-12345678" />
                <InputField label="Website" value="www.outdo.in" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="City" value="Mumbai" />
                  <InputField label="State" value="Maharashtra" />
                </div>
                <InputField label="GST Number" value="27AABCU9603R1ZM" />
                <InputField label="PAN Number" value="AABCU9603R" />
              </div>
            </SummaryCard>

            <SummaryCard title="Business Address">
              <div className="space-y-4">
                <InputField label="Registered Office" value="Plot 14, MIDC Industrial Area, Andheri East" />
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="PIN Code" value="400093" />
                  <InputField label="Country" value="India" />
                </div>
              </div>
            </SummaryCard>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <AlertCard type="info" title="Notification Preferences" message="Configure how you and your team receive alerts, updates, and digest summaries." />
            <SummaryCard title="Email Notifications">
              <div className="space-y-3">
                {[
                  { item: "New lead assignments", desc: "When a lead is assigned to your team" },
                  { item: "Order status updates", desc: "When an order changes status" },
                  { item: "Payment received", desc: "When a payment is recorded" },
                  { item: "Task assignments", desc: "When you're assigned a new task" },
                  { item: "Overdue alerts", desc: "When payments or tasks are overdue" },
                  { item: "Daily digest", desc: "Daily summary of all activity" },
                ].map((n) => (
                  <div key={n.item} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <div>
                      <span style={{ fontSize: 14 }}>{n.item}</span>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{n.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-gold transition-colors" />
                    </label>
                  </div>
                ))}
              </div>
            </SummaryCard>
          </div>
        )}

        {activeTab === "permissions" && (
          <div className="space-y-4">
            <AlertCard type="info" title="Role-Based Access Control" message="Configure what each user role can access within the system. Changes take effect immediately." />
            <SummaryCard title="Role Permissions">
              <div className="space-y-3">
                {[
                  { role: "Admin", access: "Full system access — CRM, Orders, Finance, Settings", users: 2 },
                  { role: "Dealer", access: "View own accounts, orders, quotations, payments", users: 2 },
                  { role: "Architect", access: "View assigned projects, specs, converted orders", users: 2 },
                  { role: "Factory", access: "View orders, tasks, production, dispatch", users: 2 },
                  { role: "Customer", access: "View own orders, quotations (read-only)", users: 4 },
                ].map((r) => (
                  <div key={r.role} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p style={{ fontSize: 14, fontWeight: 500 }}>{r.role}</p>
                        <span className="text-muted-foreground px-1.5 py-0.5 bg-muted rounded-full" style={{ fontSize: 11 }}>{r.users} users</span>
                      </div>
                      <p className="text-muted-foreground" style={{ fontSize: 12.5 }}>{r.access}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.info("Integration settings", { description: `Opening ${r.role} permission configuration.` })}>Configure</Button>
                  </div>
                ))}
              </div>
            </SummaryCard>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="space-y-4">
            <SummaryCard title="Connected Services">
              <div className="space-y-3">
                {[
                  { name: "Tally ERP", status: "Connected", desc: "Accounting & invoicing sync", lastSync: "Mar 17, 2026 — 2:00 PM" },
                  { name: "WhatsApp Business", status: "Not connected", desc: "Customer messaging & notifications", lastSync: "—" },
                  { name: "Google Workspace", status: "Connected", desc: "Email, calendar & drive integration", lastSync: "Mar 17, 2026 — 1:30 PM" },
                  { name: "Razorpay", status: "Connected", desc: "Online payment processing", lastSync: "Mar 16, 2026 — 11:00 AM" },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</p>
                        {s.status === "Connected" && <CheckCircle2 size={14} className="text-emerald-500" />}
                      </div>
                      <p className="text-muted-foreground" style={{ fontSize: 12.5 }}>{s.desc}</p>
                      {s.status === "Connected" && (
                        <p className="text-muted-foreground" style={{ fontSize: 11 }}>Last synced: {s.lastSync}</p>
                      )}
                    </div>
                    <Button variant={s.status === "Connected" ? "outline" : "primary"} size="sm" onClick={() => toast.info(s.status === "Connected" ? `${s.name} settings` : `Connecting ${s.name}...`, { description: s.status === "Connected" ? "Integration management panel opening." : "Follow the authorization flow to connect." })}>
                      {s.status === "Connected" ? "Manage" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </SummaryCard>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-4">
            <SummaryCard title="Current Plan">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: 18, fontWeight: 600 }}>Enterprise Plan</p>
                  <p className="text-muted-foreground" style={{ fontSize: 13 }}>Unlimited users, all features, priority support</p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: 12 }}>Next billing: April 1, 2026</p>
                </div>
                <div className="text-right">
                  <p className="text-gold-dark" style={{ fontSize: 24, fontWeight: 700 }}>₹4,999</p>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>per month</p>
                </div>
              </div>
            </SummaryCard>

            <SummaryCard title="Billing History">
              <div className="space-y-2">
                {[
                  { date: "Mar 1, 2026", amount: "₹4,999", status: "Paid", invoice: "INV-2026-003" },
                  { date: "Feb 1, 2026", amount: "₹4,999", status: "Paid", invoice: "INV-2026-002" },
                  { date: "Jan 1, 2026", amount: "₹4,999", status: "Paid", invoice: "INV-2026-001" },
                ].map((b) => (
                  <div key={b.invoice} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{b.invoice}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{b.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{b.amount}</span>
                      <span className="text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-200" style={{ fontSize: 11 }}>{b.status}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF("Backup")}>Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </SummaryCard>
          </div>
        )}

        {activeTab === "data" && (
          <div className="space-y-4">
            <AlertCard type="warning" title="Data Management" message="Export, backup, or purge system data. Some operations cannot be undone — proceed with caution." />
            <SummaryCard title="Export Options">
              <div className="space-y-3">
                {[
                  { item: "Leads", records: "22 records", size: "~12 KB" },
                  { item: "Accounts", records: "8 records", size: "~8 KB" },
                  { item: "Orders", records: "4 records", size: "~6 KB" },
                  { item: "Payments", records: "7 records", size: "~5 KB" },
                  { item: "Tasks", records: "23 records", size: "~15 KB" },
                  { item: "Full Backup", records: "All data", size: "~2.3 MB" },
                ].map((item) => (
                  <div key={item.item} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <div>
                      <span style={{ fontSize: 14 }}>{item.item}</span>
                      <p className="text-muted-foreground" style={{ fontSize: 12 }}>{item.records} · {item.size}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleExport("Audit Log")}>Export CSV</Button>
                  </div>
                ))}
              </div>
            </SummaryCard>

            <SummaryCard title="System Audit Log">
              <ActivityLog entries={auditLog} maxItems={5} />
            </SummaryCard>
          </div>
        )}
      </div>
    </PageShell>
  );
}