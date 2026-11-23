# Four Seasons — AI-Powered Luxury Inventory, Creative Generation & Invitation Management Platform

An enterprise-grade luxury celebration & wedding atelier web platform featuring an asynchronous AI concept generator, dynamic rental inventory studio, digital invitation builder with live WhatsApp dispatch, transactional zero-double-booking engine, and admin operations dashboard.

---

## 🏛️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: NestJS 10, TypeScript, Prisma ORM, REST APIs, Swagger Documentation
- **Database**: MySQL (`fourseasons_db`)
- **Integrations**: WhatsApp Business Cloud API, Zoho CRM OAuth sync, AI Provider Gateway, Modular Mock Visualizer

---

## 🚀 Quick Setup & Database Import

### 1. Database Setup
Create a MySQL database named `fourseasons_db` and import the complete dump:

```bash
# In MySQL terminal or bash:
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS fourseasons_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p fourseasons_db < database_dump.sql
```

The database dump `database_dump.sql` includes:
- Default Super Admin credentials (`admin@fourseasons.com` / `FourSeasons@2026`)
- Authentic luxury rental inventory catalog (7.3m Curved Wave Stage, Moorish Arch Stage, Red Bloom Mandap, Versace Gold Bars, etc.)
- Sample bookings, inquiries, and digital invitation templates
- SEO meta configurations and system settings

### 2. Backend Setup
```bash
cd backend
npm install
# Generate Prisma Client
npx prisma generate
# Start backend server
npm run start:dev
```
Backend runs on: `http://localhost:4000/api`  
Interactive Swagger API Explorer: `http://localhost:4000/api/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

---

## 🌐 Vercel Deployment

### Deploying Frontend to Vercel:
1. Push repository to GitHub (`AKamit123/fourseason`).
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Select the `frontend` folder as the Root Directory.
4. Set Framework Preset: **Next.js**.
5. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed NestJS backend URL (e.g., `https://api.yourdomain.com/api`)
6. Click **Deploy**.

---

## 👑 Features
1. **Atelier Inventory Studio**: High-res catalog exploration with exact engineering dimensions (width, height, modular capacity).
2. **Asynchronous 4K AI Concept Generator**: Visualizes combinations of stages, mandaps, bar counters, and floral palettes with real-time status transitions (`PENDING` -> `PROCESSING` -> `COMPLETED`).
3. **Dynamic Digital Invitation Studio**: Real-time canvas typography rendering, color swatches, dynamic share slugs (`/invite/[slug]`), automated RSVP tracking, and WhatsApp sharing.
4. **AI Concierge Chatbot & WhatsApp**: Instant responses, inventory dimensions lookup, pricing breakdown, and 1-tap WhatsApp handoff.
5. **Admin Operations Suite**: Full CRUD management of Inventory, Bookings, Inquiries, Digital Templates, Services, Portfolio, and live Google SEO previews.

