import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import { Home } from './pages/Home';
import { TournamentsPage } from './pages/Tournaments';
import { TournamentDetailsPage } from './pages/TournamentDetails';
import { LiveHubPage } from './pages/LiveHub';
import { PlayerProfilePage } from './pages/PlayerProfile';
import { LeaderboardPage } from './pages/Leaderboard';
import { AdminLoginPage } from './pages/admin/AdminLogin';
import { AdminDashboardPage } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Dedicated Admin Portal Routes (Isolated Layout & Supabase Auth) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />

            {/* Public Platform Routes (Wrapped in Public Layout with Clean Navbar & Footer) */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />
            <Route
              path="/tournaments"
              element={
                <PublicLayout>
                  <TournamentsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/tournaments/:slug"
              element={
                <PublicLayout>
                  <TournamentDetailsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/live"
              element={
                <PublicLayout>
                  <LiveHubPage />
                </PublicLayout>
              }
            />
            <Route
              path="/players/:username"
              element={
                <PublicLayout>
                  <PlayerProfilePage />
                </PublicLayout>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PublicLayout>
                  <LeaderboardPage />
                </PublicLayout>
              }
            />
            <Route
              path="*"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
