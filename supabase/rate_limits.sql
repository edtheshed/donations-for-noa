-- Rate limiting table for form submissions.
-- Tracks submission count per IP within a rolling 1-hour window.
-- No RLS policies — only accessible via the service role key (server-side only).

create table rate_limits (
  ip           text        primary key,
  count        int         not null default 1,
  window_start timestamptz not null default now()
);

alter table rate_limits enable row level security;
