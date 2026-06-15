-- ═══════════════════════════════════════════════════════════
-- Prepify — QuestionResponse Table Migration
-- Run this SQL in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ─── QuestionResponse Table ────────────────────────────
CREATE TABLE IF NOT EXISTS "QuestionResponse" (
  "id"            TEXT    NOT NULL  DEFAULT gen_random_uuid()::text,
  "attemptId"     TEXT    NOT NULL,
  "userId"        TEXT    NOT NULL,
  "userName"      TEXT    NOT NULL,
  "subject"       TEXT    NOT NULL,
  "questionId"    INTEGER NOT NULL,
  "questionType"  TEXT    NOT NULL  DEFAULT 'mcq',
  "sectionTitle"  TEXT    NOT NULL  DEFAULT '',
  "isCorrect"     BOOLEAN NOT NULL,
  "userAnswer"    TEXT,
  "correctAnswer" TEXT,
  "timeTaken"     INTEGER NOT NULL  DEFAULT 0,
  "difficulty"    TEXT    NOT NULL  DEFAULT 'medium',
  "bloomTaxonomy" TEXT    NOT NULL  DEFAULT 'remember',
  "responseDate"  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "QuestionResponse_pkey" PRIMARY KEY ("id")
);

-- QuestionResponse Indexes
CREATE INDEX IF NOT EXISTS "QuestionResponse_attemptId_idx"       ON "QuestionResponse" ("attemptId");
CREATE INDEX IF NOT EXISTS "QuestionResponse_userId_idx"         ON "QuestionResponse" ("userId");
CREATE INDEX IF NOT EXISTS "QuestionResponse_subject_idx"        ON "QuestionResponse" ("subject");
CREATE INDEX IF NOT EXISTS "QuestionResponse_questionId_idx"     ON "QuestionResponse" ("questionId");
CREATE INDEX IF NOT EXISTS "QuestionResponse_isCorrect_idx"      ON "QuestionResponse" ("isCorrect");
CREATE INDEX IF NOT EXISTS "QuestionResponse_difficulty_idx"     ON "QuestionResponse" ("difficulty");
CREATE INDEX IF NOT EXISTS "QuestionResponse_bloomTaxonomy_idx"  ON "QuestionResponse" ("bloomTaxonomy");
CREATE INDEX IF NOT EXISTS "QuestionResponse_questionType_idx"   ON "QuestionResponse" ("questionType");
CREATE INDEX IF NOT EXISTS "QuestionResponse_subject_questionId_idx"       ON "QuestionResponse" ("subject", "questionId");
CREATE INDEX IF NOT EXISTS "QuestionResponse_subject_isCorrect_idx"        ON "QuestionResponse" ("subject", "isCorrect");
CREATE INDEX IF NOT EXISTS "QuestionResponse_subject_bloomTaxonomy_idx"    ON "QuestionResponse" ("subject", "bloomTaxonomy");
CREATE INDEX IF NOT EXISTS "QuestionResponse_difficulty_isCorrect_idx"     ON "QuestionResponse" ("difficulty", "isCorrect");
CREATE INDEX IF NOT EXISTS "QuestionResponse_bloomTaxonomy_isCorrect_idx"  ON "QuestionResponse" ("bloomTaxonomy", "isCorrect");

-- ─── Enable Row Level Security ─────────────────────────
ALTER TABLE "QuestionResponse" ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies (public read/write for app) ──────────
CREATE POLICY "Allow public insert on QuestionResponse" ON "QuestionResponse" FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on QuestionResponse"   ON "QuestionResponse" FOR SELECT USING (true);
