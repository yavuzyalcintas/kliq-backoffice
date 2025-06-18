import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import type { Column } from '@/components/ui/data-table';
import { customerService } from '@/services/customerService';
import type { DigitalPinOrder } from '@/services/customerService';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface DigitalPinOrderFilters {
  orderId?: string;
  customerId?: string;
  product?: string;
  status?: 'delivered' | 'pending' | 'failed' | 'all';
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
}

export function DigitalPinOrdersPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<DigitalPinOrderFilters>({});
  const [tempFilters, setTempFilters] = useState<DigitalPinOrderFilters>({});
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const { data: allOrders, isLoading } = useQuery({
    queryKey: ['allDigitalPinOrders'],
    queryFn: customerService.getAllDigitalPinOrders,
  });

  // Filter orders based on current filters
  const filteredOrders =
    allOrders?.filter((order: DigitalPinOrder) => {
      if (
        filters.orderId &&
        !order.id.toLowerCase().includes(filters.orderId.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.customerId &&
        !order.customerId.includes(filters.customerId)
      ) {
        return false;
      }
      if (
        filters.product &&
        !order.product.toLowerCase().includes(filters.product.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.status &&
        filters.status !== 'all' &&
        order.status !== filters.status
      ) {
        return false;
      }
      if (filters.amountMin && order.amount < filters.amountMin) {
        return false;
      }
      if (filters.amountMax && order.amount > filters.amountMax) {
        return false;
      }

      const orderDate = new Date(order.createdAt);
      if (filters.dateFrom && orderDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        dateTo.setHours(23, 59, 59, 999); // Include the entire day
        if (orderDate > dateTo) {
          return false;
        }
      }

      return true;
    }) || [];

  const handleApplyFilters = () => {
    setFilters({ ...tempFilters });
  };

  const handleClearFilters = () => {
    setTempFilters({});
    setFilters({});
  };

  const columns: Column<DigitalPinOrder>[] = [
    {
      header: t('digitalPinOrders.orderId'),
      accessorKey: 'id',
      cell: order => <span className="font-mono text-sm">{order.id}</span>,
      sortable: true,
      sortType: 'string',
    },
    {
      header: t('digitalPinOrders.customerId'),
      accessorKey: 'customerId',
      cell: order => (
        <span className="font-mono text-sm">{order.customerId}</span>
      ),
      sortable: true,
      sortType: 'string',
    },
    {
      header: t('digitalPinOrders.product'),
      accessorKey: 'product',
      sortable: true,
      sortType: 'string',
    },
    {
      header: t('digitalPinOrders.pinCode'),
      accessorKey: 'pinCode',
      cell: order => <span className="font-mono text-sm">{order.pinCode}</span>,
      sortable: true,
      sortType: 'string',
    },
    {
      header: t('digitalPinOrders.amount'),
      accessorKey: 'amount',
      cell: order => <span className="font-semibold">${order.amount}</span>,
      sortable: true,
      sortType: 'number',
    },
    {
      header: t('digitalPinOrders.status'),
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
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
              : order.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }
        >
          {t(`digitalPinOrders.${order.status}`)}
        </Badge>
      ),
      sortable: true,
      sortType: 'string',
    },
    {
      header: t('digitalPinOrders.dateCreated'),
      accessorKey: 'createdAt',
      cell: order => (
        <span className="text-sm">
          {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
        </span>
      ),
      sortable: true,
      sortType: 'date',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('digitalPinOrders.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('digitalPinOrders.description')}
        </p>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t('digitalPinOrders.filters')}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="h-8 w-8 p-0"
            >
              {filtersExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {filtersExpanded && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Order ID Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('digitalPinOrders.orderId')}
                </label>
                <Input
                  placeholder={t('digitalPinOrders.searchOrderId')}
                  value={tempFilters.orderId || ''}
                  onChange={e =>
                    setTempFilters(prev => ({
                      ...prev,
                      orderId: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Customer ID Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('digitalPinOrders.customerId')}
                </label>
                <Input
                  placeholder={t('digitalPinOrders.searchCustomerId')}
                  value={tempFilters.customerId || ''}
                  onChange={e =>
                    setTempFilters(prev => ({
                      ...prev,
                      customerId: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Product Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('digitalPinOrders.product')}
                </label>
                <Input
                  placeholder={t('digitalPinOrders.searchProduct')}
                  value={tempFilters.product || ''}
                  onChange={e =>
                    setTempFilters(prev => ({
                      ...prev,
                      product: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('digitalPinOrders.status')}
                </label>
                <Select
                  value={tempFilters.status || 'all'}
                  onValueChange={(
                    value: 'delivered' | 'pending' | 'failed' | 'all'
                  ) => setTempFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t('digitalPinOrders.allStatuses')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('digitalPinOrders.allStatuses')}
                    </SelectItem>
                    <SelectItem value="delivered">
                      {t('digitalPinOrders.delivered')}
                    </SelectItem>
                    <SelectItem value="pending">
                      {t('digitalPinOrders.pending')}
                    </SelectItem>
                    <SelectItem value="failed">
                      {t('digitalPinOrders.failed')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date From Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('digitalPinOrders.dateFrom')}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !tempFilters.dateFrom && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempFilters.dateFrom
                        ? format(tempFilters.dateFrom, 'PPP')
                        : t('digitalPinOrders.pickDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tempFilters.dateFrom}
                      onSelect={date =>
                        setTempFilters(prev => ({ ...prev, dateFrom: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('digitalPinOrders.dateTo')}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !tempFilters.dateTo && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempFilters.dateTo
                        ? format(tempFilters.dateTo, 'PPP')
                        : t('digitalPinOrders.pickDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tempFilters.dateTo}
                      onSelect={date =>
                        setTempFilters(prev => ({ ...prev, dateTo: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Amount Min Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('digitalPinOrders.minAmount')}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={tempFilters.amountMin || ''}
                  onChange={e =>
                    setTempFilters(prev => ({
                      ...prev,
                      amountMin: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                />
              </div>

              {/* Amount Max Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t('digitalPinOrders.maxAmount')}
                </label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={tempFilters.amountMax || ''}
                  onChange={e =>
                    setTempFilters(prev => ({
                      ...prev,
                      amountMax: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleApplyFilters}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {t('digitalPinOrders.applyFilters')}
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                {t('digitalPinOrders.clearFilters')}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('digitalPinOrders.title')} ({filteredOrders.length} of{' '}
            {allOrders?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<DigitalPinOrder>
            columns={columns}
            data={filteredOrders}
            isLoading={isLoading}
            emptyMessage={t('digitalPinOrders.noOrdersFound')}
            loadingMessage={t('digitalPinOrders.loadingOrders')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
