import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { Preferences } from "./pages/Preferences";
import WeatherPage from "./pages/WeatherPage";
import { OutfitsPage } from "./pages/OutfitsPage";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/outfits" element={<OutfitsPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
