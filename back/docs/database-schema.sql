-- PostgreSQL example schema for future database migration.
-- The current backend uses JSON file storage through the repository layer.
-- When the database is ready, replace patientRecords.repository.js with a DB-backed implementation.

create table if not exists patient_records (
  id uuid primary key,
  patient_name text,
  hn text,
  an text,
  ward text,
  procedure text,
  form jsonb not null,
  checks jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_patient_records_updated_at
  on patient_records (updated_at desc);

create index if not exists idx_patient_records_patient_name
  on patient_records (patient_name);

create index if not exists idx_patient_records_hn
  on patient_records (hn);

create index if not exists idx_patient_records_an
  on patient_records (an);
