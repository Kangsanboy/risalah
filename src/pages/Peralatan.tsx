import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MoreHorizontal, 
  History, 
  Filter 
} from 'lucide-react';
import { 
  InventoryItem, 
  getStatusColor, 
  cn 
} from '@/lib';
import { useAuth } from '@/hooks/useAuth';
import { DataTable } from '@/components/DataTable';
import { InventoryForm } from '@/components/Forms';
import { mockInventory } from '@/data';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Peralatan: React.FC = () => {
  const { user, canWriteDivision } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>(undefined);

  const canWrite = canWriteDivision('peralatan');

  // Calculate stats
  const stats = useMemo(() => ({
    total: inventory.reduce((acc, item) => acc + item.quantity, 0),
    available: inventory.filter(item => item.status === 'available').length,
    borrowed: inventory.filter(item => item.status === 'borrowed').length,
    broken: inventory.filter(item => item.condition !== 'good').length,
  }), [inventory]);

  const columns = [
    {
      label: 'Item Name',
      key: 'name',
      render: (item: InventoryItem) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      label: 'Qty',
      key: 'quantity',
      render: (item: InventoryItem) => (
        <span className="font-mono">{item.quantity}</span>
      ),
    },
    {
      label: 'Condition',
      key: 'condition',
      render: (item: InventoryItem) => (
        <Badge 
          variant="outline" 
          className={cn("capitalize", getStatusColor(item.condition))}
        >
          {item.condition}
        </Badge>
      ),
    },
    {
      label: 'Status',
      key: 'status',
      render: (item: InventoryItem) => (
        <Badge 
          className={cn("capitalize", getStatusColor(item.status))}
        >
          {item.status}
        </Badge>
      ),
    },
    {
      label: 'Borrower',
      key: 'borrowerName',
      render: (item: InventoryItem) => (
        <span className="text-sm text-muted-foreground italic">
          {item.borrowerName || '-'}
        </span>
      ),
    },
  ];

  const handleAddItem = () => {
    setSelectedItem(undefined);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
      toast.success('Item deleted successfully');
    }
  };

  const handleSubmit = (data: any) => {
    if (selectedItem) {
      // Update
      setInventory(prev => prev.map(item => 
        item.id === selectedItem.id ? { ...item, ...data } : item
      ));
      toast.success('Item updated successfully');
    } else {
      // Create
      const newItem: InventoryItem = {
        ...data,
        id: `inv-${Date.now()}`,
      };
      setInventory(prev => [newItem, ...prev]);
      toast.success('New item added to inventory');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Divisi Peralatan</h1>
          <p className="text-muted-foreground">Inventory tracking and equipment management system.</p>
        </div>
        {canWrite && (
          <Button 
            onClick={handleAddItem} 
            className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Add New Item
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <h3 className="text-2xl font-bold">{stats.total}</h3>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Package className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <h3 className="text-2xl font-bold">{stats.available}</h3>
              </div>
              <div className="p-3 rounded-full bg-emerald-50">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Borrowed</p>
                <h3 className="text-2xl font-bold">{stats.borrowed}</h3>
              </div>
              <div className="p-3 rounded-full bg-amber-50">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                <h3 className="text-2xl font-bold">{stats.broken}</h3>
              </div>
              <div className="p-3 rounded-full bg-rose-50">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Inventory List</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <History className="w-4 h-4" />
              History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={inventory} 
            searchPlaceholder="Search equipment by name..."
            onEdit={canWrite ? handleEditItem : undefined}
            onDelete={canWrite ? handleDeleteItem : undefined}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {selectedItem ? 'Edit Equipment' : 'Add New Equipment'}
            </DialogTitle>
            <DialogDescription>
              Update your inventory records. Ensure quantity and condition are accurate.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <InventoryForm 
              onSubmit={handleSubmit} 
              initialData={selectedItem} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Peralatan;