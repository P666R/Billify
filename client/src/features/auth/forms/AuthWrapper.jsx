import { Box } from '@mui/material';

export const AuthWrapper = (
  { children } // NOSONAR
) => {
  return (
    <Box
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        width: { xs: '80%', sm: '65%', md: '50%' },
        mx: 'auto',
        my: { xs: '1.5rem' },
        minHeight: '80dvh',
      }}
    >
      {children}
    </Box>
  );
};
