import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from '../alert/alertSlice';

// Get all ideas with pagination and filters
export const getIdeas = createAsyncThunk(
  'ideas/getIdeas',
  async (queryParams = {}, { dispatch, rejectWithValue }) => {
    try {
      // Build query string from params
      const {
        page = 1,
        limit = 10,
        status,
        contentType,
        platform,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = queryParams;
      
      let queryString = `page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      if (status) queryString += `&status=${status}`;
      if (contentType) queryString += `&contentType=${contentType}`;
      if (platform) queryString += `&platform=${platform}`;
      if (search) queryString += `&search=${search}`;
      
      const res = await axios.get(`/api/ideas?${queryString}`);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch ideas';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Get a single idea by ID
export const getIdeaById = createAsyncThunk(
  'ideas/getIdeaById',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/ideas/${id}`);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Idea not found';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Create a new idea
export const createIdea = createAsyncThunk(
  'ideas/createIdea',
  async (ideaData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post('/api/ideas', ideaData);
      dispatch(setAlert({ message: 'Idea created successfully', type: 'success' }));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create idea';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Update an existing idea
export const updateIdea = createAsyncThunk(
  'ideas/updateIdea',
  async ({ id, ideaData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/ideas/${id}`, ideaData);
      dispatch(setAlert({ message: 'Idea updated successfully', type: 'success' }));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update idea';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Delete an idea
export const deleteIdea = createAsyncThunk(
  'ideas/deleteIdea',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`/api/ideas/${id}`);
      dispatch(setAlert({ message: 'Idea deleted successfully', type: 'success' }));
      return id;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete idea';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  ideas: [],
  idea: null,
  pagination: {
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  },
  loading: false,
  error: null
};

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    clearIdea: (state) => {
      state.idea = null;
    },
    clearIdeas: (state) => {
      state.ideas = [];
      state.pagination = {
        total: 0,
        pages: 0,
        page: 1,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getIdeas
      .addCase(getIdeas.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIdeas.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas = action.payload.ideas;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // getIdeaById
      .addCase(getIdeaById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIdeaById.fulfilled, (state, action) => {
        state.loading = false;
        state.idea = action.payload.idea;
        state.error = null;
      })
      .addCase(getIdeaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // createIdea
      .addCase(createIdea.pending, (state) => {
        state.loading = true;
      })
      .addCase(createIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas = [action.payload.idea, ...state.ideas];
        state.idea = action.payload.idea;
        state.error = null;
      })
      .addCase(createIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // updateIdea
      .addCase(updateIdea.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas = state.ideas.map(idea =>
          idea._id === action.payload.idea._id ? action.payload.idea : idea
        );
        state.idea = action.payload.idea;
        state.error = null;
      })
      .addCase(updateIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // deleteIdea
      .addCase(deleteIdea.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas = state.ideas.filter(idea => idea._id !== action.payload);
        if (state.idea && state.idea._id === action.payload) {
          state.idea = null;
        }
        state.error = null;
      })
      .addCase(deleteIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearIdea, clearIdeas, clearError } = ideasSlice.actions;

export default ideasSlice.reducer;