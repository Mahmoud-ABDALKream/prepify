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
