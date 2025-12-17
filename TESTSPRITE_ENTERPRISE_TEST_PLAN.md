# ROSAgo Enterprise-Grade Test Plan for TestSprite

**Project**: ROSAgo - School Transport Management System  
**Test Coverage Goal**: 100% - Production Ready  
**Quality Standard**: Enterprise Grade - Zero Critical Bugs  
**Generated**: 2025-12-16

---

## 📋 TEST EXECUTION SUMMARY

### Test Categories
1. **Authentication & Authorization** (12 tests)
2. **Multi-Tenancy & Data Isolation** (8 tests)
3. **Child Onboarding & Linking** (15 tests)
4. **Bus & Driver Management** (10 tests)
5. **Route & Stop Management** (12 tests)
6. **Scheduled Routes & Trip Generation** (18 tests)
7. **Real-Time GPS Tracking** (14 tests)
8. **Attendance Management** (10 tests)
9. **Early Pickup Requests** (8 tests)
10. **Location Change Requests** (8 tests)
11. **Payment Processing** (12 tests)
12. **Notifications System** (10 tests)
13. **WebSocket/Real-Time Events** (12 tests)
14. **Admin Dashboard** (15 tests)
15. **Driver Mobile App** (18 tests)
16. **Parent Mobile App** (20 tests)
17. **Analytics & Reporting** (8 tests)
18. **Edge Cases & Error Handling** (25 tests)
19. **Performance & Load Testing** (10 tests)
20. **Security & Data Protection** (12 tests)

**Total Tests**: 257 comprehensive test cases

---

## 🎯 CRITICAL BUSINESS FLOWS (Priority 1)

### 1. AUTHENTICATION & AUTHORIZATION TESTS

#### Test 1.1: Platform Admin Login Flow
- **Given**: Platform admin credentials (admin@example.com / password)
- **When**: User logs in via admin-web
- **Then**: 
  - ✓ JWT access token and refresh token returned
  - ✓ User redirected to platform dashboard
  - ✓ Can access all companies
  - ✓ Cannot access company-specific routes without selection

#### Test 1.2: Company Admin Login Flow
- **Given**: Company admin credentials
- **When**: User logs in via admin-web or mobile
- **Then**:
  - ✓ Access restricted to own company data only
  - ✓ Can see all schools under company
  - ✓ Dashboard shows company-wide stats
  - ✓ Cannot view other companies' data

#### Test 1.3: Driver Login Flow
- **Given**: Driver credentials with assigned bus
- **When**: Driver logs in via mobile app
- **Then**:
  - ✓ Driver role authenticated
  - ✓ Can see assigned buses and routes
  - ✓ Cannot access admin functions
  - ✓ Cannot see other drivers' trips

#### Test 1.4: Parent Login Flow
- **Given**: Parent credentials with linked children
- **When**: Parent logs in via mobile app
- **Then**:
  - ✓ Parent role authenticated
  - ✓ Can only see own children
  - ✓ Cannot access admin or driver functions
  - ✓ Can view children's bus locations

#### Test 1.5: Token Refresh Mechanism
- **Given**: Expired access token but valid refresh token
- **When**: API request made with expired token
- **Then**:
  - ✓ Auto-refresh triggered
  - ✓ New access token issued
  - ✓ Original request retries successfully
  - ✓ User not logged out

#### Test 1.6: Invalid Credentials Handling
- **Given**: Wrong email or password
- **When**: Login attempted
- **Then**:
  - ✓ HTTP 401 Unauthorized returned
  - ✓ Clear error message shown
  - ✓ No token issued
  - ✓ No sensitive data leaked in error

#### Test 1.7: Role-Based Access Control (RBAC)
- **Given**: Parent account
- **When**: Attempts to access `/admin/buses` endpoint
- **Then**:
  - ✓ HTTP 403 Forbidden returned
  - ✓ Request rejected
  - ✓ Audit log created
  - ✓ No data exposure

#### Test 1.8: Password Reset Flow
- **Given**: User clicks "Forgot Password"
- **When**: Email entered and reset initiated
- **Then**:
  - ✓ Reset token generated
  - ✓ Email sent to user (mock/real)
  - ✓ Token expires after 1 hour
  - ✓ New password can be set

#### Test 1.9: Multi-Device Login
- **Given**: User logged in on mobile
- **When**: Same user logs in on web
- **Then**:
  - ✓ Both sessions active
  - ✓ Different refresh tokens issued
  - ✓ No session conflicts
  - ✓ Both can make API calls

#### Test 1.10: Session Timeout
- **Given**: User inactive for extended period
- **When**: Access token expires
- **Then**:
  - ✓ Auto-refresh attempted
  - ✓ If refresh fails, logout triggered
  - ✓ User redirected to login
  - ✓ Clear session cleanup

#### Test 1.11: Concurrent Login Prevention (if required)
- **Given**: Business rule to prevent concurrent logins
- **When**: Second login from different device
- **Then**:
  - ✓ First session invalidated (if configured)
  - ✓ Or both allowed (if configured)
  - ✓ User notified appropriately

#### Test 1.12: Logout & Token Cleanup
- **Given**: Authenticated user
- **When**: User clicks logout
- **Then**:
  - ✓ Tokens cleared from storage
  - ✓ WebSocket disconnected
  - ✓ User redirected to login
  - ✓ No lingering session data

---

### 2. MULTI-TENANCY & DATA ISOLATION TESTS

#### Test 2.1: Company Data Isolation
- **Given**: Two companies (Company A, Company B)
- **When**: Company A admin queries children
- **Then**:
  - ✓ Only Company A children returned
  - ✓ No Company B data visible
  - ✓ Database query includes companyId filter
  - ✓ Cross-company data leaks prevented

#### Test 2.2: School-Level Isolation
- **Given**: School 1 and School 2 under same company
- **When**: Admin queries school-specific data
- **Then**:
  - ✓ Data filtered by schoolId
  - ✓ Children belong to correct school
  - ✓ Routes associated with correct school

#### Test 2.3: Driver Access Restriction
- **Given**: Driver assigned to Bus A
- **When**: Driver queries trip data
- **Then**:
  - ✓ Only sees trips for assigned buses
  - ✓ Cannot see other drivers' trips
  - ✓ Cannot modify other drivers' data

#### Test 2.4: Parent Access Restriction
- **Given**: Parent with 2 linked children
- **When**: Parent queries children
- **Then**:
  - ✓ Only sees own children
  - ✓ Cannot see other parents' children
  - ✓ Cannot access unlinked children

#### Test 2.5: Cross-Tenant API Exploitation Prevention
- **Given**: Valid token for Company A
- **When**: Attempts to access Company B's busId
- **Then**:
  - ✓ HTTP 403 Forbidden or 404 Not Found
  - ✓ Data not returned
  - ✓ Audit log created
  - ✓ Security alert triggered (if configured)

#### Test 2.6: UUID Guessing Prevention
- **Given**: Attacker tries random UUIDs
- **When**: Queries `/children/:id` with random UUID
- **Then**:
  - ✓ Returns 404 if not found
  - ✓ Returns 403 if found but wrong tenant
  - ✓ No data enumeration possible
  - ✓ Rate limiting applied (if configured)

#### Test 2.7: Company-Level Base Fare
- **Given**: Company A has baseFare 50000 UGX, Company B has 60000 UGX
- **When**: Payment calculated for each company
- **Then**:
  - ✓ Correct fare applied per company
  - ✓ No cross-company fare pollution
  - ✓ Fare history tracked separately

#### Test 2.8: Audit Log Isolation
- **Given**: Actions by Company A and Company B
- **When**: Company A admin views audit logs
- **Then**:
  - ✓ Only sees Company A actions
  - ✓ Timestamps accurate
  - ✓ User attribution correct

---

### 3. CHILD ONBOARDING & LINKING TESTS

#### Test 3.1: Bulk Child Onboarding by Admin
- **Given**: Admin uploads CSV with 50 children
- **When**: Bulk onboard API called
- **Then**:
  - ✓ All 50 children created
  - ✓ Unique codes generated for each (8-char alphanumeric)
  - ✓ No duplicate unique codes
  - ✓ All belong to correct school
  - ✓ `isClaimed` = false for all
  - ✓ `parentId` = null for all

#### Test 3.2: Unique Code Generation Uniqueness
- **Given**: 1000 children onboarded
- **When**: Unique codes generated
- **Then**:
  - ✓ All codes unique (no collisions)
  - ✓ Format: 8-char alphanumeric (no ROS prefix per memory)
  - ✓ Codes stored in database
  - ✓ Queryable by uniqueCode

#### Test 3.3: Parent Links Child Using Unique Code
- **Given**: Parent has account, child exists with uniqueCode "ABC12345"
- **When**: Parent enters "ABC12345" and home location
- **Then**:
  - ✓ Child linked to parent (parentId set)
  - ✓ `isClaimed` = true
  - ✓ Home location saved (lat, lng, address)
  - ✓ Child appears in parent's dashboard

#### Test 3.4: Duplicate Linking Prevention
- **Given**: Child already linked to Parent A
- **When**: Parent B tries to link same uniqueCode
- **Then**:
  - ✓ HTTP 400 Bad Request
  - ✓ Error: "Child already linked"
  - ✓ No change to database
  - ✓ Original link intact

#### Test 3.5: Invalid Unique Code Handling
- **Given**: Parent enters non-existent code "INVALID1"
- **When**: Link attempt made
- **Then**:
  - ✓ HTTP 404 Not Found
  - ✓ Error: "Invalid child code"
  - ✓ No partial data created

#### Test 3.6: Child Assignment to Route
- **Given**: Child created, Route exists
- **When**: Admin assigns child to route
- **Then**:
  - ✓ `routeId` updated
  - ✓ Child added to today's trips (if trips exist)
  - ✓ Attendance records created (status: PENDING)
  - ✓ Driver can see child in roster

#### Test 3.7: Child Reassignment Between Routes
- **Given**: Child on Route A
- **When**: Admin reassigns to Route B
- **Then**:
  - ✓ `routeId` updated to Route B
  - ✓ Child added to Route B's today trips
  - ✓ Not removed from completed Route A trips (historical)
  - ✓ Future trips use Route B

#### Test 3.8: Home Location Update
- **Given**: Child with home location
- **When**: Parent updates home location
- **Then**:
  - ✓ Location change request created (status: PENDING)
  - ✓ Admin notified
  - ✓ Old location preserved until approved
  - ✓ New location not active until approved

