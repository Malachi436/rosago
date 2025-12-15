# 🗄️ Database Migration Guide - Route-Child System

## ✅ Schema Changes Applied

The Prisma schema has been updated with the following changes:

### Child Model Updates
```prisma
model Child {
  // NEW FIELDS ADDED:
  parentPhone         String?  // For onboarding before parent claims
  routeId             String?  // Which route/bus this child is assigned to
  route               Route?   // Relationship to Route
  daysUntilPayment    Int?     // Payment tracking from legacy system
  allergies           String?  // Child allergies
  specialInstructions String?  // Special instructions for driver
  
  // RENAMED FIELD:
  isClaimed  Boolean @default(false)  // Changed from isLinked
  
  // NEW INDEXES:
  @@index([routeId])
  @@index([parentPhone])
}
```

### Route Model Updates
```prisma
model Route {
  // NEW FIELDS ADDED:
  busId      String?  // Which bus runs this route
  bus        Bus?     // Relationship to Bus
  shift      String?  // "MORNING" or "AFTERNOON"
  children   Child[]  // Children assigned to this route
  
  // NEW INDEX:
  @@index([busId])
}
```

### Bus Model Updates
```prisma
model Bus {
  // NEW FIELD ADDED:
  routes  Route[]  // Routes that use this bus
}
```

---

## 🚀 Migration Steps

### Step 1: Generate Migration
```bash
cd backend
npx prisma migrate dev --name add_route_child_relationships
```

This will:
- Create a new migration file
- Add new columns to database
- Create new indexes
- Update Prisma Client types

### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

This updates TypeScript types for the new fields.

### Step 3: Data Migration (Optional)
If you have existing data, you may need to:

**A. Rename isLinked to isClaimed**:
```sql
-- This is handled automatically by Prisma migrate
-- Old data: isLinked values will be preserved as isClaimed
```

**B. Set default values for new fields**:
```sql
-- All new nullable fields default to NULL
-- No action needed for existing records
```

### Step 4: Restart Backend
```bash
npm run start:dev
```

---

## 📊 Relationship Flow

After migration, the relationships work as follows:

```
Child
  ├─ routeId → Route
  └─ parentPhone (for grouping before claiming)

Route
  ├─ busId → Bus
  ├─ children ← Child (reverse relation)
  └─ shift (MORNING/AFTERNOON)

Bus
  ├─ driverId → Driver
  └─ routes ← Route (reverse relation)

Driver
  └─ buses ← Bus (reverse relation)
```

**Query Example**:
```typescript
// Get all children on a route with bus and driver info
const route = await prisma.route.findUnique({
  where: { id: routeId },
  include: {
    children: true,
    bus: {
      include: {
        driver: {
          include: {
            user: true
          }
        }
      }
    }
  }
});

// Result:
// route.children = all kids on this route
// route.bus.plateNumber = bus plate
// route.bus.driver.user.firstName = driver name
```

---

## 🧪 Testing After Migration

### Test 1: Verify Schema
```bash
npx prisma studio
```

Check:
- [ ] Child table has: parentPhone, routeId, isClaimed, daysUntilPayment
- [ ] Route table has: busId, shift
- [ ] Indexes created on routeId, parentPhone, busId

### Test 2: Create Route with Bus
```typescript
const route = await prisma.route.create({
  data: {
    name: "Bus 1 - Morning Pickup",
    schoolId: "school-id",
    busId: "bus-id",
    shift: "MORNING"
  }
});
```

### Test 3: Assign Child to Route
```typescript
const child = await prisma.child.create({
  data: {
    firstName: "Ama",
    lastName: "Boateng",
    dateOfBirth: new Date("2015-03-15"),
    grade: "Grade 3",
    schoolId: "school-id",
    routeId: "route-id",  // NEW
    parentPhone: "0241234567",  // NEW
    daysUntilPayment: 30,  // NEW
    isClaimed: false  // NEW (renamed from isLinked)
  }
});
```

### Test 4: Query Child with Route
```typescript
const child = await prisma.child.findUnique({
  where: { id: childId },
  include: {
    route: {
      include: {
        bus: {
          include: {
            driver: {
              include: { user: true }
            }
          }
        }
      }
    }
  }
});

console.log(child.route.name);  // "Bus 1 - Morning Pickup"
console.log(child.route.bus.plateNumber);  // "GE-1234-21"
console.log(child.route.bus.driver.user.firstName);  // "Kofi"
```

