import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    temp: "",
    rain_1h: "",
    snow_1h: "",
    clouds_all: "",
    weather_main: "Clouds",
    hour: 0,
    day_of_week: "Monday",
    month: "January",
    is_weekend: 0,
    is_holiday: 0,
  });

  const [prediction, setPrediction] = useState(null);
  const [trafficStatus, setTrafficStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        [
          "temp",
          "rain_1h",
          "snow_1h",
          "clouds_all",
          "hour",
          "is_weekend",
          "is_holiday",
        ].includes(name)
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "https://traffic-congestion-prediction-ufyt.onrender.com/predict",
        formData
      );

      setPrediction(response.data.predicted_traffic_volume);
      setTrafficStatus(response.data.traffic_status);
    } catch (error) {
      console.error(error);
      alert("Prediction Failed!");
    } finally {
      setLoading(false);
    }
  };

  const getTrafficMessage = () => {
    if (trafficStatus.includes("Low"))
      return "✅ Roads are expected to be clear. Travel should be smooth.";

    if (trafficStatus.includes("Medium"))
      return "⚠️ Moderate congestion expected. Plan a little extra travel time.";

    return "🚨 Heavy traffic expected. Consider leaving earlier or taking an alternate route.";
  };

  return (
    <div className="container">
      <h1>🚦 Traffic Congestion Prediction</h1>

      <p className="subtitle">
        Predict road traffic using Machine Learning
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>🌡️ Temperature (K)</label>
          <input
            type="number"
            name="temp"
            placeholder="Enter temperature"
            value={formData.temp}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>🌧️ Rain (mm)</label>
          <input
            type="number"
            name="rain_1h"
            placeholder="Enter rainfall"
            value={formData.rain_1h}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>❄️ Snow (mm)</label>
          <input
            type="number"
            name="snow_1h"
            placeholder="Enter snowfall"
            value={formData.snow_1h}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>☁️ Cloud Coverage (%)</label>
          <input
            type="number"
            name="clouds_all"
            placeholder="Enter cloud coverage"
            value={formData.clouds_all}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>🌤️ Weather</label>
          <select
            name="weather_main"
            value={formData.weather_main}
            onChange={handleChange}
          >
            <option>Clouds</option>
            <option>Clear</option>
            <option>Rain</option>
            <option>Snow</option>
            <option>Mist</option>
          </select>
        </div>

        <div className="form-group">
          <label>🕒 Hour</label>
          <select
            name="hour"
            value={formData.hour}
            onChange={handleChange}
          >
            {[...Array(24)].map((_, i) => (
              <option key={i} value={i}>
                {i}:00
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>📅 Day of Week</label>
          <select
            name="day_of_week"
            value={formData.day_of_week}
            onChange={handleChange}
          >
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
        </div>

        <div className="form-group">
          <label>📆 Month</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
          >
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
        </div>

        <div className="form-group">
          <label>🏖️ Weekend</label>
          <select
            name="is_weekend"
            value={formData.is_weekend}
            onChange={handleChange}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label>🎉 Holiday</label>
          <select
            name="is_holiday"
            value={formData.is_holiday}
            onChange={handleChange}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "⏳ Predicting..." : "🚦 Predict Traffic"}
        </button>
      </form>

      {prediction !== null && (
        <div className="result-card">
          <h2>🚗 Prediction Result</h2>

          <div className="result-value">
            {Math.round(prediction).toLocaleString()} Vehicles / Hour
          </div>

          <div
            className={
              trafficStatus.includes("Low")
                ? "status low"
                : trafficStatus.includes("Medium")
                ? "status medium"
                : "status high"
            }
          >
            {trafficStatus}
          </div>

          <p className="status-message">{getTrafficMessage()}</p>
        </div>
      )}

      <div className="footer">
        🚀 Built with <strong>React</strong>, <strong>FastAPI</strong> &{" "}
        <strong>Scikit-learn</strong>
      </div>
    </div>
  );
}

export default App;