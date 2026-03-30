import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowRight, Activity, Scale } from "lucide-react";
import StatBadge from "./StatBadge"; // Reusing the Lovable component!

const CompareStocks = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [symbol1, setSymbol1] = useState("");
  const [symbol2, setSymbol2] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/companies")
      .then(res => setCompanies(res.data.companies))
      .catch(() => setError("Failed to load companies"));
  }, []);

  const handleCompare = async () => {
    if (!symbol1 || !symbol2) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/compare?symbol1=${symbol1}&symbol2=${symbol2}`);
      setResults(response.data.comparison);
    } catch (err) {
      setError("Failed to fetch comparison data. Check server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. SELECTION CARD (Glassmorphic) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 flex flex-col md:flex-row gap-4 items-end"
      >
        {/* Tracker 1 */}
        <div className="w-full">
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
            First Tracker
          </label>
          <select 
            className="w-full bg-background/50 border border-border/50 rounded-xl p-3 text-foreground font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
            value={symbol1}
            onChange={(e) => setSymbol1(e.target.value)}
          >
            <option value="">-- Choose Stock --</option>
            {companies.map(c => <option key={`1-${c.symbol}`} value={c.symbol}>{c.name} ({c.symbol})</option>)}
          </select>
        </div>

        {/* Divider Icon */}
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-accent/30 shrink-0">
          <ArrowRight className="text-primary w-5 h-5" />
        </div>

        {/* Tracker 2 */}
        <div className="w-full">
          <label className="block text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
            Second Tracker
          </label>
          <select 
            className="w-full bg-background/50 border border-border/50 rounded-xl p-3 text-foreground font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
            value={symbol2}
            onChange={(e) => setSymbol2(e.target.value)}
          >
            <option value="">-- Choose Stock --</option>
            {companies.map(c => <option key={`2-${c.symbol}`} value={c.symbol}>{c.name} ({c.symbol})</option>)}
          </select>
        </div>

        {/* Primary Action Button */}
        <button 
          onClick={handleCompare}
          disabled={!symbol1 || !symbol2 || loading}
          className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-xl transition-all flex items-center justify-center shrink-0"
        >
          {loading ? "Analyzing..." : "Compare"}
        </button>
      </motion.div>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-brand-red bg-brand-red/5 p-4 rounded-xl border border-brand-red/15 text-sm">
          {error}
        </motion.p>
      )}

      {/* 2. RESULTS GRID */}
      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[symbol1, symbol2].map((symbol, index) => (
            <motion.div 
              key={symbol}
              initial={{ opacity: 0, x: index === 0 ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
              className="glass-card p-6 relative overflow-hidden group hover:border-primary/30 transition-colors"
            >
              {/* Decorative Background Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center group-hover:bg-accent/50 transition-colors">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-mono text-foreground tracking-tight">
                    {symbol}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Performance Metrics</p>
                </div>
              </div>
              
              {/* Reusing the Lovable StatBadge for consistency! */}
              <div className="flex flex-wrap gap-3">
                <StatBadge 
                  label="Latest Close (₹)" 
                  value={results[symbol].latest_close} 
                  variant="neutral"
                />
                <StatBadge 
                  label="Volatility Score" 
                  value={results[symbol].volatility} 
                  // If volatility is super high, flag it red (down), otherwise green (up)
                  variant={results[symbol].volatility > 0.015 ? "down" : "up"} 
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CompareStocks;