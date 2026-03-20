import { CheckCircle2, Clock, FileText, Pencil, Shield } from "lucide-react";
import type { DrawingStatus as DrawingStatusType } from "../../data/orders";

const steps: { key: DrawingStatusType; label: string; icon: React.ReactNode }[] = [
  { key: "submitted", label: "Original Submitted", icon: <FileText size={14} /> },
  { key: "cad_conversion_pending", label: "CAD Conversion Pending", icon: <Clock size={14} /> },
  { key: "cad_ready", label: "CAD Ready", icon: <Pencil size={14} /> },
  { key: "approval_pending", label: "Approval Pending", icon: <Shield size={14} /> },
  { key: "approved", label: "Approved for Production", icon: <CheckCircle2 size={14} /> },
];

interface DrawingStatusProps {
  currentStatus: DrawingStatusType;
}

export function DrawingStatusBlock({ currentStatus }: DrawingStatusProps) {
  const currentIdx = steps.findIndex(s => s.key === currentStatus);

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <p style={{ fontSize: 14, fontWeight: 600 }} className="mb-4">Drawing Conversion Status</p>
      <div className="flex items-start gap-0">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {idx > 0 && (
                <div
                  className={`absolute top-4 right-1/2 w-full h-0.5 ${idx <= currentIdx ? "bg-emerald-400" : "bg-border"}`}
                  style={{ zIndex: 0 }}
                />
              )}
              {/* Step circle */}
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"
                } ${isCurrent ? "ring-2 ring-emerald-400 ring-offset-2" : ""}`}
              >
                {step.icon}
              </div>
              <p
                className={`mt-2 text-center ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}
                style={{ fontSize: 11, fontWeight: isCurrent ? 600 : 400, lineHeight: 1.3 }}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
