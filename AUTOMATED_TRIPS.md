# Automated Trip Generation System

## Overview

The ROSAgo system now supports **automated recurring trip generation**. Instead of manually creating trips every day, company admins can set up **Scheduled Routes** that automatically create trips at specified times on recurring days.

---

## Key Changes

### 1. **Database Schema**

Added three new enums and one new model:

**Enums:**
- `DayOfWeek`: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
- `ScheduleStatus`: ACTIVE, INACTIVE, SUSPENDED

**Model: ScheduledRoute**
```prisma
model ScheduledRoute {
  id                 String         @id @default(uuid())
  routeId            String
  driverId           String
  busId              String
  scheduledTime      String         // "HH:mm" format (e.g., "07:00")
  recurringDays      DayOfWeek[]    // Array of days
  status             ScheduleStatus @default(ACTIVE)
  autoAssignChildren Boolean        @default(true)
  effectiveFrom      DateTime?      // When schedule starts
  effectiveUntil     DateTime?      // When schedule ends
  // ... relations
}
```

---

### 2. **Backend Services**

#### **ScheduledRoutesService**
- CRUD operations for scheduled routes
- Find active routes for a specific day
- Suspend/activate routes

#### **TripAutomationService**
- Runs daily at **midnight** (cron job)
- Creates trips for all active scheduled routes
- Auto-assigns children based on:
  - School matching
  - Pickup location proximity to route stops (~5km radius)

---

### 3. **API Endpoints**

#### **Scheduled Routes**
```
POST   /scheduled-routes              Create a scheduled route
GET    /scheduled-routes              List all scheduled routes
GET    /scheduled-routes/today        Get today's active schedules
GET    /scheduled-routes/:id          Get one scheduled route
PUT    /scheduled-routes/:id          Update a scheduled route
PUT    /scheduled-routes/:id/suspend  Suspend a route
PUT    /scheduled-routes/:id/activate Activate a route
DELETE /scheduled-routes/:id          Delete a route
```

#### **Manual Trip Generation**
```
POST   /trips/generate-today          Manually trigger trip generation
```

---

### 4. **How It Works**

#### **Setup Phase (One-time)**
1. Company admin creates a **ScheduledRoute**:
   ```json
   {
     "routeId": "route-a-id",
     "driverId": "john-driver-id",
     "busId": "bus-001-id",
     "scheduledTime": "07:00",
     "recurringDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
     "autoAssignChildren": true
   }
   ```

2. System is now configured!

#### **Daily Automation (Automatic)**
Every day at **midnight**:

1. **Cron job runs** (`TripAutomationService.generateDailyTrips()`)
2. **Finds active schedules** for today (e.g., MONDAY)
3. **For each schedule:**
   - Creates a Trip with the scheduled time
   - Finds all children at the route's school
   - Matches children to route based on pickup location
   - Creates ChildAttendance records for matched children
4. **Drivers see trips** when they log in

#### **Driver's Morning Flow**
1. Driver logs in at 6:50 AM
2. Sees **today's trip** (auto-generated at midnight)
3. Sees **children assigned** to the trip
4. Starts trip and picks up children as usual

---

### 5. **Child Assignment Logic**

Children are **automatically matched** to trips if:

✅ Child's school matches the route's school  
✅ Child's pickup location is within ~5km of any route stop  
✅ Child has pickup coordinates set

**Example:**
```
Route A: Greenfield Academy
├── Stop 1: Oxford St (5.5965, -0.175)
├── Stop 2: Cantonments Rd (5.6015, -0.182)
└── Stop 3: School Gate (5.6037, -0.187)

Children:
✅ Akosua: Home at (5.5965, -0.175) → Near Stop 1 → ASSIGNED
✅ Kwabena: Home at (5.6015, -0.182) → Near Stop 2 → ASSIGNED
❌ Liam: Home at (5.7000, -0.250) → Too far → NOT ASSIGNED
```

---

### 6. **Manual Override**

If the cron job fails or you need to generate trips mid-day:

**Via API:**
```bash
POST http://192.168.100.15:3000/trips/generate-today
Authorization: Bearer <admin-token>
```

**Via Admin UI:**
- Navigate to Scheduled Routes screen
- Click "Generate Today" button

---

### 7. **Benefits**

| Before | After |
|--------|-------|
| ❌ Admin creates trips manually every day | ✅ Trips auto-generated at midnight |
| ❌ Admin assigns children manually | ✅ Children auto-assigned by location |
| ❌ Prone to human error | ✅ Consistent, reliable |
| ❌ Time-consuming | ✅ Fully automated |
| ❌ No historical consistency | ✅ Same driver, same children daily |

---

### 8. **User Experience**

#### **For Parents:**
- ✅ See the **same driver** picking up their child daily
- ✅ Know the **exact pickup time** (scheduled)
- ✅ Can request early pickup/skip trip as before

#### **For Drivers:**
- ✅ See trips waiting when they log in
- ✅ Same route, same children every day
- ✅ No confusion about assignments

#### **For Company Admins:**
- ✅ Set up once, runs forever
- ✅ Can suspend routes for holidays
- ✅ Can override with manual generation if needed

---

### 9. **Files Modified/Created**

**Backend:**
- `prisma/schema.prisma` - Added ScheduledRoute model
- `src/modules/scheduled-routes/` - New module
  - `scheduled-routes.service.ts`
  - `scheduled-routes.controller.ts`
  - `scheduled-routes.module.ts`
- `src/modules/trips/trip-automation.service.ts` - Cron job
- `src/modules/trips/trips.controller.ts` - Added generate-today endpoint
- `src/app.module.ts` - Registered ScheduleModule
- `scripts/seed.ts` - Updated to create scheduled routes

**Frontend:**
- `src/screens/admin/ScheduledRoutesScreen.tsx` - Admin UI for managing schedules

---

### 10. **Testing**

1. **View scheduled routes:**
   ```bash
   GET http://192.168.100.15:3000/scheduled-routes
   ```

2. **Manually generate trips:**
   ```bash
   POST http://192.168.100.15:3000/trips/generate-today
   ```

3. **Check if trips were created:**
   ```bash
   GET http://192.168.100.15:3000/trips
   ```

4. **Verify children were assigned:**
   ```bash
   GET http://192.168.100.15:3000/trips/:tripId
   # Should include attendances array
   ```

---

### 11. **Cron Schedule**

The system uses `@nestjs/schedule` with the following cron:

```typescript
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async generateDailyTrips() { ... }
```

**Time:** 00:00:00 (midnight) server time  
**Frequency:** Every day  
**Trigger:** Automatic (no manual intervention needed)

---

### 12. **Future Enhancements**

- 🔮 **Geofencing:** More accurate child-to-route matching using geospatial queries
- 🔮 **Holidays:** Automatically skip trips on school holidays
- 🔮 **Substitute drivers:** Assign backup drivers when primary is unavailable
- 🔮 **Route optimization:** Suggest optimal stop order based on children locations
- 🔮 **Analytics:** Track on-time performance, no-shows, etc.

---

## Summary

**Before:** Manual trip creation every day  
**After:** Fully automated recurring trips  
**Result:** Consistent experience for parents, drivers, and admins 🎯
