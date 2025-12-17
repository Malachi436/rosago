# Child Management PRD

## Overview
Comprehensive child onboarding, linking, and management system allowing schools to bulk onboard children and parents to claim them using unique codes.

## Features

### 1. Bulk Child Onboarding
- CSV upload for bulk child creation
- Unique 8-character alphanumeric code generation
- School and company association
- Grade and section assignment
- Parent phone tracking

### 2. Child Linking System
- Parent claims child using unique code
- Home location capture during linking
- Duplicate linking prevention
- Invalid code validation
- isClaimed status tracking

### 3. Route Assignment
- Assign children to routes
- Dynamic route reassignment
- Historical trip preservation
- Future trip updates

### 4. Child Profile Management
- Personal information (name, grade, section)
- Medical information (allergies, special instructions)
- Contact information (parent phone, emergency contacts)
- Color code for visual identification
- Home location tracking

### 5. Location Management
- Home location updates
- Location change requests
- Admin approval workflow
- Location history preservation

### 6. Additional Features
- Unclaimed children visibility
- Bulk grade promotion
- Soft delete support
- Profile completeness validation

## API Endpoints
- POST /children/bulk-onboard
- POST /children/link
- GET /children
- GET /children/:id
- PATCH /children/:id
- DELETE /children/:id
- POST /children/:id/assign-route
- GET /children/unclaimed

## Data Model
- uniqueCode: 8-char alphanumeric (no ROS prefix)
- isClaimed: boolean
- parentId: UUID (nullable)
- routeId: UUID (nullable)
- homeLocation: { latitude, longitude, address }
- allergies: text
- specialInstructions: text
- colorCode: hex color (default: #3B82F6)
