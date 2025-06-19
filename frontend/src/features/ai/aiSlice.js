import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from '../alert/alertSlice';

// Generate content ideas using AI
export const generateIdeas = createAsyncThunk(
  'ai/generateIdeas',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post('/api/ai/generate-ideas', params);
      dispatch(setAlert({ message: 'Ideas generated successfully', type: 'success' }));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to generate ideas';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Generate content calendar using AI
export const generateCalendar = createAsyncThunk(
  'ai/generateCalendar',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post('/api/ai/generate-calendar', params);
      dispatch(setAlert({ message: 'Content calendar generated successfully', type: 'success' }));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to generate content calendar';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

// Analyze content trends using AI
export const analyzeTrends = createAsyncThunk(
  'ai/analyzeTrends',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post('/api/ai/analyze-trends', params);
      dispatch(setAlert({ message: 'Trend analysis completed', type: 'success' }));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to analyze trends';
      dispatch(setAlert({ message, type: 'error' }));
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  generatedIdeas: [],
  contentCalendar: [],
  trendAnalysis: null,
  loading: false,
  error: null
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearGeneratedIdeas: (state) => {
      state.generatedIdeas = [];
    },
    clearContentCalendar: (state) => {
      state.contentCalendar = [];
    },
    clearTrendAnalysis: (state) => {
      state.trendAnalysis = null;
    },
    clearAiState: (state) => {
      state.generatedIdeas = [];
      state.contentCalendar = [];
      state.trendAnalysis = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // generateIdeas
      .addCase(generateIdeas.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateIdeas.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedIdeas = action.payload.ideas;
        state.error = null;
      })
      .addCase(generateIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // generateCalendar
      .addCase(generateCalendar.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.contentCalendar = action.payload.calendar;
        state.error = null;
      })
      .addCase(generateCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // analyzeTrends
      .addCase(analyzeTrends.pending, (state) => {
        state.loading = true;
      })
      .addCase(analyzeTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trendAnalysis = action.payload.trends;
        state.error = null;
      })
      .addCase(analyzeTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearGeneratedIdeas,
  clearContentCalendar,
  clearTrendAnalysis,
  clearAiState
} = aiSlice.actions;

export default aiSlice.reducer;