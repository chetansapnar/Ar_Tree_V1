import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Help.css";

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="help-container">
      <div className="help-header">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back
        </button>
        <h1>Help & Learn</h1>
      </div>

      <div className="help-content">
        <section className="help-section">
          <h2>How to Use AR in Browser</h2>
          <div className="help-item">
            <h3>Step 1: Allow Camera Access</h3>
            <p>
              When you tap "View in AR", your browser will ask for camera
              permission. Please allow it to enable AR features.
            </p>
          </div>
          <div className="help-item">
            <h3>Step 2: Point Your Camera</h3>
            <p>
              Point your phone's camera at a flat surface (like the ground or a
              table).
            </p>
          </div>
          <div className="help-item">
            <h3>Step 3: Place the Tree</h3>
            <p>
              Tap on the screen where you want to place the 3D tree model. You
              can then walk around it and see it from different angles.
            </p>
          </div>
          <div className="help-item">
            <h3>Browser Compatibility</h3>
            <p>
              AR works best on mobile browsers (Chrome, Safari) with WebXR
              support. Desktop browsers will show a 3D interactive model
              instead.
            </p>
          </div>
        </section>

        <section className="help-section">
          <h2>How to Plant a Tree Safely</h2>
          <div className="help-item">
            <h3>Choose the Right Location</h3>
            <p>
              Consider the tree's mature size, sunlight needs, and proximity to
              buildings or utilities.
            </p>
          </div>
          <div className="help-item">
            <h3>Prepare the Soil</h3>
            <p>
              Dig a hole twice as wide as the root ball and slightly shallower.
              Loosen the soil around the hole.
            </p>
          </div>
          <div className="help-item">
            <h3>Plant Properly</h3>
            <p>
              Place the tree in the hole, ensuring the root flare is at ground
              level. Fill with soil and water thoroughly.
            </p>
          </div>
          <div className="help-item">
            <h3>Water and Care</h3>
            <p>
              Water regularly during the first year. Mulch around the base to
              retain moisture and prevent weeds.
            </p>
          </div>
        </section>

        <section className="help-section">
          <h2>Tree Care Guides</h2>
          <div className="help-item">
            <h3>Watering</h3>
            <p>
              Most trees need deep, infrequent watering. Water at the base, not
              the leaves. Adjust based on weather and soil type.
            </p>
          </div>
          <div className="help-item">
            <h3>Pruning</h3>
            <p>
              Prune during dormant season. Remove dead or diseased branches.
              Avoid over-pruning.
            </p>
          </div>
          <div className="help-item">
            <h3>Fertilizing</h3>
            <p>
              Use appropriate fertilizer based on tree type and soil conditions.
              Follow recommended application rates.
            </p>
          </div>
        </section>

        <section className="help-section">
          <h2>Why Selecting Native Species Matters</h2>
          <div className="help-item">
            <h3>Better Adaptation</h3>
            <p>
              Native trees are adapted to local climate, soil, and pests,
              requiring less maintenance.
            </p>
          </div>
          <div className="help-item">
            <h3>Ecosystem Support</h3>
            <p>
              Native trees support local wildlife, including birds, insects, and
              other plants.
            </p>
          </div>
          <div className="help-item">
            <h3>Water Efficiency</h3>
            <p>
              Native species typically need less water once established, making
              them more sustainable.
            </p>
          </div>
          <div className="help-item">
            <h3>Lower Maintenance</h3>
            <p>
              Native trees are naturally resistant to local diseases and pests,
              reducing the need for chemicals.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

