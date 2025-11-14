import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PlantDetail.css";

function slugify(name = "") {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

export default function PlantDetail() {
  const { state: plant } = useLocation();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (plant) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.some((p) => p.Name === plant.Name));
    }
  }, [plant]);

  if (!plant) {
    return (
      <div className="plant-detail-container">
        <div className="error-message">
          <p>No plant selected.</p>
          <button onClick={() => navigate("/home")}>Back to Home</button>
        </div>
      </div>
    );
  }

  const slug = slugify(plant.Name || plant.name);
  const fallbackGLB = `/models/${slug}.glb`;
  const fallbackUSDZ = `/models/${slug}.usdz`;

  const modelSrc = plant.model_url || fallbackGLB;
  const iosSrc = plant.ios_model_url || fallbackUSDZ;

  const handleAddToFavorites = () => {
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

  const handleViewAR = () => {
    navigate("/ar-view", { state: { plant } });
  };

  return (
    <div className="plant-detail-container">
      <div className="plant-detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to List
        </button>
      </div>

      <div className="plant-detail-content">
        <div className="plant-hero">
          <div className="plant-image-container">
            {plant.image_url ? (
              <img src={plant.image_url} alt={plant.Name} className="plant-hero-image" />
            ) : (
              <div className="plant-placeholder">No Image</div>
            )}
          </div>
          <div className="plant-3d-preview">
            <model-viewer
              src={modelSrc}
              ios-src={iosSrc}
              alt={plant.Name}
              camera-controls
              auto-rotate
              style={{ width: "100%", height: "300px" }}
            ></model-viewer>
          </div>
        </div>

        <div className="plant-info">
          <h1 className="plant-name">{plant.Name}</h1>
          {plant.Scientific_Name && (
            <p className="scientific-name">
              <em>{plant.Scientific_Name}</em>
            </p>
          )}

          <div className="info-blocks">
            <div className="info-block">
              <h3>Lifespan</h3>
              <p>{plant.Lifespan ? `${plant.Lifespan} years` : "Not specified"}</p>
            </div>

            <div className="info-block">
              <h3>Water Requirement</h3>
              <p>{plant.water_need || "Not specified"}</p>
            </div>

            <div className="info-block">
              <h3>Sunlight Requirement</h3>
              <p>{plant.sunlight || "Not specified"}</p>
            </div>

            <div className="info-block">
              <h3>Space Needed (H × W)</h3>
              <p>
                {plant.Height && plant.Breadth
                  ? `${plant.Height}m × ${plant.Breadth}m`
                  : "Not specified"}
              </p>
            </div>

            <div className="info-block">
              <h3>Approx. Price</h3>
              <p>{plant.price ? `₹${plant.price.toLocaleString("en-IN")}` : "Not specified"}</p>
            </div>

            <div className="info-block">
              <h3>Type</h3>
              <p>{plant.Type || "Not specified"}</p>
            </div>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <p>{plant.Description || "No description available."}</p>
          </div>

          <div className="pros-cons-section">
            <div className="pros">
              <h3>✅ Pros</h3>
              <p>{plant.Pros || "Not specified"}</p>
            </div>
            <div className="cons">
              <h3>⚠️ Cons</h3>
              <p>{plant.Cons || "Not specified"}</p>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-primary btn-ar" onClick={handleViewAR}>
              🌳 View in AR
            </button>
            <button
              className={`btn-secondary ${isFavorite ? "favorited" : ""}`}
              onClick={handleAddToFavorites}
            >
              {isFavorite ? "⭐ Remove from Favorites" : "⭐ Add to Favorites"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
