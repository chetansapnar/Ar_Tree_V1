import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Splash.css";

export default function Splash() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => navigate("/home"), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="logo-container">
          <div className="logo-icon">🌿</div>
          <h1 className="logo-text">GreenView AR</h1>
        </div>
        <p className="tagline">Grow Smarter. Plant Better. With AR.</p>
        {loading && (
          <div className="loading-animation">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

