import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaCheckCircle, FaArrowRight, FaHome } from 'react-icons/fa';
import { useTitle } from '../../../hooks/useTitle';
import { fluidType } from '../../../customTheme';

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

const iconVariants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const VerifiedPage = () => {
  useTitle('Billify - Account Verified');
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
        minHeight: '80dvh',
      }}
    >
      {/* Animated Success Icon */}
      <motion.div variants={iconVariants} animate="animate">
        <Box sx={{ color: theme.palette.success.main, mb: 4 }}>
          <FaCheckCircle size={fluidType(60, 100)} />
        </Box>
      </motion.div>

      {/* Success Messaging */}
      <MotionTypography
        variants={itemVariants}
        variant="h1"
        fontWeight={900}
        sx={{
          fontSize: fluidType(50, 90),
          lineHeight: 1,
          mb: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.error.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.05em',
        }}
      >
        Verified!
      </MotionTypography>

      <MotionTypography
        variants={itemVariants}
        variant="h4"
        fontWeight={700}
        sx={{ fontSize: fluidType(24, 32), mb: 2 }}
      >
        You are all set to go
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
        Your account has been successfully verified.
        <br /> A confirmation email has been sent to your inbox.
        <br /> You can now access all features.
      </MotionTypography>

      {/* Action Buttons */}
      <Stack
        component={motion.div}
        variants={itemVariants}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={fluidType(20, 30)}
        justifyContent="center"
        sx={{ width: '100%', maxWidth: '450px' }}
      >
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          size="large"
          startIcon={<FaHome />}
          component={Link}
          to="/"
          sx={{ borderRadius: '1rem', textTransform: 'none', py: 1.5 }}
        >
          Back to Home
        </Button>

        <Button
          variant="contained"
          component={Link}
          to="/login"
          fullWidth
          size="large"
          startIcon={<FaArrowRight />}
          sx={{ borderRadius: '1rem', textTransform: 'none', py: 1.5 }}
        >
          Login Now
        </Button>
      </Stack>
    </MotionContainer>
  );
};
