-- RISALAH Sample Data for Testing
-- Created: 2026-02-23 15:15 UTC

-- Insert sample financial records
INSERT INTO public.financial_records_2026_02_23_15_15 (type, category, description, amount, date) VALUES
('income', 'Iuran Santri', 'Iuran bulanan santri Januari 2026', 15000000.00, '2026-01-15'),
('income', 'Donasi', 'Donasi dari alumni untuk pembangunan', 5000000.00, '2026-01-20'),
('expense', 'Operasional', 'Pembelian bahan makanan bulanan', 8000000.00, '2026-01-25'),
('expense', 'Perawatan', 'Perbaikan atap asrama', 2500000.00, '2026-01-30'),
('income', 'Iuran Santri', 'Iuran bulanan santri Februari 2026', 15500000.00, '2026-02-15'),
('expense', 'Operasional', 'Listrik dan air bulan Februari', 1200000.00, '2026-02-20');

-- Insert sample violations
INSERT INTO public.violations_2026_02_23_15_15 (santri_name, santri_id, violation_type, description, severity, status, date_occurred) VALUES
('Ahmad Fauzi', 'SNT001', 'Terlambat Sholat', 'Terlambat sholat subuh berjamaah', 'ringan', 'completed', '2026-02-15'),
('Muhammad Rizki', 'SNT002', 'Keluar Tanpa Izin', 'Keluar pesantren tanpa izin ustadz', 'sedang', 'pending', '2026-02-18'),
('Abdul Rahman', 'SNT003', 'Tidak Mengikuti Kajian', 'Tidak mengikuti kajian malam', 'ringan', 'completed', '2026-02-20'),
('Umar Faruq', 'SNT004', 'Berkelahi', 'Berkelahi dengan santri lain', 'berat', 'pending', '2026-02-22');

-- Insert sample cleaning schedules
INSERT INTO public.cleaning_schedules_2026_02_23_15_15 (area, assigned_group, schedule_date, shift, status) VALUES
('Masjid', 'Kelompok A', '2026-02-23', 'pagi', 'completed'),
('Asrama Putra', 'Kelompok B', '2026-02-23', 'siang', 'in_progress'),
('Dapur', 'Kelompok C', '2026-02-23', 'sore', 'pending'),
('Halaman Depan', 'Kelompok A', '2026-02-24', 'pagi', 'pending'),
('Perpustakaan', 'Kelompok D', '2026-02-24', 'siang', 'pending');

-- Insert sample equipment
INSERT INTO public.equipment_2026_02_23_15_15 (name, category, description, serial_number, status, location, condition) VALUES
('Proyektor Epson', 'Elektronik', 'Proyektor untuk presentasi', 'PROJ001', 'available', 'Ruang Multimedia', 'baik'),
('Laptop Asus', 'Elektronik', 'Laptop untuk administrasi', 'LAP001', 'borrowed', 'Kantor Sekretaris', 'baik'),
('Sound System', 'Audio', 'Sound system untuk acara', 'SND001', 'available', 'Aula', 'baik'),
('Kamera Canon', 'Elektronik', 'Kamera untuk dokumentasi', 'CAM001', 'maintenance', 'Ruang Media', 'rusak_ringan'),
('Meja Lipat', 'Furniture', 'Meja lipat untuk acara', 'MJA001', 'available', 'Gudang', 'baik'),
('Kursi Plastik', 'Furniture', 'Kursi plastik (set 50 buah)', 'KRS001', 'available', 'Gudang', 'baik');

-- Insert sample equipment loans
INSERT INTO public.equipment_loans_2026_02_23_15_15 (equipment_id, borrower_name, borrower_contact, purpose, borrowed_date, expected_return_date, status) VALUES
((SELECT id FROM public.equipment_2026_02_23_15_15 WHERE name = 'Laptop Asus'), 'Ustadz Ahmad', '081234567890', 'Presentasi kajian mingguan', '2026-02-20', '2026-02-25', 'active'),
((SELECT id FROM public.equipment_2026_02_23_15_15 WHERE name = 'Proyektor Epson'), 'Santri Koordinator', '081987654321', 'Acara maulid nabi', '2026-02-18', '2026-02-19', 'returned');

-- Insert sample mail archive
INSERT INTO public.mail_archive_2026_02_23_15_15 (type, subject, sender, recipient, content, date_received) VALUES
('incoming', 'Undangan Rapat Koordinasi Pesantren Se-Jawa Timur', 'Asosiasi Pesantren Jatim', 'Pimpinan Pesantren', 'Mengundang untuk menghadiri rapat koordinasi...', '2026-02-15'),
('incoming', 'Proposal Bantuan Pembangunan', 'Kementerian Agama', 'Bendahara Pesantren', 'Proposal bantuan untuk pembangunan fasilitas...', '2026-02-18'),
('outgoing', 'Laporan Kegiatan Bulanan', 'Sekretaris Pesantren', 'Yayasan Al-Jawahir', 'Laporan kegiatan pesantren bulan Januari 2026...', '2026-02-01');

-- Insert sample meeting minutes
INSERT INTO public.meeting_minutes_2026_02_23_15_15 (title, date, attendees, agenda, decisions, action_items) VALUES
('Rapat Evaluasi Bulanan Januari 2026', '2026-02-01', ARRAY['Pimpinan Pesantren', 'Ketua Organisasi', 'Sekretaris', 'Bendahara', 'Kepala Divisi'], 'Evaluasi kegiatan bulan Januari dan perencanaan Februari', 'Meningkatkan kedisiplinan santri, perbaikan fasilitas asrama', 'Divisi Keamanan membuat program kedisiplinan, Divisi Peralatan survey kebutuhan perbaikan'),
('Rapat Persiapan Acara Maulid Nabi', '2026-02-10', ARRAY['Ketua Organisasi', 'Sekretaris', 'Bendahara', 'Koordinator Acara'], 'Persiapan acara maulid nabi 1448 H', 'Acara dilaksanakan tanggal 25 Februari 2026', 'Sekretaris menyiapkan undangan, Bendahara menyiapkan anggaran, Peralatan menyiapkan sound system');

-- Insert sample activities
INSERT INTO public.activities_2026_02_23_15_15 (title, description, division, status, due_date, progress) VALUES
('Arsip Surat Masuk Februari', 'Mengarsipkan semua surat masuk bulan Februari 2026', 'sekretaris', 'in_progress', '2026-02-28', 75),
('Laporan Keuangan Bulanan', 'Menyusun laporan keuangan bulan Februari 2026', 'bendahara', 'pending', '2026-03-05', 0),
('Patroli Keamanan Malam', 'Patroli keamanan area pesantren setiap malam', 'keamanan', 'in_progress', '2026-02-28', 90),
('Jadwal Piket Kebersihan Maret', 'Menyusun jadwal piket kebersihan untuk bulan Maret', 'kebersihan', 'pending', '2026-02-25', 25),
('Inventarisasi Peralatan', 'Melakukan inventarisasi ulang semua peralatan pesantren', 'peralatan', 'in_progress', '2026-03-01', 60);

-- Update equipment status for borrowed items
UPDATE public.equipment_2026_02_23_15_15 
SET status = 'borrowed' 
WHERE name = 'Laptop Asus';

UPDATE public.equipment_loans_2026_02_23_15_15 
SET actual_return_date = '2026-02-19', status = 'returned'
WHERE borrower_name = 'Santri Koordinator';