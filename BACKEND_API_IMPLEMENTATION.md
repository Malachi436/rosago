# 🔌 Backend API Implementation Guide

## 📋 Required API Endpoints

This guide shows exactly what backend APIs need to be implemented for the route-child system to work with the admin dashboard.

---

## 1️⃣ Route Management APIs

### GET /admin/company/:companyId/routes
**Purpose**: List all routes for a company

**Response**:
```typescript
Route[] {
  id: string;
  name: string;
  schoolId: string;
  busId?: string;
  shift?: "MORNING" | "AFTERNOON";
  bus?: {
    id: string;
    plateNumber: string;
    driver: {
      id: string;
      user: {
        firstName: string;
        lastName: string;
      };
    };
  };
  _count?: {
    children: number;
  };
  createdAt: string;
}
```

**Implementation**:
```typescript
@Get('company/:companyId/routes')
async getRoutes(@Param('companyId') companyId: string) {
  return this.prisma.route.findMany({
    where: {
      school: {
        companyId: companyId
      }
    },
    include: {
      bus: {
        include: {
          driver: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      },
      _count: {
        select: {
          children: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}
```

---

### POST /admin/routes
**Purpose**: Create a new route

**Request Body**:
```typescript
{
  name: string;          // "Bus 1 - Morning Pickup"
  schoolId: string;      // UUID
  busId?: string;        // UUID (optional)
  shift?: "MORNING" | "AFTERNOON";
}
```

