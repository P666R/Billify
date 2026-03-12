import { Box, Link, Typography } from '@mui/material';
import { FaRegCopyright } from 'react-icons/fa';

const Copyright = () => {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={{
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
      }}
    >
      <FaRegCopyright />
      <Box component="span">Billify {new Date().getFullYear()}</Box>
    </Typography>
  );
};

export const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#000000', py: '0.8rem' }}>
      <Typography
        variant="body2"
        align="center"
        sx={{ color: '#07f011', mb: '0.2rem' }}
      >
        <Link href="https://www.billify.com" color="inherit" underline="hover">
          INVOICING SIMPLIFIED FOR EVERYONE
        </Link>
      </Typography>
      <Copyright />
    </Box>
  );
};
