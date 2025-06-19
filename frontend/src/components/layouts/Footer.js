import React from 'react';
import { Box, Typography, Link, Divider } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
      }}
    >
      <Divider sx={{ mb: 2 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', sm: 'flex-start' },
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {currentYear}
          {' '}
          <Link color="inherit" href="#">
            AI Content Idea Platform
          </Link>
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: { xs: 1, sm: 0 } }}>
          <Link href="#" color="text.secondary" underline="hover">
            <Typography variant="body2">Privacy</Typography>
          </Link>
          <Link href="#" color="text.secondary" underline="hover">
            <Typography variant="body2">Terms</Typography>
          </Link>
          <Link href="#" color="text.secondary" underline="hover">
            <Typography variant="body2">Help</Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;