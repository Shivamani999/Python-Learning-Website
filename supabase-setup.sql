-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create user_progress table
create table if not exists public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  day_number integer not null check (day_number >= 1 and day_number <= 30),
  completed boolean default false,
  completed_at timestamp with time zone,
  last_accessed timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  unique(user_id, day_number)
);

-- Create user_streaks table
create table if not exists public.user_streaks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.user_progress enable row level security;
alter table public.user_streaks enable row level security;

-- Create policies for user_progress
create policy "Users can view their own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.user_progress for delete
  using (auth.uid() = user_id);

-- Create policies for user_streaks
create policy "Users can view their own streaks"
  on public.user_streaks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own streaks"
  on public.user_streaks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own streaks"
  on public.user_streaks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own streaks"
  on public.user_streaks for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists user_progress_user_id_idx on public.user_progress(user_id);
create index if not exists user_progress_day_number_idx on public.user_progress(day_number);
create index if not exists user_streaks_user_id_idx on public.user_streaks(user_id);
