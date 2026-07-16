import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import ExplorePage from "./pages/ExplorePage";
import MatchDetailPage from "./pages/MatchDetailPage/MatchDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/explore"
          element={<ExplorePage />}
        />
        <Route
    path="/matches/:id"
    element={<MatchDetailPage />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;