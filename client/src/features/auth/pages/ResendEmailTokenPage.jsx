import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaArrowLeft } from 'react-icons/fa';
import SendIcon from '@mui/icons-material/Send';
import { MdOutgoingMail } from 'react-icons/md';
import { Link, useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { fluidType } from '../../../customTheme';
import { useTitle } from '../../../hooks/useTitle';
import { RHFOutlinedInput } from '../forms/RHFOutlinedInput';
import { AuthWrapper } from '../forms/AuthWrapper';
import { useResendVerifyEmailMutation } from '../authApiSlice';
import { resendVerifyEmailSchema } from '../../../utils/user-schema';

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

export const ResendEmailTokenPage = () => {
  useTitle('Billify - Resend Verification Email');

  const navigate = useNavigate();
  const theme = useTheme();

  const [resendVerifyEmail, { isSuccess }] = useResendVerifyEmailMutation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(resendVerifyEmailSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const onSubmit = async (values) => {
    try {
      await resendVerifyEmail(values).unwrap();
      setTimeout(() => navigate('/'), 1000);
    } catch {
      /* empty */
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Sending...';
    if (isSuccess) return 'Email Sent';
    return 'Resend Verification Email';
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
          {/* Title Section */}
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
                    id="send-email-gradient"
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
                <MdOutgoingMail
                  size={fluidType(30, 40)}
                  style={{ fill: 'url(#send-email-gradient)' }}
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
                Resend Email
              </Typography>
            </Box>
          </MotionDiv>

          {/* Subtitle Section */}
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
              Didn't receive the verification email? Enter your email address to
              resend it
            </Typography>
          </MotionDiv>

          {/* Form Section */}
          <Box sx={{ width: '100%' }}>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Grid container spacing={fluidType(2, 4)}>
                <Grid size={{ xs: 12 }} style={{ marginBottom: '.8rem' }}>
                  <MotionDiv variants={itemVariants}>
                    <RHFOutlinedInput
                      name="email"
                      control={control}
                      label="Email Address*"
                      type="email"
                      placeholder="email@example.com"
                      autoComplete="email"
                      fullWidth
                    />
                  </MotionDiv>
                </Grid>

                <Grid size={{ xs: 12 }} style={{ marginBottom: '.4rem' }}>
                  <MotionDiv variants={itemVariants}>
                    <Stack
                      direction={{ sm: 'column', lg: 'row' }}
                      justifyContent="center"
                      alignItems="center"
                      gap={2}
                    >
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

                      <Button
                        variant="contained"
                        component={Link}
                        to={-1}
                        viewTransition
                        fullWidth
                        size="large"
                        startIcon={<FaArrowLeft />}
                        color="secondary"
                        sx={{
                          borderRadius: '1rem',
                          textTransform: 'none',
                          fontSize: fluidType(12, 16),
                        }}
                      >
                        Go Back
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
