from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from data_pipeline.fetcher import fetch_stock_data
from data_pipeline.processor import process_stock_data

# Initialize the application
app = FastAPI(
    title="Jarnox Stock Data API", 
    description="REST API for financial data and metrics"
)

# Enable CORS so your future React frontend can talk to this API without security blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# A mock database of available companies
COMPANIES = [
    {"symbol": "RELIANCE.NS", "name": "Reliance Industries"},
    {"symbol": "TCS.NS", "name": "Tata Consultancy Services"},
    {"symbol": "INFY.NS", "name": "Infosys"},
    {"symbol": "AAPL", "name": "Apple Inc."},
    {"symbol": "MSFT", "name": "Microsoft Corporation"}
]

@app.get("/companies")
def get_companies():
    """Returns a list of all available companies"""
    return {"companies": COMPANIES}

@app.get("/data/{symbol}")
def get_stock_data(symbol: str):
    """Returns last 30 days of stock data AND a 5-day ML prediction"""
    raw_data = fetch_stock_data(symbol, period="3mo")
    processed_data = process_stock_data(raw_data)
    
    if processed_data is None:
        raise HTTPException(status_code=404, detail="Data not found for this symbol")
        
    # Generate the 5-day prediction using our new ML function
    # NOTE: Ensure you import generate_ml_prediction at the top of app.py!
    from data_pipeline.processor import generate_ml_prediction
    predictions = generate_ml_prediction(processed_data, future_days=5)
        
    # Filter to the last 30 days of historical data
    last_30_days = processed_data.tail(30).to_dict(orient="records")
    
    return {
        "symbol": symbol, 
        "historical": last_30_days,
        "prediction": predictions
    }

@app.get("/summary/{symbol}")
def get_stock_summary(symbol: str):
    """Returns 52-week high, low, and average close"""
    raw_data = fetch_stock_data(symbol, period="1y")
    processed_data = process_stock_data(raw_data)
    
    if processed_data is None:
        raise HTTPException(status_code=404, detail="Data not found for this symbol")
        
    latest_day = processed_data.iloc[-1]
    average_close = processed_data['Close'].mean()
    
    return {
        "symbol": symbol,
        "52_week_high": latest_day['52_Week_High'],
        "52_week_low": latest_day['52_Week_Low'],
        "average_close": round(average_close, 2)
    }

@app.get("/compare")
def compare_stocks(symbol1: str, symbol2: str):
    """(Bonus) Compares two stocks' performance"""
    df1 = process_stock_data(fetch_stock_data(symbol1, period="1mo"))
    df2 = process_stock_data(fetch_stock_data(symbol2, period="1mo"))
    
    if df1 is None or df2 is None:
        raise HTTPException(status_code=404, detail="One or both symbols not found")
        
    return {
        "comparison": {
            symbol1: {
                "latest_close": df1.iloc[-1]['Close'], 
                "volatility": df1.iloc[-1]['Volatility_Score']
            },
            symbol2: {
                "latest_close": df2.iloc[-1]['Close'], 
                "volatility": df2.iloc[-1]['Volatility_Score']
            }
        }
    }