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

const DEMO_SUGGESTIONS = {
  hot: {
    cotton: {
      tops: [
        {
          name: "Breathable Cotton T-Shirt",
          material: "cotton",
          description: "Light and airy crew neck t-shirt perfect for warm weather",
          benefits: "Moisture-wicking, breathable, and comfortable against skin",
        },
        {
          name: "Cotton Tank Top",
          material: "cotton",
          description: "Sleeveless athletic-style top with relaxed fit",
          benefits: "Maximum ventilation, perfect for high temperatures",
        },
      ],
      bottoms: [
        {
          name: "Cotton Shorts",
          material: "cotton",
          description: "Classic-fit shorts hitting just above the knee",
          benefits: "Breathable cotton blend, perfect for casual summer wear",
        },
      ],
    },
    linen: {
      tops: [
        {
          name: "Linen Button-Up Shirt",
          material: "linen",
          description: "Loose-fitting casual shirt with rolled-up sleeves",
          benefits: "Excellent airflow, quick-drying, becomes softer with each wash",
        },
      ],
      bottoms: [
        {
          name: "Linen Beach Pants",
          material: "linen",
          description: "Relaxed-fit pants with elastic waistband",
          benefits: "Ultra-breathable, perfect for hot and humid conditions",
        },
      ],
    },
    polyester: {
      tops: [
        {
          name: "Sport Performance Tee",
          material: "polyester",
          description: "Athletic fit moisture-wicking t-shirt",
          benefits: "Quick-drying, odor-resistant, perfect for active wear",
        },
      ],
      bottoms: [
        {
          name: "Athletic Shorts",
          material: "polyester",
          description: "Lightweight training shorts with built-in liner",
          benefits: "Moisture-wicking, quick-drying, maximum mobility",
        },
      ],
    },
  },
  cold: {
    wool: {
      tops: [
        {
          name: "Merino Wool Sweater",
          material: "wool",
          description: "Medium-weight pullover sweater",
          benefits: "Naturally temperature-regulating, moisture-wicking, and odor-resistant",
        },
      ],
      bottoms: [
        {
          name: "Wool Blend Trousers",
          material: "wool",
          description: "Tailored-fit pants with subtle texture",
          benefits: "Warm, durable, and naturally wrinkle-resistant",
        },
      ],
    },
    cotton: {
      tops: [
        {
          name: "Thermal Henley",
          material: "cotton",
          description: "Long-sleeve layering piece with button placket",
          benefits: "Warm but breathable, great for layering",
        },
        {
          name: "Heavy Cotton Sweatshirt",
          material: "cotton",
          description: "Thick cotton blend crew neck sweatshirt",
          benefits: "Cozy warmth, soft interior, durable exterior",
        },
      ],
      bottoms: [
        {
          name: "Cotton Fleece Joggers",
          material: "cotton",
          description: "Tapered-fit sweatpants with fleece lining",
          benefits: "Comfortable fit, warm fleece interior",
        },
      ],
    },
    denim: {
      tops: [
        {
          name: "Denim Jacket",
          material: "denim",
          description: "Classic-fit jean jacket with button closure",
          benefits: "Durable, wind-resistant, perfect for layering",
        },
      ],
      bottoms: [
        {
          name: "Fleece-Lined Jeans",
          material: "denim",
          description: "Classic straight-leg jeans with warm lining",
          benefits: "Added warmth without bulk, maintains denim durability",
        },
      ],
    },
  },
};

const WeatherPage = () => {
  const [materialsSelected, setMaterialsSelected] = useState([]);
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temperature, setTemperature] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      setShowSuggestions(true);
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      alert("Failed to save preferences");
    }
  };

  const getClothingSuggestions = () => {
    if (!weather || !materialsSelected.length) return null;

    const temp = Math.round(weather.main.temp);
    const userIdealTemp = parseInt(temperature) || 20;
    const isHot = temp > userIdealTemp;

    const selectedMaterials = materialsSelected.map((m) => m.value);

    const filteredSuggestions = {
      tops: [],
      bottoms: [],
    };

    selectedMaterials.forEach((material) => {
      const categoryData = DEMO_SUGGESTIONS[isHot ? "hot" : "cold"][material];
      if (categoryData) {
        if (categoryData.tops) {
          filteredSuggestions.tops.push(...categoryData.tops);
        }
        if (categoryData.bottoms) {
          filteredSuggestions.bottoms.push(...categoryData.bottoms);
        }
      }
    });

    if (filteredSuggestions.tops.length === 0 && filteredSuggestions.bottoms.length === 0) {
      return (
        <div className="suggestions-container">
          <h3>No specific recommendations found for your selected materials</h3>
          <p>Try selecting different materials or adjusting your preferences</p>
        </div>
      );
    }

    return (
      <div className="clothing-suggestions">
        {filteredSuggestions.tops.length > 0 && (
          <div className="suggestion-section">
            <h4>Tops</h4>
            {filteredSuggestions.tops.map((item, index) => (
              <div key={index} className="suggestion-item">
                <h5>{item.name}</h5>
                <p>
                  <strong>Material:</strong> {item.material}
                </p>
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
                <p>
                  <strong>Benefits:</strong> {item.benefits}
                </p>
              </div>
            ))}
          </div>
        )}
        {filteredSuggestions.bottoms.length > 0 && (
          <div className="suggestion-section">
            <h4>Bottoms</h4>
            {filteredSuggestions.bottoms.map((item, index) => (
              <div key={index} className="suggestion-item">
                <h5>{item.name}</h5>
                <p>
                  <strong>Material:</strong> {item.material}
                </p>
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
                <p>
                  <strong>Benefits:</strong> {item.benefits}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
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

          {showSuggestions && weather && (
            <div className="card recommendations-card">
              <div className="card-header">
                <h2 className="card-title">Recommended Outfits</h2>
                <p className="card-subtitle">
                  For {Math.round(weather.main.temp)}°C based on your ideal temperature of {temperature}°C
                </p>
              </div>
              <div className="card-body">{getClothingSuggestions()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
