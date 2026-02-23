import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/index';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { springPresets } from '@/lib/motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

export function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPresets.gentle}
    >
      <Card className="relative overflow-hidden group p-6 border-l-4 border-l-primary hover:shadow-lg transition-all duration-300">
        {/* Subtle Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="flex justify-between items-start">
          <div className="space-y-2 relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {title}
            </p>
            <h3 className="text-3xl font-bold tracking-tight text-foreground font-mono">
              {value}
            </h3>
            
            {trend !== undefined && (
              <div className={cn(
                "flex items-center text-xs font-semibold",
                isPositive ? "text-emerald-600" : "text-rose-600"
              )}>
                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                <span>{Math.abs(trend)}% from last period</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:rotate-6">
            {icon}
          </div>
        </div>

        {/* Gold Accent Corner */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <div className="absolute top-[-24px] right-[-24px] w-12 h-12 bg-accent/20 rotate-45" />
        </div>
      </Card>
    </motion.div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'accent';
}

export function MetricCard({ label, value, subtext, icon, variant = 'default' }: MetricCardProps) {
  return (
    <Card className={cn(
      "p-6 flex flex-col justify-between h-full border-2 transition-colors",
      variant === 'accent' 
        ? "border-accent/30 bg-accent/5" 
        : "border-border bg-card hover:border-primary/20"
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        {icon && <div className="text-primary opacity-60">{icon}</div>}
      </div>
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-1 text-foreground">{value}</h2>
        {subtext && <p className="text-xs text-muted-foreground font-medium">{subtext}</p>}
      </div>
    </Card>
  );
}

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  percentage: number;
  label: string;
  icon?: React.ReactNode;
}

export function ProgressCard({ title, current, total, percentage, label, icon }: ProgressCardProps) {
  return (
    <Card className="p-6 border-2 border-primary/5 bg-gradient-to-br from-card to-primary/[0.02] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon && <div className="p-2 bg-primary/10 rounded-lg text-primary">{icon}</div>}
          <h4 className="font-bold text-sm tracking-tight text-foreground">{title}</h4>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3 text-accent" />
          <span className="text-xs font-black px-2 py-0.5 bg-accent/15 text-accent-foreground rounded-full">
            {percentage}%
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <Progress value={percentage} className="h-2 bg-muted overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out shadow-[0_0_8px_rgba(6,78,59,0.3)]"
            style={{ width: `${percentage}%` }}
          />
        </Progress>
        
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-primary">{current}</span>
            <span className="text-[10px] text-muted-foreground">/ {total}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
