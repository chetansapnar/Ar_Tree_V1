import React from "react";
import "../styles/ErrorDisplay.css";

export default function ErrorDisplay({ message, onRetry, onBack }) {
  return (
    <div className="error-display-container">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <h2>Connection Error</h2>
        <p className="error-message">{message}</p>
        <div className="error-instructions">
          <h3>To fix this:</h3>
          <ol>
            <li>Open a terminal/command prompt</li>
            <li>Navigate to the backend folder: <code>cd backend</code></li>
            <li>Install dependencies: <code>pip install -r requirements.txt</code></li>
            <li>Start the server: <code>python -m uvicorn main:app --reload</code></li>
            <li>Make sure the server is running on <code>http://192.168.43.72:8000</code></li>
          </ol>
        </div>
        <div className="error-actions">
          {onRetry && (
            <button className="btn-primary" onClick={onRetry}>
              Retry
            </button>
          )}
          {onBack && (
            <button className="btn-secondary" onClick={onBack}>
              Back to Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

