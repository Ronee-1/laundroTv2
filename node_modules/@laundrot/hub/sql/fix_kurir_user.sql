-- ============================================
-- Fix Kurir User ID to match Courier record
-- ============================================

-- Update Kurir user to use KUR-003 (matches Courier record at CBG-002)
UPDATE users
SET id_user = 'KUR-003',
    nama = 'Dedi Kurniawan'
WHERE email = 'kurir@laundrot.com';

-- Verify the update
SELECT id_user, nama, email, role, id_cabang
FROM users
WHERE email = 'kurir@laundrot.com';

-- Show Courier records at CBG-002 for reference
SELECT id_kurir, nama_kurir, id_cabang
FROM couriers
WHERE id_cabang = 'CBG-002';
