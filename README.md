<p align="center">
  <img src="public/logo.png" alt="Prepify Logo" width="100" height="100" style="border-radius: 20px;" />
</p>

<h1 align="center">Prepify</h1>

<p align="center">
  <strong>Interactive Quiz & Exam Review Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Users-1000+-brightgreen?style=for-the-badge&logo=users" alt="1000+ Users" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-97.7%25-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 97.7%" />
  <img src="https://img.shields.io/badge/CSS-1.7%25-563D7C?style=flat-square&logo=css3&logoColor=white" alt="CSS 1.7%" />
  <img src="https://img.shields.io/badge/JavaScript-0.6%25-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript 0.6%" />
</p>

---

## Overview

**Prepify** is a modern, interactive quiz and exam review platform designed to help university students prepare for their exams effectively. Trusted by **1,000+ users**, it features a beautiful dark-themed UI with real-time progress tracking, instant answer verification, and comprehensive question banks covering key CS subjects.

The platform is powered by **Supabase** for authentication, real-time data, and a managed PostgreSQL database, with **Prisma 7** as the type-safe ORM layer. It deploys seamlessly on **Vercel** with edge-optimized middleware and serverless API routes.

## Features

### Smart Quiz Interface
- **Multiple Question Types** — MCQ, True/False, Essay, Code, Fill-in-the-blank
- **Instant Verification** — Check your answers with detailed explanations
- **Progress Tracking** — Real-time progress bar and section completion stats
- **Solution Reveal** — Show/hide solutions for individual questions or all at once
- **Auto-Save** — All progress is automatically saved to localStorage
- **Timed Quizzes** — Wall-clock timer with accurate duration tracking

### Subject Coverage
| Subject | Questions | Sections | Total Marks |
|---------|-----------|----------|-------------|
| Cyber Security 2 | 120+ | 10 | 130+ |
| C Programming | 90+ | 7 | 100+ |
| Internet of Things (IoT) | 115+ | 5 | 115+ |
| Technical English 2 | 199 | 5 | 450+ |
| Microsoft Office | 149 | 9 | 175+ |

### Cyber Security 2 — Sections
1. Multiple Choice Questions (MCQs)
2. True or False
3. Essay Questions & Diagrams
4. Tutorial 4 — Wireless LAN Security (MCQ)
5. Tutorial 4 — Wireless LAN Security (True/False)
6. Revision Sheet — Cryptography (MCQ)
7. Revision Sheet — Network Security (MCQ)
8. Revision Sheet — True/False
9. Practice Exam — Diagram & Essay
10. Bonus Questions

### C Programming — Sections
1. Input/Output & Variables
2. Operators & Expressions
3. Conditions (if/else, switch, ternary)
4. Loops (for, while, do-while, break, continue)
5. Arrays (1D & 2D)
6. Strings & General Concepts
7. Functions & Recursion

### Internet of Things (IoT) — Sections
1. Tutorial 1 — Introduction to IoT (MCQ)
2. Tutorial 2 — IoT Architecture & Protocols (MCQ)
3. Tutorial 3 — Sensors & Actuators (True/False + MCQ)
4. Tutorial 4 — IoT Security (MCQ + True/False)
5. Tutorial 5 — IoT Applications (Mixed)

### Technical English 2 — Sections
1. Definitions
2. MCQ — Vocabulary & Terms
3. Arrange Words
4. Translation (English ↔ Arabic)
5. Mixed Revision

### Microsoft Office — Sections
1. Database & MS Access — Definitions
2. MS Access — Objects & Relationships (MCQ)
3. Database Concepts & DBMS (MCQ)
4. True / False — Database & Office
5. Microsoft Word — MCQ
6. Microsoft Excel — MCQ
7. Microsoft PowerPoint — MCQ
8. Office Automation & Mixed Concepts
9. True / False — Word, Excel, PowerPoint

