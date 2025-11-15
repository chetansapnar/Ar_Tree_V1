# ...existing code...
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path
from urllib.parse import quote

app = FastAPI(title="GreenAR API - CSV Version")

# Allow frontend access
origins = [
    "http://localhost:3000",
    "http://192.168.43.72:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_BASE = "http://192.168.43.72:3000"

def slugify(name: str) -> str:
    return "".join(c.lower() if c.isalnum() else "-" for c in str(name)).replace("--", "-").strip("-")

def attach_model_urls(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    # Use underscore-separated filenames for model files (matches files in frontend/public/models)
    def model_filename(name: str) -> str:
        s = slugify(name)
        # convert hyphens to underscores to match actual filenames like `teak_tree.glb`
        return quote(s.replace('-', '_'))

    def image_filename(name: str) -> str:
        s = slugify(name)
        # convert hyphens to underscores to match actual filenames like `teak_tree.jpg`
        return quote(s.replace('-', '_'))

    df["model_url"] = df["Name"].apply(lambda n: f"{FRONTEND_BASE}/models/{model_filename(n)}.glb")
    df["ios_model_url"] = df["Name"].apply(lambda n: f"{FRONTEND_BASE}/models/{model_filename(n)}.usdz")
    # Override image_url with local path
    df["image_url"] = df["Name"].apply(lambda n: f"{FRONTEND_BASE}/images/{image_filename(n)}.jpg")
    return df

# Load data (relative path)
csv_path = Path(__file__).parent / "plants.csv"
df = pd.read_csv(csv_path)
df = attach_model_urls(df)

@app.get("/")
def root():
    return {"message": "Welcome to GreenAR API (CSV Data Source)"}

@app.get("/plants")
def get_all_plants(region: str = None):
    """Return all plant entries, optionally filtered by region (query param)"""
    if region:
        result = df[df["City"].str.contains(region, case=False, na=False)]
        return result.to_dict(orient="records")
    return df.to_dict(orient="records")

# City name mappings for better matching (geocoding might return different names)
CITY_MAPPINGS = {
    "bangalore": "Bengaluru",
    "bengaluru": "Bengaluru",
    "new delhi": "Delhi",
    "delhi": "Delhi",
    "mumbai": "Mumbai",
    "bombay": "Mumbai",
    "calcutta": "Kolkata",
    "kolkata": "Kolkata",
    "madras": "Chennai",
    "chennai": "Chennai",
    "pune": "Pune",
    "hyderabad": "Hyderabad",
    "ahmedabad": "Ahmedabad",
    "jaipur": "Jaipur",
    "lucknow": "Lucknow",
    "indore": "Indore",
    "patna": "Patna",
    "bhopal": "Bhopal",
    "kochi": "Kochi",
    "cochin": "Kochi",
    "surat": "Surat",
    "nagpur": "Nagpur",
    "goa": "Goa",
    "ranchi": "Ranchi",
    "guwahati": "Guwahati",
    "coimbatore": "Coimbatore",
}

def normalize_city_name(city: str) -> str:
    """Normalize city name using mappings"""
    city_lower = city.lower().strip()
    return CITY_MAPPINGS.get(city_lower, city)

@app.get("/plants/{city}")
def get_plants_by_city(city: str):
    """Filter plants by city/region (case-insensitive with name normalization)"""
    normalized_city = normalize_city_name(city)
    # Try exact match first
    result = df[df["City"].str.lower() == normalized_city.lower()]
    if result.empty:
        # Fallback to contains match
        result = df[df["City"].str.contains(normalized_city, case=False, na=False)]
    return result.to_dict(orient="records")

@app.get("/plant/{name}")
def get_plant_by_name(name: str):
    """Get single plant by name"""
    result = df[df["Name"].str.contains(name, case=False, na=False)]
    if not result.empty:
        return result.iloc[0].to_dict()
    return {"error": "Plant not found"}
# ...existing code...