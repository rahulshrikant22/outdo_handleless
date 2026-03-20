import { useState } from "react";
import { Modal, Button, InputField, SelectField, DateField, AlertCard } from "./index";
import { toast } from "sonner";
import {
  Download, Plus, Save, Send, Printer, Phone, Mail, CheckCircle2,
  XCircle, Package, CreditCard, Building2, Users, ClipboardList,
  Edit, Trash2, AlertTriangle, FileText, Upload
} from "lucide-react";

// ======================== EXPORT UTILITY ========================
export function handleExport(type: string) {
  toast.success(`${type} export started`, {
    description: `Your ${type.toLowerCase()} data is being prepared for download as CSV.`,
    duration: 3000,
  });
  setTimeout(() => {
    toast.info("Download ready", {
      description: `${type}_export_${new Date().toISOString().slice(0, 10)}.csv`,
      duration: 4000,
    });
  }, 1500);
}

export function handleDownloadPDF(docName: string) {
  toast.success("Generating PDF...", {
    description: `${docName} PDF is being generated.`,
    duration: 2500,
  });
  setTimeout(() => {
    toast.info("PDF ready for download", {
      description: `${docName}.pdf`,
      duration: 4000,
    });
  }, 1800);
}

export function handlePrint(docName: string) {
  toast.info("Preparing print preview...", {
    description: `${docName} will open in print dialog.`,
    duration: 2500,
  });
}

export function handleSaveDraft(docName: string) {
  toast.success("Draft saved", {
    description: `${docName} has been saved as draft.`,
    duration: 3000,
  });
}

export function handleSendAction(docName: string) {
  toast.success("Sent successfully", {
    description: `${docName} has been sent to the client.`,
    duration: 3000,
  });
}

