import {
  Box,
  Container,
  Divider,
  Link,
  Typography,
  Stack,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router';
import { FaSignInAlt } from 'react-icons/fa';

import { AuthWrapper } from '../forms/AuthWrapper';
import { LoginForm } from '../forms/LoginForm';
import { GoogleLogin } from '../../../components/GoogleLogin';
import { fluidType } from '../../../customTheme';

const MotionContainer = motion.create(Container);
const MotionTypography = motion.create(Typography);
const MotionBox = motion.create(Box);

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

export const LoginPage = () => {
  const theme = useTheme();

  return (
    <AuthWrapper>
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
        }}
      >
        {/* Header Section */}
        <MotionBox
          variants={itemVariants}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MotionBox
            variants={itemVariants}
            sx={{
              color: theme.palette.primary.main,
              pr: '.5rem',
            }}
          >
            <svg width="0" height="0">
              <linearGradient
                id="sign-in-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop stopColor={theme.palette.primary.main} offset="0%" />
                <stop stopColor={theme.palette.secondary.main} offset="100%" />
              </linearGradient>
            </svg>
            <FaSignInAlt
              size={fluidType(30, 40)}
              style={{ fill: 'url(#sign-in-gradient)' }}
            />
          </MotionBox>

          <MotionTypography
            variants={itemVariants}
            variant="h1"
            fontWeight={900}
            sx={{
              fontSize: fluidType(25, 35),
              lineHeight: 1.2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.04em',
            }}
          >
            Log In
          </MotionTypography>
        </MotionBox>

        <MotionTypography
          textAlign="center"
          variants={itemVariants}
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: fluidType(14, 16), mb: { xs: '.4rem', md: '1rem' } }}
        >
          Welcome back!
          <br />
          Log in to continue managing your invoices
        </MotionTypography>

        {/* Login Form */}
        <Box
          component={motion.div}
          variants={itemVariants}
          sx={{ width: '100%', mb: '.4rem' }}
        >
          <LoginForm />
        </Box>

        <Stack spacing={fluidType(1, 2)} sx={{ width: '100%' }}>
          {/* Don't have an account? */}
          <MotionBox variants={itemVariants}>
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize={fluidType(12, 14)}
              >
                Don't have an account?&nbsp;
              </Typography>
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: fluidType(14, 16),
                }}
              >
                Sign Up
              </Link>
            </Stack>
          </MotionBox>

          {/* Resend verification email */}
          <MotionBox variants={itemVariants}>
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize={fluidType(12, 14)}
              >
                Didn't get the verification email?&nbsp;
              </Typography>
              <Link
                component={RouterLink}
                to="/resend"
                sx={{
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: fluidType(14, 16),
                }}
              >
                Resend Email
              </Link>
            </Stack>
          </MotionBox>

          {/* OR CONTINUE WITH Google */}
          <MotionBox variants={itemVariants} sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Divider
                sx={{
                  flexGrow: 1,
                  height: '2px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }}
              />
              <Typography
                variant="caption"
                color="primary.main"
                fontWeight={900}
                fontSize={fluidType(10, 15)}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                OR CONTINUE WITH
              </Typography>
              <Divider
                sx={{
                  flexGrow: 1,
                  height: '2px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: '0.5rem',
                fontSize: fluidType(6, 8),
              }}
            >
              <GoogleLogin />
            </Box>
          </MotionBox>
        </Stack>
      </MotionContainer>
    </AuthWrapper>
  );
};
