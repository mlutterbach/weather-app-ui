import React, { useState } from "react";
import axios from "axios";
import Autosuggest from "react-autosuggest";

const Weather = () => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_GEO_API_URL;
  const API_KEY = process.env.REACT_APP_GEO_API_KEY;

  const fetchSuggestions = async (value) => {
    try {
      const response = await axios.get(`${API_URL}?namePrefix=${value}&limit=5`, {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      });
      const cities = response.data.data.map((city) => ({
        name: city.name,
        country: city.country,
      }));
      setSuggestions(cities);
    } catch (err) {
      console.error("Error fetching city suggestions:", err);
      setSuggestions([]);
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/weather/${city}`);
      setWeatherData(response.data);
      setError("");
    } catch (err) {
      setWeatherData(null);
      setError("Could not fetch weather data. Please try again.");
    }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    if (value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion.name;

  const renderSuggestion = (suggestion) => (
    <div className="react-autosuggest__suggestion">
      {suggestion.name}, {suggestion.country}
    </div>
  );

  return (
    <div className="container">
      <h1>Weather</h1>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          placeholder: "Enter City",
          value: city,
          onChange: (e, { newValue }) => setCity(newValue),
        }}
      />
      <button className="button" onClick={fetchWeather}>Get Weather</button>
      {error && <p className="error">{error}</p>}
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
