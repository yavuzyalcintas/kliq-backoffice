import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table';
import { customerService } from '@/services/customerService';
import type { DigitalPinOrder } from '@/services/customerService';

interface CustomerDigitalPinOrdersProps {
  customerId: string;
}

export function CustomerDigitalPinOrders({
  customerId,
}: CustomerDigitalPinOrdersProps) {
  const { data: pinOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['digitalPinOrders', customerId],
    queryFn: () => customerService.getDigitalPinOrdersByCustomerId(customerId),
    enabled: !!customerId,
  });

  const pinOrderColumns: Column<DigitalPinOrder>[] = [
    {
      header: 'Order ID',
      accessorKey: 'id',
      cell: order => <span className="font-mono">{order.id}</span>,
    },
    {
      header: 'Product',
      accessorKey: 'product',
    },
    {
      header: 'Pin Code',
      accessorKey: 'pinCode',
      cell: order => <span className="font-mono">{order.pinCode}</span>,
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: order => <>${order.amount}</>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: order => (
        <Badge
          variant={
            order.status === 'delivered'
              ? 'default'
              : order.status === 'pending'
                ? 'secondary'
                : 'destructive'
          }
          className={
            order.status === 'delivered'
              ? 'bg-green-100 text-green-800'
              : order.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
          }
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: order => new Date(order.createdAt).toLocaleString(),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Digital Pin Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable<DigitalPinOrder>
          columns={pinOrderColumns}
          data={pinOrders}
          isLoading={isLoadingOrders}
          emptyMessage="No digital pin orders found."
          loadingMessage="Loading digital pin orders..."
        />
      </CardContent>
    </Card>
  );
}
