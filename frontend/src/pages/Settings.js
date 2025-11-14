import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Settings.css";

export default function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedLanguage = localStorage.getItem("language") || "en";
    setDarkMode(savedDarkMode);
    setLanguage(savedLanguage);
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    if (newMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const handleClearFavorites = () => {
    if (window.confirm("Are you sure you want to clear all favorites?")) {
      localStorage.removeItem("favorites");
      alert("Favorites cleared!");
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={handleDarkModeToggle}
              />
              Dark Mode
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h2>Language</h2>
          <div className="setting-item">
            <label>
              Language:
              <select value={language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h2>Data</h2>
          <div className="setting-item">
            <button className="btn-danger" onClick={handleClearFavorites}>
              Clear All Favorites
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h2>About</h2>
          <div className="about-content">
            <p>
              <strong>GreenView AR</strong>
            </p>
            <p>Version 1.0 (Web MVP)</p>
            <p>
              A web platform that helps you discover plants suitable for your
              region and visualize them in Augmented Reality.
            </p>
          </div>
        </section>

        <section className="settings-section">
          <h2>Contact & Feedback</h2>
          <div className="contact-content">
            <p>Have questions or feedback?</p>
            <p>
              Email:{" "}
              <a href="mailto:support@greenviewar.com">
                support@greenviewar.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

