import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomersList } from '@/components/customers/CustomersList';
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
    path: '/settings',
    element: (
      <ProtectedRoute requiredRoles={['admin']}>
        <Settings />
      </ProtectedRoute>
    ),
  },
];
