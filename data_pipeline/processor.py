import pandas as pd
import numpy as np

def process_stock_data(df: pd.DataFrame):
    """
    Cleans raw stock data and adds calculated financial metrics.
    """
    if df is None or df.empty:
        return None

    # 1. Clean Data: Drop missing values
    df = df.dropna().copy()
    
    # Clean Dates: yfinance gives timezone-aware dates which break JSON later. 
    # Let's convert them to standard YYYY-MM-DD strings.
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d')

    # 2. Core Metrics
    # Daily Return = (CLOSE - OPEN) / OPEN
    df['Daily_Return'] = (df['Close'] - df['Open']) / df['Open']

    # 7-day Moving Average (using Close price)
    df['7_Day_MA'] = df['Close'].rolling(window=7).mean()

    # 52-week High/Low 
    # (Assuming approx 252 trading days in a year. We need at least 1 year of data for this to be perfectly accurate)
    df['52_Week_High'] = df['Close'].rolling(window=252, min_periods=1).max()
    df['52_Week_Low'] = df['Close'].rolling(window=252, min_periods=1).min()

    # 3. Custom Metric: Volatility Score
    # Measures how wildly the stock is swinging over a 7-day period
    df['Volatility_Score'] = df['Daily_Return'].rolling(window=7).std()

    # 4. Final Cleanup: Round decimals so our API response looks clean
    df = df.round({
        'Daily_Return': 4, 
        '7_Day_MA': 2, 
        '52_Week_High': 2, 
        '52_Week_Low': 2, 
        'Volatility_Score': 4,
        'Open': 2, 'High': 2, 'Low': 2, 'Close': 2
    })

    # Fill any remaining NaN values (caused by the rolling windows at the start of the dataset) with 0 or None
    df = df.fillna(0)

    return df

# Let's test it by importing your fetcher
if __name__ == "__main__":
    from fetcher import fetch_stock_data
    
    # We fetch '1y' (1 year) so our 52-week high/low calculation has enough data
    print("Grabbing raw data...")
    raw_data = fetch_stock_data("RELIANCE.NS", period="1y")
    
    if raw_data is not None:
        print("Processing metrics...")
        clean_data = process_stock_data(raw_data)
        
        # Print the last 5 rows to see our new calculated columns
        print(clean_data[['Date', 'Close', 'Daily_Return', '7_Day_MA', '52_Week_High', 'Volatility_Score']].tail())

from sklearn.linear_model import LinearRegression
from datetime import timedelta

def generate_ml_prediction(df: pd.DataFrame, future_days: int = 5):
    """
    Trains a basic Linear Regression model to predict future closing prices.
    """
    if df is None or len(df) < 10:
        return []

    # 1. Prepare the data (using row index as 'time' feature)
    df = df.copy()
    df['Day_Index'] = np.arange(len(df))
    
    X = df[['Day_Index']].values
    y = df['Close'].values

    # 2. Train the ML Model
    model = LinearRegression()
    model.fit(X, y)

    # 3. Predict the future
    last_index = df['Day_Index'].iloc[-1]
    future_X = np.arange(last_index + 1, last_index + 1 + future_days).reshape(-1, 1)
    future_predictions = model.predict(future_X)

    # 4. Format the output with future dates
    last_date = pd.to_datetime(df['Date'].iloc[-1])
    
    predictions = []
    for i, pred_price in enumerate(future_predictions):
        # Skip weekends roughly (just adding standard days for simplicity here)
        next_date = (last_date + timedelta(days=i+1)).strftime('%Y-%m-%d')
        predictions.append({
            "Date": next_date,
            "Predicted_Close": round(pred_price, 2)
        })
        
    return predictions