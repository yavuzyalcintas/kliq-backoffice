import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomersList } from "@/components/customers/CustomersList";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-4">
              <pre className="text-sm">
                {JSON.stringify({ authenticated: true }, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>Users content goes here</CardContent>
        </Card>
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute requiredRoles={["analytics_view"]}>
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>Analytics content goes here</CardContent>
        </Card>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute requiredRoles={["admin"]}>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>Settings content goes here</CardContent>
        </Card>
      </ProtectedRoute>
    ),
  },
];
