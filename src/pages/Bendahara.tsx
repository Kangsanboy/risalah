import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  Download,
  Search,
  AlertCircle
} from 'lucide-react';
import {
  formatCurrency,
  formatDate,
  FinancialRecord,
  ROUTE_PATHS
} from '@/lib';
import { useAuth } from '@/hooks/useAuth';
import { DataTable } from '@/components/DataTable';
import { FinancialForm } from '@/components/Forms';
import { CashflowChart } from '@/components/Charts';
import { mockFinancialRecords } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Bendahara: React.FC = () => {
  const { user, canWriteDivision, canReadDivision } = useAuth();
  const [records, setRecords] = useState<FinancialRecord[]>(mockFinancialRecords);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');

  // Access control
  const hasWriteAccess = canWriteDivision('bendahara');
  const hasReadAccess = canReadDivision('bendahara');

  // Financial Summaries
  const totals = useMemo(() => {
    return records.reduce(
      (acc, record) => {
        if (record.type === 'income') acc.income += record.amount;
        else acc.expense += record.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [records]);

  const balance = totals.income - totals.expense;

  // Chart Data Aggregation (Simplified for current month display)
  const chartData = [
    {
      month: 'Jan',
      income: 12000000,
      expense: 8000000,
    },
    {
      month: 'Feb',
      income: totals.income,
      expense: totals.expense,
    },
  ];

  // Filtering logic
  const filteredRecords = useMemo(() => {
    if (activeTab === 'all') return records;
    return records.filter((r) => r.type === activeTab);
  }, [records, activeTab]);

  const handleAdd = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const handleEdit = (record: FinancialRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSubmit = (data: any) => {
    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? { ...r, ...data } : r));
    } else {
      const newRecord: FinancialRecord = {
        ...data,
        id: `fin-${Date.now()}`,
        recordedBy: user?.id || 'unknown',
      };
      setRecords(prev => [newRecord, ...prev]);
    }
    setIsFormOpen(false);
  };

  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }: any) => <span className="font-mono">{formatDate(row.original.date)}</span>,
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row }: any) => <span className="font-medium">{row.original.category}</span>,
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }: any) => <span className="text-muted-foreground line-clamp-1">{row.original.description}</span>,
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }: any) => (
        <Badge 
          variant={row.original.type === 'income' ? 'outline' : 'destructive'}
          className={row.original.type === 'income' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
        >
          {row.original.type.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }: any) => (
        <span className={`font-mono font-bold ${row.original.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {row.original.type === 'income' ? '+' : '-'} {formatCurrency(row.original.amount)}
        </span>
      ),
    },
  ];

  if (!hasReadAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertCircle className="h-16 w-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground max-w-md mt-2">
          You do not have permission to view the financial records. Please contact the administrator if you believe this is an error.
        </p>
        <Button className="mt-6" onClick={() => window.location.href = ROUTE_PATHS.DASHBOARD}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Financial Bookkeeping</h1>
          <p className="text-muted-foreground">Manage student dues, donations, and operational expenses of the Pesantren.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          {hasWriteAccess && (
            <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totals.income)}</div>
            <p className="text-xs text-muted-foreground mt-1">Monthly revenue from all sources</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{formatCurrency(totals.expense)}</div>
            <p className="text-xs text-muted-foreground mt-1">Monthly operational spending</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Wallet className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
            <p className="text-xs text-muted-foreground mt-1">Remaining cash in hand</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Cashflow Analysis</CardTitle>
            <CardDescription>Visual trend of income vs expenses for the current period.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <CashflowChart data={chartData as any} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Summary</CardTitle>
            <CardDescription>Breakdown by major categories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {records.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="font-medium">{record.category}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(record.date)}</span>
                </div>
                <span className={record.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>
                  {record.type === 'income' ? '+' : '-'} {formatCurrency(record.amount)}
                </span>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs" onClick={() => setActiveTab('all')}>
              View Full History
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaction Logs</CardTitle>
            <CardDescription>Detailed history of all financial activities.</CardDescription>
          </div>
          <Tabs defaultValue="all" onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns as any} 
            data={filteredRecords} 
            onEdit={hasWriteAccess ? handleEdit : undefined}
            onDelete={hasWriteAccess ? handleDelete : undefined}
            searchPlaceholder="Search categories or descriptions..."
          />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Edit Transaction' : 'Record New Transaction'}</DialogTitle>
            <DialogDescription>
              Ensure all financial data is recorded accurately for auditing purposes.
            </DialogDescription>
          </DialogHeader>
          <FinancialForm 
            onSubmit={handleSubmit} 
            initialData={editingRecord}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bendahara;