from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from uuid import uuid4
import pandas as pd
import joblib
import os
import json

from sklearn.linear_model import LinearRegression

app = FastAPI()

MODEL_DIR = "models/saved"
os.makedirs(MODEL_DIR, exist_ok=True)


@app.post("/train")
async def train_model(
    dataset: UploadFile = File(...),
    params: str = Form(...)
):
    """
    params: JSON string of hyperparameters
    dataset: CSV file
    """

    # Parse params
    params_dict = json.loads(params)

    # Read CSV
    df = pd.read_csv(dataset.file)

    if "target" not in df.columns:
        return {"error": "CSV must contain a 'target' column"}

    X = df.drop(columns=["target"])
    y = df["target"]

    # Create model
    model = LinearRegression(
        fit_intercept=params_dict.get("fit_intercept", True),
        copy_X=params_dict.get("copy_X", True),
        positive=params_dict.get("positive", False),
        n_jobs=params_dict.get("n_jobs", None),
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