#### Test 3.9: Bulk Grade Promotion (Annual)
- **Given**: End of school year, 200 children in Grade 1
- **When**: Admin triggers bulk promotion
- **Then**:
  - ✓ All Grade 1 → Grade 2
  - ✓ Repeated students excluded (if IDs provided)
  - ✓ Grade 12 → "Graduated"
  - ✓ Operation atomic (all or none)

#### Test 3.10: Child Profile Completeness Validation
- **Given**: Child onboarded with minimal data
- **When**: Parent attempts to link
- **Then**:
  - ✓ Can link if required fields present
  - ✓ Optional fields can be updated later
  - ✓ Validation errors clear and actionable

#### Test 3.11: Special Instructions & Allergies
- **Given**: Child with allergies and special instructions
- **When**: Driver views child details
- **Then**:
  - ✓ Allergies displayed prominently
  - ✓ Special instructions visible
  - ✓ Color code displayed for quick ID

#### Test 3.12: Child Deletion (Soft Delete Recommended)
- **Given**: Child needs to be removed
- **When**: Admin deletes child
- **Then**:
  - ✓ Child marked inactive (or hard deleted)
  - ✓ Historical trip data preserved
  - ✓ Parent notified (if applicable)
  - ✓ Unique code released (or not reused)

#### Test 3.13: Unclaimed Children Visibility
- **Given**: 10 children onboarded, 5 unclaimed
- **When**: Admin views children list
- **Then**:
  - ✓ Can filter by `isClaimed` status
  - ✓ Unclaimed children highlighted
  - ✓ Unique codes visible for sharing

#### Test 3.14: Parent Phone Number Tracking
- **Given**: Child onboarded with parentPhone
- **When**: Parent links child
- **Then**:
  - ✓ Parent's registered phone matches parentPhone (optional validation)
  - ✓ Mismatch handled appropriately
  - ✓ Contact info synchronized

#### Test 3.15: Color Code Assignment
- **Given**: Child onboarded
- **When**: Admin or system assigns color code
- **Then**:
  - ✓ Default: #3B82F6 (blue)
  - ✓ Admin can customize
  - ✓ Driver sees color on map/roster
  - ✓ Helps quick visual identification

---

### 4. BUS & DRIVER MANAGEMENT TESTS

#### Test 4.1: Bus Creation
- **Given**: Admin wants to add new bus
- **When**: Bus created with plate "UBF 123X", capacity 30
- **Then**:
  - ✓ Bus saved to database
  - ✓ Plate number unique
  - ✓ Capacity validated (> 0)
  - ✓ Belongs to correct company

#### Test 4.2: Duplicate Plate Number Prevention
- **Given**: Bus with plate "UBF 123X" exists
- **When**: Admin tries to create bus with same plate
- **Then**:
  - ✓ HTTP 400 Bad Request
  - ✓ Error: "Plate number already exists"
  - ✓ No duplicate created

#### Test 4.3: Driver Creation & License Validation
- **Given**: User with role DRIVER
- **When**: Driver profile created with license "DL123456"
- **Then**:
  - ✓ Driver record created
  - ✓ License number unique
  - ✓ Linked to user account
  - ✓ Can be assigned to buses

#### Test 4.4: Bus Assignment to Driver
- **Given**: Bus and Driver exist
- **When**: Admin assigns Driver to Bus
- **Then**:
  - ✓ `driverId` set on bus
  - ✓ Driver can see bus in mobile app
  - ✓ Only assigned driver can operate bus

#### Test 4.5: Driver Reassignment
- **Given**: Driver A assigned to Bus 1
- **When**: Admin reassigns to Driver B
- **Then**:
  - ✓ `driverId` updated to Driver B
  - ✓ Driver A loses access
  - ✓ Driver B gains access
  - ✓ Active trips handled appropriately

#### Test 4.6: Multiple Buses Per Driver
- **Given**: Driver can manage multiple buses
- **When**: Driver assigned to Bus 1 and Bus 2
- **Then**:
  - ✓ Driver sees both buses
  - ✓ Can switch between buses
  - ✓ Trips scoped per bus

#### Test 4.7: Bus Capacity Enforcement
- **Given**: Bus capacity = 30
- **When**: Admin assigns 35 children to route using this bus
- **Then**:
  - ✓ Warning shown (capacity exceeded)
  - ✓ Assignment allowed (soft limit) or rejected (hard limit)
  - ✓ Admin notified

#### Test 4.8: Bus Deletion
- **Given**: Bus with no active trips
- **When**: Admin deletes bus
- **Then**:
  - ✓ Bus deleted or marked inactive
  - ✓ Historical trips preserved
  - ✓ Routes using bus updated

#### Test 4.9: Driver Profile Update
- **Given**: Driver profile exists
- **When**: Admin updates license or details
- **Then**:
  - ✓ Changes saved
  - ✓ Driver sees updates in app
  - ✓ Audit log created

#### Test 4.10: Bus-Driver-Route Association
- **Given**: Bus 1, Driver 1, Route 1
- **When**: All three linked in scheduled route
- **Then**:
  - ✓ Driver sees Route 1 children
  - ✓ Bus location tracked for Route 1
  - ✓ Trips generated correctly

---

### 5. ROUTE & STOP MANAGEMENT TESTS

#### Test 5.1: Route Creation with Stops
- **Given**: Admin creates route "Morning Route A"
- **When**: Route created with 5 stops (ordered)
- **Then**:
  - ✓ Route saved with correct schoolId
  - ✓ Stops created in order (order: 1, 2, 3, 4, 5)
  - ✓ Lat/lng saved for each stop
  - ✓ Route name unique within school

#### Test 5.2: Stop Ordering Validation
- **Given**: Route with 5 stops
- **When**: Stops queried
- **Then**:
  - ✓ Returned in correct order (order ASC)
  - ✓ Order numbers sequential
  - ✓ No gaps in order

#### Test 5.3: Route Assignment to Bus
- **Given**: Route exists, Bus exists
- **When**: Admin assigns Bus to Route
- **Then**:
  - ✓ `busId` set on route
  - ✓ Bus can operate this route
  - ✓ Children on route can be tracked via bus

#### Test 5.4: Route Shift Configuration
- **Given**: Route can be MORNING or AFTERNOON
- **When**: Admin sets shift = "MORNING"
- **Then**:
  - ✓ Shift saved correctly
  - ✓ Trip generation respects shift timing
  - ✓ Driver sees shift indicator

#### Test 5.5: Stop Update & Reordering
- **Given**: Route with 5 stops
- **When**: Admin reorders: Stop 3 becomes Stop 1
- **Then**:
  - ✓ Order updated correctly
  - ✓ No duplicate order numbers
  - ✓ Driver sees updated order

#### Test 5.6: Stop Deletion
- **Given**: Route with 5 stops
- **When**: Admin deletes Stop 3
- **Then**:
  - ✓ Stop removed
  - ✓ Order re-calculated (1,2,3,4)
  - ✓ Route still functional

#### Test 5.7: Route Without Stops (Edge Case)
- **Given**: Route created
- **When**: No stops added
- **Then**:
  - ✓ Route exists but incomplete
  - ✓ Warning shown to admin
  - ✓ Cannot generate trips until stops added

#### Test 5.8: Route with Children But No Bus
- **Given**: Route has 10 children, no bus assigned
- **When**: Scheduled route created
- **Then**:
  - ✓ Requires busId (validation error)
  - ✓ Or allows null and warns admin
  - ✓ Trips cannot be generated without bus

#### Test 5.9: Route Duplication
- **Given**: Existing route "Morning Route A"
- **When**: Admin duplicates route
- **Then**:
  - ✓ New route created with same stops
  - ✓ New unique ID
  - ✓ Name differentiated (e.g., "Morning Route A (Copy)")

#### Test 5.10: Route Deletion with Children Assigned
- **Given**: Route with 20 children assigned
- **When**: Admin deletes route
- **Then**:
  - ✓ Warning: "X children assigned"
  - ✓ Requires confirmation
  - ✓ Children's routeId set to null
  - ✓ Historical trips preserved

#### Test 5.11: Stop Geo-Coordinates Validation
- **Given**: Admin adds stop
- **When**: Invalid lat/lng entered (e.g., lat = 200)
- **Then**:
  - ✓ Validation error: "Invalid coordinates"
  - ✓ Stop not created
  - ✓ Clear error message

#### Test 5.12: Route Visualization on Map
- **Given**: Route with stops
- **When**: Admin or driver views map
- **Then**:
  - ✓ All stops plotted
  - ✓ Connected in order
  - ✓ Children's homes visible (driver view)
  - ✓ Interactive and zoomable

---

### 6. SCHEDULED ROUTES & TRIP GENERATION TESTS

#### Test 6.1: Scheduled Route Creation
- **Given**: Route, Driver, Bus exist
- **When**: Admin creates scheduled route (Mon-Fri, 7:00 AM)
- **Then**:
  - ✓ ScheduledRoute created
  - ✓ `recurringDays` = [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY]
  - ✓ `scheduledTime` = "07:00"
  - ✓ Status = ACTIVE
  - ✓ Auto-assign children enabled

#### Test 6.2: Automatic Trip Generation at 2 AM
- **Given**: Scheduled routes for today (e.g., Monday)
- **When**: Cron job runs at 2 AM
- **Then**:
  - ✓ Trips created for all active scheduled routes
  - ✓ Each trip has correct routeId, busId, driverId
  - ✓ Attendance records created for all children on route
  - ✓ Trip status = SCHEDULED

#### Test 6.3: Duplicate Trip Prevention
- **Given**: Trips auto-generated at 2 AM
- **When**: Admin clicks "Generate Trips" manually at 8 AM
- **Then**:
  - ✓ System checks for existing trips
  - ✓ Message: "Trips already generated at 02:00 AM"
  - ✓ No duplicate trips created
  - ✓ Clear feedback to admin

#### Test 6.4: Manual Trip Generation (First Time)
- **Given**: No trips generated for today
- **When**: Admin clicks "Generate Trips" at 8 AM
- **Then**:
  - ✓ Trips created for all active scheduled routes
  - ✓ Timestamp recorded
  - ✓ Subsequent clicks show: "Trips manually generated at 08:00 AM"

#### Test 6.5: Scheduled Route Activation
- **Given**: Scheduled route with status = INACTIVE
- **When**: Admin clicks "Activate"
- **Then**:
  - ✓ Status = ACTIVE
  - ✓ Included in tomorrow's trip generation
  - ✓ Driver notified (optional)

