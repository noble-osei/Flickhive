import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/Auth.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <AuthProvider>
          <Toaster />
          <div data-theme="flickhive" className="min-h-screen font-sans">
            <App />
          </div>
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
);
