import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { PublicLayout } from './layouts/PublicLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import { Home } from './pages/Home';
import { TournamentDetailsPage } from './pages/TournamentDetails';
import { AdminLoginPage } from './pages/admin/AdminLogin';
import { AdminDashboardPage } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Dedicated Admin Portal Routes (Isolated Layout & Supabase Auth) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />

              {/* Public Platform Routes (Award-Winning Horizontal GSAP Experience) */}
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
                    <Home />
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
                path="/leaderboard"
                element={
                  <PublicLayout>
                    <Home />
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
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
