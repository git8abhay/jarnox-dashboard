import { motion } from "framer-motion";
import StockCard from "./StockCard";
import type { Company } from "@/lib/api";

interface CompanyGridProps {
  companies: Company[];
  onSelect: (symbol: string) => void;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const CompanyGrid = ({ companies, onSelect }: CompanyGridProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {companies.map((c) => (
        <motion.div key={c.symbol} variants={item}>
          <StockCard
            symbol={c.symbol}
            name={c.name}
            onClick={() => onSelect(c.symbol)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CompanyGrid;
