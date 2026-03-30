import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { StockDataPoint } from "@/lib/api";

interface StockChartProps {
  data: StockDataPoint[];
}

const StockChart = ({ data }: StockChartProps) => {
  // We only want to calculate the red/green trend based on historical data,
  // so we filter out the future AI predictions first.
  const historicalData = data.filter((d) => d.Close !== undefined);
  
  const isPositive =
    historicalData.length >= 2 
      ? historicalData[historicalData.length - 1].Close >= historicalData[0].Close 
      : true;

  // Lovable's dynamic color logic
  const color = isPositive ? "#2c9e7b" : "#DB1A1A";
  const gradientId = "chartGradient";

  return (
    <div className="soft-card p-4 sm:p-6 h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(195 15% 92%)" />
          <XAxis
            dataKey="Date"
            tick={{ fill: "hsl(195 15% 50%)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            }}
            minTickGap={40}
          />
          <YAxis
            tick={{ fill: "hsl(195 15% 50%)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => `₹${v.toFixed(0)}`}
            width={60}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(0 0% 100% / 0.95)",
              border: "1px solid hsl(195 15% 90%)",
              borderRadius: "12px",
              backdropFilter: "blur(12px)",
              color: "hsl(195 47% 20%)",
              fontSize: "12px",
              fontFamily: "'JetBrains Mono', monospace",
              boxShadow: "0 4px 20px -4px rgba(0,0,0,0.08)",
            }}
            labelFormatter={(v: string) =>
              new Date(v).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            }
            formatter={(value: number, name: string) => {
              // This ensures the tooltip says "AI Prediction" instead of "Predicted_Close"
              if (name === "Predicted_Close") return [`₹${value.toFixed(2)}`, "AI Prediction"];
              return [`₹${value.toFixed(2)}`, "Close"];
            }}
          />
          
          {/* Lovable's original historical data area */}
          <Area
            type="monotone"
            dataKey="Close"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "#fff", strokeWidth: 2 }}
          />

          {/* New AI Prediction Line (Indigo) */}
          <Line
            type="monotone"
            dataKey="Predicted_Close"
            stroke="#6366f1" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;