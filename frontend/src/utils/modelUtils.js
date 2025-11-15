// Utility functions for model handling

const AVAILABLE_MODELS = [
  "adenium_obesum_i.glb",
  "bael_tree.glb",
  "coconut_tree.glb",
  "karanj_tree.glb",
  "neem_tree.glb",
  "peach_tree.glb",
  "pothos_plant.glb",
  "rhyzome_plant.glb",
  "teak_tree.glb",
];

export function slugify(name = "") {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getModelPath(plantName, modelUrl = null) {
  // If model_url is provided, use it
  if (modelUrl) {
    return modelUrl;
  }
  // Build a set of filename candidates derived from the plant name.
  const name = (plantName || "").toString().toLowerCase().trim();
  const cleaned = name.replace(/[^a-z0-9\s_-]/g, "");
  const underscored = cleaned.replace(/\s+/g, "_");
  const hyphened = cleaned.replace(/\s+/g, "-");
  const candidates = [underscored, hyphened].map(s => `${s}.glb`);

  // If we find a matching filename in AVAILABLE_MODELS, return its /models/ path.
  for (const cand of candidates) {
    if (AVAILABLE_MODELS.includes(cand)) {
      return `/models/${cand}`;
    }
  }

  // As a last-ditch, try the slugified-with-hyphens replaced by underscores
  const slugLike = slugify(plantName).replace(/-/g, "_") + ".glb";
  if (AVAILABLE_MODELS.includes(slugLike)) {
    return `/models/${slugLike}`;
  }

  // Fallback: return the first available model with the correct /models/ prefix
  return AVAILABLE_MODELS.length > 0 ? `/models/${AVAILABLE_MODELS[0]}` : `/models/${underscored}.glb`;
}

export function getAvailableModels() {
  return AVAILABLE_MODELS.map(name => `/models/${name}`);
}

// Image utility functions
const AVAILABLE_IMAGES = [
  "adenium_obesum_i.jpg",
  "bael_tree.jpg",
  "coconut_tree.jpg",
  "karanj_tree.jpg",
  "neem_tree.jpg",
  "peach_tree.jpg",
  "pothos_plant.jpg",
  "rhyzome_plant.jpg",
  "teak_tree.jpg",
];

export function getImagePath(plantName, imageUrl = null) {
  // If image_url is provided and it's a local path, use it
  if (imageUrl && (imageUrl.startsWith('/images/') || imageUrl.includes('/images/'))) {
    return imageUrl;
  }
  
  // Build filename candidates from plant name
  const name = (plantName || "").toString().toLowerCase().trim();
  const cleaned = name.replace(/[^a-z0-9\s_-]/g, "");
  const underscored = cleaned.replace(/\s+/g, "_");
  const hyphened = cleaned.replace(/\s+/g, "-");
  
  // Try common image extensions
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const candidates = [];
  
  for (const ext of extensions) {
    candidates.push(`${underscored}${ext}`);
    candidates.push(`${hyphened}${ext}`);
  }
  
  // Check if any candidate exists in AVAILABLE_IMAGES
  for (const cand of candidates) {
    if (AVAILABLE_IMAGES.includes(cand)) {
      return `/images/${cand}`;
    }
  }
  
  // Try slugified version
  const slugLike = slugify(plantName).replace(/-/g, "_");
  for (const ext of extensions) {
    const candidate = `${slugLike}${ext}`;
    if (AVAILABLE_IMAGES.includes(candidate)) {
      return `/images/${candidate}`;
    }
  }
  
  // Fallback: return path based on plant name
  return `/images/${underscored}.jpg`;
}

