import pandas as pd


def load_data(file_path):
    """
    Load the traffic dataset.
    """
    return pd.read_csv(file_path)


def create_time_features(df):
    """
    Convert date_time to datetime and create time-based features.
    """
    df = df.copy()

    df["date_time"] = pd.to_datetime(df["date_time"])

    df["hour"] = df["date_time"].dt.hour
    df["day_of_week"] = df["date_time"].dt.day_name()
    df["month"] = df["date_time"].dt.month_name()
    df["is_weekend"] = (df["date_time"].dt.dayofweek >= 5).astype(int)

    return df


def create_holiday_feature(df):
    """
    Create binary holiday feature.
    """
    df = df.copy()

    df["is_holiday"] = df["holiday"].notna().astype(int)

    return df


def remove_duplicates(df):
    """
    Remove duplicate rows.
    """
    return df.drop_duplicates().reset_index(drop=True)


def prepare_model_data(df):
    """
    Prepare the dataframe for machine learning.
    """
    model_df = df.copy()

    # Remove columns that are no longer required
    model_df = model_df.drop(
        columns=["holiday", "date_time", "weather_description"]
    )

    # One-hot encode categorical columns
    categorical_cols = [
        "weather_main",
        "hour",
        "day_of_week",
        "month",
    ]

    model_df = pd.get_dummies(
        model_df,
        columns=categorical_cols,
        drop_first=True,
    )

    return model_df


if __name__ == "__main__":
    df = load_data(".../data/Metro_Interstate_Traffic_Volume.csv")

    df = create_time_features(df)
    df = create_holiday_feature(df)
    df = remove_duplicates(df)
    model_df = prepare_model_data(df)

    print(model_df.head())
    print(model_df.shape)