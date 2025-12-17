# Authentication & Authorization PRD

## Overview
ROSAgo implements JWT-based authentication with role-based access control supporting four user roles: Platform Admin, Company Admin, Driver, and Parent.

## Features

### 1. Login System
- Multi-role authentication (Platform Admin, Company Admin, Driver, Parent)
- JWT access tokens (15 minute expiry)
- JWT refresh tokens (7 day expiry)
- Secure password hashing with bcrypt
- Email and password validation

### 2. Token Management
- Automatic token refresh on expiry
- Multi-device login support
- Secure token storage
- Token cleanup on logout

### 3. Role-Based Access Control
- Platform Admin: Full system access across all companies
- Company Admin: Access to own company data only
- Driver: Access to assigned buses and trips
- Parent: Access to own children only

### 4. Password Management
- Forgot password functionality
- Password reset via email
- Reset token expiration (1 hour)
- Secure password update

### 5. Session Management
- Multi-device session support
- Session timeout handling
- Automatic logout on refresh failure
- WebSocket connection management

## API Endpoints
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- POST /auth/forgot-password
- POST /auth/reset-password

## Security Requirements
- No sensitive data in error messages
- Audit logging for security events
- Rate limiting on auth endpoints
- Protection against brute force attacks
