from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib


app = FastAPI(
    title="Traffic Congestion Prediction API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "https://traffic-congestion-prediction.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------------
# Load Model
# -------------------------

saved_model = joblib.load("models/traffic_congestion_rf_model.joblib")

model = saved_model["model"]
feature_columns = saved_model["feature_columns"]


# -------------------------
# Input Schema
# -------------------------

class TrafficInput(BaseModel):
    temp: float
    rain_1h: float
    snow_1h: float
    clouds_all: int
    weather_main: str
    hour: int
    day_of_week: str
    month: str
    is_weekend: int
    is_holiday: int


# -------------------------
# Home
# -------------------------

@app.get("/")
def home():
    return {"message": "Traffic Congestion Prediction API is running!"}


# -------------------------
# Prediction Endpoint
# -------------------------

@app.post("/predict")
def predict(data: TrafficInput):

    input_df = pd.DataFrame([data.dict()])

    input_df = pd.get_dummies(
        input_df,
        columns=[
            "weather_main",
            "hour",
            "day_of_week",
            "month",
        ],
        drop_first=True,
    )

    input_df = input_df.reindex(
        columns=feature_columns,
        fill_value=0,
    )

    prediction = model.predict(input_df)[0]

    # Determine traffic status
    if prediction <= 1500:
        traffic_status = "🟢 Low Traffic"
    elif prediction <= 4000:
        traffic_status = "🟡 Medium Traffic"
    else:
        traffic_status = "🔴 High Traffic"

    return {
        "predicted_traffic_volume": round(float(prediction), 2),
        "traffic_status": traffic_status
    }