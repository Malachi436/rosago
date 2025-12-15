# 🚀 Driver-Route-Child Implementation Plan

## Current State Analysis

After reviewing the existing schema, here's what we have:

### ✅ Already Exists:
- **Bus** model (with plateNumber, capacity, driverId)
- **Driver** model (linked to buses)
- **Route** model (with schoolId)
- **Child** model (with schoolId, parentId)
- **Trip** model (daily instances)
- **ScheduledRoute** model (template for recurring routes)

### ❌ Missing Links:
- Child → Route relationship (children not assigned to routes)
- Route → Bus relationship (routes not linked to buses)
- Bus plateNumber in Route for easy identification

---

## 📋 What Needs to Be Added

### 1. Schema Updates Needed

```prisma
// Add to Route model
model Route {
  // ... existing fields
  busId       String?  // Which bus runs this route
  bus         Bus?     @relation(fields: [busId], references: [id])
  shift       String?  // "MORNING" or "AFTERNOON"
  children    Child[]  // Children assigned to this route
  
  @@index([busId])
}

// Add to Child model
model Child {
  // ... existing fields
  routeId         String?  // Which route this child is on
  route           Route?   @relation(fields: [routeId], references: [id])
  parentPhone     String?  // For onboarding before parent claims
  daysUntilPayment Int?    // Payment tracking from legacy system
  isClaimed       Boolean  @default(false) // Changed from isLinked
  
  @@index([routeId])
  @@index([parentPhone])
}
```

---

## 🛠️ Implementation Steps

### Phase 1: Backend Schema & APIs ✅

**1.1 Update Prisma Schema**
- Add `busId` and `shift` to Route
- Add `routeId`, `parentPhone`, `daysUntilPayment`, `isClaimed` to Child
- Run migration: `npx prisma migrate dev --name add-route-bus-child-links`

**1.2 Update/Create API Endpoints**
```typescript
// Routes Management
POST   /admin/routes                    // Create route with bus
GET    /admin/routes                    // List all routes
PATCH  /admin/routes/:id                // Update route
DELETE /admin/routes/:id                // Delete route
GET    /admin/routes/:id/children       // Get children on route

// Driver Management  
GET    /admin/drivers                   // List drivers
POST   /admin/drivers                   // Create driver + link to bus
PATCH  /admin/drivers/:id/bus           // Change driver's bus

// Children Onboarding
POST   /children/bulk-onboard           // Updated to accept routeId/routeCode
GET    /admin/routes/:id/children       // Get children on a route

// Trip Management
PATCH  /trips/:id/driver                // Override driver for specific trip
```

---

### Phase 2: Admin Dashboard UI 🎨

**2.1 Routes Management Page**
File: `admin-web/src/app/company/[companyId]/routes/page.tsx`

Features:
- List all routes with bus + driver info
- Create new route (select bus, set shift)
- Edit/delete routes
- View children count per route

**2.2 Enhanced Driver Management**
Update: `admin-web/src/app/company/[companyId]/drivers/page.tsx`

Features:
- List drivers with their assigned bus
- Add driver form with bus selection (by plate number)
- Change driver's bus assignment
- View driver's routes

**2.3 Enhanced Children Management**
Update: `admin-web/src/app/company/[companyId]/children-management/page.tsx`

Add:
- Route selection dropdown when adding children
- CSV column: "Route Code" or "Bus Plate"
- Show route/bus info in children list

---

### Phase 3: CSV Integration 📊

**3.1 Updated CSV Template**
```csv
First Name,Last Name,Grade,Parent Phone,Days Until Payment,Route Code
Ama,Boateng,Grade 1,0241234567,30,R1-MORNING
Kofi,Mensah,Grade 3,0241234567,30,R1-MORNING
Esi,Addo,Grade 2,0245678901,15,R2-AFTERNOON
```

**3.2 Import Logic**
- Validate route codes exist
- Auto-assign children to routes
- Group by parent phone for family codes

---

## 🎯 Priority Order

### Must Have (MVP):
1. ✅ Schema updates (Route ↔ Bus, Child ↔ Route)
2. ✅ Routes management page
3. ✅ Update children onboarding with route assignment
4. ✅ CSV import with route codes

### Should Have (Next):
1. ✅ Daily trip driver override
2. ✅ Driver-Bus reassignment interface
3. ✅ Route children viewer

### Nice to Have (Future):
1. ⏸️ Bulk route assignment tool
2. ⏸️ Route capacity warnings
3. ⏸️ Driver schedule conflict detection

---

## 📁 Files to Create/Update

### New Files:
1. `admin-web/src/app/company/[companyId]/routes/page.tsx`
2. Backend: Route management APIs
3. Backend: Migration file for schema changes

### Files to Update:
1. `backend/prisma/schema.prisma` - Add relationships
2. `admin-web/src/app/company/[companyId]/children-management/page.tsx` - Add route selection
3. `admin-web/src/components/Sidebar.tsx` - Add "Routes" menu item
4. Backend bulk onboarding endpoint - Accept route codes

---

## 🧪 Testing Checklist

After implementation, test:

- [ ] Create bus with plate number
- [ ] Create driver and assign to bus
- [ ] Create route and assign to bus
- [ ] Onboard children via CSV with route codes
- [ ] Verify children appear on route
- [ ] Verify driver can see children via route→bus→driver
- [ ] Change bus's driver, verify all route children follow
- [ ] Override trip driver for one day
- [ ] Move child to different route
- [ ] Generate family codes (grouped by parent phone)
- [ ] Parent claims children, routes unchanged

---

## 📝 Database Migration Commands

```bash
# 1. Update schema
cd backend

# 2. Create migration
npx prisma migrate dev --name add_route_bus_child_relationships

# 3. Generate Prisma client
npx prisma generate

# 4. Restart backend
npm run start:dev
```

---

## 🎨 UI Mockup Notes

### Routes Page Layout:
```
┌────────────────────────────────────────────────────┐
│  Routes Management                    [+ New Route] │
├────────────────────────────────────────────────────┤
│                                                     │
│  🚌 Bus 1 - Morning Pickup                         │
│  Bus: GE-1234-21 • Driver: Uncle Kofi              │
│  12 children assigned                              │
│  [View Children] [Edit] [Delete]                   │
│                                                     │
│  🚌 Bus 1 - Afternoon Dropoff                      │
│  Bus: GE-1234-21 • Driver: Uncle Kofi              │
│  12 children assigned                              │
│  [View Children] [Edit] [Delete]                   │
└────────────────────────────────────────────────────┘
```

### Children Management (Enhanced):
```
Bulk Add / CSV Import

[ First Name ] [ Last Name ] [ Grade ] [ Parent Phone ] [ Days ] [ Route ▼ ]
  John          Doe           Grade 1   0241234567       30       R1-MORNING ▼
  
Route dropdown shows:
  - R1-MORNING (Bus GE-1234-21 - Uncle Kofi)
  - R2-AFTERNOON (Bus GR-5678-21 - Uncle Mensah)
```

---

This plan ensures we implement the driver-route-child relationship properly while maintaining the existing system structure! 🚀
