import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@/styles/pico.min.css"
import "@/styles/pico.colors.min.css"
import "@/styles/pico.override.css"
import "index.css"
import App from "App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
