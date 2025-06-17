import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomersList } from "@/components/customers/CustomersList";
import { getKeycloakInstance } from "@/keycloak";

const keycloak = getKeycloakInstance();

export const routes = [
  {
    path: "/",
    element: (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4">
            <pre className="text-sm">
              {JSON.stringify({ keycloak: keycloak.authenticated }, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    path: "/customers",
    element: <CustomersList />,
  },
  {
    path: "/users",
    element: (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>Users content goes here</CardContent>
      </Card>
    ),
  },
  {
    path: "/analytics",
    element: (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>Analytics content goes here</CardContent>
      </Card>
    ),
  },
  {
    path: "/settings",
    element: (
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>Settings content goes here</CardContent>
      </Card>
    ),
  },
];
