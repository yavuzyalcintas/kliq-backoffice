import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  sortType?: 'string' | 'number' | 'date';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[] | undefined;
  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data found',
  loadingMessage = 'Loading...',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const columnKey = column.accessorKey;

    if (sortColumn === columnKey) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const getSortedData = () => {
    if (!data || !sortColumn || !sortDirection) {
      return data;
    }

    const sortedData = [...data];
    const column = columns.find(col => col.accessorKey === sortColumn);
    const sortType = column?.sortType || 'string';

    sortedData.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
      if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

      let comparison = 0;

      switch (sortType) {
        case 'number':
          comparison = Number(aValue) - Number(bValue);
          break;
        case 'date':
          comparison =
            new Date(String(aValue)).getTime() -
            new Date(String(bValue)).getTime();
          break;
        case 'string':
        default:
          comparison = String(aValue).localeCompare(String(bValue));
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sortedData;
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortColumn === column.accessorKey;

    if (!isActive) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }

    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4 text-primary" />;
    }

    if (sortDirection === 'desc') {
      return <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
    }

    return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
  };

  const sortedData = getSortedData();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={String(column.accessorKey)}>
                {column.sortable ? (
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(column)}
                    className={cn(
                      'h-auto p-0 font-semibold hover:bg-transparent',
                      sortColumn === column.accessorKey && 'text-primary'
                    )}
                  >
                    <span className="flex items-center">
                      {column.header}
                      {getSortIcon(column)}
                    </span>
                  </Button>
                ) : (
                  <span className="font-semibold">{column.header}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">{loadingMessage}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : !sortedData || sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((item, index) => (
              <TableRow key={index}>
                {columns.map(column => (
                  <TableCell key={String(column.accessorKey)}>
                    {column.cell
                      ? column.cell(item)
                      : String(item[column.accessorKey])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
