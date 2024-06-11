// Import React Framework
import React from "react";
import ReactDOM from "react-dom/client";

// Import UI5 WebComponent React
import "@ui5/webcomponents-react/dist/Assets";
import { ThemeProvider } from "@ui5/webcomponents-react";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme";

// Import CSS
import "./index.css";

// Import Component
import App from "./App";

setTheme("sap_horizon");
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
