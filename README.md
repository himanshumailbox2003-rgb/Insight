# Insight — Intelligent CSV Analytics Dashboard

Insight is a full-stack data analytics dashboard designed to analyze CSV datasets instantly.  
It extracts KPIs, identifies missing values, handles outlier detection, and generates interactive visualizations using a modern React + Tailwind + Vite frontend powered by a Python Flask backend.

The system is lightweight, fast, and suited for developers, students, data analysts, and anyone working with structured CSV data.

---

## Live Demo

Frontend (Vercel):  
https://insight-plum.vercel.app

Backend API (Render):  
https://insight-b91v.onrender.com/api/upload

---

## Features

- Automated KPI extraction (mean, median, std, min, max)
- Missing value and outlier detection using Z-score
- Interactive line-chart visualizations with Recharts
- Real-time CSV upload and analysis
- Responsive UI built with React + Tailwind
- Light/Dark theme switch
- Fast, server-side CSV processing using Pandas and NumPy
- Fully deployed on Vercel (frontend) and Render (backend)

---

## Technology Stack

### Frontend
- React (Vite)
- TailwindCSS
- Framer Motion
- Recharts
- Axios

### Backend
- Python Flask
- Pandas
- NumPy
- SciPy (Z-score outlier detection)
- Flask-CORS

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## Project Architecture

Insight/
│
├── frontend/ # React + Vite client
│ ├── src/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── styles.css
│ ├── index.html
│ └── package.json
│
├── backend/ # Flask API server
│ ├── app.py
│ ├── requirements.txt
│ └── uploads/
│
└── README.md

yaml
Copy code

---

## Installation (Local Setup)

### 1. Clone the repository
git clone https://github.com/himanshumailbox2003-rgb/Insight.git
cd Insight

yaml
Copy code

---

## Backend Setup (Flask)

### Install dependencies
cd backend
pip install -r requirements.txt

shell
Copy code

### Run backend
python app.py

arduino
Copy code

Server will start at:
http://localhost:5000

yaml
Copy code

---

## Frontend Setup (React + Vite)

cd frontend
npm install
npm run dev

powershell
Copy code

Frontend will start at:
http://localhost:5173

yaml
Copy code

---

## API Usage

### Endpoint
POST /api/upload

markdown
Copy code

### Payload
- `file`: CSV file

### Response (JSON)
{
"summary": {
"rows": 100,
"columns": 5,
"missing_values": 12,
"numeric_columns": ["col1", "col2"],
"kpis": {
"col1": { "mean": 20.3, "median": 19, ... }
},
"outliers": { "outlier_rows": 3 }
},
"sample": {
"col1": [...],
"col2": [...],
"index": [...]
}
}

yaml
Copy code

---

## Deployment

### Frontend
- Hosted on Vercel  
- Framework: Vite  
- Output directory: `dist`

### Backend
- Hosted on Render  
- Python Flask server  
- Auto-deploy on every Git push  

---

## Credits

Author:  
Himanshu Tandon  
Email: himanshumainbox2003@gmail.com  
GitHub: https://github.com/himanshumailbox2003-rgb

Project: Insight – Intelligent CSV Analytics Dashboard  
This project is fully developed and deployed by Himanshu Tandon.

---

## License

This project is open-source and available under the MIT License.
