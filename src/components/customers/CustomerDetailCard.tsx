import { User, Hash, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Customer } from './types';

interface CustomerDetailCardProps {
  customer: Customer;
}

export function CustomerDetailCard({ customer }: CustomerDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <p className="text-lg font-medium">{customer.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Account Number
              </label>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <p className="text-lg font-mono">{customer.accountNumber}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${customer.email}`}
                  className="text-lg text-blue-600 hover:underline"
                >
                  {customer.email}
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${customer.phone}`}
                  className="text-lg text-blue-600 hover:underline"
                >
                  {customer.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