**Response**:
```typescript
Route {
  id: string;
  name: string;
  schoolId: string;
  busId?: string;
  shift?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Implementation**:
```typescript
@Post('routes')
async createRoute(@Body() data: CreateRouteDto) {
  return this.prisma.route.create({
    data: {
      name: data.name,
      schoolId: data.schoolId,
      busId: data.busId || null,
      shift: data.shift || null
    },
    include: {
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
}
```

---

### PATCH /admin/routes/:id
**Purpose**: Update a route

**Request Body**:
```typescript
{
  name?: string;
  busId?: string;
  shift?: "MORNING" | "AFTERNOON";
}
```

**Implementation**:
```typescript
@Patch('routes/:id')
async updateRoute(
  @Param('id') id: string,
  @Body() data: UpdateRouteDto
) {
  return this.prisma.route.update({
    where: { id },
    data: {
      name: data.name,
      busId: data.busId,
      shift: data.shift
    },
    include: {
      bus: {
        include: {
          driver: {
            include: {
              user: true
            }
          }
        }
      },
      _count: {
        select: { children: true }
      }
    }
  });
}
```

---

### DELETE /admin/routes/:id
**Purpose**: Delete a route

**Implementation**:
```typescript
@Delete('routes/:id')
async deleteRoute(@Param('id') id: string) {
  // Check if route has children
  const route = await this.prisma.route.findUnique({
    where: { id },
    include: { _count: { select: { children: true } } }
  });

  if (route._count.children > 0) {
    throw new BadRequestException(
      `Cannot delete route with ${route._count.children} children assigned. Please reassign them first.`
    );
  }

  return this.prisma.route.delete({
    where: { id }
  });
}
```

---

### GET /admin/routes/:id/children
**Purpose**: Get all children on a specific route

**Response**:
```typescript
Child[] {
  id: string;
  firstName: string;
  lastName: string;
  grade?: string;
  parentPhone?: string;
  isClaimed: boolean;
  daysUntilPayment?: number;
}
```

**Implementation**:
```typescript
@Get('routes/:id/children')
async getRouteChildren(@Param('id') id: string) {
  return this.prisma.child.findMany({
    where: { routeId: id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      grade: true,
      parentPhone: true,
      isClaimed: true,
      daysUntilPayment: true,
      uniqueCode: true
    },
    orderBy: [
      { isClaimed: 'asc' },
      { lastName: 'asc' }
    ]
  });
}
```

---

## 2️⃣ Children Management APIs (Updated)

### POST /children/bulk-onboard
**Purpose**: Bulk onboard children with route assignment

**Request Body**:
```typescript
{
  companyId: string;
  schoolId: string;
  children: [{
    firstName: string;
    lastName: string;
    grade?: string;
    parentPhone?: string;
    daysUntilPayment?: number;
    routeId?: string;  // NEW
    dateOfBirth: string;  // ISO date string
  }];
}
```

**Implementation**:
```typescript
@Post('children/bulk-onboard')
async bulkOnboard(@Body() data: BulkOnboardDto) {
  const children = await this.prisma.$transaction(
    data.children.map(child => 
      this.prisma.child.create({
        data: {
          firstName: child.firstName,
          lastName: child.lastName,
          grade: child.grade,
          parentPhone: child.parentPhone,
          daysUntilPayment: child.daysUntilPayment,
          routeId: child.routeId || null,  // NEW
          schoolId: data.schoolId,
          dateOfBirth: new Date(child.dateOfBirth),
          isClaimed: false
        }
      })
    )
  );

  return {
    success: true,
    count: children.length,
    children
  };
}
```

---

### GET /admin/company/:companyId/children
**Purpose**: Get all children with route info

**Response**:
```typescript
Child[] {
  id: string;
  firstName: string;
  lastName: string;
  grade?: string;
  parentPhone?: string;
  isClaimed: boolean;
  daysUntilPayment?: number;
  uniqueCode?: string;
  routeId?: string;
  route?: {
    id: string;
    name: string;
    shift?: string;
    bus?: {
      plateNumber: string;
    };
  };
  school: {
    id: string;
    name: string;
  };
}
```

**Implementation**:
```typescript
@Get('company/:companyId/children')
async getChildren(@Param('companyId') companyId: string) {
  return this.prisma.child.findMany({
    where: {
      school: {
        companyId: companyId
      }
    },
    include: {
      school: {
        select: {
          id: true,
          name: true
        }
      },
      route: {
        select: {
          id: true,
          name: true,
          shift: true,
          bus: {
            select: {
              plateNumber: true
            }
          }
        }
      }
    },
    orderBy: [
      { isClaimed: 'asc' },
      { lastName: 'asc' }
    ]
  });
}
```

---

### POST /children/generate-code
**Purpose**: Generate unique code (unchanged)

**Implementation**: (existing - no changes needed)

---

### PATCH /children/:id
**Purpose**: Update child (support new fields)

**Request Body**:
```typescript
{
  uniqueCode?: string;
  routeId?: string;  // NEW
  isClaimed?: boolean;  // NEW (renamed from isLinked)
  allergies?: string;  // NEW
  specialInstructions?: string;  // NEW
  homeLatitude?: number;
  homeLongitude?: number;
  homeAddress?: string;
  // ... other fields
}
```

**Implementation**:
```typescript
@Patch('children/:id')
async updateChild(
  @Param('id') id: string,
  @Body() data: UpdateChildDto
) {
  return this.prisma.child.update({
    where: { id },
    data: {
      uniqueCode: data.uniqueCode,
      routeId: data.routeId,
      isClaimed: data.isClaimed,
      allergies: data.allergies,
      specialInstructions: data.specialInstructions,
      homeLatitude: data.homeLatitude,
      homeLongitude: data.homeLongitude,
      homeAddress: data.homeAddress
    },
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
}
```

---

## 3️⃣ Bus Management APIs (Updated)

### GET /admin/company/:companyId/buses
**Purpose**: Get all buses with driver info

**Response**:
```typescript
Bus[] {
  id: string;
  plateNumber: string;
  capacity: number;
  driver: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  _count?: {
    routes: number;
  };
}
```

**Implementation**:
```typescript
@Get('company/:companyId/buses')
async getBuses(@Param('companyId') companyId: string) {
  // Get company's drivers first
  const drivers = await this.prisma.driver.findMany({
    where: {
      user: {
        companyId: companyId
      }
    },
    select: { id: true }
  });

  const driverIds = drivers.map(d => d.id);

  return this.prisma.bus.findMany({
    where: {
      driverId: {
        in: driverIds
      }
    },
    include: {
      driver: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      },
      _count: {
        select: {
          routes: true
        }
      }
    },
    orderBy: {
      plateNumber: 'asc'
    }
  });
}
```

---

## 4️⃣ Trip Generation (Enhanced)

### Automatic Trip Generation from Scheduled Routes

**Purpose**: Daily cron job to generate trips

**Implementation**:
```typescript
@Cron('0 0 * * *') // Run at midnight daily
async generateDailyTrips() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get active scheduled routes for today
  const scheduledRoutes = await this.prisma.scheduledRoute.findMany({
    where: {
      status: 'ACTIVE',
      OR: [
        { effectiveFrom: { lte: today } },
        { effectiveFrom: null }
      ],
      OR: [
        { effectiveUntil: { gte: today } },
        { effectiveUntil: null }
      ]
    },
    include: {
      route: {
        include: {
          children: true  // Get all children on route
        }
      },
      bus: true,
      driver: true
    }
  });

  const trips = [];

  for (const sr of scheduledRoutes) {
    // Create trip
    const trip = await this.prisma.trip.create({
      data: {
        routeId: sr.routeId,
        busId: sr.busId,
        driverId: sr.driverId,
        scheduledTime: new Date(`${today.toISOString().split('T')[0]}T${sr.scheduledTime}`),
        status: 'SCHEDULED'
      }
    });

    // Create attendance records for all children on route
    if (sr.route.children.length > 0) {
      await this.prisma.childAttendance.createMany({
        data: sr.route.children.map(child => ({
          childId: child.id,
          tripId: trip.id,
          status: 'PENDING'
        }))
      });
    }

    trips.push(trip);
  }

  console.log(`Generated ${trips.length} trips for ${today.toDateString()}`);
  return trips;
}
```

---

### GET /driver/trips/:date (Enhanced)

**Purpose**: Get driver's trips with children from routes

**Implementation**:
```typescript
@Get('driver/trips/:date')
async getDriverTrips(
  @Param('date') date: string,
  @Request() req
) {
  const driverId = req.user.driverId;
  const targetDate = new Date(date);

  return this.prisma.trip.findMany({
    where: {
      driverId: driverId,
      scheduledTime: {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lt: new Date(targetDate.setHours(23, 59, 59, 999))
      }
    },
    include: {
      route: {
        select: {
          name: true,
          shift: true
        }
      },
      bus: {
        select: {
          plateNumber: true
        }
      },
      attendance: {
        include: {
          child: {
            include: {
              parent: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                      phone: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      scheduledTime: 'asc'
    }
  });
}
```

---

## 5️⃣ Parent Claiming (Enhanced)

### POST /children/verify-code

**Purpose**: Verify family code and return children info

**Request Body**:
```typescript
{
  uniqueCode: string;
}
```

**Response**:
```typescript
{
  children: Child[] {
    id: string;
    firstName: string;
    lastName: string;
    grade?: string;
    daysUntilPayment?: number;
    routeId?: string;
    route?: {
      name: string;
      shift?: string;
      bus?: {
        plateNumber: string;
        driver: {
          user: {
            firstName: string;
            lastName: string;
          };
        };
      };
    };
    school: {
      name: string;
    };
  }
}
```

**Implementation**:
```typescript
@Post('children/verify-code')
async verifyCode(@Body() data: { uniqueCode: string }) {
  const children = await this.prisma.child.findMany({
    where: {
      uniqueCode: data.uniqueCode,
      isClaimed: false
    },
    include: {
      school: {
        select: { name: true }
      },
      route: {
        select: {
          name: true,
          shift: true,
          bus: {
            select: {
              plateNumber: true,
              driver: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (children.length === 0) {
    throw new NotFoundException('Invalid code or children already claimed');
  }

  return { children };
}
```

---

### POST /children/claim

**Purpose**: Claim children (parent fills remaining info)

**Request Body**:
```typescript
{
  uniqueCode: string;
  parentId: string;
  homeLatitude: number;
  homeLongitude: number;
  homeAddress: string;
  childrenDetails: [{
    childId: string;
    allergies?: string;
    specialInstructions?: string;
  }];
}
```

**Implementation**:
```typescript
@Post('children/claim')
async claimChildren(@Body() data: ClaimChildrenDto) {
  // Update all children with this code
  const updates = data.childrenDetails.map(detail =>
    this.prisma.child.update({
      where: { id: detail.childId },
      data: {
        parentId: data.parentId,
        isClaimed: true,
        homeLatitude: data.homeLatitude,
        homeLongitude: data.homeLongitude,
        homeAddress: data.homeAddress,
        allergies: detail.allergies,
        specialInstructions: detail.specialInstructions
      }
    })
  );

  const children = await this.prisma.$transaction(updates);

  return {
    success: true,
    claimed: children.length,
    children
  };
}
```

---

## 📊 Testing Endpoints

### Test Route Creation
```bash
curl -X POST http://localhost:3000/admin/routes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bus 1 - Morning Pickup",
    "schoolId": "school-uuid",
    "busId": "bus-uuid",
    "shift": "MORNING"
  }'
```

### Test Bulk Onboarding with Routes
```bash
curl -X POST http://localhost:3000/children/bulk-onboard \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "company-uuid",
    "schoolId": "school-uuid",
    "children": [{
      "firstName": "Ama",
      "lastName": "Boateng",
      "grade": "Grade 3",
      "parentPhone": "0241234567",
      "daysUntilPayment": 30,
      "routeId": "route-uuid",
      "dateOfBirth": "2015-03-15"
    }]
  }'
```

### Test Get Children with Routes
```bash
curl http://localhost:3000/admin/company/company-uuid/children
```

---

## ✅ Implementation Checklist

- [ ] Create route CRUD endpoints
- [ ] Update bulk onboarding to accept routeId
- [ ] Update get children to include route data
- [ ] Update child update endpoint (new fields)
- [ ] Enhance trip generation (include route children)
- [ ] Create verify-code endpoint
- [ ] Create claim endpoint
- [ ] Update driver trips endpoint (show route info)
- [ ] Add route children count
- [ ] Test all endpoints
- [ ] Update API documentation
- [ ] Deploy to staging
- [ ] Test with admin dashboard

---

This completes the backend API requirements for the route-child system! 🚀
