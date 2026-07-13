# Semadaki Gözler

A full-stack application system with admin and user interfaces.

## 📁 Project Structure

This is a monorepo containing three applications:

```
semadaki-gozler/
├── packages/
│   ├── admin-app/     # Admin frontend application (React)
│   ├── user-app/      # User frontend application (React)
│   └── backend/       # Backend API (Node.js + Express)
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/semadaki-gozler.git
cd semadaki-gozler
```

2. Install all dependencies:

```bash
npm run setup
```

### Development

Run all applications in development mode:

```bash
npm run dev
```

Or run individually:

```bash
npm run dev:backend   # Start backend API
npm run dev:user      # Start user frontend
npm run dev:admin     # Start admin frontend
```

### Production

Build all applications:

```bash
npm run build:all
```

Run in production mode:

```bash
npm run prod
```

## 📦 Available Scripts

- `npm run setup` - Install all dependencies for all packages
- `npm run dev` - Run all applications in development mode
- `npm run dev:backend` - Run only backend
- `npm run dev:user` - Run only user app
- `npm run dev:admin` - Run only admin app
- `npm run build:all` - Build all frontend applications
- `npm run prod` - Run all applications in production mode
- `npm run clean` - Clean build artifacts
- `npm run clean:all` - Clean all node_modules and builds

## 🗄️ Database Setup

1. Ensure PostgreSQL is running
2. Configure database connection in `packages/backend/src/config/database.js`
3. Run migrations from `packages/backend/database/migrations/`

## 🏗️ Technology Stack

### Backend

- Node.js
- Express.js
- PostgreSQL

### Frontend (Admin & User Apps)

- React
- Material-UI (MUI)
- React Router

## 📝 License

All rights reserved.

## 👥 Contributors

Add your team members here.

# Exec Policy

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# DB

$PGROOT="C:\Users\amil.agayev\Desktop\tm\psql" & "$PGROOT\pgsql\bin\pg_ctl.exe" -D "$PGROOT\data" -l "$PGROOT\logs\pg.log" start
$PGROOT="C:\Users\amil.agayev\Desktop\tm\psql" & "$PGROOT\pgsql\bin\pg_ctl.exe" -D "$PGROOT\data" -l "$PGROOT\logs\pg.log" stop

# Neon

Upload dump to neon
PS C:\Program Files\PostgreSQL\17\bin> .\pg_restore --no-owner --no-privileges --dbname="postgresql://PGUSER:PGPASSWORD@PGHOST/PGDATABASE?sslmode=require&channel_binding=require" "D:\Anar\semadaki-gozler\semadaki_gozler_db_backup_2025_12_18.sql"
