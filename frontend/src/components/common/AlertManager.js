import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Snackbar, Box } from '@mui/material';
import { removeAlert } from '../../features/alert/alertSlice';

const AlertManager = () => {
  const alerts = useSelector((state) => state.alert.alerts);
  const dispatch = useDispatch();

  useEffect(() => {
    // Set timers to auto-close alerts
    alerts.forEach((alert) => {
      if (alert.timeout) {
        const timer = setTimeout(() => {
          dispatch(removeAlert(alert.id));
        }, alert.timeout);

        return () => clearTimeout(timer);
      }
    });
  }, [alerts, dispatch]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        right: 20,
        zIndex: 1400,
        maxWidth: '400px',
      }}
    >
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ position: 'relative', mb: 2 }}
        >
          <Alert
            severity={alert.type}
            variant="filled"
            onClose={() => dispatch(removeAlert(alert.id))}
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default AlertManager;