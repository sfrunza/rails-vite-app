import { ThemeProvider } from '@/components/theme-provider';
import ErrorPage from '@/pages/error/page';
import { authRoutes } from '@/routes/auth.routes';
import { store } from '@/store';
import { Provider as ReduxProvider } from 'react-redux';
import { createBrowserRouter, Link, RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { crmRoutes } from '@/routes/crm.routes';
import { accountRoutes } from '@/routes/account.routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="flex flex-col gap-10">
        Hello world!
        <Link to="/auth/login">Login</Link>
        <Link to="/account">Account</Link>
        <Link to="/crm">CRM</Link>
      </div>
    ),
    errorElement: <ErrorPage />,
  },
  ...authRoutes,
  crmRoutes,
  accountRoutes,
]);

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ReduxProvider store={store}>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </ReduxProvider>
    </ThemeProvider>
  );
}
