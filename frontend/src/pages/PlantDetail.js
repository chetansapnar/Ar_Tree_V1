import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/PlantDetail.css";
import { getModelPath, getImagePath } from "../utils/modelUtils";

// Local slugify helper used for matching slug -> plant name
function slugify(name = "") {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}


export default function PlantDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  // plantState is the object passed via navigation; we support fetching by ?name= if not present
  const navPlant = location.state?.plant || null;
  const [plant, setPlant] = useState(navPlant);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(!navPlant);
  const [error, setError] = useState(null);
  const modelRef = useRef(null);
  const [modelLoadError, setModelLoadError] = useState(null);
  const resolvedModelSrc = plant ? (plant.model_url || getModelPath(plant.Name || plant.name)) : null;
  const resolvedIosSrc = plant ? (plant.ios_model_url || (resolvedModelSrc ? resolvedModelSrc.replace('.glb', '.usdz') : null)) : null;
  const resolvedImageSrc = plant ? getImagePath(plant.Name || plant.name, plant.image_url) : null;

  useEffect(() => {
    if (resolvedModelSrc) {
      console.log("PlantDetail: resolved modelSrc ->", resolvedModelSrc);
      setModelLoadError(null);
    }
  }, [resolvedModelSrc]);

  useEffect(() => {
    if (navPlant) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.some((p) => p.Name === navPlant.Name));
    }
  }, [navPlant]);

  useEffect(() => {
    // If plant data not passed via navigation, try to fetch from backend using ?name= query param
    if (!plant) {
      // try URL param slug first (/plant-detail/:slug)
      const slug = params.slug || null;
      if (slug) {
        const fetchPlants = async () => {
          try {
            setLoading(true);
            setError(null);
            const res = await axios.get("http://192.168.43.72:8000/plants");
            if (Array.isArray(res.data)) {
              // find plant by slugified name
              const match = res.data.find(p => {
                const pslug = slugify(p.Name || p.name || "");
                return pslug === slug;
              });
              if (match) {
                setPlant(match);
                const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
                setIsFavorite(favorites.some((p) => p.Name === match.Name));
              } else {
                setError("Plant not found for slug: " + slug);
              }
            } else {
              setError("Invalid plant list from server");
            }
          } catch (err) {
            console.error("Error fetching plants list:", err);
            setError("Failed to load plant data from server");
          } finally {
            setLoading(false);
          }
        };
        fetchPlants();
      } else {
        // fallback to query param name (legacy)
        const qs = new URLSearchParams(location.search);
        const name = qs.get("name");
        if (name) {
          const fetchPlant = async () => {
            try {
              setLoading(true);
              setError(null);
              const res = await axios.get(`http://192.168.43.72:8000/plant/${encodeURIComponent(name)}`);
              if (res.data && !res.data.error) {
                setPlant(res.data);
                const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
                setIsFavorite(favorites.some((p) => p.Name === res.data.Name));
              } else {
                setError("Plant not found");
              }
            } catch (err) {
              console.error("Error fetching plant by name:", err);
              setError("Failed to load plant data from server");
            } finally {
              setLoading(false);
            }
          };
          fetchPlant();
        } else {
          setLoading(false);
          setError("No plant selected (missing navigation state or URL parameter).");
        }
      }
    }
  }, [location.search, plant, params.slug]);

  if (loading) {
    return (
      <div className="plant-detail-container">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading plant details…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="plant-detail-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
      </div>
    );
  }

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

  const onModelLoaded = (e) => {
    console.log("model-viewer loaded:", resolvedModelSrc, e);
    setModelLoadError(null);
  };

  const onModelError = (e) => {
    console.error("model-viewer failed to load:", resolvedModelSrc, e);
    setModelLoadError("Failed to load 3D model. Open the model URL to verify the file.");
  };

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
            {resolvedImageSrc ? (
              <img 
                src={resolvedImageSrc} 
                alt={plant.Name} 
                className="plant-hero-image"
                onError={(e) => {
                  // Hide image and show placeholder if it fails to load
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling;
                  if (placeholder && placeholder.classList.contains('plant-placeholder')) {
                    placeholder.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            {!resolvedImageSrc && (
              <div className="plant-placeholder">No Image</div>
            )}
          </div>
          <div className="plant-3d-preview">
            <model-viewer
              ref={modelRef}
              src={resolvedModelSrc}
              ios-src={resolvedIosSrc}
              alt={plant.Name}
              camera-controls
              auto-rotate
              style={{ width: "100%", height: "300px" }}
              onLoad={onModelLoaded}
              onError={onModelError}
            ></model-viewer>

            {modelLoadError && (
              <div className="model-error">
                <p>⚠️ {modelLoadError}</p>
                <p>
                  Direct model URL: <a href={resolvedModelSrc} target="_blank" rel="noreferrer">{resolvedModelSrc}</a>
                </p>
              </div>
            )}
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
              <h3>Carbon Offset</h3>
              <p>{plant.carbon_offset ? `${plant.carbon_offset} kg CO₂/year` : "Not specified"}</p>
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
