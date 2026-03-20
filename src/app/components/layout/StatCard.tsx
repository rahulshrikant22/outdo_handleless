import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  color?: string;
  accent?: "navy" | "gold" | "green" | "blue" | "red" | "purple";
}

const accentStyles: Record<string, string> = {
  navy: "bg-navy/8 text-navy",
  gold: "bg-gold/15 text-gold-dark",
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  red: "bg-red-50 text-red-600",
  purple: "bg-violet-50 text-violet-600",
};

export function StatCard({
  label, value, icon, trend, trendDirection = "neutral", color = "bg-card", accent = "navy"
}: StatCardProps) {
  return (
    <div className={`${color} rounded-xl border border-border p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow`}>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>{label}</p>
        {icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accentStyles[accent]}`}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <p className="text-foreground" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-1.5">
            {trendDirection === "up" && <TrendingUp size={13} className="text-emerald-500" />}
            {trendDirection === "down" && <TrendingDown size={13} className="text-red-500" />}
            <span
              className={trendDirection === "up" ? "text-emerald-600" : trendDirection === "down" ? "text-red-600" : "text-muted-foreground"}
              style={{ fontSize: 12, fontWeight: 500 }}
            >
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
