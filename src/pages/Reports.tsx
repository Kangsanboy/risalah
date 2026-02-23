import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  Send
} from 'lucide-react';
import {
  ROUTE_PATHS,
  formatCurrency,
  formatDate,
  getStatusColor,
  cn,
  Activity,
  DIVISIONS
} from '@/lib';
import { useAuth } from '@/hooks/useAuth';
import { 
  CompletionChart, 
  SecurityTrendChart, 
  CashflowChart 
} from '@/components/Charts';
import {
  mockActivities,
  mockFinancialRecords,
  mockViolations
} from '@/data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function Reports() {
  const { user, canComment, isMudir, isTopManagement } = useAuth();
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [isPrinting, setIsPrinting] = useState(false);

  // Prepare Data for Charts
  const completionData = useMemo(() => {
    const counts = mockActivities.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Completed', value: counts.completed || 0 },
      { name: 'In Progress', value: counts.in_progress || 0 },
      { name: 'Pending', value: counts.pending || 0 },
    ];
  }, []);

  const securityTrendData = useMemo(() => {
    const dates = [...new Set(mockViolations.map(v => v.date))].sort();
    return dates.map(date => ({
      date: formatDate(date),
      count: mockViolations.filter(v => v.date === date).length
    }));
  }, []);

  const cashflowData = useMemo(() => [
    {
      month: 'Feb 2026',
      income: mockFinancialRecords.filter(f => f.type === 'income').reduce((s, r) => s + r.amount, 0),
      expense: mockFinancialRecords.filter(f => f.type === 'expense').reduce((s, r) => s + r.amount, 0),
    }
  ], []);

  const handlePrint = () => {
    window.print();
  };

  const handleFeedbackSubmit = (activityId: string) => {
    if (!feedback[activityId]) return;
    console.log(`Submitting feedback for ${activityId}:`, feedback[activityId]);
    // In a real app, this would hit the Supabase API
    alert('Feedback submitted to the division administrator.');
    setFeedback(prev => ({ ...prev, [activityId]: '' }));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Monthly Executive Report
          </h1>
          <p className="text-muted-foreground">
            Comprehensive review for February 2026 — Pondok Pesantren Salafiyah Al-Jawahir
          </p>
        </div>
        <Button 
          onClick={handlePrint}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Printer className="w-4 h-4" />
          Print Report
        </Button>
      </header>

      {/* Report Header for Print */}
      <div className="hidden print:block text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-primary">RISALAH MANAGEMENT SYSTEM</h1>
        <h2 className="text-2xl font-semibold">Monthly Performance Report: February 2026</h2>
        <p className="text-sm italic text-muted-foreground">Generated on {new Date().toLocaleString()} by {user?.name}</p>
        <Separator className="my-4" />
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-emerald-600 space-y-2">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Completion</p>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold">82.5%</p>
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from last month
          </p>
        </Card>

        <Card className="p-6 border-l-4 border-l-amber-500 space-y-2">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Violations</p>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold">{mockViolations.filter(v => v.status === 'pending').length}</p>
          <p className="text-xs text-muted-foreground">Total logs: {mockViolations.length} cases</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-primary space-y-2">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Net Cashflow</p>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">
            {formatCurrency(cashflowData[0].income - cashflowData[0].expense)}
          </p>
          <p className="text-xs text-muted-foreground">Current Month Balance</p>
        </Card>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Program Completion Status</h3>
          <div className="h-[300px]">
            <CompletionChart data={completionData} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Security Disciplinary Trends</h3>
          <div className="h-[300px]">
            <SecurityTrendChart data={securityTrendData} />
          </div>
        </Card>
      </div>

      {/* Detailed Activity Logs & Feedback */}
      <div className="space-y-6 print:block">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Division Activities & Board Feedback
          </h2>
        </div>

        <div className="grid gap-6">
          {mockActivities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden border-border break-inside-avoid">
              <div className="flex flex-col md:flex-row">
                {/* Activity Info */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-accent text-accent-foreground capitalize">
                        {activity.division}
                      </Badge>
                      <h3 className="text-xl font-bold">{activity.title}</h3>
                    </div>
                    <Badge className={cn("px-3 py-1 border", getStatusColor(activity.status))}>
                      {activity.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground">{activity.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span><strong>Date:</strong> {formatDate(activity.date)}</span>
                    <span><strong>Recorded By:</strong> Admin {activity.division}</span>
                  </div>

                  {/* Existing Comments */}
                  {activity.comments && activity.comments.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-tighter">Previous Feedback</h4>
                      {activity.comments.map(comment => (
                        <div key={comment.id} className="bg-muted/50 p-3 rounded-lg border-l-2 border-l-primary">
                          <p className="text-sm italic">"{comment.content}"</p>
                          <p className="text-xs mt-1 font-medium">— {comment.userName}, {formatDate(comment.timestamp)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Feedback Input Section */}
                {(isMudir || isTopManagement) && (
                  <div className="w-full md:w-80 bg-muted/30 p-6 border-t md:border-t-0 md:border-l border-border print:hidden">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2 text-primary">
                        <MessageSquare className="w-4 h-4" />
                        Direct Feedback
                      </h4>
                      <Textarea 
                        placeholder="Type instructions or validation notes here..."
                        className="min-h-[100px] bg-background border-border focus:ring-accent"
                        value={feedback[activity.id] || ''}
                        onChange={(e) => setFeedback(prev => ({ ...prev, [activity.id]: e.target.value }))}
                      />
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                        onClick={() => handleFeedbackSubmit(activity.id)}
                      >
                        <Send className="w-4 h-4" />
                        Submit Feedback
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Financial Summary Table for Report */}
      <Card className="p-6 print:block overflow-hidden">
        <h3 className="text-xl font-bold mb-6 text-primary">Financial Ledger Summary (Monthly)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockFinancialRecords.map((record) => (
                <tr key={record.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(record.date)}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={record.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>
                      {record.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{record.description}</td>
                  <td className={cn(
                    "px-4 py-3 text-right font-mono font-medium",
                    record.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  )}>
                    {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-primary/5 font-bold">
              <tr>
                <td colSpan={3} className="px-4 py-4 text-right">Monthly Net Surplus/Deficit:</td>
                <td className="px-4 py-4 text-right text-lg text-primary">
                  {formatCurrency(cashflowData[0].income - cashflowData[0].expense)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Final Signature Section for Printed Report */}
      <div className="hidden print:grid grid-cols-2 gap-20 mt-20 pt-10">
        <div className="text-center space-y-16">
          <p className="font-semibold">Ketua Umum RISALAH</p>
          <div className="border-b border-black w-48 mx-auto"></div>
          <p>(Ust. Zulkifli Amin)</p>
        </div>
        <div className="text-center space-y-16">
          <p className="font-semibold">Mudir Pondok Pesantren</p>
          <div className="border-b border-black w-48 mx-auto"></div>
          <p>(KH. Ahmad Jauhari)</p>
        </div>
      </div>
    </div>
  );
}
