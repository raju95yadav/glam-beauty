# 💄 Glam Beauty

> **Modern E-Commerce & Cosmetics Platform with Secure Checkout, Interactive Product Catalog, and Personalized Beauty Care Management.**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-v18%20%7C%20v19-61dafb.svg)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express-v5.2.1-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%20v9-47A248.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3%20%7C%20v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-v5%20%7C%20v7-646CFF.svg)](https://vitejs.dev/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20CDN-3448C5.svg)](https://cloudinary.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment%20Gateway-0C2340.svg)](https://razorpay.com/)

---

## 📋 Table of Contents

1. [🌟 Project Overview](#1--project-overview)
2. [🏗️ Core Architecture & Technology Roles](#2-️-core-architecture--technology-roles)
3. [🛠️ Environment Setup Documentation](#3-️-environment-setup-documentation)
4. [🚀 Installation & Deployment Guide](#4--installation--deployment-guide)
5. [🔐 Authentication & Transaction Flow](#5--authentication--transaction-flow)
6. [📡 API Reference & Testing Documentation](#6--api-reference--testing-documentation)
7. [🧪 Testing & Verification](#7--testing--verification)
8. [💻 Live Demonstration Guide](#8--live-demonstration-guide)
9. [🎓 Academic & Project Information](#9--academic--project-information)

---

## 1. 🌟 Project Overview

**Glam Beauty** is an enterprise-grade digital cosmetics marketplace and personal grooming management system built for high-performance beauty retail. Delivering an omnichannel customer shopping experience alongside a dedicated administration suite, the platform bridges artisanal cosmetics discovery with robust e-commerce logistics. It features high-fidelity product imagery, dynamic taxonomy-based filtering, frictionless one-time password (OTP) and OAuth2 identity management, real-time inventory telemetry, and tamper-proof payment verification.

The application addresses critical consumer expectations in modern beauty commerce: instant responsive discovery across diverse product formulations (skincare, haircare, makeup, bodycare, fragrances, and tools), persistent cart state across unauthenticated and authenticated sessions, transparent multi-stage order tracking, and high-trust transaction security.

### Core Objectives
- **Curated Multi-Tiered Product Discovery:** Provide frictionless real-time search, multi-facet filtering (by category, skin concern, formulation, price range, and rating), and lightning-fast catalog navigation.
- **Resilient Guest-to-User State Persistence:** Maintain cart and wishlist contents within client-side local cache and automatically reconcile items with cloud records upon user sign-in.
- **Secure Passwordless & Federated Identity:** Implement passwordless email OTP verification (Nodemailer), Google OAuth 2.0 federated login, and salted bcrypt cryptographic credential storage with JWT-signed session authorization.
- **Tamper-Proof Transaction Pipeline:** Integrate Razorpay and Stripe payment gateway interfaces backed by HMAC-SHA256 signature verification to eliminate client-side payment forgery.
- **Granular Role-Based Access Control (RBAC):** Distinct isolation between customer storefront capabilities and dedicated back-office administrative oversight (inventory thresholds, automated stock alerts, order status transitions, and analytical telemetry).
- **Modern Performance & Design Aesthetics:** Deliver a luxury glassmorphic visual system powered by Vite, Tailwind CSS, Lucide icons, and Framer Motion micro-interactions.

---

## 2. 🏗️ Core Architecture & Technology Roles

The Glam Beauty ecosystem is structured as a decoupled monorepo comprising three specialized application tiers: the public Customer Storefront (`frontend`), the Back-Office Management Portal (`admin`), and the Centralized RESTful API Gateway (`backend`).

```
 +-----------------------------------------------------------------------------+
 |                               CLIENT LAYER                                  |
 |  +-----------------------------------+   +-------------------------------+  |
 |  |  Customer Storefront (React 19)   |   |   Admin Portal (React 18)     |  |
 |  |  Vite | Tailwind v4 | Motion      |   |   Vite | Tailwind v3 | Recharts|  |
 |  +-----------------+-----------------+   +---------------+---------------+  |
 +--------------------|-------------------------------------|------------------+
                      | HTTPS / JSON                        | HTTPS / Bearer JWT
                      v                                     v
 +-----------------------------------------------------------------------------+
 |                           API GATEWAY / SERVER                              |
 |   Node.js & Express 5.x REST API Layer                                      |
 |   +---------------------------------------------------------------------+   |
 |   | Security & Traffic: Helmet HTTP Headers | Express Rate Limiting     |   |
 |   | CORS Middleware | Multipart Form Parser (Multer)                    |   |
 |   +----------------------------------+----------------------------------+   |
 |                                      |                                      |
 |   +------------------+---------------+------------------+---------------+   |
 |   |  Auth Service    | Catalog Controller | Cart & Wishlist | Order Pipeline|   |
 |   |  (JWT + bcrypt)  | (Faceted Search)   | (Sync Service)  | (HMAC Verif.) |   |
 |   +--------+---------+-------+------------+--------+--------+-------+-------+   |
 +------------|-----------------|---------------------|----------------|-------+
              |                 |                     |                |
 +------------v-----------------v---------------------v----------------v-------+
 |                     DATA & THIRD-PARTY SERVICES LAYER                       |
 |  +----------------------+  +---------------------+  +--------------------+  |
 |  |  MongoDB Atlas       |  |  Cloudinary CDN     |  |  Razorpay / Stripe |  |
 |  |  Mongoose ODM v9     |  |  Media & Assets     |  |  Payment Gateway   |  |
 |  +----------------------+  +---------------------+  +--------------------+  |
 |  +----------------------+  +---------------------+                          |
 |  |  Nodemailer (SMTP)   |  |  Google Identity    |                          |
 |  |  OTP Notification    |  |  OAuth 2.0 Auth     |                          |
 |  +----------------------+  +---------------------+                          |
 +-----------------------------------------------------------------------------+
```

### Technology Subsystems & Roles

| Subsystem | Technology | Version / Key Packages | Role & Architectural Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Storefront** | React, Vite | React 19.x, Vite 7.x | High-speed, responsive customer-facing single page application (SPA). Manages product exploration, cart context, checkout steps, and order tracking. |
| **Storefront Styling & UI** | Tailwind CSS, Motion | Tailwind CSS v4.x, Framer Motion, Lucide | Provides modern luxury aesthetics, accessible iconography, responsive layouts, and buttery micro-animations. |
| **Admin Control Panel** | React, Vite, Recharts | React 18.x, Vite 5.x, Recharts 3.x | Back-office analytics dashboard, catalog CRUD, multi-image upload forms, inventory thresholds, and order status workflow. |
| **API Application Server** | Node.js, Express.js | Node 18+, Express 5.2.x | RESTful API engine orchestrating request routing, controller logic, RBAC middleware, and system orchestration. |
| **API Defense & Traffic** | Helmet, Rate-Limit, CORS | Helmet 8.x, Express-Rate-Limit 8.x | Hardens HTTP response headers against XSS/clickjacking, limits brute-force attempts to 100 req/15min, and confines CORS origins. |
| **Persistence & ODM** | MongoDB, Mongoose | Mongoose 9.3.x | Schema validation, indexed document lookups, compound product filtering, and relational population for carts and orders. |
| **Asset Storage & Media** | Cloudinary, Multer | Cloudinary 1.41.x, Multer-Storage-Cloudinary | Direct multipart stream ingestion for multi-angle cosmetic product imagery with auto-optimization and CDN delivery. |
| **Identity & Security** | JWT, bcrypt, OTP Generator | jsonwebtoken 9.x, bcryptjs 3.x, OTP-Gen | Generates stateless Bearer tokens, executes one-way salted password hashing, and delivers time-sensitive verification PINs. |
| **Federated Authentication** | Google Auth Library | google-auth-library 11.x | Verifies Google ID tokens on the server for instant single-click customer sign-in. |
| **Payment Gateway** | Razorpay SDK, Crypto | Razorpay 2.9.x, Node Crypto | Generates server-side payment orders and performs cryptographic SHA-256 HMAC digest validation against payment webhook data. |
| **Transactional Email** | Nodemailer | Nodemailer 8.x | Handles SMTP transmission of customer OTP codes, order confirmations, and administrative notices. |

---

## 3. 🛠️ Environment Setup Documentation

### Operating System Prerequisites
- **Supported Operating Systems:** Windows 10/11 (64-bit), macOS Monterey (v12) or higher, Ubuntu 20.04+ LTS / Debian 11+.
- **Shell Compatibility:** PowerShell 5.1+ / 7+, Bash, or Zsh.

### Hardware & Resource Recommendations
- **Processor:** Dual-Core x86-64 or Apple Silicon ARM processor (2.4 GHz minimum). Quad-Core recommended.
- **System Memory (RAM):** Minimum 4 GB RAM. 8 GB to 16 GB recommended for concurrent execution of the backend server, client storefront, and admin portal.
- **Storage:** Minimum 2.5 GB free disk space for `node_modules`, database caches, and local Git history.

### Version & Verification Matrix

Execute the following commands in your terminal to verify that your runtime environment satisfies all prerequisites:

| Runtime Dependency | Verification Command | Minimum Required Version | Expected Output Pattern |
| :--- | :--- | :--- | :--- |
| **Node.js** | `node -v` | `>= 18.18.0` (LTS 20.x recommended) | `v20.x.x` or `v18.x.x` |
| **npm Package Manager** | `npm -v` | `>= 9.0.0` | `10.x.x` |
| **Git Version Control** | `git --version` | `>= 2.30.0` | `git version 2.x.x` |
| **MongoDB Instance** | `mongod --version` or MongoDB Atlas URI | `>= 6.0.0` | `db version v7.0.x` |

---

## 4. 🚀 Installation & Deployment Guide

### Step 1: Clone Repository & Examine Workspace Structure

```bash
# Clone the repository to your local machine
git clone https://github.com/raju95yadav/glam-beauty.git

# Navigate into the root project directory
cd glam-beauty

# Inspect directory layout
# .
# ├── admin/       # React 18 + Vite Back-Office Admin Dashboard
# ├── backend/     # Express 5 + Node.js REST API Server
# ├── frontend/    # React 19 + Vite Customer Storefront
# └── README.md
```

---

### Step 2: Backend Environment Configuration

Navigate to the `backend/` directory and configure the runtime environment variables:

```bash
cd backend
cp .env.example .env # Or create a new .env file
```

Populate `backend/.env` with your credentials:

```ini
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/glam_beauty?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long

# Cloudinary Cloud Storage
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

# Razorpay Payment Gateway Credentials
RAZORPAY_KEY=rzp_test_your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_key_secret

# SMTP Email Dispatch (Nodemailer for OTP & Alerts)
EMAIL_USER=your_smtp_email@gmail.com
EMAIL_PASS=your_google_app_specific_password

# Google OAuth2 Authentication
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Admin Account Initialization
ADMIN_EMAIL=admin@gmail.com
```

Install backend package dependencies:

```bash
npm install
```

---

### Step 3: Database Seeding & Admin Provisioning

Initialize your database with default cosmetics catalog items, standard taxonomy categories, and an initial administrative user:

```bash
# Seed product catalog with cosmetics, skincare, and haircare inventory
node runSeeder.js

# Ensure standard category taxonomy is fully indexed
node seedMissingCategories.js

# Provision or reset the superadmin account credentials
node scripts/reset-admin.js
```

> **Default Seed Admin Credentials:**
> - **Email:** `admin@gmail.com`
> - **Password:** `Admin@123` *(Remember to update this in production via the Admin Settings page)*

---

### Step 4: Customer Frontend Configuration & Setup

In a new terminal window, configure and launch the customer-facing storefront:

```bash
cd frontend

# Create .env file
cat <<EOF > .env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
EOF

# Install dependencies
npm install
```

---

### Step 5: Admin Panel Configuration & Setup

In a third terminal window, configure the admin management console:

```bash
cd admin

# Create .env file
cat <<EOF > .env
VITE_API_URL=http://localhost:5000/api
EOF

# Install dependencies
npm install
```

---

### Step 6: Launching Local Development Servers

Start each tier in its respective terminal window:

```bash
# 1. Start Express Backend API (Port 5000)
cd backend
npm run dev

# 2. Start Customer Storefront (Port 5173)
cd frontend
npm run dev

# 3. Start Admin Dashboard (Port 5174)
cd admin
npm run dev
```

| Service | Local Address | Purpose |
| :--- | :--- | :--- |
| **Backend REST API** | `http://localhost:5000` | Core API server & health check endpoint (`/`) |
| **Customer Storefront** | `http://localhost:5173` | Public shopping portal, product catalog, checkout |
| **Admin Dashboard** | `http://localhost:5174` | Inventory alerts, product management, order processing |

---

## 5. 🔐 Authentication & Transaction Flow

The following sequence diagram models the end-to-end user lifecycle: passwordless authentication via OTP, persistent shopping cart synchronization, and tamper-proof Razorpay payment processing with digital order fulfillment.

```
 CUSTOMER                FRONTEND (SPA)           EXPRESS API              DATABASE / SMTP            RAZORPAY GATEWAY
    |                          |                       |                          |                          |
    |---- 1. Enter Email ----->|                       |                          |                          |
    |                          |-- POST /auth/send-otp>|                          |                          |
    |                          |                       |--- Generate 6-Digit PIN -|                          |
    |                          |                       |--- Dispatch Email ------>| [SMTP Server]            |
    |<--- Check Inbox (PIN) ---|                       |                          |                          |
    |---- 2. Submit OTP PIN -->|                       |                          |                          |
    |                          |- POST /verify-otp --->|                          |                          |
    |                          |                       |--- Validate Hash & Exp --|                          |
    |                          |<-- 200 OK + JWT Token-|                          |                          |
    |                          |                       |                          |                          |
    |---- 3. Add to Cart ----->|                       |                          |                          |
    |    (Persist LocalState)  |- PUT /api/cart/update>|                          |                          |
    |                          |  [Header: Bearer JWT] |-- Sync Cart Document --->| [MongoDB: Cart Model]    |
    |                          |                       |                          |                          |
    |---- 4. Proceed Checkout->|                       |                          |                          |
    |    (Select Address & Pay)|- POST /orders ------->|                          |                          |
    |                          |  [Create Order Intent]|-- Create Pending Order ->| [MongoDB: Order Model]   |
    |                          |                       |                          |                          |
    |                          |- POST /payment/create>|                          |                          |
    |                          |                       |----------------------------------- Create Order --->|
    |                          |<-- razorpay_order_id -|<---------------------------------- Returns order_id -|
    |                          |                       |                          |                          |
    |---- 5. Pay via Modal --->| [Checkout.js Modal] --|---------------------------------- Process Card/UPI ->|
    |                          |<-- Payment Success ---|<--------------------------------- Returns PaymentID-|
    |                          |    (order_id, sig)    |                          |                          |
    |                          |- POST /payment/verify>|                          |                          |
    |                          |                       |-- Compute HMAC-SHA256 ---|                          |
    |                          |                       |-- Compare Signatures     |                          |
    |                          |                       |-- Update Order: "Paid" ->| [MongoDB: Order Model]   |
    |                          |<-- 200 Payment Valid -|                          |                          |
    |<--- 6. Receipt & Order --|                       |                          |                          |
    |     Tracking Timeline    |                       |                          |                          |
```

### Architectural Breakdown of Transaction Steps

1. **Client Identity & Token Generation:**
   The customer enters their email to receive a 6-digit numeric OTP generated via `otp-generator` and dispatched through Nodemailer SMTP. Alternatively, a Google OAuth ID token is submitted to `/api/auth/google`. Upon verification, the server yields a signed JSON Web Token (JWT) bearing the user's MongoDB `_id` and role permissions (`isUser` vs `isAdmin`).
2. **Stateless Bearer Authorization:**
   Incoming requests to protected routes pass through `protect` middleware. The HTTP `Authorization: Bearer <token>` header is decoded via `jwt.verify` against `process.env.JWT_SECRET`. Non-admin attempts to access `/api/admin/*` endpoints are rejected with `403 Forbidden`.
3. **Cart & Wishlist Synchronization:**
   Items added while browsing in an unauthenticated guest state are cached in browser `localStorage`. When the client receives a valid JWT, the frontend dispatches a synchronization payload to `/api/cart/add` or `/api/cart/update`, unifying guest selections into the persistent MongoDB cart document.
4. **Cryptographic Payment Integrity:**
   When checking out via Razorpay:
   - The backend creates an order through the official Razorpay SDK (`razorpay.orders.create({ amount, currency: 'INR', receipt })`).
   - The user completes payment in the client popup modal.
   - The frontend sends `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to `/api/payment/verify`.
   - The backend uses Node's native `crypto` library to hash `${order_id}|${payment_id}` using `process.env.RAZORPAY_SECRET` with HMAC-SHA256. If the calculated digest matches `razorpay_signature`, the order is marked `isPaid: true` and moved into the fulfillment queue.

---

## 6. 📡 API Reference & Testing Documentation

All endpoints are served relative to base URL `http://localhost:5000/api`.

### 1. User Authentication

#### Request OTP
`POST /auth/send-otp`  
Dispatches a 6-digit verification code to the specified email address.

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com"
  }'
```
```json
{
  "success": true,
  "message": "OTP sent successfully to your email."
}
```

#### Verify OTP & Authenticate
`POST /auth/verify-otp`  
Verifies the OTP PIN, creates an account if the user is new, and returns a session JWT.

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "otp": "492810"
  }'
```
```json
{
  "_id": "65e8a712f1a9b2c890d4e321",
  "name": "Beauty Enthusiast",
  "email": "customer@example.com",
  "isAdmin": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZThhNzEyZjFhOWIyYzg5MGQ0ZTMyMSIsImlhdCI6MTY5NTM5MDAwMH0..."
}
```

#### Admin Login
`POST /auth/admin-login`  
Authenticates administrative users using email and salted bcrypt password verification.

```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "Admin@123"
  }'
```
```json
{
  "_id": "65e8a100f1a9b2c890d4e001",
  "name": "Super Admin",
  "email": "admin@gmail.com",
  "isAdmin": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZThhMTAwZjFhOWIyYzg5MGQ0ZTAwMSIsImlhdCI6MTY5NTM5MDAwMH0..."
}
```

---

### 2. Product Catalog & Categories

#### List Products (with Search & Pagination)
`GET /products?keyword=serum&category=Skin%20Care&page=1`

```bash
curl -X GET "http://localhost:5000/api/products?keyword=serum&category=Skin%20Care&page=1"
```
```json
{
  "products": [
    {
      "_id": "65e8b456a1b2c3d4e5f6001",
      "title": "Pure Rosehip Seed Oil",
      "brand": "Bloom Botanics",
      "category": "Skin Care",
      "price": 28.00,
      "stock": 110,
      "rating": 4.8,
      "numReviews": 14,
      "imageUrl": "https://res.cloudinary.com/glam-beauty/image/upload/v1/products/rosehip.jpg"
    }
  ],
  "page": 1,
  "pages": 4,
  "totalProducts": 32
}
```

#### Get Filter Metadata & Aggregations
`GET /products/filters`  
Returns dynamic counts, price ranges, available brands, and category trees.

```bash
curl -X GET http://localhost:5000/api/products/filters
```
```json
{
  "categories": ["Skin Care", "Hair Care", "Makeup", "Bodycare", "Fragrance", "Accessories"],
  "brands": ["Bloom Botanics", "VelvetSkin", "Aura Lux", "ChillOut", "RootRevive"],
  "priceRange": {
    "min": 8.00,
    "max": 150.00
  }
}
```

---

### 3. Cart & Wishlist System

#### Retrieve Active User Cart
`GET /cart`  
*(Requires `Authorization: Bearer <token>`)*

```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer <TOKEN>"
```
```json
{
  "_id": "65e8c110b2c3d4e5f6002",
  "user": "65e8a712f1a9b2c890d4e321",
  "items": [
    {
      "product": "65e8b456a1b2c3d4e5f6001",
      "name": "Pure Rosehip Seed Oil",
      "price": 28.00,
      "quantity": 2,
      "image": "https://res.cloudinary.com/glam-beauty/image/upload/v1/products/rosehip.jpg"
    }
  ],
  "totalAmount": 56.00
}
```

#### Add Item to Cart
`POST /cart/add`  
*(Requires `Authorization: Bearer <token>`)*

```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "65e8b456a1b2c3d4e5f6001",
    "quantity": 1
  }'
```
```json
{
  "success": true,
  "message": "Product added to cart",
  "cartCount": 3
}
```

---

### 4. Payment Gateway & Verification

#### Create Razorpay Order
`POST /payment/create-order`  
*(Requires `Authorization: Bearer <token>`)*

```bash
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 56.00
  }'
```
```json
{
  "id": "order_NX3k189HjL201",
  "entity": "order",
  "amount": 5600,
  "amount_paid": 0,
  "currency": "INR",
  "receipt": "receipt_order_1711145230",
  "status": "created"
}
```

#### Cryptographic Payment Verification
`POST /payment/verify`  
*(Requires `Authorization: Bearer <token>`)*

```bash
curl -X POST http://localhost:5000/api/payment/verify \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_NX3k189HjL201",
    "razorpay_payment_id": "pay_NX3m829A0B1C2D",
    "razorpay_signature": "45f09ab938cde4b1a4570198cd4a5589c372b6b0638102d8471c9fa0f91b7d82"
  }'
```
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

---

### 5. Order Management & Tracking

#### Create Order Record
`POST /orders`  
*(Requires `Authorization: Bearer <token>`)*

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "orderItems": [
      {
        "product": "65e8b456a1b2c3d4e5f6001",
        "title": "Pure Rosehip Seed Oil",
        "qty": 2,
        "price": 28.00,
        "image": "https://res.cloudinary.com/glam-beauty/image/upload/v1/products/rosehip.jpg"
      }
    ],
    "shippingAddress": {
      "address": "742 Evergreen Terrace",
      "city": "Springfield",
      "postalCode": "97477",
      "country": "India"
    },
    "paymentMethod": "Razorpay",
    "itemsPrice": 56.00,
    "shippingPrice": 0.00,
    "totalPrice": 56.00
  }'
```
```json
{
  "_id": "65e8d990c3d4e5f6a7003",
  "user": "65e8a712f1a9b2c890d4e321",
  "orderItems": [...],
  "totalPrice": 56.00,
  "isPaid": false,
  "orderStatus": "Processing",
  "createdAt": "2026-09-22T17:45:00.000Z"
}
```

#### Order Tracking Timeline Details
`GET /orders/:id/tracking`  
*(Requires `Authorization: Bearer <token>`)*

```bash
curl -X GET http://localhost:5000/api/orders/65e8d990c3d4e5f6a7003/tracking \
  -H "Authorization: Bearer <TOKEN>"
```
```json
{
  "orderId": "65e8d990c3d4e5f6a7003",
  "currentStatus": "Shipped",
  "trackingEvents": [
    { "status": "Order Placed", "timestamp": "2026-09-22T17:45:00.000Z", "completed": true },
    { "status": "Processing", "timestamp": "2026-09-22T18:10:00.000Z", "completed": true },
    { "status": "Shipped", "timestamp": "2026-09-22T20:30:00.000Z", "completed": true },
    { "status": "Out for Delivery", "timestamp": null, "completed": false },
    { "status": "Delivered", "timestamp": null, "completed": false }
  ]
}
```

---

### 6. Admin Inventory & Metrics

#### Retrieve Dashboard Metrics
`GET /admin/stats`  
*(Requires `Authorization: Bearer <Admin_Token>`)*

```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```
```json
{
  "totalRevenue": 48250.00,
  "totalOrders": 340,
  "totalCustomers": 1210,
  "lowStockCount": 6,
  "revenueTimeline": [
    { "month": "Jun", "revenue": 6200 },
    { "month": "Jul", "revenue": 8400 },
    { "month": "Aug", "revenue": 11500 }
  ]
}
```

#### Inventory Alerts & Low Stock Thresholds
`GET /admin/inventory/alerts`  
*(Requires `Authorization: Bearer <Admin_Token>`)*

```bash
curl -X GET http://localhost:5000/api/admin/inventory/alerts \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```
```json
[
  {
    "_id": "65e8b456a1b2c3d4e5f6045",
    "title": "Vegan Leather Makeup Case",
    "brand": "ChicTravel",
    "stock": 3,
    "threshold": 10,
    "status": "CRITICAL_LOW_STOCK"
  }
]
```

---

## 7. 🧪 Testing & Verification

### Running Automated Test Suites

The test suite evaluates API routing, database schema integrity, cryptographic authentication verification, and controller validation:

```bash
# Run server-side automated tests
cd backend
npm test

# Run frontend build verification and lint tests
cd ../frontend
npm run lint
npm run build

# Run admin panel build verification and lint tests
cd ../admin
npm run lint
npm run build
```

### Functional Test Cases Matrix

- **Authentication & RBAC:**
  - `[PASS]` Dispatches 6-digit OTP to user email and rejects malformed email strings.
  - `[PASS]` Rejects expired OTP codes or incorrect PIN attempts with `400 Bad Request`.
  - `[PASS]` Issues signed JWT token containing user identity and proper expiry duration.
  - `[PASS]` Guards administrative routes (`/api/admin/*`) from customer accounts with `403 Forbidden`.
- **Product Catalog & Filters:**
  - `[PASS]` Queries catalog with keyword regex matching against titles and descriptions.
  - `[PASS]` Applies composite facet filtering across categories, price bounds, and stock availability.
  - `[PASS]` Multi-image upload parses files via Multer and stores Cloudinary CDN image URLs in MongoDB.
- **Cart & Wishlist Engine:**
  - `[PASS]` Synchronizes local client cart items into the cloud database upon post-login handshake.
  - `[PASS]` Automatically decrements and calculates item totals based on updated unit prices.
  - `[PASS]` Prevents negative item quantity updates.
- **Payment & Order Pipeline:**
  - `[PASS]` Successfully initiates Razorpay order objects with price converted to sub-unit (paise).
  - `[PASS]` Recalculates and validates cryptographic HMAC-SHA256 signature against forged requests.
  - `[PASS]` Automatically transitions order status from `Placed` to `Processing` upon valid payment.
- **Admin Real-Time Telemetry:**
  - `[PASS]` Emits inventory warnings when product `stock` counts drop below minimum thresholds.
  - `[PASS]` Updates order fulfillment steps and appends timestamped events to customer tracking records.

---

## 8. 💻 Live Demonstration Guide

Follow this end-to-end user journey to demonstrate all platform capabilities during evaluation or client presentations:

```
 [Step 1: Onboard]      [Step 2: Explore]      [Step 3: Cart Sync]     [Step 4: Checkout]     [Step 5: Admin Panel]
  Register via OTP  -->   Browse Catalog   -->  Add Formulation  -->    Razorpay Test   -->    Inspect Inventory
  Verify JWT Token        Filter Skin Care      Persist in Cloud        Verify Tracking        Update Status
```

### Step 1: Customer Account Creation & OTP Verification
1. Launch the Customer Storefront at `http://localhost:5173`.
2. Click **Account / Sign In** in the top navigation bar.
3. Enter your email address (e.g. `customer@example.com`) and click **Send OTP**.
4. Check your server console (or mailbox if configured) for the generated 6-digit code.
5. Enter the OTP code in the input modal to complete verification. Observe the UI transition into an authenticated session displaying your profile initials and avatar.

### Step 2: Interactive Product Discovery & Faceted Filtering
1. Navigate to the **Shop Catalog** (`/products`).
2. Type `"Rosehip"` or `"Serum"` into the real-time search input.
3. Toggle the **Category Filter** to `"Skin Care"` and slide the **Price Filter** range.
4. Note the dynamic updating of results without full-page reloads, powered by React state and query caching.
5. Click on an item card to inspect the **Product Details Page**, showcasing the Cloudinary high-resolution image gallery, ingredient lists, and star ratings.

### Step 3: Shopping Cart & Local-to-Cloud Persistence
1. Select product quantity and click **Add to Cart**.
2. Open the slide-out cart drawer or navigate to `/cart`.
3. Modify item quantities and observe instantaneous recalculation of item totals, taxes, and shipping fees.
4. Add items to the **Wishlist** by clicking the heart icon on any card; verify that items are saved in your personal wishlist collection.

### Step 4: Secure Checkout & Payment Simulation
1. Click **Proceed to Checkout** (`/checkout`).
2. Input delivery details: Street Address, City, Postal Code, and Contact Phone Number.
3. Select **Razorpay** as the payment method and click **Complete Order**.
4. The Razorpay checkout dialog will appear in test mode.
5. Select **Netbanking** or **Test Card**, and click **Success**.
6. Upon payment verification, the browser redirects to the **Order Confirmation Screen** with a digital invoice summary.
7. Click **Track Order** (`/orders/:id/tracking`) to view the interactive fulfillment timeline showing real-time timestamps.

### Step 5: Administrative Control & Fulfillment Telemetry
1. Open a new browser tab and navigate to the Admin Dashboard at `http://localhost:5174`.
2. Log in using the admin credentials (`admin@gmail.com` / `Admin@123`).
3. **Overview Analytics:** Review the key performance indicators (KPI cards for Total Revenue, Active Orders, Low Stock Alerts, and Sales Growth charts).
4. **Product Catalog Management:** Navigate to **Manage Products**, click **Add New Product**, upload cosmetic images, specify stock, and save.
5. **Order Processing:** Navigate to **Orders**, locate the newly placed customer order, and transition its status from `Processing` to `Shipped`.
6. Return to the customer storefront tab and refresh the tracking timeline to confirm that the delivery milestone has updated in real-time.

---

## 9. 🎓 Academic & Project Information

### Lead Developer & System Architect
- **Lead Developer:** **Raju Yadav**
- **GitHub Profile:** [@raju95yadav](https://github.com/raju95yadav)
- **Direct Contact:** [rajuggvsky@gmail.com](mailto:rajuggvsky@gmail.com)
- **Repository:** [https://github.com/raju95yadav/glam-beauty](https://github.com/raju95yadav/glam-beauty)

### Project Scope & Academic Context
- **Project Domain:** Enterprise MERN Stack Architecture, Scalable E-Commerce Logistics, Role-Based Access Control, Cryptographic Transaction Verification.
- **Design Philosophy:** Luxury visual minimalism, resilient cloud media delivery, high accessibility, and modular microservice-ready backend structuring.
- **Production Readiness:** Configured for cloud deployments on Vercel (Client Storefront & Admin Portal) and Render / Railway / AWS EC2 (Express Backend API & MongoDB Atlas).

### License & Fair Use
Distributed under the **ISC License**. Open-source for educational review, architectural research, and commercial adaptation.

---

<p align="center">
  <sub>Crafted with passion for modern beauty engineering by <b>Raju Yadav</b> • © 2026 Glam Beauty. All rights reserved.</sub>
</p>
