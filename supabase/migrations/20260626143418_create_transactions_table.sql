-- 1. Profiles Table (linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Vehicles Table
create table public.vehicles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  brand text not null,
  model text not null,
  year integer,
  fuel_type text,
  mileage integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for vehicles
alter table public.vehicles enable row level security;

-- Vehicles Policies
create policy "Users can perform all actions on their own vehicles" on public.vehicles
  for all using (auth.uid() = user_id);


-- 3. Daily Logs Table
create table public.daily_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  earnings numeric default 0 not null,
  fuel_cost numeric default 0 not null,
  distance_km numeric default 0 not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date)
);

-- Enable RLS for daily_logs
alter table public.daily_logs enable row level security;

-- Daily Logs Policies
create policy "Users can perform all actions on their own daily logs" on public.daily_logs
  for all using (auth.uid() = user_id);


-- 4. Expenses Table
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  daily_log_id uuid references public.daily_logs(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  category text not null,
  amount numeric not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for expenses
alter table public.expenses enable row level security;

-- Expenses Policies
create policy "Users can perform all actions on their own expenses" on public.expenses
  for all using (auth.uid() = user_id);


-- 5. Maintenance Table
create table public.maintenance (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  vehicle_id uuid references public.vehicles(id) on delete cascade not null,
  service_type text not null,
  cost numeric default 0 not null,
  odometer integer,
  service_date date not null,
  next_due_km integer,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for maintenance
alter table public.maintenance enable row level security;

-- Maintenance Policies
create policy "Users can perform all actions on their own maintenance logs" on public.maintenance
  for all using (auth.uid() = user_id);
