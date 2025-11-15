import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getModelPath, getAvailableModels } from "../utils/modelUtils";
import "../styles/ARView.css";

// Available model files as fallback
const AVAILABLE_MODELS = getAvailableModels();

export default function ARView() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const plant = state?.plant;
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [loadPercent, setLoadPercent] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [arDiagnostics, setArDiagnostics] = useState({ canActivateAR: null, webxrSupported: null });
  const modelViewerRef = useRef(null);

  useEffect(() => {
    // Request camera permission when component mounts
    requestCameraPermission();
    // perform initial AR diagnostics after small delay to let model-viewer initialize
    const timer = setTimeout(async () => {
      try {
        const canActivate = modelViewerRef.current && typeof modelViewerRef.current.canActivateAR === 'function'
          ? await modelViewerRef.current.canActivateAR().catch(() => null)
          : null;
        let webxr = null;
        if (navigator.xr && navigator.xr.isSessionSupported) {
          try {
            webxr = await navigator.xr.isSessionSupported('immersive-ar');
          } catch (e) { webxr = null; }
        }
        setArDiagnostics({ canActivateAR: canActivate, webxrSupported: webxr });
      } catch (e) {
        console.warn('AR diagnostics failed:', e);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const requestCameraPermission = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Permission granted
        setCameraPermission("granted");
        // Stop the stream immediately as we just needed permission
        stream.getTracks().forEach(track => track.stop());
      } else {
        setCameraPermission("not-supported");
      }
    } catch (error) {
      console.log("Camera permission:", error.name);
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setCameraPermission("denied");
      } else {
        setCameraPermission("error");
      }
    }
  };

  const handleProgress = (event) => {
    try {
      const pct = event?.detail?.totalProgress != null
        ? Math.round(event.detail.totalProgress * 100)
        : null;
      if (pct != null) setLoadPercent(pct);
      console.log("model-viewer progress:", pct, "%", "src:", modelSrc);
    } catch (e) {
      console.warn("Progress event handling error:", e);
    }
  };

  if (!plant) {
    return (
      <div className="ar-view-container">
        <div className="error-message">
          <p>No plant selected for AR view.</p>
          <button onClick={() => navigate("/home")}>Back to Home</button>
        </div>
      </div>
    );
  }

  // Get model path - use provided URL or generate from plant name, with fallback
  const modelSrc = getModelPath(plant.Name || plant.name, plant.model_url);
  const iosSrc = plant.ios_model_url || modelSrc.replace('.glb', '.usdz');
  
  // Fallback model (use first available model)
  const fallbackModel = AVAILABLE_MODELS[0] || "/models/indoor_plant.glb";

  const handleModelLoad = () => {
    console.log("Model loaded successfully:", modelSrc);
    setModelLoaded(true);
    setModelError(null);
    setLoadPercent(100);
  };

  const handleModelError = (error) => {
    console.error("Model loading error:", error);
    setModelError("Failed to load 3D model. Using fallback model.");
    // Try to load fallback model
    if (modelViewerRef.current && modelSrc !== fallbackModel) {
      // setAttribute is more reliable for custom elements
      try {
        modelViewerRef.current.setAttribute("src", fallbackModel);
        modelViewerRef.current.setAttribute("ios-src", fallbackModel.replace('.glb', '.usdz'));
        // reset loaded flag so the loader shows until fallback finishes
        setModelLoaded(false);
      } catch (e) {
        console.error("Failed to set fallback src on model-viewer:", e);
      }
    }
  };

  const activateAR = async () => {
    if (!modelViewerRef.current) {
      console.error("model-viewer ref not available");
      alert("Model viewer not ready. Please wait for the model to load.");
      return;
    }
    try {
      console.log("=== AR ACTIVATION DEBUG LOG ===");
      console.log("AR activation attempt started");
      console.log("Browser user agent:", navigator.userAgent);
      console.log("WebXR available:", !!navigator.xr);
      console.log("Model src:", modelSrc);
      console.log("Device pixel ratio:", window.devicePixelRatio);
      
      // Prefer model-viewer's built-in AR activation API
      if (typeof modelViewerRef.current.canActivateAR === "function") {
        try {
          const canAR = await modelViewerRef.current.canActivateAR();
          console.log("✓ model-viewer canActivateAR:", canAR);
          if (canAR) {
            console.log("→ Calling activateAR from model-viewer...");
            await modelViewerRef.current.activateAR();
            console.log("✓✓ AR activated successfully via model-viewer");
            return;
          }
        } catch (e) {
          console.warn("✗ canActivateAR check failed:", e);
        }
      } else {
        console.log("✗ canActivateAR not available on model-viewer");
      }

      // Fallback: check WebXR support directly
      if (navigator.xr && navigator.xr.isSessionSupported) {
        try {
          const supported = await navigator.xr.isSessionSupported("immersive-ar");
          console.log("✓ WebXR immersive-ar supported:", supported);
          if (supported) {
            // Try to activate via model-viewer anyway
            if (typeof modelViewerRef.current.activateAR === "function") {
              console.log("→ Calling activateAR via WebXR path...");
              await modelViewerRef.current.activateAR();
              console.log("✓✓ AR activated successfully via WebXR");
              return;
            }
          }
        } catch (e) {
          console.warn("✗ WebXR support check failed:", e);
        }
      } else {
        console.log("✗ WebXR not available on this browser");
      }

      // Last-resort: launch Android Scene Viewer via intent URL (works when WebXR isn't available)
      console.log("→ Attempting Scene Viewer fallback...");
      const srcAttr = modelViewerRef.current.getAttribute("src") || modelSrc;
      const absolute = new URL(srcAttr, window.location.href).href;
      console.log("Absolute model URL:", absolute);
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(absolute)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end`;
      console.log("Opening Scene Viewer intent:", intentUrl);
      window.location.href = intentUrl;
      console.log("=== END DEBUG LOG ===");
    } catch (error) {
      console.error("✗✗ AR activation error:", error);
      alert("Unable to start AR. Check browser console (F12 → Console tab) for details.\n\nNote: WebXR requires HTTPS or localhost. Scene Viewer works on Android Chrome with supported 3D models.");
    }
  };

  return (
    <div className="ar-view-container">
      <div className="ar-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Details
        </button>
        <h2>{plant.Name} - AR View</h2>
      </div>

      <div className="ar-content">
        <div className="ar-instructions">
          <p className="instruction-text">
            {cameraPermission === "denied" && (
              <span className="warning">⚠️ Camera permission denied. Please allow camera access in your browser settings to use AR.</span>
            )}
            {cameraPermission === "granted" && (
              <span>✅ Camera access granted. Tap the AR button to view in augmented reality.</span>
            )}
            {!cameraPermission && (
              <span>Requesting camera permission...</span>
            )}
            {cameraPermission === "not-supported" && (
              <span>AR requires a mobile device. On desktop, you can view the 3D model interactively.</span>
            )}
          </p>
        </div>

        <div className="model-viewer-container">
          {/* {!modelLoaded && !modelError && loadPercent !== 100 && (
            <div className="loading-overlay">
              <div className="loader"></div>
              <p>Loading 3D model… {loadPercent != null ? `${loadPercent}%` : ""}</p>
            </div>
          )} */}
          {modelError && (
            <div className="error-overlay">
              <p>⚠️ {modelError}</p>
            </div>
          )}
          <model-viewer
            ref={modelViewerRef}
            src={modelSrc}
            ios-src={iosSrc}
            alt={plant.Name}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="auto"
            camera-controls
            auto-rotate
            interaction-policy="allow-when-fixed"
            style={{ width: "100%", height: "500px", backgroundColor: "#1a1a1a" }}
            onLoad={handleModelLoad}
            onError={handleModelError}
            onProgress={handleProgress}
          >
          </model-viewer>
        </div>

        <div className="ar-controls">
          <button
            className="btn-primary"
            onClick={activateAR}
          >
            🌳 Activate AR (Mobile Only)
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              // manual Scene Viewer launch (use absolute URL)
              const srcAttr = modelViewerRef.current?.getAttribute('src') || modelSrc;
              const absolute = new URL(srcAttr, window.location.href).href;
              const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(absolute)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end`;
              window.location.href = intentUrl;
            }}
          >
            🔗 Open Scene Viewer (manual)
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              // navigate to slug route for consistent direct linking
              const slug = (plant.Name || plant.name || "").toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
              navigate(`/plant-detail/${slug}`, { state: { plant } });
            }}
          >
            View Details
          </button>
          {cameraPermission === "denied" && (
            <button
              className="btn-secondary"
              onClick={requestCameraPermission}
            >
              Request Camera Permission
            </button>
          )}
        </div>
        
        <div className="ar-info">
          <p>
            <strong>📱 Mobile AR:</strong> On mobile devices, an AR button will appear automatically in the 3D viewer. 
            Tap it to view the plant in your environment.
          </p>
          <p>
            <strong>🖥️ Desktop:</strong> You can rotate, zoom, and interact with the 3D model using your mouse/trackpad.
          </p>
        </div>

        {modelLoaded && (
          <div className="ar-status">
            <p>✅ Tree model loaded successfully.</p>
            <p className="ar-tips">
              💡 <strong>Tips:</strong> On mobile, tap "View in AR" to place the tree in your environment. 
              On desktop, you can rotate and zoom the 3D model.
            </p>
          </div>
        )}

        {modelError && (
          <div className="ar-status error">
            <p>⚠️ Using fallback model: {fallbackModel.split('/').pop()}</p>
          </div>
        )}

        <div className="ar-diagnostics">
          <h4>AR Diagnostics</h4>
          <p>canActivateAR: {String(arDiagnostics.canActivateAR)}</p>
          <p>WebXR immersive-ar supported: {String(arDiagnostics.webxrSupported)}</p>
          <p>Model URL: {modelSrc}</p>
        </div>
      </div>
    </div>
  );
}
