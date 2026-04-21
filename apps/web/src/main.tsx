import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from '@nhs-portal/client-api';
import { RootLayout } from './RootLayout';
import { DashboardLayout } from './DashboardLayout';
import { AuthLayout } from './AuthLayout';
import { DashboardRoleRoute } from './components/DashboardRoleRoute';
import { PublicAnalyticsLayout } from './PublicAnalyticsLayout';
import { ProtectedRoute } from './ProtectedRoute';

const queryClient = new QueryClient();

const Fallback = () => <div className="flex items-center justify-center p-8">Loading...</div>;

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        {
          path: 'auth',
          element: <AuthLayout />,
          HydrateFallback: Fallback,
          children: [
            { path: 'signin', lazy: () => import('./pages/auth/signin').then((m) => ({ Component: m.default })) },
            { path: 'signup', lazy: () => import('./pages/auth/signup').then((m) => ({ Component: m.default })) },
            { path: 'set-password', lazy: () => import('./pages/auth/set-password').then((m) => ({ Component: m.default })) },
            { path: 'forgot-password', lazy: () => import('./pages/auth/forgot-password').then((m) => ({ Component: m.default })) },
            { path: 'protected-signin', lazy: () => import('./pages/auth/protected-signin').then((m) => ({ Component: m.default })) },
          ],
        },
        {
          path: '/',
          HydrateFallback: Fallback,
          element: <Outlet />,
          children: [
            { index: true, lazy: () => import('./pages/home').then((m) => ({ Component: m.default })) },
            {
              path: 'invoice-generator',
              lazy: () => import('./pages/invoice-generator').then((m) => ({ Component: m.default })),
            },
          ],
        },
        {
          path: 'appointments',
          HydrateFallback: Fallback,
          element: (
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            { index: true, lazy: () => import('./pages/appointments/list').then((m) => ({ Component: m.default })) },
            { path: 'book', lazy: () => import('./pages/appointments/book').then((m) => ({ Component: m.default })) },
          ],
        },
        {
          path: 'dashboard/data-insights',
          element: <PublicAnalyticsLayout />,
          HydrateFallback: Fallback,
          children: [
            { index: true, lazy: () => import('./pages/dashboard/data-insights').then((m) => ({ Component: m.default })) },
          ],
        },
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          ),
          HydrateFallback: Fallback,
          children: [
            { index: true, lazy: () => import('./pages/dashboard/index').then((m) => ({ Component: m.default })) },
            { path: 'appointments', lazy: () => import('./pages/dashboard/appointments').then((m) => ({ Component: m.default })) },
            { path: 'slots', lazy: () => import('./pages/dashboard/slots').then((m) => ({ Component: m.default })) },
            {
              path: 'patients',
              lazy: () =>
                import('./pages/dashboard/patients').then((m) => ({
                  Component: () => (
                    <DashboardRoleRoute roles={['ADMIN', 'PRACTITIONER']}>
                      <m.default />
                    </DashboardRoleRoute>
                  ),
                })),
            },
            {
              path: 'doctors',
              lazy: () =>
                import('./pages/dashboard/doctors').then((m) => ({
                  Component: () => (
                    <DashboardRoleRoute roles={['ADMIN']}>
                      <m.default />
                    </DashboardRoleRoute>
                  ),
                })),
            },
            {
              path: 'availability',
              lazy: () =>
                import('./pages/dashboard/availability').then((m) => ({
                  Component: () => (
                    <DashboardRoleRoute roles={['ADMIN', 'PRACTITIONER']}>
                      <m.default />
                    </DashboardRoleRoute>
                  ),
                })),
            },
            {
              path: 'admin/patients/new',
              lazy: () =>
                import('./pages/dashboard/admin-add-patient').then((m) => ({
                  Component: () => (
                    <DashboardRoleRoute roles={['ADMIN']}>
                      <m.default />
                    </DashboardRoleRoute>
                  ),
                })),
            },
            {
              path: 'admin/doctors/new',
              lazy: () =>
                import('./pages/dashboard/admin-add-doctor').then((m) => ({
                  Component: () => (
                    <DashboardRoleRoute roles={['ADMIN']}>
                      <m.default />
                    </DashboardRoleRoute>
                  ),
                })),
            },
          ],
        },
        {
          path: 'not-found',
          HydrateFallback: Fallback,
          lazy: () => import('./pages/notfound').then((m) => ({ Component: m.default })),
        },
        {
          path: '*',
          HydrateFallback: Fallback,
          lazy: () => import('./pages/notfound').then((m) => ({ Component: m.default })),
        },
      ],
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_relativeSplatPath: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={router}
          future={{ v7_startTransition: true }}
        />
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>
);
