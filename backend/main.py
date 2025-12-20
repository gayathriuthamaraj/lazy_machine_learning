from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
import joblib
import os
import json
from uuid import uuid4

from sklearn.linear_model import LinearRegression

# -------------------- APP --------------------

app = FastAPI()

# -------------------- CORS --------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- STORAGE --------------------

MODEL_DIR = "backend/models/saved"
os.makedirs(MODEL_DIR, exist_ok=True)

# -------------------- ROUTES --------------------
def coerce_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() == "true"
    return False

@app.post("/train")
async def train_model(
    dataset: UploadFile = File(...),
    params: str = Form(...)
):
    """
    Train Linear Regression
    CSV must contain a column named 'target'
    """

    # Parse params
    try:
        params_dict = json.loads(params)
    except Exception:
        return {"error": "Invalid params JSON"}

    # Load CSV
    try:
        df = pd.read_csv(dataset.file)
    except Exception:
        return {"error": "Invalid CSV file"}

    # Validate target
    if "target" not in df.columns:
        return {"error": "CSV must contain a 'target' column"}

    X = df.drop(columns=["target"])
    y = df["target"]

    # Create model
    model = LinearRegression(
    fit_intercept=coerce_bool(params_dict.get("fit_intercept", True)),
    copy_X=coerce_bool(params_dict.get("copy_X", True)),
    positive=coerce_bool(params_dict.get("positive", False)),
    n_jobs=(
        int(params_dict["n_jobs"])
        if "n_jobs" in params_dict and params_dict["n_jobs"] != ""
        else None
        ),
    )

    # Train
    model.fit(X, y)

    # Save model
    model_id = str(uuid4())
    model_path = os.path.join(MODEL_DIR, f"{model_id}.pkl")
    joblib.dump(model, model_path)

    return {
        "model_id": model_id,
        "features": list(X.columns),
        "coefficients": model.coef_.tolist(),
        "intercept": model.intercept_
    }


@app.get("/download/{model_id}")
def download_model(model_id: str):
    model_path = os.path.join(MODEL_DIR, f"{model_id}.pkl")

    if not os.path.exists(model_path):
        return {"error": "Model not found"}

    return FileResponse(
        model_path,
        media_type="application/octet-stream",
        filename=f"linear_regression_{model_id}.pkl"
    )
