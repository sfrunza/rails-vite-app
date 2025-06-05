import { Navigate } from 'react-router';

// import { GlobalFallback } from '@/components/global-fallback';
import AuthLayout from '@/pages/auth/layout';
// import { settingsLoader } from '@/loaders';
import { GlobalFallback } from '@/components/global-fallback';
import { settingsLoader } from '@/loaders';

export const authRoutes = [
  {
    path: 'auth',
    element: <AuthLayout />,
    loader: settingsLoader,
    hydrateFallbackElement: <GlobalFallback />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />,
      },
      {
        path: 'login',
        lazy: () => import('@/pages/auth/login/page'),
      },
      {
        path: 'forgot-password',
        lazy: () => import('@/pages/auth/forgot-password/page'),
      },
      {
        path: 'reset-password',
        lazy: () => import('@/pages/auth/reset-password/page'),
      },
    ],
  },
];