#### Test 6.6: Scheduled Route Suspension
- **Given**: Active scheduled route
- **When**: Admin clicks "Suspend"
- **Then**:
  - ✓ Status = SUSPENDED
  - ✓ Excluded from future trip generation
  - ✓ Existing trips unaffected
  - ✓ Can be reactivated

#### Test 6.7: Effective Date Range for Scheduled Routes
- **Given**: Scheduled route effectiveFrom = 2025-01-01, effectiveUntil = 2025-03-31
- **When**: Trip generation runs on 2025-02-15
- **Then**:
  - ✓ Trip generated (within range)
  - ✓ Not generated before 2025-01-01
  - ✓ Not generated after 2025-03-31

#### Test 6.8: Day-of-Week Filtering
- **Given**: Scheduled route for Mon, Wed, Fri
- **When**: Trip generation runs on Tuesday
- **Then**:
  - ✓ No trip generated for this route
  - ✓ Other routes (including Tuesday) generated

#### Test 6.9: Children Auto-Assignment to Trips
- **Given**: Child assigned to Route A
- **When**: Trip generated for Route A
- **Then**:
  - ✓ ChildAttendance record created
  - ✓ Status = PENDING
  - ✓ recordedBy = "system"

#### Test 6.10: Trip Status Transitions
- **Given**: Trip with status = SCHEDULED
- **When**: Driver starts trip
- **Then**:
  - ✓ Status → IN_PROGRESS
  - ✓ `startTime` set
  - ✓ TripHistory record created
  - ✓ Invalid transitions rejected (e.g., SCHEDULED → COMPLETED)

#### Test 6.11: Trip Completion
- **Given**: Trip IN_PROGRESS
- **When**: Driver marks trip complete
- **Then**:
  - ✓ Status → COMPLETED
  - ✓ `endTime` set
  - ✓ All attendances finalized
  - ✓ No further updates allowed

#### Test 6.12: Multi-Trip Per Day (Morning & Afternoon)
- **Given**: School has morning (7 AM) and afternoon (3 PM) routes
- **When**: Trips generated
- **Then**:
  - ✓ Two trips per route per day
  - ✓ Different scheduledTime
  - ✓ Same children, bus, driver
  - ✓ Independent status tracking

#### Test 6.13: Daily Trip Override (Manual Edit)
- **Given**: Trip generated for Driver A, Bus 1
- **When**: Admin overrides: assign Driver B, Bus 2 for this trip only
- **Then**:
  - ✓ Trip updated with new driverId, busId
  - ✓ Scheduled route unchanged
  - ✓ Future trips use original schedule
  - ✓ One-time change only

#### Test 6.14: Trip Exception Handling (Child Skips Trip)
- **Given**: Parent requests child skip trip
- **When**: Trip exception created
- **Then**:
  - ✓ Child's attendance status = MISSED (or marked as excused)
  - ✓ Driver sees indicator
  - ✓ No pickup required

#### Test 6.15: Trip Without Children (Edge Case)
- **Given**: Route with no children assigned
- **When**: Trip generated
- **Then**:
  - ✓ Trip created but empty
  - ✓ Warning to admin
  - ✓ Driver sees "No children on this trip"

#### Test 6.16: Historical Trip Preservation
- **Given**: 30 days of completed trips
- **When**: Admin queries trip history
- **Then**:
  - ✓ All trips retrievable
  - ✓ Attendance records intact
  - ✓ Can generate reports

#### Test 6.17: Trip Deletion (Admin)
- **Given**: Trip not yet started
- **When**: Admin deletes trip
- **Then**:
  - ✓ Trip removed
  - ✓ Attendance records deleted
  - ✓ Driver no longer sees trip

#### Test 6.18: Recurring Day Update for Scheduled Route
- **Given**: Scheduled route for Mon, Wed, Fri
- **When**: Admin adds Tuesday
- **Then**:
  - ✓ `recurringDays` updated
  - ✓ Next Tuesday, trip generated
  - ✓ No retroactive trips

---

### 7. REAL-TIME GPS TRACKING TESTS

#### Test 7.1: Driver Sends GPS Update
- **Given**: Driver app running, location enabled
- **When**: GPS update sent (lat, lng, speed)
- **Then**:
  - ✓ WebSocket `gps_update` event received
  - ✓ Stored in Redis (TTL 300s)
  - ✓ Broadcasted to `bus:${busId}` room
  - ✓ Parent sees update in real-time

#### Test 7.2: GPS Heartbeat Persistence (Every 5th Heartbeat)
- **Given**: Driver sends GPS updates every 10s
- **When**: 5th heartbeat received
- **Then**:
  - ✓ Saved to `BusLocation` table
  - ✓ Heartbeats 1-4 not saved (only cached)
  - ✓ Database not overloaded

#### Test 7.3: Parent Subscribes to Bus Tracking
- **Given**: Parent with child on Bus 1
- **When**: Parent opens live tracking screen
- **Then**:
  - ✓ WebSocket `join_bus_room` sent
  - ✓ Joined `bus:1` room
  - ✓ Receives `bus_location` events
  - ✓ Map updates in real-time

#### Test 7.4: Multiple Parents Tracking Same Bus
- **Given**: 5 parents tracking Bus 1
- **When**: Driver sends GPS update
- **Then**:
  - ✓ All 5 parents receive update
  - ✓ Single broadcast to room (efficient)
  - ✓ No duplicate messages

#### Test 7.5: GPS Update with Invalid Data
- **Given**: GPS update with lat = null
- **When**: Update received
- **Then**:
  - ✓ Validation error
  - ✓ Update rejected
  - ✓ Error logged
  - ✓ No corrupt data saved

#### Test 7.6: GPS Update with Old Timestamp
- **Given**: GPS update timestamped 5 minutes ago
- **When**: Update received
- **Then**:
  - ✓ Accepted (driver may have been offline)
  - ✓ Or rejected if too stale (configurable)
  - ✓ Timestamp preserved

#### Test 7.7: Redis Unavailability Handling
- **Given**: Redis down
- **When**: GPS update received
- **Then**:
  - ✓ Warning logged
  - ✓ Update still broadcasted via WebSocket
  - ✓ Saved to database (if configured)
  - ✓ System degrades gracefully

#### Test 7.8: Bus Location History Retrieval
- **Given**: 50 GPS points saved for Bus 1
- **When**: Admin queries recent locations (limit 10)
- **Then**:
  - ✓ Last 10 locations returned
  - ✓ Ordered by timestamp DESC
  - ✓ Used for route playback

#### Test 7.9: Speed Calculation & Validation
- **Given**: GPS updates include speed
- **When**: Speed = 150 km/h (unrealistic)
- **Then**:
  - ✓ Accepted but flagged (data anomaly)
  - ✓ Or rejected (validation rule)
  - ✓ Admin notified of anomaly

#### Test 7.10: Driver Offline/Online Detection
- **Given**: Driver stops sending GPS updates
- **When**: 5 minutes pass
- **Then**:
  - ✓ Redis key expires
  - ✓ Parent sees "Last seen 5 min ago"
  - ✓ No stale location shown

#### Test 7.11: GPS Accuracy Reporting
- **Given**: GPS update includes accuracy (meters)
- **When**: Accuracy = 50m (low accuracy)
- **Then**:
  - ✓ Accuracy stored
  - ✓ Parent sees accuracy indicator
  - ✓ Low accuracy flagged

#### Test 7.12: Heading/Direction Tracking
- **Given**: GPS update includes heading
- **When**: Bus moving north (heading = 0°)
- **Then**:
  - ✓ Heading saved
  - ✓ Bus icon rotated on map
  - ✓ Direction of movement clear

#### Test 7.13: Multi-Bus Tracking (Admin Dashboard)
- **Given**: 10 buses active
- **When**: Admin opens live dashboard
- **Then**:
  - ✓ All 10 buses visible on map
  - ✓ Real-time updates for all
  - ✓ Click bus for details
  - ✓ Performance acceptable (no lag)

#### Test 7.14: GPS Update Rate Limiting (Anti-Spam)
- **Given**: Malicious client sends 100 updates/sec
- **When**: Rate limit threshold exceeded
- **Then**:
  - ✓ Excess updates dropped
  - ✓ Client warned or throttled
  - ✓ Server not overloaded

---

### 8. ATTENDANCE MANAGEMENT TESTS

#### Test 8.1: Mark Child Picked Up
- **Given**: Trip IN_PROGRESS, child status PENDING
- **When**: Driver marks child "Picked Up"
- **Then**:
  - ✓ Attendance status → PICKED_UP
  - ✓ Timestamp recorded
  - ✓ recordedBy = driverId
  - ✓ Parent notified (optional)

#### Test 8.2: Mark Child Dropped
- **Given**: Child PICKED_UP
- **When**: Driver marks "Dropped"
- **Then**:
  - ✓ Status → DROPPED
  - ✓ Timestamp recorded
  - ✓ Parent notified

#### Test 8.3: Mark Child Missed
- **Given**: Child PENDING, not at pickup point
- **When**: Driver marks "Missed"
- **Then**:
  - ✓ Status → MISSED
  - ✓ Parent notified immediately
  - ✓ Admin alerted (optional)

#### Test 8.4: Attendance Editing (After Trip)
- **Given**: Trip COMPLETED
- **When**: Admin edits attendance (PICKED_UP → MISSED)
- **Then**:
  - ✓ Change allowed (or restricted based on rules)
  - ✓ Audit log created
  - ✓ Reason required

#### Test 8.5: Bulk Attendance Marking
- **Given**: 20 children on trip
- **When**: Driver marks all "Picked Up" at once
- **Then**:
  - ✓ All statuses updated
  - ✓ Single transaction (atomic)
  - ✓ Fast operation

#### Test 8.6: Duplicate Attendance Prevention
- **Given**: Child already marked PICKED_UP
- **When**: Driver tries to mark again
- **Then**:
  - ✓ Warning: "Already picked up"
  - ✓ No duplicate record
  - ✓ Timestamp preserved

#### Test 8.7: Attendance Report Generation
- **Given**: 30 days of attendance data
- **When**: Admin generates attendance report
- **Then**:
  - ✓ Shows PICKED_UP, DROPPED, MISSED counts
  - ✓ Per child, per route, per day
  - ✓ Exportable (CSV/PDF)

