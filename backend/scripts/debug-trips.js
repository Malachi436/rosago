const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugTrips() {
  try {
    console.log('\n🔍 Debugging Trip and Attendance Data...\n');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Check today's trips
    const trips = await prisma.trip.findMany({
      where: {
        startTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        route: true,
        bus: true,
        driver: {
          include: {
            user: true,
          },
        },
        attendances: {
          include: {
            child: true,
          },
        },
      },
    });

    console.log(`📅 Found ${trips.length} trip(s) for today (${today.toDateString()})\n`);
    console.log('='.repeat(80));

    if (trips.length === 0) {
      console.log('\n⚠️  NO TRIPS FOUND FOR TODAY!');
      console.log('\nPossible reasons:');
      console.log('1. Trips haven\'t been generated yet (runs at 2:00 AM)');
      console.log('2. No active scheduled routes for today');
      console.log('3. Manually generate trips via: POST /trips/generate-today\n');
    } else {
      trips.forEach((trip, index) => {
        console.log(`\n${index + 1}. Trip ID: ${trip.id}`);
        console.log(`   Route: ${trip.route?.name || 'N/A'}`);
        console.log(`   Bus: ${trip.bus?.plateNumber || 'N/A'}`);
        console.log(`   Driver: ${trip.driver?.user?.firstName} ${trip.driver?.user?.lastName}`);
        console.log(`   Status: ${trip.status}`);
        console.log(`   Start Time: ${trip.startTime.toLocaleString()}`);
        console.log(`   Children (${trip.attendances.length}):`);
        
        if (trip.attendances.length === 0) {
          console.log('     ⚠️  NO CHILDREN ASSIGNED TO THIS TRIP!');
        } else {
          trip.attendances.forEach((att) => {
            console.log(`     - ${att.child.firstName} ${att.child.lastName} (Status: ${att.status})`);
          });
        }
      });
    }

    console.log('\n' + '='.repeat(80));

    // 2. Check children with routes assigned
    const childrenWithRoutes = await prisma.child.findMany({
      where: {
        routeId: { not: null },
      },
      include: {
        route: true,
        parent: true,
      },
    });

    console.log(`\n👶 Found ${childrenWithRoutes.length} children with routes assigned:\n`);
    
    if (childrenWithRoutes.length === 0) {
      console.log('⚠️  NO CHILDREN ASSIGNED TO ANY ROUTE!\n');
      console.log('Please assign children to routes via the admin panel.\n');
    } else {
      childrenWithRoutes.forEach((child) => {
        console.log(`- ${child.firstName} ${child.lastName}`);
        console.log(`  Route: ${child.route?.name || 'N/A'}`);
        console.log(`  Parent: ${child.parent ? `${child.parent.firstName} ${child.parent.lastName}` : 'Not linked'}`);
        console.log(`  Claimed: ${child.isClaimed ? 'Yes' : 'No'}\n`);
      });
    }

    // 3. Check all attendance records for today
    const allAttendances = await prisma.childAttendance.findMany({
      where: {
        trip: {
          startTime: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
      include: {
        child: true,
        trip: {
          include: {
            route: true,
          },
        },
      },
    });

    console.log('='.repeat(80));
    console.log(`\n📋 Total Attendance Records for Today: ${allAttendances.length}\n`);
    
    if (allAttendances.length === 0) {
      console.log('⚠️  NO ATTENDANCE RECORDS FOUND!\n');
      console.log('This means children are not linked to trips.\n');
    }

    console.log('='.repeat(80));
    console.log('\n✅ Debug complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugTrips();
