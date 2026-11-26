# Four Seasons / Wedit Event Planning Platform — Technical & Operations Documentation

## 1. System Architecture & Environments
- **Frontend:** Next.js 15 (App Router, React 19, TypeScript, Tailwind CSS)
- **Backend:** NestJS 11 REST API + Prisma ORM + Swagger (`/api/docs`)
- **Database:** MySQL (25 relational tables managed via `backend/prisma/schema.prisma`)
- **AI Visualization Engine:** Modular provider abstraction (`ModularMockProvider` / Gemini / OpenRouter) with async queue, automatic retry, catalog fallback, guest preview limits, and watermarking.
- **Environments:**
  - **Development:** `backend` (`npm run start:dev`, port `4000`) + `frontend` (`npm run dev`, port `3000`)
  - **Staging / Local Production:** `node build-vercel.js` + `npx next start -p 3000` + `node dist/src/main.js`
  - **Production:** Vercel (`https://fourseason-git-main-web-tech-empower.vercel.app`) with Next.js serverless API fallback (`/api/[...slug]`).

## 2. Database Schema, Backup & Restore
- **Schema Location:** `backend/prisma/schema.prisma`
- **Backup (MySQL CLI):**
  ```bash
  mysqldump -u root fourseasons_db > backup_$(date +%F).sql
  ```
- **Backup (Admin Portal):**
  - Navigate to **Admin → 19. Activity Logs → Download Full DB Backup (JSON)** (`GET /api/analytics/export-backup`, Admin JWT required).
- **Restore (MySQL CLI):**
  ```cmd
  cmd /c "mysql -u root fourseasons_db < database_dump.sql"
  ```

## 3. Authentication, Security & Privacy
- **JWT + RBAC:** Admin routes protected by `AuthGuard('jwt')` + `RolesGuard` (`admin`, `manager`).
- **Client Portal (`/portal`):** Supports Registration (`POST /api/auth/register`), Login (`POST /api/auth/login`), Forgot Password (`POST /api/auth/forgot-password`), Reset Password (`POST /api/auth/reset-password`), and strict data-isolated `GET /api/auth/my-plans`.
- **API Hardening (`backend/src/main.ts`):** Security headers (`X-Content-Type-Options`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`), `x-powered-by` disabled, and sliding-window rate limiting on `/api/auth` and `/api/inquiries`.
- **Secure File Upload (`POST /api/uploads/image`):** Admin/Manager JWT required, 5MB limit, MIME whitelist (`JPEG`, `PNG`, `WEBP`), magic-byte signature verification, UUID filenames.

## 4. Key API Endpoints (Swagger at `/api/docs`)
- `POST /api/auth/login | register | forgot-password | reset-password`
- `GET /api/auth/my-plans` (Customer-isolated plans & bookings)
- `GET/POST/PUT/DELETE /api/inventory/categories` & `/api/inventory/items` (supports pagination for 500+ components)
- `POST /api/ai/generate-image | generate-video | regenerate/:id` & `GET /api/ai/status/:id`
- `POST /api/inquiries/submit` & `GET /api/inquiries`
- `POST /api/bookings` (Transactional double-booking prevention)
- `GET /api/analytics/dashboard | logs | export-backup`
- `POST /api/uploads/image`

## 5. Deployment & Rollback Runbook
1. Run `node build-vercel.js` (cleans `.next` and `route-cache`, installs deps, builds Next.js, mirrors `.next` and `public`).
2. Commit & push to `main`: `git push origin main` — Vercel auto-deploys.
3. **Rollback:** In Vercel Dashboard → Deployments → select previous healthy deployment → **Promote to Production**, or `git revert HEAD && git push origin main`.

