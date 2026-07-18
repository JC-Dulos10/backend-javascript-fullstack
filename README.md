<div align="center">

# 📦 Inventory Management API

A production-inspired Inventory Management REST API built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **Prisma ORM**.

Designed with enterprise backend architecture including layered design, dependency injection, DTOs, validation, authentication, role-based authorization, audit logging, and Render deployment.

> 🚧 Currently under active development.

---

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-black?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

---

# 📑 Table of Contents

- Project Overview
- Features
- Project Goals
- Architecture
- Technology Stack
- Project Structure
- Database Design
- Authentication & Authorization
- Validation
- Error Handling
- API Endpoints
- Installation
- Environment Variables
- Running the Project
- Database Migration
- Database Seeding
- Current Progress
- Roadmap
- Future Improvements
- Author

---

# 📖 Project Overview

This project is a production-inspired REST API that simulates an Inventory Management System.

Rather than focusing only on CRUD operations, the goal is to demonstrate professional backend software engineering practices commonly used in enterprise applications.

The project follows a layered architecture and emphasizes:

- Clean Architecture
- Separation of Concerns
- Repository Pattern
- DTO Pattern
- Dependency Injection
- Authentication & Authorization
- Audit Logging
- Validation
- Scalability
- Maintainability

This project serves as a portfolio project showcasing backend development skills using modern JavaScript/TypeScript technologies.

---

# 🎯 Project Goals

The objective is to build a backend that resembles a real production application rather than a simple CRUD tutorial.

Features include:

- User Authentication
- Role-Based Authorization
- Inventory Management
- Category Management
- Audit Logging
- Soft Delete
- Search
- Pagination
- Docker Support
- Swagger Documentation
- Unit Testing
- Render Deployment
- CI/CD

Recent API additions:

- Admin-only user registration with an explicit `ADMIN` or `USER` role
- Audit records for successful logins and user registrations
- Item filtering by category and audit-log filtering by action

---

# ✨ Current Features

## Backend Foundation

- ✅ Express 5
- ✅ TypeScript
- ✅ PostgreSQL
- ✅ Prisma ORM
- ✅ Environment Configuration
- ✅ Database Migration
- ✅ Database Seeding

## Architecture

- ✅ Layered Architecture
- ✅ Repository Pattern
- ✅ Dependency Injection
- ✅ DTO Pattern
- ✅ Custom Error Classes
- ✅ Global Error Handling
- ✅ Validation Middleware
- ✅ Zod Validation

## Database

- ✅ User Entity
- ✅ Category Entity
- ✅ Item Entity
- ✅ Audit Log Entity

## Security

- ✅ Password Hashing (bcrypt)
- ✅ JWT Authentication
- ✅ Role-Based Authorization

---

# 🏗 Architecture

```
Client
    │
    ▼
Express Routes
    │
    ▼
Validation Middleware
    │
    ▼
Controllers
    │
    ▼
Services
    │
    ▼
Repositories
    │
    ▼
Prisma ORM
    │
    ▼
PostgreSQL
```

---

# 🛠 Technology Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime Environment |
| Express | REST API Framework |
| TypeScript | Type Safety |
| PostgreSQL | Database |
| Prisma ORM | Database ORM |
| Zod | Request Validation |
| bcrypt | Password Hashing |
| JWT | Authentication |
| Docker | Containerization |
| Render | Deployment |

---

# 📁 Project Structure

```
backend-javascript-fullstack/
│
├── prisma/
│   ├── migrations/
│   ├── seeders/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│
├── config/
│
├── container/
│
├── controllers/
│
├── dto/
│
├── errors/
│
├── middlewares/
│
├── repositories/
│
├── routes/
│
├── security/
│
├── services/
│
├── types/
│
├── validators/
│
├── app.ts
│
└── server.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🗄 Database Design

## User

| Field | Type |
|------|------|
| id | Integer |
| username | String |
| password | String |
| role | ADMIN / USER |
| createdAt | DateTime |
| updatedAt | DateTime |

---

## Category

| Field | Type |
|------|------|
| id | Integer |
| name | String |
| description | String |
| createdAt | DateTime |
| updatedAt | DateTime |

---

## Item

| Field | Type |
|------|------|
| id | Integer |
| sku | String |
| name | String |
| description | String |
| quantity | Integer |
| receivedAt | DateTime |
| createdBy | User |
| updatedBy | User |
| category | Category |
| isActive | Boolean |
| inactiveAt | DateTime |

---

## Audit Log

| Field | Type |
|------|------|
| id | Integer |
| action | Enum |
| tableName | String |
| recordId | Integer |
| details | JSON |
| performedAt | DateTime |
| user | User |

---

# 🔐 Authentication

Authentication will use JSON Web Tokens (JWT).

Features:

- Admin-Managed User Registration
- User Login
- JWT Access Tokens
- Password Hashing
- Protected Routes
- Authentication Middleware
- Refresh Tokens (Planned)

## Registration workflow

The seeded administrator creates user accounts. First log in as an administrator, then pass its JWT when registering a user.

```http
POST /api/auth/register
Authorization: Bearer <admin-jwt>
Content-Type: application/json

