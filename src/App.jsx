import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";

import HomePage from "./pages/HomePage";
import MatchDetailPage from "./pages/MatchDetailPage";
import CreateMatchPage from "./pages/CreateMatchPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/matches/:id"
            element={<MatchDetailPage />}
          />

          <Route
            path="/create"
            element={<CreateMatchPage />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;