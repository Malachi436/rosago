# 🎯 Restructured Features - Payments & Bulk Onboarding

## ✅ What Changed

### 1. **Payments & Plans** (New Section)
**Location**: `🆕 Payments & Plans` in sidebar

**Purpose**: Central location for managing payment plans that parents can subscribe to

**Features**:
- ✅ Create multiple payment plans (Daily, Weekly, Monthly, Termly, Yearly)
- ✅ Set plan name, description, and amount
- ✅ Activate/Deactivate plans
- ✅ Edit existing plans
- ✅ Delete plans
- ✅ Plans appear directly in parent app for subscription

**File**: `admin-web/src/app/company/[companyId]/payments/page.tsx`

**What You'll See**:
- Card-based layout showing all payment plans
- Green border for active plans, gray for inactive
- Create/Edit modal for plan management
- Plan frequency selector (Daily/Weekly/Monthly/Termly/Yearly)

---

### 2. **Children Management** (Completely Redesigned)
**Location**: `🆕 Children Management` in sidebar

**Purpose**: Bulk onboard children from schools with existing transport systems

**Key Features**:

#### A. **Family Code System** 👨‍👩‍👧‍👦
- Group children by parent email
- Generate **one code per parent** (not per child)
- When parent uses code, **all their children are linked automatically**
- View mode: "By Parent (Family Codes)"

#### B. **Bulk Add Children** ➕
- Add multiple children at once with form
- Fields: First Name, Last Name, Grade, Parent Email, Parent Phone
- Add rows dynamically
- Select school before adding
- Children with same parent email = one family

#### C. **CSV Import** 📤
- Import hundreds/thousands of children at once
- Download CSV template button
- Format: `First Name, Last Name, Grade, Parent Email, Parent Phone`
- Automatic parent grouping

#### D. **Two View Modes** 
1. **By Parent View** (Default):
   - Shows parents with all their children
   - One "Generate Family Code" button per parent
   - Code applies to all children of that parent

2. **Individual View**:
   - Traditional list of all children
   - Shows individual codes (if any)

**File**: `admin-web/src/app/company/[companyId]/children-management/page.tsx`

---

## 🗂️ Updated Navigation

```
Admin Sidebar
├── Overview
├── Live Dashboard
├── Schools
├── Scheduled Routes
├── Trips
├── Children (existing list)
├── 🆕 Children Management    ← Bulk onboarding & family codes
├── Buses
├── Drivers
├── 🆕 Payments & Plans        ← Payment plan management
├── 🆕 Location Requests       ← Location change approvals
├── Analytics
└── Reports
```

**Removed**: "Fare Management" (replaced by "Payments & Plans")

---

## 🚀 How It Works

### Bulk Onboarding Flow

1. **Admin uploads CSV or manually adds children**
   ```csv
   First Name,Last Name,Grade,Parent Email,Parent Phone
   John,Doe,Grade 1,parent@example.com,0241234567
   Jane,Doe,Grade 3,parent@example.com,0241234567
   Mike,Smith,Grade 2,mike.parent@example.com,0245678901
   ```

2. **System groups children by parent email**
   - Parent 1 (`parent@example.com`): John Doe, Jane Doe
   - Parent 2 (`mike.parent@example.com`): Mike Smith

3. **Admin generates family codes**
   - Click "Generate Family Code" for each parent
   - One code (e.g., `ROS1234`) is created
   - Code is assigned to **all children** of that parent

4. **Parent uses the code**
   - Parent opens mobile app
   - Navigates to "Link Child" screen
   - Enters `ROS1234`
   - **All their children are automatically linked!**

---

### Payment Plans Flow

1. **Admin creates payment plans**
   - Monthly Plan: GHS 300/month
   - Termly Plan: GHS 800/term
   - Weekly Plan: GHS 80/week

2. **Plans appear in parent app**
   - Parents see all active plans
   - Can choose which plan suits them
   - Subscribe and make payment

3. **Admin can adjust plans**
   - Update amounts
   - Change descriptions
   - Activate/deactivate
   - Track plan usage

---

## 📋 CSV Template Format

```csv
First Name,Last Name,Grade,Parent Email,Parent Phone
Alice,Johnson,Grade 1,alice.parent@example.com,0241111111
Bob,Johnson,Grade 3,alice.parent@example.com,0241111111
Charlie,Williams,KG 2,charlie.mom@example.com,0242222222
Diana,Brown,Grade 5,diana.dad@example.com,0243333333
Emma,Brown,Grade 2,diana.dad@example.com,0243333333
Frank,Brown,KG 1,diana.dad@example.com,0243333333
```

**Result**:
- Parent 1 gets 1 code for Alice & Bob
- Parent 2 gets 1 code for Charlie
- Parent 3 gets 1 code for Diana, Emma & Frank

---

## 🎯 Key Benefits

### For Admins:
- ✅ Onboard entire schools quickly (100s of children in minutes)
- ✅ CSV upload for easy data transfer
- ✅ Family-based code system reduces complexity
- ✅ Flexible payment plan creation
- ✅ Easy plan management

### For Parents:
- ✅ One code links all their children
- ✅ Multiple payment plan options
- ✅ Clear pricing and billing frequency
- ✅ Easy subscription process

### For System:
- ✅ Scalable onboarding process
- ✅ Reduced code management overhead
- ✅ Flexible payment structure
- ✅ Better parent-child relationship tracking

---

## 🧪 Testing Guide

### Test 1: Bulk Onboarding with CSV
1. Login to admin: `admin@saferide.com` / `Test@1234`
2. Click "🆕 Children Management"
3. Click "📤 Import CSV"
4. Download template
5. Fill template with test data (use same email for siblings)
6. Select a school
7. Upload CSV
8. Verify children are grouped by parent

### Test 2: Family Code Generation
1. Stay in Children Management
2. Click "By Parent (Family Codes)" view
3. Find a parent with multiple children
4. Click "Generate Family Code"
5. Note the code (e.g., ROS1234)
6. Verify code appears for all children of that parent

### Test 3: Payment Plans
1. Click "🆕 Payments & Plans" in sidebar
2. Click "Create Plan"
3. Fill in:
   - Name: "Monthly Transport"
   - Amount: 300
   - Frequency: Monthly
4. Create plan
5. Verify plan appears as card
6. Try activating/deactivating
7. Edit amount and description

### Test 4: Parent Linking (Mobile)
1. Open mobile app as parent
2. Navigate to Link Child
3. Enter family code from Test 2
4. Set home location
5. Submit
6. Verify **all children** are linked

---

## 📁 Files Created/Modified

### New Files:
1. `admin-web/src/app/company/[companyId]/payments/page.tsx` (New)
   - Payment plan management UI
   - CRUD operations for plans
   - Plan activation/deactivation

### Modified Files:
1. `admin-web/src/components/Sidebar.tsx`
   - Removed "Fare Management"
   - Added "Payments & Plans"
   - Reorganized menu order

2. `admin-web/src/app/company/[companyId]/children-management/page.tsx`
   - Complete redesign
   - Added CSV import functionality
   - Added bulk add form
   - Added family code generation
   - Added view mode toggle (By Parent / Individual)
   - Added parent grouping logic

---

## 🎉 Ready to Use!

All features are now live and accessible in the admin dashboard. The restructuring makes the system more scalable and user-friendly for onboarding large numbers of children from existing transport systems.

**Next Steps**:
1. Test the CSV import with sample data
2. Generate family codes for existing children
3. Create payment plans for your service
4. Share family codes with parents
