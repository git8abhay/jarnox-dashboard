import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Activity } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CompanyGrid from "@/components/dashboard/CompanyGrid";
import StockChart from "@/components/dashboard/StockChart";
import StatBadge from "@/components/dashboard/StatBadge";
import CompareStocks from "@/components/dashboard/CompareStocks"; // IMPORT ADDED HERE
import { GridSkeleton, ChartSkeleton } from "@/components/dashboard/Skeletons";
import {
  fetchCompanies,
  fetchStockData,
  fetchStockSummary,
  type Company,
  type StockDataPoint,
  type StockSummary,
} from "@/lib/api";

const Index = () => {
  const [activeView, setActiveView] = useState<"overview" | "compare">("overview");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    setLoadingCompanies(true);
    fetchCompanies()
      .then(setCompanies)
      .catch(() => setCompanies([]))
      .finally(() => setLoadingCompanies(false));
  }, []);

  const handleSelect = async (symbol: string) => {
    setSelectedSymbol(symbol);
    setLoadingDetail(true);
    try {
      const [data, sum] = await Promise.all([
        fetchStockData(symbol),
        fetchStockSummary(symbol),
      ]);
      setStockData(data);
      setSummary(sum);
    } catch {
      setStockData([]);
      setSummary(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBack = () => {
    setSelectedSymbol(null);
    setStockData([]);
    setSummary(null);
  };

  const selectedCompany = companies.find((c) => c.symbol === selectedSymbol);

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView}>
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: COMPARE STOCKS */}
        {activeView === "compare" ? (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Compare Performance</h2>
              <p className="text-muted-foreground">Select two trackers to analyze volatility and closing prices side-by-side.</p>
            </div>
            <CompareStocks />
          </motion.div>
        ) : (
          
          /* VIEW 2: MARKET OVERVIEW (Grid or Detail) */
          !selectedSymbol ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                  <Activity className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Market Overview
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Select a stock to view detailed analytics
                </p>
              </div>

              {loadingCompanies ? (
                <GridSkeleton />
              ) : companies.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <p className="text-muted-foreground">
                    Unable to connect to the API. Make sure your FastAPI server is running.
                  </p>
                </div>
              ) : (
                <CompanyGrid companies={companies} onSelect={handleSelect} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Back + Title */}
              <div className="mb-6 flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="glass-card p-2 hover:bg-glass-hover transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-foreground font-mono">
                    {selectedSymbol}
                  </h2>
                  {selectedCompany && (
                    <p className="text-sm text-muted-foreground">
                      {selectedCompany.name}
                    </p>
                  )}
                </div>
              </div>

              {loadingDetail ? (
                <ChartSkeleton />
              ) : (
                <div className="space-y-4">
                  {/* Stat Badges */}
                  {summary && (
                    <div className="flex flex-wrap gap-3">
                      <StatBadge
                        label="52-Week High"
                        value={summary["52_week_high"]}
                        variant="up"
                      />
                      <StatBadge
                        label="52-Week Low"
                        value={summary["52_week_low"]}
                        variant="down"
                      />
                      <StatBadge
                        label="Average Close"
                        value={summary.average_close}
                      />
                    </div>
                  )}

                  {/* Chart */}
                  {stockData.length > 0 ? (
                    <StockChart data={stockData} />
                  ) : (
                    <div className="glass-card p-12 text-center">
                      <p className="text-muted-foreground">
                        No data available for this stock.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Index;