import { useState, type ReactNode } from "react";
import { Modal, Button, SelectField, StatusBadge } from "../shared";
import {
  productionStatusLabels, dispatchStatusLabels,
  type ProductionStatus, type DispatchStatus, type ConvertedOrder,
} from "../../data/operations";
import {
  Factory, Truck, ChevronRight, CheckCircle2, Clock, AlertCircle, ArrowRight,
  Scissors, Layers, Wrench, Paintbrush, ShieldCheck, Package, Box
} from "lucide-react";

interface ProductionDispatchBlockProps {
  order: ConvertedOrder;
}

const productionStages: { key: ProductionStatus; label: string; icon: ReactNode }[] = [
  { key: "design_pending", label: "Design Pending", icon: <Clock size={14} /> },
  { key: "cutlist_pending", label: "Cutlist Pending", icon: <Scissors size={14} /> },
  { key: "material_procurement", label: "Procurement", icon: <Package size={14} /> },
  { key: "cutting", label: "Cutting", icon: <Scissors size={14} /> },
  { key: "edging", label: "Edging", icon: <Layers size={14} /> },
  { key: "assembly", label: "Assembly", icon: <Wrench size={14} /> },
  { key: "finishing", label: "Finishing", icon: <Paintbrush size={14} /> },
  { key: "quality_check", label: "QC", icon: <ShieldCheck size={14} /> },
  { key: "production_ready", label: "Ready", icon: <CheckCircle2 size={14} /> },
];

const dispatchStages: { key: DispatchStatus; label: string; icon: ReactNode }[] = [
  { key: "not_ready", label: "Not Ready", icon: <Clock size={14} /> },
  { key: "packaging", label: "Packaging", icon: <Box size={14} /> },
  { key: "ready_to_dispatch", label: "Ready", icon: <Package size={14} /> },
  { key: "dispatched", label: "Dispatched", icon: <Truck size={14} /> },
  { key: "in_transit", label: "In Transit", icon: <Truck size={14} /> },
  { key: "delivered", label: "Delivered", icon: <CheckCircle2 size={14} /> },
];

export function ProductionDispatchBlock({ order }: ProductionDispatchBlockProps) {
  const [statusModal, setStatusModal] = useState<"production" | "dispatch" | null>(null);
  const prodIdx = productionStages.findIndex(s => s.key === order.productionStatus);
  const dispIdx = dispatchStages.findIndex(s => s.key === order.dispatchStatus);

  return (
    <div className="space-y-6">
      {/* Production Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Factory size={16} className="text-navy" />
            <p style={{ fontSize: 14, fontWeight: 600 }}>Production Progress</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setStatusModal("production")}>
            Update Status
          </Button>
        </div>

        <div className="flex items-center gap-0.5 overflow-x-auto pb-2">
          {productionStages.map((stage, idx) => {
            const isCompleted = idx < prodIdx;
            const isCurrent = idx === prodIdx;
            const isPending = idx > prodIdx;

            return (
              <div key={stage.key} className="flex items-center shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors ${
                  isCompleted
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : isCurrent
                    ? "bg-gold/15 border-gold/40 text-gold-dark"
                    : "bg-muted/30 border-border text-muted-foreground"
                }`}>
                  <span className={`${isCompleted ? "text-emerald-600" : isCurrent ? "text-gold-dark" : "text-gray-400"}`}>
                    {isCompleted ? <CheckCircle2 size={14} /> : stage.icon}
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: isCurrent ? 600 : 400, whiteSpace: "nowrap" }}>
                    {stage.label}
                  </span>
                </div>
                {idx < productionStages.length - 1 && (
                  <ChevronRight size={14} className={`mx-0.5 shrink-0 ${isCompleted ? "text-emerald-400" : "text-gray-300"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-navy" />
            <p style={{ fontSize: 14, fontWeight: 600 }}>Dispatch Progress</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setStatusModal("dispatch")}>
            Update Status
          </Button>
        </div>

        <div className="flex items-center gap-0.5 overflow-x-auto pb-2">
          {dispatchStages.map((stage, idx) => {
            const isCompleted = idx < dispIdx;
            const isCurrent = idx === dispIdx;

            return (
              <div key={stage.key} className="flex items-center shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors ${
                  isCompleted
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : isCurrent
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-muted/30 border-border text-muted-foreground"
                }`}>
                  <span className={`${isCompleted ? "text-emerald-600" : isCurrent ? "text-blue-600" : "text-gray-400"}`}>
                    {isCompleted ? <CheckCircle2 size={14} /> : stage.icon}
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: isCurrent ? 600 : 400, whiteSpace: "nowrap" }}>
                    {stage.label}
                  </span>
                </div>
                {idx < dispatchStages.length - 1 && (
                  <ChevronRight size={14} className={`mx-0.5 shrink-0 ${isCompleted ? "text-emerald-400" : "text-gray-300"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Update Modal */}
      {statusModal && (
        <StatusUpdateModal
          open={true}
          onClose={() => setStatusModal(null)}
          type={statusModal}
          currentProduction={order.productionStatus}
          currentDispatch={order.dispatchStatus}
        />
      )}
    </div>
  );
}

function StatusUpdateModal({ open, onClose, type, currentProduction, currentDispatch }: {
  open: boolean; onClose: () => void; type: "production" | "dispatch";
  currentProduction: ProductionStatus; currentDispatch: DispatchStatus;
}) {
  const isProduction = type === "production";
  const options = isProduction
    ? Object.entries(productionStatusLabels).map(([k, v]) => ({ label: v, value: k }))
    : Object.entries(dispatchStatusLabels).map(([k, v]) => ({ label: v, value: k }));
  const [selected, setSelected] = useState(isProduction ? currentProduction : currentDispatch);
  const [notes, setNotes] = useState("");

  return (
    <Modal open={open} onClose={onClose} title={`Update ${isProduction ? "Production" : "Dispatch"} Status`} size="sm">
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-muted-foreground" style={{ fontSize: 12, fontWeight: 500 }}>Current Status</p>
          <p className="mt-1" style={{ fontSize: 14, fontWeight: 500 }}>
            {isProduction ? productionStatusLabels[currentProduction] : dispatchStatusLabels[currentDispatch]}
          </p>
        </div>
        <SelectField
          label="New Status"
          options={options}
          value={selected}
          onChange={setSelected}
        />
        <div>
          <label className="block mb-1.5 text-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Status update notes..."
            className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
            style={{ fontSize: 14 }}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" className="flex-1" icon={<ArrowRight size={14} />} onClick={onClose}>
            Update
          </Button>
        </div>
      </div>
    </Modal>
  );
}