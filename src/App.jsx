import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";

import HomePage from "./pages/HomePage";
import MatchDetailPage from "./pages/MatchDetailPage";
import CreateMatchPage from "./pages/CreateMatchPage";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import MyMatchesPage from "./pages/MyMatches/MyMatchesPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import EditMatchPage from "./pages/EditMatchPage/EditMatchPage";
import EditProfilePage from "./pages/EditProfilePage";
import MatchChatPage from "./pages/MatchChatPage/MatchChatPage";
import FriendsPage from "./pages/Friends/Friends";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <ExplorePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateMatchPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-matches"
            element={
              <ProtectedRoute>
                <MyMatchesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/matches/:id"
            element={
              <ProtectedRoute>
                <MatchDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches/:id/edit"
            element={<EditMatchPage />}
          />
          <Route
            path="/profile/edit"
            element={<EditProfilePage />}
          />
          <Route
            path="/matches/:matchId/chat"
            element={<MatchChatPage />}
          />
          <Route
            path="/friends"
            element={<FriendsPage />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;