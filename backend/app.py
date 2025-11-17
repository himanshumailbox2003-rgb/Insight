from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
from scipy import stats

app = Flask(__name__)

# FULL CORS FIX FOR VERCEL + RENDER
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# Add CORS headers for ALL responses (VERY IMPORTANT)
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


def summarize_df(df):
    df = df.dropna(axis=1, how='all')
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    summary = {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "missing_values": int(df.isna().sum().sum()),
        "numeric_columns": numeric_cols,
        "kpis": {}
    }

    # KPI stats
    for col in numeric_cols:
        coldata = df[col].dropna().astype(float)
        summary["kpis"][col] = {
            "mean": float(coldata.mean()) if not coldata.empty else None,
            "median": float(coldata.median()) if not coldata.empty else None,
            "std": float(coldata.std()) if not coldata.empty else None,
            "min": float(coldata.min()) if not coldata.empty else None,
            "max": float(coldata.max()) if not coldata.empty else None,
        }

    # Outliers via Z-score
    outliers = {}
    if numeric_cols:
        z = np.abs(stats.zscore(df[numeric_cols].dropna()))
        if z.ndim == 1:
            mask = z > 3
            outliers_count = int(np.sum(mask))
        else:
            mask = (z > 3).any(axis=1)
            outliers_count = int(np.sum(mask))
        outliers["outlier_rows"] = outliers_count
    else:
        outliers["outlier_rows"] = 0

    summary["outliers"] = outliers
    return summary


# FIXED: ALLOW OPTIONS + POST
@app.route("/api/upload", methods=["POST", "OPTIONS"])
def upload():
    # Handle CORS preflight request
    if request.method == "OPTIONS":
        return "", 200

    if "file" not in request.files:
        return jsonify({"error": "no file part"}), 400

    f = request.files["file"]
    if f.filename == "":
        return jsonify({"error": "no filename"}), 400

    save_path = os.path.join(UPLOAD_DIR, f.filename)
    f.save(save_path)

    try:
        df = pd.read_csv(save_path)
    except Exception as e:
        return jsonify({"error": "failed to read CSV", "detail": str(e)}), 400

    summary = summarize_df(df)

    sample = {}
    numeric = df.select_dtypes(include=[np.number]).columns.tolist()

    if not df.empty and numeric:
        sample_df = df[numeric].head(200).fillna(0)
        for col in numeric:
            sample[col] = sample_df[col].tolist()
        sample["index"] = list(map(str, sample_df.index.tolist()))

    return jsonify({"summary": summary, "sample": sample})


@app.route("/api/sample/<path:filename>", methods=["GET"])
def get_sample(filename):
    return send_from_directory(UPLOAD_DIR, filename, as_attachment=True)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
