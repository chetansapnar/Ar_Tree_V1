// Utility functions for model handling

const AVAILABLE_MODELS = [
  "adenium_obesum_i.glb",
  "indoor_plant.glb",
  "pothos_plant.glb",
  "rhyzome_plant.glb",
];

export function slugify(name = "") {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

export function getModelPath(plantName, modelUrl = null) {
  // If model_url is provided, use it
  if (modelUrl) {
    return modelUrl;
  }
  
  // Try to find plant-specific model
  const slug = slugify(plantName);
  const plantModel = `/models/${slug}.glb`;
  
  // If we have a matching model file name in AVAILABLE_MODELS, return the plant-specific model path
  if (AVAILABLE_MODELS.includes(`${slug}.glb`)) {
    return plantModel;
  }

  // Fallback: return the first available model with the correct /models/ prefix
  return AVAILABLE_MODELS.length > 0 ? `/models/${AVAILABLE_MODELS[0]}` : plantModel;
}

export function getAvailableModels() {
  return AVAILABLE_MODELS.map(name => `/models/${name}`);
}

