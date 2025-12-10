# DEJA VU - Complete Client Cloning Guide
# ==========================================
# This file contains EVERYTHING needed to clone this project for a new client.
# When starting a new client project, Qoder should read this file first.

## OVERVIEW
## ========
This is a school bus tracking system with:
- Mobile App (Expo/React Native) - for Parents & Drivers
- Admin Dashboard (Next.js) - for Company & Platform Admins
- Backend (NestJS) - API server with real-time features

When cloning for a new client:
1. Create 3 new separate repos (backend, frontend, admin-web)
2. Each client has COMPLETELY SEPARATE infrastructure
3. Frontend gets rebuilt from uploaded design files
4. Admin dashboard gets rebranded (colors, logo)
5. Backend stays mostly the same (just rebrand)

---

## STEP 1: CREATE NEW REPOSITORIES
## ================================

Create 3 new GitHub repos for the client:
```
- [client-name]-backend
- [client-name]-frontend  
- [client-name]-admin-web
```

Clone this project as base:
```powershell
# Clone backend
git clone https://github.com/Malachi436/rosago.git [client-name]-backend
cd [client-name]-backend
git remote remove origin
git remote add origin https://github.com/[org]/[client-name]-backend.git
git push -u origin main

# Repeat for frontend and admin-web
```

---

## STEP 2: BACKEND SETUP
## =====================

### 2.1 Prerequisites
- Node.js v18+ (LTS)
- PostgreSQL 15+
- Redis 7+

### 2.2 Create New Database
```powershell
psql -U postgres -c "CREATE DATABASE [client_name]_db;"
```

### 2.3 Environment Variables
Create/update `backend/.env`:
```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/[client_name]_db"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="generate-new-secret-for-client"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Hubtle Payment (Ghana MoMo)
HUBTLE_API_KEY="client-specific-hubtle-key"
HUBTLE_WEBHOOK_SECRET="client-specific-webhook-secret"

# Server
PORT=3000
NODE_ENV=development
```

### 2.4 Install Dependencies
```powershell
cd backend
npm install
```

### 2.5 Database Migration & Seed
```powershell
npx prisma migrate deploy
npx prisma generate
npm run seed
```

### 2.6 Build & Run
```powershell
npm run build
npm run start:dev
```

Backend runs on: http://localhost:3000

---

## STEP 3: FRONTEND SETUP (EXPO GO COMPATIBLE)
## ============================================

### 3.1 CRITICAL: Expo Go Compatibility Rules

The frontend MUST be rebuilt to work with Expo Go (no custom native code).

