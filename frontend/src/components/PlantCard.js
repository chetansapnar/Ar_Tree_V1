import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { slugify } from "../utils/modelUtils";
import "../styles/PlantCard.css";

export default function PlantCard({ plant }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((p) => p.Name === plant.Name));
  }, [plant]);

  const handleViewDetails = () => {
    const slug = slugify(plant.Name || plant.name || "");
    navigate(`/plant-detail/${slug}`, { state: { plant } });
  };

  const handleViewAR = () => {
    navigate("/ar-view", { state: { plant } });
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorite) {
      const updated = favorites.filter((p) => p.Name !== plant.Name);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push(plant);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  return (
    <div className="plant-card">
      <div className="plant-card-image">
        {plant.image_url ? (
          <img
            src={plant.image_url}
            alt={plant.Name}
            onError={(e) => {
              // Replace unreachable external placeholders with an inline SVG data URI fallback
              const name = (plant.Name || "").replace(/&/g, "and");
              const svg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%' height='100%' fill='%231a1a1a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23ffffff' font-family='Arial' font-size='20'>${encodeURIComponent(name)}</text></svg>`;
              e.currentTarget.src = svg;
            }}
          />
        ) : (
          <div className="plant-card-placeholder">🌿</div>
        )}
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={handleToggleFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "⭐" : "☆"}
        </button>
      </div>
      <div className="plant-card-content">
        <h3 className="plant-card-name">{plant.Name}</h3>
        {plant.Scientific_Name && (
          <p className="plant-card-scientific">
            <em>{plant.Scientific_Name}</em>
          </p>
        )}
        <p className="plant-card-city">{plant.City || "India"}</p>
        {plant.price && (
          <p className="plant-card-price">₹{plant.price}</p>
        )}
        <div className="plant-card-buttons">
          <button className="btn-view-details" onClick={handleViewDetails}>
            View Details
          </button>
          <button className="btn-view-ar" onClick={handleViewAR}>
            View in AR
          </button>
        </div>
      </div>
    </div>
  );
}
