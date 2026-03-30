import { motion } from "framer-motion";

interface StatBadgeProps {
  label: string;
  value: string | number;
  variant?: "neutral" | "up" | "down";
}

const StatBadge = ({ label, value, variant = "neutral" }: StatBadgeProps) => {
  const colorClass =
    variant === "up"
      ? "text-trend-up"
      : variant === "down"
      ? "text-brand-red"
      : "text-primary";

  const bgClass =
    variant === "up"
      ? "bg-trend-up/5 border-trend-up/15"
      : variant === "down"
      ? "bg-brand-red/5 border-brand-red/15"
      : "bg-primary/5 border-primary/15";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`brand-pill border ${bgClass} flex flex-col gap-0.5`}
    >
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
        {label}
      </span>
      <span className={`text-sm font-semibold font-mono ${colorClass}`}>
        {typeof value === "number" ? value.toFixed(2) : value}
      </span>
    </motion.div>
  );
};

export default StatBadge;
