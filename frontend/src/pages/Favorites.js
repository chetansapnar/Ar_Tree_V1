import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlantCard from "../components/PlantCard";
import "../styles/Favorites.css";

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);
  };

  const handleRemoveFavorite = (plantName) => {
    const updated = favorites.filter((p) => p.Name !== plantName);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
        <h1>⭐ My Shortlisted Plants</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <p>You haven't saved any plants yet.</p>
          <p>Browse plants and add them to your favorites!</p>
          <button className="btn-primary" onClick={() => navigate("/home")}>
            Browse Plants
          </button>
        </div>
      ) : (
        <div className="favorites-content">
          <p className="favorites-count">
            You have {favorites.length} plant{favorites.length !== 1 ? "s" : ""} in your
            shortlist.
          </p>
          <div className="favorites-grid">
            {favorites.map((plant, index) => (
              <div key={index} className="favorite-card-wrapper">
                <PlantCard plant={plant} />
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFavorite(plant.Name)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

