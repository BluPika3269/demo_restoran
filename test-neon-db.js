const { PrismaClient } = require('./client/node_modules/@prisma/client');

// Koristi Neon production URL
const DATABASE_URL = "postgresql://neondb_owner:npg_rgSBQKc4Gk1T@ep-flat-credit-agkt1oxd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function testNeonConnection() {
  console.log('🔍 Testiram konekciju na Neon...\n');
  
  try {
    // Test 1: Provjeri konekciju
    await prisma.$connect();
    console.log('✅ Povezan na Neon bazu!\n');
    
    // Test 2: Broj kategorija
    const categoriesCount = await prisma.serviceCategory.count();
    console.log(`📊 Broj kategorija: ${categoriesCount}`);
    
    // Test 3: Lista kategorija
    const categories = await prisma.serviceCategory.findMany({
      include: {
        services: true
      }
    });
    console.log('\n📋 Kategorije:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.services.length} usluga)`);
    });
    
    // Test 4: Broj usluga
    const servicesCount = await prisma.service.count();
    console.log(`\n📊 Broj usluga: ${servicesCount}`);
    
    // Test 5: Lista usluga
    const services = await prisma.service.findMany({
      include: {
        category: true
      }
    });
    console.log('\n🛠️ Usluge:');
    services.forEach(service => {
      console.log(`  - ${service.name} (${service.price} €, ${service.duration} min) - Kategorija: ${service.category.name}`);
    });
    
    // Test 6: Broj appointmenta
    const appointmentsCount = await prisma.appointment.count();
    console.log(`\n📊 Broj appointmenta: ${appointmentsCount}`);
    
    console.log('\n✅ Svi testovi uspješni!');
    
  } catch (error) {
    console.error('❌ Greška:', error.message);
    console.error('\nDetalji:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNeonConnection();
