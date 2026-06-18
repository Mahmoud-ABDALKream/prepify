-- ============================================================
-- 20260618000000_add_questions_table.sql
-- Add Question + Section tables to Supabase for admin-managed
-- exam content (replaces hardcoded TS files for new content).
-- ============================================================

-- ─── Sections table ──────────────────────────────────────────
create table if not exists public."Section" (
  id           bigserial primary key,
  subject      text not null,                      -- 'msoffice' | 'c-programming' | 'iot' | 'cyber-security-2' | 'technical-english-2'
  section_id   integer not null,                   -- original section id within subject
  title        text not null,
  marks        text not null default '',
  icon         text not null default '📝',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (subject, section_id)
);

-- ─── Questions table ─────────────────────────────────────────
create table if not exists public."Question" (
  id              bigserial primary key,
  subject         text not null,                    -- 'msoffice' | 'c-programming' | ...
  section_id      integer not null,                 -- FK-ish to Section.section_id (subject-scoped)
  question_id     integer not null,                 -- original question id within section
  text            text not null,
  marks           text not null default '',
  type            text not null check (type in ('code','trace','fill','mcq','tf','arrange','definition','translation')),

  -- Optional structured fields stored as JSONB (keeps schema flexible)
  code_block      text,
  fill_items      jsonb,                            -- [{label, answer}, ...]
  mcq_options     jsonb,                            -- [{letter, text, isCorrect}, ...]
  arrange_words   jsonb,                            -- ["word1", "word2", ...]
  translation_dir text check (translation_dir in ('en-to-ar','ar-to-en')),

  answer          text not null default '',
  answer_code     text,
  hint            text,

  difficulty      text check (difficulty in ('easy','medium','hard')),
  bloom_taxonomy  text check (bloom_taxonomy in ('remember','understand','apply','analyze','evaluate','create')),

  -- Admin metadata
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      text,

  unique (subject, section_id, question_id)
);

-- ─── Indexes ─────────────────────────────────────────────────
create index if not exists idx_question_subject        on public."Question" (subject);
create index if not exists idx_question_section        on public."Question" (subject, section_id);
create index if not exists idx_question_type           on public."Question" (type);
create index if not exists idx_question_difficulty     on public."Question" (difficulty);
create index if not exists idx_question_published      on public."Question" (is_published);
create index if not exists idx_section_subject         on public."Section" (subject);

-- ─── RLS ─────────────────────────────────────────────────────
-- Public can read published questions/sections (frontend needs to render quizzes).
-- Only service_role can write (admin API uses service role key).
alter table public."Question" enable row level security;
alter table public."Section"  enable row level security;

drop policy if exists "public_read_published_questions" on public."Question";
create policy "public_read_published_questions"
  on public."Question" for select
  using (is_published = true);

drop policy if exists "public_read_sections" on public."Section";
create policy "public_read_sections"
  on public."Section" for select
  using (true);

-- ─── Updated_at trigger ──────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_question_touch on public."Question";
create trigger trg_question_touch
  before update on public."Question"
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_section_touch on public."Section";
create trigger trg_section_touch
  before update on public."Section"
  for each row execute function public.touch_updated_at();
