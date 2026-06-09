<p align="center">
  <img src="public/logo.png" alt="Prepify Logo" width="100" height="100" style="border-radius: 20px;" />
</p>

<h1 align="center">Prepify</h1>

<p align="center">
  <strong>Interactive Quiz & Exam Review Platform</strong><br/>
  Built with ❤️ by <strong>Mahmoud ABD ELKream</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-SQLite-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Users-1000+-brightgreen?style=for-the-badge&logo=users" alt="1000+ Users" />
</p>

---

## Overview

**Prepify** is a modern, interactive quiz and exam review platform designed to help university students prepare for their exams effectively. Trusted by **1,000+ users**, it features a beautiful dark-themed UI with real-time progress tracking, instant answer verification, and comprehensive question banks covering key CS subjects.

## Features

### Smart Quiz Interface
- **Multiple Question Types** — MCQ, True/False, Essay, Code, Fill-in-the-blank
- **Instant Verification** — Check your answers with detailed explanations
- **Progress Tracking** — Real-time progress bar and section completion stats
- **Solution Reveal** — Show/hide solutions for individual questions or all at once
- **Auto-Save** — All progress is automatically saved to localStorage

### Subject Coverage
| Subject | Questions | Sections | Total Marks |
|---------|-----------|----------|-------------|
| Cyber Security 2 | 120+ | 10 | 130+ |
| C Programming | 90+ | 7 | 100+ |

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
| [Prisma](https://www.prisma.io/) | Database ORM (SQLite) |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [shadcn/ui](https://ui.shadcn.com/) | UI component library |
| [Lucide React](https://lucide.dev/) | Icon set |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/Mahmoud-ABDALKream/prepify.git
cd prepify

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Set up the database
npx prisma generate
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
│   └── schema.prisma          # Database schema (Feedback model)
├── public/
│   ├── logo.png               # App logo
│   ├── favicon.png            # Favicon
│   └── robots.txt             # SEO robots file
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── api/
│   │   │   ├── route.ts       # Health check API
│   │   │   └── feedback/      # Feedback API
│   │   │       └── route.ts
│   │   ├── c-programming/     # C Programming quiz page
│   │   │   └── page.tsx
│   │   └── cyber-security-2/  # Cyber Security 2 quiz page
│   │       └── page.tsx
│   ├── components/ui/         # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utility functions & Prisma client
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── components.json            # shadcn/ui configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies & scripts
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./db/custom.db` |

> **Important**: Never commit your `.env` file. Use `.env.example` as a template.

---

## Database

Prepify uses **SQLite** via Prisma ORM for the feedback system. The database stores:

- **Feedback** — User ratings, comments, and submission metadata

The database file (`db/custom.db`) is excluded from version control for security. It will be automatically created when you run `npx prisma db push`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api` | Health check |
| `POST` | `/api/feedback` | Submit new feedback |

---

## Security

- `.env` files are excluded from version control
- Database files are excluded from version control
- Upload directories are excluded from version control
- Input validation on all API endpoints
- Sensitive endpoints require server-side authentication
- No deletion endpoint for feedback data

---

## Author

**Mahmoud ABD ELKream**

- Designed, developed, and maintained with passion

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <strong>Mahmoud ABD ELKream</strong>
</p>
