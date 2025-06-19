import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

// Layout components
import Layout from './components/layout/Layout';

// Page components
import Dashboard from './pages/Dashboard';
import GenerateIdeas from './pages/GenerateIdeas';
import SavedIdeas from './pages/SavedIdeas';
import Calendar from './pages/Calendar';
import TrendAnalytics from './pages/TrendAnalytics';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

// Slices
import { checkAuth } from './store/slices/authSlice';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="generate" element={<GenerateIdeas />} />
        <Route path="saved" element={<SavedIdeas />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="trends" element={<TrendAnalytics />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;