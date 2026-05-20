import { Box, Typography } from '@mui/material';

export const DashboardPage = () => {
  return (
    <Box sx={{ display: 'flex', marginLeft: '250px', mt: 10 }}>
      <Typography variant="h3" gutterBottom>
        Dashboard page only allowed to logged in users
      </Typography>
    </Box>
  );
};
