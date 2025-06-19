import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ideaReducer from './slices/ideaSlice';
import trendReducer from './slices/trendSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideaReducer,
    trends: trendReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;