import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Form, Card, Button, Container, Row, Col } from "react-bootstrap";

const materialOptions = [
  { value: "cotton", label: "Cotton" },
  { value: "linen", label: "Linen" },
  { value: "polyester", label: "Polyester" },
  { value: "wool", label: "Wool" },
  { value: "nylon", label: "Nylon" },
  { value: "denim", label: "Denim" },
  { value: "jersey", label: "Jersey" },
];

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "none",
    "&:hover": {
      border: "1px solid #cbd5e1",
    },
    padding: "4px",
    minHeight: "48px",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e2e8f0",
    borderRadius: "8px",
    padding: "2px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#e2e8f0" : null,
    "&:active": {
      backgroundColor: "#60a5fa",
    },
  }),
};

export const WeatherPage = () => {
  const [materialsSelected, setMaterialsSelected] = useState([]);
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [temperature, setTemperature] = useState("");

  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const styles = {
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      paddingTop: "2rem",
      paddingBottom: "4rem",
    },
    header: {
      textAlign: "center",
      marginBottom: "2.5rem",
      padding: "2rem 1rem",
    },
    title: {
      fontSize: "3rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "1rem",
      letterSpacing: "-0.025em",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "1.125rem",
      maxWidth: "600px",
      margin: "0 auto",
    },
    card: {
      border: "none",
      borderRadius: "20px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      backgroundColor: "#ffffff",
      marginBottom: "2rem",
      overflow: "hidden",
    },
    cardHeader: {
      background: "linear-gradient(to right, #3b82f6, #60a5fa)",
      padding: "1.5rem",
      borderBottom: "none",
    },
    cardTitle: {
      color: "#ffffff",
      fontSize: "1.5rem",
      fontWeight: "600",
      margin: 0,
    },
    cardBody: {
      padding: "2rem",
    },
    input: {
      height: "48px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      width: "100%",
      transition: "all 0.2s",
      "&:focus": {
        borderColor: "#3b82f6",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      },
    },
    weatherInfo: {
      background: "linear-gradient(145deg, #f8fafc, #f1f5f9)",
      borderRadius: "16px",
      padding: "1.5rem",
      marginTop: "1.5rem",
    },
    weatherTemp: {
      fontSize: "3rem",
      fontWeight: "700",
      color: "#1e293b",
      marginBottom: "0.5rem",
      lineHeight: "1",
    },
    weatherConditions: {
      color: "#64748b",
      fontSize: "1.25rem",
      textTransform: "capitalize",
      marginBottom: "0.5rem",
    },
    location: {
      color: "#94a3b8",
      fontSize: "1rem",
    },
    submitButton: {
      background: "linear-gradient(to right, #3b82f6, #60a5fa)",
      border: "none",
      borderRadius: "12px",
      padding: "0.875rem 1.5rem",
      fontSize: "1rem",
      fontWeight: "500",
      color: "white",
      width: "100%",
      transition: "all 0.2s",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.2)",
      },
    },
    label: {
      fontSize: "1rem",
      fontWeight: "500",
      color: "#475569",
      marginBottom: "0.5rem",
      display: "block",
    },
  };

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
    console.log(JSON.stringify(formData));
  };

  return (
    <div style={styles.pageContainer}>
      <Container>
        <div style={styles.header}>
          <h1 style={styles.title}>Weather & Preferences</h1>
          <p style={styles.subtitle}>Personalize your clothing recommendations based on weather conditions and material preferences</p>
        </div>

        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Current Weather</h2>
              </div>
              <Card.Body style={styles.cardBody}>
                <Form.Control ref={inputRef} style={styles.input} placeholder="Enter your location..." />

                {loading && (
                  <div className="d-flex justify-content-center mt-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}

                {place && weather && (
                  <div style={styles.weatherInfo}>
                    <h3 style={styles.weatherTemp}>{Math.round(weather.main.temp)}°C</h3>
                    <p style={styles.weatherConditions}>{weather.weather[0].description}</p>
                    <p style={styles.location}>{place.formatted_address}</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Your Preferences</h2>
              </div>
              <Card.Body style={styles.cardBody}>
                <Form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label style={styles.label}>Preferred Materials</label>
                    <Select isMulti options={materialOptions} value={materialsSelected} onChange={setMaterialsSelected} styles={customSelectStyles} placeholder="Choose materials..." />
                  </div>

                  <div className="mb-4">
                    <label style={styles.label}>Ideal Temperature (°C)</label>
                    <Form.Control type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="Enter temperature" style={styles.input} />
                  </div>

                  <Button type="submit" style={styles.submitButton}>
                    Save Preferences
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WeatherPage;
