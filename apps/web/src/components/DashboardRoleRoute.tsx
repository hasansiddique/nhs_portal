import { Navigate } from 'react-router-dom';

export function parseDashboardUser(): {
  role?: string;
  patientId?: string;
  practitionerId?: string;
  homeLocationId?: string;
} {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export function DashboardRoleRoute({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const { role } = parseDashboardUser();
  if (!role || !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
