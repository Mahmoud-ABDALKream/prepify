# Prepify Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-06-13
### Changed
- Remove unused heavy dependencies (sharp, next-auth, next-intl, etc.)
- Robust build scripts optimized for space-z.ai deployment
- Clean dependency tree for faster builds

## [1.9.0] - 2026-06-12
### Changed
- Robust build/start scripts for space-z.ai deployment
- Ensure DB directory exists before operations
- Graceful error handling in start script

## [1.8.0] - 2026-06-12
### Fixed
- Remove fs/path imports from prisma.ts (caused Turbopack NFT tracing failure)
- Fix all analytics API endpoints
- Add comprehensive seed data (200 quiz attempts, 60 exam results, 8 feedback entries)

## [1.7.2] - 2026-06-12
### Fixed
- Additional stability fixes for API routes
- Ensure consistent behavior across all endpoints

## [1.7.1] - 2026-06-12
### Fixed
- Resolve 500 errors on all API routes
- Production mode for dev script
- Force-dynamic on all routes

## [1.7.0] - 2026-06-12
### Fixed
- Add force-dynamic export to all API routes
- Fix 500 Internal Server Errors on analytics endpoints

## [1.6.0] - 2026-06-12
### Fixed
- Auto-create DB at startup
- Fix path resolution for SQLite database
- Resolve 500 error on initial deployment

## [1.5.0] - 2026-06-12
### Changed
- Commit .env with safe defaults for deployment
- Update .gitignore for production readiness

## [1.4.1] - 2026-06-12
### Changed
- Update package-lock.json for dependency consistency

## [1.4.0] - 2026-06-12
### Fixed
- Prisma generate in build script
- Relative DB path for deployment compatibility
- General deployment cleanup

## [1.3.0] - [1.3.8] - 2026-06-12
### Added
- UI improvements and feature enhancements (9 incremental batches)
- Enhanced user experience across quiz and exam interfaces
- Improved responsive design and accessibility

## [1.2.0] - 2026-06-12
### Added
- Google Analytics integration (G-PW6LPKQF8R)
- Improved metadata description for SEO

## [1.1.0] - [1.1.3] - 2026-06-12
### Changed
- v1.1.0: Protect admin API with secret key, hide admin from public access
- v1.1.1: Update README, remove admin references, add 1000+ users badge
- v1.1.2: Add language badges and .gitattributes for correct GitHub detection
- v1.1.3: Improve README, update language badges to match GitHub stats

## [1.0.1] - 2026-06-12
### Changed
- Update README with correct GitHub username

## [1.0.0] - 2026-06-12
### Added
- Initial release of Prepify — Interactive Quiz & Exam Review Platform
- Quiz system with multiple question types
- Exam review functionality
- Leaderboard system
- Analytics dashboard
- Feedback system

## [2.8.1] - 2026-06-13
### Changed
- Add Dependabot config for weekly npm dependency updates
- Add Dependabot config for monthly GitHub Actions updates

## [2.8.0] - 2026-06-13
### Security
- Add security middleware with X-Frame-Options, X-Content-Type-Options, Referrer-Policy headers
- Add Permissions-Policy to restrict camera, microphone, and geolocation access
- Add X-XSS-Protection header

## [2.7.1] - 2026-06-13
### Added
- Loading spinner component for smoother page transitions

## [2.7.0] - 2026-06-13
### Performance
- Use Promise.all for parallel database queries in analytics overview
- Add totalFeedback and totalExams to overview response

## [2.6.1] - 2026-06-13
### Added
- Error boundary with animated UI and retry button

## [2.6.0] - 2026-06-13
### Added
- Custom animated 404 page with gradient styling and back-to-home link

## [2.5.1] - 2026-06-13
### SEO
- Add robots.txt with sitemap reference
- Disallow /admin and /api/ from search engine indexing

## [2.5.0] - 2026-06-13
### Accessibility
- Add skip-to-content link for keyboard navigation
- Improve screen reader support

## [2.4.1] - 2026-06-13
### Style
- Custom dark scrollbar for WebKit and Firefox
- Smooth scroll behavior for anchor navigation

## [2.4.0] - 2026-06-13
### Documentation
- Expand .env.example with AI, analytics, and app configuration sections
- Document all environment variables

## [2.3.1] - 2026-06-13
### Fixed
- Auto-seed database on first-time setup in dev.sh

## [2.3.0] - 2026-06-13
### Performance
- Add compound indexes (userId+subject, subject+attemptDate) for faster analytics
- Add indexes on Feedback.rating, Feedback.createdAt, ExamResult.passFail, ExamResult.gradeCategory

## [2.2.1] - 2026-06-13
### SEO
- Enhanced metadata with OpenGraph tags
- Structured title template for sub-pages
- Add keywords, authors, and metadataBase

## [2.2.0] - 2026-06-13
### Added
- Graceful Prisma shutdown on process exit
- Improved connection handling

## [2.1.1] - 2026-06-13
### Security
- Remove X-Powered-By header for enhanced security

## [2.1.0] - 2026-06-13
### Added
- Version info and timestamp in API health endpoint
- Add force-dynamic to root API route
