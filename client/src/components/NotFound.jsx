import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { FaGhost, FaArrowLeft, FaHome } from 'react-icons/fa';

import { fluidType } from '../customTheme';

const MotionDiv = motion.div;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

const ghostVariants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const NotFound = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        textAlign: 'center',
        marginTop: user ? 'calc(8dvh + 1.5rem)' : '1.5rem',
      }}
    >
      {/* Isolated outer animation boundary container */}
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <MotionDiv variants={ghostVariants} animate="animate">
          <Box sx={{ color: theme.palette.text.secondary }}>
            <FaGhost size={fluidType(80, 100)} />
          </Box>
        </MotionDiv>

        <MotionDiv variants={itemVariants}>
          <Typography
            variant="h1"
            fontWeight={900}
            sx={{
              fontSize: fluidType(60, 120),
              lineHeight: 1,
              my: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.error.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.05em',
            }}
          >
            404
          </Typography>
        </MotionDiv>

        <MotionDiv variants={itemVariants}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ fontSize: fluidType(24, 32), mb: 2 }}
          >
            Oops! You've drifted off course
          </Typography>
        </MotionDiv>

        <MotionDiv variants={itemVariants}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: '500px',
              mb: 5,
              mx: 'auto',
              fontSize: fluidType(16, 18),
              lineHeight: 1.6,
            }}
          >
            The page you are looking for might have been moved, deleted, or
            perhaps never existed in this reality.
            <br />
            Let’s get you back to safety.
          </Typography>
        </MotionDiv>

        <MotionDiv
          variants={itemVariants}
          style={{ width: '100%', maxWidth: '450px' }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={fluidType(20, 30)}
            justifyContent="center"
            sx={{ width: '100%' }}
          >
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              startIcon={<FaArrowLeft />}
              onClick={() => navigate(-1)}
              sx={{ borderRadius: '1rem', textTransform: 'none', py: 1.5 }}
            >
              Go Back
            </Button>

            <Button
              variant="contained"
              component={Link}
              to="/"
              viewTransition
              fullWidth
              size="large"
              startIcon={<FaHome />}
              sx={{ borderRadius: '1rem', textTransform: 'none', py: 1.5 }}
            >
              Back to Home
            </Button>
          </Stack>
        </MotionDiv>
      </MotionDiv>
    </Container>
  );
};
