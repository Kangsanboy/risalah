import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Filter,
  Search
} from 'lucide-react';
import { 
  Violation, 
  ROUTE_PATHS, 
  getStatusColor, 
  formatDate 
} from '@/lib';
import { useAuth } from '@/hooks/useAuth';
import { DataTable } from '@/components/DataTable';
import { ViolationForm } from '@/components/Forms';
import { SecurityTrendChart } from '@/components/Charts';
import { mockViolations } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Keamanan: React.FC = () => {
  const { canWriteDivision, isMudir } = useAuth();
  const [violations, setViolations] = useState<Violation[]>(mockViolations);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingViolation, setEditingViolation] = useState<Violation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const hasWriteAccess = canWriteDivision('keamanan');

  // Statistics calculation
  const stats = useMemo(() => ({
    total: violations.length,
    pending: violations.filter(v => v.status === 'pending').length,
    completed: violations.filter(v => v.status === 'completed').length,
    highSeverity: violations.filter(v => v.severity === 'high').length,
  }), [violations]);

  // Prepare chart data (Trend for the last 7 days or based on existing data)
  const trendData = useMemo(() => {
    const counts: Record<string, number> = {};
    violations.forEach(v => {
      counts[v.date] = (counts[v.date] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [violations]);

  const handleAddViolation = (data: any) => {
    const newViolation: Violation = {
      ...data,
      id: `vio-${Date.now()}`,
    };
    setViolations([newViolation, ...violations]);
    setIsFormOpen(false);
  };

  const handleEditViolation = (data: any) => {
    if (!editingViolation) return;
    setViolations(violations.map(v => v.id === editingViolation.id ? { ...v, ...data } : v));
    setEditingViolation(null);
    setIsFormOpen(false);
  };

  const handleDeleteViolation = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setViolations(violations.filter(v => v.id !== id));
    }
  };

  const openEditDialog = (violation: Violation) => {
    setEditingViolation(violation);
    setIsFormOpen(true);
  };

  const filteredViolations = violations.filter(v => 
    v.santriName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      label: 'Santri Name',
      key: 'santriName',
      render: (item: Violation) => (
        <div className="font-medium">{item.santriName}</div>
      )
    },
    {
      label: 'Violation Type',
      key: 'type',
    },
    {
      label: 'Severity',
      key: 'severity',
      render: (item: Violation) => (
        <Badge variant="outline" className={getStatusColor(item.severity)}>
          {item.severity.toUpperCase()}
        </Badge>
      )
    },
    {
      label: 'Date',
      key: 'date',
      render: (item: Violation) => formatDate(item.date)
    },
    {
      label: 'Takzir (Punishment)',
      key: 'takzir',
      render: (item: Violation) => (
        <span className="text-sm text-muted-foreground italic">{item.takzir}</span>
      )
    },
    {
      label: 'Status',
      key: 'status',
      render: (item: Violation) => (
        <Badge variant="outline" className={getStatusColor(item.status)}>
          {item.status === 'completed' ? 'Cleared' : 'Pending'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Security Division</h1>
          <p className="text-muted-foreground">Monitoring santri violations and disciplinary actions (Takzir).</p>
        </div>
        
        {hasWriteAccess && (
          <Dialog open={isFormOpen} onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingViolation(null);
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Log New Violation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingViolation ? 'Edit Violation Record' : 'Record New Violation'}</DialogTitle>
              </DialogHeader>
              <ViolationForm 
                onSubmit={editingViolation ? handleEditViolation : handleAddViolation}
                initialData={editingViolation}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Violations</p>
                <h3 className="text-2xl font-bold">{stats.total}</h3>
              </div>
              <ShieldAlert className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Takzir</p>
                <h3 className="text-2xl font-bold">{stats.pending}</h3>
              </div>
              <Clock className="h-8 w-8 text-amber-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold">{stats.completed}</h3>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Severity</p>
                <h3 className="text-2xl font-bold">{stats.highSeverity}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-rose-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Violation Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <SecurityTrendChart data={trendData} />
        </CardContent>
      </Card>

      {/* Main Data Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Violation Logbook</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search santri or type..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredViolations} 
            onEdit={hasWriteAccess ? openEditDialog : undefined}
            onDelete={hasWriteAccess ? handleDeleteViolation : undefined}
            searchPlaceholder="Filter violations..."
          />
        </CardContent>
      </Card>

      {isMudir && (
        <div className="bg-accent/10 border border-accent p-4 rounded-lg flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-accent mt-0.5" />
          <div>
            <p className="font-medium text-accent-foreground">Mudir Perspective</p>
            <p className="text-sm text-accent-foreground/80">
              You are viewing this division as Super Admin. All data is read-only. 
              Please use the Reports page to provide formal feedback to the Security Division.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Keamanan;