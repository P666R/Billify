import { Box, Container, Typography } from '@mui/material';
import { FaExclamationCircle } from 'react-icons/fa';

export const NotFound = () => {
  return (
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
      }}
    >
      <Box sx={{ textAlign: 'center', color: 'error.main' }}>
        <FaExclamationCircle size="4rem" />
        <Typography variant="h3" sx={{ mt: 2 }}>
          404 NOT FOUND
        </Typography>
      </Box>
    </Container>
  );
};
