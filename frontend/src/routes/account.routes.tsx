import { GlobalFallback } from '@/components/global-fallback';
import AccountLayout from '@/layouts/account/layout';
import { PrivateRoute } from '@/components/private-route';
import { Navigate } from 'react-router';
import { verifyAuthLoader } from '@/loaders';

export const accountRoutes = {
  path: 'account',
  loader: verifyAuthLoader,
  element: (
    <PrivateRoute allowedRoles={['admin', 'manager']}>
      <AccountLayout />
    </PrivateRoute>
  ),
  hydrateFallbackElement: <GlobalFallback />,
  children: [
    {
      index: true,
      lazy: () => import('@/pages/account/page'),
    },
    {
      path: 'requests',
      children: [
        {
          index: true,
          element: <Navigate to="/account" replace />,
        },
        {
          path: ':id',
          element: <div>Request Details</div>,
        },
      ],
    },
  ],
};
