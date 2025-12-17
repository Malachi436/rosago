# Trip & Route Management PRD

## Overview
Comprehensive trip generation, route management, and real-time tracking system for school bus operations.

## Features

### 1. Route Management
- Route creation with multiple stops
- Stop ordering and sequencing
- Bus assignment to routes
- Shift configuration (MORNING/AFTERNOON)
- Route-level capacity management

### 2. Scheduled Routes
- Recurring route schedules
- Day of week configuration
- Start and end time settings
- Route activation/suspension
- Automatic trip generation

### 3. Trip Generation
- Manual trip creation
- Automatic trip generation from scheduled routes
- Unique trip per route per day validation
- Child roster inclusion
- Driver and bus assignment

### 4. Trip Management
- Trip status tracking (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- Real-time trip monitoring
- Trip history and logs
- Driver trip controls (start/end trip)
- Attendance tracking integration

### 5. Real-Time GPS Tracking
- Live bus location updates
- GPS heartbeat monitoring
- Location history trail
- Parent view of bus location
- Admin dashboard map view

### 6. Attendance Management
- Attendance record creation
- Pick-up and drop-off marking
- Attendance status (PENDING, PRESENT, ABSENT, SKIPPED)
- Attendance history
- Parent notifications

## API Endpoints
- POST /routes
- GET /routes
- GET /routes/:id
- PATCH /routes/:id
- DELETE /routes/:id
- POST /scheduled-routes
- GET /scheduled-routes
- PUT /scheduled-routes/:id/activate
- PUT /scheduled-routes/:id/suspend
- POST /trips
- POST /trips/generate-today
- GET /trips
- GET /admin/company/:companyId/trips
- GET /admin/company/:companyId/trips/active
- POST /trips/:id/start
- POST /trips/:id/end
- POST /gps/update
- GET /gps/bus/:busId/location

## Data Model
### Route
- name: string
- schoolId: UUID
- busId: UUID
- shift: enum (MORNING, AFTERNOON)
- stops: Stop[]

### Stop
- name: string
- order: number
- latitude: decimal
- longitude: decimal
- routeId: UUID

### Trip
- routeId: UUID
- busId: UUID
- driverId: UUID
- scheduledDate: date
- startTime: datetime
- endTime: datetime
- status: enum
- children: Child[]

### Attendance
- tripId: UUID
- childId: UUID
- status: enum
- pickupTime: datetime
- dropoffTime: datetime
