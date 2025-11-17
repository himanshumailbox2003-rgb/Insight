import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import clsx from "clsx";

const API = "https://insight-b91v.onrender.com/api/upload";

/* ================= NAVBAR ================= */
function Navbar({ theme, setTheme }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">Insight</h1>
      <div className="flex items-center gap-4">
        <button
          className="px-3 py-1 rounded-md card muted"
          onClick={() => window.open("https://github.com", "_blank")}
        >
          Source
        </button>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
}

/* ================= THEME TOGGLE (FIXED) ================= */
function ThemeToggle({ theme, setTheme }) {
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button onClick={toggleTheme} className="flex items-center gap-2 card px-3 py-1">
      <span className="muted">Theme</span>

      <div
        className={clsx(
          "w-12 h-6 rounded-full p-1 transition-colors duration-300",
          theme === "dark" ? "bg-accent" : "bg-gray-300"
        )}
      >
        <div
          className={clsx(
            "w-4 h-4 rounded-full bg-white transform transition-transform duration-300",
            theme === "dark" ? "translate-x-6" : ""
          )}
        />
      </div>
    </button>
  );
}

/* ================= ABOUT SECTION ================= */
function AboutSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mb-8"
    >
      <h2 className="text-2xl font-semibold mb-2">What is Insight?</h2>
      <p className="muted mb-4">
        Insight is an intelligent data analytics dashboard designed to process CSV
        datasets instantly. It extracts KPIs, identifies missing values and outliers,
        and visualizes your data using clean, dynamic charts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="p-4 rounded-md glass">
          <h3 className="text-lg font-medium mb-1">📊 Automated KPI Extraction</h3>
          <p className="muted text-sm">Rows, columns, missing values, outliers & stats.</p>
        </div>

        <div className="p-4 rounded-md glass">
          <h3 className="text-lg font-medium mb-1">📈 Interactive Visualizations</h3>
          <p className="muted text-sm">Beautiful charts rendered using Recharts.</p>
        </div>

        <div className="p-4 rounded-md glass">
          <h3 className="text-lg font-medium mb-1">⚡ Modern Architecture</h3>
          <p className="muted text-sm">React + Tailwind + Vite + Python Flask API.</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= UPLOAD SECTION (FIXED BUTTON) ================= */
function UploadCard({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async () => {
    if (!file) return alert("Choose a CSV file first.");

    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await axios.post(API, fd, {
        onUploadProgress: (p) =>
          setProgress(Math.round((p.loaded / p.total) * 100)),
      });

      onResult(res.data);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="card mb-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-medium mb-2">Upload CSV</h2>
        <p className="muted mb-4">Drag & drop or click to upload.</p>

        <div className="flex gap-4 items-center">
          <label
            className="flex-1 p-6 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setFile(e.dataTransfer.files[0]);
            }}
          >
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="muted">Click or drop file here</div>
            <div className="mt-2">
              {file ? file.name : <span className="muted">No file selected</span>}
            </div>
          </label>

          <div className="w-48">
            <button
              className="w-full py-2 rounded-md text-white"
              style={{ backgroundColor: "var(--accent)" }}
              onClick={upload}
              disabled={loading}
            >
              {loading ? `Uploading ${progress}%` : "Upload & Analyze"}
            </button>

            <button
              className="w-full mt-2 py-2 rounded-md card muted"
              onClick={() => setFile(null)}
            >
              Clear
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= KPI GRID ================= */
function KPIGrid({ summary }) {
  if (!summary) return null;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="card">
        <div className="muted">Rows</div>
        <div className="text-2xl font-semibold">{summary.rows}</div>
      </div>

      <div className="card">
        <div className="muted">Columns</div>
        <div className="text-2xl font-semibold">{summary.columns}</div>
      </div>

      <div className="card">
        <div className="muted">Missing</div>
        <div className="text-2xl font-semibold">{summary.missing_values}</div>
      </div>

      <div className="card">
        <div className="muted">Outliers</div>
        <div className="text-2xl font-semibold">
          {summary.outliers?.outlier_rows ?? 0}
        </div>
      </div>
    </motion.div>
  );
}

/* ================= CHART SECTION ================= */
function ChartPane({ sample }) {
  if (!sample || !Object.keys(sample).length)
    return <div className="card muted">No numeric columns to chart.</div>;

  const cols = Object.keys(sample).filter((k) => k !== "index");
  const labels = sample.index || sample[cols[0]].map((_, i) => i + 1);

  const data = labels.map((value, idx) => {
    const row = { name: value };
    cols.forEach((c) => (row[c] = Number(sample[c][idx] ?? 0)));
    return row;
  });

  const colors = ["#60a5fa", "#f472b6", "#f59e0b", "#34d399"];

  return (
    <div className="card">
      <h3 className="mb-4">Visualizations</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          {cols.map((c, i) => (
            <Line
              key={c}
              type="monotone"
              dataKey={c}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ================= ROOT APP ================= */
export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const [result, setResult] = useState(null);

  return (
    <div className="container">
      <Navbar theme={theme} setTheme={setTheme} />
      <AboutSection />
      <UploadCard onResult={setResult} />
      <KPIGrid summary={result?.summary} />
      <ChartPane sample={result?.sample} />

      <div className="mt-6 card muted">
        <h4 className="mb-2">Raw JSON</h4>
        <pre style={{ maxHeight: 200, overflow: "auto" }}>
          {result
            ? JSON.stringify(result.sample || result.summary, null, 2)
            : "No data yet"}
        </pre>
      </div>

      <footer className="mt-6 muted text-center">Built with ❤️ — Insight</footer>
    </div>
  );
}
