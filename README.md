# SpeedElite Dating

![Next.js](https://img.shields.io/badge/Next.js-13+-black)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

A modern, scalable event-based dating platform built with Next.js, focused on performance, localization, and admin control.

## Overview

SpeedElite is an exclusive event-based dating platform designed to provide a premium and secure environment for participants to meet. It features a robust internationalization system, a comprehensive admin dashboard, and a seamless application flow.

## Live Demo

Coming soon...

## Features

- **Multi-language Support (i18n)**: Fully localized experience in English (en), Croatian (hr), and Hindi (hi).
- **Admin Panel**: Secure management interface accessible via `/[locale]/admin` for tracking events, bookings, and customers.
- **Application Forms**: Tailored application flows for Gentlemen and Ladies with multi-step validation.
- **Member Dashboard**: User-specific view for managing upcoming events and profile details.
- **Premium UI/UX**: Dark-themed, glassmorphism-inspired design with smooth animations.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / Vanilla CSS
- **Animations**: Framer Motion
- **Localization**: `next-intl`
- **Database**: MongoDB (Mongoose)

## Folder Structure

```text
├── app/
│   ├── [locale]/             # Internationalized routes
│   │   ├── admin/           # Admin panel routes
│   │   ├── apply/           # Application flow
│   │   └── dashboard/       # User dashboard
│   └── api/                 # Backend API endpoints
├── components/              # Shared UI components
├── i18n/                    # Localization configuration
├── messages/                # Translation JSON files (en, hr, hi)
├── models/                  # Mongoose schemas
├── middleware.ts            # Auth and i18n middleware
└── next.config.js           # Next.js configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB instance

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (see below).
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
SESSION_COOKIE_NAME=speedelite_session
# Add other necessary keys here
```

## Routing Information

The project uses locale-prefixed routing for all main sections:

- **Admin Login**: `/en/admin/login`, `/hi/admin/login`
- **Application**: `/en/apply`, `/hi/apply`
- **Dashboard**: `/en/dashboard`, `/hi/dashboard`

## Recent Fixes / Updates

- **Admin Routing Fix**: Resolved 404 errors on the admin login route by standardizing the `[locale]` structure.
- **i18n Implementation**: Refined `next-intl` middleware and routing to support dynamic locale prefixes.
- **Cleanup**: Removed duplicate route folders to ensure consistent routing behavior.
- **Translation Restore**: Fixed several `MISSING_MESSAGE` errors by adding missing keys to translation files.

## Future Improvements

- [ ] Automated video interview integration for candidate selection.
- [ ] Real-time booking notifications and reminders.
- [ ] Expanded analytics for event performance tracking.
- [ ] Enhanced profile customization and matching algorithms.

## Maintainer

Developed by SpeedElite Team

---
*SpeedElite – Redefining the elite dating experience.*
