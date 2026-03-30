<div align="center">

<br/>

```
   ██╗ █████╗ ██████╗ ███╗   ██╗ ██████╗ ██╗  ██╗
   ██║██╔══██╗██╔══██╗████╗  ██║██╔═══██╗╚██╗██╔╝
   ██║███████║██████╔╝██╔██╗ ██║██║   ██║ ╚███╔╝ 
██ ██║██╔══██║██╔══██╗██║╚██╗██║██║   ██║ ██╔██╗ 
╚█████╔╝██║  ██║██║  ██║██║ ╚████║╚██████╔╝██╔╝ ██╗
 ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝
```

### **Stock Intelligence Platform**

*A full-stack financial analytics platform with live data pipelines, custom risk metrics, and ML-powered price forecasting.*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-jarnox--dashboard.vercel.app-6366f1?style=for-the-badge&logoColor=white)](https://jarnox-dashboard.vercel.app/)
&nbsp;
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br/>

</div>

---

## ✨ Key Features & Outstanding Additions

The assignment brief called for a basic data pipeline and REST API. This project goes significantly further across every dimension — from automated data ingestion to a fully deployed, production-quality UI.

<br/>

**📦 Core Requirements — Delivered**

- **Automated Data Pipeline** — Uses `yfinance` to fetch live, rolling 3-month historical OHLCV data for a curated list of top-tier companies, with no manual intervention required.
- **Advanced Pandas Processing** — Raw market data is cleaned and enriched with **Daily Returns**, **7-Day Moving Averages**, and **52-Week High/Low** calculations before being served to any consumer.
- **FastAPI Backend** — A high-performance, async REST API with automatic **Swagger UI** documentation available at `/docs` and **ReDoc** at `/redoc` out of the box.

<br/>

**🏆 Outstanding Additions — Above & Beyond**

| Bonus Category | What Was Built |
|---|---|
| 🎯 **Creativity** | Engineered a custom **Volatility Score** — a proprietary composite metric derived from rolling standard deviation of daily returns. It surfaces market risk at a glance and is used as a primary comparison axis in the Compare view. |
| 🤖 **AI / ML Prediction** | Integrated a **Scikit-Learn Linear Regression** model trained on historical price trends to generate a **5-day closing price forecast** per ticker. The prediction is visualized as a distinct dashed indigo line on the chart, clearly separated from historical data. |
| ⚖️ **Compare Stocks** | A dedicated side-by-side comparison tool that renders synchronized closing price charts and a Volatility Score differential — allowing users to benchmark any two tickers against each other instantly. |
| 🎨 **Premium UI/UX** | A meticulously hand-crafted **glassmorphic dark-mode interface** built with React, TypeScript, and Tailwind CSS. Features Framer Motion page transitions, staggered grid card animations, and dynamic Recharts with conditional coloring (🟢 uptrend / 🔴 downtrend / 💜 AI projection). |
| ☁️ **Deployment** | Frontend is live and publicly accessible via **Vercel** with zero-config CI/CD on every push. |

---

## 🏗️ Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                             │
│           React + TypeScript + Tailwind (Vite)                  │
│    Framer Motion Animations  │  Recharts Visualizations         │
└──────────────────────┬──────────────────────────────────────────┘
                       │  HTTP Request (fetch / axios)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                             │
│              Async REST API  │  Auto Swagger Docs               │
│  /companies  │  /data/{symbol}  │  /compare?s1=&s2=            │
└──────────────────────┬──────────────────────────────────────────┘
                       │  Internal function call
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Python Data Pipeline                           │
│         yfinance (Live Fetch)  →  Pandas (Transform)           │
│   Daily Returns │ 7D MA │ 52W High/Low │ Volatility Score      │
└──────────────────────┬──────────────────────────────────────────┘
                       │  Processed DataFrame
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│               Scikit-Learn ML Layer                             │
│     LinearRegression  →  5-Day Price Forecast Array            │
└─────────────────────────────────────────────────────────────────┘
                       │  JSON Response
                       ▼
              Rendered in the UI ✅
```

The frontend is fully **decoupled** from the backend — it communicates exclusively via the REST API, making the backend independently consumable by any other client (mobile app, CLI, external service, etc.).

---

## 🚀 Local Setup

### Prerequisites

- Python `3.9+`
- Node.js `18+`
- `npm` or `yarn`

---

### Backend

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # macOS / Linux
# .\venv\Scripts\activate     # Windows

# 3. Install all Python dependencies
pip install -r requirements.txt

# 4. Start the FastAPI development server
uvicorn main:app --reload --port 8000
```

> The API will be running at **`http://localhost:8000`**
> Interactive docs available at **`http://localhost:8000/docs`**

---

### Frontend

```bash
# 1. Open a new terminal and navigate to the frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Create a local environment file and set the API URL
echo "VITE_API_URL=http://localhost:8000" > .env.local

# 4. Start the Vite development server
npm run dev
```

> The app will be running at **`http://localhost:5173`**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/companies` | Returns the list of all tracked company symbols and names. |
| `GET` | `/data/{symbol}` | Runs the full pipeline for a given ticker — returns OHLCV history, computed metrics (Daily Returns, 7D MA, 52W High/Low, Volatility Score), and the 5-day ML price forecast. |
| `GET` | `/compare` | Accepts two query parameters (`s1`, `s2`) and returns a side-by-side payload of closing prices and Volatility Scores for both tickers. |
| `GET` | `/docs` | Auto-generated **Swagger UI** for interactive API exploration. |
| `GET` | `/redoc` | Auto-generated **ReDoc** documentation. |

**Example request:**
```
GET /data/AAPL
GET /compare?s1=AAPL&s2=MSFT
```

---

## 🛠️ Full Tech Stack

| Layer | Technology |
|---|---|
| **Data Ingestion** | `yfinance` |
| **Data Processing** | `Pandas`, `NumPy` |
| **ML / Forecasting** | `Scikit-Learn` (Linear Regression) |
| **Backend API** | `FastAPI`, `Uvicorn` |
| **Frontend Framework** | `React 18`, `TypeScript`, `Vite` |
| **Styling** | `Tailwind CSS` |
| **Animations** | `Framer Motion` |
| **Charts** | `Recharts` |
| **Icons** | `Lucide React` |
| **Deployment** | `Vercel` |

---

## 🎯 Conclusion

This project was built with the intent to go beyond the brief — not just to check boxes, but to deliver something that reflects real-world engineering standards: a clean data pipeline, a well-documented API, a thoughtful ML integration, and a UI that takes the experience seriously.

Thank you to the **Jarnox** team for designing such an engaging and genuinely interesting assignment. It was a pleasure to work on, and I hope this submission reflects both the technical depth and the care put into every layer of the stack.

— *Built with focus and attention to detail.*

<br/>

<div align="center">

[![Live Demo](https://img.shields.io/badge/View%20Live%20Demo-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://jarnox-dashboard.vercel.app/)

</div>
