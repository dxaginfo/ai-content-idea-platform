import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip,
  InputBase,
  Badge,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

import { logout } from '../../features/auth/authSlice';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
      '&:focus': {
        width: '40ch',
      },
    },
  },
}));

const Header = ({ open, drawerWidth, toggleSidebar }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/ideas?search=${searchValue}`);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: isMobile || !open ? '100%' : `calc(100% - ${drawerWidth}px)`,
        ml: isMobile || !open ? 0 : `${drawerWidth}px`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          edge="start"
          sx={{
            mr: 2,
            ...(open && !isMobile && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Show logo only on mobile when drawer is closed */}
        {(isMobile || !open) && (
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'block', sm: 'block' }, fontWeight: 'bold', color: theme.palette.primary.main }}
          >
            Content Ideator
          </Typography>
        )}

        {/* Search bar */}
        <Search sx={{ display: { xs: 'none', md: 'flex' } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search ideas…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleSearch}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right-side icons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Notifications">
            <IconButton color="inherit" size="large">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              size="large"
            >
              <Avatar
                sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}
                alt={user?.name || 'User'}
              >
                {user?.name?.charAt(0) || <AccountCircleIcon />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Profile dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id="primary-search-account-menu"
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <Box sx={{ p: 1.5, minWidth: 200 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user?.email || 'user@example.com'}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => {
          handleMenuClose();
          navigate('/settings');
        }}>
          <SettingsIcon fontSize="small" sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;