#### Test 8.8: Attendance with Trip Exceptions
- **Given**: Child has trip exception (skip trip)
- **When**: Trip starts
- **Then**:
  - ✓ Child not in attendance list
  - ✓ Or marked as "Excused"
  - ✓ Driver not required to pick up

#### Test 8.9: Late Pickup Recording
- **Given**: Child picked up 30 min late
- **When**: Driver marks PICKED_UP
- **Then**:
  - ✓ Timestamp accurate
  - ✓ Delay calculated (vs scheduled time)
  - ✓ Flagged for admin review

#### Test 8.10: Attendance Rollback
- **Given**: Accidental marking (DROPPED instead of PICKED_UP)
- **When**: Driver corrects immediately
- **Then**:
  - ✓ Status updated
  - ✓ History preserved
  - ✓ Audit log shows correction

---

### 9. EARLY PICKUP REQUEST TESTS

#### Test 9.1: Parent Requests Early Pickup
- **Given**: Child on trip, parent needs early pickup
- **When**: Parent submits request (reason: "Doctor appointment")
- **Then**:
  - ✓ EarlyPickupRequest created (status: PENDING)
  - ✓ Linked to child and trip
  - ✓ Admin notified
  - ✓ Driver not yet notified

#### Test 9.2: Admin Approves Early Pickup
- **Given**: Pending early pickup request
- **When**: Admin approves
- **Then**:
  - ✓ Status → APPROVED
  - ✓ Driver notified via WebSocket
  - ✓ Parent notified
  - ✓ `approvedBy` = adminId, `approvedAt` set

#### Test 9.3: Admin Rejects Early Pickup
- **Given**: Pending request
- **When**: Admin rejects (reason: "Too late to accommodate")
- **Then**:
  - ✓ Status → REJECTED
  - ✓ Parent notified with reason
  - ✓ Driver not notified

#### Test 9.4: Driver Acknowledges Early Pickup
- **Given**: Approved early pickup request
- **When**: Driver receives notification
- **Then**:
  - ✓ Notification marked as acknowledged
  - ✓ Child highlighted in driver's roster
  - ✓ Special indicator on child card

#### Test 9.5: Duplicate Early Pickup Prevention
- **Given**: Early pickup already requested for child on trip
- **When**: Parent requests again
- **Then**:
  - ✓ Error: "Existing request pending"
  - ✓ No duplicate created
  - ✓ Show existing request status

#### Test 9.6: Early Pickup After Trip Started
- **Given**: Trip IN_PROGRESS, child already PICKED_UP
- **When**: Parent requests early pickup
- **Then**:
  - ✓ Request rejected (trip already in progress)
  - ✓ Or allowed with warning

#### Test 9.7: Early Pickup Cancellation (Parent)
- **Given**: Pending early pickup request
- **When**: Parent cancels request
- **Then**:
  - ✓ Status → CANCELLED
  - ✓ Admin notified
  - ✓ Removed from driver's view

#### Test 9.8: Early Pickup Time-of-Day Filtering
- **Given**: Early pickup request for "MORNING" trip
- **When**: Filtered by timeOfDay
- **Then**:
  - ✓ Only morning requests shown
  - ✓ Driver sees relevant requests for active trip

---

### 10. LOCATION CHANGE REQUEST TESTS

#### Test 10.1: Parent Requests Home Location Change
- **Given**: Child has home location A
- **When**: Parent requests change to location B (reason: "Moved house")
- **Then**:
  - ✓ LocationChangeRequest created (status: PENDING)
  - ✓ Old and new coordinates saved
  - ✓ Admin notified

#### Test 10.2: Admin Approves Location Change
- **Given**: Pending location change request
- **When**: Admin approves
- **Then**:
  - ✓ Child's homeLatitude, homeLongitude, homeAddress updated
  - ✓ Status → APPROVED, COMPLETED
  - ✓ Parent notified: "Location change approved"
  - ✓ `reviewedBy` and `reviewedAt` set

#### Test 10.3: Admin Rejects Location Change
- **Given**: Pending request
- **When**: Admin rejects (notes: "Out of route coverage")
- **Then**:
  - ✓ Status → REJECTED
  - ✓ Child's location unchanged
  - ✓ Parent notified with rejection reason

#### Test 10.4: Location Change Impact on Routes
- **Given**: Approved location change moves child far from current route
- **When**: Location updated
- **Then**:
  - ✓ Admin warned: "Child may need route reassignment"
  - ✓ Route not auto-changed (manual review)
  - ✓ Child still on current route until reassigned

#### Test 10.5: Duplicate Location Change Prevention
- **Given**: Pending location change exists
- **When**: Parent requests another change
- **Then**:
  - ✓ Error: "Existing request pending"
  - ✓ No duplicate created

#### Test 10.6: Location Change History
- **Given**: Child has 3 location changes over time
- **When**: Admin views history
- **Then**:
  - ✓ All changes listed
  - ✓ Old and new locations shown
  - ✓ Approval status and reviewer visible

#### Test 10.7: Location Change with Coordinates Validation
- **Given**: Parent enters invalid coordinates (lat = 500)
- **When**: Request submitted
- **Then**:
  - ✓ Validation error
  - ✓ Request not created
  - ✓ Clear error message

#### Test 10.8: Bulk Location Updates (Edge Case)
- **Given**: Multiple children moving to new area
- **When**: Admin bulk updates locations
- **Then**:
  - ✓ All updated atomically
  - ✓ Audit logs created
  - ✓ Parents notified

---

### 11. PAYMENT PROCESSING TESTS

#### Test 11.1: Create Payment Intent
- **Given**: Parent wants to pay 50000 UGX
- **When**: Payment initiated
- **Then**:
  - ✓ PaymentIntent created (status: pending)
  - ✓ Linked to parentId
  - ✓ `hubtleRef` generated
  - ✓ Amount and currency correct

#### Test 11.2: Payment Webhook Processing (Success)
- **Given**: Payment completed on Hubtle
- **When**: Webhook received (status: succeeded)
- **Then**:
  - ✓ Webhook signature validated
  - ✓ Added to BullMQ queue
  - ✓ Worker processes webhook
  - ✓ PaymentIntent status → succeeded

#### Test 11.3: Payment Webhook Processing (Failed)
- **Given**: Payment failed on Hubtle
- **When**: Webhook received (status: failed)
- **Then**:
  - ✓ PaymentIntent status → failed
  - ✓ Parent notified
  - ✓ Can retry payment

#### Test 11.4: Invalid Webhook Signature Rejection
- **Given**: Malicious webhook with invalid signature
- **When**: Webhook received
- **Then**:
  - ✓ HTTP 400 Bad Request
  - ✓ Webhook rejected
  - ✓ Security alert logged

#### Test 11.5: Payment History Retrieval
- **Given**: Parent made 5 payments
- **When**: Parent views payment history
- **Then**:
  - ✓ All 5 payments listed
  - ✓ Ordered by date DESC
  - ✓ Status and amount shown

#### Test 11.6: Company-Specific Base Fare
- **Given**: Company A fare = 50000, Company B fare = 60000
- **When**: Parent in Company A creates payment
- **Then**:
  - ✓ Amount = 50000 UGX
  - ✓ Company B parent pays 60000 UGX
  - ✓ No cross-contamination

#### Test 11.7: Fare History Tracking
- **Given**: Admin changes base fare from 50000 to 55000
- **When**: Fare updated
- **Then**:
  - ✓ FareHistory record created
  - ✓ Old fare, new fare, reason, changedBy saved
  - ✓ Existing payment intents unaffected

#### Test 11.8: Payment Receipt Generation
- **Given**: Successful payment
- **When**: Parent requests receipt
- **Then**:
  - ✓ Receipt generated (PDF/email)
  - ✓ Shows payment details, date, amount
  - ✓ Includes company info

#### Test 11.9: Duplicate Payment Prevention
- **Given**: Payment already in progress
- **When**: Parent tries to pay again
- **Then**:
  - ✓ Warning: "Payment pending"
  - ✓ No duplicate PaymentIntent created

#### Test 11.10: Payment Plan Selection
- **Given**: Multiple pricing plans exist (Basic, Premium)
- **When**: Parent selects plan
- **Then**:
  - ✓ Plan linked to payment
  - ✓ Correct amount charged
  - ✓ Plan benefits activated

#### Test 11.11: Payment Retry After Failure
- **Given**: Failed payment
- **When**: Parent retries
- **Then**:
  - ✓ New PaymentIntent created
  - ✓ Previous failed payment preserved
  - ✓ Can succeed on retry

#### Test 11.12: Payment Analytics
- **Given**: 100 payments over 30 days
- **When**: Admin views payment analytics
- **Then**:
  - ✓ Total revenue shown
  - ✓ Success rate calculated
  - ✓ Failed payments flagged

---

### 12. NOTIFICATIONS SYSTEM TESTS

#### Test 12.1: Create Notification
- **Given**: Event occurs (e.g., child picked up)
- **When**: Notification created for parent
- **Then**:
  - ✓ Notification saved to database
  - ✓ Linked to userId
  - ✓ `type` set correctly (e.g., PICKUP)
  - ✓ `isRead` = false

#### Test 12.2: Real-Time Notification Delivery via WebSocket
- **Given**: Parent connected via WebSocket
- **When**: Notification created
- **Then**:
  - ✓ Emitted to `user:${userId}` room
  - ✓ Parent receives instantly
  - ✓ Badge count updated

#### Test 12.3: Mark Notification as Read
- **Given**: Unread notification
- **When**: Parent clicks notification
- **Then**:
  - ✓ `isRead` = true
  - ✓ `readAt` timestamp set
  - ✓ Badge count decremented

#### Test 12.4: Bulk Mark All as Read
- **Given**: Parent has 10 unread notifications
- **When**: Parent clicks "Mark all read"
- **Then**:
  - ✓ All updated in single transaction
  - ✓ Badge count = 0

#### Test 12.5: Notification Requiring Acknowledgment (Driver)
- **Given**: Important notification (e.g., early pickup)
- **When**: Driver receives notification
- **Then**:
  - ✓ `requiresAck` = true
  - ✓ Driver must acknowledge
  - ✓ `acknowledgedAt` timestamp set on ack

#### Test 12.6: Notification Metadata Storage
- **Given**: Notification about location change request
- **When**: Notification created
- **Then**:
  - ✓ `relatedEntityType` = "LOCATION_CHANGE_REQUEST"
  - ✓ `relatedEntityId` = request ID
  - ✓ Metadata includes child info, old/new location

