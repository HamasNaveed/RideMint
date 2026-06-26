-- Create a dummy driver user in auth.users
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
  'driver@ridemint.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Driver"}',
  now(),
  now(),
  'authenticated',
  'authenticated',
  ''
) on conflict (id) do nothing;

-- Ensure profile exists (trigger should handle it, but this acts as safety)
insert into public.profiles (id, full_name, created_at)
values (
  'd7b6f63a-867c-4735-97ad-e0d47346dd99',
  'Test Driver',
  now()
) on conflict (id) do nothing;

-- Seed daily logs (grouped by date from CSV)
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
  ('a0000000-0000-0000-0000-000000000009', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', '2026-03-04', 320, 0, 0, 'Google Sheets Import')
on conflict (id) do nothing;

-- Seed detailed expenses
insert into public.expenses (daily_log_id, user_id, category, amount, description)
values
  ('a0000000-0000-0000-0000-000000000004', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Fuel', 2000, 'Fuel expense'),
  ('a0000000-0000-0000-0000-000000000006', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Fuel', 1900, 'Fuel expense'),
  ('a0000000-0000-0000-0000-000000000006', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'InDrive Cost', 370, 'InDrive Cost commission'),
  ('a0000000-0000-0000-0000-000000000007', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Package Cost', 37, 'Package Cost'),
  ('a0000000-0000-0000-0000-000000000007', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Package Cost', 17, 'Package Cost'),
  ('a0000000-0000-0000-0000-000000000008', 'd7b6f63a-867c-4735-97ad-e0d47346dd99', 'Package Cost', 17, 'Package Cost')
on conflict (id) do nothing;
