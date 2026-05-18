import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  InputAdornment,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import { GrPowerReset } from 'react-icons/gr';
import SendIcon from '@mui/icons-material/Send';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate, useSearchParams } from 'react-router';

import { fluidType } from '../../../customTheme';
import { useTitle } from '../../../hooks/useTitle';
import { AuthWrapper } from '../forms/AuthWrapper';
import { useResetPasswordMutation } from '../authApiSlice';
import { RHFOutlinedInput } from '../forms/RHFOutlinedInput';
import { resetPasswordUserSchema } from '../../../utils/user-schema';
import { PasswordStrengthIndicator } from '../forms/PasswordStrengthIndicator';

const MotionDiv = motion.div;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export const PasswordResetPage = () => {
  useTitle('Billify - Reset Password');
  const navigate = useNavigate();
  const theme = useTheme();

  const [searchParams] = useSearchParams();
  const emailToken = searchParams.get('emailToken');
  const userId = searchParams.get('userId');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isSuccess }] = useResetPasswordMutation();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordUserSchema),
    mode: 'onChange',
    defaultValues: { password: '', passwordConfirm: '' },
  });

  const passwordValue = useWatch({ control, name: 'password' });

  const onSubmit = async (values) => {
    try {
      // Merge user password input fields with extracted token strings
      await resetPassword({
        ...values,
        userId,
        emailToken,
      }).unwrap();

      setTimeout(() => navigate('/login'), 1000);
    } catch {
      /* empty */
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Resetting Password...';
    if (isSuccess) return 'Password Reset';
    return 'Reset Password';
  };

  return (
    <AuthWrapper>
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            width: '100%',
            maxWidth: 'md',
          }}
        >
          {/* Header Section */}
          <MotionDiv variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '.2rem',
              }}
            >
              <Box
                sx={{
                  color: theme.palette.primary.main,
                  pr: '.5rem',
                  display: 'inline-flex',
                }}
              >
                <svg width="0" height="0">
                  <linearGradient
                    id="password-reset-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop stopColor={theme.palette.primary.main} offset="0%" />
                    <stop
                      stopColor={theme.palette.secondary.main}
                      offset="100%"
                    />
                  </linearGradient>
                </svg>
                <GrPowerReset
                  size={fluidType(30, 40)}
                  style={{ fill: 'url(#password-reset-gradient)' }}
                />
              </Box>
              <Typography
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
                Reset Password?
              </Typography>
            </Box>
          </MotionDiv>

          {/* Subtitle section */}
          <MotionDiv variants={itemVariants} style={{ width: '100%' }}>
            <Typography
              textAlign="center"
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: fluidType(14, 16),
                mb: { xs: '1rem', md: '1rem' },
              }}
            >
              Please enter your new password below
              <br />
              Make sure to choose a strong password to keep your account secure
            </Typography>
          </MotionDiv>

          {/* Form section */}
          <Box sx={{ width: '100%' }}>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container spacing={fluidType(2, 4)}>
                {/* Password Input Column */}
                <Grid size={{ xs: 12 }} style={{ marginBottom: '.8rem' }}>
                  <MotionDiv variants={itemVariants}>
                    <RHFOutlinedInput
                      name="password"
                      control={control}
                      label="Password*"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="******"
                      fullWidth
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handlePasswordVisibility}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="medium"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <PasswordStrengthIndicator password={passwordValue} />
                  </MotionDiv>
                </Grid>

                {/* Password Confirm Input Column */}
                <Grid size={{ xs: 12 }} style={{ marginBottom: '.8rem' }}>
                  <MotionDiv variants={itemVariants}>
                    <RHFOutlinedInput
                      name="passwordConfirm"
                      control={control}
                      label="Confirm Password*"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="******"
                      fullWidth
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle passwordConfirm visibility"
                            onClick={handleConfirmPasswordVisibility}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="medium"
                          >
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </MotionDiv>
                </Grid>

                {/* Action Buttons Column */}
                <Grid size={{ xs: 12 }} style={{ marginBottom: '.4rem' }}>
                  <MotionDiv variants={itemVariants}>
                    <Stack
                      direction={{ sm: 'column', lg: 'row' }}
                      justifyContent="center"
                      alignItems="center"
                      gap={1.5}
                    >
                      {/* Submit Button */}
                      <Button
                        fullWidth
                        loading={isSubmitting}
                        startIcon={<SendIcon />}
                        loadingPosition="end"
                        size="large"
                        type="submit"
                        variant="contained"
                        color={isSuccess ? 'success' : 'primary'}
                        sx={{
                          borderRadius: '1rem',
                          textTransform: 'none',
                          fontSize: fluidType(12, 16),
                        }}
                      >
                        {getButtonText()}
                      </Button>

                      {/* Home Button */}
                      <Button
                        variant="contained"
                        component={Link}
                        to="/"
                        viewTransition
                        fullWidth
                        size="large"
                        startIcon={<FaHome />}
                        color="secondary"
                        sx={{
                          borderRadius: '1rem',
                          textTransform: 'none',
                          fontSize: fluidType(12, 16),
                        }}
                      >
                        Home
                      </Button>
                    </Stack>
                  </MotionDiv>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </MotionDiv>
    </AuthWrapper>
  );
};
