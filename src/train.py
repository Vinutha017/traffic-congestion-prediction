from preprocessing import (
    load_data,
    create_time_features,
    create_holiday_feature,
    remove_duplicates,
    prepare_model_data,
)

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

import numpy as np
import joblib
from pathlib import Path


def train():

    df = load_data("../data/Metro_Interstate_Traffic_Volume.csv")

    df = create_time_features(df)
    df = create_holiday_feature(df)
    df = remove_duplicates(df)
    model_df = prepare_model_data(df)

    X = model_df.drop(columns=["traffic_volume"])
    y = model_df["traffic_volume"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
    )

    model = RandomForestRegressor(
    n_estimators=20,
    max_depth=15,
    min_samples_leaf=5,
    random_state=42,
    n_jobs=-1,
)

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)

    print(f"MAE : {mae:.2f}")
    print(f"RMSE: {rmse:.2f}")
    print(f"R²  : {r2:.4f}")

    artifact_dir = Path("../models")
    artifact_dir.mkdir(exist_ok=True)

    joblib.dump(
        {
            "model": model,
            "feature_columns": X.columns.tolist(),
        },
        artifact_dir / "traffic_congestion_rf_model.joblib",
    )

    print("Model Saved Successfully!")


if __name__ == "__main__":
    train()