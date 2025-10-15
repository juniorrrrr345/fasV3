-- Migration des catégories de FAS vers fasv3-db
INSERT OR REPLACE INTO categories (id, name, description, icon, color, created_at, updated_at) VALUES
('31', 'Weed 🥗', '', '🏷️', '#3B82F6', '2025-08-31 23:43:51', '2025-08-31 23:43:51'),
('32', 'Hash 🍫', '', '🏷️', '#3B82F6', '2025-08-31 23:43:51', '2025-08-31 23:43:51'),
('33', 'Pharmacie 💊', '', '🏷️', '#3B82F6', '2025-08-31 23:43:51', '2025-08-31 23:43:51'),
('34', 'Edibles 🍬', '', '🏷️', '#3B82F6', '2025-08-31 23:43:51', '2025-08-31 23:43:51');

-- Migration des farms de FAS vers fasv3-db
INSERT OR REPLACE INTO farms (id, name, description, created_at, updated_at) VALUES
('32', 'MOUSSEUX PREMIUM 🧽', '', '2025-08-31 23:43:51', '2025-08-31 23:43:51'),
('34', 'COCAÏNE PURE ❄️', '', '2025-08-31 23:43:51', '2025-08-31 23:43:51'),
('36', 'KÉTAMINE 🦄', '', '2025-08-31 23:43:52', '2025-08-31 23:43:52'),
('50', 'CALI PLATE 🇺🇸', '', '2025-10-11 18:12:06', '2025-10-11 18:12:06'),
('51', 'SPAIN 🇪🇸 9/10⭐️', '', '2025-10-11 18:13:34', '2025-10-11 18:13:34'),
('52', 'DRY 🇲🇦 9/10 ⭐️', '', '2025-10-11 18:14:43', '2025-10-11 18:14:43');