import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { ThemeProvider } from './components/ThemeProvider';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Portal from './pages/Portal';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route
              path="/portal/*"
              element={
                <ProtectedRoute>
                  <Portal />
                </ProtectedRoute>
              }
            />

            {/* Redirect root to portal if authenticated, otherwise to login */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/portal" replace />
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to portal if authenticated, otherwise to login */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Navigate to="/portal" replace />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;