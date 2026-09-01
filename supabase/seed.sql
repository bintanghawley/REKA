-- ==============================================================================
-- SEED: supabase/seed.sql
-- Development seed data untuk testing lokal / Supabase CLI
-- ==============================================================================

-- 1. Buat Dummy Test User di auth.users (ID: a0000000-0000-0000-0000-000000000001)
-- Catatan: Password terenkripsi untuk dummy user: 'password123'
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo.warung@example.com',
    '$2a$10$wN/s30wA4.jE9U3kXF8j9ev/05uM38.bK2.H6JcW3M2Y7jQv9t2vS', -- password123
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"nama_usaha":"Warung Maju","jenis_usaha":"Warung Kelontong & Makanan"}',
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;

-- 2. Profil Warung Maju (apabila belum terbuat oleh trigger)
INSERT INTO public.profiles (id, nama_usaha, jenis_usaha)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Warung Maju',
    'Warung Kelontong & Makanan'
) ON CONFLICT (id) DO UPDATE
SET nama_usaha = EXCLUDED.nama_usaha, jenis_usaha = EXCLUDED.jenis_usaha;

-- 3. Produk Dummy
INSERT INTO public.produk (id, user_id, nama, harga_jual, hpp)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Indomie Goreng Telur', 10000.00, 6000.00),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Es Teh Manis', 4000.00, 1500.00),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Kopi Hitam Mantap', 5000.00, 2000.00),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Air Mineral 600ml', 3500.00, 2000.00)
ON CONFLICT (id) DO NOTHING;

-- 4. Transaksi Dummy Harian (Snapshot harga saat transaksi disimpan)
INSERT INTO public.transaksi (id, user_id, produk_id, qty, harga_jual_saat_transaksi, hpp_saat_transaksi, tanggal, jam)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 5, 10000.00, 6000.00, CURRENT_DATE, '08:30:00'),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 8, 4000.00, 1500.00, CURRENT_DATE, '09:15:00'),
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 4, 5000.00, 2000.00, CURRENT_DATE, '10:00:00'),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 6, 3500.00, 2000.00, CURRENT_DATE, '11:45:00')
ON CONFLICT (id) DO NOTHING;

-- 5. Pengeluaran Dadakan Dummy
INSERT INTO public.pengeluaran_dadakan (id, user_id, kategori, nominal, tanggal)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Beli Gas Elpiji 3kg', 22000.00, CURRENT_DATE),
    ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Beli Es Batu Kristal 1 Bal', 10000.00, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;
