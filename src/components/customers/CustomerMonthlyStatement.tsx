import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { customerService } from '@/services/customerService';

interface CustomerMonthlyStatementProps {
  customerId: string;
}

export function CustomerMonthlyStatement({
  customerId,
}: CustomerMonthlyStatementProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [showStatementPreview, setShowStatementPreview] = useState(false);

  const {
    data: statement,
    isLoading: isLoadingStatement,
    refetch: refetchStatement,
  } = useQuery({
    queryKey: ['customerStatement', customerId, selectedMonth, selectedYear],
    queryFn: () =>
      customerService.getCustomerStatement(
        customerId,
        selectedMonth,
        selectedYear
      ),
    enabled: !!customerId,
  });

  // Generate years array (current year - 3 to current year + 3)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

  // Generate months array
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const handleGenerateStatement = () => {
    refetchStatement();
  };

  const handleDownloadPDF = () => {
    if (!statement) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(statement.htmlContent);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Statement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">Month</label>
            <Select
              value={selectedMonth.toString()}
              onValueChange={value => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block">Year</label>
            <Select
              value={selectedYear.toString()}
              onValueChange={value => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleGenerateStatement}
            disabled={isLoadingStatement}
          >
            Generate Statement
          </Button>
        </div>

        {isLoadingStatement && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {statement && !isLoadingStatement && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {months.find(m => m.value === selectedMonth)?.label}{' '}
                  {selectedYear}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total: ${statement.totalAmount.toFixed(2)} | Transactions:{' '}
                  {statement.transactionCount}
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={showStatementPreview}
                  onOpenChange={setShowStatementPreview}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        Statement Preview -{' '}
                        {months.find(m => m.value === selectedMonth)?.label}{' '}
                        {selectedYear}
                      </DialogTitle>
                    </DialogHeader>
                    <div
                      className="mt-4"
                      dangerouslySetInnerHTML={{
                        __html: statement.htmlContent,
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}

        {!statement && !isLoadingStatement && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No statement available for the selected period.</p>
            <p className="text-sm">
              Generate a statement to view and download.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
