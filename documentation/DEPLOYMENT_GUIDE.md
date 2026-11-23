# Four Seasons Studio — Production Deployment Guide
### Enterprise Runbook & Cloud Operations (Dubai, UAE)

---

## 1. Prerequisites & Production Environment

- **Node.js**: `v20.x` or `v22.x LTS`
- **Database**: MySQL `8.0+` (AWS RDS / GCP Cloud SQL / Host MySQL)
- **Cache & Queue**: Redis `7.x` (AWS ElastiCache / Redis Cloud)
- **Web Server / Reverse Proxy**: NGINX with SSL (Let's Encrypt / DigiCert)
- **Process Manager**: PM2 (`pm2-runtime`) or Docker Containerization

---

## 2. Environment Variables Configuration

### Backend (`/backend/.env`)
```env
# Application & Port
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://fourseasonsstudio.ae

# MySQL Database (Prisma)
DATABASE_URL="mysql://fs_db_user:StrongPassword2026!@localhost:3306/fourseasons_db"

# JWT Secret
JWT_SECRET="fs_dubai_atelier_ultra_secure_jwt_secret_1997_key"
JWT_EXPIRES_IN="7d"

# AI Generation Engine
AI_ACTIVE_PROVIDER="modular_mock" # Options: modular_mock | midjourney | dalle3 | runway
MIDJOURNEY_API_KEY=""
RUNWAY_API_KEY=""
OPENAI_API_KEY=""

# Zoho CRM Cloud OAuth
ZOHO_CLIENT_ID=""
ZOHO_CLIENT_SECRET=""
ZOHO_REFRESH_TOKEN=""
ZOHO_ORG_ID=""
ZOHO_ACCOUNTS_URL="https://accounts.zoho.com"
ZOHO_API_URL="https://www.zohoapis.com/crm/v2"

# Meta WhatsApp Business Cloud API
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_BUSINESS_ACCOUNT_ID=""
WHATSAPP_CLOUD_API_TOKEN=""
WHATSAPP_WEBHOOK_VERIFY_TOKEN="fs_dubai_webhook_secret_verify_2026"
```

### Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://fourseasonsstudio.ae/api
NEXT_PUBLIC_BRAND_NAME="Four Seasons Studio"
NEXT_PUBLIC_WHATSAPP_PHONE="+971508821997"
```

---

## 3. Database Initialization & Migration

```bash
cd /path/to/fourseason/backend

# Generate Prisma Client
npx prisma generate

# Synchronize Schema with Production MySQL
npx prisma db push

# Seed Initial Catalog, Roles, Settings & Inventory
npx ts-node prisma/seed.ts
```

---

## 4. Building & Running with PM2

### Build Backend:
```bash
cd /path/to/fourseason/backend
npm install --production=false
npm run build
```

### Build Frontend:
```bash
cd /path/to/fourseason/frontend
npm install --production=false
npm run build
```

### PM2 Ecosystem Configuration (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [
    {
      name: 'fourseasons-backend',
      cwd: './backend',
      script: 'dist/src/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'fourseasons-frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

Launch with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 5. NGINX Reverse Proxy & SSL Configuration

```nginx
server {
    listen 80;
    server_name fourseasonsstudio.ae www.fourseasonsstudio.ae;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fourseasonsstudio.ae www.fourseasonsstudio.ae;

    ssl_certificate /etc/letsencrypt/live/fourseasonsstudio.ae/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fourseasonsstudio.ae/privkey.pem;

    # Client-Facing Next.js App
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # NestJS REST APIs & Swagger
    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }

    # Static Uploads & Media Assets
    location /uploads/ {
        alias /path/to/fourseason/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location /catalog/ {
        alias /path/to/fourseason/backend/catalog/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 6. Meta WhatsApp & Zoho Webhook Verification

1. **Meta WhatsApp Cloud API Webhook**:
   - URL: `https://fourseasonsstudio.ae/api/whatsapp/webhook`
   - Verify Token: Match `WHATSAPP_WEBHOOK_VERIFY_TOKEN` in `.env`.
   - Subscriptions: `messages`, `message_deliveries`.

2. **Zoho CRM Lead Sync Automation**:
   - Every submitted inquiry automatically attempts lead creation via Zoho CRM REST APIs.
   - Synchronization status and error payloads are logged in the Admin Operations Suite under **Zoho Integration** (`/admin`).

