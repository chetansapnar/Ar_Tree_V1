import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleDetectLocation = () => {
    navigate("/permissions");
  };

  const handleBrowseAll = async () => {
    navigate("/recommended-plants", { state: { region: "All", showAll: true } });
  };

  const handleViewFavorites = () => {
    navigate("/favorites");
  };

  const handleLearn = () => {
    navigate("/help");
  };

  return (
    <div className="home-container">
      <div className="top-bar">
        <div className="logo">🌿 GreenView AR</div>
        <div className="top-bar-links">
          <button className="link-btn" onClick={() => navigate("/help")}>
            About
          </button>
          <button className="link-btn" onClick={() => navigate("/help")}>
            Help
          </button>
          <button className="link-btn" onClick={() => navigate("/settings")}>
            Settings
          </button>
        </div>
      </div>

      <div className="home-content">
        <div className="hero-section">
          <h1 className="hero-title">Find the Perfect Tree for Your Region</h1>
          <p className="hero-subtitle">
            Allow location to get best recommendations.
          </p>
        </div>

        <div className="cta-section">
          <button className="cta-primary" onClick={handleDetectLocation}>
            🌍 Detect My Location
          </button>
          <button className="cta-secondary" onClick={handleBrowseAll}>
            📖 Browse All Plants
          </button>
          <button className="cta-secondary" onClick={handleViewFavorites}>
            📂 My Shortlisted Plants
          </button>
          <button className="cta-secondary" onClick={handleLearn}>
            ℹ Learn
          </button>
        </div>
      </div>
    </div>
  );
}
