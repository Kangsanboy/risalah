import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  ROUTE_PATHS, 
  USER_ROLES, 
  DIVISIONS, 
  UserRole, 
  DivisionType, 
  User 
} from '@/lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IMAGES } from '@/assets/images';
import { useToast } from '@/components/ui/use-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setIsLoading, isLoading } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');
  const [selectedDivision, setSelectedDivision] = useState<DivisionType | undefined>(undefined);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      try {
        // Mock user creation based on selected role
        const mockUser: User = {
          id: Math.random().toString(36).substring(7),
          name: selectedRole === 'super_admin' ? 'K.H. Ahmad Dahlan' : 'Ustadz Abdullah',
          email: email || 'admin@al-jawahir.id',
          role: selectedRole,
          division: selectedRole === 'divisional_admin' ? selectedDivision : undefined,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRole}`
        };

        setUser(mockUser);
        
        toast({
          title: "Selamat Datang Kembali",
          description: `Masuk sebagai ${USER_ROLES[selectedRole].label}`,
        });

        navigate(ROUTE_PATHS.DASHBOARD);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Autentikasi Gagal",
          description: "Silakan periksa kredensial Anda dan coba lagi.",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden p-4">
      {/* Background with Islamic Calligraphy Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-15 grayscale contrast-125"
        style={{ 
          backgroundImage: `url(${IMAGES.CALLIGRAPHY_2})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-accent/10 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary shadow-xl mb-4 border-2 border-accent/30">
            <BookOpen className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-primary tracking-tight font-sans">
            RISALAH
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Pondok Pesantren Salafiyah Al-Jawahir
          </p>
        </div>

        <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95 overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Masuk</CardTitle>
            <CardDescription className="text-center">
              Akses sistem manajemen divisi Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@al-jawahir.id"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Peran Akses</Label>
                  <Select 
                    value={selectedRole} 
                    onValueChange={(val: UserRole) => setSelectedRole(val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih peran Anda" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(USER_ROLES).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole === 'divisional_admin' && (
                  <div className="space-y-2 col-span-2 animate-in fade-in slide-in-from-top-2">
                    <Label>Divisi yang Ditugaskan</Label>
                    <Select 
                      value={selectedDivision} 
                      onValueChange={(val: DivisionType) => setSelectedDivision(val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih divisi" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIVISIONS.map((div) => (
                          <SelectItem key={div.id} value={div.type}>
                            {div.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base font-semibold transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin rounded-full" />
                    Mengautentikasi...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Masuk Ke Sistem
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg w-full">
              <AlertCircle className="w-4 h-4 text-accent" />
              <span>Hanya pengurus pesantren yang berwenang yang dapat mengakses sistem ini.</span>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              &copy; 2026 RISALAH | Pondok Pesantren Salafiyah Al-Jawahir
            </p>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Decorative Elements */}
      <div className="fixed bottom-8 right-8 hidden md:block">
        <div className="flex items-center gap-3 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">
           <Shield className="w-8 h-8 text-primary" />
           <div className="text-right">
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Infrastruktur Aman</p>
              <p className="text-[10px] text-muted-foreground">Protokol Data Terenkripsi v4.2</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
