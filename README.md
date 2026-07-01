<div align="center">

# 📦 Inventory Management API

A production-inspired Inventory Management REST API built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **Prisma ORM**.

Designed with enterprise backend architecture including layered design, dependency injection, DTOs, validation, authentication, role-based authorization, audit logging, and AWS deployment.

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
- AWS Deployment
- CI/CD

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
- 🚧 JWT Authentication
- 🚧 Role-Based Authorization

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
| JWT | Authentication (Upcoming) |
| Docker | Containerization (Upcoming) |
| AWS EC2 | Deployment (Upcoming) |

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

- User Registration
- User Login
- JWT Access Tokens
- Password Hashing
- Protected Routes
- Authentication Middleware
- Refresh Tokens (Planned)

---

# 👥 Authorization

Two user roles are supported.

## Administrator

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

# 📡 Planned API Endpoints

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

---

## Inventory

```
GET    /api/items
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
| Authentication | 🚧 In Progress |
| Authorization | 🚧 Planned |
| Inventory CRUD | 🚧 Planned |
| Audit Logs | 🚧 Planned |
| Docker | 🚧 Planned |
| Swagger | 🚧 Planned |
| Testing | 🚧 Planned |
| AWS Deployment | 🚧 Planned |

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

🚧 In Progress

---

## Phase 3

- Inventory CRUD

---

## Phase 4

- Categories

---

## Phase 5

- Audit Logging

---

## Phase 6

- Search
- Pagination

---

## Phase 7

- Swagger Documentation

---

## Phase 8

- Docker

---

## Phase 9

- Unit Testing

---

## Phase 10

- AWS EC2 Deployment

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

---

# 👨‍💻 Author

**Juan Carlos Dulos**

Backend Developer

GitHub:

https://github.com/JC-Dulos10

---

⭐ If you find this project interesting, consider giving it a star!