export type UserRole = 'super_admin' | 'top_management' | 'divisional_admin';

export type DivisionType = 'sekretaris' | 'bendahara' | 'keamanan' | 'kebersihan' | 'peralatan';

export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  SEKRETARIS: '/sekretaris',
  BENDAHARA: '/bendahara',
  KEAMANAN: '/keamanan',
  KEBERSIHAN: '/kebersihan',
  PERALATAN: '/peralatan',
  REPORTS: '/reports',
} as const;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  division?: DivisionType;
  avatarUrl?: string;
}

export interface Division {
  id: string;
  name: string;
  type: DivisionType;
  description: string;
  icon: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'in_progress';
  division: DivisionType;
  createdBy: string;
  comments?: Comment[];
  metadata?: Record<string, any>;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  recordedBy: string;
}

export interface Violation {
  id: string;
  santriName: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  date: string;
  takzir: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  condition: 'good' | 'broken' | 'missing';
  status: 'available' | 'borrowed';
  borrowerName?: string;
}

export const DIVISIONS: Division[] = [
  {
    id: '1',
    name: 'Sekretaris',
    type: 'sekretaris',
    description: 'Management of archives, incoming/outgoing mail, and meeting minutes.',
    icon: 'FileText',
  },
  {
    id: '2',
    name: 'Bendahara',
    type: 'bendahara',
    description: 'Financial management, student dues, and operational expenses.',
    icon: 'Wallet',
  },
  {
    id: '3',
    name: 'Keamanan',
    type: 'keamanan',
    description: 'Security oversight and monitoring of student violations (Takzir).',
    icon: 'ShieldCheck',
  },
  {
    id: '4',
    name: 'Kebersihan',
    type: 'kebersihan',
    description: 'Ro\'an scheduling and environmental cleanliness maintenance.',
    icon: 'Sparkles',
  },
  {
    id: '5',
    name: 'Peralatan',
    type: 'peralatan',
    description: 'Inventory tracking and equipment borrowing management.',
    icon: 'Package',
  },
];

export const USER_ROLES: Record<UserRole, { label: string; description: string }> = {
  super_admin: {
    label: 'Pimpinan (Mudir)',
    description: 'Read-only access to all divisions and financial overviews.',
  },
  top_management: {
    label: 'Top Management',
    description: 'Full access to reports, validation rights, and meeting minutes.',
  },
  divisional_admin: {
    label: 'Divisional Admin',
    description: 'Write access specific to their assigned division.',
  },
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'good':
    case 'available':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'pending':
    case 'in_progress':
    case 'borrowed':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'broken':
    case 'missing':
    case 'high':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
