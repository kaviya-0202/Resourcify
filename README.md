# Resourcify 📚

A College Resource Management System built with the MERN stack.

## Features
- Role-based registration (Student / Staff)
- JWT authentication with protected routes
- Staff can upload resources (PDF, PPT, DOC, images, etc.)
- Files stored in MongoDB using GridFS
- Browse & filter resources by department, year, and category
- Search resources by name
- Role-aware UI — upload button only shown to staff

## Tech Stack
- **Frontend**: React + Vite, React Router v7, Axios
- **Backend**: Node.js, Express 5, MongoDB, Mongoose, Multer + GridFS

## Project Structure
```
Resourcify/
├── Backend/
│   ├── controllers/   authController.js, resourceController.js
│   ├── middleware/    authMiddleware.js
│   ├── models/        User.js, Resource.js
│   ├── routes/        authRoutes.js, resourceRoutes.js
│   ├── .env
│   └── server.js
└── Frontend/resourcify-frontend/
    └── src/
        ├── components/  Navbar.jsx, ProtectedRoute.jsx
        ├── context/     AuthContext.jsx
        ├── pages/       WhoAreYou, Register, Login, Home, Upload, Downloads, Contact
        ├── services/    api.js
        └── styles/      global.css, auth.css
```

## Setup

### Backend
```bash
cd Backend
npm install
# Edit .env — set your MONGO_URI and JWT_SECRET
npm run dev
```

### Frontend
```bash
cd Frontend/resourcify-frontend
npm install
npm run dev
```

## User Flow
1. Visit `/` → Choose Student or Staff
2. Fill in registration form (include your department)
3. Login after registering
4. Students → browse & download resources for their dept
5. Staff → upload resources + browse

## API Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | ❌ | Register user |
| POST | /api/auth/login | ❌ | Login user |
| POST | /api/resource/upload | Staff only | Upload file |
| GET | /api/resource | ✅ | Get resources (filterable) |
| GET | /api/resource/download/:id | ✅ | Download file |
| DELETE | /api/resource/:id | ✅ | Delete resource |
