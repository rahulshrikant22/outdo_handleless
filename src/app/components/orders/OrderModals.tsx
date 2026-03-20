import { useState } from "react";
import { Modal, Button, InputField, SelectField, DateField } from "../shared";
import type { ProjectQuotation, ProjectOrder } from "../../data/orders";
import { toast } from "sonner";
import { handleDownloadPDF } from "../shared/GlobalModals";

// ---- Lost / Hold Modal ----
interface OutcomeModalProps {
  open: boolean;
  onClose: () => void;
  quotation: ProjectQuotation | null;
  type: "lost" | "hold";
}

export function QuotationOutcomeModal({ open, onClose, quotation, type }: OutcomeModalProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const title = type === "lost" ? "Mark Quotation as Lost" : "Put Quotation on Hold";
  const reasonLabel = type === "lost" ? "Lost Reason" : "Hold Reason";
  const reasons = type === "lost"
    ? ["Price too high", "Chose competitor", "Project cancelled", "Budget constraints", "Timeline mismatch", "Other"]
    : ["Pending client decision", "Awaiting approval", "Material availability", "Design revision needed", "Other"];

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {quotation && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p style={{ fontSize: 14, fontWeight: 500 }}>{quotation.projectName}</p>
            <p className="text-muted-foreground" style={{ fontSize: 13 }}>
              {quotation.id} · ₹{quotation.quotationAmount.toLocaleString("en-IN")}
            </p>
          </div>
          <SelectField
            label={reasonLabel}
            placeholder={`Select ${reasonLabel.toLowerCase()}...`}
            options={reasons.map(r => ({ label: r, value: r }))}
            value={reason}
            onChange={setReason}
          />
          <div>
            <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Additional Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all resize-none"
              style={{ fontSize: 14 }}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button variant={type === "lost" ? "danger" : "gold"} size="sm" className="flex-1" onClick={onClose}>
              {type === "lost" ? "Mark as Lost" : "Put on Hold"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ---- New Order Modal (Step-based) ----
interface NewOrderModalProps {
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function NewOrderModal({ open, onClose, onComplete }: NewOrderModalProps) {
  const [step, setStep] = useState(1);
  const [accountId, setAccountId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const reset = () => { setStep(1); setAccountId(""); setProjectName(""); setSiteName(""); setCategory(""); setNotes(""); };

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title={`New Order — Step ${step} of 3`} size="lg">
      <div className="space-y-4">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 ${s <= step ? "bg-navy" : "bg-muted text-muted-foreground"}`} style={{ fontSize: 12, fontWeight: 600 }}>
                {s}
              </div>
              <span className={s <= step ? "text-foreground" : "text-muted-foreground"} style={{ fontSize: 12, fontWeight: 500 }}>
                {s === 1 ? "Account" : s === 2 ? "Project" : "Review"}
              </span>
              {s < 3 && <div className={`flex-1 h-px ${s < step ? "bg-navy" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <SelectField
              label="Select Account"
              placeholder="Choose an account..."
              options={[
                { label: "Mehta Interiors (A001) — Dealer", value: "A001" },
                { label: "Nair Designs (A002) — Architect", value: "A002" },
                { label: "Sheikh Constructions (A003) — Dealer", value: "A003" },
                { label: "Rao Homes (A004) — Dealer", value: "A004" },
                { label: "Nagpur Modern Interiors (CA001) — Dealer", value: "CA001" },
                { label: "Mysore Woodcraft Industries (CA002) — Factory", value: "CA002" },
                { label: "Hyderabad Home Studio (CA003) — Architect", value: "CA003" },
              ]}
              value={accountId}
              onChange={setAccountId}
            />
            {accountId && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="text-emerald-800" style={{ fontSize: 13, fontWeight: 500 }}>Account selected</p>
                <p className="text-emerald-700 mt-0.5" style={{ fontSize: 12 }}>You can proceed to add project details.</p>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <InputField label="Project Name" placeholder="e.g., Kitchen Renovation" value={projectName} onChange={setProjectName} />
            <InputField label="Site Name / Address" placeholder="e.g., Client Residence, MG Road" value={siteName} onChange={setSiteName} />
            <SelectField
              label="Project Category"
              placeholder="Select category..."
              options={[
                { label: "Kitchen", value: "kitchen" },
                { label: "Wardrobe", value: "wardrobe" },
                { label: "Office", value: "office" },
                { label: "Bathroom", value: "bathroom" },
                { label: "Villa (Multi-room)", value: "villa" },
                { label: "Commercial", value: "commercial" },
              ]}
              value={category}
              onChange={setCategory}
            />
            <div>
              <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional project details..."
                className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all resize-none"
                style={{ fontSize: 14 }}
              />
            </div>
            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-gold/40 transition-colors cursor-pointer">
              <p style={{ fontSize: 13, fontWeight: 500 }}>Upload Project Files (Optional)</p>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: 12 }}>CAD, PDF, sketches, images</p>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <p style={{ fontSize: 15, fontWeight: 600 }}>Review & Create Order</p>
            <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Account</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{accountId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Project</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{projectName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Site</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{siteName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground" style={{ fontSize: 13 }}>Category</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{category || "—"}</span>
              </div>
            </div>
            {notes && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Notes</p>
                <p style={{ fontSize: 13 }}>{notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {step > 1 && <Button variant="outline" size="sm" onClick={() => setStep(step - 1)}>Back</Button>}
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          {step < 3 ? (
            <Button variant="primary" size="sm" onClick={() => setStep(step + 1)} disabled={step === 1 && !accountId}>Next</Button>
          ) : (
            <Button variant="gold" size="sm" onClick={() => { reset(); onClose(); onComplete?.(); }}>Create Order</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ---- Excel Import Modal ----
interface ExcelImportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ExcelImportModal({ open, onClose }: ExcelImportModalProps) {
  const [stage, setStage] = useState<"upload" | "preview" | "done">("upload");

  const mockRows = [
    { sn: 1, item: "Base Cabinet Shutter - 600mm", l: 600, h: 720, t: 18, qty: 4, rate: 4200 },
    { sn: 2, item: "Wall Cabinet Shutter - 600mm", l: 600, h: 360, t: 18, qty: 6, rate: 3200 },
    { sn: 3, item: "Drawer Front Panel - 600mm", l: 600, h: 140, t: 18, qty: 8, rate: 1800 },
    { sn: 4, item: "Tall Unit Shutter - 600mm", l: 600, h: 2100, t: 18, qty: 2, rate: 8500 },
  ];

  return (
    <Modal open={open} onClose={() => { setStage("upload"); onClose(); }} title="Import Line Items from Excel" size="lg">
      <div className="space-y-4">
        {stage === "upload" && (
          <>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-blue-800" style={{ fontSize: 13, fontWeight: 500 }}>Download the sample format first</p>
              <p className="text-blue-700 mt-0.5" style={{ fontSize: 12 }}>Ensure your Excel file matches the required column format.</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => handleDownloadPDF("Sample Import Format")}>Download Sample Format</Button>
            </div>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-gold/40 transition-colors cursor-pointer" onClick={() => setStage("preview")}>
              <p style={{ fontSize: 14, fontWeight: 500 }}>Drop Excel file here or click to upload</p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: 12.5 }}>Supports .xlsx and .xls formats</p>
            </div>
          </>
        )}
        {stage === "preview" && (
          <>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-emerald-800" style={{ fontSize: 13, fontWeight: 500 }}>Validation passed — {mockRows.length} rows found</p>
              <p className="text-emerald-700 mt-0.5" style={{ fontSize: 12 }}>Review the imported data below before confirming.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ fontSize: 12 }}>
                <thead>
                  <tr className="border-b border-border">
                    {["S.No", "Item Name", "L(mm)", "H(mm)", "T(mm)", "Qty", "Rate"].map(h => (
                      <th key={h} className="text-left py-2 text-muted-foreground" style={{ fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockRows.map(r => (
                    <tr key={r.sn} className="border-b border-border/50">
                      <td className="py-2">{r.sn}</td>
                      <td className="py-2" style={{ fontWeight: 500 }}>{r.item}</td>
                      <td className="py-2">{r.l}</td>
                      <td className="py-2">{r.h}</td>
                      <td className="py-2">{r.t}</td>
                      <td className="py-2">{r.qty}</td>
                      <td className="py-2">₹{r.rate.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setStage("upload")}>Re-upload</Button>
              <Button variant="gold" size="sm" onClick={() => setStage("done")}>Import {mockRows.length} Items</Button>
            </div>
          </>
        )}
        {stage === "done" && (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-emerald-600" style={{ fontSize: 24 }}>✓</span>
            </div>
            <p style={{ fontSize: 16, fontWeight: 600 }}>Import Complete</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: 14 }}>{mockRows.length} line items imported successfully.</p>
            <Button variant="primary" size="sm" className="mt-4" onClick={() => { setStage("upload"); onClose(); }}>Done</Button>
          </div>
        )}
      </div>
    </Modal>
  );
}