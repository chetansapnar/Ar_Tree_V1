import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Permissions from "./pages/Permissions";
import LocationFetch from "./pages/LocationFetch";
import RecommendedPlants from "./pages/RecommendedPlants";
import PlantDetail from "./pages/PlantDetail";
import ARView from "./pages/ARView";
import Favorites from "./pages/Favorites";
import Help from "./pages/Help";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/permissions" element={<Permissions />} />
        <Route path="/location-fetch" element={<LocationFetch />} />
        <Route path="/recommended-plants" element={<RecommendedPlants />} />
        <Route path="/plant-detail" element={<PlantDetail />} />
        <Route path="/ar-view" element={<ARView />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<Settings />} />
        {/* Legacy route for backward compatibility */}
        <Route path="/plant/:name" element={<PlantDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
