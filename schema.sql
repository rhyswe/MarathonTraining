-- Run this in the Supabase SQL editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,

  planned_type text,              -- 'run' or 'other'
  planned_workout_name text,      -- used when planned_type = 'other'
  planned_distance_mi numeric,    -- used when planned_type = 'run'
  planned_duration_min integer,   -- total minutes, both types
  planned_notes text,

  actual_type text,                -- 'run' or 'other'
  actual_workout_name text,
  actual_distance_mi numeric,
  actual_duration_min integer,
  actual_notes text,

  created_at timestamptz default now()
);

-- This app is single-user with no login screen, so Row Level Security
-- is left off and the anon key is trusted to read/write this table.
-- Keep the Supabase project URL/key out of any public repo, and don't
-- share the deployed URL beyond yourself. If you later want a login
-- screen, enable RLS and add policies scoped to auth.uid().
alter table workouts disable row level security;
