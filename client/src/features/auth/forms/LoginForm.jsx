import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaSignInAlt, FaCheck } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router';

import { fluidType } from '../../../customTheme';
import { useTitle } from '../../../hooks/useTitle';
import { RHFOutlinedInput } from './RHFOutlinedInput';
import { useLoginUserMutation } from '../authApiSlice';
import { loginUserSchema } from '../../../utils/user-schema';

export const LoginForm = () => {
  useTitle('Billify - Login');

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isSuccess }] = useLoginUserMutation();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(loginUserSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      await loginUser(values).unwrap();
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch {
      /* empty */
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Logging in...';
    if (isSuccess) return 'Logged in';
    return 'Login';
  };

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={fluidType(0.2, 0.8)}>
        {/* Email */}
        <Grid size={{ xs: 12 }}>
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

        {/* Password */}
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
        </Grid>

        {/* Forgot Password */}
        <Grid size={{ xs: 12 }} sx={{ my: '.2rem' }}>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ fontSize: fluidType(9, 11) }}
          >
            Forgot Password?&nbsp;
            <Link
              variant="body2"
              sx={{ fontSize: fluidType(9, 11), textDecoration: 'none' }}
              component={RouterLink}
              to="/reset_password_request"
            >
              Click Here to Reset it
            </Link>
          </Typography>
        </Grid>

        {/* Submit */}
        <Grid size={{ xs: 12 }} textAlign="center">
          <Button
            fullWidth
            loading={isSubmitting}
            startIcon={isSuccess ? <FaCheck /> : <FaSignInAlt />}
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
