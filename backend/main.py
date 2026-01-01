from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Header
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
import joblib
import os
import json
from uuid import uuid4
from typing import Optional

import plotly.graph_objects as go

from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import numpy as np

from sklearn.linear_model import LinearRegression

# -------------------- APP --------------------

app = FastAPI()

# -------------------- CORS --------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- STORAGE --------------------

BASE_DIR = "backend"
MODEL_DIR = os.path.join(BASE_DIR, "models", "saved")
META_DIR = os.path.join(BASE_DIR, "metadata")

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(META_DIR, exist_ok=True)

# -------------------- UTILS --------------------

def coerce_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() == "true"
    return False

def get_user_from_token(
    authorization: Optional[str] = Header(None)
):
    """
    Expects:
      Authorization: Bearer <user_id>
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth scheme")

    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")

    return token  # token == user_id (simple for now)

def user_model_dir(user_id: str):
    path = os.path.join(MODEL_DIR, user_id)
    os.makedirs(path, exist_ok=True)
    return path

def user_meta_path(user_id: str):
    return os.path.join(META_DIR, f"{user_id}.json")

# -------------------- AUTH --------------------

@app.post("/auth/signup")
def signup(email: str = Form(...), password: str = Form(...)):
    user_id = email
    meta_path = user_meta_path(user_id)

    if os.path.exists(meta_path):
        raise HTTPException(status_code=400, detail="User already exists")

    with open(meta_path, "w") as f:
        json.dump({"email": email, "models": []}, f, indent=2)

    return {"token": user_id}

@app.post("/auth/login")
def login(email: str = Form(...), password: str = Form(...)):
    meta_path = user_meta_path(email)

    if not os.path.exists(meta_path):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"token": email}

# -------------------- TRAIN --------------------

@app.post("/train")
async def train_model(
    dataset: UploadFile = File(...),
    params: str = Form(...),
    user_id: str = Depends(get_user_from_token)
):
    try:
        params_dict = json.loads(params)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid params JSON")

    try:
        df = pd.read_csv(dataset.file)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV")

    if "target" not in df.columns:
        raise HTTPException(status_code=400, detail="CSV must contain 'target' column")

    X = df.drop(columns=["target"])
    y = df["target"]

    model = LinearRegression(
        fit_intercept=coerce_bool(params_dict.get("fit_intercept", True)),
        copy_X=coerce_bool(params_dict.get("copy_X", True)),
        positive=coerce_bool(params_dict.get("positive", False)),
        n_jobs=int(params_dict["n_jobs"]) if params_dict.get("n_jobs") else None,
    )

    model.fit(X, y)

    # Predictions
    y_pred = model.predict(X)

    # -------------------- METRICS --------------------

    r2 = r2_score(y, y_pred)
    rmse = float(np.sqrt(mean_squared_error(y, y_pred)))
    mae = mean_absolute_error(y, y_pred)

    metrics = {
        "r2": r2,
        "rmse": rmse,
        "mae": mae
    }

    # Plot: Actual vs Predicted
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=y,
        y=y_pred,
        mode="markers",
        name="Predictions"
    ))

    fig.update_layout(
        title="Actual vs Predicted",
        xaxis_title="Actual Values",
        yaxis_title="Predicted Values",
    )

    plot_json = fig.to_json()

    model_id = str(uuid4())
    model_path = os.path.join(user_model_dir(user_id), f"{model_id}.pkl")
    joblib.dump(model, model_path)

    meta_path = user_meta_path(user_id)
    with open(meta_path, "r+") as f:
        meta = json.load(f)
        meta["models"].append({
            "id": model_id,
            "algo": "linear_regression",
            "features": list(X.columns)
        })
        f.seek(0)
        json.dump(meta, f, indent=2)
        f.truncate()

    return {
        "model_id": model_id,
        "features": list(X.columns),
        "plot": plot_json,
        "metrics": metrics
    }

# -------------------- LIST MODELS --------------------

@app.get("/models")
def list_models(user_id: str = Depends(get_user_from_token)):
    meta_path = user_meta_path(user_id)
    if not os.path.exists(meta_path):
        return []
    with open(meta_path) as f:
        return json.load(f)["models"]

# -------------------- GET MODEL --------------------

@app.get("/models/{model_id}")
def get_model(model_id: str, user_id: str = Depends(get_user_from_token)):
    meta_path = user_meta_path(user_id)
    with open(meta_path) as f:
        meta = json.load(f)

    for m in meta["models"]:
        if m["id"] == model_id:
            return m

    raise HTTPException(status_code=404, detail="Model not found")

# -------------------- DOWNLOAD --------------------

@app.get("/download/{model_id}")
def download_model(model_id: str, user_id: str = Depends(get_user_from_token)):
    path = os.path.join(user_model_dir(user_id), f"{model_id}.pkl")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Model not found")

    return FileResponse(path, filename=f"{model_id}.pkl")
