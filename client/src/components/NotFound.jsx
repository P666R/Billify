import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { FaGhost, FaArrowLeft, FaHome } from 'react-icons/fa';
import { fluidType } from '../customTheme';

const MotionContainer = motion.create(Container);
const MotionTypography = motion.create(Typography);

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
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <MotionContainer
      maxWidth="md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        textAlign: 'center',
        minHeight: '80dvh', // Ensures centering on mobile browsers
      }}
    >
      <motion.div variants={ghostVariants} animate="animate">
        <Box sx={{ color: theme.palette.text.secondary, mb: 4 }}>
          <FaGhost size={fluidType(80, 120)} />
        </Box>
      </motion.div>

      <MotionTypography
        variants={itemVariants}
        variant="h1"
        fontWeight={900}
        sx={{
          fontSize: fluidType(80, 140),
          lineHeight: 1,
          mb: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.error.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.05em',
        }}
      >
        404
      </MotionTypography>

      <MotionTypography
        variants={itemVariants}
        variant="h4"
        fontWeight={700}
        sx={{ fontSize: fluidType(24, 32), mb: 2 }}
      >
        Oops! You've drifted off course
      </MotionTypography>

      <MotionTypography
        variants={itemVariants}
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
        The page you are looking for might have been moved, deleted, or perhaps
        never existed in this reality.
        <br />
        Let’s get you back to safety.
      </MotionTypography>

      <Stack
        component={motion.div}
        variants={itemVariants}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={fluidType(20, 30)}
        justifyContent="center"
        sx={{ width: '100%', maxWidth: '450px' }}
      >
        {/* Added whileHover/whileTap directly for a tactile feel */}
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
          fullWidth
          size="large"
          startIcon={<FaHome />}
          sx={{ borderRadius: '1rem', textTransform: 'none', py: 1.5 }}
        >
          Back to Home
        </Button>
      </Stack>
    </MotionContainer>
  );
};
