import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./styles/variables.css";
import "./styles/colors.css";
import "./styles/globals.css";
import "./styles/spacing.css";
import "./styles/typography.css";
import "./index.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2500,
      }}
    />
  </StrictMode>
);