#### Test 12.7: Notification Types Coverage
- **Test All Types**: INFO, WARNING, ALERT, PICKUP, DROPOFF, DELAY, PAYMENT, SKIP_REQUEST, PARENT_PICKUP, UNSKIP_REQUEST, LOCATION_CHANGE_REQUEST, GRADE_UPDATE
- **Then**: ✓ Each type renders correctly in UI

#### Test 12.8: Notification Deletion
- **Given**: Old notifications
- **When**: Parent deletes notification
- **Then**:
  - ✓ Notification removed
  - ✓ Or soft deleted (archived)

#### Test 12.9: Notification Pagination
- **Given**: 200 notifications
- **When**: Parent loads notifications
- **Then**:
  - ✓ Paginated (20 per page)
  - ✓ Infinite scroll or "Load More"

#### Test 12.10: Notification Preferences (Optional)
- **Given**: Parent can configure preferences
- **When**: Parent disables "PICKUP" notifications
- **Then**:
  - ✓ PICKUP notifications not sent
  - ✓ Other types still sent

---

### 13. WEBSOCKET / REAL-TIME EVENTS TESTS

#### Test 13.1: WebSocket Connection with Valid Token
- **Given**: User has valid JWT
- **When**: WebSocket connection initiated
- **Then**:
  - ✓ Connection accepted
  - ✓ User authenticated
  - ✓ Joined user-specific room

#### Test 13.2: WebSocket Connection with Invalid Token
- **Given**: Invalid or expired token
- **When**: Connection attempted
- **Then**:
  - ✓ Connection rejected
  - ✓ Socket disconnected
  - ✓ Error logged

#### Test 13.3: Automatic Room Joining (Role-Based)
- **Given**: Driver logs in
- **When**: WebSocket connected
- **Then**:
  - ✓ Joined `role:DRIVER` room
  - ✓ Joined `company:${companyId}` room
  - ✓ Joined bus-specific rooms

#### Test 13.4: Join Bus Room
- **Given**: Parent tracking child on Bus 1
- **When**: `join_bus_room` event sent
- **Then**:
  - ✓ Joined `bus:1` room
  - ✓ Receives location updates

#### Test 13.5: Leave Bus Room
- **Given**: Parent in `bus:1` room
- **When**: `leave_bus_room` event sent
- **Then**:
  - ✓ Left room
  - ✓ No longer receives updates

#### Test 13.6: Ping/Pong Heartbeat
- **Given**: Connected client
- **When**: 25 seconds pass (pingInterval)
- **Then**:
  - ✓ Server sends ping
  - ✓ Client responds with pong
  - ✓ Connection maintained

#### Test 13.7: Connection Timeout
- **Given**: Client doesn't respond to ping
- **When**: 60 seconds pass (pingTimeout)
- **Then**:
  - ✓ Connection closed
  - ✓ User removed from rooms
  - ✓ Cleanup performed

#### Test 13.8: Reconnection Handling
- **Given**: Network disruption
- **When**: Client reconnects
- **Then**:
  - ✓ New connection established
  - ✓ Rooms re-joined
  - ✓ State synchronized

#### Test 13.9: Broadcast to Company Room
- **Given**: Admin action affects Company A
- **When**: Event broadcasted to `company:${companyId}`
- **Then**:
  - ✓ All Company A users receive event
  - ✓ Company B users don't receive

#### Test 13.10: Trip Tracking Subscription
- **Given**: Parent tracking specific trip
- **When**: `subscribe_trip_tracking` sent
- **Then**:
  - ✓ Joined `trip:${tripId}` room
  - ✓ Receives trip-specific updates

#### Test 13.11: Concurrent Connections (Same User)
- **Given**: User connected on mobile and web
- **When**: Both active
- **Then**:
  - ✓ Both receive updates
  - ✓ No conflicts
  - ✓ Different socket IDs

#### Test 13.12: WebSocket Scaling (Multiple Servers)
- **Given**: Horizontal scaling with Redis pub/sub
- **When**: Update on Server A
- **Then**:
  - ✓ Published to Redis
  - ✓ Server B receives and broadcasts
  - ✓ All clients updated

---

### 14. ADMIN DASHBOARD TESTS

#### Test 14.1: Overview Page - Company Stats
- **Given**: Company admin logged in
- **When**: Overview page loaded
- **Then**:
  - ✓ Total buses, drivers, children shown
  - ✓ Active trips count
  - ✓ Recent activity feed
  - ✓ Quick actions available

#### Test 14.2: Live Dashboard - All Buses
- **Given**: 10 buses active
- **When**: Live dashboard opened
- **Then**:
  - ✓ All buses plotted on map
  - ✓ Real-time location updates
  - ✓ Click bus for details
  - ✓ Filter by status (in-progress, scheduled)

#### Test 14.3: Children Management - CRUD
- **Given**: Admin on children page
- **When**: Creates, edits, deletes child
- **Then**:
  - ✓ Create: child added to database
  - ✓ Edit: changes saved
  - ✓ Delete: confirmation required, child removed

#### Test 14.4: Bulk Child Onboarding via CSV
- **Given**: CSV with 100 children
- **When**: Admin uploads CSV
- **Then**:
  - ✓ File parsed
  - ✓ Validation performed
  - ✓ All children created
  - ✓ Unique codes generated
  - ✓ Success summary shown

#### Test 14.5: Bus Assignment Interface
- **Given**: Admin wants to assign child to bus
- **When**: Selects child, selects route (bus)
- **Then**:
  - ✓ `routeId` updated
  - ✓ Child added to today's trips
  - ✓ UI reflects change instantly

#### Test 14.6: Driver Management - Assign Bus
- **Given**: Admin on drivers page
- **When**: Assigns Bus 1 to Driver A
- **Then**:
  - ✓ Bus updated with driverId
  - ✓ Driver sees bus in mobile app
  - ✓ Can operate bus

#### Test 14.7: Scheduled Routes Page - Create/Activate/Suspend
- **Given**: Admin on scheduled routes
- **When**: Creates new scheduled route
- **Then**:
  - ✓ Route, driver, bus, time configured
  - ✓ Recurring days selected
  - ✓ Can activate/suspend
  - ✓ Future trips affected

#### Test 14.8: Trip Generation Interface
- **Given**: Admin on trips page
- **When**: Clicks "Generate Trips"
- **Then**:
  - ✓ Trips generated for active schedules
  - ✓ Duplicate prevention working
  - ✓ Feedback message shown

#### Test 14.9: Manual Trip Override
- **Given**: Admin views generated trip
- **When**: Edits trip (change driver/bus)
- **Then**:
  - ✓ Trip updated
  - ✓ Scheduled route unchanged
  - ✓ Only this instance affected

#### Test 14.10: Location Change Requests - Review
- **Given**: Pending location change requests
- **When**: Admin reviews and approves/rejects
- **Then**:
  - ✓ Request status updated
  - ✓ Child location updated (if approved)
  - ✓ Parent notified

#### Test 14.11: Early Pickup Requests - Approval
- **Given**: Pending early pickup requests
- **When**: Admin approves
- **Then**:
  - ✓ Driver notified
  - ✓ Request marked approved
  - ✓ Parent notified

#### Test 14.12: Analytics Dashboard
- **Given**: Admin views analytics
- **When**: Selects date range (last 7 days)
- **Then**:
  - ✓ Attendance stats shown
  - ✓ Trip completion rates
  - ✓ Payment revenue
  - ✓ Charts rendered correctly

#### Test 14.13: Reports Generation
- **Given**: Admin wants attendance report
- **When**: Selects report type, date range
- **Then**:
  - ✓ Report generated (max 4 weeks)
  - ✓ Can download CSV/PDF
  - ✓ Data accurate

#### Test 14.14: Fare Management
- **Given**: Admin on fare management page
- **When**: Updates base fare from 50000 to 55000
- **Then**:
  - ✓ `baseFare` updated
  - ✓ FareHistory record created
  - ✓ Future payments use new fare

#### Test 14.15: Search & Filter Functionality
- **Given**: 500 children in system
- **When**: Admin searches "John"
- **Then**:
  - ✓ Filtered results shown
  - ✓ Fast search (indexed)
  - ✓ Can filter by school, grade, claimed status

---

### 15. DRIVER MOBILE APP TESTS

#### Test 15.1: Driver Login & Dashboard
- **Given**: Driver credentials
- **When**: Driver logs in
- **Then**:
  - ✓ Role authenticated
  - ✓ Dashboard shows assigned buses
  - ✓ Today's trips listed
  - ✓ Start trip button visible

#### Test 15.2: Start Trip
- **Given**: Trip scheduled for today
- **When**: Driver clicks "Start Trip"
- **Then**:
  - ✓ Trip status → IN_PROGRESS
  - ✓ `startTime` set
  - ✓ GPS tracking starts
  - ✓ Children list visible

#### Test 15.3: Child Roster Display
- **Given**: Trip with 15 children
- **When**: Driver views children list
- **Then**:
  - ✓ All children listed
  - ✓ Color codes visible
  - ✓ Home addresses shown
  - ✓ Attendance status (PENDING)

#### Test 15.4: Mark Child Picked Up
- **Given**: Child at pickup point
- **When**: Driver taps "Pick Up"
- **Then**:
  - ✓ Status → PICKED_UP
  - ✓ Timestamp recorded
  - ✓ Parent notified
  - ✓ Visual confirmation

#### Test 15.5: Mark Child Missed
- **Given**: Child not at pickup
- **When**: Driver marks "Missed"
- **Then**:
  - ✓ Status → MISSED
  - ✓ Parent notified immediately
  - ✓ Reason optional

#### Test 15.6: View Child Home Locations on Map
- **Given**: Driver on route map screen
- **When**: Map loads
- **Then**:
  - ✓ All children's homes plotted
  - ✓ Color-coded markers
  - ✓ Tap marker for details
  - ✓ Driver's location shown

#### Test 15.7: GPS Location Sharing
- **Given**: Trip in progress
- **When**: Driver moves
- **Then**:
  - ✓ GPS updates sent every 10s
  - ✓ WebSocket `gps_update` event
  - ✓ Parents see real-time location

#### Test 15.8: Route Time-of-Day Indication
- **Given**: Morning and afternoon trips
- **When**: Driver views trip list
- **Then**:
  - ✓ Time indicator shown (AM/PM or Morning/Afternoon)
  - ✓ Scheduled time visible
  - ✓ Can distinguish multiple trips

