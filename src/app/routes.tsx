import { createHashRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { CounterpartiesPage } from './pages/CounterpartiesPage';
import { CounterpartyDetailPage } from './pages/CounterpartyDetailPage';
import { AdminPage } from './pages/AdminPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/401',
    element: <UnauthorizedPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <CounterpartiesPage />,
      },
      {
        path: 'counterparties',
        element: <CounterpartiesPage />,
      },
      {
        path: 'counterparties/:id',
        element: (
          <ProtectedRoute>
            <CounterpartyDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users/:id',
        element: (
          <ProtectedRoute>
            <UserDetailPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);