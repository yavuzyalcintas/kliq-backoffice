import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomersList } from "@/components/customers/CustomersList";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border p-4">
          <pre className="text-sm">
            {JSON.stringify({ [t("dashboard.authenticated")]: true }, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

const Users = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("users.title")}</CardTitle>
      </CardHeader>
      <CardContent>{t("users.list")}</CardContent>
    </Card>
  );
};

const Analytics = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("analytics.title")}</CardTitle>
      </CardHeader>
      <CardContent>{t("analytics.overview")}</CardContent>
    </Card>
  );
};

const Settings = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.title")}</CardTitle>
      </CardHeader>
      <CardContent>{t("settings.general")}</CardContent>
    </Card>
  );
};

export const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers",
    element: (
      <ProtectedRoute requiredRoles={["customer_view"]}>
        <CustomersList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute
        requiredRoles={["admin", "user_management"]}
        requireAllRoles={false}
      >
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute requiredRoles={["analytics_view"]}>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute requiredRoles={["admin"]}>
        <Settings />
      </ProtectedRoute>
    ),
  },
];
