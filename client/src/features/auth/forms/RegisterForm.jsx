import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { fluidType } from '../../../customTheme';
import { useTitle } from '../../../hooks/useTitle';
import { RHFOutlinedInput } from './RHFOutlinedInput';
import { useRegisterUserMutation } from '../authApiSlice';
import { registerUserSchema } from '../../../utils/user-schema';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

export const RegisterForm = () => {
  useTitle('Billify - Register');

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser, { isSuccess }] = useRegisterUserMutation();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

  // React Hook Form
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(registerUserSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
    },
  });

  // real-time for strength indicator
  const passwordValue = useWatch({
    control,
    name: 'password',
  });

  const onSubmit = async (values) => {
    try {
      await registerUser(values).unwrap();
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch {
      /* empty */
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Creating Account...';
    if (isSuccess) return 'Account Created';
    return 'Create Account';
  };

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={fluidType(0.2, 0.8)}>
        {/* First Name */}
        <Grid size={{ xs: 12, md: 6 }}>
          <RHFOutlinedInput
            name="firstName"
            control={control}
            label="First Name*"
            type="text"
            placeholder="John"
            fullWidth
          />
        </Grid>

        {/* Last Name */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ pl: { xs: 0, md: '0.5rem' } }}>
          <RHFOutlinedInput
            name="lastName"
            control={control}
            label="Last Name*"
            type="text"
            placeholder="Doe"
            fullWidth
          />
        </Grid>

        {/* Username */}
        <Grid size={{ xs: 12, md: 6 }}>
          <RHFOutlinedInput
            name="username"
            control={control}
            label="Username*"
            type="text"
            placeholder="john-doe, john88"
            autoComplete="username"
            fullWidth
          />
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ pl: { xs: 0, md: '0.5rem' } }}>
          <RHFOutlinedInput
            name="email"
            control={control}
            label="Email Address*"
            type="email"
            placeholder="email@example.com"
            autoComplete="email"
            fullWidth
          />
        </Grid>

        {/* Password + Strength */}
        <Grid size={{ xs: 12 }}>
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
        </Grid>

        {/* Confirm Password */}
        <Grid size={{ xs: 12 }}>
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
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </Grid>

        {/* Terms */}
        <Grid size={{ xs: 12 }} sx={{ my: '.3rem' }}>
          <Typography variant="body2" sx={{ fontSize: fluidType(9, 11) }}>
            By Signing up, you agree to our&nbsp;
            <Link
              variant="body2"
              sx={{ fontSize: fluidType(9, 11) }}
              component={RouterLink}
              to="#"
            >
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link
              variant="body2"
              sx={{ fontSize: fluidType(9, 11) }}
              component={RouterLink}
              to="#"
            >
              Privacy Policy
            </Link>
          </Typography>
        </Grid>

        {/* Submit */}
        <Grid
          size={{ xs: 12 }}
          textAlign="center"
          sx={{ fontSize: fluidType(10, 15) }}
        >
          <Button
            fullWidth
            loading={isSubmitting}
            startIcon={isSuccess ? <FaUserCheck /> : <FaUserPlus />}
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
        </Grid>
      </Grid>
    </form>
  );
};
