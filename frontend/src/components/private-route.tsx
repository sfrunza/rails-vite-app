import { useAppSelector } from '@/store';
import { Navigate, useLocation } from 'react-router';

export function PrivateRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  if (user && allowedRoles.includes(user.role)) {
    return children;
  } else {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
}
