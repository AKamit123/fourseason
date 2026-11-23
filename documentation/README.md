# Four Seasons Studio — AI-Powered Creative, Inventory & Invitation Management Platform
### Enterprise Architecture & Operational Documentation (Dubai, UAE — Est. 1997)

---

## 1. Executive Summary

**Four Seasons Studio** (brand reference: `fourseason`) is an enterprise-grade luxury wedding and event atelier platform engineered for the high-end GCC events industry.

The platform bridges real physical event inventories with generative AI workflows, allowing luxury wedding planners, clients, and internal production designers to:
1. **Explore authentic inventory** with exact real-world dimensions (stages, Moorish arches, Versace bars, baroque mirrors, photobooths, jhoolas).
2. **Dynamically combine elements** and invoke an asynchronous AI concept generation pipeline for 4K visual renders and cinematic concept videos.
3. **Build dynamic luxury digital invitations** with live typography, palette styling, shareable web links, and automated WhatsApp guest RSVP tracking.
4. **Enforce real-time inventory reservation integrity** with atomic database transactions preventing conflicting reservations or double-booking.
5. **Orchestrate enterprise CRM & messaging** via two-way Zoho CRM Lead sync and WhatsApp Business Cloud API automated confirmations.
6. **Operate a 19-module unified Admin Operations Suite** spanning inventory, availability, bookings, AI generations, analytics, templates, and integration logs.

---

## 2. Technology Stack & Architectural Decoupling

The platform follows a strictly decoupled client-server architecture:

```
                                   +------------------------------------+
                                   |       Client Browser / Admin       |
                                   |     (Desktop, Tablet, Mobile)      |
                                   +-----------------+------------------+
                                                     |
                                   HTTP / REST (JSON)| Static Media
                                                     v
+------------------------------------+             +------------------------------------+
|        Next.js 15 Frontend         |             |          NestJS 10 Backend         |
|  - React 19, TypeScript            |             |  - Modular TypeScript Architecture |
|  - Tailwind CSS Luxury Theme       |             |  - JWT + Role-based RBAC Guards    |
|  - Framer Motion UI Animations     |             |  - Swagger OpenAPI Documentation   |
|  - Dynamic Canvas Previews         |             |  - Async AI Provider Pipeline      |
|  Port: 3000                        |             |  Port: 4000                        |
+------------------------------------+             +-----------------+------------------+
                                                                     |
                                                                     | Prisma ORM (25 Models)
                                                                     v
                                                   +------------------------------------+
                                                   |       MySQL Database (Port 3306)   |
                                                   |       fourseasons_db               |
                                                   +-----------------+------------------+
                                                                     |
                                            +------------------------+------------------------+
                                            |                                                 |
                                            v                                                 v
                             +-----------------------------+                   +-----------------------------+
                             |       Zoho CRM Cloud        |                   |   WhatsApp Business Cloud   |
                             |  - OAuth 2.0 Lead Creation  |                   |  - Template Dispatch        |
                             |  - Contact & Inquiry Sync   |                   |  - Webhook Ingestion & Logs |
                             +-----------------------------+                   +-----------------------------+
```

### Stack Breakdown:
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, NestJS 10, TypeScript, Passport JWT, class-validator, Swagger UI.
- **Database & ORM**: MySQL 8+ (`fourseasons_db`), Prisma ORM 5 with 25 normalized tables, relational integrity, cascade constraints, and indexed lookups.
- **AI Engine**: Pluggable asynchronous generation pipeline (`ModularMockProvider`, `MidjourneyProvider`, `RunwayGen2Provider`, `OpenAiDalle3Provider`).
- **External Integrations**: Zoho CRM v2 REST API (OAuth token rotation) & WhatsApp Cloud API (Graph v18.0).

---

## 3. Directory Layout

