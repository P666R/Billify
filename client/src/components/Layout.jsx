import { Box } from '@mui/material';
import { Outlet } from 'react-router';

export const Layout = () => {
  return (
    <Box
      component="main"
      sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
    >
      <Outlet />
    </Box>
  );
};
