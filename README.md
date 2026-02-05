# Service Marketplace Platform

A full-stack service marketplace connecting Clients with Service Providers.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js, Prisma, MySQL

## Prerequisites
- Node.js (v18+)
- MySQL Server

## Setup Instructions

### 1. Database Setup
Ensure your MySQL server is running.
The application expects a database named `service_marketplace` (Prisma will attempt to create it).

Update `server/.env` with your database credentials:
```
DATABASE_URL="mysql://root:1234567890@localhost:3306/service_marketplace"
```

### 2. Backend Setup
Navigate to the `server` directory:
```bash
cd server
npm install
```

Run Database Migrations:
```bash
npx prisma migrate dev --name init
```

Seed the Database (Optional):
```bash
node prisma/seed.js
```

Start the Backend Server:
```bash
npm start
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
Navigate to the `client` directory.
*(Note: If the `client` directory was not successfully created, run the following command in the root folder first)*:
```bash
npx create-next-app@latest client --typescript --tailwind --eslint
```

Install Dependencies:
```bash
cd client
npm install
```

Start the Frontend Development Server:
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`.

## API Documentation
- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Providers**: `/api/providers`
- **Services**: `/api/services`
- **Bookings**: `/api/bookings`
- **Admin**: `/api/admin/users`, `/api/admin/verify/:id`
