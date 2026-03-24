import { baseApiSlice } from '../api/baseApiSlice';
import { logIn, logOut } from './authSlice';

// baseUrl = '/api/v1'

export const authApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (build) => ({
    registerUser: build.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    loginUser: build.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(logIn(data));
        } catch (err) {
          console.log(err);
        }
      },
    }),
    logoutUser: build.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
        } finally {
          dispatch(logOut());
          dispatch(baseApiSlice.util.resetApiState());
        }
      },
    }),
    resendVerifyEmail: build.mutation({
      query: (body) => ({
        url: '/auth/resend_email_token',
        method: 'POST',
        body,
      }),
    }),
    passwordResetRequest: build.mutation({
      query: (body) => ({
        url: '/auth/reset_password_request',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: build.mutation({
      query: (body) => ({
        url: '/auth/reset_password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useResendVerifyEmailMutation,
  usePasswordResetRequestMutation,
  useResetPasswordMutation,
} = authApiSlice;
