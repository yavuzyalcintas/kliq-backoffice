import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  User,
  Mail,
  Download,
  Eye,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { customerService } from '@/services/customerService';
import { CustomerDetailCard } from './CustomerDetailCard';
import { CustomerDigitalPinOrders } from './CustomerDigitalPinOrders';
import { CustomerMonthlyStatement } from './CustomerMonthlyStatement';

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: customer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomerById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/customers')}
            className="h-10 w-10 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Customer Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              The customer you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/customers')}
            className="h-10 w-10 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">Customer Details</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Edit Customer
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Transactions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <User className="h-4 w-4 mr-2" />
              Deactivate Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6">
        <CustomerDetailCard customer={customer} />
        <CustomerDigitalPinOrders customerId={customer.id} />
        <CustomerMonthlyStatement customerId={customer.id} />
      </div>
    </div>
  );
}
