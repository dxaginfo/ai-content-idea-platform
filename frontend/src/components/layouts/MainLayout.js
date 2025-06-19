import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';

import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import AlertManager from '../common/AlertManager';

const DRAWER_WIDTH = 260;

const Main = styled('main')(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${DRAWER_WIDTH}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    padding: theme.spacing(2),
    ...(open && {
      marginLeft: 0,
    }),
  },
}));

const ContentWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
}));

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header 
        open={isSidebarOpen} 
        drawerWidth={DRAWER_WIDTH} 
        toggleSidebar={toggleSidebar} 
      />
      
      {/* Sidebar */}
      <Sidebar 
        open={isSidebarOpen} 
        drawerWidth={DRAWER_WIDTH} 
        toggleSidebar={toggleSidebar} 
      />
      
      {/* Main content */}
      <Main open={isSidebarOpen}>
        <ContentWrapper>
          {/* Alert messages */}
          <AlertManager />
          
          {/* Page content */}
          <Box sx={{ flexGrow: 1, pt: 8, pb: 2 }}>
            <Outlet />
          </Box>
          
          {/* Footer */}
          <Footer />
        </ContentWrapper>
      </Main>
    </Box>
  );
};

export default MainLayout;