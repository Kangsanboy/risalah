import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency } from '@/lib/index';

// Design system colors based on OKLCH mappings in index.css
const COLORS = {
  primary: 'var(--chart-1)', // Emerald
  accent: 'var(--chart-2)',  // Gold
  info: 'var(--chart-3)',    // Teal
  highlight: 'var(--chart-4)', // Light Gold
  secondary: 'var(--chart-5)', // Dark Emerald
};

/**
 * CompletionChart displays the distribution of work program statuses
 * Props: data: { name: string, value: number }[]
 */
export function CompletionChart({ data }: { data: { name: string; value: number }[] }) {
  const PIE_COLORS = [COLORS.primary, COLORS.accent, COLORS.info];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '12px'
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * SecurityTrendChart shows violation counts over time
 * Props: data: { date: string, count: number }[]
 */
export function SecurityTrendChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '12px'
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={COLORS.primary}
            strokeWidth={3}
            dot={{ r: 4, fill: COLORS.primary, strokeWidth: 2, stroke: 'var(--background)' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Violations"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * CashflowChart visualizes income vs expenses over time
 * Props: data: { month: string, income: number, expense: number }[]
 */
export function CashflowChart({ data }: { data: { month: string; income: number; expense: number }[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.1} />
              <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            tickFormatter={(value) => `Rp ${value / 1000000}M`}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '12px'
            }}
          />
          <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
          <Area
            type="monotone"
            dataKey="income"
            stroke={COLORS.primary}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIncome)"
            name="Income"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke={COLORS.accent}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExpense)"
            name="Expense"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
