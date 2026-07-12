# LaundroT v2.0 - Authentication & User Management API

## Overview

This document describes the authentication and user management API endpoints for LaundroT v2.0.

## Base URL

```
http://localhost:3000/api/auth
```

---

## 🔐 Authentication

### 1. POST /api/auth/login

**Description:** Login endpoint for Owner only.

**Request Body:**
```json
{
  "email": "budi@gmail.com",
  "password": "12345678"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id_user": "OWN-001",
      "nama": "Budi Santoso",
      "email": "budi@gmail.com",
      "role": "Owner",
      "id_cabang": null
    }
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `403` - Account deactivated

---

### 2. GET /api/auth/me

**Description:** Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id_user": "OWN-001",
      "nama": "Budi Santoso",
      "email": "budi@gmail.com",
      "role": "Owner",
      "id_cabang": null,
      "is_active": true,
      "created_at": "2026-07-08T00:00:00.000Z",
      "branch": null
    }
  }
}
```

---

## 👥 User Management (Owner Only)

### 3. POST /api/auth/register

**Description:** Create a new Admin or Kurir user. **Owner only.**

**Headers:**
```
Authorization: Bearer <owner_token>
```

**Request Body:**
```json
{
  "nama": "John Doe",
  "email": "john.doe@gmail.com",
  "password": "securepassword123",
  "role": "Admin",
  "id_cabang": "CBG-002"
}
```

**Available Branches (id_cabang):**
| ID | Nama | Wilayah |
|----|------|--------|
| CBG-001 | Depok (Pusat) | Depok |
| CBG-002 | Jakarta Selatan | Jakarta Selatan |
| CBG-003 | Bekasi Timur | Bekasi Timur |
| CBG-004 | Tangerang Kota | Tangerang |
| CBG-005 | Bogor Raya | Bogor Raya |

**Success Response (201):**
```json
{
  "success": true,
  "message": "User Admin \"John Doe\" created successfully",
  "data": {
    "user": {
      "id_user": "ADM-ABC123",
      "nama": "John Doe",
      "email": "john.doe@gmail.com",
      "role": "Admin",
      "id_cabang": "CBG-002",
      "is_active": true,
      "created_at": "2026-07-08T00:00:00.000Z"
    },
    "branch": {
      "id_cabang": "CBG-002",
      "nama_cabang": "Cabang Jakarta Selatan",
      "wilayah": "Jakarta Selatan"
    }
  }
}
```

**Error Responses:**
- `400` - Validation errors
- `401` - Not authenticated
- `403` - Not an Owner
- `404` - Branch not found
- `409` - Email already registered OR Branch already has an Admin

---

### 4. GET /api/auth/users

**Description:** List all active users. **Owner only.**

**Headers:**
```
Authorization: Bearer <owner_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 3,
    "users": [
      {
        "id_user": "OWN-001",
        "nama": "Budi Santoso",
        "email": "budi@gmail.com",
        "role": "Owner",
        "id_cabang": null,
        "is_active": true,
        "created_at": "2026-07-08T00:00:00.000Z",
        "branch": null
      },
      {
        "id_user": "ADM-ABC123",
        "nama": "John Doe",
        "email": "john.doe@gmail.com",
        "role": "Admin",
        "id_cabang": "CBG-002",
        "is_active": true,
        "created_at": "2026-07-08T00:00:00.000Z",
        "branch": {
          "id_cabang": "CBG-002",
          "nama_cabang": "Cabang Jakarta Selatan",
          "wilayah": "Jakarta Selatan"
        }
      }
    ]
  }
}
```

---

### 5. DELETE /api/auth/users/:id

**Description:** Deactivate a user. **Owner only.**

**Headers:**
```
Authorization: Bearer <owner_token>
```

**URL Parameters:**
- `id` - User ID to deactivate

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```

**Error Responses:**
- `400` - Cannot deactivate self OR Cannot deactivate Owner
- `401` - Not authenticated
- `403` - Not an Owner
- `404` - User not found

---

## 🔒 Protected Endpoints

All subsequent endpoints should include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Role Requirements:
| Endpoint Pattern | Required Role |
|------------------|---------------|
| `/api/auth/*` | Varies |
| `/api/owner/*` | Owner |
| `/api/orders/*` | Owner, Admin, Kurir |
| `/api/branches/*` | Owner, Admin |
| `/api/couriers/*` | Owner, Admin, Kurir |
| `/api/expenses/*` | Owner, Admin |

---

## 🧪 Testing with Postman

### Step 1: Login as Owner

1. **Create a new Request:**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/login`

2. **Set Body (raw JSON):**
   ```json
   {
     "email": "budi@gmail.com",
     "password": "12345678"
   }
   ```

3. **Click "Send"** and copy the `token` from the response

### Step 2: Create Admin User

1. **Create a new Request:**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/register`

2. **Set Headers:**
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`

3. **Set Body (raw JSON):**
   ```json
   {
     "nama": "Siti Aminah",
     "email": "siti.aminah@laundrot.com",
     "password": "password123",
     "role": "Admin",
     "id_cabang": "CBG-002"
   }
   ```

4. **Click "Send"**

### Step 3: Create Kurir User

1. **Create a new Request:**
   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/register`

2. **Set Headers:**
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`

3. **Set Body (raw JSON):**
   ```json
   {
     "nama": "Budi Santoso",
     "email": "budi.santoso@laundrot.com",
     "password": "password123",
     "role": "Kurir",
     "id_cabang": "CBG-003"
   }
   ```

4. **Click "Send"**

### Step 4: List All Users

1. **Create a new Request:**
   - Method: `GET`
   - URL: `http://localhost:3000/api/auth/users`

2. **Set Headers:**
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`

3. **Click "Send"**

### Step 5: Get Current User Profile

1. **Create a new Request:**
   - Method: `GET`
   - URL: `http://localhost:3000/api/auth/me`

2. **Set Headers:**
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`

3. **Click "Send"**

---

## 🔐 Security Features

### 1. Password Hashing (Bcrypt)
- All passwords are hashed with bcrypt (salt rounds: 12)
- Plain text passwords are NEVER stored or logged

### 2. JWT Authentication
- Tokens expire in 24 hours (configurable via `JWT_EXPIRES_IN`)
- Tokens contain: `id_user`, `email`, `role`, `id_cabang`
- Tokens are verified on every protected request

### 3. Role-Based Access Control (RBAC)
- **Owner:** Full system access, can create Admin/Kurir
- **Admin:** Branch-specific access, can manage orders and couriers
- **Kurir:** Limited to task and status updates

### 4. Data Isolation
- Admin/Kurir can only access their assigned branch data
- Owner can access all branches

### 5. Input Validation
- Email format validation
- Password minimum length (8 characters)
- Required field validation
- SQL injection prevention via Prisma

---

## 📁 Project Structure

```
hub/
├── prisma/
│   ├── schema.prisma          # Database schema (including User model)
│   ├── seed.ts                # Seed data (includes owner user)
│   └── migrations/            # Database migrations
├── src/
│   ├── index.ts               # Main Express app
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware
│   └── routes/
│       └── auth/
│           └── index.ts       # Auth & user management routes
└── package.json
```

---

## 🚀 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Run migrations
npm run db:migrate

# 4. Seed the database (creates Owner user)
npm run db:seed

# 5. Start development server
npm run dev
```

---

## ⚠️ Important Notes

1. **Change JWT_SECRET** in production environment
2. **Database URL** must be set in `.env` file
3. **Only Owner** can create Admin and Kurir users
4. Each branch can only have **one active Admin**
5. Password requirements: minimum **8 characters**
