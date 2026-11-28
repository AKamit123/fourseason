# Four Seasons / Wedit Platform — Completed Requirements Document

**Last Updated:** 28 November 2026  
**Repository:** `c:\xampp\htdocs\fourseason` (Latest Verified Build: Commit `1dd4009`)  
**Stack:** Next.js 15 (React 19, Tailwind CSS) · NestJS 11 · Prisma ORM · MySQL (`fourseasons_db`)

---

## 1. Completed Core Platform Requirements

### A. Customer Website & Luxury UI/UX
1. **Responsive Customer Website:** Editorial ivory/champagne luxury design across desktop, tablet, and mobile (`frontend/src/app/page.tsx`, `Navbar.tsx`, `HeroSection.tsx`, `Footer.tsx`).
2. **Guest & Registered User Journey:** Guest planning with `localStorage` persistence + dedicated authenticated Client Portal (`/portal`, `POST /api/auth/register`, `POST /api/auth/login`).
3. **Authentication & Account Security:** Registration, login, logout, single-use password reset (`POST /api/auth/forgot-password`, `POST /api/auth/reset-password`), JWT + RBAC (`RolesGuard`).
4. **Event Details Questionnaire:** Multi-step guided Celebration & Corporate planner (`AiPlannerWizard.tsx`, `RequirementFormModal.tsx`) capturing event type, date, Dubai venue, dimensions, guest count, theme, budget, and services.
5. **Packages, Pricing, Inclusions & Exclusions:** Curated packages (*Essential Elegance*, *Signature Grand Atelier*, *The Royal Four Seasons Luxe*) on `/packages` and `PackagesSection.tsx`.
6. **Catalogue Categories, Subcategories & 500+ Component Support:** Full DB schema and server-side paginated/filtered `GET /api/inventory/items` (`InventoryController`, `InventoryService`).
7. **Item Attributes & Customization Studio:** SKU, dimensions, images, variants, colours, `+`/`-` quantity steppers, item selection/removal, and live configuration summary (`InventoryStudio.tsx`, `/studio`).
8. **Predefined Layouts:** Interactive 4-ceremony showcase presets in `HeroSection.tsx` and `/explore/[slug]`.
9. **Bespoke Interactive Invitations & RSVP:** Frosted Acrylic Floral Arch & Royal Stationery suite builder (`/invitations`, `DynamicInvitationBuilder.tsx`, `AcrylicFloralArchCard.tsx`) with 4 visual styles, 3-card suite preview (`Main Invite`, `More Details`, `RSVP Card`), interactive blooming seal reveal (`/invite/[slug]`), and live guest RSVP submission.

### B. Commercial Pricing, PDF & Enquiries
10. **Estimate & Pricing Breakdown:** Unified calculation across Studio, Quote Modal, and PDF (`InventoryStudio.tsx` → `RequirementFormModal.tsx` → `BrandedPlanPdfModal.tsx`) covering items subtotal, Dubai Transport (`AED 2,500`), Installation/Dismantling/Manpower (`12%`, min `AED 3,500`), and `5%` UAE VAT.
11. **Branded A4 PDF Proposal Generation:** Portrait A4 proposal with cover, conceptual visual, swatches, item table, pricing breakdown, and print/download (`BrandedPlanPdfModal.tsx`).
12. **Enquiry Submission & Unique Reference:** Persists to MySQL via `POST /api/inquiries/submit` with unique `FS-REQ-YYYY-XXXX` reference, consent tracking, and lead scoring.
13. **Customer Portal Data Isolation:** `GET /api/auth/my-plans` and `GET /api/bookings/:id` strictly enforce customer email isolation (`ForbiddenException` on cross-user access).

### C. Admin Operations, Inventory & Security
14. **Admin Login & RBAC:** `/admin/login` and `/admin` protected server-side by `AuthGuard('jwt')` + `@Roles('admin', 'manager')`.
15. **Full CRUD Management:** Catalogue, Categories/Subcategories, Inventory, Packages, Invitation Templates, Portfolio Projects (`PortfolioController`), Turnkey Services (`ServicesController`), Enquiries, Lead Pipeline, and System Settings (`SettingsController`).
16. **Transactional Booking & Double-Booking Prevention:** `BookingsService.createBooking` uses `Serializable` Prisma transactions checking blocked dates and overlapping reservations.
17. **Activity Logs, Analytics & Database Backup:** Real MySQL audit trail (`GET /api/analytics/logs`), KPI dashboard (`GET /api/analytics/dashboard`), and Admin JSON backup export (`GET /api/analytics/export-backup`).
18. **API & Upload Security:** Security headers (`X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `X-XSS-Protection`, `x-powered-by` disabled), rate limiting on `/api/auth` & `/api/inquiries`, and magic-byte/MIME/5MB-validated uploads (`POST /api/uploads/image`).
19. **Production Build & Deployment Scripts:** Clean `nest build` and `node build-vercel.js` (`14/14` Next.js routes), plus `DOCUMENTATION.md` and `vercel.json`.

---

## 2. Items Pending External Configuration (Required Before Public Go-Live)

The code for these integrations is structured/wired, but live operation requires production credentials and environment setup:

1. **Email Integration (P0):** Install/configure SMTP or SendGrid/Resend credentials (`nodemailer` / API key) + SPF/DKIM/DMARC DNS, and remove `resetToken` from `POST /api/auth/forgot-password` HTTP responses once live email dispatch is active.
2. **Generative AI Provider (P1):** Currently runs `ModularMockProvider` (smart catalog compositor with `FOUR SEASONS` watermark & `AI Conceptual Visual` badge). Connect live Gemini / OpenRouter / Luma API keys for real multimodal synthesis.
3. **Zoho CRM & Meta WhatsApp Business API (P1):** Real OAuth/CRM v2 (`/Leads/upsert`) and Meta Graph API v19.0 HTTP clients are implemented in `zoho.service.ts` and `whatsapp.service.ts`; requires live client tokens for production sync/messaging.
4. **Production Hosting & Media Storage (P1):** Set `JWT_SECRET`, `NODE_ENV=production`, custom domain CORS in `backend/src/main.ts`, `NEXT_PUBLIC_API_URL` on Vercel, and move `/uploads` to persistent storage (S3/R2/Cloudinary).

---

## 3. Related Project Documentation
- [DOCUMENTATION.md](file:///c:/xampp/htdocs/fourseason/DOCUMENTATION.md) — Architecture, API endpoints, backup/restore, and Vercel rollback runbook.
- [README.md](file:///c:/xampp/htdocs/fourseason/README.md) — Project overview and local setup.
