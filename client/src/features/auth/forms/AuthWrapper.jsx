import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

export const AuthWrapper = (
  { children } // NOSONAR
) => {
  const { user } = useSelector((state) => state.auth);

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
        marginTop: user ? 'calc(8dvh + 1rem)' : '1rem',
      }}
    >
      {children}
    </Box>
  );
};