---

## 🔄 Backend API Updates Needed

After migration, update these endpoints:

### 1. Route Management APIs
```typescript
// CREATE
POST /admin/routes
Body: {
  name: string,
  schoolId: string,
  busId?: string,
  shift?: "MORNING" | "AFTERNOON"
}

// READ
GET /admin/company/:companyId/routes
Response: Route[] with bus, driver, _count.children

// UPDATE
PATCH /admin/routes/:id
Body: { name?, busId?, shift? }

// DELETE
DELETE /admin/routes/:id
```

### 2. Children Bulk Onboarding (Updated)
```typescript
POST /children/bulk-onboard
Body: {
  companyId: string,
  schoolId: string,
  children: [{
    firstName: string,
    lastName: string,
    grade?: string,
    parentPhone?: string,
    daysUntilPayment?: number,
    routeId?: string,  // NEW
    dateOfBirth: string
  }]
}
```

### 3. Get Children (Updated Response)
```typescript
GET /admin/company/:companyId/children
Response: Child[] including:
  - parentPhone
  - routeId
  - route { name, shift, bus { plateNumber } }
  - isClaimed (not isLinked)
  - daysUntilPayment
```

### 4. Generate Family Code (Updated)
```typescript
POST /children/generate-code
// Auto-assign same code to all children with same parentPhone

PATCH /children/:id
Body: { uniqueCode: string }
// Apply to all children with same parentPhone
```

---

## ⚠️ Breaking Changes

### Field Renames
- `Child.isLinked` → `Child.isClaimed`
  - **Action**: Update all queries and mutations
  - **Frontend**: Already updated in admin-web

### New Required Behavior
- When creating ScheduledRoute, system should:
  1. Get route's children
  2. Generate Trip with those children
  3. Use route's bus's driver (unless overridden)

---

## 📝 Migration Checklist

Before deploying:
- [ ] Run `npx prisma migrate dev`
- [ ] Run `npx prisma generate`
- [ ] Update route APIs (CRUD endpoints)
- [ ] Update children bulk onboarding API
- [ ] Update children list API (include route)
- [ ] Update family code generation (use parentPhone)
- [ ] Test route creation
- [ ] Test child assignment to route
- [ ] Test trip generation from scheduled route
- [ ] Test driver sees correct children
- [ ] Update frontend API calls (isLinked → isClaimed)
- [ ] Deploy backend
- [ ] Deploy admin dashboard

---

## 🎯 Expected Behavior After Migration

### Scenario 1: Create Route
```
1. Admin creates Route "Bus 1 - Morning"
2. Assigns Bus "GE-1234-21" (which has Driver "Kofi")
3. Sets shift "MORNING"
4. Route is ready for child assignments
```

### Scenario 2: Onboard Children
```
1. Admin uploads CSV with routeId/routeCode
2. Children created with routeId set
3. Children appear on route's children list
4. Family code can be generated per parentPhone
```

### Scenario 3: Generate Trips
```
1. Scheduled Route exists: "Bus 1 - Morning" at 7:00 AM Mon-Fri
2. System auto-generates Trip for today
3. Trip includes:
   - All children from Route (via routeId)
   - Driver from Bus (via route.busId → bus.driverId)
   - Time from Scheduled Route (7:00 AM)
4. Driver sees complete manifest in app
```

### Scenario 4: Parent Claims
```
1. Parent enters family code
2. System finds all children with that code + parentPhone
3. Shows pre-filled: name, grade, routeId (already set)
4. Parent adds: home location, allergies
5. Child.isClaimed = true
6. routeId stays unchanged (parent can't change route)
```

---

## 🚨 Rollback Plan

If migration fails:

```bash
# Rollback to previous migration
npx prisma migrate resolve --rolled-back <migration-name>

# OR delete last migration folder and re-run
rm -rf prisma/migrations/<last-migration>
npx prisma migrate dev
```

**Note**: Only rollback if no data has been written to new fields.

---

## ✅ Success Indicators

Migration is successful when:
- [ ] No Prisma errors on `npx prisma generate`
- [ ] Database has all new columns
- [ ] Indexes created successfully
- [ ] Admin dashboard loads without errors
- [ ] Can create routes with bus assignment
- [ ] Can onboard children with routes
- [ ] Route info appears in children list
- [ ] No TypeScript errors in backend
- [ ] All relationships query correctly

---

This migration enables the complete **Child → Route → Bus → Driver** relationship system! 🚀