#### Test 15.9: Pull-to-Refresh
- **Given**: Driver on home screen
- **When**: Pulls down to refresh
- **Then**:
  - ✓ Trip data reloaded
  - ✓ Children list updated
  - ✓ Smooth animation

#### Test 15.10: Early Pickup Notification Handling
- **Given**: Approved early pickup request
- **When**: Driver receives notification
- **Then**:
  - ✓ Notification displayed prominently
  - ✓ Requires acknowledgment
  - ✓ Child highlighted in roster

#### Test 15.11: Trip State Reset (Multiple Trips)
- **Given**: Driver completes morning trip
- **When**: Afternoon trip starts
- **Then**:
  - ✓ New trip loaded
  - ✓ Attendance reset to PENDING
  - ✓ No carryover from morning trip

#### Test 15.12: Complete Trip
- **Given**: All children dropped
- **When**: Driver clicks "Complete Trip"
- **Then**:
  - ✓ Confirmation prompt
  - ✓ Status → COMPLETED
  - ✓ `endTime` set
  - ✓ GPS tracking stops

#### Test 15.13: Broadcast Message to Parents
- **Given**: Driver wants to notify all parents on route
- **When**: Sends message "Running 10 min late"
- **Then**:
  - ✓ Notification created for all parents
  - ✓ Parents receive instantly
  - ✓ Message stored

#### Test 15.14: Driver Notifications - Unread Badge
- **Given**: Driver has 5 unread notifications
- **When**: Notifications screen opened
- **Then**:
  - ✓ Badge shows "5"
  - ✓ All notifications listed
  - ✓ Can mark read

#### Test 15.15: Driver Settings - Profile Update
- **Given**: Driver on settings
- **When**: Updates phone or profile details
- **Then**:
  - ✓ Changes saved
  - ✓ Reflected in backend

#### Test 15.16: Driver App Offline Handling
- **Given**: No internet connection
- **When**: Driver tries to mark attendance
- **Then**:
  - ✓ Action queued locally
  - ✓ Synced when online
  - ✓ Or error shown if critical

#### Test 15.17: Driver Switches Buses (Multi-Bus)
- **Given**: Driver assigned to Bus 1 and Bus 2
- **When**: Switches from Bus 1 to Bus 2
- **Then**:
  - ✓ GPS tracking updates for Bus 2
  - ✓ Trips scoped to Bus 2
  - ✓ Clean context switch

#### Test 15.18: Auto-Dismiss Resolved Warnings
- **Given**: Driver has warning notification (e.g., child missed)
- **When**: Issue resolved (admin updates)
- **Then**:
  - ✓ Warning auto-dismissed
  - ✓ Notification removed or updated

---

### 16. PARENT MOBILE APP TESTS

#### Test 16.1: Parent Sign Up
- **Given**: New parent
- **When**: Signs up with email, password
- **Then**:
  - ✓ User created with role PARENT
  - ✓ Tokens issued
  - ✓ Redirected to home screen

#### Test 16.2: Parent Login
- **Given**: Existing parent account
- **When**: Logs in
- **Then**:
  - ✓ Authenticated
  - ✓ Dashboard shows children (if linked)
  - ✓ Or prompt to link child

#### Test 16.3: Link Child via Unique Code
- **Given**: Parent has account, child onboarded with code "ABC12345"
- **When**: Parent enters code and home location
- **Then**:
  - ✓ Child linked to parent
  - ✓ `isClaimed` = true
  - ✓ Child appears in parent's dashboard
  - ✓ Home location saved

#### Test 16.4: Enrollment Code Input - No Format Hint
- **Given**: Parent on "Link Child" screen
- **When**: Viewing unique code input field
- **Then**:
  - ✓ No example format shown (per memory: avoid misleading formats)
  - ✓ Clear label: "Enter child's unique code"
  - ✓ Validation on submit

#### Test 16.5: Home Location Selection via Map
- **Given**: Parent linking child
- **When**: Selects home location on map
- **Then**:
  - ✓ Map interface with pin
  - ✓ Lat/lng captured
  - ✓ Address auto-filled (geocoding)
  - ✓ Accurate location saved

#### Test 16.6: View Linked Children
- **Given**: Parent has 2 linked children
- **When**: Home screen loaded
- **Then**:
  - ✓ Both children displayed
  - ✓ Names, grades, schools shown
  - ✓ Tap child for details

#### Test 16.7: Live Bus Tracking
- **Given**: Child assigned to Bus 1, trip in progress
- **When**: Parent taps "Track Bus"
- **Then**:
  - ✓ Map shows bus location
  - ✓ Updates in real-time (every 10s)
  - ✓ Route path visible
  - ✓ ETA shown (if calculated)

#### Test 16.8: Real-Time Bus Location Updates via WebSocket
- **Given**: Parent watching live tracking
- **When**: Driver sends GPS update
- **Then**:
  - ✓ Parent receives `bus_location` event
  - ✓ Map marker moves smoothly
  - ✓ No lag or delay

#### Test 16.9: Pickup/Dropoff Notifications
- **Given**: Child picked up by driver
- **When**: Driver marks "Picked Up"
- **Then**:
  - ✓ Parent receives notification instantly
  - ✓ "John has been picked up at 7:15 AM"
  - ✓ Badge updated

#### Test 16.10: Request Early Pickup
- **Given**: Parent needs child picked up early
- **When**: Submits early pickup request
- **Then**:
  - ✓ Request created (PENDING)
  - ✓ Reason field required
  - ✓ Admin notified
  - ✓ Parent sees "Request pending"

#### Test 16.11: Request Location Change
- **Given**: Parent moved to new house
- **When**: Requests location change
- **Then**:
  - ✓ New location selected on map
  - ✓ Reason entered
  - ✓ Request submitted (PENDING)
  - ✓ Admin notified

#### Test 16.12: Payment Screen - View Plans
- **Given**: Parent on payments screen
- **When**: Views available pricing plans
- **Then**:
  - ✓ All plans listed (Basic, Premium, etc.)
  - ✓ Prices shown in UGX
  - ✓ Select plan to pay

#### Test 16.13: Initiate Payment
- **Given**: Parent selects plan (50000 UGX)
- **When**: Clicks "Pay Now"
- **Then**:
  - ✓ PaymentIntent created
  - ✓ Hubtle integration initiated
  - ✓ Payment flow opened
  - ✓ Status tracked

#### Test 16.14: Payment Success Notification
- **Given**: Payment succeeded
- **When**: Webhook processed
- **Then**:
  - ✓ Parent notified: "Payment successful"
  - ✓ Receipt available
  - ✓ Plan activated

#### Test 16.15: Payment Failure Handling
- **Given**: Payment failed
- **When**: Webhook processed
- **Then**:
  - ✓ Parent notified: "Payment failed"
  - ✓ Reason shown
  - ✓ Can retry

#### Test 16.16: Receipt History
- **Given**: Parent made 3 payments
- **When**: Views receipt history
- **Then**:
  - ✓ All payments listed
  - ✓ Download receipt option
  - ✓ Status visible

#### Test 16.17: Notifications - View & Mark Read
- **Given**: Parent has 8 notifications
- **When**: Opens notifications screen
- **Then**:
  - ✓ All notifications listed
  - ✓ Unread highlighted
  - ✓ Tap to mark read
  - ✓ Badge count updates

#### Test 16.18: Manage Children - Edit Profile
- **Given**: Parent wants to update child details
- **When**: Edits child's grade or allergies
- **Then**:
  - ✓ Changes saved
  - ✓ Reflected in backend
  - ✓ Driver sees updates

#### Test 16.19: Privacy Settings
- **Given**: Parent on settings
- **When**: Updates privacy preferences
- **Then**:
  - ✓ Settings saved
  - ✓ Applied to notifications

#### Test 16.20: Help & Support
- **Given**: Parent needs help
- **When**: Opens help section
- **Then**:
  - ✓ FAQs displayed
  - ✓ Contact support option
  - ✓ Clear navigation

---

### 17. ANALYTICS & REPORTING TESTS

#### Test 17.1: Attendance Report (7 Days)
- **Given**: 7 days of attendance data
- **When**: Admin generates report
- **Then**:
  - ✓ Shows PICKED_UP, DROPPED, MISSED counts
  - ✓ Per child, per day
  - ✓ Exportable CSV

#### Test 17.2: Trip Completion Rate
- **Given**: 30 trips (25 completed, 5 in-progress)
- **When**: Admin views analytics
- **Then**:
  - ✓ Completion rate = 83% (25/30)
  - ✓ Chart displayed
  - ✓ Trend over time

#### Test 17.3: Revenue Analytics
- **Given**: 50 payments (total 2,500,000 UGX)
- **When**: Admin views payment analytics
- **Then**:
  - ✓ Total revenue shown
  - ✓ Success rate calculated
  - ✓ Failed payments listed

#### Test 17.4: Bus Utilization Report
- **Given**: 5 buses with varying loads
- **When**: Admin generates utilization report
- **Then**:
  - ✓ Children per bus shown
  - ✓ Capacity vs actual
  - ✓ Under/over-utilized buses highlighted

#### Test 17.5: Driver Performance Metrics
- **Given**: Driver data over 30 days
- **When**: Admin views driver metrics
- **Then**:
  - ✓ Trips completed
  - ✓ On-time percentage
  - ✓ Attendance accuracy

#### Test 17.6: Parent Engagement Analytics
- **Given**: Parent activity tracked
- **When**: Admin views engagement
- **Then**:
  - ✓ Active parents count
  - ✓ App usage stats
  - ✓ Payment conversion rate

#### Test 17.7: Report Date Range - Max 4 Weeks
- **Given**: Admin selects date range
- **When**: Selects range > 4 weeks
- **Then**:
  - ✓ Validation error: "Max 4 weeks"
  - ✓ Range adjusted automatically
  - ✓ Or capped at 4 weeks

#### Test 17.8: Scheduled Report Generation (Daily/Weekly/Monthly)
- **Given**: Admin configures scheduled report
- **When**: Schedule triggers (daily at 6 AM)
- **Then**:
  - ✓ Report generated automatically
  - ✓ Emailed to admin
  - ✓ Stored for download

---

### 18. EDGE CASES & ERROR HANDLING TESTS

