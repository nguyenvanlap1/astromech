import React from "react";
import { createRoot } from "react-dom/client"; // 👈 phải import từ react-dom/client
import ModulePanel from "./views/ModulePanel";
import StatusPanel from "./views/StatusPanel";

const container = document.getElementById("ui-root");
if (container) {
  const root = createRoot(container); // 👈 React 18
  root.render(
    <>
      <StatusPanel />
      <ModulePanel />
    </>
  );
}