```
c:/xampp/htdocs/fourseason/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Complete 25-table normalized schema
│   │   └── seed.ts              # Authentic 4S catalog seeding with real dimensions
│   ├── src/
│   │   ├── ai/                  # AI generation engine & providers
│   │   ├── analytics/           # KPI metrics, utilization & conversion rates
│   │   ├── auth/                # JWT auth, bcrypt passwords & roles
│   │   ├── bookings/            # Transactional double-booking prevention engine
│   │   ├── inquiries/           # Customer requirement gathering (FS-REQ-YYYY-XXXX)
│   │   ├── inventory/           # Dynamic categories, subcategories & items
│   │   ├── invitations/         # Dynamic invitation templates & RSVPs
│   │   ├── prisma/              # PrismaService database abstraction
│   │   ├── settings/            # System & brand settings
│   │   ├── whatsapp/            # WhatsApp Cloud API & webhook processor
│   │   ├── zoho/                # Zoho CRM OAuth & lead synchronizer
│   │   ├── app.module.ts        # Root module definition
│   │   └── main.ts              # NestJS entrypoint & Swagger bootstrapping
│   ├── uploads/                 # Static media uploads
│   ├── catalog/                 # 15 exact client-uploaded catalog spec sheets
│   └── reference_assets/        # 43 extracted luxury reference venue images
│
├── frontend/
│   ├── public/
│   │   ├── catalog/             # Public access to catalog spec sheets
│   │   └── reference_assets/    # Public luxury reference photography
│   └── src/
│       ├── app/
│       │   ├── admin/
│       │   │   ├── login/       # Admin secure portal login
│       │   │   └── page.tsx     # 19-module enterprise administration suite
│       │   ├── invite/[slug]/   # Dynamic public invitation & RSVP page
│       │   ├── layout.tsx       # Root layout with luxury typography
│       │   └── page.tsx         # Customer portal homepage
│       ├── components/
│       │   ├── AiGenerationModal.tsx    # Async AI generation modal (4K & Video)
│       │   ├── AiPlannerWizard.tsx      # 7-Step AI wedding concierge wizard
│       │   ├── DynamicInvitationBuilder.tsx # Live invitation canvas & customization
│       │   ├── Footer.tsx               # Luxury footer with WhatsApp concierge
│       │   ├── HeroSection.tsx          # Dubai wedding hero with infinite marquee
│       │   ├── InventoryStudio.tsx      # Catalog explorer & combination builder
│       │   ├── Navbar.tsx               # Navigation bar & action triggers
│       │   ├── PackagesSection.tsx      # Curated luxury packages with breakdown
│       │   ├── PortfolioSection.tsx     # Filterable past Dubai weddings portfolio
│       │   ├── RequirementFormModal.tsx # Structured RFQ requirement modal
│       │   └── ServicesSection.tsx      # Turnkey event services
│       └── lib/
│           └── api.ts           # Centralized typed API client
│
└── documentation/
    ├── README.md                # System overview and quick start (this file)
    ├── API_SPECIFICATION.md     # Full REST API endpoints & Swagger documentation
    └── DATABASE_SCHEMA.md       # Prisma models and entity relationships
```

---

## 4. Default Credentials & Ports

| Component | Port | URL / Endpoint | Credentials |
|:---|:---|:---|:---|
| **Frontend Web App** | 3000 | `http://localhost:3000` | Public Access |
| **Admin Operations Suite** | 3000 | `http://localhost:3000/admin` | `admin@fourseasons.ae` / `Admin@123` |
| **Manager Portal** | 3000 | `http://localhost:3000/admin` | `manager@fourseasons.ae` / `Manager@123` |
| **Backend REST API** | 4000 | `http://localhost:4000/api` | JWT Bearer Authentication |
| **Swagger OpenAPI Docs** | 4000 | `http://localhost:4000/api/docs` | Public API Explorer |
| **MySQL Database** | 3306 | `localhost:3306/fourseasons_db` | User: `root`, Password: `` |

