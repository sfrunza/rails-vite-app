import { GlobalFallback } from '@/components/global-fallback';
import { PrivateRoute } from '@/components/private-route';
import CrmLayout from '@/layouts/crm/layout';
import { verifyAuthLoader } from '@/loaders';
import RequestPage from '@/pages/crm/request/page';
import SettingsLayout from '@/pages/crm/settings/layout';
import { Navigate } from 'react-router';

export const crmRoutes = [
  {
    path: 'crm',
    loader: verifyAuthLoader,
    element: (
      <PrivateRoute allowedRoles={['admin', 'manager']}>
        <CrmLayout />
      </PrivateRoute>
    ),
    hydrateFallbackElement: <GlobalFallback />,
    children: [
      {
        index: true,
        element: <Navigate to="/crm/requests" replace />,
      },
      {
        path: 'requests',
        lazy: () => import('@/pages/crm/requests/page'),
      },
      // {
      //   path: 'requests/:id',
      //   lazy: () => import('@/pages/crm/request/page'),
      // },
      {
        path: 'dispatch',
        element: <div>Dispatch</div>,
      },
      {
        path: 'messages',
        element: <div>Messages</div>,
        children: [
          {
            path: ':id',
            element: <div>Message</div>,
          },
        ],
      },
      {
        path: 'settings',
        element: <SettingsLayout />,
        children: [
          {
            path: 'services',
            lazy: () => import('@/pages/crm/settings/services/page'),
          },
          {
            path: 'extra-services',
            lazy: () => import('@/pages/crm/settings/extra-services/page'),
          },
          {
            path: 'packing',
            lazy: () => import('@/pages/crm/settings/packing/page'),
          },
          {
            path: 'trucks',
            lazy: () => import('@/pages/crm/settings/trucks/page'),
          },
          {
            path: 'rates',
            lazy: () => import('@/pages/crm/settings/rates/page'),
          },
          {
            path: 'calendar-rates',
            lazy: () => import('@/pages/crm/settings/calendar-rates/page'),
          },
          {
            path: 'department',
            lazy: () => import('@/pages/crm/settings/department/page'),
          },
          {
            path: 'company',
            lazy: () => import('@/pages/crm/settings/company/page'),
          },
          {
            path: 'calculator',
            lazy: () => import('@/pages/crm/settings/calculator/page'),
          },
        ],
      },
      {
        path: 'messages',
        element: <div>Messages</div>,
      },
    ],
  },
  {
    path: '/crm/requests/:id',
    loader: verifyAuthLoader,
    element: (
      <PrivateRoute allowedRoles={['admin', 'manager']}>
        <RequestPage />
      </PrivateRoute>
    ),
    hydrateFallbackElement: <GlobalFallback />,
    // lazy: () => import('@/pages/crm/request/page'),
  },
];
