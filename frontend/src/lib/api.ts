import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export interface Company {
  symbol: string;
  name: string;
}

export interface StockDataPoint {
  Date: string;
  Close: number;
  Daily_Return: number;
}

export interface StockSummary {
  "52_week_high": number;
  "52_week_low": number;
  average_close: number;
}

export async function fetchCompanies(): Promise<Company[]> {
  const res = await axios.get(`${API_BASE}/companies`);
  return res.data.companies;
}

export const fetchStockData = async (symbol: string) => {
  const response = await axios.get(`${API_BASE}/data/${symbol}`);
  
  // We combine the historical data and the ML predictions into one array 
  // so Recharts can draw a continuous timeline.
  const historical = response.data.historical;
  const predictions = response.data.prediction;
  
  return [...historical, ...predictions];
};

export async function fetchStockSummary(symbol: string): Promise<StockSummary> {
  const res = await axios.get(`${API_BASE}/summary/${symbol}`);
  return res.data;
}
