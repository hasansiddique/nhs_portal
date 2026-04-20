import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: ReactElement }) {
  const isSignedIn = !isEmpty(Cookies.get('token'));
  if (!isSignedIn) return <Navigate to="/auth/protected-signin" replace />;
  return children;
}

