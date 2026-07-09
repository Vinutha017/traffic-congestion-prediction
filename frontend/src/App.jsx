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

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );

      setPrediction(response.data.predicted_traffic_volume);
      setTrafficStatus(response.data.traffic_status);
    } catch (error) {
      console.log(error.response);
      console.log(error.response?.data);
      alert("Prediction Failed");
    }
  };

  return (
    <div className="container">
      <h1>🚦 Traffic Congestion Prediction</h1>

      <p className="subtitle">
        Predict traffic volume using Machine Learning
      </p>

      <form className="form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Temperature (K)</label>
          <input
            type="number"
            name="temp"
            placeholder="Enter temperature"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Rain (mm)</label>
          <input
            type="number"
            name="rain_1h"
            placeholder="Enter rainfall"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Snow (mm)</label>
          <input
            type="number"
            name="snow_1h"
            placeholder="Enter snowfall"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Cloud Coverage (%)</label>
          <input
            type="number"
            name="clouds_all"
            placeholder="Enter cloud coverage"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Weather</label>
          <select name="weather_main" onChange={handleChange}>
            <option>Clouds</option>
            <option>Clear</option>
            <option>Rain</option>
            <option>Snow</option>
            <option>Mist</option>
          </select>
        </div>

        <div className="form-group">
          <label>Hour</label>
          <select name="hour" onChange={handleChange}>
            {[...Array(24)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Day of Week</label>
          <select name="day_of_week" onChange={handleChange}>
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
          <label>Month</label>
          <select name="month" onChange={handleChange}>
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
          <label>Weekend</label>
          <select name="is_weekend" onChange={handleChange}>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label>Holiday</label>
          <select name="is_holiday" onChange={handleChange}>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </div>

        <button type="submit">
          Predict Traffic
        </button>

      </form>

      {prediction !== null && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#f8f9fa",
            textAlign: "center",
          }}
        >
          <h2>🚗 Predicted Traffic Volume</h2>

          <h1 style={{ color: "#0d6efd" }}>
            {prediction.toFixed(2)} vehicles/hour
          </h1>

          <h2>{trafficStatus}</h2>
        </div>
      )}
    </div>
  );
}

export default App;