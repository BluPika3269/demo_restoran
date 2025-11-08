#!/usr/bin/env node

/**
 * Pre-deployment Checklist Script
 * Provjerava da li je sve spremno za deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 NOKTI SALON - PRE-DEPLOYMENT CHECK\n');
console.log('='.repeat(60));

let allGood = true;

// Check 1: Client folder struktura
console.log('\n1️⃣  Provjeravam client folder strukturu...');
const clientPath = path.join(__dirname, 'client');
if (fs.existsSync(clientPath)) {
  console.log('   ✅ client/ folder postoji');
  
  // Check for required files
  const requiredFiles = [
    'package.json',
    'next.config.ts',
    'tsconfig.json',
    'prisma/schema.prisma',
    'src/app/api/services/route.ts',
    'src/app/api/categories/route.ts',
    'src/app/api/appointments/route.ts',
    'src/app/api/availability/route.ts',
    'src/app/api/admin/appointments/route.ts',
    'src/app/api/admin/appointments/[id]/route.ts'
  ];
  
  requiredFiles.forEach(file => {
    const filePath = path.join(clientPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} - NEDOSTAJE!`);
      allGood = false;
    }
  });
} else {
  console.log('   ❌ client/ folder ne postoji!');
  allGood = false;
}

// Check 2: API endpoints u kodu
console.log('\n2️⃣  Provjeravam API_URL u frontend kodu...');
const orderPagePath = path.join(clientPath, 'src/app/order/page.tsx');
const dashboardPagePath = path.join(clientPath, 'src/app/admin/dashboard/page.tsx');

if (fs.existsSync(orderPagePath)) {
  const orderContent = fs.readFileSync(orderPagePath, 'utf8');
  if (orderContent.includes("const API_URL = '/api'")) {
    console.log('   ✅ order/page.tsx koristi /api');
  } else if (orderContent.includes('NEXT_PUBLIC_API_URL')) {
    console.log('   ⚠️  order/page.tsx još uvijek koristi NEXT_PUBLIC_API_URL');
    console.log('      Trebalo bi biti: const API_URL = \'/api\';');
    allGood = false;
  }
}

if (fs.existsSync(dashboardPagePath)) {
  const dashboardContent = fs.readFileSync(dashboardPagePath, 'utf8');
  if (dashboardContent.includes("const API_URL = '/api'")) {
    console.log('   ✅ admin/dashboard/page.tsx koristi /api');
  } else if (dashboardContent.includes('NEXT_PUBLIC_API_URL')) {
    console.log('   ⚠️  admin/dashboard/page.tsx još uvijek koristi NEXT_PUBLIC_API_URL');
    console.log('      Trebalo bi biti: const API_URL = \'/api\';');
    allGood = false;
  }
}

// Check 3: vercel.json
console.log('\n3️⃣  Provjeravam vercel.json...');
const vercelJsonPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  
  if (vercelConfig.buildCommand && vercelConfig.buildCommand.includes('prisma generate')) {
    console.log('   ✅ Build command sadrži prisma generate');
  } else {
    console.log('   ⚠️  Build command ne sadrži prisma generate');
    allGood = false;
  }
  
  if (vercelConfig.rewrites || vercelConfig.redirects) {
    console.log('   ⚠️  vercel.json još uvijek ima rewrites/redirects ka backend serveru');
    console.log('      Ovo više nije potrebno - obriši rewrites sekciju');
  } else {
    console.log('   ✅ Nema proxy rewrites (dobro!)');
  }
}

// Check 4: Environment varijable
console.log('\n4️⃣  Provjeravam environment varijable...');
const envProductionPath = path.join(clientPath, '.env.production');
if (fs.existsSync(envProductionPath)) {
  const envContent = fs.readFileSync(envProductionPath, 'utf8');
  
  if (envContent.includes('DATABASE_URL')) {
    console.log('   ✅ DATABASE_URL je definisan');
    
    // Check for \r\n problem
    if (envContent.includes('\\r\\n"')) {
      console.log('   ⚠️  DATABASE_URL sadrži \\r\\n - TREBA FIXATI!');
      allGood = false;
    }
  } else {
    console.log('   ❌ DATABASE_URL nije definisan');
    allGood = false;
  }
  
  if (envContent.includes('NEXT_PUBLIC_API_URL')) {
    console.log('   ⚠️  NEXT_PUBLIC_API_URL je još uvijek tu - više nije potreban!');
    console.log('      Obriši ga iz Vercel Environment Variables');
  }
} else {
  console.log('   ℹ️  .env.production ne postoji (može biti OK)');
}

// Check 5: Prisma schema
console.log('\n5️⃣  Provjeravam Prisma schema...');
const prismaSchemaPath = path.join(clientPath, 'prisma/schema.prisma');
if (fs.existsSync(prismaSchemaPath)) {
  const schemaContent = fs.readFileSync(prismaSchemaPath, 'utf8');
  
  if (schemaContent.includes('model Service')) {
    console.log('   ✅ Service model postoji');
  }
  if (schemaContent.includes('model ServiceCategory')) {
    console.log('   ✅ ServiceCategory model postoji');
  }
  if (schemaContent.includes('model Appointment')) {
    console.log('   ✅ Appointment model postoji');
  }
} else {
  console.log('   ❌ prisma/schema.prisma ne postoji!');
  allGood = false;
}

// Check 6: Package.json scripts
console.log('\n6️⃣  Provjeravam package.json...');
const packageJsonPath = path.join(clientPath, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (pkg.scripts && pkg.scripts.build) {
    console.log(`   ✅ Build script: ${pkg.scripts.build}`);
  }
  
  if (pkg.dependencies && pkg.dependencies['@prisma/client']) {
    console.log('   ✅ @prisma/client je instaliran');
  } else {
    console.log('   ❌ @prisma/client nije u dependencies!');
    allGood = false;
  }
}

// Final summary
console.log('\n' + '='.repeat(60));
if (allGood) {
  console.log('\n✅ SVE JE SPREMNO ZA DEPLOYMENT!\n');
  console.log('Slijedeći koraci:');
  console.log('1. Dobij novi Neon DATABASE_URL');
  console.log('2. Postavi ga u Vercel Environment Variables');
  console.log('3. Deploy sa: vercel --prod');
} else {
  console.log('\n⚠️  POSTOJE PROBLEMI KOJE TREBA RIJEŠITI!\n');
  console.log('Provjeri gornje ❌ i ⚠️  upozorenja prije deployanja.');
}
console.log('\n' + '='.repeat(60));
