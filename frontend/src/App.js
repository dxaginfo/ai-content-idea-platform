import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Layout components
import MainLayout from './components/layouts/MainLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Ideas from './pages/Ideas';
import Calendar from './pages/Calendar';
import Trends from './pages/Trends';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import IdeaGenerator from './pages/IdeaGenerator';
import IdeaDetail from './pages/IdeaDetail';

// Redux actions
import { loadUser } from './features/auth/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Load user data if we have a token
    dispatch(loadUser());
  }, [dispatch]);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="ideas" element={<Ideas />} />
        <Route path="ideas/:id" element={<IdeaDetail />} />
        <Route path="generate" element={<IdeaGenerator />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="trends" element={<Trends />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;