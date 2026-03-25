# SpeedElite Dating: Technical Blueprint & Developer Guide

![Next.js](https://img.shields.io/badge/Next.js-15+-black)
![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

A professional, event-driven dating platform built with Next.js 15, designed for high-end matchmaking experiences with full localization and comprehensive admin control.

---

## 1. Deep Project Overview

**SpeedElite Dating** is not just a dating app; it is a high-end **Event Management System** specialized for exclusive matchmaking. The platform bridges the gap between digital discovery and real-world interaction through a curated application process.

### The Business Logic
The system revolves around three core pillars:
1.  **Selectivity**: Unlike open-access apps, every participant is vetted. Users don't just "join"; they **apply**.
2.  **Structured Events**: Events consist of two phases:
    *   **Initial Introduction**: 3-minute rotations where men meet every woman.
    *   **SpeedElite Date**: 15-minute deeper conversations triggered by mutual interest.
3.  **Incentive Equilibrium**:
    *   **Gentlemen** pay a premium to access a pre-filtered pool of high-quality candidates.
    *   **Ladies** are incentivized with gift vouchers (ZARA, DM, etc.) and free/discounted participation to ensure a balanced and high-quality turnout.

---

## 2. Complete User Flows (Detailed)

### 🤵 Gentleman Flow
1.  **Discovery**: Gentleman views upcoming events via `/[locale]`.
2.  **Selection**: Clicks "Apply as a Gentleman".
3.  **Multi-Step Application**:
    *   **Step 1**: Selects a specific event and views the male-specific price.
    *   **Step 2 (The Form)**: Enters Personal Details (Name, Email, Mobile, DOB, Residence), Professional Background (Education, Occupation), Physical Traits (Height), and Lifestyle (Smoker, Exercise, Interests).
    *   **Step 3 (Payment)**: Enter card details for the registration fee. Payment is simulated in dev but uses the `bookingPaymentSchema` for validation.
    *   **Step 4 (Verification)**: Selects a 3-minute slot for a mandatory video interview.
4.  **Booking Creation**: On payment success, a `Booking` record is created with a unique `BK-XXXX` number. Status is `paid` but profile remains `pending` in the admin eye.

### 💃 Lady Flow
1.  **Discovery**: Lady views the landing page with feminine-curated benefits (Voucher highlights).
2.  **Selection**: Clicks "Apply as a Lady".
3.  **Multi-Step Application**:
    *   **Step 1**: Selects event. Price is typically €0 or heavily discounted.
    *   **Step 2 (The Form)**: Same detailed form as gentlemen, but with an emphasis on interests and photos.
    *   **Step 3 (Voucher Check)**: Submits application. If the event is free, the payment step acts as a confirmation screen.
    *   **Step 4 (Video Interview)**: Mandatory for all new applicants to ensure profile authenticity.
4.  **Incentives**: Upon successful participation, the system tracks "SpeedElite Dates" (mutual matches) which translates to additional €20 vouchers.

---

## 3. Full Application lifecycle (Step-by-Step)

1.  **Entrance**: User visits `/en` or `/hr`.
2.  **Zustand Initialization**: `useBookingStore` (Zustand + Persistence) initializes the session.
3.  **Event Data Fetch**: `BookingFlow` fetches published events from `/api/events`.
4.  **Form Composition**: User fills `BookingFormData`. `react-hook-form` + `Zod` handle real-time validation.
5.  **Image Upload**: `facePhoto` and `bodyPhoto` are uploaded to `/api/upload`, which saves them to `public/uploads/bookings/`.
6.  **Backend Submission**: On final step, a single `POST` to `/api/bookings` sends the entire payload (Form + Image URLs + Payment Summary).
7.  **Admin Sync**: The Admin Dashboard (`/admin`) immediately reflects the new booking via a Recharts-powered analytics update.
8.  **Management**: Admin reviews the booking, views photos, and prepares for the video interview.

---

## 4. Admin Panel Deep Explanation

The Admin Panel is a secure, authenticated environment located at `/[locale]/admin`.

### Sub-Modules
-   **Dashboard (Analytics)**:
    -   Uses `Recharts` for "Bookings Over Time" (Line Chart) and "Revenue by Event" (Bar Chart).
    -   Fetched via `/api/dashboard/overview`.
-   **Customers**:
    -   A searchable list of all `User` records.
    -   Filterable by role (Gent/Lady) and subscription status.
-   **Bookings**:
    -   The core operational module. Displays every application.
    -   Shows full profile previews, questionnaire answers, and uploaded photos.
-   **Events**:
    -   CRUD interface for event management.
    -   Supports multi-language fields (Title, Location, Description) for `en` and `hr`.

---

## 5. System Architecture (Technical Mapping)

### Frontend Architecture
-   **Framework**: Next.js 15 (App Router).
-   **Routing**: Locale-prefixed segments `[locale]` using `next-intl`.
-   **State Management**: `Zustand` with `persist` middleware. This is critical for the application flow as it allows users to refresh the page without losing their 4-step progress.
-   **Layouts**: Nested layouts for `/admin` vs `/apply` to keep the shell concerns separate.

### Backend Architecture
-   **API Design**: RESTful routes in `/app/api/`.
-   **DB Connection**: Cached Mongoose connection in `lib/mongodb.ts` to prevent "Too many connections" during HMR.
-   **Validation**: `Zod` schemas are shared between frontend forms and backend routes to ensure data integrity.

### Data Flow Diagram
```text
[User Client] 
      │ 
      ▼ 
[Zustand Store] (Form State) ────► [Local Storage] (Persistence)
      │
      ▼
[API: /api/upload] ──────────────► [File System: /uploads/bookings]
      │
      ▼
[API: /api/bookings] (POST) ─────► [MongoDB: Booking & User Models]
      │
      ▼
[Admin Dashboard] (GET) ─────────► [Recharts Visualization]
```

---

## 6. Database Design (Mongoose)

### **User Model** (`models/User.ts`)
Stores the master record for every person who has ever applied.
- `email`: Unique identifier.
- `role`: `admin` or `customer`.
- `gender`: `lady` or `gent`.
- `preferences`: Detailed object containing `occupation`, `education`, `height`, etc.

### **Booking Model** (`models/Booking.ts`)
Stores a specific application for a specific event. Includes a **snapshot** of user data to preserve "Point-in-time" info.
- `bookingNumber`: `BK-XXXXX`.
- `user`: Reference → `User`.
- `event`: Reference → `Event`.
- `amountPaid`: Decimal.
- `images`: `{ facePhoto: string, bodyPhoto: string }`.

### **Event Model** (`models/Event.ts`)
- `priceMale` / `priceFemale`: Tailored pricing.
- `translations`: Object containing `en` and `hr` overrides for title/desc.

---

## 7. API Routes Documentation

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/admin/login` | `POST` | Authenticates admin and sets `admin_session` cookie. |
| `/api/bookings` | `GET` | Paginated, searchable list of all bookings for admin. |
| `/api/bookings` | `POST` | The "Big Submission" - creates User and Booking records. |
| `/api/events` | `GET` | Fetches available events (filtered by status and search). |
| `/api/dashboard/overview`| `GET` | Aggregated stats (Total Bookings, Monthly Revenue, etc.). |
| `/api/upload` | `POST` | Accepts `multipart/form-data`, returns URL for images. |

---

## 8. Form System Breakdown

The application form uses a **hybrid validation** strategy:
1.  **Frontend**: `react-hook-form` uses the `bookingFormSchema` via `zodResolver`. This provides instant feedback (e.g., "Email is required").
2.  **Backend**: The `POST /api/bookings` route re-validates the entire payload using the same schema. If validation fails here, it returns a 400 error.

### Photo Upload Logic
Photos are not sent as Base64. Instead:
- User selects file -> `POST /api/upload`.
- Server saves file to disk -> Returns `/uploads/bookings/filename.jpg`.
- Frontend stores this URL in the Zustand `uploads` state.
- Final submission only sends the string URLs.

---

## 9. Authentication & Middleware

### Middleware (`middleware.ts`)
Uses `next-intl` middleware and custom logic:
-   **Locale Detection**: Redirects `/` to `/en` or `/hr` based on browser headers.
-   **Admin Protection**: 
    -   Intercepts requests to `/(en|hr)/admin/*`.
    -   Checks for the `admin_session` cookie.
    -   Verifies the JWT token using `verifySessionTokenEdge`.
    -   Redirects to `/[locale]/admin/login` if invalid.

---

## 10. Localization (i18n)

-   **Message Files**: Located in `/messages/{locale}.json`.
-   **Key Structure**:
    -   `landing`: All text for the homepage.
    -   `apply`: All text for the application form steps and validation messages.
    -   `admin`: All text for the dashboard and event management.
-   **Routing**: Custom `Link`, `useRouter`, and `usePathname` from `@/i18n/routing` ensure the locale is always preserved in the URL (e.g., clicking "Apply" on `/hr` takes you to `/hr/apply`).

---

## 11. Setup & Environment

### Environment Variables
| Variable | Required | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | Yes | MongoDB Atlas or Local connection string. |
| `AUTH_SECRET` | Yes | High-entropy string used for JWT signing. |
| `ADMIN_EMAIL` | No | Overrides default admin login (default: `admin@speedelite.com`). |
| `ADMIN_PASSWORD` | No | Overrides default admin password (default: `Admin@123`). |

---

## 12. "Rebuild From Scratch" Guide

Follow these steps to recreate the core of SpeedElite Dating:

### Step 1: Foundation
Initialize Next.js with the App Router and TypeScript. Install core dependencies:
`npm i next-intl zustand framer-motion mongoose zod react-hook-form @hookform/resolvers/zod recharts`.

### Step 2: Internationalization
Setup `i18n/routing.ts` and `middleware.ts`. Wrap your `RootLayout` with `NextIntlClientProvider`.

### Step 3: Database & Models
Configure `lib/mongodb.ts`. Define your `User`, `Event`, and `Booking` schemas in the `/models` folder.

### Step 4: Multi-Step Store
Create a Zustand store in `lib/stores/bookingStore.ts`. Use the `persist` middleware so user progress survives page refreshes.

### Step 5: The Application Form
Build a 4-page structure in `app/[locale]/apply/`.
- `select-event`: Fetch published events.
- `form`: Detailed questionnaire with Zod validation.
- `payment`: Simulated payment screen and final API submission.
- `verification`: Success and follow-up (video interview schedule).

### Step 6: Admin Dashboard
Build the `/admin` shell. Use `GlassCard` and `StatCard` components. Map your API data to `Recharts` for the analytics overview.

---

## 13. Recent Fixes

-   **Admin Routing Solution**: Fixed 404 errors by consolidating routes into the `[locale]` segment and updating middleware regex.
-   **i18n Integrity**: Restored multiple missing translation keys (overview, booking, tbd) that were causing dashboard crashes.
-   **Store Persistence**: Fixed an issue where photo previews were lost on refresh by sanitizing the Zustand state before saving.

---

## 14. Performance & Future

-   **Deployment**: Optimized for Vercel with Edge-compatible auth verification.
-   **Performance**: Use of Server Components for high-traffic landing pages.
-   **Roadmap**: 
    -   [ ] **Real-time Chat**: Connect matches instantly after the event.
    -   [ ] **Automated Interviews**: Integrate Daily.co or Zoom for verification calls.
    -   [ ] **Referral System**: Auto-vouchers for bringing new members.

---
**Developed by SpeedElite Team**
*Redefining elite matchmaking.*
