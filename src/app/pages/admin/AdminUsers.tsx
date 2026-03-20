import { useState } from "react";
import { PageShell } from "../../components/layout/PageShell";
import {
  StatusBadge, FilterBar, SortableDataTable, Button, Drawer,
  DetailField, SummaryCard, Modal, InputField, SelectField, RowActions, Tooltip, ActivityLog
} from "../../components/shared";
import { users } from "../../data";
import { Plus, Download, UserCog, Shield, Clock } from "lucide-react";
import { handleExport, EditUserModal, DeactivateModal } from "../../components/shared/GlobalModals";
import { toast } from "sonner";

const userActivity = [
  { id: "ua1", user: "Admin", action: "created user account for", target: "Vikram Desai", time: "Mar 15, 2026", type: "create" as const },
  { id: "ua2", user: "System", action: "updated permissions for role:", target: "Factory", time: "Mar 12, 2026", type: "system" as const },
  { id: "ua3", user: "Admin", action: "deactivated user:", target: "Old Factory User", time: "Feb 28, 2026", type: "delete" as const },
  { id: "ua4", user: "Priya Patel", action: "changed password", target: "", time: "Feb 20, 2026", type: "update" as const },
];

export function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [selected, setSelected] = useState<typeof users[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const filtered = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    if (cityFilter && u.city !== cityFilter) return false;
    return true;
  });

  const cities = [...new Set(users.map(u => u.city))];

  return (
    <PageShell
      title="Users"
      subtitle={`${users.length} system users · ${users.filter(u => u.role === "admin").length} admins · ${users.filter(u => u.role === "dealer").length} dealers`}
      actions={
        <div className="flex items-center gap-2">
          <Tooltip text="Export user list">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => handleExport("Users")}>Export</Button>
          </Tooltip>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setShowAddModal(true)}>Add User</Button>
        </div>
      }
    >
      <div className="mb-4">
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name or email..."
          filters={[
            {
              label: "All Roles",
              value: roleFilter,
              onChange: setRoleFilter,
              options: [
                { label: "Admin", value: "admin" },
                { label: "Dealer", value: "dealer" },
                { label: "Architect", value: "architect" },
                { label: "Factory", value: "factory" },
                { label: "Customer", value: "customer" },
              ],
            },
            {
              label: "All Cities",
              value: cityFilter,
              onChange: setCityFilter,
              options: cities.map(c => ({ label: c, value: c })),
            },
          ]}
        />
      </div>

      <SortableDataTable
        data={filtered}
        keyField="id"
        pageSize={8}
        onRowClick={(u) => setSelected(u)}
        rowActions={(u) => (
          <RowActions
            onView={() => setSelected(u)}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        )}
        columns={[
          { key: "id", label: "ID", width: "70px", sortable: true, render: (u) => <span className="text-muted-foreground" style={{ fontSize: 12.5 }}>{u.id}</span> },
          {
            key: "name", label: "User", sortable: true,
            render: (u) => (
              <div className="flex items-center gap-3">
                <Tooltip text={`${u.role.charAt(0).toUpperCase() + u.role.slice(1)} user`}>
                  <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center shrink-0">
                    <span className="text-white" style={{ fontSize: 11, fontWeight: 600 }}>{u.name.split(" ").map((n: string) => n[0]).join("")}</span>
                  </div>
                </Tooltip>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 500 }}>{u.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>{u.email}</p>
                </div>
              </div>
            ),
          },
          { key: "city", label: "City", sortable: true },
          {
            key: "role", label: "Role", sortable: true,
            render: (u) => <StatusBadge status={u.role} />,
          },
          {
            key: "lastLogin", label: "Last Active", sortable: true, tooltip: "Last login time",
            render: () => (
              <span className="text-muted-foreground flex items-center gap-1" style={{ fontSize: 12.5 }}>
                <Clock size={12} /> 2h ago
              </span>
            ),
          },
        ]}
      />

      {/* User Detail Drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected ? selected.name : ""}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center">
                <span className="text-white" style={{ fontSize: 18, fontWeight: 600 }}>{selected.name.split(" ").map((n: string) => n[0]).join("")}</span>
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 16, fontWeight: 600 }}>{selected.name}</p>
                <StatusBadge status={selected.role} size="sm" />
              </div>
            </div>

            <SummaryCard title="User Information">
              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Email" value={selected.email} />
                <DetailField label="City" value={selected.city} />
                <DetailField label="Role" value={<StatusBadge status={selected.role} />} />
                <DetailField label="User ID" value={selected.id} />
                <DetailField label="Last Login" value="Mar 17, 2026 — 2:30 PM" />
                <DetailField label="Created" value="Oct 1, 2025" />
              </div>
            </SummaryCard>

            <SummaryCard title="Permissions">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                <Shield size={16} className="text-muted-foreground" />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{selected.role.charAt(0).toUpperCase() + selected.role.slice(1)} Access</p>
                  <p className="text-muted-foreground" style={{ fontSize: 12 }}>
                    {selected.role === "admin" ? "Full system access — all modules" :
                     selected.role === "dealer" ? "View own accounts, orders, quotations" :
                     selected.role === "architect" ? "View assigned projects, specifications" :
                     selected.role === "factory" ? "View orders, tasks, production, dispatch" :
                     "Limited access — customer portal only"}
                  </p>
                </div>
              </div>
            </SummaryCard>

            <SummaryCard title="Recent Activity">
              <ActivityLog entries={userActivity} maxItems={3} />
            </SummaryCard>

            <div className="flex gap-2 pt-2">
              <Button variant="primary" size="sm" className="flex-1" onClick={() => setEditUserOpen(true)}>Edit User</Button>
              <Button variant="danger" size="sm" className="flex-1" onClick={() => setDeactivateOpen(true)}>Deactivate</Button>
            </div>
          </div>
        )}
      </Drawer>

      <EditUserModal open={editUserOpen} onClose={() => setEditUserOpen(false)} user={selected} />
      <DeactivateModal open={deactivateOpen} onClose={() => setDeactivateOpen(false)} entityName={selected?.name || ""} entityType="User" />

      {/* Add User Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New User" size="md">
        <div className="space-y-4">
          <InputField label="Full Name" placeholder="Enter full name" />
          <InputField label="Email" placeholder="Enter email address" type="email" />
          <InputField label="Phone" placeholder="+91 XXXXXXXXXX" />
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Role"
              placeholder="Select role"
              options={[
                { label: "Admin", value: "admin" },
                { label: "Dealer", value: "dealer" },
                { label: "Architect", value: "architect" },
                { label: "Factory", value: "factory" },
              ]}
            />
            <SelectField
              label="City"
              placeholder="Select city"
              options={[
                { label: "Mumbai", value: "Mumbai" },
                { label: "Delhi", value: "Delhi" },
                { label: "Bangalore", value: "Bangalore" },
                { label: "Hyderabad", value: "Hyderabad" },
                { label: "Ahmedabad", value: "Ahmedabad" },
                { label: "Pune", value: "Pune" },
                { label: "Chennai", value: "Chennai" },
              ]}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={() => { toast.success("User created successfully", { description: "New user account has been activated." }); setShowAddModal(false); }}>Create User</Button>
          </div>
        </div>
      </Modal>
    </PageShell>
  );
}
