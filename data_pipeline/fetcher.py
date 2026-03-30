import yfinance as yf
import pandas as pd

def fetch_stock_data(symbol: str, period: str = "3mo"):
    """
    Fetches historical market data for a given ticker symbol.
    """
    print(f"Fetching data for {symbol}...")
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period)
        
        if hist.empty:
            print(f"Warning: No data found for {symbol}.")
            return None
            
        hist = hist.reset_index()
        print("Data fetched successfully!")
        return hist
        
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

if __name__ == "__main__":
    # Testing the connection with Reliance Industries
    test_data = fetch_stock_data("RELIANCE.NS", period="1mo")
    if test_data is not None:
        print(test_data.head())