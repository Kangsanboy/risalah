import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Plus, 
  Image as ImageIcon, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { 
  Activity, 
  getStatusColor, 
  formatDate, 
  cn 
} from '@/lib';
import { useAuth } from '@/hooks/useAuth';
import { DataTable } from '@/components/DataTable';
import { ActivityForm } from '@/components/Forms';
import { mockActivities } from '@/data';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Kebersihan() {
  const { user, canWriteDivision, isMudir, isTopManagement } = useAuth();
  const [activities, setActivities] = useState<Activity[]>(() => 
    mockActivities.filter(a => a.division === 'kebersihan')
  );
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const canEdit = canWriteDivision('kebersihan');

  const stats = useMemo(() => ({
    total: activities.length,
    completed: activities.filter(a => a.status === 'completed').length,
    pending: activities.filter(a => a.status === 'pending' || a.status === 'in_progress').length,
  }), [activities]);

  const columns = [
    {
      key: 'title',
      label: 'Activity & Date',
      sortable: true,
      render: (row: Activity) => (
        <div className="flex flex-col">
          <span className="font-medium text-primary">{row.title}</span>
          <span className="text-xs text-muted-foreground">{formatDate(row.date)}</span>
        </div>
      ),
    },
    {
      key: 'area',
      label: 'Area',
      render: (row: Activity) => (
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          {row.metadata?.area || 'General'}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row: Activity) => (
        <Badge variant="outline" className={cn("capitalize", getStatusColor(row.status))}>
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'proof',
      label: 'Proof',
      render: (row: Activity) => (
        <div className="flex -space-x-2">
          {row.metadata?.beforePhoto && (
            <div className="h-8 w-8 rounded-md border-2 border-background bg-muted overflow-hidden">
              <img src={row.metadata.beforePhoto} alt="Before" className="h-full w-full object-cover" />
            </div>
          )}
          {row.metadata?.afterPhoto && (
            <div className="h-8 w-8 rounded-md border-2 border-background bg-muted overflow-hidden">
              <img src={row.metadata.afterPhoto} alt="After" className="h-full w-full object-cover" />
            </div>
          )}
          {!row.metadata?.beforePhoto && !row.metadata?.afterPhoto && (
            <span className="text-xs text-muted-foreground italic">No photos</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row: Activity) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => { setSelectedActivity(row); setIsDetailOpen(true); }}
          className="text-primary hover:text-primary hover:bg-primary/10"
        >
          View Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      ),
    },
  ];

  const handleSubmit = (data: any) => {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      ...data,
      division: 'kebersihan',
      createdBy: user?.id || 'unknown',
      status: 'pending',
      date: new Date().toISOString(),
    };
    setActivities([newActivity, ...activities]);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-accent" />
            Ro'an & Cleaning
          </h1>
          <p className="text-muted-foreground">
            Manage cleaning schedules and monitor environmental hygiene.
          </p>
        </div>
        {canEdit && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Ro'an
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Cleaning Schedule</DialogTitle>
              </DialogHeader>
              <ActivityForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Activities</p>
                <h3 className="text-2xl font-bold">{stats.total}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completed</p>
                <h3 className="text-2xl font-bold text-emerald-600">{stats.completed}</h3>
              </div>
              <div className="bg-emerald-100 p-2 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pending/In-Progress</p>
                <h3 className="text-2xl font-bold text-amber-600">{stats.pending}</h3>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Activity Logbook</CardTitle>
          <CardDescription>Comprehensive list of cleaning tasks and their current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={activities} 
            searchPlaceholder="Search by activity or area..."
          />
        </CardContent>
      </Card>

      {/* Detail Modal with Photo Proof & Comments */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          {selectedActivity && (
            <ScrollArea className="h-full max-h-[80vh] pr-4">
              <DialogHeader className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn("capitalize", getStatusColor(selectedActivity.status))}>
                    {selectedActivity.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(selectedActivity.date)}</span>
                </div>
                <DialogTitle className="text-2xl">{selectedActivity.title}</DialogTitle>
                <p className="text-muted-foreground mt-2">{selectedActivity.description}</p>
              </DialogHeader>

              <div className="space-y-6">
                {/* Area Info */}
                <div className="flex items-center gap-2 text-sm bg-muted/50 p-3 rounded-lg">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">Area:</span> 
                  {selectedActivity.metadata?.area || 'N/A'}
                </div>

                {/* Photo Proof Section */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <ImageIcon className="h-4 w-4" />
                    Visual Proof (Before & After)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/20">
                        {selectedActivity.metadata?.beforePhoto ? (
                          <img src={selectedActivity.metadata.beforePhoto} alt="Before" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs text-muted-foreground">No Before Photo</span>
                        )}
                      </div>
                      <p className="text-[10px] text-center uppercase font-bold text-muted-foreground">Before</p>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/20">
                        {selectedActivity.metadata?.afterPhoto ? (
                          <img src={selectedActivity.metadata.afterPhoto} alt="After" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs text-muted-foreground">No After Photo</span>
                        )}
                      </div>
                      <p className="text-[10px] text-center uppercase font-bold text-muted-foreground">After</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pimpinan Feedback Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider">
                    <MessageSquare className="h-4 w-4" />
                    Pimpinan Feedback
                  </h4>
                  <div className="space-y-3">
                    {selectedActivity.comments?.length ? (
                      selectedActivity.comments.map((comment) => (
                        <div key={comment.id} className="bg-accent/10 border border-accent/20 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-primary">{comment.userName}</span>
                            <span className="text-[10px] text-muted-foreground">{formatDate(comment.timestamp)}</span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground italic">No feedback yet.</p>
                      </div>
                    )}

                    {(isMudir || isTopManagement) && (
                      <div className="pt-2">
                        <textarea 
                          placeholder="Add direct feedback to this activity..."
                          className="w-full min-h-[80px] p-3 text-sm rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <Button className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm">
                          Submit Feedback
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
