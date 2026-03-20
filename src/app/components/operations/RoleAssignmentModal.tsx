import { useState } from "react";
import { Modal, Button, SelectField } from "../shared";
import { opsStaff, opsRoleOptions, type ConvertedOrder, type RoleAssignment } from "../../data/operations";
import { UserPlus, Save } from "lucide-react";

interface RoleAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  order: ConvertedOrder;
  editRole?: RoleAssignment | null;
}

export function RoleAssignmentModal({ open, onClose, order, editRole }: RoleAssignmentModalProps) {
  const isEdit = !!editRole;
  const [selectedRole, setSelectedRole] = useState(editRole?.roleLabel || "");
  const [selectedStaff, setSelectedStaff] = useState(editRole?.userId || "");

  const filteredStaff = selectedRole
    ? opsStaff.filter(s => s.role === selectedRole || selectedRole === "")
    : opsStaff;

  const handleSubmit = () => {
    // In real app, update order roles
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Reassign: ${editRole?.roleLabel}` : "Assign Role"}
      size="md"
    >
      <div className="space-y-5">
        {/* Current assignments */}
        {!isEdit && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-muted-foreground mb-2" style={{ fontSize: 12, fontWeight: 500 }}>Current Assignments</p>
            <div className="space-y-1.5">
              {order.roles.map(r => (
                <div key={r.role} className="flex items-center justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>{r.roleLabel}</span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{r.userName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isEdit && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-amber-800" style={{ fontSize: 13, fontWeight: 500 }}>
              Current: {editRole?.userName}
            </p>
            <p className="text-amber-700 mt-0.5" style={{ fontSize: 12 }}>
              Assigned on {editRole?.assignedAt} by {editRole?.assignedBy}
            </p>
          </div>
        )}

        <SelectField
          label="Role"
          placeholder="Select role..."
          options={opsRoleOptions.map(r => ({ label: r, value: r }))}
          value={selectedRole}
          onChange={(v) => { setSelectedRole(v); setSelectedStaff(""); }}
        />

        <SelectField
          label="Assign To"
          placeholder="Select staff member..."
          options={
            selectedRole
              ? opsStaff.filter(s => s.role === selectedRole).map(s => ({ label: `${s.name} — ${s.city}`, value: s.id }))
              : opsStaff.map(s => ({ label: `${s.name} — ${s.role} (${s.city})`, value: s.id }))
          }
          value={selectedStaff}
          onChange={setSelectedStaff}
        />

        {selectedStaff && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            {(() => {
              const staff = opsStaff.find(s => s.id === selectedStaff);
              return staff ? (
                <>
                  <p className="text-emerald-800" style={{ fontSize: 13, fontWeight: 500 }}>{staff.name}</p>
                  <p className="text-emerald-700 mt-0.5" style={{ fontSize: 12 }}>
                    {staff.role} · {staff.department} · {staff.city}
                  </p>
                </>
              ) : null;
            })()}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            variant="gold"
            size="sm"
            className="flex-1"
            icon={isEdit ? <Save size={14} /> : <UserPlus size={14} />}
            onClick={handleSubmit}
            disabled={!selectedRole || !selectedStaff}
          >
            {isEdit ? "Reassign" : "Assign Role"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
