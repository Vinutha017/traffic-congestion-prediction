import joblib
import pandas as pd


class TrafficPredictor:

    def __init__(self, model_path):
        saved = joblib.load(model_path)

        self.model = saved["model"]
        self.feature_columns = saved["feature_columns"]

    def predict(self, input_df):

        input_df = pd.get_dummies(input_df)

        input_df = input_df.reindex(
            columns=self.feature_columns,
            fill_value=0
        )

        prediction = self.model.predict(input_df)

        return prediction[0]