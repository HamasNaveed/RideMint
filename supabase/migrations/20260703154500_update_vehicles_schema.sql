-- Make brand and model nullable in vehicles table
alter table public.vehicles alter column brand drop not null;
alter table public.vehicles alter column model drop not null;

-- Add new fields for simple vehicle management: vehicle name, average consumption, and total km driven
alter table public.vehicles add column name text;
alter table public.vehicles add column avg_consumption numeric;
alter table public.vehicles add column total_km integer;
