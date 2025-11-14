import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/LocationFetch.css";

export default function LocationFetch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [coordinates, setCoordinates] = useState(null);
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.lat && location.state?.lng) {
      setCoordinates({
        lat: location.state.lat,
        lng: location.state.lng,
      });
      // Simple reverse geocoding - in production, use a proper geocoding service
      reverseGeocode(location.state.lat, location.state.lng);
    } else {
      // Request location if not provided
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoordinates({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          (error) => {
            setLoading(false);
            navigate("/permissions");
          }
        );
      }
    }
  }, [location, navigate]);

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using a simple reverse geocoding approach
      // In production, use Google Maps API or similar
      const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      if (response.data.city || response.data.locality) {
        setRegion(response.data.city || response.data.locality);
      }
      setLoading(false);
    } catch (error) {
      // Fallback: use coordinates to estimate region
      setRegion("India");
      setLoading(false);
    }
  };

  const handleGetRecommendations = () => {
    navigate("/recommended-plants", {
      state: { region: region || "India", coordinates },
    });
  };

  return (
    <div className="location-fetch-container">
      <div className="location-fetch-content">
        <h2>Fetching Your Location</h2>
        {loading ? (
          <>
            <div className="loader"></div>
            <p>Fetching your coordinates…</p>
          </>
        ) : (
          <>
            {coordinates && (
              <div className="coordinates-display">
                <p>
                  <strong>Latitude:</strong> {coordinates.lat.toFixed(4)}
                </p>
                <p>
                  <strong>Longitude:</strong> {coordinates.lng.toFixed(4)}
                </p>
                {region && (
                  <p>
                    <strong>Region:</strong> {region}
                  </p>
                )}
              </div>
            )}
            <button className="btn-primary" onClick={handleGetRecommendations}>
              Get Recommendations
            </button>
          </>
        )}
      </div>
    </div>
  );
}

