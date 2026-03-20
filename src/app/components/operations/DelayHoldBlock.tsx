import { useState } from "react";
import { Modal, Button, SelectField, InputField } from "../shared";
import {
  delayReasonLabels, type DelayHoldEntry, type DelayReason,
} from "../../data/operations";
import { AlertTriangle, Pause, Clock, CheckCircle2, Plus } from "lucide-react";

interface DelayHoldBlockProps {
  delays: DelayHoldEntry[];
}

export function DelayHoldBlock({ delays }: DelayHoldBlockProps) {
  const [addModal, setAddModal] = useState(false);
  const active = delays.filter(d => d.isActive);
  const resolved = delays.filter(d => !d.isActive);

  return (
    <div className="space-y-4">
      {/* Active delays/holds */}
      {active.length > 0 && (
        <div className="space-y-3">
          <p className="text-red-700" style={{ fontSize: 13, fontWeight: 600 }}>Active Issues ({active.length})</p>
          {active.map(d => (
            <div key={d.id} className={`p-4 rounded-xl border ${d.type === "delay" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${d.type === "delay" ? "bg-red-100" : "bg-amber-100"}`}>
                  {d.type === "delay" ? <AlertTriangle size={16} className="text-red-600" /> : <Pause size={16} className="text-amber-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={d.type === "delay" ? "text-red-800" : "text-amber-800"} style={{ fontSize: 14, fontWeight: 600 }}>
                      {d.type === "delay" ? "Delay" : "On Hold"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${d.type === "delay" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`} style={{ fontSize: 11, fontWeight: 500 }}>
                      {delayReasonLabels[d.reason]}
                    </span>
                    <span className="text-muted-foreground" style={{ fontSize: 11 }}>+{d.impactDays} days</span>
                  </div>
                  <p className={d.type === "delay" ? "text-red-700" : "text-amber-700"} style={{ fontSize: 13, marginTop: 4 }}>
                    {d.description}
                  </p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: 12 }}>
                    Raised by {d.raisedBy} on {d.raisedAt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="space-y-3">
          <p className="text-muted-foreground" style={{ fontSize: 13, fontWeight: 600 }}>Resolved ({resolved.length})</p>
          {resolved.map(d => (
            <div key={d.id} className="p-3 rounded-lg border border-border bg-muted/30">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>
                      {d.type === "delay" ? "Delay" : "Hold"} — {delayReasonLabels[d.reason]}
                    </span>
                    <span className="text-muted-foreground" style={{ fontSize: 11 }}>+{d.impactDays} days impact</span>
                  </div>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: 12 }}>{d.description}</p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: 11.5 }}>
                    Resolved by {d.resolvedBy} on {d.resolvedAt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {active.length === 0 && resolved.length === 0 && (
        <div className="text-center py-6">
          <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
          <p className="text-muted-foreground" style={{ fontSize: 14, fontWeight: 500 }}>No delays or holds</p>
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: 12 }}>This order is progressing smoothly.</p>
        </div>
      )}

      <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={() => setAddModal(true)}>
        Report Delay / Hold
      </Button>

      <DelayHoldModal open={addModal} onClose={() => setAddModal(false)} />
    </div>
  );
}

function DelayHoldModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [type, setType] = useState("delay");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [impactDays, setImpactDays] = useState("1");

  return (
    <Modal open={open} onClose={onClose} title="Report Delay / Hold" size="md">
      <div className="space-y-4">
        <SelectField
          label="Type"
          options={[{ label: "Delay", value: "delay" }, { label: "Hold", value: "hold" }]}
          value={type}
          onChange={setType}
        />
        <SelectField
          label="Reason"
          placeholder="Select reason..."
          options={Object.entries(delayReasonLabels).map(([k, v]) => ({ label: v, value: k }))}
          value={reason}
          onChange={setReason}
        />
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <InputField label="Estimated Impact (days)" value={impactDays} onChange={setImpactDays} type="number" />
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="danger" size="sm" className="flex-1" icon={<AlertTriangle size={14} />} onClick={onClose}>
            Report {type === "delay" ? "Delay" : "Hold"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
