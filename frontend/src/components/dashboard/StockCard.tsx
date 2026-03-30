import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface StockCardProps {
  symbol: string;
  name: string;
  onClick: () => void;
}

const StockCard = ({ symbol, name, onClick }: StockCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="soft-card-hover p-5 text-left w-full group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center group-hover:bg-accent/50 transition-colors">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div className="w-2 h-2 rounded-full bg-brand-teal" />
      </div>
      <p className="font-mono text-base font-semibold text-foreground tracking-tight">
        {symbol}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5 truncate">{name}</p>
    </motion.button>
  );
};

export default StockCard;
