-- Run this in your Supabase SQL editor to set up the project.

-- Donations table
create table donations (
  id         uuid        default gen_random_uuid() primary key,
  name       text        not null,
  donated_at date        not null,
  location   varchar     not null,
  message    text,
  photo_url  text,
  created_at timestamptz default now()
);

-- Explicit grants (required for Data API access from May 2026 onwards)
grant select, insert on public.donations to anon;

-- Row Level Security
alter table donations enable row level security;

create policy "Public read"   on donations for select to anon using (true);
create policy "Public insert" on donations for insert to anon with check (true);

-- Storage bucket for donation photos (public)
insert into storage.buckets (id, name, public)
values ('donation-photos', 'donation-photos', true);

create policy "Public upload" on storage.objects
  for insert to anon
  with check (bucket_id = 'donation-photos');

create policy "Public read photos" on storage.objects
  for select to anon
  using (bucket_id = 'donation-photos');
