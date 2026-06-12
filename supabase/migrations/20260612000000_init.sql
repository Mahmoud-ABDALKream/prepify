-- ═══════════════════════════════════════════════════════════
-- Prepify — Supabase PostgreSQL Migration
-- Project: tuufrecpcbhxppofudxx
-- ═══════════════════════════════════════════════════════════

-- ─── Feedback Table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Feedback" (
  "id"        TEXT    NOT NULL  DEFAULT gen_random_uuid()::text,
  "name"      TEXT    NOT NULL,
  "email"     TEXT    NOT NULL,
  "message"   TEXT    NOT NULL,
  "rating"    INTEGER NOT NULL,
  "subject"   TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- Feedback Indexes
CREATE INDEX IF NOT EXISTS "Feedback_rating_idx"       ON "Feedback" ("rating");
CREATE INDEX IF NOT EXISTS "Feedback_createdAt_idx"    ON "Feedback" ("createdAt");

-- ─── QuizAttempt Table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS "QuizAttempt" (
  "id"              TEXT    NOT NULL  DEFAULT gen_random_uuid()::text,
  "userId"          TEXT    NOT NULL,
  "userName"        TEXT    NOT NULL,
  "subject"         TEXT    NOT NULL,
  "quizId"          TEXT    NOT NULL,
  "score"           DOUBLE PRECISION NOT NULL,
  "correctAnswers"  INTEGER NOT NULL,
  "wrongAnswers"    INTEGER NOT NULL,
  "totalQuestions"  INTEGER NOT NULL,
  "timeTaken"       INTEGER NOT NULL  DEFAULT 0,
  "questionType"    TEXT    NOT NULL  DEFAULT 'multiple-choice',
  "attemptDate"     TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- QuizAttempt Indexes
CREATE INDEX IF NOT EXISTS "QuizAttempt_userId_idx"              ON "QuizAttempt" ("userId");
CREATE INDEX IF NOT EXISTS "QuizAttempt_subject_idx"             ON "QuizAttempt" ("subject");
CREATE INDEX IF NOT EXISTS "QuizAttempt_quizId_idx"              ON "QuizAttempt" ("quizId");
CREATE INDEX IF NOT EXISTS "QuizAttempt_score_idx"               ON "QuizAttempt" ("score");
CREATE INDEX IF NOT EXISTS "QuizAttempt_questionType_idx"        ON "QuizAttempt" ("questionType");
CREATE INDEX IF NOT EXISTS "QuizAttempt_attemptDate_idx"         ON "QuizAttempt" ("attemptDate");
CREATE INDEX IF NOT EXISTS "QuizAttempt_userId_subject_idx"      ON "QuizAttempt" ("userId", "subject");
CREATE INDEX IF NOT EXISTS "QuizAttempt_subject_attemptDate_idx" ON "QuizAttempt" ("subject", "attemptDate");

-- ─── ExamResult Table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS "ExamResult" (
  "id"            TEXT    NOT NULL  DEFAULT gen_random_uuid()::text,
  "userId"        TEXT    NOT NULL,
  "userName"      TEXT    NOT NULL,
  "subject"       TEXT    NOT NULL,
  "examScore"     DOUBLE PRECISION NOT NULL,
  "passFail"      TEXT    NOT NULL  DEFAULT 'pass',
  "gradeCategory" TEXT    NOT NULL  DEFAULT 'C',
  "examDate"      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "ExamResult_pkey" PRIMARY KEY ("id")
);

-- ExamResult Indexes
CREATE INDEX IF NOT EXISTS "ExamResult_userId_idx"         ON "ExamResult" ("userId");
CREATE INDEX IF NOT EXISTS "ExamResult_subject_idx"        ON "ExamResult" ("subject");
CREATE INDEX IF NOT EXISTS "ExamResult_passFail_idx"       ON "ExamResult" ("passFail");
CREATE INDEX IF NOT EXISTS "ExamResult_gradeCategory_idx"  ON "ExamResult" ("gradeCategory");
CREATE INDEX IF NOT EXISTS "ExamResult_examDate_idx"       ON "ExamResult" ("examDate");
CREATE INDEX IF NOT EXISTS "ExamResult_userId_subject_idx" ON "ExamResult" ("userId", "subject");

-- ─── Enable Row Level Security ─────────────────────────
ALTER TABLE "Feedback"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuizAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExamResult"  ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies (public read/write for app) ──────────
-- These allow the service_role key (used by Prisma) full access.
-- For anon key access, restrict as needed.

CREATE POLICY "Allow public insert on Feedback"     ON "Feedback"    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on Feedback"       ON "Feedback"    FOR SELECT USING (true);
CREATE POLICY "Allow public insert on QuizAttempt"  ON "QuizAttempt" FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on QuizAttempt"    ON "QuizAttempt" FOR SELECT USING (true);
CREATE POLICY "Allow public insert on ExamResult"   ON "ExamResult"  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on ExamResult"     ON "ExamResult"  FOR SELECT USING (true);
