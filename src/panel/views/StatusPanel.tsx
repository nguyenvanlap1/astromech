import React, { useState, useEffect } from "react";
import { SpaceObjectManager } from "../../managers/SpaceObjectManager";

const ModulePanel: React.FC = () => {
  const manager = SpaceObjectManager.getInstance();
  const [selectedSpaceObject, setSelectedSpaceObject] = useState(
    manager.selectedSpaceObject
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedSpaceObject(manager.selectedSpaceObject);
    }, 100); // Update 10 lần/giây

    return () => clearInterval(interval);
  }, [manager]);

  const getSpeed = () => {
    if (!selectedSpaceObject) return 0;
    const vel = selectedSpaceObject.body.getLinearVelocity();
    return Math.sqrt(vel.x * vel.x + vel.y * vel.y);
  };

  const getMass = () => {
    if (!selectedSpaceObject) return 0;
    return selectedSpaceObject.body.getMass();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 300,
        padding: "10px",
        background: "rgba(0,0,0,0.5)",
        color: "#fff",
      }}
    >
      <h3 style={{ margin: 0 }}>Module Panel</h3>

      {selectedSpaceObject ? (
        <div style={{ marginTop: "6px" }}>
          <div>
            <b>Type:</b> {selectedSpaceObject.type}
          </div>
          <div>
            <b>Mass:</b> {getMass().toFixed(2)} kg
          </div>
          <div>
            <b>Speed:</b> {getSpeed().toFixed(2)} m/s
          </div>
        </div>
      ) : (
        <div>No selection</div>
      )}
    </div>
  );
};

export default ModulePanel;