#### Test 18.1: Null/Empty Child Fields
- **Given**: Child with null grade, null allergies
- **When**: Data queried
- **Then**:
  - ✓ No crashes
  - ✓ Displays "N/A" or blank
  - ✓ Handles gracefully

#### Test 18.2: Child with No Route Assigned
- **Given**: Child exists, routeId = null
- **When**: Trip generation runs
- **Then**:
  - ✓ Child not added to trips
  - ✓ Warning to admin: "X unassigned children"
  - ✓ No errors

#### Test 18.3: Trip Without Driver
- **Given**: Scheduled route, driverId = null
- **When**: Trip generation attempted
- **Then**:
  - ✓ Validation error: "Driver required"
  - ✓ Trip not created
  - ✓ Admin notified

#### Test 18.4: GPS Update with Null Coordinates
- **Given**: GPS update lat = null
- **When**: Update received
- **Then**:
  - ✓ Validation error
  - ✓ Update rejected
  - ✓ Logged but not saved

#### Test 18.5: Concurrent Attendance Updates (Race Condition)
- **Given**: Driver marks child PICKED_UP, parent marks MISSED simultaneously
- **When**: Both updates hit DB
- **Then**:
  - ✓ Last write wins (or first write wins with lock)
  - ✓ Audit log shows both attempts
  - ✓ No data corruption

#### Test 18.6: Trip Deletion with Active Tracking
- **Given**: Parent actively tracking trip
- **When**: Admin deletes trip
- **Then**:
  - ✓ Parent notified: "Trip cancelled"
  - ✓ Tracking screen cleared
  - ✓ WebSocket disconnected gracefully

#### Test 18.7: Child Deletion with Linked Parent
- **Given**: Child linked to parent
- **When**: Admin deletes child
- **Then**:
  - ✓ Confirmation required
  - ✓ Parent notified
  - ✓ Historical data preserved
  - ✓ Parent's child list updated

#### Test 18.8: Large Payload Handling (Bulk Operations)
- **Given**: Admin uploads CSV with 5000 children
- **When**: Processing starts
- **Then**:
  - ✓ Batched processing (chunks of 100)
  - ✓ Progress indicator
  - ✓ No timeout errors
  - ✓ All children created

#### Test 18.9: Network Failure During Payment
- **Given**: Payment in progress
- **When**: Network drops
- **Then**:
  - ✓ Payment status uncertain
  - ✓ Webhook reconciles later
  - ✓ Idempotency ensures no duplicate charge

#### Test 18.10: Invalid Date Formats
- **Given**: API receives date "2025-13-45" (invalid)
- **When**: Parsed
- **Then**:
  - ✓ Validation error: "Invalid date"
  - ✓ HTTP 400 Bad Request
  - ✓ Clear error message

#### Test 18.11: SQL Injection Attempt
- **Given**: Malicious input "'; DROP TABLE users;--"
- **When**: Query executed
- **Then**:
  - ✓ Prisma ORM sanitizes
  - ✓ No SQL executed
  - ✓ Attack blocked
  - ✓ Security log created

#### Test 18.12: XSS Attack in Child Name
- **Given**: Child name = "<script>alert('XSS')</script>"
- **When**: Displayed in UI
- **Then**:
  - ✓ HTML escaped
  - ✓ Displayed as plain text
  - ✓ No script execution

#### Test 18.13: Extremely Long Strings
- **Given**: Child name = 1000-character string
- **When**: Saved to database
- **Then**:
  - ✓ Validation error (max 255 chars)
  - ✓ Or truncated with warning
  - ✓ No database errors

#### Test 18.14: Timezone Handling
- **Given**: Server in UTC, users in EAT (UTC+3)
- **When**: Trip scheduled for "7:00 AM"
- **Then**:
  - ✓ Times stored in UTC
  - ✓ Displayed in local timezone
  - ✓ No confusion

#### Test 18.15: Leap Year / DST Edge Cases
- **Given**: Date = Feb 29 (leap year)
- **When**: Trip scheduled
- **Then**:
  - ✓ Handled correctly
  - ✓ No crash on non-leap years

#### Test 18.16: Database Connection Loss
- **Given**: Database becomes unreachable
- **When**: API request made
- **Then**:
  - ✓ Graceful error: "Service unavailable"
  - ✓ Retry logic (if configured)
  - ✓ No cascade failures

#### Test 18.17: Redis Connection Loss
- **Given**: Redis down
- **When**: GPS update received
- **Then**:
  - ✓ Warning logged
  - ✓ Falls back to database
  - ✓ System continues (degraded mode)

#### Test 18.18: WebSocket Reconnection Storm
- **Given**: 100 clients disconnect/reconnect rapidly
- **When**: All reconnect simultaneously
- **Then**:
  - ✓ Server handles gracefully
  - ✓ No crashes
  - ✓ Rate limiting applied (if configured)

#### Test 18.19: Orphaned Records Cleanup
- **Given**: Child deleted but attendance records remain
- **When**: Cleanup job runs
- **Then**:
  - ✓ Orphaned records identified
  - ✓ Archived or deleted
  - ✓ Data integrity maintained

#### Test 18.20: File Upload - Malicious File Type
- **Given**: Admin uploads "malware.exe" as child CSV
- **When**: File validated
- **Then**:
  - ✓ Rejected: "Invalid file type"
  - ✓ Only .csv allowed
  - ✓ Security scan (if configured)

#### Test 18.21: API Rate Limiting
- **Given**: Malicious client sends 1000 requests/second
- **When**: Rate limit exceeded
- **Then**:
  - ✓ HTTP 429 Too Many Requests
  - ✓ Client throttled
  - ✓ Legitimate users unaffected

#### Test 18.22: CORS Violations
- **Given**: Request from unauthorized origin
- **When**: API call made
- **Then**:
  - ✓ CORS error
  - ✓ Request blocked
  - ✓ No data exposure

#### Test 18.23: Missing Required Fields
- **Given**: API request missing `schoolId`
- **When**: Request processed
- **Then**:
  - ✓ HTTP 400 Bad Request
  - ✓ Error: "schoolId is required"
  - ✓ Clear validation message

#### Test 18.24: Duplicate Email Registration
- **Given**: User with email exists
- **When**: Another user tries to register with same email
- **Then**:
  - ✓ HTTP 400 Bad Request
  - ✓ Error: "Email already exists"
  - ✓ No duplicate created

#### Test 18.25: Expired Session Handling
- **Given**: User session expired hours ago
- **When**: User makes API call
- **Then**:
  - ✓ HTTP 401 Unauthorized
  - ✓ Redirect to login
  - ✓ Token refresh attempted first

---

### 19. PERFORMANCE & LOAD TESTING

#### Test 19.1: 100 Concurrent GPS Updates
- **Given**: 100 buses sending GPS updates simultaneously
- **When**: All updates arrive within 1 second
- **Then**:
  - ✓ All processed successfully
  - ✓ No dropped updates
  - ✓ Response time < 500ms

#### Test 19.2: 1000 Concurrent WebSocket Connections
- **Given**: 1000 parents connect via WebSocket
- **When**: All connected
- **Then**:
  - ✓ Server handles load
  - ✓ Memory usage acceptable
  - ✓ No disconnections

#### Test 19.3: Large Database Query (10,000 Children)
- **Given**: 10,000 children in database
- **When**: Admin queries all children
- **Then**:
  - ✓ Query time < 2 seconds
  - ✓ Pagination works
  - ✓ UI responsive

#### Test 19.4: Trip Generation for 50 Routes
- **Given**: 50 active scheduled routes
- **When**: Cron job generates trips at 2 AM
- **Then**:
  - ✓ All trips created within 30 seconds
  - ✓ No timeouts
  - ✓ Database constraints not violated

#### Test 19.5: Bulk Notification Send (500 Parents)
- **Given**: 500 parents to notify
- **When**: Broadcast message sent
- **Then**:
  - ✓ All notifications created
  - ✓ WebSocket broadcast efficient
  - ✓ All parents receive within 5 seconds

#### Test 19.6: API Endpoint Response Time
- **Given**: Standard API requests
- **When**: Load tested (50 req/sec)
- **Then**:
  - ✓ Average response < 200ms
  - ✓ 95th percentile < 500ms
  - ✓ No errors

#### Test 19.7: Database Connection Pool Exhaustion
- **Given**: Max 20 DB connections
- **When**: 30 concurrent requests
- **Then**:
  - ✓ Requests queued
  - ✓ No crashes
  - ✓ All requests eventually succeed

#### Test 19.8: Redis Memory Usage (High Volume)
- **Given**: 500 buses sending GPS updates
- **When**: Running for 24 hours
- **Then**:
  - ✓ Memory usage stable (TTL works)
  - ✓ No memory leaks
  - ✓ Eviction policy effective

#### Test 19.9: Admin Dashboard Load Time
- **Given**: Dashboard with 10 charts and 5000 data points
- **When**: Page loaded
- **Then**:
  - ✓ Initial load < 3 seconds
  - ✓ Charts rendered smoothly
  - ✓ No UI freeze

#### Test 19.10: Mobile App Performance on Low-End Device
- **Given**: Old Android device (2GB RAM)
- **When**: App running with live tracking
- **Then**:
  - ✓ No crashes
  - ✓ Smooth map rendering
  - ✓ Acceptable battery usage

---

### 20. SECURITY & DATA PROTECTION TESTS

#### Test 20.1: JWT Token Expiration
- **Given**: Access token with 15-min expiry
- **When**: 16 minutes pass
- **Then**:
  - ✓ Token rejected
  - ✓ HTTP 401 Unauthorized
  - ✓ Refresh flow triggered

#### Test 20.2: Refresh Token Rotation
- **Given**: Refresh token used
- **When**: New access token issued
- **Then**:
  - ✓ New refresh token also issued (rotation)
  - ✓ Old refresh token invalidated
  - ✓ Replay attacks prevented

#### Test 20.3: Password Hashing
- **Given**: User password "Password123"
- **When**: Stored in database
- **Then**:
  - ✓ Stored as bcrypt hash
  - ✓ Not reversible
  - ✓ Salt unique per password

#### Test 20.4: Sensitive Data in Logs
- **Given**: API logs enabled
- **When**: Password sent in login request
- **Then**:
  - ✓ Password not logged
  - ✓ Only email logged
  - ✓ PII redacted

#### Test 20.5: HTTPS Enforcement
- **Given**: Production environment
- **When**: HTTP request made
- **Then**:
  - ✓ Redirect to HTTPS
  - ✓ HSTS header set
  - ✓ No plain-text transmission

