import { Box, Typography } from '@mui/material';

export const UserListPage = () => {
  return (
    <Box sx={{ display: 'flex', marginLeft: '250px', mt: 10 }}>
      <Typography variant="h3" gutterBottom>
        This admin page is only allowed to users with the Admin role
      </Typography>
    </Box>
  );
};
