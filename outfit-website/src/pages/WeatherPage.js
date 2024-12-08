import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import "./css/WeatherPage.css";

const materialOptions = [
  { value: "cotton", label: "Cotton" },
  { value: "linen", label: "Linen" },
  { value: "polyester", label: "Polyester" },
  { value: "wool", label: "Wool" },
  { value: "nylon", label: "Nylon" },
  { value: "denim", label: "Denim" },
  { value: "jersey", label: "Jersey" },
];

const WeatherPage = () => {
  const [materialsSelected, setMaterialsSelected] = useState([]);
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temperature, setTemperature] = useState("");

  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLEMAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      if (inputRef.current) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["(cities)"],
          fields: ["formatted_address", "geometry"],
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const selectedPlace = autocompleteRef.current.getPlace();
          setPlace(selectedPlace);
          if (selectedPlace.geometry) {
            fetchWeather(selectedPlace.geometry.location.lat(), selectedPlace.geometry.location.lng());
          }
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`);
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError("Unable to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedPreferences = localStorage.getItem("preferences");
    if (savedPreferences) {
      const { materials, idealTemperature } = JSON.parse(savedPreferences);
      setMaterialsSelected(materials.map((m) => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) })));
      setTemperature(idealTemperature);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      location: place?.formatted_address,
      materials: materialsSelected.map((option) => option.value),
      idealTemperature: temperature,
      currentWeather: weather
        ? {
            temperature: Math.round(weather.main.temp),
            conditions: weather.weather[0].description,
          }
        : null,
    };

    try {
      localStorage.setItem("preferences", JSON.stringify(formData));
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      alert("Failed to save preferences");
    }
  };

  return (
    <div className="weather-page">
      <div className="container">
        <header className="header">
          <h1 className="title">Weather & Preferences</h1>
          <p className="subtitle">Personalize your clothing recommendations based on weather conditions and material preferences</p>
        </header>

        <div className="content">
          <div className="card weather-card">
            <div className="card-header">
              <h2 className="card-title">Current Weather</h2>
            </div>
            <div className="card-body">
              <input ref={inputRef} className="input" placeholder="Enter your location..." />

              {loading && <div className="loading">Loading...</div>}

              {error && <div className="error">{error}</div>}

              {place && weather && (
                <div className="weather-info">
                  <h3 className="weather-temp">{Math.round(weather.main.temp)}°C</h3>
                  <p className="weather-conditions">{weather.weather[0].description}</p>
                  <p className="location">{place.formatted_address}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card preferences-card">
            <div className="card-header">
              <h2 className="card-title">Your Preferences</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="label">Preferred Materials</label>
                  <Select isMulti options={materialOptions} value={materialsSelected} onChange={setMaterialsSelected} className="react-select-container" classNamePrefix="react-select" placeholder="Choose materials..." />
                </div>

                <div className="form-group">
                  <label className="label">Ideal Temperature (°C)</label>
                  <input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="Enter temperature" className="input" />
                </div>

                <button type="submit" className="submit-button">
                  Save Preferences
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