**ALLOWED:**
- expo-location
- expo-notifications
- expo-secure-store
- react-native-maps (Expo's version)
- socket.io-client
- @react-navigation/*
- nativewind (Tailwind CSS)
- zustand (state management)
- axios

**NOT ALLOWED (requires dev build):**
- Custom native modules
- react-native-reanimated (complex animations only)
- Any package requiring native linking

### 3.2 Frontend Structure
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens
│   ├── navigation/       # React Navigation setup
│   ├── services/         # API client
│   ├── stores/           # Zustand state stores
│   ├── theme/            # Colors, fonts, styles
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── App.tsx               # Root component
├── app.json              # Expo config
├── babel.config.js       # Babel config
├── tailwind.config.js    # NativeWind config
└── package.json
```

### 3.3 Babel Config (MUST BE EXACTLY THIS)
```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }]
    ],
    plugins: [
      "nativewind/babel"
    ]
  };
};
```

### 3.4 Environment Variables
Create `frontend/.env.local`:
```env
EXPO_PUBLIC_API_URL=http://192.168.X.X:3000
EXPO_PUBLIC_MAPTILER_API_KEY=your-maptiler-key
EXPO_PUBLIC_COMPANY_NAME=[Client Name]
```

### 3.5 Install Dependencies
```powershell
cd frontend
npm install
```

### 3.6 Start Frontend
```powershell
npx expo start --clear
```

Scan QR code with Expo Go app on phone.

### 3.7 Key Packages (Current)
```json
{
  "expo": "~52.0.0",
  "react-native": "0.76.x",
  "expo-location": "~18.0.0",
  "expo-notifications": "~0.29.0",
  "socket.io-client": "^4.7.0",
  "@react-navigation/native": "^7.0.0",
  "@react-navigation/stack": "^7.0.0",
  "@react-navigation/bottom-tabs": "^7.0.0",
  "nativewind": "^4.0.0",
  "tailwindcss": "^3.4.0",
  "zustand": "^4.5.0",
  "axios": "^1.6.0",
  "react-native-maps": "1.18.0"
}
```

---

## STEP 4: ADMIN DASHBOARD SETUP
## ==============================

### 4.1 Framework
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Axios for API calls

### 4.2 Environment Variables
Create `admin-web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_COMPANY_NAME=[Client Name]
NEXT_PUBLIC_MAPTILER_API_KEY=your-maptiler-key
```

### 4.3 Customization Points

**Colors** - Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: '#[CLIENT_PRIMARY_COLOR]',
      secondary: '#[CLIENT_SECONDARY_COLOR]',
      accent: '#[CLIENT_ACCENT_COLOR]'
    }
  }
}
```

**Logo** - Replace files in:
- `admin-web/public/logo.png`
- `admin-web/public/favicon.ico`

**Company Name** - Update in `.env.local`

### 4.4 Install & Run
```powershell
cd admin-web
npm install
npm run dev
```

Admin runs on: http://localhost:3001

---

## STEP 5: EXTERNAL SERVICES SETUP
## ================================

### 5.1 MapTiler (Maps)
- Sign up: https://cloud.maptiler.com/
- Get API key from dashboard
- Free tier: 100,000 requests/month
- Used for: Live tracking maps, route visualization

### 5.2 Hubtle (Ghana Mobile Money Payments)
- Sign up: https://hubtle.io/
- Get API key and webhook secret
- Used for: Parent subscription payments
- Supports: MTN MoMo, Vodafone Cash, AirtelTigo Money

### 5.3 Redis
- Local: Install Redis (Windows/Mac/Linux)
- Cloud: Redis Cloud, Upstash, or AWS ElastiCache
- Used for: Real-time GPS caching, session management

### 5.4 PostgreSQL
- Local: Install PostgreSQL 15+
- Cloud: Render PostgreSQL, Supabase, or AWS RDS
- Used for: All persistent data

---

## STEP 6: DATABASE SEEDING
## =========================

### 6.1 Seed Data Structure
The seed script creates:
- 1 Platform Admin (can manage all companies)
- 1 Company (the client)
- 1 Company Admin
- 1 Driver with assigned bus
- 1 Parent with 2 children
- 1 School
- 1 Route with scheduled trips
- Test attendance data

### 6.2 Customize Seed Data
Edit `backend/scripts/seed.ts`:
```typescript
// Change company details
const company = await prisma.company.create({
  data: {
    name: '[Client Company Name]',
    email: 'admin@[client].com',
    phone: '+233XXXXXXXXX',
    // ...
  }
});
```

### 6.3 Test Credentials (Default)
```
Platform Admin: platform@saferide.com / Test@1234
Company Admin: admin@saferide.com / Test@1234
Driver: driver@saferide.com / Test@1234
Parent: parent@test.com / Test@1234
```

---

## STEP 7: CORE FEATURES CHECKLIST
## ================================

### Currently Implemented:
- [x] Authentication (JWT with refresh tokens)
- [x] Role-based access (Platform Admin, Company Admin, Driver, Parent)
- [x] Company/School/Bus/Driver/Child CRUD
- [x] Route management with stops
- [x] Scheduled routes (recurring)
- [x] Auto-generate trips from scheduled routes
- [x] Real-time GPS tracking (WebSocket)
- [x] Attendance management (pickup/dropoff)
- [x] Notifications system
- [x] Live dashboard with map
- [x] Home pickup location feature
- [x] Call driver feature (parent app)

### In Progress / Planned:
- [ ] Hubtle payment integration
- [ ] Forgot password flow
- [ ] Push notifications (Expo)
- [ ] Analytics dashboard
- [ ] Export reports (PDF/CSV)
- [ ] Multi-language support

---

## STEP 8: API ENDPOINTS REFERENCE
## =================================

### Auth
```
POST /auth/login          - Login
POST /auth/signup         - Parent signup
POST /auth/refresh        - Refresh token
POST /auth/forgot-password - Request reset (TODO)
POST /auth/reset-password  - Reset password (TODO)
```

### Admin
```
GET  /admin/company/:id/children  - Get company children
GET  /admin/company/:id/drivers   - Get company drivers
GET  /admin/company/:id/buses     - Get company buses
GET  /admin/companies             - Get all companies (platform)
```

### Drivers
```
GET  /drivers/:id/today-trip     - Get driver's current trip
PATCH /drivers/:id/bus           - Assign bus to driver
```

### Attendance
```
PATCH /attendance/:id            - Update child status
GET   /attendance/trip/:tripId   - Get trip attendances
```

### GPS
```
WebSocket: 'gps_update'          - Driver sends location
WebSocket: 'bus_location'        - Admin receives location
```

### Payments (Hubtle)
```
POST /payments/create-intent     - Create payment
POST /payments/webhook           - Hubtle callback
GET  /payments/history/:parentId - Payment history
```

### Trips
```
POST /trips/generate-today       - Generate daily trips
GET  /trips/company/:id/active   - Get active trips
```

---

## STEP 9: FRONTEND REBUILD PROCESS
## ==================================

When rebuilding frontend from new design:

### 9.1 Receive Design Assets
- ZIP file with design screenshots/mockups
- Color palette
- Logo files (PNG, SVG)
- Font files (if custom)

### 9.2 Extract Theme
```typescript
// src/theme/colors.ts
export const colors = {
  primary: '#[from design]',
  secondary: '#[from design]',
  accent: '#[from design]',
  background: '#[from design]',
  text: '#[from design]',
  // ...
};
```

### 9.3 Rebuild Screens
Match each screen from design:
- LoginScreen
- SignupScreen
- ParentHomeScreen
- ChildrenListScreen
- LiveTrackingScreen
- DriverHomeScreen
- AttendanceScreen
- SettingsScreen
- etc.

### 9.4 Maintain API Compatibility
The backend API stays the same. Only UI changes.
All API calls, navigation, and data flow remain identical.

---

## STEP 10: DEPLOYMENT CHECKLIST
## ==============================

### Backend (Render/Railway/AWS)
- [ ] Set all environment variables
- [ ] Configure PostgreSQL connection
- [ ] Configure Redis connection
- [ ] Set up health check endpoint
- [ ] Configure CORS for frontend domains

### Frontend (Expo EAS)
- [ ] Configure app.json with client branding
- [ ] Set up EAS Build
- [ ] Configure push notification credentials
- [ ] Submit to App Store / Play Store

### Admin Dashboard (Vercel/Netlify)
- [ ] Set environment variables
- [ ] Configure build command
- [ ] Set up custom domain

---

## STEP 11: UPDATING THIS FILE
## ============================

**IMPORTANT:** Whenever a new feature is added to this project:
1. Update the "Core Features Checklist" section
2. Add new API endpoints to the reference
3. Add any new environment variables needed
4. Add any new dependencies required
5. Document any special setup steps

This ensures the next client clone starts with full feature parity.

---

## QUICK START SUMMARY
## ====================

```powershell
# 1. Clone repos
git clone [backend-repo] && cd backend

# 2. Setup backend
npm install
# Create .env with database/redis/jwt
npx prisma migrate deploy
npx prisma generate
npm run seed
npm run build
npm run start:dev

# 3. Setup admin (new terminal)
cd ../admin-web
npm install
# Create .env.local
npm run dev

# 4. Setup frontend (new terminal)
cd ../frontend
npm install
# Create .env.local
npx expo start --clear
```

---

**Last Updated:** December 10, 2025
**Project Status:** In Development
**Next Client Ready:** After Hubtle + Forgot Password complete
