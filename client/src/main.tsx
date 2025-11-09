import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// UNREGISTER SERVICE WORKERS THAT MIGHT INTERCEPT PUT REQUESTS
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
  caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  console.log('[SW] Service workers unregistered & caches cleared');
}

createRoot(document.getElementById("root")!).render(<App />);
