# Number Tree - Social Network Through Mathematics

A full-stack application where users communicate through mathematical operations. Users can start calculation trees with numbers and respond with operations.

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs 

### Frontend
- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios (API client)

### DevOps
- Docker & Docker Compose

## Features

- ✅ User authentication (register/login)
- ✅ View all calculation trees (public access)
- ✅ Create new calculation trees with starting numbers
- ✅ Add operations (+, -, ×, ÷) to any number in a tree
- ✅ Hierarchical tree visualization
- ✅ Real-time calculation preview
- ✅ User attribution for each operation
- ✅ Responsive UI with Tailwind CSS

## How to run
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# You'll need: zustand, axios

# Setup environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`
