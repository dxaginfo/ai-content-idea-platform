import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alerts: []
};

let alertId = 0;

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      const { message, type, timeout = 5000 } = action.payload;
      const id = alertId++;
      state.alerts.push({ id, message, type, timeout });
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    }
  }
});

export const { setAlert, removeAlert, clearAlerts } = alertSlice.actions;

// Thunk action to set an alert that automatically removes itself
export const setTimedAlert = ({ message, type, timeout = 5000 }) => (dispatch) => {
  const id = alertId++;
  dispatch(setAlert({ message, type, timeout, id }));

  setTimeout(() => {
    dispatch(removeAlert(id));
  }, timeout);
};

export default alertSlice.reducer;