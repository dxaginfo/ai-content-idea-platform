import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const generateIdeas = createAsyncThunk(
  'ideas/generate',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/ai/generate-ideas', params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to generate ideas'
      );
    }
  }
);

export const fetchIdeas = createAsyncThunk(
  'ideas/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/ideas', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch ideas'
      );
    }
  }
);

export const fetchIdeaById = createAsyncThunk(
  'ideas/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/ideas/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch idea'
      );
    }
  }
);

export const saveIdea = createAsyncThunk(
  'ideas/save',
  async (ideaData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/ideas', ideaData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to save idea'
      );
    }
  }
);

export const updateIdea = createAsyncThunk(
  'ideas/update',
  async ({ id, ideaData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/ideas/${id}`, ideaData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update idea'
      );
    }
  }
);

export const deleteIdea = createAsyncThunk(
  'ideas/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/ideas/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete idea'
      );
    }
  }
);

// Slice
const initialState = {
  ideas: [],
  generatedIdeas: [],
  currentIdea: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  filters: {
    status: '',
    contentType: '',
    platform: '',
    search: ''
  }
};

const ideaSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearGeneratedIdeas(state) {
      state.generatedIdeas = [];
    },
    setCurrentIdea(state, action) {
      state.currentIdea = action.payload;
    },
    clearCurrentIdea(state) {
      state.currentIdea = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate ideas
      .addCase(generateIdeas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateIdeas.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedIdeas = action.payload.ideas;
      })
      .addCase(generateIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all ideas
      .addCase(fetchIdeas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIdeas.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas = action.payload.ideas;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch idea by id
      .addCase(fetchIdeaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIdeaById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIdea = action.payload.idea;
      })
      .addCase(fetchIdeaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save idea
      .addCase(saveIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas.unshift(action.payload.idea);
      })
      .addCase(saveIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update idea
      .addCase(updateIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIdea.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ideas.findIndex(
          (idea) => idea._id === action.payload.idea._id
        );
        if (index !== -1) {
          state.ideas[index] = action.payload.idea;
        }
        if (state.currentIdea && state.currentIdea._id === action.payload.idea._id) {
          state.currentIdea = action.payload.idea;
        }
      })
      .addCase(updateIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete idea
      .addCase(deleteIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.ideas = state.ideas.filter((idea) => idea._id !== action.payload);
        if (state.currentIdea && state.currentIdea._id === action.payload) {
          state.currentIdea = null;
        }
      })
      .addCase(deleteIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearGeneratedIdeas,
  setCurrentIdea,
  clearCurrentIdea,
  clearError,
} = ideaSlice.actions;

export default ideaSlice.reducer;