-- RISALAH Pesantren Management System Database Schema
-- Created: 2026-02-23 15:15 UTC

-- Enable RLS on all tables
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'top_management', 'divisional_admin', 'user');
CREATE TYPE division_type AS ENUM ('sekretaris', 'bendahara', 'keamanan', 'kebersihan', 'peralatan');
CREATE TYPE activity_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE violation_status AS ENUM ('pending', 'completed', 'dismissed');
CREATE TYPE equipment_status AS ENUM ('available', 'borrowed', 'maintenance', 'damaged');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users_2026_02_23_15_15 (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'user',
    division division_type,
    avatar_url TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Divisions table
CREATE TABLE public.divisions_2026_02_23_15_15 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type division_type NOT NULL,
    description TEXT,
    head_id UUID REFERENCES public.users_2026_02_23_15_15(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table (general activities for all divisions)
CREATE TABLE public.activities_2026_02_23_15_15 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    division division_type NOT NULL,
    status activity_status DEFAULT 'pending',
    assigned_to UUID REFERENCES public.users_2026_02_23_15_15(id),
    created_by UUID REFERENCES public.users_2026_02_23_15_15(id),
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    comments TEXT,
    pimpinan_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sekretaris: Mail and meeting minutes
CREATE TABLE public.mail_archive_2026_02_23_15_15 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('incoming', 'outgoing')),
    subject TEXT NOT NULL,
    sender TEXT,
    recipient TEXT,
    content TEXT,
    document_url TEXT,
    date_received DATE,
    date_sent DATE,
    created_by UUID REFERENCES public.users_2026_02_23_15_15(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.meeting_minutes_2026_02_23_15_15 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    attendees TEXT[],
    agenda TEXT NOT NULL,
    decisions TEXT,
    action_items TEXT,
    next_meeting DATE,
    document_url TEXT,
    created_by UUID REFERENCES public.users_2026_02_23_15_15(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bendahara: Financial records
CREATE TABLE public.financial_records_2026_02_23_15_15 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    date DATE NOT NULL,
    receipt_url TEXT,
    approved_by UUID REFERENCES public.users_2026_02_23_15_15(id),
    created_by UUID REFERENCES public.users_2026_02_23_15_15(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keamanan: Santri violations (Takzir)
CREATE TABLE public.violations_2026_02_23_15_15 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    santri_name TEXT NOT NULL,
    santri_id TEXT,
    violation_type TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('ringan', 'sedang', 'berat')),
    status violation_status DEFAULT 'pending',
    punishment TEXT,
    date_occurred DATE NOT NULL,
    reported_by UUID REFERENCES public.users_2026_02_23_15_15(id),
    resolved_by UUID REFERENCES public.users_2026_02_23_15_15(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kebersihan: Cleaning schedules
CREATE TABLE public.cleaning_schedules_2026_02_23_15_15 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    area TEXT NOT NULL,
    assigned_group TEXT NOT NULL,
    schedule_date DATE NOT NULL,
    shift TEXT CHECK (shift IN ('pagi', 'siang', 'sore')),
    status activity_status DEFAULT 'pending',
    before_photo_url TEXT,
    after_photo_url TEXT,
    notes TEXT,
    checked_by UUID REFERENCES public.users_2026_02_23_15_15(id),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Peralatan: Equipment inventory
CREATE TABLE public.equipment_2026_02_23_15_15 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    serial_number TEXT UNIQUE,
    status equipment_status DEFAULT 'available',
    location TEXT,
    purchase_date DATE,
    purchase_price DECIMAL(12,2),
    condition TEXT CHECK (condition IN ('baik', 'rusak_ringan', 'rusak_berat')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment borrowing records
CREATE TABLE public.equipment_loans_2026_02_23_15_15 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equipment_id UUID REFERENCES public.equipment_2026_02_23_15_15(id),
    borrower_name TEXT NOT NULL,
    borrower_contact TEXT,
    purpose TEXT NOT NULL,
    borrowed_date DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
    condition_before TEXT,
    condition_after TEXT,
    approved_by UUID REFERENCES public.users_2026_02_23_15_15(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments system for Pimpinan feedback
CREATE TABLE public.comments_2026_02_23_15_15 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    comment TEXT NOT NULL,
    author_id UUID REFERENCES public.users_2026_02_23_15_15(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users_2026_02_23_15_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions_2026_02_23_15_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities_2026_02_23_15_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mail_archive_2026_02_23_15_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_minutes_2026_02_23_15_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records_2026_02_23_15_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violations_2026_02_23_15_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_schedules_2026_02_23_15_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_2026_02_23_15_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_loans_2026_02_23_15_15 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments_2026_02_23_15_15 ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_users_role ON public.users_2026_02_23_15_15(role);
CREATE INDEX idx_users_division ON public.users_2026_02_23_15_15(division);
CREATE INDEX idx_activities_division ON public.activities_2026_02_23_15_15(division);
CREATE INDEX idx_activities_status ON public.activities_2026_02_23_15_15(status);
CREATE INDEX idx_financial_type ON public.financial_records_2026_02_23_15_15(type);
CREATE INDEX idx_violations_status ON public.violations_2026_02_23_15_15(status);
CREATE INDEX idx_equipment_status ON public.equipment_2026_02_23_15_15(status);

-- Insert initial divisions
INSERT INTO public.divisions_2026_02_23_15_15 (name, type, description) VALUES
('Divisi Sekretaris', 'sekretaris', 'Mengelola arsip surat dan notulensi rapat'),
('Divisi Bendahara', 'bendahara', 'Mengelola keuangan pesantren'),
('Divisi Keamanan', 'keamanan', 'Mengelola keamanan dan pelanggaran santri'),
('Divisi Kebersihan', 'kebersihan', 'Mengelola jadwal dan pelaksanaan kebersihan'),
('Divisi Peralatan', 'peralatan', 'Mengelola inventaris dan peminjaman peralatan');