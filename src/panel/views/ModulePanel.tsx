import React, { useState, useEffect } from "react";
import { SpaceObjectManager } from "../../managers/SpaceObjectManager";

const ModulePanel: React.FC = () => {
  const manager = SpaceObjectManager.getInstance();
  const [selectedSpaceObject, setSelectedSpaceObject] = useState(
    manager.selectedSpaceObject
  );
  const [engineOn, setEngineOn] = useState(false);
  const [throttle, setThrottle] = useState(50);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedSpaceObject(manager.selectedSpaceObject);

      if (engineOn && selectedSpaceObject) {
        const force = throttle * 0.01 * 10;
        const angle = selectedSpaceObject.body.getAngle();
        selectedSpaceObject.applyForce(
          Math.cos(angle) * force,
          Math.sin(angle) * force
        );
      }
    }, 100);

    return () => clearInterval(interval);
  }, [manager, engineOn, throttle, selectedSpaceObject]);

  if (!selectedSpaceObject) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "env(safe-area-inset-bottom)",
          right: "0px",
          width: "260px",
          padding: "12px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          borderRadius: "10px",
          zIndex: 9999,
          paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <h3 style={{ margin: 0 }}>Module Panel</h3>
        <div>No Selection</div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        right: "0",
        width: "270px",
        padding: "14px",
        paddingBottom: "calc(14px + env(safe-area-inset-bottom))",
        margin: "0 10px 10px 0",
        background: "rgba(0,0,0,0.65)",
        color: "#fff",
        fontSize: "14px",
        borderRadius: "12px",
        zIndex: 9999,
        backdropFilter: "blur(4px)",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ margin: 0 }}>Module Panel</h3>

      <div style={{ marginTop: "10px" }}>
        <b>Rotation:</b>
        <br />
        <button onClick={() => selectedSpaceObject.applyTorque(-5)}>
          ⟲ Left
        </button>{" "}
        <button onClick={() => selectedSpaceObject.applyTorque(5)}>
          ⟳ Right
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <b>Engine:</b>
        <br />
        <button onClick={() => setEngineOn(!engineOn)}>
          {engineOn ? "🚫 Turn Off" : "🚀 Turn On"}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={throttle}
          onChange={(e) => setThrottle(Number(e.target.value))}
          style={{ width: "100%", marginTop: "6px" }}
        />

        <div>Throttle: {throttle}%</div>
      </div>
    </div>
  );
};

export default ModulePanel;
