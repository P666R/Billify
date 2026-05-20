import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuthUser } from '../hooks/useAuthUser';

export const AuthRequired = ({
  allowedRoles, //NOSONAR
}) => {
  const location = useLocation();
  const { roles } = useAuthUser();

  const hasRequiredRole = roles.some((role) => allowedRoles.includes(role)); //NOSONAR

  return hasRequiredRole ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
