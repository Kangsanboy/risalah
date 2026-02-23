import React, { useMemo } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  TrendingUp, 
  Wallet, 
  CheckCircle2, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { 
  ROUTE_PATHS, 
  formatCurrency, 
  formatDate 
} from '@/lib';
import { 
  mockActivities, 
  mockFinancialRecords, 
  mockViolations 
} from '@/data';
import { StatsCard, MetricCard, ProgressCard } from '@/components/Stats';
import { CompletionChart, SecurityTrendChart, CashflowChart } from '@/components/Charts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Data Processing for Charts & Stats
  const stats = useMemo(() => {
    const totalActivities = mockActivities.length;
    const completedActivities = mockActivities.filter(a => a.status === 'completed').length;
    const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

    const totalIncome = mockFinancialRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = mockFinancialRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    const balance = totalIncome - totalExpense;

    const pendingViolations = mockViolations.filter(v => v.status === 'pending').length;

    return {
      completionRate,
      totalActivities,
      completedActivities,
      balance,
      totalIncome,
      totalExpense,
      pendingViolations
    };
  }, []);

  const completionData = useMemo(() => {
    const divisions = ['sekretaris', 'bendahara', 'keamanan', 'kebersihan', 'peralatan'];
    return divisions.map(div => ({
      name: div.charAt(0).toUpperCase() + div.slice(1),
      value: mockActivities.filter(a => a.division === div && a.status === 'completed').length
    }));
  }, []);

  const securityTrendData = useMemo(() => {
    const dates = [...new Set(mockViolations.map(v => v.date))].sort();
    return dates.map(date => ({
      date,
      count: mockViolations.filter(v => v.date === date).length
    }));
  }, []);

  const cashflowData = useMemo(() => {
    // Simple monthly aggregation for the chart
    return [
      { month: 'Jan', income: 12000000, expense: 8000000 },
      { month: 'Feb', income: stats.totalIncome, expense: stats.totalExpense },
    ];
  }, [stats]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Ahlan wa Sahlan, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to RISALAH Management System. Here is your daily pesantren overview.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card p-3 rounded-xl border shadow-sm">
          <Calendar className="w-5 h-5 text-accent" />
          <span className="font-medium">{formatDate(new Date().toISOString())}</span>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Program Completion"
          value={`${stats.completionRate}%`}
          icon={<LayoutDashboard className="w-5 h-5" />}
          trend={5}
        />
        <StatsCard 
          title="Current Balance"
          value={formatCurrency(stats.balance)}
          icon={<Wallet className="w-5 h-5" />}
          trend={12}
        />
        <StatsCard 
          title="Pending Violations"
          value={stats.pendingViolations}
          icon={<ShieldAlert className="w-5 h-5" />}
          trend={-2}
        />
        <StatsCard 
          title="Active Programs"
          value={stats.totalActivities}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={8}
        />
      </div>

      {/* Progress Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cashflow Analysis</CardTitle>
                <CardDescription>Monthly income vs expenditure comparison</CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Real-time
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <CashflowChart data={cashflowData} />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <ProgressCard 
            title="Overall Progress"
            current={stats.completedActivities}
            total={stats.totalActivities}
            percentage={stats.completionRate}
            label="Tasks Completed"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetricCard 
                label="Total Income"
                value={formatCurrency(stats.totalIncome)}
                icon={<ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                variant="default"
              />
              <MetricCard 
                label="Total Expenses"
                value={formatCurrency(stats.totalExpense)}
                icon={<ArrowDownRight className="w-4 h-4 text-rose-500" />}
                variant="accent"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Divisional Breakdown & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security & Discipline Trend</CardTitle>
            <CardDescription>Violation frequency over the last few days</CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityTrendChart data={securityTrendData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Divisional Performance</CardTitle>
            <CardDescription>Completed activities per administrative division</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletionChart data={completionData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Mini List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Latest Activity Log</CardTitle>
              <CardDescription>Recently updated tasks and reports</CardDescription>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </motion.button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivities.slice(0, 3).map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {activity.division.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.division} • {formatDate(activity.date)}</p>
                  </div>
                </div>
                <Badge 
                  className={activity.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                >
                  {activity.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;