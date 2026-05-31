import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import "../excalidraw-app/sentry";

import ExcalidrawApp from "./App";
import { applyUsernameFromUrlHash } from "./telos/hashUsername";

// Force Excalidraw to use the username from the URL query parameter (?username=Hasan)
const urlParams = new URLSearchParams(window.location.search);
const usernameFromUrl = urlParams.get("username");
if (usernameFromUrl) {
  // Excalidraw looks for this specific key in localStorage
  localStorage.setItem("excalidraw-user-name", usernameFromUrl);
  // Also store the username in the excalidraw-collab JSON object used by excalidraw-app
  localStorage.setItem("excalidraw-collab", JSON.stringify({ username: usernameFromUrl }));
  // Keep username in a global variable to be accessible by App.tsx even after URL cleanup
  (window as any).usernameFromUrl = usernameFromUrl;

  // Clean up URL parameter to keep the URL tidy while preserving the room hash intact
  const url = new URL(window.location.href);
  url.searchParams.delete("username");
  window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
}

// Telos: set collaborator display name from `#room=...&username=...` before Collab init.
applyUsernameFromUrlHash();

window.__EXCALIDRAW_SHA__ = import.meta.env.VITE_APP_GIT_SHA;
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
registerSW();
root.render(
  <StrictMode>
    <ExcalidrawApp />
  </StrictMode>,
);