// ======================== ADD ACCOUNT MODAL ========================
export function AddAccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("dealer");
  const [classification, setClassification] = useState("");
  const [gst, setGst] = useState("");
  const [salesperson, setSalesperson] = useState("");
  const [address, setAddress] = useState("");

  const reset = () => {
    setCompany(""); setContact(""); setEmail(""); setPhone(""); setCity("");
    setType("dealer"); setClassification(""); setGst(""); setSalesperson(""); setAddress("");
  };

  const handleSubmit = () => {
    if (!company || !contact || !phone) {
      toast.error("Please fill required fields", { description: "Company, Contact, and Phone are required." });
      return;
    }
    toast.success("Account created successfully", {
      description: `${company} has been added as a ${type} account.`,
    });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Add New Account" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Company Name *" placeholder="e.g., ABC Interiors" value={company} onChange={setCompany} />
          <InputField label="Contact Person *" placeholder="e.g., John Doe" value={contact} onChange={setContact} />
          <InputField label="Email" placeholder="e.g., john@abc.in" value={email} onChange={setEmail} type="email" />
          <InputField label="Phone *" placeholder="+91-XXXXXXXXXX" value={phone} onChange={setPhone} />
          <InputField label="City" placeholder="e.g., Mumbai" value={city} onChange={setCity} />
          <SelectField
            label="Account Type"
            value={type}
            onChange={(v) => { setType(v); setClassification(""); }}
            options={[
              { label: "Dealer", value: "dealer" },
              { label: "Factory", value: "factory" },
              { label: "Architect", value: "architect" },
            ]}
          />
          <SelectField
            label="Classification"
            value={classification}
            onChange={setClassification}
            placeholder="Select..."
            options={
              type === "dealer"
                ? [{ label: "Dealer with Display", value: "dealer_display" }, { label: "Dealer with Sample", value: "dealer_sample" }, { label: "Dealer without Display", value: "dealer_none" }]
                : type === "factory"
                ? [{ label: "Factory Partner", value: "factory_partner" }, { label: "Factory Exclusive", value: "factory_exclusive" }]
                : [{ label: "Architect Associate", value: "arch_associate" }, { label: "Architect Premium", value: "arch_premium" }]
            }
          />
          <SelectField
            label="Salesperson"
            value={salesperson}
            onChange={setSalesperson}
            placeholder="Assign..."
            options={[
              { label: "Rajesh Kumar (West)", value: "SP-RK" },
              { label: "Priya Sharma (North)", value: "SP-PS" },
              { label: "Sneha Reddy (South)", value: "SP-SR" },
              { label: "Amit Patel (West)", value: "SP-AP" },
            ]}
          />
        </div>
        <InputField label="GST Number" placeholder="e.g., 27AABCM1234F1Z5" value={gst} onChange={setGst} />
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full address..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button variant="primary" className="flex-1" icon={<Plus size={14} />} onClick={handleSubmit}>Create Account</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== EDIT LEAD MODAL ========================
export function EditLeadModal({ open, onClose, lead }: { open: boolean; onClose: () => void; lead: any }) {
  const [name, setName] = useState(lead?.name || lead?.contactPerson || "");
  const [company, setCompany] = useState(lead?.company || lead?.businessName || "");
  const [email, setEmail] = useState(lead?.email || "");
  const [phone, setPhone] = useState(lead?.phone || lead?.mobile || "");
  const [city, setCity] = useState(lead?.city || "");
  const [status, setStatus] = useState(lead?.status || "new");
  const [notes, setNotes] = useState(lead?.notes || lead?.remark || "");

  const handleSave = () => {
    toast.success("Lead updated", { description: `${company || name} has been updated.` });
    onClose();
  };

  if (!lead) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Lead" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Contact Name" value={name} onChange={setName} />
          <InputField label="Business Name" value={company} onChange={setCompany} />
          <InputField label="Email" value={email} onChange={setEmail} type="email" />
          <InputField label="Phone" value={phone} onChange={setPhone} />
          <InputField label="City" value={city} onChange={setCity} />
          <SelectField
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { label: "New", value: "new" },
              { label: "Contacted", value: "contacted" },
              { label: "Qualified", value: "qualified" },
              { label: "Converted", value: "converted" },
              { label: "Lost", value: "lost" },
            ]}
          />
        </div>
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" icon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== EDIT ACCOUNT MODAL ========================
export function EditAccountModal({ open, onClose, account }: { open: boolean; onClose: () => void; account: any }) {
  const [company, setCompany] = useState(account?.company || "");
  const [contact, setContact] = useState(account?.contactName || "");
  const [email, setEmail] = useState(account?.email || "");
  const [phone, setPhone] = useState(account?.phone || "");
  const [city, setCity] = useState(account?.city || "");
  const [status, setStatus] = useState(account?.status || "active");

  const handleSave = () => {
    toast.success("Account updated", { description: `${company} details have been saved.` });
    onClose();
  };

  if (!account) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Account" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Company Name" value={company} onChange={setCompany} />
          <InputField label="Contact Person" value={contact} onChange={setContact} />
          <InputField label="Email" value={email} onChange={setEmail} type="email" />
          <InputField label="Phone" value={phone} onChange={setPhone} />
          <InputField label="City" value={city} onChange={setCity} />
          <SelectField
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" icon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== EDIT ORDER MODAL ========================
export function EditOrderModal({ open, onClose, order }: { open: boolean; onClose: () => void; order: any }) {
  const [status, setStatus] = useState(order?.status || "draft");
  const [expectedDelivery, setExpectedDelivery] = useState(order?.expectedDelivery || order?.expectedClosureDate || "");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    toast.success("Order updated", { description: `${order?.id || "Order"} has been updated.` });
    onClose();
  };

  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Edit Order — ${order.id || ""}`}>
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p style={{ fontSize: 14, fontWeight: 500 }}>{order.items || order.projectName || "Order"}</p>
          <p className="text-muted-foreground" style={{ fontSize: 12 }}>
            {order.id} {order.totalAmount ? `· ₹${order.totalAmount?.toLocaleString("en-IN")}` : ""}
          </p>
        </div>
        <SelectField
          label="Order Status"
          value={status}
          onChange={setStatus}
          options={[
            { label: "Draft", value: "draft" },
            { label: "Confirmed", value: "confirmed" },
            { label: "In Production", value: "in_production" },
            { label: "Shipped", value: "shipped" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
          ]}
        />
        <DateField label="Expected Delivery" value={expectedDelivery} onChange={setExpectedDelivery} />
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Update notes..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" icon={<Save size={14} />} onClick={handleSave}>Update Order</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== RECORD PAYMENT MODAL ========================
export function RecordPaymentModal({ open, onClose, context }: { open: boolean; onClose: () => void; context?: string }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [account, setAccount] = useState("");

  const reset = () => {
    setAmount(""); setMethod("bank_transfer"); setReference(""); setDate(new Date().toISOString().slice(0, 10)); setNotes(""); setAccount("");
  };

  const handleSubmit = () => {
    if (!amount || !date) {
      toast.error("Please fill required fields", { description: "Amount and Date are required." });
      return;
    }
    toast.success("Payment recorded", {
      description: `₹${Number(amount).toLocaleString("en-IN")} recorded via ${method.replace(/_/g, " ")}.`,
    });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Record Payment" size="md">
      <div className="space-y-4">
        {!context && (
          <SelectField
            label="Account"
            value={account}
            onChange={setAccount}
            placeholder="Select account..."
            options={[
              { label: "Mehta Interiors (A001)", value: "A001" },
              { label: "Nair Designs (A002)", value: "A002" },
              { label: "Sheikh Constructions (A003)", value: "A003" },
              { label: "Rao Homes (A004)", value: "A004" },
            ]}
          />
        )}
        {context && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-blue-800" style={{ fontSize: 13, fontWeight: 500 }}>Recording payment for: {context}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Amount (₹) *" placeholder="e.g., 50000" value={amount} onChange={setAmount} type="number" />
          <SelectField
            label="Payment Method"
            value={method}
            onChange={setMethod}
            options={[
              { label: "Bank Transfer (NEFT/RTGS)", value: "bank_transfer" },
              { label: "Cheque", value: "cheque" },
              { label: "UPI", value: "upi" },
              { label: "Cash", value: "cash" },
            ]}
          />
          <DateField label="Payment Date *" value={date} onChange={setDate} />
          <InputField label="Reference / Transaction ID" placeholder="e.g., NEFT/2026/..." value={reference} onChange={setReference} />
        </div>
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment notes..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-gold/40 transition-colors cursor-pointer"
          onClick={() => toast.info("File picker opened", { description: "Select payment proof document." })}
        >
          <Upload size={20} className="mx-auto text-muted-foreground mb-1" />
          <p style={{ fontSize: 13, fontWeight: 500 }}>Upload Payment Proof (Optional)</p>
          <p className="text-muted-foreground" style={{ fontSize: 12 }}>PDF, image, or bank statement</p>
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button variant="primary" className="flex-1" icon={<CreditCard size={14} />} onClick={handleSubmit}>Record Payment</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== EDIT QUOTATION MODAL ========================
export function EditQuotationModal({ open, onClose, quotation }: { open: boolean; onClose: () => void; quotation: any }) {
  const [status, setStatus] = useState(quotation?.status || "draft");
  const [validUntil, setValidUntil] = useState(quotation?.validUntil || "");
  const [discount, setDiscount] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    toast.success("Quotation updated", { description: `${quotation?.id || "Quotation"} has been updated.` });
    onClose();
  };

  if (!quotation) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Edit Quotation — ${quotation.id || ""}`}>
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p style={{ fontSize: 14, fontWeight: 500 }}>{quotation.items || quotation.projectName || "Quotation"}</p>
          <p className="text-muted-foreground" style={{ fontSize: 12 }}>
            ₹{(quotation.totalAmount || quotation.quotationAmount || 0).toLocaleString("en-IN")}
          </p>
        </div>
        <SelectField
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { label: "Draft", value: "draft" },
            { label: "Sent", value: "sent" },
            { label: "Accepted", value: "accepted" },
            { label: "Rejected", value: "rejected" },
            { label: "Expired", value: "expired" },
          ]}
        />
        <DateField label="Valid Until" value={validUntil} onChange={setValidUntil} />
        <InputField label="Additional Discount (%)" placeholder="e.g., 5" value={discount} onChange={setDiscount} type="number" />
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Update notes..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" icon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== EDIT TASK MODAL ========================
export function EditTaskModal({ open, onClose, task }: { open: boolean; onClose: () => void; task: any }) {
  const [status, setStatus] = useState(task?.status || "pending");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [assignee, setAssignee] = useState(task?.assigneeId || "");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    toast.success("Task updated", { description: `${task?.title || "Task"} has been updated.` });
    onClose();
  };

  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Task" size="md">
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p style={{ fontSize: 14, fontWeight: 500 }}>{task.title}</p>
          <p className="text-muted-foreground" style={{ fontSize: 12 }}>{task.id}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { label: "Pending", value: "pending" },
              { label: "In Progress", value: "in_progress" },
              { label: "Completed", value: "completed" },
              { label: "On Hold", value: "on_hold" },
            ]}
          />
          <SelectField
            label="Priority"
            value={priority}
            onChange={setPriority}
            options={[
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
              { label: "Urgent", value: "urgent" },
            ]}
          />
        </div>
        <DateField label="Due Date" value={dueDate} onChange={setDueDate} />
        <SelectField
          label="Assignee"
          value={assignee}
          onChange={setAssignee}
          options={[
            { label: "Suresh Menon (Factory)", value: "U007" },
            { label: "Kavita Joshi (Factory)", value: "U008" },
            { label: "Vikram Singh (Architect)", value: "U005" },
            { label: "Sneha Reddy (Dealer)", value: "U004" },
          ]}
        />
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Task update notes..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" icon={<Save size={14} />} onClick={handleSave}>Update Task</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== EDIT USER MODAL ========================
export function EditUserModal({ open, onClose, user }: { open: boolean; onClose: () => void; user: any }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "dealer");
  const [city, setCity] = useState(user?.city || "");

  const handleSave = () => {
    toast.success("User updated", { description: `${name} profile has been updated.` });
    onClose();
  };

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Edit User — ${user.name}`}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Name" value={name} onChange={setName} />
          <InputField label="Email" value={email} onChange={setEmail} type="email" />
          <SelectField
            label="Role"
            value={role}
            onChange={setRole}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Dealer", value: "dealer" },
              { label: "Architect", value: "architect" },
              { label: "Factory", value: "factory" },
            ]}
          />
          <InputField label="City" value={city} onChange={setCity} />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" icon={<Save size={14} />} onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== DEACTIVATE CONFIRMATION MODAL ========================
export function DeactivateModal({ open, onClose, entityName, entityType }: {
  open: boolean; onClose: () => void; entityName: string; entityType: string;
}) {
  const handleConfirm = () => {
    toast.success(`${entityType} deactivated`, { description: `${entityName} has been deactivated.` });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Deactivate ${entityType}`} size="sm">
      <div className="space-y-4">
        <AlertCard
          type="warning"
          title={`Are you sure you want to deactivate ${entityName}?`}
          message={`This will mark the ${entityType.toLowerCase()} as inactive. It can be reactivated later.`}
        />
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="danger" className="flex-1" icon={<XCircle size={14} />} onClick={handleConfirm}>Deactivate</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== CONVERT QUOTATION TO ORDER MODAL ========================
export function ConvertQuotationModal({ open, onClose, quotation }: { open: boolean; onClose: () => void; quotation: any }) {
  const [factoryUser, setFactoryUser] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleConvert = () => {
    toast.success("Quotation converted to Order", {
      description: `${quotation?.id || "Quotation"} has been converted. New order created.`,
    });
    onClose();
  };

  if (!quotation) return null;

  return (
    <Modal open={open} onClose={onClose} title="Convert Quotation to Order">
      <div className="space-y-4">
        <AlertCard type="success" title="Converting to Order" message={`${quotation.items || quotation.id} — ₹${(quotation.totalAmount || 0).toLocaleString("en-IN")}`} />
        <SelectField
          label="Assign Factory"
          value={factoryUser}
          onChange={setFactoryUser}
          placeholder="Select factory user..."
          options={[
            { label: "Suresh Menon (Chennai)", value: "U007" },
            { label: "Kavita Joshi (Mumbai)", value: "U008" },
          ]}
        />
        <DateField label="Expected Delivery Date" value={deliveryDate} onChange={setDeliveryDate} />
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Conversion notes..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="gold" className="flex-1" icon={<CheckCircle2 size={14} />} onClick={handleConvert}>Convert to Order</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== ADD LEAD MODAL (for database pages) ========================
export function AddLeadToDBModal({ open, onClose, database }: { open: boolean; onClose: () => void; database: string }) {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [remark, setRemark] = useState("");

  const reset = () => {
    setName(""); setBusiness(""); setPhone(""); setEmail(""); setCity(""); setState(""); setRemark("");
  };

  const handleSubmit = () => {
    if (!name || !business || !phone) {
      toast.error("Please fill required fields", { description: "Name, Business, and Phone are required." });
      return;
    }
    toast.success("Lead added", { description: `${business} added to ${database} database.` });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title={`Add Lead — ${database.charAt(0).toUpperCase() + database.slice(1)} Database`} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Contact Person *" placeholder="Full name" value={name} onChange={setName} />
          <InputField label="Business Name *" placeholder="Company name" value={business} onChange={setBusiness} />
          <InputField label="Phone *" placeholder="+91-XXXXXXXXXX" value={phone} onChange={setPhone} />
          <InputField label="Email" placeholder="email@example.com" value={email} onChange={setEmail} type="email" />
          <InputField label="City" placeholder="e.g., Mumbai" value={city} onChange={setCity} />
          <InputField label="State" placeholder="e.g., Maharashtra" value={state} onChange={setState} />
        </div>
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Remark</label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Additional notes..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button variant="primary" className="flex-1" icon={<Plus size={14} />} onClick={handleSubmit}>Add Lead</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== UPDATE STATUS MODAL ========================
export function UpdateStatusModal({ open, onClose, entity, currentStatus, options }: {
  open: boolean; onClose: () => void; entity: string; currentStatus: string;
  options: { label: string; value: string }[];
}) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    toast.success("Status updated", { description: `${entity} status changed to ${options.find(o => o.value === status)?.label || status}.` });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Update Status — ${entity}`} size="sm">
      <div className="space-y-4">
        <SelectField label="New Status" value={status} onChange={setStatus} options={options} />
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason for status change..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" icon={<CheckCircle2 size={14} />} onClick={handleSave}>Update</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== ADD TO PROJECT MODAL (Architect) ========================
export function AddToProjectModal({ open, onClose, itemName }: { open: boolean; onClose: () => void; itemName: string }) {
  const [project, setProject] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    toast.success("Added to project", { description: `${itemName} added to project specification.` });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add to Project" size="sm">
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p style={{ fontSize: 14, fontWeight: 500 }}>{itemName}</p>
        </div>
        <SelectField
          label="Select Project"
          value={project}
          onChange={setProject}
          placeholder="Choose project..."
          options={[
            { label: "Mehta Premium Kitchen", value: "P001" },
            { label: "Nair Villa Complete Interiors", value: "P002" },
            { label: "Sheikh Office Partitions", value: "P003" },
          ]}
        />
        <InputField label="Quantity" placeholder="e.g., 10" value={quantity} onChange={setQuantity} type="number" />
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Specification notes..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" icon={<Plus size={14} />} onClick={handleAdd}>Add to Project</Button>
        </div>
      </div>
    </Modal>
  );
}
