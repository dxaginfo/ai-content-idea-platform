import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from '../alert/alertSlice';
import setAuthToken from '../../utils/setAuthToken';

// Load user from token
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { dispatch, rejectWithValue }) => {
    // Set token in headers if it exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        const res = await axios.get('/api/auth/me');
        return res.data;
      } catch (err) {
        // Remove invalid token
        localStorage.removeItem('token');
        setAuthToken(null);
        
        // Show error message if it's not just an expired token
        if (err.response && err.response.status !== 401) {
          dispatch(setAlert({ message: err.response.data.message || 'Authentication failed', type: 'error' }));
        }
        
        return rejectWithValue(err.response?.data?.message || 'Authentication failed');
      }
    } else {
      return rejectWithValue('No token');
    }
  }
);

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      
      // Set token in localStorage and headers
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      
      dispatch(setAlert({ message: 'Registration successful', type: 'success' }));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      
      // Set token in localStorage and headers
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put('/api/auth/me', formData);
      dispatch(setAlert({ message: 'Profile updated successfully', type: 'success' }));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Update user preferences
export const updatePreferences = createAsyncThunk(
  'auth/updatePreferences',
  async (preferences, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put('/api/auth/preferences', { preferences });
      dispatch(setAlert({ message: 'Preferences updated successfully', type: 'success' }));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update preferences';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      setAuthToken(null);
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // loadUser
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })
      
      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // updatePreferences
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          preferences: action.payload.data.preferences
        };
        state.error = null;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;