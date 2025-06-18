import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { customerService } from '@/services/customerService';
import { DataTable } from '@/components/ui/data-table';
import type { Column } from '@/components/ui/data-table';

interface Customer {
  id: string;
  accountNumber: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export function CustomersList() {
  const [filters, setFilters] = useState({
    kliqId: '',
    phone: '',
  });

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', filters],
    queryFn: () => {
      const hasFilters = filters.kliqId || filters.phone;
      return hasFilters
        ? customerService.searchCustomers(filters)
        : customerService.getCustomers();
    },
  });

  const handleFilterChange = (key: 'kliqId' | 'phone', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ kliqId: '', phone: '' });
  };

  const hasActiveFilters = filters.kliqId || filters.phone;

  const columns: Column<Customer>[] = [
    {
      header: 'KliqId',
      accessorKey: 'accountNumber',
      cell: customer => (
        <span className="font-medium">{customer.accountNumber}</span>
      ),
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: customer => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            customer.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {customer.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: () => (
        <div className="text-right">
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        {/* <Button>Add Customer</Button> */}
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">KliqId</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by KliqId..."
                className="pl-8"
                value={filters.kliqId}
                onChange={e => handleFilterChange('kliqId', e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">
              Phone Number
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by phone number..."
                className="pl-8"
                value={filters.phone}
                onChange={e => handleFilterChange('phone', e.target.value)}
              />
            </div>
          </div>
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        emptyMessage="No customers found"
        loadingMessage="Loading customers..."
      />
    </div>
  );
}
