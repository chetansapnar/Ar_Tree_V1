import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Permissions.css";

export default function Permissions() {
  const navigate = useNavigate();
  const [denied, setDenied] = useState(false);

  const handleAllow = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          navigate("/location-fetch", {
            state: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          setDenied(true);
        }
      );
    } else {
      setDenied(true);
    }
  };

  const handleDeny = () => {
    setDenied(true);
  };

  const handleManualSelect = () => {
    navigate("/recommended-plants", { state: { manual: true } });
  };

  return (
    <div className="permissions-container">
      <div className="permissions-content">
        <h2>Location Access Required</h2>
        {!denied ? (
          <>
            <p className="permissions-text">
              To recommend trees for your region, we need your location.
            </p>
            <div className="permissions-buttons">
              <button className="btn-primary" onClick={handleAllow}>
                Allow Location
              </button>
              <button className="btn-secondary" onClick={handleDeny}>
                Deny
              </button>
            </div>
          </>
        ) : (
          <div className="denied-message">
            <p>
              Location access is required for automatic recommendations. You can
              continue by selecting a region manually.
            </p>
            <button className="btn-primary" onClick={handleManualSelect}>
              Select Region Manually
            </button>
            <button className="btn-secondary" onClick={() => navigate("/home")}>
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

