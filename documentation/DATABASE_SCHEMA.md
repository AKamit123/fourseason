# Four Seasons Studio — Database Architecture & Schema Reference
### MySQL Database (`fourseasons_db`) — Prisma ORM 5.x

---

## 1. Relational Entity Overview

The schema is normalized to 3NF standards across 25 dedicated tables.

```
+--------------------------------------------------------------------------------------------------+
|                                        DATA MODELS                                               |
+--------------------------------------------------------------------------------------------------+
| 1.  User                     - System staff (Admins, Managers, Designers) with bcrypt passwords  |
| 2.  Role                     - RBAC roles (admin, manager, designer, customer)                  |
| 3.  Permission               - Granular system permissions                                       |
| 4.  Customer                 - Client directory with company, VAT, and contact records           |
| 5.  Inquiry                  - Requirements & RFQ submissions (FS-REQ-YYYY-XXXX)                |
| 6.  Requirement              - Detailed event specifications linked to inquiries                 |
| 7.  InventoryCategory        - Dynamic root item categories                                      |
| 8.  InventorySubcategory     - Dynamic subcategories                                             |
| 9.  InventoryItem            - Physical rental assets with dimensions, stock & pricing           |
| 10. InventoryMedia           - High-resolution photography, 3D assets & spec sheet diagrams      |
| 11. InventoryAvailability   - Blocked dates, maintenance locks, reserved slots                  |
| 12. Booking                  - Confirmed client reservations with transactional locks            |
| 13. BookingItem              - Quantity & rental rate line items per booking                     |
| 14. AiGeneration             - Generation jobs with asynchronous status tracking                 |
| 15. AiGenerationItem         - Inventory items referenced in an AI concept                       |
| 16. AiGenerationHistory      - Versioned prompt iterations and regenerated variants              |
| 17. InvitationTemplate       - Dynamic invitation layouts with editable SVG/HTML blocks          |
| 18. Invitation               - Client digital invitations with dynamic slug URL                  |
| 19. InvitationRsvp           - Real-time guest RSVP tracking (attending, headcount, dietary)     |
| 20. Service                  - Turnkey event production services                                 |
| 21. PortfolioProject         - Case studies and real wedding portfolios                          |
| 22. ZohoIntegration          - Zoho CRM OAuth credentials, refresh tokens & lead sync rules      |
| 23. WhatsAppIntegration      - Meta Business API keys, phone number ID & webhook configs         |
| 24. CommunicationLog         - Inbound/outbound email, WhatsApp, and webhook audit trails        |
| 25. SystemSetting            - Dynamic operational settings (currency, tax, contact, branding)   |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Key Table Definitions & Constraints

### 2.1 Double-Booking Prevention & Concurrency Model
The `Booking` and `BookingItem` models link directly to `InventoryItem`.
When a booking is confirmed:
1. `prisma.$transaction` queries all active bookings spanning `startDate` through `endDate`.
2. Sum of reserved quantities across concurrent bookings is verified against `InventoryItem.totalQuantity`.
3. If `(totalQuantity - reservedSum) < requestedQuantity`, the transaction aborts with a descriptive conflict message.
4. If available, the reservation is committed and an `InventoryAvailability` block is recorded.

### 2.2 Inquiry Unique Sequence Formatting
Each inquiry generates a formal business reference:
`FS-REQ-{YEAR}-{AUTO_INCREMENT_PADDED_4_DIGITS}` (e.g. `FS-REQ-2026-0001`).

### 2.3 Role-Based Access Control (RBAC)
- **Admin**: Full access across all 19 administration modules, configuration, and user permissions.
- **Manager**: Access to inventory, bookings, inquiries, and customer management.
- **Designer**: Access to AI generations, invitations, and portfolio projects.
- **Customer**: Access to personal invitations, generation history, and submitted RFQs.

