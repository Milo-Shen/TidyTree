// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { createRoot } from "react-dom/client";

// Import UI5 WebComponent React
import "@ui5/webcomponents-react/dist/Assets";
import { ThemeProvider } from "@ui5/webcomponents-react";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme";

// Import Component
import App from "./App";
import "./index.css";

setTheme("sap_horizon");
const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}
