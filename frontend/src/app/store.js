import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ideasReducer from '../features/ideas/ideasSlice';
import aiReducer from '../features/ai/aiSlice';
import alertReducer from '../features/alert/alertSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideasReducer,
    ai: aiReducer,
    alert: alertReducer,
  },
});