{
  "username": "newuser",
  "password": "ValidPassword123",
  "role": "USER"
}
```

`role` must be `ADMIN` or `USER`. Anonymous and non-admin users cannot register accounts.

Each successful login records a `LOGIN` audit entry. Each successful registration records a `REGISTER` entry attributed to the administrator who created the account.

---

# 👥 Authorization

Two user roles are supported.

## Administrator

- Register user accounts with either supported role
- Create Items
- Update Items
- Soft Delete Items
- Restore Items
- Manage Categories
- View Audit Logs

## User

- View Inventory
- Search Inventory
- View Categories

---

# ✅ Validation

Request validation is implemented using Zod.

Validation includes:

- Request Body
- Route Parameters
- Query Parameters

---

# 🚨 Error Handling

Custom error handling includes:

- Validation Errors
- Authentication Errors
- Authorization Errors
- Database Errors
- Global Error Middleware

---

# 📡 API Endpoints

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

`POST /api/auth/register` requires an ADMIN JWT and `username`, `password`, and `role` in the request body.

---

## Inventory

```
GET    /api/items?categoryId=1&page=1&limit=10
GET    /api/items/:id

POST   /api/items

PUT    /api/items/:id

DELETE /api/items/:id

PATCH  /api/items/:id/restore
```

---

## Categories

```
GET    /api/categories

POST   /api/categories

PUT    /api/categories/:id

DELETE /api/categories/:id
```

---

## Audit Logs

```
GET /api/audit
```

Filter audit logs by action:

```http
GET /api/audit?action=LOGIN
GET /api/audit?action=REGISTER
GET /api/audit?action=CREATE_ITEM
```

Audit access requires an ADMIN JWT. Valid actions are `LOGIN`, `REGISTER`, `CREATE_ITEM`, `UPDATE_ITEM`, `DELETE_ITEM`, and `RESTORE_ITEM`.

## Docs / Swagger

```
GET /api/docs
GET /api/docs/swagger.json
```

The interactive documentation is available at `GET /api/docs`. Use Swagger UI's **Authorize** button to provide a bearer JWT before calling protected endpoints.

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/JC-Dulos10/backend-javascript-fullstack.git
```

Install dependencies

```bash
npm install
```

---

# 🔧 Environment Variables

Create a `.env` file.

```env
DATABASE_URL=

PORT=3000

JWT_SECRET=

JWT_EXPIRES_IN=1h

ADMIN_USERNAME=admin

ADMIN_PASSWORD=Admin123!
```

---

# 🚀 Running the Project

Development

```bash
npm run dev
```

Production

```bash
npm run build

npm start
```

---

# 🗄 Database Migration

```bash
npx prisma migrate dev
```

Generate Prisma Client

```bash
npx prisma generate
```

---

# 🌱 Database Seeding

```bash
npm run seed
```

The seed creates:

- Administrator Account
- Default Categories

Future versions will include sample inventory data for development.

---

# 📊 Current Progress

| Module | Status |
|----------|----------|
| Foundation | ✅ Complete |
| Database | ✅ Complete |
| Validation | ✅ Complete |
| Authentication | ✅ Complete |
| Authorization | ✅ Complete |
| Inventory CRUD | ✅ Complete |
| Categories | ✅ Complete |
| Audit Logs | ✅ Complete |
| Search & Pagination | ✅ Complete |
| Docker | ✅ Complete |
| Swagger | ✅ Complete |
| Testing | ✅ Complete |
| Render Deployment | ✅ Complete |

---

# 🛣 Roadmap

## Phase 1

- Foundation
- Database
- Architecture

✅ Completed

---

## Phase 2

- Authentication
- JWT
- Role Middleware

✅ Completed

---

## Phase 3

- Inventory CRUD

✅ Completed

---

## Phase 4

- Categories

✅ Completed

---

## Phase 5

- Audit Logging

✅ Completed

---

## Phase 6

- Search
- Pagination

✅ Completed

---

## Phase 7

- Swagger Documentation

✅ Completed

---

## Phase 8

- Docker

✅ Completed

---

## Phase 9

- ✅ Unit + Integration Testing (Jest)
  - ✅ Unit tests: auth.validator schemas (`auth.validator.spec.ts`)
  - ✅ Integration tests: auth routes + inventory/category routes
  - ✅ Negative tests added (missing/invalid token, validation failures, non-admin role enforcement)


---

## Phase 10

- ✅ Render Deployment

Deployment base URL: https://backend-javascript-fullstack.onrender.com/

---

## Phase 11

- GitHub Actions CI/CD

---

# 🚀 Future Improvements

- Refresh Tokens
- Redis Cache
- Rate Limiting
- API Versioning
- File Upload
- Cloud Storage
- Monitoring
- Logging Dashboard
- Kubernetes Deployment
- AWS/Azure/Google Cloud Deployment

---

# 👨‍💻 Author

**Juan Carlos Dulos**

Backend Developer

GitHub:

https://github.com/JC-Dulos10

---

# Render Free-Tier Note
If your Render service is not responding (or the browser shows an unavailable page), wait ~1 minute and try again. Free-tier Render instances can sleep between requests.

You can check availability using:
- GET /health

Reload / retry after a minute once the server is back online.

## Deployed base URL
- Base: https://backend-javascript-fullstack.onrender.com/

---





⭐ If you find this project interesting, consider giving it a star!
