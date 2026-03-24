import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

export const baseApiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Customer', 'Document'],
  endpoints: () => ({}),
});