#### Test 20.6: CSRF Protection
- **Given**: State-changing POST request
- **When**: CSRF token missing
- **Then**:
  - ✓ Request rejected
  - ✓ HTTP 403 Forbidden
  - ✓ Protection active

#### Test 20.7: Data Encryption at Rest
- **Given**: Sensitive data in database
- **When**: Database accessed directly
- **Then**:
  - ✓ Sensitive fields encrypted (if configured)
  - ✓ Or database-level encryption enabled

#### Test 20.8: Audit Log Integrity
- **Given**: User actions recorded
- **When**: Audit log queried
- **Then**:
  - ✓ All actions logged
  - ✓ Immutable (append-only)
  - ✓ Cannot be tampered

#### Test 20.9: Role Escalation Prevention
- **Given**: Parent user
- **When**: Attempts to modify own role to ADMIN
- **Then**:
  - ✓ HTTP 403 Forbidden
  - ✓ Role unchanged
  - ✓ Security alert logged

#### Test 20.10: Session Hijacking Prevention
- **Given**: User logged in from IP A
- **When**: Same token used from IP B
- **Then**:
  - ✓ Suspicious activity logged
  - ✓ Optional: session invalidated
  - ✓ User notified

#### Test 20.11: Input Sanitization
- **Given**: User input with special characters
- **When**: Saved and displayed
- **Then**:
  - ✓ HTML escaped
  - ✓ SQL injection prevented (Prisma ORM)
  - ✓ NoSQL injection prevented

#### Test 20.12: Secure WebSocket Communication
- **Given**: WebSocket connection
- **When**: Established
- **Then**:
  - ✓ WSS (secure WebSocket) used in production
  - ✓ Token authentication required
  - ✓ No plaintext messages

---

## 🎯 TEST EXECUTION CHECKLIST

### Pre-Testing Setup
- [ ] Backend running on http://localhost:3000 or deployed URL
- [ ] Frontend (React Native) running on Expo
- [ ] Admin-web running on http://localhost:3001
- [ ] Database (PostgreSQL) accessible
- [ ] Redis running (for GPS caching and queues)
- [ ] Test data seeded (companies, schools, users, children, buses, routes)
- [ ] Environment variables configured (.env files)

### TestSprite Configuration
- [ ] TestSprite MCP Server installed
- [ ] API key configured
- [ ] Connected to ROSAgo workspace
- [ ] All three projects scanned (backend, frontend, admin-web)

### Test Execution Priority
1. **Critical Path (Priority 1)**: Tests 1-7 (Auth, Multi-tenancy, Child Onboarding, Trips, GPS)
2. **Core Features (Priority 2)**: Tests 8-13 (Attendance, Requests, Payments, Notifications)
3. **User Interfaces (Priority 3)**: Tests 14-16 (Admin, Driver, Parent apps)
4. **Analytics & Edge Cases (Priority 4)**: Tests 17-18
5. **Performance & Security (Priority 5)**: Tests 19-20

### Success Criteria
- ✅ **95%+ tests pass** on first run
- ✅ **100% critical path tests pass** (Tests 1-7)
- ✅ **Zero data corruption** or security vulnerabilities
- ✅ **No production-blocking bugs**
- ✅ **Performance benchmarks met** (API < 500ms, GPS updates real-time)

---

## 📊 TESTSPRITE EXECUTION COMMANDS

### Run All Tests
```
Generate and execute comprehensive test suite for ROSAgo covering:
- Backend (NestJS): All API endpoints, services, WebSocket gateway
- Frontend (React Native): All screens, navigation, API integration
- Admin-web (Next.js): All pages, forms, real-time dashboard
- End-to-end flows: Child onboarding, trip generation, GPS tracking, payments
- Edge cases: Null handling, race conditions, security
- Performance: Load testing with 100 concurrent users
```

### Run Critical Path Only
```
Execute priority 1 tests for ROSAgo:
- Authentication & authorization (all roles)
- Multi-tenancy data isolation
- Child onboarding and linking workflow
- Trip generation and scheduled routes
- Real-time GPS tracking (driver → parent)
- WebSocket connections and broadcasts
```

### Run Backend API Tests
```
Test all NestJS backend modules:
- /auth/* (login, signup, refresh, password reset)
- /children/* (create, link, update, location changes)
- /trips/* (create, status transitions, history)
- /routes/* and /scheduled-routes/*
- /gps/* (heartbeat processing, location retrieval)
- /payments/* (create intent, webhook validation)
- /notifications/* (create, mark read, real-time delivery)
- Verify database integrity and multi-tenancy isolation
```

### Run Frontend Mobile Tests
```
Test React Native mobile app:
- Driver app: Login, start trip, mark attendance, GPS sharing, notifications
- Parent app: Login, link child, live tracking, payments, early pickup requests
- Verify WebSocket connections and real-time updates
- Test offline handling and sync
```

### Run Admin Dashboard Tests
```
Test Next.js admin dashboard:
- All CRUD operations (children, buses, drivers, routes)
- Bulk operations (child onboarding, trip generation)
- Live dashboard (multi-bus tracking)
- Reports and analytics
- Scheduled route management
- Payment plan creation
```

### Run Security Tests
```
Execute security-focused tests:
- JWT authentication and authorization
- Role-based access control (RBAC)
- Multi-tenancy data isolation
- SQL injection prevention
- XSS attack prevention
- CSRF protection
- Input validation and sanitization
```

---

## 🚀 DEPLOYMENT READINESS VERIFICATION

After all tests pass, verify:

### 1. Functional Completeness
- ✅ All 20 modules tested
- ✅ 257 test cases executed
- ✅ Critical business flows operational
- ✅ No blocking bugs

### 2. Data Integrity
- ✅ Multi-tenancy isolation enforced
- ✅ No data leaks between companies
- ✅ Unique constraints working (plate numbers, licenses, emails)
- ✅ Cascading deletes handled correctly

### 3. Real-Time Features
- ✅ GPS tracking functional (< 10s latency)
- ✅ WebSocket connections stable
- ✅ Notifications delivered instantly
- ✅ Live dashboard updates in real-time

### 4. Performance
- ✅ API response times < 500ms (95th percentile)
- ✅ Database queries optimized
- ✅ Redis caching effective
- ✅ Mobile apps responsive on low-end devices

### 5. Security
- ✅ Authentication robust (JWT with refresh)
- ✅ Authorization enforced (RBAC)
- ✅ Sensitive data encrypted/hashed
- ✅ No security vulnerabilities (XSS, SQL injection, CSRF)

### 6. User Experience
- ✅ Intuitive interfaces (admin, driver, parent)
- ✅ Clear error messages
- ✅ Smooth navigation
- ✅ Helpful notifications

---

## 📝 BUSINESS LOGIC VERIFICATION EXERCISES

### Exercise 1: Complete Child Onboarding Flow
**Scenario**: Admin onboards 20 children, parent links 1 child, child assigned to route, trip generated.

**Steps**:
1. Admin bulk uploads 20 children via CSV
2. System generates unique codes for all
3. Parent receives code "ABC12345" for their child
4. Parent logs in, enters code, selects home location on map
5. Child linked to parent (isClaimed = true)
6. Admin assigns child to "Morning Route A"
7. Scheduled route exists for "Morning Route A" (Mon-Fri, 7 AM)
8. Cron job runs at 2 AM, generates trip
9. Child added to trip with attendance status PENDING
10. Driver sees child in roster at 6:30 AM
11. Driver starts trip at 7 AM
12. Driver marks child "Picked Up" at 7:15 AM
13. Parent receives notification instantly
14. Parent opens live tracking, sees bus moving
15. Driver marks child "Dropped" at school at 7:45 AM
16. Parent receives notification
17. Trip completed at 8 AM

**Verification**:
- ✓ All 20 children created with unique codes
- ✓ Child successfully linked to parent
- ✓ Child appears in parent's dashboard
- ✓ Trip generated automatically
- ✓ Attendance tracking accurate
- ✓ Real-time notifications delivered
- ✓ GPS tracking functional
- ✓ No data corruption or errors

### Exercise 2: Early Pickup Request Workflow
**Scenario**: Parent requests early pickup, admin approves, driver is notified.

**Steps**:
1. Parent opens app, selects child
2. Requests early pickup for afternoon trip (reason: "Doctor appointment")
3. EarlyPickupRequest created (status: PENDING)
4. Admin receives notification
5. Admin reviews request, approves
6. Status → APPROVED
7. Driver receives notification (requires acknowledgment)
8. Driver acknowledges notification
9. Driver sees child highlighted in afternoon roster
10. Parent notified: "Early pickup approved"

**Verification**:
- ✓ Request created and linked to correct trip
- ✓ Admin notified in real-time
- ✓ Approval workflow functional
- ✓ Driver notification delivered and acknowledged
- ✓ Child highlighted in driver's UI
- ✓ Parent confirmation received

### Exercise 3: Multi-Trip Day with State Reset
**Scenario**: Driver completes morning trip, afternoon trip starts with clean state.

**Steps**:
1. Driver starts morning trip at 7 AM
2. Marks all 15 children "Picked Up"
3. Marks all "Dropped" at school
4. Completes morning trip at 8 AM
5. Afternoon trip scheduled for 3 PM
6. Driver logs in at 2:45 PM
7. Starts afternoon trip
8. Attendance for all children reset to PENDING
9. Driver marks children "Picked Up" from school
10. Drops children at homes
11. Completes afternoon trip

**Verification**:
- ✓ Morning trip data preserved (historical)
- ✓ Afternoon trip starts with clean state
- ✓ No carryover from morning trip
- ✓ Both trips independently tracked
- ✓ Driver can distinguish between trips by time-of-day indicator

---

## ✅ FINAL DEPLOYMENT SIGN-OFF

**Project**: ROSAgo School Transport Management System  
**Test Date**: _____________  
**Tested By**: TestSprite AI + QA Team  
**Total Tests**: 257  
**Tests Passed**: _______  
**Tests Failed**: _______  
**Critical Bugs**: _______  
**Performance**: ✅ Meets requirements  
**Security**: ✅ Hardened  

**Production Readiness**: ☐ APPROVED  ☐ NEEDS FIXES

**Sign-Off**:  
_____________________________  
Technical Lead

_____________________________  
Product Owner

---

**END OF ENTERPRISE-GRADE TEST PLAN**