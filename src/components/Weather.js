import React, { useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("")

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/weather/${city}`);
      setWeatherData(response.data);
      setError("");
    } catch (err) {
      setWeatherData(null);
      setError("Could not fetch weather data. PLease try again");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Weather</h1>
      <input type="text" placeholder="Enter City" value={city} onChange={(e) => setCity(e.target.value)} />
      <button onClick={fetchWeather}>Get Weather</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
        <div>
          <h2>Weather in {city}</h2>
          <p>Temperature: {weatherData.currentConditions.temp}°C</p>
          <p>Conditions: {weatherData.currentConditions.conditions}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
