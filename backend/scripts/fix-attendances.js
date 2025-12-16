const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixMissingAttendances() {
  try {
    console.log('\n🔧 Fixing missing attendances for today\'s trips...\n');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all trips for today
    const trips = await prisma.trip.findMany({
      where: {
        startTime: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS'],
        },
      },
      include: {
        route: true,
        attendances: true,
      },
    });

    console.log(`Found ${trips.length} active trip(s) for today\n`);

    let totalAdded = 0;

    for (const trip of trips) {
      console.log(`\n📍 Processing Trip: ${trip.route?.name || 'Unknown Route'}`);
      console.log(`   Trip ID: ${trip.id}`);
      console.log(`   Status: ${trip.status}`);

      // Get all children assigned to this route
      const children = await prisma.child.findMany({
        where: {
          routeId: trip.routeId,
        },
      });

      console.log(`   Found ${children.length} child(ren) assigned to this route`);

      let addedToThisTrip = 0;

      for (const child of children) {
        // Check if attendance already exists
        const existingAttendance = await prisma.childAttendance.findUnique({
          where: {
            childId_tripId: {
              childId: child.id,
              tripId: trip.id,
            },
          },
        });

        if (!existingAttendance) {
          // Create attendance record
          await prisma.childAttendance.create({
            data: {
              childId: child.id,
              tripId: trip.id,
              status: 'PENDING',
              recordedBy: 'system-fix',
            },
          });

          console.log(`   ✅ Added ${child.firstName} ${child.lastName} to trip`);
          addedToThisTrip++;
          totalAdded++;
        } else {
          console.log(`   ⏭️  ${child.firstName} ${child.lastName} already in trip`);
        }
      }

      console.log(`   Summary: ${addedToThisTrip} children added to this trip`);
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n✅ Fix complete! Total attendances added: ${totalAdded}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

fixMissingAttendances();
