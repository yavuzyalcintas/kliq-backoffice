import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomersList } from '@/components/customers/CustomersList';
import { CustomerDetail } from '@/components/customers/CustomerDetail';
import { LocalizationManager } from '@/components/localization/LocalizationManager';
import { DigitalPinOrdersPage } from '@/components/digital-pin-orders/DigitalPinOrdersPage';
import { DigitalPinProductsPage } from '@/components/digital-pin-products/DigitalPinProductsPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border p-4">
          <pre className="text-sm">
            {JSON.stringify({ [t('dashboard.authenticated')]: true }, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

const Settings = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.title')}</CardTitle>
      </CardHeader>
      <CardContent>{t('settings.general')}</CardContent>
    </Card>
  );
};

export const routes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers',
    element: (
      <ProtectedRoute>
        <CustomersList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers/:id',
    element: (
      <ProtectedRoute>
        <CustomerDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '/digital-pin-orders',
    element: (
      <ProtectedRoute>
        <DigitalPinOrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/digital-pin-products',
    element: (
      <ProtectedRoute>
        <DigitalPinProductsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/localization',
    element: (
      <ProtectedRoute>
        <LocalizationManager />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute requiredRoles={['admin']}>
        <Settings />
      </ProtectedRoute>
    ),
  },
];
