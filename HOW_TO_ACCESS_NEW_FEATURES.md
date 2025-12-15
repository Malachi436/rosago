# 🎯 How to Access the New Features

## 🔑 Login Credentials

**Admin Dashboard**: http://localhost:3001
- Email: `admin@saferide.com`
- Password: `Test@1234`

**Mobile App** (Driver): `driver@saferide.com` / `Test@1234`
**Mobile App** (Parent): `parent@test.com` / `Test@1234`

---

## 💻 Admin Dashboard - New Navigation Items

After logging in to the admin dashboard, you'll see **3 new menu items** marked with 🆕:

### 1. 🆕 Children Management
**Location in Sidebar**: Between "Children" and "Location Requests"

**Features**:
- ✅ Generate unique child codes (ROS####)
- ✅ Assign codes to children
- ✅ View linked/unlinked status
- ✅ Bulk grade promotion
- ✅ Select repeated students for exclusion

**What You'll See**:
- Table of all children in your company
- "Generate Code" button for each child
- "Bulk Promote Grades" button at the top
- Unique code display for each child
- Linked status indicators

---

### 2. 🆕 Location Requests
**Location in Sidebar**: Between "Children Management" and "Fare Management"

**Features**:
- ✅ View pending location change requests from parents
- ✅ Compare old vs new locations
- ✅ View request details (child, parent, reason)
- ✅ Approve or reject requests with notes
- ✅ View location on Google Maps

**What You'll See**:
- List of pending location change requests
- Old location vs new location comparison cards
- Parent and child information
- "Review Request" button
- Approve/Reject modal with notes field

---

### 3. 🆕 Fare Management
**Location in Sidebar**: Between "Location Requests" and "Buses"

**Features**:
- ✅ View current fare in large display
- ✅ Update fare with reason
- ✅ View fare change history
- ✅ Automatic parent notifications

**What You'll See**:
- Current fare displayed prominently
- "Update Fare" form with reason field
- Fare change history table
- Timestamps for all changes

---

## 📱 Mobile App - New Screens

### Driver App

#### Driver Notifications (Enhanced)
**How to Access**: Driver Dashboard → Notifications icon

**What's New**:
- 🆕 "Requires Action" tab for urgent notifications
- 🆕 Acknowledge button for emergency requests
- 🆕 Unskip notifications with child details
- 🆕 Location change notifications

---

### Parent App

#### 1. Link Child Screen
**How to Access**: Parent Dashboard → Add Child → Link Child

**Features**:
- 🆕 Enter unique code from school
- 🆕 GPS location capture
- 🆕 Home address input
- 🆕 Step-by-step wizard

---

#### 2. Request Location Change
**How to Access**: Parent Dashboard → Request Location Change

**Features**:
- 🆕 Select child to update
- 🆕 GPS capture for new location
- 🆕 Reason field
- 🆕 Visual location preview

---

#### 3. Emergency Unskip
**How to Access**: Parent Dashboard → Child Card → Skip Today → Emergency Unskip

**Features**:
- 🆕 "Emergency Unskip" button (appears after skipping)
- 🆕 Reason prompt
- 🆕 Driver notification with acknowledgment
- 🆕 Visual feedback

---

## 🚀 Quick Test Flow

### Test 1: Generate and Link Child
1. Login to **Admin Dashboard**
2. Click "🆕 Children Management" in sidebar
3. Click "Generate Code" for a child → Note the code (e.g., ROS1234)
4. Open **Mobile App** as parent
5. Navigate to Link Child screen
6. Enter the code and set location
7. Submit and verify child is linked

### Test 2: Location Change Request
1. Open **Mobile App** as parent
2. Navigate to Request Location Change
3. Select a child
4. Use GPS to capture new location
5. Enter reason and submit
6. Login to **Admin Dashboard**
7. Click "🆕 Location Requests" in sidebar
8. Review and approve/reject the request

### Test 3: Fare Update
1. Login to **Admin Dashboard**
2. Click "🆕 Fare Management" in sidebar
3. Enter new fare amount and reason
4. Click "Update Fare"
5. Check fare history table
6. Parents will receive notification in mobile app

### Test 4: Emergency Unskip
1. Open **Mobile App** as parent
2. Click "Skip Today" on a child
3. Observe "🚨 Emergency Unskip" button appears
4. Click it and enter reason
5. Open **Driver App**
6. Check notifications - should see urgent unskip notification
7. Acknowledge the notification

---

## ✅ Verification Checklist

- [ ] Can see 3 new menu items in admin sidebar (marked with 🆕)
- [ ] Children Management page loads and displays children
- [ ] Can generate unique codes
- [ ] Location Requests page shows pending requests
- [ ] Fare Management page displays current fare
- [ ] Can update fare successfully
- [ ] Driver sees notifications in mobile app
- [ ] Parent can link child with unique code
- [ ] Parent can request location change
- [ ] Emergency unskip functionality works

---

## 🎉 That's It!

All 6 features are now **100% visible and accessible** in the admin dashboard and mobile apps.

The new features are clearly marked with the 🆕 badge in the sidebar navigation!
