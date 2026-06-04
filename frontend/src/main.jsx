import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <div data-theme="flickhive" className="min-h-screen font-sans">
        <App />
      </div>
    </HelmetProvider>
  </StrictMode>,
);
