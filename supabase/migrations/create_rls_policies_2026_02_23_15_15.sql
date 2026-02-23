-- RISALAH RLS Policies for RBAC System
-- Created: 2026-02-23 15:15 UTC

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

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.users_2026_02_23_15_15 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user division
CREATE OR REPLACE FUNCTION get_user_division()
RETURNS division_type AS $$
BEGIN
  RETURN (
    SELECT division 
    FROM public.users_2026_02_23_15_15 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users table policies
CREATE POLICY "Users can view all profiles" ON public.users_2026_02_23_15_15
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON public.users_2026_02_23_15_15
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admin can manage all users" ON public.users_2026_02_23_15_15
  FOR ALL USING (get_user_role() = 'super_admin');

-- Divisions table policies
CREATE POLICY "All authenticated users can view divisions" ON public.divisions_2026_02_23_15_15
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Top management can manage divisions" ON public.divisions_2026_02_23_15_15
  FOR ALL USING (get_user_role() IN ('super_admin', 'top_management'));

-- Activities table policies
CREATE POLICY "Super admin can view all activities" ON public.activities_2026_02_23_15_15
  FOR SELECT USING (get_user_role() = 'super_admin');

CREATE POLICY "Top management can manage all activities" ON public.activities_2026_02_23_15_15
  FOR ALL USING (get_user_role() = 'top_management');

CREATE POLICY "Divisional admin can manage own division activities" ON public.activities_2026_02_23_15_15
  FOR ALL USING (
    get_user_role() = 'divisional_admin' AND 
    division = get_user_division()
  );

CREATE POLICY "Users can view own assigned activities" ON public.activities_2026_02_23_15_15
  FOR SELECT USING (assigned_to = auth.uid() OR created_by = auth.uid());

-- Mail archive policies (Sekretaris division)
CREATE POLICY "Super admin can view all mail" ON public.mail_archive_2026_02_23_15_15
  FOR SELECT USING (get_user_role() = 'super_admin');

CREATE POLICY "Top management can manage all mail" ON public.mail_archive_2026_02_23_15_15
  FOR ALL USING (get_user_role() = 'top_management');

CREATE POLICY "Sekretaris division can manage mail" ON public.mail_archive_2026_02_23_15_15
  FOR ALL USING (
    get_user_role() = 'divisional_admin' AND 
    get_user_division() = 'sekretaris'
  );

-- Meeting minutes policies
CREATE POLICY "Super admin can view all meetings" ON public.meeting_minutes_2026_02_23_15_15
  FOR SELECT USING (get_user_role() = 'super_admin');

CREATE POLICY "Top management can manage meetings" ON public.meeting_minutes_2026_02_23_15_15
  FOR ALL USING (get_user_role() = 'top_management');

CREATE POLICY "Sekretaris can manage meetings" ON public.meeting_minutes_2026_02_23_15_15
  FOR ALL USING (
    get_user_role() = 'divisional_admin' AND 
    get_user_division() = 'sekretaris'
  );

-- Financial records policies (Bendahara division)
CREATE POLICY "Super admin can view all financial records" ON public.financial_records_2026_02_23_15_15
  FOR SELECT USING (get_user_role() = 'super_admin');

CREATE POLICY "Top management can manage financial records" ON public.financial_records_2026_02_23_15_15
  FOR ALL USING (get_user_role() = 'top_management');

CREATE POLICY "Bendahara can manage financial records" ON public.financial_records_2026_02_23_15_15
  FOR ALL USING (
    get_user_role() = 'divisional_admin' AND 
    get_user_division() = 'bendahara'
  );

-- Violations policies (Keamanan division)
CREATE POLICY "Super admin can view all violations" ON public.violations_2026_02_23_15_15
  FOR SELECT USING (get_user_role() = 'super_admin');

CREATE POLICY "Top management can manage violations" ON public.violations_2026_02_23_15_15
  FOR ALL USING (get_user_role() = 'top_management');

CREATE POLICY "Keamanan can manage violations" ON public.violations_2026_02_23_15_15
  FOR ALL USING (
    get_user_role() = 'divisional_admin' AND 
    get_user_division() = 'keamanan'
  );

-- Cleaning schedules policies (Kebersihan division)
CREATE POLICY "Super admin can view all cleaning schedules" ON public.cleaning_schedules_2026_02_23_15_15
  FOR SELECT USING (get_user_role() = 'super_admin');

CREATE POLICY "Top management can manage cleaning schedules" ON public.cleaning_schedules_2026_02_23_15_15
  FOR ALL USING (get_user_role() = 'top_management');

CREATE POLICY "Kebersihan can manage cleaning schedules" ON public.cleaning_schedules_2026_02_23_15_15
  FOR ALL USING (
    get_user_role() = 'divisional_admin' AND 
    get_user_division() = 'kebersihan'
  );

-- Equipment policies (Peralatan division)
CREATE POLICY "Super admin can view all equipment" ON public.equipment_2026_02_23_15_15
  FOR SELECT USING (get_user_role() = 'super_admin');

CREATE POLICY "Top management can manage equipment" ON public.equipment_2026_02_23_15_15
  FOR ALL USING (get_user_role() = 'top_management');

CREATE POLICY "Peralatan can manage equipment" ON public.equipment_2026_02_23_15_15
  FOR ALL USING (
    get_user_role() = 'divisional_admin' AND 
    get_user_division() = 'peralatan'
  );

CREATE POLICY "All users can view available equipment" ON public.equipment_2026_02_23_15_15
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    status = 'available'
  );

-- Equipment loans policies
CREATE POLICY "Super admin can view all loans" ON public.equipment_loans_2026_02_23_15_15
  FOR SELECT USING (get_user_role() = 'super_admin');

CREATE POLICY "Top management can manage loans" ON public.equipment_loans_2026_02_23_15_15
  FOR ALL USING (get_user_role() = 'top_management');

CREATE POLICY "Peralatan can manage loans" ON public.equipment_loans_2026_02_23_15_15
  FOR ALL USING (
    get_user_role() = 'divisional_admin' AND 
    get_user_division() = 'peralatan'
  );

-- Comments policies (for Pimpinan feedback)
CREATE POLICY "All users can view comments" ON public.comments_2026_02_23_15_15
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Super admin and top management can add comments" ON public.comments_2026_02_23_15_15
  FOR INSERT WITH CHECK (
    get_user_role() IN ('super_admin', 'top_management')
  );

CREATE POLICY "Users can update own comments" ON public.comments_2026_02_23_15_15
  FOR UPDATE USING (author_id = auth.uid());

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_2026_02_23_15_15 (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();