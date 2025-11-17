# InsightHub — AI-Powered Analytics Dashboard

**What this project is**
InsightHub is a full-stack analytics dashboard that lets users upload CSV datasets, performs automated data cleaning, KPI extraction, outlier detection, and returns interactive charts and summary reports.

**Stack**
- Backend: Python Flask (Pandas, NumPy)
- Frontend: Static HTML + JS using Chart.js for charts
- Deploy: Frontend can be hosted on Vercel / GitHub Pages; Backend on Render / Railway

## Quick local run (development)
1. Backend:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   flask run --host=0.0.0.0 --port=5000
   ```
2. Frontend:
   - Open `frontend/index.html` in a browser OR serve it:
   ```bash
   cd frontend
   python -m http.server 8000
   # then visit http://localhost:8000
   ```

## Features implemented
- CSV upload (client -> backend)
- Data cleaning: drop empty columns, auto-detect numeric columns
- KPI extraction: rows, columns, missing values, mean/median for numeric cols
- Outlier detection: z-score method
- Interactive charts (line/bar/pie) using Chart.js
- Dark mode toggle with persisted preference (localStorage)
- Simple CSS animations and responsive layout
- Example dataset provided

## Deployment
- Backend: Push `backend/` to a GitHub repo and deploy using Render / Railway (create new Python web service; start command `gunicorn app:app`).
- Frontend: Deploy `/frontend` on Vercel or GitHub Pages (build not required; it's static).

## Author
Himanshu Tandon — himanshumailbox2003@gmail.com

