# Four Seasons Studio — REST API Specification
### Swagger OpenAPI 3.0 Documentation

Interactive Swagger documentation is served at: **`http://localhost:4000/api/docs`**

All protected endpoints require an `Authorization: Bearer <JWT_TOKEN>` header obtained via the `/api/auth/login` endpoint.

---

## 1. Authentication Module (`/api/auth`)

### `POST /api/auth/login`
Authenticates an administrator or staff member.
- **Request Body**:
  ```json
  {
    "email": "admin@fourseasons.ae",
    "password": "Admin@123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "cly...",
      "name": "Senior Operations Director",
      "email": "admin@fourseasons.ae",
      "role": "admin"
    }
  }
  ```

### `GET /api/auth/me` *(Protected)*
Returns the authenticated user's profile and permissions.

---

## 2. Dynamic Inventory Module (`/api/inventory`)

### `GET /api/inventory/items`
Retrieves inventory items with optional filtering.
- **Query Parameters**:
  - `categoryId`: Filter by category ID.
  - `subcategoryId`: Filter by subcategory ID.
  - `theme`: Filter by theme tag (e.g. `royal_gold`, `mediterranean`, `art_deco`, `minimalist`).
  - `search`: Keyword search in item name, specifications, and tags.
- **Response** (`200 OK`): Array of inventory item objects including media, dimensions, and quantities.

### `GET /api/inventory/items/:id`
Retrieves single item details with media attachments and real dimensions.

### `POST /api/inventory/items` *(Admin Protected)*
Creates a new inventory item with specifications, stock quantity, and base rental price.

### `PUT /api/inventory/items/:id` *(Admin Protected)*
Updates an existing inventory item.

### `DELETE /api/inventory/items/:id` *(Admin Protected)*
Soft deletes or removes an inventory item.

### `GET /api/inventory/categories`
Retrieves all dynamic categories with nested subcategories.

### `POST /api/inventory/categories` *(Admin Protected)*
Creates a new dynamic inventory category.

### `POST /api/inventory/check-availability`
Checks whether items are in stock for a given date range.
- **Request Body**:
  ```json
  {
    "itemIds": ["item_stage_wave", "item_bar_mediterranean"],
    "startDate": "2026-12-15T00:00:00.000Z",
    "endDate": "2026-12-16T23:59:59.000Z"
  }
  ```

---

## 3. AI Creative Generation Module (`/api/ai`)

Generates concept visuals asynchronously to ensure high responsiveness and graceful failure recovery.

### `POST /api/ai/generate`
Submits an AI image or video generation request.
- **Request Body**:
  ```json
  {
    "prompt": "Luxury Arabian Night gala with wave screen and Moorish arches",
    "generationType": "IMAGE",
    "selectedItemIds": ["item_stage_wave", "item_bar_art_deco"],
    "theme": "royal_gold",
    "aspectRatio": "16:9",
    "quality": "HD_4K",
    "additionalNotes": "Incorporate warm candle lighting and floral arrangements"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": "cly_gen_12345",
    "status": "PENDING",
    "message": "AI generation job queued successfully"
  }
  ```

### `GET /api/ai/status/:id`
Polls the execution status of an AI generation job.
- **Status lifecycle**: `PENDING` -> `PROCESSING` -> `COMPLETED` | `FAILED`
- **Completed Response**:
  ```json
  {
    "id": "cly_gen_12345",
    "status": "COMPLETED",
    "outputUrl": "/reference_assets/stage-arabian-nights.jpg",
    "aiProvider": "ModularMockProvider (Preserving Real Inventory Specs)",
    "generationTimeSeconds": 4.2,
    "completedAt": "2026-11-23T22:40:00.000Z"
  }
  ```

### `POST /api/ai/regenerate/:id`
Re-queues a concept generation with modified parameters.

### `GET /api/ai/history` *(Admin Protected)*
Returns paginated AI generation history across all customer sessions.

---

## 4. Dynamic Invitation Module (`/api/invitations`)

### `GET /api/invitations/templates`
Retrieves active luxury invitation templates.

### `POST /api/invitations`
Creates a personalized digital invitation.
- **Request Body**:
  ```json
  {
    "templateId": "tmpl_royal_gold",
    "title": "Wedding of Noor & Tariq",
    "guestName": "Honored Guests",
    "eventName": "Grand Reception & Nikah",
    "eventDate": "2026-12-28T18:00:00.000Z",
    "venue": "Armani Hotel Ballroom, Burj Khalifa, Dubai",
    "customMessage": "We request the honor of your presence.",
    "contactPhone": "+971 50 882 1997",
    "themeColor": "#C8A24B",
    "fontFamily": "Playfair Display"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": "cly_inv_789",
    "shareSlug": "noor-tariq-2026",
    "publicUrl": "http://localhost:3000/invite/noor-tariq-2026"
  }
  ```

### `GET /api/invitations/slug/:slug` *(Public)*
Retrieves public invitation data for rendering on `/invite/[slug]`.

### `POST /api/invitations/:id/rsvp` *(Public)*
Submits guest RSVP response (`ATTENDING`, `DECLINED`, `TENTATIVE`).

---

## 5. Inquiries & Requirements Gathering (`/api/inquiries`)

### `POST /api/inquiries`
Submits customer wedding/event requirements.
- Automatically creates or updates customer record.
- Generates unique reference ID: `FS-REQ-YYYY-XXXX`.
- Automatically triggers Zoho CRM Lead synchronization.
- Dispatches confirmation message via WhatsApp Cloud API.

### `GET /api/inquiries` *(Admin Protected)*
Returns all client RFQs with status filtering (`NEW`, `CONTACTED`, `PROPOSAL_SENT`, `CONFIRMED`, `ARCHIVED`).

### `PUT /api/inquiries/:id/status` *(Admin Protected)*
Updates RFQ status and logs administrative review notes.

---

## 6. Bookings & Double-Booking Prevention (`/api/bookings`)

### `POST /api/bookings` *(Admin Protected)*
Creates a confirmed inventory booking.
- **Critical Safety Engine**: Wraps availability validation and reservation insert in an atomic database transaction (`prisma.$transaction`).
- Rejects reservations if available stock (`totalQuantity - reservedQuantity`) is insufficient for the requested dates.

---

## 7. Integrations & Administration

- `GET /api/zoho/settings` & `PUT /api/zoho/settings`: Configure Zoho CRM OAuth credentials.
- `POST /api/zoho/sync/:inquiryId`: Manually trigger or retry Zoho CRM Lead synchronization.
- `GET /api/whatsapp/settings` & `PUT /api/whatsapp/settings`: Manage WhatsApp Cloud API tokens and Phone Number IDs.
- `POST /api/whatsapp/send-test`: Send test WhatsApp template to verify Meta connectivity.
- `POST /api/whatsapp/webhook`: Meta webhook listener for incoming messages and delivery receipts.
- `GET /api/analytics/overview`: Operational KPIs (Inquiries, Generations, Booking Revenues, Inventory Utilization).
- `GET /api/settings/public`: Public brand configuration (Brand name, phone, currency, VAT).

