import { Link as RouterLink } from 'react-router';
import { FaCaretRight } from 'react-icons/fa';
import { Box, Button, Typography, styled } from '@mui/material';

import { fluidType } from '../customTheme';
import buildingsImage from '../assets/images/buildings-bg.jpg';

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const CreateAccountButton = styled(Button)(({ theme }) => ({
  borderRadius: '3rem',
  border: `3px solid ${theme.palette.green.main}`,
  boxShadow: `0 5px 15px ${theme.palette.green.main}4D`, // 4D 30% opacity hex
  backgroundColor: 'transparent',
  fontSize: fluidType(8, 16),
  padding: '0.5rem 1.5rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    color: theme.palette.green.main,
    borderColor: '#ffffff',
    boxShadow: '0 5px 10px rgba(243, 243, 243, 0.3)',
    backgroundColor: 'transparent',
    transform: 'translateY(-1px)',
  },
}));

const billifyVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.88 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.1, ease: 'easeOut' },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.8, delayChildren: 0.8 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.32, 1] },
  },
};

export const HomePage = () => {
  return (
    <Box
      sx={{
        flex: '1 1 auto', // for no-scroll
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        px: { xs: 2, sm: 4 },
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.96)), url(${buildingsImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4rem',
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={billifyVariants}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: fluidType(60, 190),
              textTransform: 'uppercase',
              background: 'linear-gradient(to top, #e0e0e0, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              userSelect: 'none',
            }}
          >
            Billify
          </Typography>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '.75rem',
          }}
        >
          {['Easy', 'Simple', 'Smart'].map((word, i) => (
            <motion.div key={word} variants={wordVariants}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: fluidType(15, 60),
                  fontWeight: 500,
                  color: i === 2 ? 'green.main' : '#ffffff',
                }}
              >
                {word}
                {i < 2 && (
                  <Box
                    component="span"
                    sx={{
                      color: 'green.main',
                      mx: fluidType(10, 20),
                      fontSize: fluidType(8, 30),
                    }}
                  >
                    <FaCaretRight />
                  </Box>
                )}
              </Typography>
            </motion.div>
          ))}
        </motion.div>
        <CreateAccountButton
          variant="contained"
          color="success"
          size="medium"
          component={RouterLink}
          to="/register"
        >
          Create Account
        </CreateAccountButton>
      </Box>
    </Box>
  );
};
