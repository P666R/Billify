import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logIn, logOut } from '../auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  credentials: 'include', // include cookies
  prepareHeaders: (headers, { getState }) => {
    const authToken = getState().auth.user?.accessToken;
    if (authToken) {
      headers.set('authorization', `Bearer ${authToken}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken = async (args, api, extraOptions) => {
  let reponse = await baseQuery(args, api, extraOptions);

  if (reponse?.error?.originalStatus === 403) {
    const refreshResult = await baseQuery(
      '/auth/new_access_token',
      api,
      extraOptions
    );

    const refreshData = refreshResult.data;

    if (refreshData) {
      api.dispatch(logIn(refreshData));
      reponse = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return reponse;
};

export const baseApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['User', 'Customer', 'Document'],
  endpoints: () => ({}),
});
