import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PlantCard from "../components/PlantCard";
import ErrorDisplay from "../components/ErrorDisplay";
import "../styles/RecommendedPlants.css";

export default function RecommendedPlants() {
  const location = useLocation();
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    sunlight: "",
    water: "",
    type: "",
  });
  const region = location.state?.region || "India";
  const showAll = location.state?.showAll || false;

  useEffect(() => {
    fetchPlants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, showAll]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, plants]);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching plants for region:", region, "showAll:", showAll);
      
      // Configure axios with timeout to prevent infinite hanging
      const axiosConfig = { timeout: 10000 }; // 10 second timeout
      
      // If "All" or showAll flag, fetch all plants directly
      if (showAll || region === "All" || region === "all") {
        console.log("Fetching all plants...");
        const allPlantsRes = await axios.get("http://192.168.43.72:8000/plants", axiosConfig);
        setPlants(allPlantsRes.data);
        setFilteredPlants(allPlantsRes.data);
        setLoading(false);
        return;
      }
      
      // First try region-specific search
      const res = await axios.get(
        `http://192.168.43.72:8000/plants/${region || "India"}`,
        axiosConfig
      );
      
      // If no results found for region, fallback to all plants
      if (res.data && Array.isArray(res.data) && res.data.length === 0) {
        console.log("No plants found for region, fetching all plants...");
        const allPlantsRes = await axios.get("http://192.168.43.72:8000/plants", axiosConfig);
        setPlants(allPlantsRes.data);
        setFilteredPlants(allPlantsRes.data);
      } else if (Array.isArray(res.data)) {
        setPlants(res.data);
        setFilteredPlants(res.data);
      }
    } catch (err) {
      console.error("Error fetching plants:", err);
      // Try fallback to all plants
      try {
        console.log("Trying fallback to all plants...");
        const res = await axios.get("http://192.168.43.72:8000/plants", { timeout: 10000 });
        if (Array.isArray(res.data)) {
          setPlants(res.data);
          setFilteredPlants(res.data);
        } else {
          throw new Error("Invalid response format");
        }
        setError(null);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        const errorMessage = fallbackError.code === 'ECONNABORTED' || fallbackError.message?.includes('timeout')
          ? "Request timed out. Please check if the backend server is running on http://192.168.43.72:8000"
          : "Cannot connect to backend server. Please make sure the FastAPI server is running on http://192.168.43.72:8000";
        setError(errorMessage);
        setPlants([]);
        setFilteredPlants([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...plants];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (plant) =>
          plant.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plant.Scientific_Name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sunlight filter
    if (filters.sunlight) {
      filtered = filtered.filter((plant) =>
        plant.sunlight?.toLowerCase().includes(filters.sunlight.toLowerCase())
      );
    }

    // Water filter
    if (filters.water) {
      filtered = filtered.filter((plant) =>
        plant.water_need?.toLowerCase().includes(filters.water.toLowerCase())
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(
        (plant) => plant.Type?.toLowerCase() === filters.type.toLowerCase()
      );
    }

    setFilteredPlants(filtered);
  };

  if (error) {
    return (
      <ErrorDisplay
        message={error}
        onRetry={fetchPlants}
        onBack={() => navigate("/home")}
      />
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Analyzing your region…</p>
        <p>Filtering best plants…</p>
      </div>
    );
  }

  return (
    <div className="recommended-plants-container">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back
        </button>
        <h1>{showAll || region === "All" ? "All Plants" : `Recommended for ${region}`}</h1>
      </div>

      <div className="search-filters-section">
        <input
          type="text"
          className="search-bar"
          placeholder="Search plants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filters">
          <select
            value={filters.sunlight}
            onChange={(e) => setFilters({ ...filters, sunlight: e.target.value })}
          >
            <option value="">All Sunlight</option>
            <option value="full">Full Sun</option>
            <option value="partial">Partial</option>
            <option value="shade">Shade</option>
          </select>

          <select
            value={filters.water}
            onChange={(e) => setFilters({ ...filters, water: e.target.value })}
          >
            <option value="">All Water Needs</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="evergreen">Evergreen</option>
            <option value="deciduous">Deciduous</option>
          </select>
        </div>
      </div>

      {plants.length === 0 ? (
        <div className="no-results">
          <p>No plants found for region "{region}".</p>
          <p>Try browsing all plants or selecting a different region.</p>
          <div className="no-results-actions">
            <button className="btn-primary" onClick={() => {
              fetchPlants();
              // Force fetch all plants
              axios.get("http://192.168.43.72:8000/plants")
                .then(res => {
                  setPlants(res.data);
                  setFilteredPlants(res.data);
                })
                .catch(err => console.error(err));
            }}>
              Show All Plants
            </button>
            <button className="btn-secondary" onClick={() => navigate("/home")}>
              Back to Home
            </button>
          </div>
        </div>
      ) : filteredPlants.length === 0 ? (
        <div className="no-results">
          <p>No plants found matching your search/filter criteria.</p>
          <p>Found {plants.length} plant{plants.length !== 1 ? "s" : ""} for "{region}", but none match your filters.</p>
          <div className="no-results-actions">
            <button className="btn-primary" onClick={() => {
              setSearchTerm("");
              setFilters({ sunlight: "", water: "", type: "" });
            }}>
              Clear Filters
            </button>
            <button className="btn-secondary" onClick={() => navigate("/home")}>
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="plants-grid">
          {filteredPlants.map((plant, index) => (
            <PlantCard key={plant.id || index} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
}

