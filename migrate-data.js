// Script za migraciju podataka iz lokalne baze u Neon
const { PrismaClient } = require('./client/node_modules/@prisma/client');

const localDb = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:fgg@localhost:5432/web_stranica_nokti'
    }
  }
});

const neonDb = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_rgSBQKc4Gk1T@ep-flat-credit-agkt1oxd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
    }
  }
});

async function migrateData() {
  try {
    console.log('🔄 Povezujem se na lokalnu bazu...');
    
    // Fetch data from local database
    const categories = await localDb.serviceCategory.findMany({
      include: {
        services: true
      }
    });
    
    console.log(`✅ Pronađeno ${categories.length} kategorija u lokalnoj bazi`);
    
    // Očisti Neon bazu prvo
    console.log('🗑️  Brišem postojeće podatke iz Neon baze...');
    await neonDb.appointment.deleteMany({});
    await neonDb.service.deleteMany({});
    await neonDb.serviceCategory.deleteMany({});
    
    console.log('📤 Migriram podatke u Neon...');
    
    // Insert categories and services
    for (const category of categories) {
      const { services, ...categoryData } = category;
      
      console.log(`  ➕ Dodajem kategoriju: ${category.name}`);
      const newCategory = await neonDb.serviceCategory.create({
        data: {
          name: categoryData.name,
          type: categoryData.type
        }
      });
      
      // Insert services for this category
      for (const service of services) {
        console.log(`    ➕ Dodajem uslugu: ${service.name}`);
        await neonDb.service.create({
          data: {
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            image: service.image,
            categoryId: newCategory.id
          }
        });
      }
    }
    
    // Get appointments from local
    const appointments = await localDb.appointment.findMany({
      include: {
        service: true
      }
    });
    console.log(`\n📅 Pronađeno ${appointments.length} termina u lokalnoj bazi`);
    
    if (appointments.length > 0) {
      console.log('📤 Migriram termine...');
      for (const apt of appointments) {
        // Find matching service in Neon by name
        const neonService = await neonDb.service.findFirst({
          where: {
            name: apt.service.name
          }
        });
        
        if (neonService) {
          await neonDb.appointment.create({
            data: {
              serviceId: neonService.id,
              size: apt.size,
              design: apt.design,
              date: apt.date,
              time: apt.time,
              customerName: apt.customerName,
              customerPhone: apt.customerPhone,
              customerEmail: apt.customerEmail,
              status: apt.status,
              notes: apt.notes
            }
          });
        } else {
          console.log(`    ⚠️  Preskačem termin - usluga "${apt.service.name}" nije pronađena`);
        }
      }
    }
    
    // Verify migration
    const neonCategories = await neonDb.serviceCategory.count();
    const neonServices = await neonDb.service.count();
    const neonAppointments = await neonDb.appointment.count();
    
    console.log('\n✅ Migracija završena!');
    console.log(`📊 Ukupno u Neon bazi:`);
    console.log(`   - ${neonCategories} kategorija`);
    console.log(`   - ${neonServices} usluga`);
    console.log(`   - ${neonAppointments} termina`);
    
  } catch (error) {
    console.error('❌ Greška pri migraciji:', error);
  } finally {
    await localDb.$disconnect();
    await neonDb.$disconnect();
  }
}

migrateData();