### Analytics Dashboard (Admin)
- **Overview** — Key metrics: total attempts, average score, pass rate, active students
- **Student Analytics** — Individual performance tracking and comparison
- **Subject Analytics** — Subject-wise score distributions and trends
- **Question Types** — Breakdown by MCQ, True/False, Problem-Solving, Coding, Practical
- **Behavior Analysis** — Daily activity patterns, peak hours, time-spent distributions
- **At-Risk Students** — ML-style risk scoring based on performance patterns
- **Readiness Score** — Exam readiness predictions per student
- **Correlations** — Cross-subject performance correlations
- **Findings** — Auto-generated insights and recommendations
- **Data Export** — CSV export of all analytics data

### UI/UX
- **Dark Theme** — Easy on the eyes, optimized for long study sessions
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Draggable Section Navigation** — Swipe/drag to navigate between sections
- **Animated Interactions** — Smooth Framer Motion animations throughout
- **Confetti Celebration** — Celebrate when you complete all questions

### Feedback System
- **Star Rating** — Rate your quiz experience (1–5 stars)
- **Text Feedback** — Submit detailed feedback

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Supabase](https://supabase.com/) | Auth, Realtime, PostgreSQL database |
| [Prisma 7](https://www.prisma.io/) | Type-safe ORM with PostgreSQL adapter |
| [shadcn/ui](https://ui.shadcn.com/) | UI component library |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Recharts](https://recharts.org/) | Data visualization & charts |
| [Lucide React](https://lucide.dev/) | Icon set |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **bun**
- **Supabase account** (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mahmoud-ABDALKREAM/prepify.git
cd prepify

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Generate Prisma client
npx prisma generate

# Push database schema to Supabase
npx prisma db push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
prepify/
├── prisma/
│   └── schema.prisma          # Database schema (PostgreSQL)
├── supabase/
│   └── migrations/             # SQL migration files
├── public/
│   ├── logo.png               # App logo
│   ├── favicon.png            # Favicon
│   └── robots.txt             # SEO robots file
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── admin/             # Analytics dashboard
│   │   ├── leaderboard/       # Leaderboard page
│   │   ├── api/
│   │   │   ├── route.ts       # Health check API
│   │   │   ├── feedback/      # Feedback API
│   │   │   ├── quiz-attempts/ # Quiz attempts API
│   │   │   ├── leaderboard/   # Leaderboard API
│   │   │   └── analytics/     # Analytics APIs (11 endpoints)
│   │   ├── c-programming/     # C Programming quiz page
│   │   ├── cyber-security-2/  # Cyber Security 2 quiz page
│   │   └── iot/               # IoT quiz page
│   ├── components/
│   │   ├── ui/                # Reusable UI components (shadcn/ui)
│   │   ├── admin/             # Admin dashboard tabs (10 components)
│   │   ├── QuizStartPopup.tsx # Quiz start dialog
│   │   ├── QuizTimer.tsx      # Wall-clock quiz timer
│   │   └── PrepifyLoader.tsx  # Loading animation
│   ├── hooks/                 # Custom React hooks
│   └── lib/
│       ├── prisma.ts          # Prisma client (PostgreSQL adapter)
│       ├── supabase.ts        # Supabase browser client
│       ├── supabase-server.ts # Supabase server & admin clients
│       ├── date-utils.ts      # Cairo timezone utilities
│       ├── analytics-utils.ts # Analytics helper functions
│       └── utils.ts           # General utilities
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── prisma.config.ts           # Prisma 7 configuration
├── components.json            # shadcn/ui configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies & scripts
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (browser-safe) | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | Yes |
| `DATABASE_URL` | PostgreSQL connection string (Transaction Pooler) | Yes |
| `DIRECT_URL` | PostgreSQL direct connection string | Yes |
| `ADMIN_SECRET` | Secret key for admin API access | Yes |
| `TZ` | Application timezone (e.g., `Africa/Cairo`) | No |

> **Important**: Never commit your `.env` file. Use `.env.example` as a template. The `.env` file is excluded from version control via `.gitignore`.

---

## Database

Prepify uses **Supabase PostgreSQL** via **Prisma 7** ORM with the `@prisma/adapter-pg` driver adapter. The database stores:

- **QuizAttempt** — Student quiz results with scores, time taken, question types, and subject breakdowns
- **ExamResult** — Exam scores with pass/fail status and grade categories (A–F)
- **Feedback** — User ratings, comments, and submission metadata

### Database Schema

```prisma
model QuizAttempt {
  id              String   @id @default(cuid())
  userId          String
  userName        String
  subject         String
  quizId          String
  score           Float
  correctAnswers  Int
  wrongAnswers    Int
  totalQuestions  Int
  timeTaken       Int      // in seconds
  questionType    String   // multiple-choice, true-false, problem-solving, coding, practical
  attemptDate     DateTime @default(now())
}

model ExamResult {
  id            String   @id @default(cuid())
  userId        String
  userName      String
  subject       String
  examScore     Float    // 0-100
  passFail      String   // pass or fail
  gradeCategory String   // A, B, C, D, F
  examDate      DateTime @default(now())
}

model Feedback {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  rating    Int
  subject   String?
  createdAt DateTime @default(now())
}
```

### Setting Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your Project URL, anon key, and service role key
3. Go to **Settings → Database** and copy the connection string (use Transaction Pooler mode)
4. Add all credentials to your `.env` file
5. Run `npx prisma db push` to create the tables

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api` | Health check with timezone info |
| `POST` | `/api/feedback` | Submit new feedback |
| `GET/POST` | `/api/quiz-attempts` | Get/submit quiz attempts |
| `GET` | `/api/leaderboard` | Get leaderboard data |
| `GET` | `/api/analytics/overview` | Overview metrics |
| `GET` | `/api/analytics/students` | Student analytics |
| `GET` | `/api/analytics/subjects` | Subject analytics |
| `GET` | `/api/analytics/question-types` | Question type breakdown |
| `GET` | `/api/analytics/behavior` | Behavior analysis |
| `GET` | `/api/analytics/at-risk` | At-risk student detection |
| `GET` | `/api/analytics/readiness` | Exam readiness scores |
| `GET` | `/api/analytics/predictions` | Performance predictions |
| `GET` | `/api/analytics/findings` | Auto-generated insights |
| `GET` | `/api/analytics/correlations` | Cross-subject correlations |
| `GET` | `/api/analytics/export` | CSV data export |

---

## Deployment on Vercel

### Steps

1. **Fork or clone** this repository
2. **Connect** your GitHub repo to [Vercel](https://vercel.com)
3. **Add environment variables** in Vercel Dashboard → Settings → Environment Variables:
   - All variables from `.env.example` with your real values
4. **Deploy** — Vercel will auto-detect Next.js and build

### Vercel Configuration Notes

- **Build Command**: `npm run build` (includes `prisma generate`)
- **Output Directory**: `.next` (auto-detected)
- **Node.js Version**: 18+ (set in Vercel settings)
- The app uses `force-dynamic` on all API routes to prevent static rendering issues

---

## Security

- `.env` file is excluded from version control (contains real credentials)
- Supabase Row Level Security (RLS) policies can be enabled on tables
- Service role key is server-only — never exposed to the browser
- Security headers set in middleware (X-Frame-Options, CSP, etc.)
- Input validation on all API endpoints
- Admin endpoints require server-side authentication
- CORS properly configured for API routes

---

## Timezone

All date/time operations use the **Africa/Cairo** timezone (UTC+2/UTC+3 with DST). This is handled by:

- `TZ="Africa/Cairo"` environment variable
- Custom `date-utils.ts` library for consistent Cairo-aware date formatting
- Streak calculations and daily activity tracking use Cairo calendar days

---

## Author & Owner

**Mahmoud ABD ELKream** — Project Creator & Sole Maintainer

- GitHub: [@Mahmoud-ABDALKREAM](https://github.com/Mahmoud-ABDALKREAM)
- Repository: [Mahmoud-ABDALKREAM/prepify](https://github.com/Mahmoud-ABDALKREAM/prepify)

> This project is independently owned and maintained by the author above. All code, design, and content were created solely by the owner. Contributions are currently closed — the project is not accepting external pull requests at this time.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
