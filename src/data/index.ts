import { 
  User, 
  Activity, 
  FinancialRecord, 
  Violation, 
  InventoryItem 
} from '../lib/index';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'KH. Ahmad Jauhari',
    email: 'mudir@aljawahir.com',
    role: 'super_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    id: 'user-2',
    name: 'Ust. Zulkifli Amin',
    email: 'ketua@aljawahir.com',
    role: 'top_management',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  },
  {
    id: 'user-3',
    name: 'Muhammad Farhan',
    email: 'sekretaris@aljawahir.com',
    role: 'divisional_admin',
    division: 'sekretaris',
  },
  {
    id: 'user-4',
    name: 'Siti Aminah',
    email: 'bendahara@aljawahir.com',
    role: 'divisional_admin',
    division: 'bendahara',
  },
  {
    id: 'user-5',
    name: 'Abdullah Hakim',
    email: 'keamanan@aljawahir.com',
    role: 'divisional_admin',
    division: 'keamanan',
  },
  {
    id: 'user-6',
    name: 'Rahmat Hidayat',
    email: 'kebersihan@aljawahir.com',
    role: 'divisional_admin',
    division: 'kebersihan',
  },
  {
    id: 'user-7',
    name: 'Budi Santoso',
    email: 'peralatan@aljawahir.com',
    role: 'divisional_admin',
    division: 'peralatan',
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    title: 'Weekly Coordination Meeting',
    description: 'Meeting to discuss monthly progress and division evaluations.',
    date: '2026-02-20T09:00:00Z',
    status: 'completed',
    division: 'sekretaris',
    createdBy: 'user-3',
    comments: [
      {
        id: 'com-1',
        userId: 'user-1',
        userName: 'KH. Ahmad Jauhari',
        content: 'Please ensure all divisions submit their reports on time.',
        timestamp: '2026-02-20T11:00:00Z',
      }
    ],
    metadata: {
      minutesLink: '#',
      attendeesCount: 12,
    }
  },
  {
    id: 'act-2',
    title: 'Ro\'an Akbar (Grand Cleaning)',
    description: 'Total cleaning of the main mosque and dormitory area.',
    date: '2026-02-22T06:30:00Z',
    status: 'completed',
    division: 'kebersihan',
    createdBy: 'user-6',
    metadata: {
      area: 'Main Mosque',
      beforePhoto: 'https://images.unsplash.com/photo-1542618027-13d3eb1b438e?w=300',
      afterPhoto: 'https://images.unsplash.com/photo-1582033131298-5bb54c589518?w=300',
    }
  },
  {
    id: 'act-3',
    title: 'Monthly Inventory Audit',
    description: 'Checking the condition and quantity of all shared equipment.',
    date: '2026-02-25T14:00:00Z',
    status: 'pending',
    division: 'peralatan',
    createdBy: 'user-7',
  },
  {
    id: 'act-4',
    title: 'Takzir Implementation',
    description: 'Execution of disciplinary actions for level 2 violations.',
    date: '2026-02-23T16:00:00Z',
    status: 'in_progress',
    division: 'keamanan',
    createdBy: 'user-5',
  }
];

export const mockFinancialRecords: FinancialRecord[] = [
  {
    id: 'fin-1',
    type: 'income',
    amount: 15000000,
    category: 'Student Dues (Syahriah)',
    description: 'Monthly dues from 150 students for February 2026.',
    date: '2026-02-05',
    recordedBy: 'user-4',
  },
  {
    id: 'fin-2',
    type: 'expense',
    amount: 4500000,
    category: 'Electricity & Water',
    description: 'Monthly utility bill for main building and dorms.',
    date: '2026-02-10',
    recordedBy: 'user-4',
  },
  {
    id: 'fin-3',
    type: 'income',
    amount: 5000000,
    category: 'Donation',
    description: 'Waqf donation from alumni for mosque renovation.',
    date: '2026-02-15',
    recordedBy: 'user-4',
  },
  {
    id: 'fin-4',
    type: 'expense',
    amount: 1200000,
    category: 'Maintenance',
    description: 'Repair of sound system in the main hall.',
    date: '2026-02-18',
    recordedBy: 'user-4',
  }
];

export const mockViolations: Violation[] = [
  {
    id: 'vio-1',
    santriName: 'Ahmad Fauzi',
    type: 'Late for Subuh Prayer',
    severity: 'low',
    status: 'completed',
    date: '2026-02-21',
    takzir: 'Cleaning the hallway for 15 minutes.',
  },
  {
    id: 'vio-2',
    santriName: 'Zaki Mubarak',
    type: 'Leaving Without Permission',
    severity: 'high',
    status: 'pending',
    date: '2026-02-22',
    takzir: 'Summoning parents and 1-week suspension of privileges.',
  },
  {
    id: 'vio-3',
    santriName: 'Umar Bakri',
    type: 'Improper Uniform',
    severity: 'low',
    status: 'completed',
    date: '2026-02-23',
    takzir: 'Memorizing 10 verses of Al-Baqarah.',
  },
  {
    id: 'vio-4',
    santriName: 'Luthfi Hakim',
    type: 'Possession of Prohibited Electronics',
    severity: 'medium',
    status: 'pending',
    date: '2026-02-23',
    takzir: 'Confiscation for 1 semester and additional cleaning duty.',
  }
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'LCD Projector Epson',
    quantity: 2,
    condition: 'good',
    status: 'available',
  },
  {
    id: 'inv-2',
    name: 'Sound System Portable',
    quantity: 1,
    condition: 'good',
    status: 'borrowed',
    borrowerName: 'Division of Education',
  },
  {
    id: 'inv-3',
    name: 'Folding Chairs (Metal)',
    quantity: 50,
    condition: 'good',
    status: 'available',
  },
  {
    id: 'inv-4',
    name: 'Vacuum Cleaner',
    quantity: 1,
    condition: 'broken',
    status: 'available',
  },
  {
    id: 'inv-5',
    name: 'Digital Camera Sony',
    quantity: 1,
    condition: 'good',
    status: 'borrowed',
    borrowerName: 'Sekretariat',
  }
];