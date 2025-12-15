# 🚌 Driver-Route-Child Relationship Logic

## 📖 Core Concept

The system uses a **chain relationship** where children are permanently assigned to routes, and drivers are assigned to routes (either permanently via bus or daily via trips).

```
Child → Route → Bus → Driver
```

This design allows:
- ✅ Stable child assignments (children don't change routes often)
- ✅ Flexible driver scheduling (drivers can change, substitutes can fill in)
- ✅ No need to update all children when drivers change

---

## 🔗 The Relationship Chain Explained

### 1. Driver Entity
```
Driver {
  id: string
  license: string
  userId: string (login account)
  buses: Bus[] (one driver can handle multiple buses)
}
```

**What it represents**: The human who drives the bus

---

### 2. Bus Entity
```
Bus {
  id: string
  plateNumber: string (unique identifier)
  capacity: number
  driverId: string (primary/default driver)
  driver: Driver
}
```

**What it represents**: The physical vehicle
**Key point**: Each bus has a **default driver** but can have different drivers on specific days

---

### 3. Route Entity
```
Route {
  id: string
  name: string (e.g. "Bus 1 - Morning Pickup")
  schoolId: string
  busId: string (which bus runs this route)
  bus: Bus
  shift: "MORNING" | "AFTERNOON"
}
```

**What it represents**: A recurring path/run that a bus makes
**Key point**: Routes are **templates** for daily trips

---

### 4. Child Entity (Updated)
```
Child {
  id: string
  firstName: string
  lastName: string
  grade: string
  parentPhone: string
  daysUntilPayment: number
  routeId: string (permanent assignment)
  route: Route
  isClaimed: boolean
}
```

**What it represents**: Student using the transport service
**Key point**: Child is assigned to a **route**, not directly to a driver

---

### 5. Trip Entity (Daily Instance)
```
Trip {
  id: string
  routeId: string (template it came from)
  busId: string
  driverId: string (can override route's default driver)
  date: DateTime
  status: TripStatus
}
```

**What it represents**: An actual bus run on a specific day
**Key point**: Generated daily from routes, driver can be overridden

---

## 🔄 How It Works in Practice

### Scenario 1: Normal Day (No Changes)

**Setup**:
- Bus "GE-1234-21" → Driver "Uncle Kofi"
- Route "Bus 1 - Morning" → Bus "GE-1234-21"
- Children: Ama, Kofi, Esi → Route "Bus 1 - Morning"

**What happens daily**:
1. System generates Trip from Route "Bus 1 - Morning"
2. Trip automatically gets:
   - `busId` = GE-1234-21
   - `driverId` = Uncle Kofi (from bus's default driver)
   - Children = Ama, Kofi, Esi (from route's children)

**Driver sees**: All their assigned children, no admin action needed

---

### Scenario 2: Substitute Driver for One Day

**Setup**: Same as above, but Uncle Kofi is sick today

**Admin action**:
1. Open today's Trip
2. Change `driverId` to "Uncle Mensah" (substitute)
3. Save

**Result**:
- Today's trip → Uncle Mensah drives
- Tomorrow's trip → Back to Uncle Kofi (default)
- Children assignments → **Unchanged**

**Key benefit**: No need to update child records or routes

---

### Scenario 3: Permanent Driver Change

**Setup**: Uncle Kofi permanently switches to a different bus

**Admin action**:
1. Update Bus "GE-1234-21" → Change `driverId` to "Uncle Mensah"
2. That's it!

**Result**:
- All future trips → Uncle Mensah
- All children on that bus's routes → Automatically see new driver
- No child records touched

---

### Scenario 4: Child Switches Routes

**Setup**: Ama moves to a different neighborhood

**Admin action**:
1. Update Child "Ama" → Change `routeId` to "Bus 2 - Morning"
2. Done

**Result**:
- Ama now appears on Bus 2's trips
- Old route's children list → No longer includes Ama
- Happens automatically from next trip onwards

---

## 🏫 Onboarding Flow (School Integration)

### Step 1: Admin Sets Up Infrastructure

**A. Create Buses**:
```
Bus 1: GE-1234-21, Capacity: 30
Bus 2: GR-5678-21, Capacity: 25
```

**B. Create Drivers**:
```
Driver 1: Uncle Kofi, License: DL12345
Driver 2: Uncle Mensah, License: DL67890
```

**C. Link Drivers to Buses**:
```
Bus GE-1234-21 → Driver Uncle Kofi
Bus GR-5678-21 → Driver Uncle Mensah
```

**D. Create Routes**:
```
Route R1: "Bus 1 - Morning Pickup"
  ├─ busId: GE-1234-21
  ├─ shift: MORNING
  └─ school: Sunnydale Primary

Route R2: "Bus 1 - Afternoon Dropoff"
  ├─ busId: GE-1234-21
  ├─ shift: AFTERNOON
  └─ school: Sunnydale Primary
```

---

### Step 2: Bulk Onboard Children

**CSV Format**:
```csv
First Name,Last Name,Grade,Parent Phone,Days Until Payment,Route Code
Ama,Boateng,Grade 1,0241234567,30,R1
Kofi,Mensah,Grade 3,0241234567,30,R1
Esi,Addo,Grade 2,0245678901,15,R2
```

**What happens**:
1. System creates Child records
2. Looks up Route by `Route Code`
3. Assigns `child.routeId = route.id`
4. Children are now:
   - ⏳ Unclaimed (waiting for parents)
   - ✅ Already assigned to correct driver via route → bus → driver

---

### Step 3: Generate Family Codes

Admin groups children by parent phone:
```
Parent: 0241234567
  ├─ Ama Boateng (Route R1)
  └─ Kofi Mensah (Route R1)
→ Generate Code: ROS1234
```

Both children get code `ROS1234`

---

### Step 4: Parent Claims Children

Parent enters `ROS1234` in app:
- Sees: "Ama Boateng - Grade 1 - 30 days until payment"
- Sees: "Kofi Mensah - Grade 3 - 30 days until payment"
- Fills: Home location, allergies
- Submits

Result:
- `child.isClaimed = true`
- `child.parentId = parent.id`
- Route assignment → **Unchanged**
- Driver still sees them → **Unchanged**

---

## 🧪 Testing Exercise

Use these scenarios to understand and test the system:

### Exercise 1: Basic Setup

**Goal**: Set up a simple transport system

**Steps**:
1. Create 1 bus: "ABC-1234", Capacity: 20
2. Create 1 driver: "John Doe", License: "DL001"
3. Link driver to bus
4. Create 1 route: "Morning Run" on that bus
5. Onboard 3 children to that route

**Verify**:
- [ ] All 3 children have `routeId` set
- [ ] Route's bus has correct driver
- [ ] When you view the route, you see all 3 children

---

### Exercise 2: Substitute Driver

**Goal**: Test daily driver override

**Steps**:
1. Using Exercise 1 setup
2. Create another driver: "Jane Smith"
3. For today's trip, change driver to Jane Smith
4. Check tomorrow's trip

**Verify**:
- [ ] Today's trip → Driver: Jane Smith
- [ ] Tomorrow's trip (auto-generated) → Driver: John Doe
- [ ] Children list → Identical on both trips
- [ ] No child records were modified

---

### Exercise 3: Permanent Driver Change

**Goal**: Test bus driver reassignment

**Steps**:
1. Using Exercise 1 setup
2. Update Bus "ABC-1234" → Change primary driver to "Jane Smith"
3. Wait for next auto-generated trip

**Verify**:
- [ ] New trips → Driver: Jane Smith
- [ ] Old completed trips → Still show John Doe
- [ ] Children still on same route
- [ ] No manual updates needed

---

### Exercise 4: Child Route Change

**Goal**: Test moving a child to different route

**Steps**:
1. Set up 2 routes (R1 and R2) on different buses
2. Onboard Child "Amy" to R1
3. Move Amy from R1 to R2

**Verify**:
- [ ] Amy's `routeId` changed to R2
- [ ] R1's children list no longer includes Amy
- [ ] R2's children list now includes Amy
- [ ] Amy now appears on R2's bus trips
- [ ] Amy's driver automatically changed (via route → bus → driver)

---

### Exercise 5: Family Code & Claiming

**Goal**: Test parent claiming with route assignment intact

**Steps**:
1. Onboard 2 children (siblings) with same parent phone to Route R1
2. Generate family code for that parent phone
3. Parent uses code to claim children

**Verify**:
- [ ] Both children marked as `isClaimed = true`
- [ ] Both children's `routeId` → Still R1 (unchanged)
- [ ] Both children still appear on R1's trips
- [ ] Parent can now see both children in their app
- [ ] Driver still sees same children on their manifest

---

### Exercise 6: Real-World Scenario

**Goal**: Simulate 1 week of operations

**Day 1 (Monday)**:
- Onboard 50 children across 3 routes
- Generate family codes
- 10 parents claim their children

**Day 2 (Tuesday)**:
- Driver A calls in sick
- Assign substitute driver to their route
- 15 more parents claim children

**Day 3 (Wednesday)**:
- 1 child moves to different route (changed address)
- Update child's route assignment
- 20 more parents claim

**Day 4 (Thursday)**:
- Permanently reassign 1 driver to different bus
- Continue normal operations

**Day 5 (Friday)**:
- All children claimed
- Generate weekly report

**Verify**:
- [ ] No disruption when substitute driver used (Day 2)
- [ ] Child route change only affected that 1 child (Day 3)
- [ ] Permanent driver change applied to all future trips (Day 4)
- [ ] Claiming process never touched route assignments
- [ ] All trips have correct children lists throughout

---

## 💡 Key Takeaways

1. **Children are stable** → Assigned to routes (rarely change)
2. **Drivers are flexible** → Can change daily or permanently without touching children
3. **No direct child-driver link** → Always go through: Child → Route → Bus → Driver
4. **Claiming is separate** → Parents claiming children doesn't affect driver assignments
5. **Daily vs Permanent** → Trips allow daily overrides, Bus assignment is default

---

## 🎯 Implementation Checklist

### Backend Schema:
- [ ] Add `routeId` to Child model
- [ ] Add `busId` to Route model
- [ ] Update Trip to allow driver override
- [ ] Create indexes for performance

### Admin Dashboard:
- [ ] Bus management (CRUD)
- [ ] Driver management (CRUD)
- [ ] Link driver to bus interface
- [ ] Route management with bus selection
- [ ] Children onboarding with route assignment
- [ ] Daily trip management with driver override

### CSV Import:
- [ ] Add "Route Code" column
- [ ] Validate route codes during import
- [ ] Auto-assign children to routes

### APIs:
- [ ] GET /routes → List all routes with bus + driver info
- [ ] POST /children/bulk-onboard → Accept route code
- [ ] PATCH /trips/:id/driver → Override driver for specific trip
- [ ] GET /driver/trips/:date → Get driver's trips for a date

---

This model gives you the **stability of route assignments** with the **flexibility of driver scheduling**. Perfect for real-world school transport operations! 🚌✨
