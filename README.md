# Stock Trading Platform 📈

A full-stack stock trading simulation platform built with Angular and Node.js. Search for stocks, view real-time quotes, track price history with interactive charts, manage a virtual portfolio, and maintain a watchlist.

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Highcharts](https://img.shields.io/badge/Highcharts-Stock-1B8BD0?style=flat-square)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Stock Search** | Search any stock by ticker symbol with autocomplete suggestions |
| 📊 **Real-Time Quotes** | Current price, daily change, high/low, and open/close prices |
| 🏢 **Company Profile** | IPO date, industry, website, and peer companies |
| 📉 **Interactive Charts** | Daily price chart, historical candlestick with SMA and Volume by Price indicators |
| 📰 **Top News** | Latest company news with pagination and social sharing (Twitter/Facebook) |
| 🧑‍💼 **Insider Sentiments** | MSPR and change data with recommendation trends and EPS charts |
| 💼 **Portfolio Management** | Buy/sell stocks with a virtual wallet |
| ⭐ **Watchlist** | Star stocks to track them easily |

---

## 🛠 Tech Stack

### Frontend
- **Angular 17** — Component-based SPA framework
- **Angular Material** — UI component library
- **Bootstrap 5** — Responsive grid and utilities
- **Highcharts / Highcharts Stock** — Interactive financial charts

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MongoDB Atlas** — Cloud-hosted NoSQL database

### External APIs
- [Finnhub](https://finnhub.io/) — Stock search, company profile, quotes, news, peers, recommendations, insider sentiments, earnings
- [Polygon.io](https://polygon.io/) — Historical OHLCV data for charts

---

## 📁 Project Structure
```
StockTradingPlatform/
├── backend/
│   ├── app.js                    # Express routes (Finnhub & Polygon API proxies)
│   ├── server.js                 # Server setup, MongoDB connection, DB routes
│   ├── .env                      # Environment variables (not committed)
│   └── package.json
├── src/
│   └── app/
│       └── allComponents/
│           ├── search-component/    # Main search & stock details page
│           ├── home-component/      # Home page
│           ├── portfolio-component/ # Portfolio management
│           ├── watchlist-component/ # Watchlist management
│           └── nav-component/       # Navigation bar
├── angular.json
├── package.json
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB instance)
- [Finnhub API key](https://finnhub.io/) (free tier)
- [Polygon.io API key](https://polygon.io/) (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/StockTradingPlatform.git
cd StockTradingPlatform
```

### 2. Install dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 3. Set up environment variables

Create a `.env` file inside the `backend/` directory:
```env
FINNHUB_API_TOKEN=your_finnhub_api_key
POLYGON_API_KEY=your_polygon_api_key
MONGODB_URI=your_mongodb_connection_string
```

### 4. Start the backend
```bash
cd backend
node server.js
```

Backend runs on `http://localhost:3000`

### 5. Start the frontend

In a separate terminal:
```bash
ng serve
```

Frontend runs on `http://localhost:4200`

### 6. Open the app

Navigate to **http://localhost:4200** and search for any stock ticker — e.g., `AAPL`, `TSLA`, `GOOGL`.

---

## 📝 Notes

- **Polygon.io free tier** only supports daily OHLCV data. Intraday (hourly/minute) data requires a paid plan.
- **MongoDB Atlas free tier** (M0) is sufficient for this project.
- The **virtual wallet** starts with a default balance stored in the `Wallet` collection in MongoDB.

---

## 📄 License

This project is for educational and portfolio purposes.
