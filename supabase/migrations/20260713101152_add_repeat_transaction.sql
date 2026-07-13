alter table public.business_activity
  add column repeat_frequency text not null default 'none',
  add column series_id uuid null,
  add column confirmed boolean not null default true;

alter table public.business_activity
  add constraint business_activity_repeat_frequency_check
  check (repeat_frequency in ('none', 'monthly', 'annually'));

create index if not exists business_activity_series_id_idx
  on public.business_activity (series_id);

-- prevents duplicate generation if the app is open in multiple tabs/devices.
-- Not partial: NULL series_id values are never equal to each other under
-- standard uniqueness semantics, so non-recurring rows never conflict here
-- regardless of date. A partial index would also break PostgREST's
-- ON CONFLICT (series_id, date) target inference for the upsert below.
create unique index if not exists business_activity_series_date_uniq
  on public.business_activity (series_id, date);
