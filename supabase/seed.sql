-- Create user Hamas in auth.users
insert into auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token
)
values (
  'd7b6f63a-867c-4735-97ad-e0d47346dd99',
  'hamas@ridemint.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Hamas"}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  ''
) on conflict (id) do update set raw_user_meta_data = '{"full_name":"Hamas"}';

-- Ensure profile name is Hamas
insert into public.profiles (id, full_name, created_at)
values (
  'd7b6f63a-867c-4735-97ad-e0d47346dd99',
  'Hamas',
  now()
) on conflict (id) do update set full_name = 'Hamas';

-- Seed daily logs
insert into public.daily_logs (id, user_id, date, earnings, fuel_cost, distance_km, notes)
values
  ('a0000000-0000-0000-0000-000000000001', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-02-16', 220, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000002', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-02-17', 860, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000003', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-02-18', 770, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000004', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-02-19', 900, 2000, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000005', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-02-27', 840, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000006', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-02-28', 0, 1900, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000007', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-03-01', 670, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000008', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-03-03', 416, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000009', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-03-04', 320, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-00000000000a', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-03-05', 920, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-00000000000b', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-03-09', 800, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-00000000000c', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-03-12', 0, 2650, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-00000000000d', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-03-16', 400, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-00000000000e', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-04-06', 1110, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-00000000000f', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-04-26', 1000, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000010', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-04-27', 1000, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000011', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-04-28', 350, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000012', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-04-29', 600, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000013', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-04-30', 1050, 4960, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000014', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-05-04', 1370, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000015', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-05-05', 850, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000016', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-05-06', 860, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000017', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-05-08', 700, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000018', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-05-11', 1100, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-000000000019', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-05-12', 500, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-00000000001a', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-05-13', 1000, 0, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-00000000001b', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-06-07', 0, 4400, 0, 'Google Sheets Import'),
  ('a0000000-0000-0000-0000-00000000001c', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-06-15', 550, 0, 0, 'Google Sheets Import')
on conflict (id) do update set earnings = excluded.earnings, fuel_cost = excluded.fuel_cost;

-- Seed detailed expenses
insert into public.expenses (daily_log_id, user_id, category, amount, description)
values
  ('a0000000-0000-0000-0000-000000000004', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Fuel', 2000, 'Fuel expense'),
  ('a0000000-0000-0000-0000-000000000006', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Fuel', 1900, 'Fuel expense'),
  ('a0000000-0000-0000-0000-000000000006', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'InDrive Cost', 370, 'InDrive Cost expense'),
  ('a0000000-0000-0000-0000-000000000007', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Package Cost', 37, 'Package Cost expense'),
  ('a0000000-0000-0000-0000-000000000007', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Package Cost', 17, 'Package Cost expense'),
  ('a0000000-0000-0000-0000-000000000008', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Package Cost', 17, 'Package Cost expense'),
  ('a0000000-0000-0000-0000-000000000009', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Package Cost', 17, 'Package Cost expense'),
  ('a0000000-0000-0000-0000-00000000000a', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Package Cost', 27, 'Package Cost expense'),
  ('a0000000-0000-0000-0000-00000000000c', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Fuel', 2650, 'Fuel expense'),
  ('a0000000-0000-0000-0000-00000000000e', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Package Cost', 20, 'Package Cost expense'),
  ('a0000000-0000-0000-0000-000000000013', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Package Cost', 20, 'Package Cost expense'),
  ('a0000000-0000-0000-0000-000000000013', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'InDrive Cost', 350, 'InDrive Cost expense'),
  ('a0000000-0000-0000-0000-000000000013', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Fuel', 4960, 'Fuel expense'),
  ('a0000000-0000-0000-0000-000000000016', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'InDrive Cost', 350, 'InDrive Cost expense'),
  ('a0000000-0000-0000-0000-000000000018', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Package Cost', 300, 'Package Cost expense'),
  ('a0000000-0000-0000-0000-00000000001b', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Fuel', 4400, 'Fuel expense')
on conflict do nothing;
