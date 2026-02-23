import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Wallet,
  ShieldCheck,
  Sparkles,
  Package,
  ClipboardList,
  LogOut,
  User as UserIcon,
  Menu,
  X
} from 'lucide-react';
import { IMAGES } from '@/assets/images';
import { ROUTE_PATHS, cn, DivisionType } from '@/lib';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  division?: DivisionType;
  adminOnly?: boolean;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, canReadDivision, isMudir, isTopManagement } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: ROUTE_PATHS.DASHBOARD,
      icon: LayoutDashboard
    },
    {
      label: 'Sekretaris',
      path: ROUTE_PATHS.SEKRETARIS,
      icon: FileText,
      division: 'sekretaris'
    },
    {
      label: 'Bendahara',
      path: ROUTE_PATHS.BENDAHARA,
      icon: Wallet,
      division: 'bendahara'
    },
    {
      label: 'Keamanan',
      path: ROUTE_PATHS.KEAMANAN,
      icon: ShieldCheck,
      division: 'keamanan'
    },
    {
      label: 'Kebersihan',
      path: ROUTE_PATHS.KEBERSIHAN,
      icon: Sparkles,
      division: 'kebersihan'
    },
    {
      label: 'Peralatan',
      path: ROUTE_PATHS.PERALATAN,
      icon: Package,
      division: 'peralatan'
    },
    {
      label: 'Reports',
      path: ROUTE_PATHS.REPORTS,
      icon: ClipboardList,
      adminOnly: true
    }
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly) return isMudir || isTopManagement;
    if (item.division) return canReadDivision(item.division);
    return true;
  });

  const mobileNavItems = filteredNavItems.slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground fixed h-full z-50 border-r border-sidebar-border">
        <div className="relative p-6 h-32 flex items-center justify-center overflow-hidden">
          <img 
            src={IMAGES.CALLIGRAPHY_1} 
            alt="Pattern" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
          />
          <div className="relative z-10 text-center">
            <h1 className="text-2xl font-bold tracking-widest text-sidebar-primary">RISALAH</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">Management System</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/50">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary/20 flex items-center justify-center border border-sidebar-primary/30">
              <UserIcon className="w-5 h-5 text-sidebar-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] uppercase text-sidebar-primary font-bold tracking-wider">
                {user?.role.replace('_', ' ')}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-sidebar-foreground/60"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-sidebar text-sidebar-foreground flex items-center justify-between px-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-xs">R</span>
          </div>
          <h1 className="font-bold tracking-wider text-sidebar-primary">RISALAH</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-sidebar-foreground"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Overlay Menu */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background pt-16 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="p-4 space-y-2">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 px-5 py-4 rounded-xl",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-foreground"
                  )
                }
              >
                <item.icon className="w-6 h-6" />
                <span className="font-semibold">{item.label}</span>
              </NavLink>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-destructive/10 text-destructive"
            >
              <LogOut className="w-6 h-6" />
              <span className="font-semibold">Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:pl-64 pb-20 lg:pb-0">
        <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-2 z-50">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
          <button 
            onClick={() => navigate('/profile')} // Assuming a profile page or drawer
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] text-muted-foreground"
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </nav>
      </main>

      {/* Decorative footer element for large screens */}
      <footer className="hidden lg:block fixed bottom-4 right-8 pointer-events-none opacity-20">
        <p className="text-xs font-mono text-muted-foreground">© 2026 PP. Salafiyah Al-Jawahir</p>
      </footer>
    </div>
  );
}
