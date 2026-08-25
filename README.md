# BLACKFAWN - Luxury Printed Apparel & Atelier System

This repository is structured as a multi-application architecture containing independently deployable projects for the customer storefront, admin management portal, shared schemas, and backend API.

## Project Structure

```
BLACKFAWN/
├── storefront/        # Public Customer Frontend Application (Vite + React + TS)
├── admin/             # Admin Management Portal Application (Vite + React + TS)
├── server/            # Standalone Node.js/Express REST API Server
└── shared/            # Reusable Types, Schemas, & Utilities
```

---

## 1. Storefront Application (`/storefront`)
- **Purpose**: Public customer-facing luxury e-commerce website.
- **Local Dev Port**: `http://localhost:5173`
- **Build Output**: `storefront/dist`
- **Target Deployment**: `https://blackfawn.in` or `https://www.blackfawn.in`

### Commands:
```bash
cd storefront
npm install
npm run dev      # Runs storefront on port 5173
npm run build    # Builds production bundle
```

---

## 2. Admin Panel Application (`/admin`)
- **Purpose**: Dedicated enterprise dashboard & catalog management portal.
- **Local Dev Port**: `http://localhost:5174`
- **Build Output**: `admin/dist`
- **Target Deployment**: `https://admin.blackfawn.in`

### Commands:
```bash
cd admin
npm install
npm run dev      # Runs admin portal on port 5174
npm run build    # Builds production bundle
```

---

## 3. Server Application (`/server`)
- **Purpose**: Standalone REST API serving both storefront and admin requests.
- **Local Dev Port**: `http://localhost:5000`
- **Build Output**: `server/dist/server.cjs`
- **Target Deployment**: `https://api.blackfawn.in`

### Commands:
```bash
cd server
npm install
npm run dev      # Runs server on port 5000 with hot reload
npm run build    # Bundles server into standalone CJS module
```

---

## Shared Database & Sync Architecture
Both the Storefront and Admin Panel interface with the central backend API and single source of truth database (`db_store.json` / production DB). Products, categories, or campaigns updated inside the Admin Panel instantly synchronize with the customer storefront via API responses.
