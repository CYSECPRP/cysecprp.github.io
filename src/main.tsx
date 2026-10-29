import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./styles/global.css";
import { applyMode } from "./lib/flags";
import App from "./App";

if ("scrollRestoration" in window.history)
  window.history.scrollRestoration = "manual";
applyMode();

console.info(
  "%cPRP-OS%c curious? open the terminal (bottom right) and try ls -a",
  "background:#3dff8f;color:#050505;padding:2px 6px;font-weight:700",
  "color:#3dff8f",
);

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
