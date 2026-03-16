import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface GuardProps {
  children: ReactElement;
  fallback?: ReactElement;
}

type HoCReturnType = () => ReactElement;

const ProtectedRoute = ({ children }: GuardProps) => {
  const isSignedIn = !isEmpty(Cookies.get('token'));

  if (!isSignedIn) return <Navigate to="/auth/protected-signin" />;

  return children;
};

export const withProtectedRoute = (
  RouteComponent: () => ReactElement | null
): HoCReturnType => {
  return () => (
    <ProtectedRoute>
      <RouteComponent />
    </ProtectedRoute>
  );
};
