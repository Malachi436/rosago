# ROSAgo API Documentation

**Version:** 1.0  
**Base URL:** `http://localhost:3000`  
**Authentication:** JWT Bearer Token (except auth endpoints)  
**API Standard:** REST with snake_case response fields

---

## Table of Contents
1. [Authentication](#authentication)
2. [Admin Management](#admin-management)
3. [Children Management](#children-management)
4. [Bus Management](#bus-management)
5. [Driver Management](#driver-management)
6. [Route Management](#route-management)
7. [Trip Management](#trip-management)
8. [Attendance Management](#attendance-management)
9. [Data Models](#data-models)
10. [Role-Based Access Control](#role-based-access-control)

---

## Authentication

All authentication responses use **snake_case** field naming (`access_token`, `refresh_token`).

### POST /auth/login
**Description:** User login with email and password  
**Authentication:** None required  
**Roles:** All

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "PARENT",
  "companyId": "uuid-string",
  "userId": "uuid-string",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+256700000000",
    "role": "PARENT",
    "companyId": "uuid-string"
  }
}
```

**Validation Rules:**
- Email must be valid format
- Password minimum 6 characters

**Error Responses:**
- `401 Unauthorized`: Invalid credentials

---

### POST /auth/signup
**Description:** Create new user account (defaults to PARENT role)  
**Authentication:** None required  
**Roles:** All

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "Password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+256700000000"
}
```

**Validation Rules:**
- Email must be valid and unique
- Password must contain: uppercase, lowercase, and number
- Password minimum 6 characters
- First name minimum 2 characters
- Last name minimum 2 characters
- Phone is optional

**Response (201 Created):**
Same as login response

**Error Responses:**
- `409 Conflict`: User with email already exists

---

### POST /auth/refresh
**Description:** Get new access token using refresh token  
**Authentication:** None required  
**Roles:** All

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired refresh token

---

### POST /auth/logout
**Description:** Invalidate refresh token and logout user  
**Authentication:** Required (JWT)  
**Roles:** All authenticated users

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### POST /auth/forgot-password
**Description:** Send password reset email  
**Authentication:** None required  
**Roles:** All

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset email sent"
}
```

---

### POST /auth/reset-password
**Description:** Reset password using token from email  
**Authentication:** None required  
**Roles:** All

**Request Body:**
```json
{
  "resetToken": "token-from-email",
  "newPassword": "NewPassword123"
}
```

**IMPORTANT:** Field names are **camelCase** (resetToken, newPassword), NOT snake_case.

**Validation Rules:**
- New password must contain: uppercase, lowercase, and number
- Password minimum 6 characters

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

---

## Admin Management

All admin endpoints require authentication and specific roles.

### GET /admin/stats
**Description:** Get platform-wide statistics  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN

**Response (200 OK):**
```json
{
  "totalCompanies": 10,
  "totalSchools": 45,
  "totalChildren": 1250,
  "totalDrivers": 78,
  "totalBuses": 82,
  "activeTrips": 15
}
```

---

### GET /admin/stats/company/:companyId
**Description:** Get statistics for specific company  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

**Response (200 OK):**
```json
{
  "companyId": "uuid",
  "schools": 5,
  "children": 250,
  "drivers": 12,
  "buses": 15,
  "activeTrips": 8
}
```

---

### GET /admin/companies
**Description:** Get all companies  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "SafeRide Transport",
    "email": "info@saferide.com",
    "phone": "+256700000000",
    "address": "Kampala, Uganda",
    "baseFare": 50000,
    "currency": "UGX",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### POST /admin/company
**Description:** Create new company  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN

**Request Body:**
```json
{
  "name": "New Transport Co",
  "email": "contact@newtransport.com",
  "phone": "+256700000000",
  "address": "City Center",
  "baseFare": 50000
}
```

---

### GET /admin/company/:companyId/schools
**Description:** Get all schools for a company  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "Green Valley School",
    "companyId": "uuid",
    "latitude": 0.3163,
    "longitude": 32.5822,
    "address": "Kampala Road",
    "phone": "+256700000000",
    "email": "admin@greenvalley.sch"
  }
]
```

---

### POST /admin/school/:companyId
**Description:** Create new school under a company  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

**Request Body:**
```json
{
  "name": "New School",
  "latitude": 0.3163,
  "longitude": 32.5822,
  "address": "School Street",
  "phone": "+256700000000",
  "email": "admin@newschool.sch"
}
```

---

### GET /admin/company/:companyId/children
**Description:** Get all children in a company  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "grade": "Grade 3",
    "schoolId": "uuid",
    "routeId": "uuid",
    "parentId": "uuid",
    "isClaimed": true,
    "uniqueCode": "ABC12345"
  }
]
```

---

### GET /admin/company/:companyId/drivers
**Description:** Get all drivers in a company  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### GET /admin/company/:companyId/routes
**Description:** Get all routes in a company  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### GET /admin/company/:companyId/trips
**Description:** Get all trips for a company  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### GET /admin/company/:companyId/trips/active
**Description:** Get active trips for a company  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

## Children Management

### POST /children/bulk-onboard
**Description:** Bulk create children (CSV upload)  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN (NOT PARENT)

**Request Body Format:**
```json
{
  "companyId": "uuid",
  "schoolId": "uuid",
  "children": [
    {
      "firstName": "Ama",
      "lastName": "Boateng",
      "dateOfBirth": "2015-03-15",
      "grade": "Grade 3",
      "parentPhone": "+256700000000",
      "routeId": "uuid-or-null",
      "daysUntilPayment": 30
    }
  ]
}
```

**Field Requirements:**
- `companyId`: Required (string, UUID)
- `schoolId`: Required (string, UUID) - School must belong to company
- `children`: Required (array, not empty)
  - `firstName`: Required (string)
  - `lastName`: Required (string)
  - `dateOfBirth`: Optional (string, ISO date format) - defaults to current date if not provided
  - `grade`: Optional (string, e.g., "Grade 3")
  - `parentPhone`: Optional (string, phone number)
  - `routeId`: Optional (string, UUID or null)
  - `daysUntilPayment`: Optional (number) - defaults to 0 if not provided

**Response (201 Created):**
```json
{
  "created": 1,
  "children": [
    {
      "id": "uuid",
      "firstName": "Ama",
      "lastName": "Boateng",
      "uniqueCode": "ABC12345",
      "isClaimed": false,
      "schoolId": "uuid",
      "grade": "Grade 3",
      "dateOfBirth": "2015-03-15T00:00:00.000Z"
    }
  ]
}
```

**Important Notes:**
- This endpoint is admin-only. Parents cannot bulk onboard.
- Each child automatically gets a unique 8-character code
- School must exist and belong to the specified company
- All children are created with `isClaimed: false` and `pickupType: 'SCHOOL'`

---

### GET /children
**Description:** Get all children (admin view)  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN (NOT PARENT)

**Note:** Parents should use `/children/parent/:parentId` instead

---

### GET /children/parent/:parentId
**Description:** Get children for specific parent  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, PARENT

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "grade": "Grade 3",
    "schoolId": "uuid",
    "routeId": "uuid",
    "isClaimed": true,
    "homeAddress": "123 Main St"
  }
]
```

---

### POST /children/link
**Description:** Parent links child using unique code  
**Authentication:** Required  
**Roles:** PARENT

**Request Body:**
```json
{
  "uniqueCode": "ABC12345"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "firstName": "Child",
  "lastName": "Name",
  "isClaimed": true,
  "parentId": "parent-uuid"
}
```

---

### GET /children/:id
**Description:** Get single child by ID  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, PARENT

---

### PATCH /children/:id
**Description:** Update child details  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, PARENT

**Request Body:**
```json
{
  "allergies": "Peanuts",
  "specialInstructions": "Requires booster seat",
  "homeAddress": "New Address"
}
```

---

### DELETE /children/:id
**Description:** Delete child  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### POST /children/generate-code
**Description:** Generate unique enrollment code  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

**Response (200 OK):**
```json
{
  "uniqueCode": "XYZ78901"
}
```

---

### GET /children/public/schools
**Description:** Get list of schools (for enrollment)  
**Authentication:** Required  
**Roles:** PARENT, PLATFORM_ADMIN, COMPANY_ADMIN

---

## Bus Management

### POST /buses
**Description:** Create new bus  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

**Request Body:**
```json
{
  "licensePlate": "UAH123X",
  "capacity": 45,
  "companyId": "uuid",
  "driverId": "uuid"
}
```

---

### GET /buses
**Description:** Get all buses  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

---

### GET /buses/company/:companyId
**Description:** Get buses for specific company  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### GET /buses/:id
**Description:** Get single bus  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

---

### PATCH /buses/:id
**Description:** Update bus details  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### DELETE /buses/:id
**Description:** Delete bus  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

## Driver Management

### POST /drivers
**Description:** Create new driver  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

**Request Body:**
```json
{
  "license": "DL123456",
  "userId": "uuid",
  "firstName": "Driver",
  "lastName": "Name",
  "phone": "+256700000000"
}
```

---

### GET /drivers
**Description:** Get all drivers  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### GET /drivers/:id
**Description:** Get single driver  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

---

### GET /drivers/:id/today-trip
**Description:** Get driver's trip for today  
**Authentication:** Required  
**Roles:** DRIVER

**Response (200 OK):**
```json
{
  "id": "trip-uuid",
  "status": "IN_PROGRESS",
  "routeId": "uuid",
  "busId": "uuid",
  "children": [
    {
      "id": "child-uuid",
      "firstName": "John",
      "homeLatitude": 0.3163,
      "homeLongitude": 32.5822
    }
  ]
}
```

---

### PATCH /drivers/:id
**Description:** Update driver details  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### DELETE /drivers/:id
**Description:** Delete driver  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

## Route Management

### POST /routes
**Description:** Create new route  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### GET /routes
**Description:** Get all routes  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

---

### GET /routes/:id
**Description:** Get single route  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

---

### GET /routes/school/:schoolId
**Description:** Get routes for specific school  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

---

### PATCH /routes/:id
**Description:** Update route  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### DELETE /routes/:id
**Description:** Delete route  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN

---

### POST /routes/auto-generate/:schoolId
**Description:** Auto-generate routes for school  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

## Trip Management

### POST /trips
**Description:** Create new trip  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### GET /trips
**Description:** Get all trips  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

---

### GET /trips/:id
**Description:** Get single trip  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

---

### GET /trips/child/:childId
**Description:** Get active trip for child  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, PARENT

**Response (200 OK):**
```json
{
  "id": "trip-uuid",
  "status": "IN_PROGRESS",
  "busId": "uuid",
  "currentLatitude": 0.3163,
  "currentLongitude": 32.5822,
  "estimatedArrival": "2025-12-16T08:30:00.000Z"
}
```

---

### GET /trips/company/:companyId/active
**Description:** Get active trips for company  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

---

### PATCH /trips/:id
**Description:** Update trip  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

---

### PATCH /trips/:id/status
**Description:** Update trip status  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "userId": "driver-uuid"
}
```

**Valid Status Transitions:**
- SCHEDULED → IN_PROGRESS
- IN_PROGRESS → ARRIVED_SCHOOL
- ARRIVED_SCHOOL → RETURN_IN_PROGRESS
- RETURN_IN_PROGRESS → COMPLETED

---

### DELETE /trips/:id
**Description:** Delete trip  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN

---

### POST /trips/generate-today
**Description:** Manually generate trips for today  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN

**Response (200 OK):**
```json
{
  "generated": 15,
  "timestamp": "2025-12-16T02:00:00.000Z"
}
```

---

## Attendance Management

### POST /attendance
**Description:** Record child attendance  
**Authentication:** Required  
**Roles:** DRIVER

**Request Body:**
```json
{
  "childId": "uuid",
  "tripId": "uuid",
  "status": "PICKED_UP",
  "recordedBy": "driver-uuid"
}
```

**Valid Status Values:**
- PENDING
- PICKED_UP
- DROPPED
- MISSED

---

### PATCH /attendance/:id
**Description:** Update attendance record  
**Authentication:** Required  
**Roles:** DRIVER

---

### GET /attendance/child/:childId
**Description:** Get attendance history for child  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, PARENT

---

### GET /attendance/trip/:tripId
**Description:** Get attendance for specific trip  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

---

### GET /attendance/:id
**Description:** Get single attendance record  
**Authentication:** Required  
**Roles:** PLATFORM_ADMIN, COMPANY_ADMIN, DRIVER

---

## Data Models

### User Roles
```typescript
enum Role {
  PLATFORM_ADMIN  // Full system access
  COMPANY_ADMIN   // Company-level management
  DRIVER          // Trip execution and attendance
  PARENT          // View children and trips
}
```

### Trip Status Flow
```typescript
enum TripStatus {
  SCHEDULED           // Trip created, not started
  IN_PROGRESS         // Driver picked up first child
  ARRIVED_SCHOOL      // Arrived at school
  RETURN_IN_PROGRESS  // Return trip started
  COMPLETED           // All children dropped off
}
```

### Attendance Status
```typescript
enum AttendanceStatus {
  PENDING     // Not yet recorded
  PICKED_UP   // Child picked up
  DROPPED     // Child dropped off
  MISSED      // Child not on bus
}
```

---

## Role-Based Access Control

### Endpoint Access Matrix

| Endpoint Pattern | PLATFORM_ADMIN | COMPANY_ADMIN | DRIVER | PARENT |
|-----------------|----------------|---------------|--------|--------|
| POST /auth/* | ✅ | ✅ | ✅ | ✅ |
| GET /admin/stats | ✅ | ❌ | ❌ | ❌ |
| GET /admin/stats/company/:id | ✅ | ✅ | ❌ | ❌ |
| POST /admin/company | ✅ | ❌ | ❌ | ❌ |
| POST /children/bulk-onboard | ✅ | ✅ | ❌ | ❌ |
| POST /children/link | ❌ | ❌ | ❌ | ✅ |
| GET /children | ✅ | ✅ | ❌ | ❌ |
| GET /children/parent/:id | ✅ | ✅ | ❌ | ✅ |
| POST /buses | ✅ | ✅ | ❌ | ❌ |
| GET /buses | ✅ | ✅ | ✅ | ❌ |
| POST /drivers | ✅ | ✅ | ❌ | ❌ |
| GET /drivers/:id/today-trip | ❌ | ❌ | ✅ | ❌ |
| POST /attendance | ❌ | ❌ | ✅ | ❌ |
| GET /trips/child/:id | ✅ | ✅ | ❌ | ✅ |

---

## Common Patterns

### Authentication Header
All authenticated endpoints require:
```
Authorization: Bearer {access_token}
```

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Error description",
  "timestamp": "2025-12-16T10:00:00.000Z",
  "path": "/api/endpoint"
}
```

### Common HTTP Status Codes
- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

---

## Testing Credentials

### Available Test Users

**Parent:**
```
Email: parent@test.com
Password: Test@1234
Role: PARENT
```

**Driver:**
```
Email: driver@saferide.com
Password: Test@1234
Role: DRIVER
```

**Company Admin:**
```
Email: admin@saferide.com
Password: Test@1234
Role: COMPANY_ADMIN
```

---

## Important Notes for Testing

1. **Authentication Response Format**: All auth endpoints return `access_token` and `refresh_token` in **snake_case**, not camelCase.

2. **Parent Limitations**: Parents cannot:
   - Access `GET /children` (use `GET /children/parent/:parentId` instead)
   - Bulk onboard children
   - Access admin endpoints

3. **Driver-Specific Endpoints**: Drivers have special endpoints like `/drivers/:id/today-trip` for their daily operations.

4. **Multi-Tenancy**: Most endpoints are scoped to `companyId` to ensure data isolation between companies.

5. **Trip Status Transitions**: Status changes must follow the defined flow. Invalid transitions will return 400 Bad Request.

6. **Unique Codes**: Child unique codes are 8 characters, auto-generated, used for parent linking.

---

**End of Documentation**
