import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Mail, 
  FileSignature, 
  Archive, 
  Filter, 
  Download,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { 
  ROUTE_PATHS, 
  Activity, 
  cn, 
  formatDate, 
  getStatusColor 
} from '@/lib';
import { useAuth } from '@/hooks/useAuth';
import { DataTable } from '@/components/DataTable';
import { ActivityForm } from '@/components/Forms';
import { mockActivities } from '@/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sekretaris() {
  const { user, canWriteDivision, isMudir, isTopManagement } = useAuth();
  const [activities, setActivities] = useState<Activity[]>(
    mockActivities.filter(a => a.division === 'sekretaris')
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Activity | null>(null);

  const canWrite = canWriteDivision('sekretaris');

  const filteredActivities = useMemo(() => {
    return activities.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activities, searchTerm]);

  const handleAddArchive = (data: any) => {
    const newActivity: Activity = {
      ...data,
      id: `act-${Date.now()}`,
      division: 'sekretaris',
      createdBy: user?.id || 'unknown',
      status: 'completed',
    };
    setActivities([newActivity, ...activities]);
    setIsDialogOpen(false);
  };

  const handleUpdateArchive = (data: any) => {
    setActivities(activities.map(a => a.id === editingItem?.id ? { ...a, ...data } : a));
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setActivities(activities.filter(a => a.id !== id));
    }
  };

  const columns = [
    {
      label: 'Document Name',
      key: 'title',
      render: (item: Activity) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {item.title.toLowerCase().includes('meeting') ? <FileSignature className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{item.title}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
          </div>
        </div>
      )
    },
    {
      label: 'Date',
      key: 'date',
      render: (item: Activity) => (
        <span className="text-sm font-mono">{formatDate(item.date)}</span>
      )
    },
    {
      label: 'Status',
      key: 'status',
      render: (item: Activity) => (
        <Badge variant="outline" className={cn("capitalize", getStatusColor(item.status))}>
          {item.status.replace('_', ' ')}
        </Badge>
      )
    },
    {
      label: 'Reference',
      key: 'metadata',
      render: (item: Activity) => (
        <span className="text-xs text-muted-foreground">
          {item.metadata?.refNumber || 'REF-' + item.id.split('-')[1]}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Archive className="w-8 h-8" />
            Divisi Sekretariat
          </h1>
          <p className="text-muted-foreground">
            Digital archive management for mail and meeting minutes.
          </p>
        </div>

        {canWrite && (
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingItem(null);
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Archive
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Archive' : 'Add New Archive'}</DialogTitle>
              </DialogHeader>
              <ActivityForm 
                onSubmit={editingItem ? handleUpdateArchive : handleAddArchive}
                initialData={editingItem}
              />
            </DialogContent>
          </Dialog>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-emerald-600 font-medium">+4 updated this week</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Meeting Minutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities.filter(a => a.title.toLowerCase().includes('meeting')).length}
            </div>
            <p className="text-xs text-muted-foreground">From regular coordination</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {activities.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Needs mudir validation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="all">All Archives</TabsTrigger>
            <TabsTrigger value="mail">Mail Log</TabsTrigger>
            <TabsTrigger value="minutes">Minutes</TabsTrigger>
          </TabsList>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search documents..."
              className="pl-9 bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card className="border-border shadow-sm">
            <CardContent className="p-0">
              <DataTable 
                columns={columns}
                data={filteredActivities}
                onEdit={canWrite ? (item) => {
                  setEditingItem(item);
                  setIsDialogOpen(true);
                } : undefined}
                onDelete={canWrite ? handleDelete : undefined}
                searchPlaceholder="Filter list..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mail" className="mt-0">
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Incoming/Outgoing Mail Log</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                This section displays filtered results for official correspondence records.
              </p>
              <DataTable 
                columns={columns}
                data={filteredActivities.filter(a => !a.title.toLowerCase().includes('meeting'))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="minutes" className="mt-0">
          <Card>
            <CardContent className="p-8 text-center">
              <FileSignature className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Notulensi (Meeting Minutes)</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                Official records of decisions made during pesantren council meetings.
              </p>
              <DataTable 
                columns={columns}
                data={filteredActivities.filter(a => a.title.toLowerCase().includes('meeting'))}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {(isMudir || isTopManagement) && ( 
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-accent-foreground flex items-center gap-2 text-base">
              <Eye className="w-4 h-4" />
              Pimpinan Feedback Panel
            </CardTitle>
            <CardDescription>
              Direct feedback for the Secretary division regarding document quality.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input placeholder="Write a quick comment..." className="flex-1" />
              <Button className="bg-accent text-accent-foreground hover:opacity-90 shadow-sm">Post Feedback</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
