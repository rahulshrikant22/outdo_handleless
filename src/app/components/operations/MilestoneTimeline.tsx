import { type ReactNode } from "react";
import { type Milestone } from "../../data/operations";
import {
  CheckCircle2, Clock, AlertTriangle, Circle, SkipForward, ChevronRight
} from "lucide-react";

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

const statusConfig: Record<string, { icon: ReactNode; color: string; bg: string; lineColor: string }> = {
  completed: { icon: <CheckCircle2 size={16} />, color: "text-emerald-600", bg: "bg-emerald-100", lineColor: "bg-emerald-300" },
  in_progress: { icon: <Clock size={16} />, color: "text-gold-dark", bg: "bg-gold/15", lineColor: "bg-gold/40" },
  pending: { icon: <Circle size={16} />, color: "text-gray-400", bg: "bg-gray-100", lineColor: "bg-gray-200" },
  delayed: { icon: <AlertTriangle size={16} />, color: "text-red-600", bg: "bg-red-100", lineColor: "bg-red-200" },
  skipped: { icon: <SkipForward size={16} />, color: "text-gray-400", bg: "bg-gray-50", lineColor: "bg-gray-200" },
};

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  return (
    <div className="space-y-0">
      {milestones.map((ms, idx) => {
        const cfg = statusConfig[ms.status] || statusConfig.pending;
        const isLast = idx === milestones.length - 1;

        return (
          <div key={ms.id} className="flex gap-3">
            {/* Connector */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.color}`}>
                {cfg.icon}
              </div>
              {!isLast && <div className={`w-0.5 flex-1 min-h-[24px] ${cfg.lineColor}`} />}
            </div>

            {/* Content */}
            <div className="pb-4 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>{ms.label}</span>
                <span className={`px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`} style={{ fontSize: 10.5, fontWeight: 500 }}>
                  {ms.status.replace(/_/g, " ")}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1">
                {ms.date ? (
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>
                    {ms.date}
                  </span>
                ) : (
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>
                    Expected: {ms.expectedDate}
                  </span>
                )}
                {ms.completedBy && (
                  <>
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>·</span>
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>{ms.completedBy}</span>
                  </>
                )}
              </div>

              {ms.notes && (
                <p className="text-muted-foreground mt-1 px-2 py-1 rounded bg-muted/50 inline-block" style={{ fontSize: 12 }}>
                  {ms.notes}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}