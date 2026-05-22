import { BuilderPage } from "./pages/builder"
import { ViewerPage } from "./pages/viewer"

export function App() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/"

  if (pathname.startsWith("/viewer")) {
    return <ViewerPage />
  }

  return <BuilderPage />
}

export default App
