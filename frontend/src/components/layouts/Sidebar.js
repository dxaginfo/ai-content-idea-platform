import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useMediaQuery,
  Tooltip,
  Avatar,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  ...(active && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));

const Sidebar = ({ open, drawerWidth, toggleSidebar }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Ideas', icon: <LightbulbIcon />, path: '/ideas' },
    { text: 'Generate', icon: <AddCircleOutlineIcon />, path: '/generate' },
    { text: 'Calendar', icon: <CalendarMonthIcon />, path: '/calendar' },
    { text: 'Trends', icon: <TrendingUpIcon />, path: '/trends' },
  ];

  const bottomNavItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          backgroundColor: theme.palette.background.paper,
        },
      }}
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={toggleSidebar}
    >
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Content Ideator
          </Typography>
        </Box>
        <IconButton onClick={toggleSidebar}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>

      <Divider />

      {/* User info */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
          {user?.name?.charAt(0) || <PersonIcon />}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {user?.email || 'user@example.com'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Main navigation items */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <Tooltip key={item.text} title={item.text} placement="right" arrow>
            <StyledListItem
              button
              active={isActivePath(item.path) ? 1 : 0}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItem>
          </Tooltip>
        ))}
      </List>

      <Divider />

      {/* Bottom navigation items */}
      <List>
        {bottomNavItems.map((item) => (
          <Tooltip key={item.text} title={item.text} placement="right" arrow>
            <StyledListItem
              button
              active={isActivePath(item.path) ? 1 : 0}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;