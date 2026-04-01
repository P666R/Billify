import { Box, Link, Typography } from '@mui/material';
import { FaRegCopyright } from 'react-icons/fa';
import { fluidType } from '../customTheme';

const Copyright = () => {
  return (
    <Typography
      textAlign="center"
      variant="h6"
      sx={{
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontSize: fluidType(12, 14),
        fontWeight: '500',
      }}
    >
      <FaRegCopyright />
      <Box component="span">Billify {new Date().getFullYear()}</Box>
    </Typography>
  );
};

export const Footer = () => {
  return (
    <Box
      component="footer"
      elevation={0}
      sx={{
        backgroundColor: '#000',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -4px 20px -4px rgba(0, 0, 0, 0.3)',
        py: '0.4rem',
        minHeight: '6dvh',
      }}
    >
      <Typography
        textAlign="center"
        variant="h5"
        sx={{ color: 'green.main', fontSize: fluidType(12, 14), mb: '0.1rem' }}
      >
        <Link href="https://www.billify.com" color="inherit" underline="hover">
          INVOICING SIMPLIFIED FOR EVERYONE
        </Link>
      </Typography>
      <Copyright />
    </Box>
  );
};
