// Skripta za sinkronizaciju lokalne baze na Neon
const { PrismaClient } = require('./client/node_modules/@prisma/client');

// Lokalna baza
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:fgg@localhost:5432/restoran_booking'
    }
  }
});

// Neon baza
const neonPrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_rgSBQKc4Gk1T@ep-flat-credit-agkt1oxd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
    }
  }
});

async function syncData() {
  try {
    console.log('🔄 Starting data sync from local to Neon...\n');

    // 1. Fetch data from local database
    console.log('📥 Fetching data from local database...');
    const localCategories = await localPrisma.serviceCategory.findMany({
      orderBy: { id: 'asc' }
    });
    const localServices = await localPrisma.service.findMany({
      orderBy: { id: 'asc' }
    });
    const localAppointments = await localPrisma.appointment.findMany({
      orderBy: { id: 'asc' }
    });

    console.log(`   Found ${localCategories.length} categories`);
    console.log(`   Found ${localServices.length} services`);
    console.log(`   Found ${localAppointments.length} appointments\n`);

    // 2. Clear Neon database
    console.log('🗑️  Clearing Neon database...');
    await neonPrisma.appointment.deleteMany({});
    await neonPrisma.service.deleteMany({});
    await neonPrisma.serviceCategory.deleteMany({});
    console.log('   ✅ Cleared\n');

    // 3. Upload categories
    console.log('📤 Uploading categories to Neon...');
    for (const category of localCategories) {
      await neonPrisma.serviceCategory.create({
        data: {
          id: category.id,
          name: category.name,
          icon: category.icon,
          slug: category.slug,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }
      });
    }
    console.log(`   ✅ Uploaded ${localCategories.length} categories\n`);

    // 4. Upload services
    console.log('📤 Uploading services to Neon...');
    for (const service of localServices) {
      await neonPrisma.service.create({
        data: {
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          image: service.image,
          categoryId: service.categoryId,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt
        }
      });
    }
    console.log(`   ✅ Uploaded ${localServices.length} services\n`);

    // 5. Upload appointments
    console.log('📤 Uploading appointments to Neon...');
    for (const apt of localAppointments) {
      await neonPrisma.appointment.create({
        data: {
          id: apt.id,
          serviceId: apt.serviceId,
          size: apt.size,
          design: apt.design,
          date: apt.date,
          time: apt.time,
          customerName: apt.customerName,
          customerPhone: apt.customerPhone,
          customerEmail: apt.customerEmail,
          status: apt.status,
          notes: apt.notes,
          createdAt: apt.createdAt,
          updatedAt: apt.updatedAt
        }
      });
    }
    console.log(`   ✅ Uploaded ${localAppointments.length} appointments\n`);

    console.log('🎉 Sync completed successfully!');
  } catch (error) {
    console.error('❌ Error syncing data:', error);
    throw error;
  } finally {
    await localPrisma.$disconnect();
    await neonPrisma.$disconnect();
  }
}

syncData();
