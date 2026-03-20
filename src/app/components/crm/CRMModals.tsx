import { useState } from "react";
import { Modal, Button, InputField, SelectField, DateField, AlertCard } from "../shared";
import type { CRMLead } from "../../data/crm";
import { crmSalespeople, lostReasons } from "../../data/crm";
import { Phone, Mail, MessageSquare, MapPin, Calendar, CheckCircle2, XCircle, Package } from "lucide-react";

// ======================== FOLLOW-UP MODAL ========================
export function FollowUpModal({ open, onClose, lead }: { open: boolean; onClose: () => void; lead: CRMLead | null }) {
  const [type, setType] = useState("call");
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [nextDate, setNextDate] = useState("");

  if (!lead) return null;

  const typeIcons: Record<string, React.ReactNode> = {
    call: <Phone size={14} />, email: <Mail size={14} />, meeting: <MapPin size={14} />,
    whatsapp: <MessageSquare size={14} />, visit: <MapPin size={14} />,
  };

  return (
    <Modal open={open} onClose={onClose} title="Log Follow-up" size="md">
      <div className="space-y-4">
        <AlertCard type="info" title={lead.businessName} message={`${lead.contactPerson} · ${lead.city}, ${lead.state}`} />

        <SelectField
          label="Follow-up Type"
          value={type}
          onChange={(v) => setType(v)}
          options={[
            { label: "Phone Call", value: "call" },
            { label: "Email", value: "email" },
            { label: "In-Person Meeting", value: "meeting" },
            { label: "WhatsApp", value: "whatsapp" },
            { label: "Site / Factory Visit", value: "visit" },
          ]}
        />

        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the conversation or interaction..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>

        <InputField label="Outcome" placeholder="e.g., Interested, wants samples" value={outcome} onChange={setOutcome} />
        <InputField label="Next Action" placeholder="e.g., Schedule factory visit" value={nextAction} onChange={setNextAction} />
        <DateField label="Next Follow-up Date" value={nextDate} onChange={setNextDate} />

        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" onClick={onClose} className="flex-1" icon={<Calendar size={15} />}>Save Follow-up</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== CONVERT LEAD MODAL ========================
export function ConvertLeadModal({ open, onClose, lead }: { open: boolean; onClose: () => void; lead: CRMLead | null }) {
  const [accountType, setAccountType] = useState(lead?.database === "organic" ? "dealer" : lead?.database || "dealer");
  const [classification, setClassification] = useState("");
  const [assignTo, setAssignTo] = useState(lead?.assignedUserId || "");
  const [gst, setGst] = useState("");

  if (!lead) return null;

  const classificationOptions: Record<string, { label: string; value: string }[]> = {
    dealer: [
      { label: "Dealer with Display", value: "dealer_with_display" },
      { label: "Dealer with Sample", value: "dealer_with_sample" },
      { label: "Dealer without Display", value: "dealer_without_display" },
    ],
    factory: [
      { label: "Factory Partner", value: "factory_partner" },
      { label: "Factory Exclusive", value: "factory_exclusive" },
    ],
    architect: [
      { label: "Architect Associate", value: "architect_associate" },
      { label: "Architect Premium", value: "architect_premium" },
    ],
  };

  return (
    <Modal open={open} onClose={onClose} title="Convert Lead to Account" size="md">
      <div className="space-y-4">
        <AlertCard
          type="success"
          title="Converting Lead"
          message={`${lead.businessName} — ${lead.contactPerson}`}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField label="Business Name" value={lead.businessName} />
          <InputField label="Contact Person" value={lead.contactPerson} />
          <InputField label="Mobile" value={lead.mobile} />
          <InputField label="Email" value={lead.email} />
        </div>

        <SelectField
          label="Account Type"
          value={accountType}
          onChange={(v) => { setAccountType(v); setClassification(""); }}
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
          options={classificationOptions[accountType] || []}
          placeholder="Select classification..."
        />

        <SelectField
          label="Assign Account Manager"
          value={assignTo}
          onChange={setAssignTo}
          options={crmSalespeople.map((sp) => ({ label: `${sp.name} (${sp.territory})`, value: sp.id }))}
        />

        <InputField label="GST Number" placeholder="e.g., 27AABCM1234F1Z5" value={gst} onChange={setGst} />

        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="gold" onClick={onClose} className="flex-1" icon={<CheckCircle2 size={15} />}>Convert to Account</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== BAD / LOST REASON MODAL ========================
export function BadLeadModal({ open, onClose, lead }: { open: boolean; onClose: () => void; lead: CRMLead | null }) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  if (!lead) return null;

  return (
    <Modal open={open} onClose={onClose} title="Mark Lead as Bad / Lost" size="sm">
      <div className="space-y-4">
        <AlertCard type="warning" title={lead.businessName} message={`This will mark the lead as lost. It can be reactivated later.`} />

        <SelectField
          label="Lost / Rejection Reason"
          value={reason}
          onChange={setReason}
          options={lostReasons.map((r) => ({ label: r, value: r }))}
          placeholder="Select reason..."
        />

        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional context..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={onClose} className="flex-1" icon={<XCircle size={15} />}>Mark as Bad</Button>
        </div>
      </div>
    </Modal>
  );
}

// ======================== SAMPLE KIT MODAL ========================
export function SampleKitModal({ open, onClose, lead }: { open: boolean; onClose: () => void; lead: CRMLead | null }) {
  const [status, setStatus] = useState(lead?.sampleStatus || "pending");
  const [kitType, setKitType] = useState("standard");
  const [trackingId, setTrackingId] = useState("");
  const [shippedDate, setShippedDate] = useState("");
  const [notes, setNotes] = useState("");

  if (!lead) return null;

  return (
    <Modal open={open} onClose={onClose} title="Update Sample Kit Status" size="md">
      <div className="space-y-4">
        <AlertCard type="info" title={lead.businessName} message={`Current status: ${lead.sampleStatus.replace(/_/g, " ")}`} />

        <SelectField
          label="Sample Kit Status"
          value={status}
          onChange={(v) => setStatus(v as any)}
          options={[
            { label: "Pending", value: "pending" },
            { label: "Provided / Shipped", value: "provided" },
          ]}
        />

        {status === "provided" && (
          <>
            <SelectField
              label="Kit Type"
              value={kitType}
              onChange={setKitType}
              options={[
                { label: "Standard Sample Kit", value: "standard" },
                { label: "Premium Display Kit", value: "premium" },
                { label: "Color Swatch Set", value: "swatch" },
                { label: "Full Panel Sample", value: "panel" },
              ]}
            />
            <InputField label="Tracking ID" placeholder="e.g., DTDC123456789" value={trackingId} onChange={setTrackingId} />
            <DateField label="Shipped Date" value={shippedDate} onChange={setShippedDate} />
          </>
        )}

        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about the sample kit..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
            style={{ fontSize: 14 }}
          />
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button variant="primary" onClick={onClose} className="flex-1" icon={<Package size={15} />}>Update Sample Kit</Button>
        </div>
      </div>
    </Modal>
  );
}
