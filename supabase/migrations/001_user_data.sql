-- Create the user_data table for storing user preferences
create table if not exists public.user_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value jsonb not null default 'null',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, key)
);

-- Enable RLS
alter table public.user_data enable row level security;

-- Users can only read their own data
create policy "Users can read their own data"
  on public.user_data for select
  using (auth.role() = 'authenticated' and user_id = auth.uid());

-- Users can insert their own data
create policy "Users can insert their own data"
  on public.user_data for insert
  with check (auth.role() = 'authenticated' and user_id = auth.uid());

-- Users can update their own data
create policy "Users can update their own data"
  on public.user_data for update
  using (auth.role() = 'authenticated' and user_id = auth.uid());

-- Users can delete their own data
create policy "Users can delete their own data"
  on public.user_data for delete
  using (auth.role() = 'authenticated' and user_id = auth.uid());

-- Allow anonymous users (anon role)
create policy "Allow anonymous users to read their data"
  on public.user_data for select
  using (auth.role() = 'anon' and user_id = auth.uid());

create policy "Allow anonymous users to insert their data"
  on public.user_data for insert
  with check (auth.role() = 'anon' and user_id = auth.uid());

create policy "Allow anonymous users to update their data"
  on public.user_data for update
  using (auth.role() = 'anon' and user_id = auth.uid());

create policy "Allow anonymous users to delete their data"
  on public.user_data for delete
  using (auth.role() = 'anon' and user_id = auth.uid());