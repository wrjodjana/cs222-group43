import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const libraries = ["places"];

export const WeatherPage = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_API_KEY,
    libraries: libraries,
  });

  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`);
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["(cities)"],
        fields: ["address_components", "formatted_address", "geometry", "name"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const selectedPlace = autocompleteRef.current.getPlace();
        setPlace(selectedPlace);
        if (selectedPlace.geometry) {
          const lat = selectedPlace.geometry.location.lat();
          const lon = selectedPlace.geometry.location.lng();
          fetchWeather(lat, lon);
        }
      });
    }
  }, [isLoaded]);

  const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
  };

  const textStyle = {
    fontSize: "32px",
  };

  const inputStyle = {
    width: "400px",
    height: "50px",
    borderRadius: "20px",
    padding: "10px 10px 10px 20px",
    fontSize: "18px",
  };

  const resultStyle = {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f5f5f5",
    maxWidth: "400px",
    textAlign: "center",
  };

  if (!isLoaded) {
    return <div style={divStyle}>Loading...</div>;
  }

  return (
    <div style={divStyle}>
      <p style={textStyle}>Search your location!</p>
      <input ref={inputRef} style={inputStyle} type="text" placeholder="Search for a city" />

      {loading && (
        <div style={resultStyle}>
          <p>Loading weather data...</p>
        </div>
      )}

      {error && (
        <div style={resultStyle}>
          <p style={{ color: "#ff0000" }}>{error}</p>
        </div>
      )}

      {place && (
        <div style={resultStyle}>
          <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>Selected Location:</h3>
          <p>{place.formatted_address}</p>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Coordinates: {place.geometry?.location.lat().toFixed(4)}, {place.geometry?.location.lng().toFixed(4)}
          </p>
          {weather && weather.main && (
            <div style={{ marginTop: "15px", borderTop: "1px solid #ddd", paddingTop: "15px" }}>
              <p>Temperature: {Math.round(weather.main.temp)}°C</p>
              {weather.weather && weather.weather[0] && <p>Conditions: {weather.weather[0].description}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherPage;
