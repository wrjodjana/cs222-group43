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
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["(cities)"],
        fields: ["address_components", "formatted_address", "geometry", "name"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const selectedPlace = autocompleteRef.current.getPlace();
        setPlace(selectedPlace);
        let city = "";
        let country = "";

        selectedPlace.address_components.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });
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
      {place && (
        <div style={resultStyle}>
          <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>Selected Location:</h3>
          <p>{place.formatted_address}</p>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
            Coordinates: {place.geometry?.location.lat().toFixed(4)}, {place.geometry?.location.lng().toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};
