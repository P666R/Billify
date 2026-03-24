import Box from '@mui/material/Box';
import { FcGoogle } from 'react-icons/fc';
import { fluidType } from '../customTheme';

export const GoogleLogin = () => {
  const google = () => {
    // change this in production
    window.open('http://localhost:8080/api/v1/auth/google', '_self');
  };
  return (
    <Box sx={{ cursor: 'pointer' }} onClick={google}>
      <FcGoogle className="google-icon" size={fluidType(25, 35)} />
    </Box>
  );
};
