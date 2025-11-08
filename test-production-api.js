const https = require('https');

// Lista endpoint-a za testiranje
const endpoints = [
  {
    name: 'Client API - Services',
    url: 'https://client-bdhw8u1na-crodex23-7051s-projects.vercel.app/api/services'
  },
  {
    name: 'Client API - Categories', 
    url: 'https://client-bdhw8u1na-crodex23-7051s-projects.vercel.app/api/categories'
  },
  {
    name: 'Client API - Appointments',
    url: 'https://client-bdhw8u1na-crodex23-7051s-projects.vercel.app/api/appointments'
  },
  {
    name: 'Backend Server - Categories (stari)',
    url: 'https://server-pzhdwguqm-crodex23-7051s-projects.vercel.app/api/categories'
  },
  {
    name: 'Backend Server - Services (stari)',
    url: 'https://server-pzhdwguqm-crodex23-7051s-projects.vercel.app/api/services'
  }
];

function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    console.log(`\n🔍 Testiram: ${endpoint.name}`);
    console.log(`   URL: ${endpoint.url}`);
    
    const startTime = Date.now();
    
    https.get(endpoint.url, (res) => {
      const duration = Date.now() - startTime;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`   ✅ Status: ${res.statusCode}`);
          console.log(`   ⏱️  Vrijeme: ${duration}ms`);
          console.log(`   📊 Rezultati: ${Array.isArray(json) ? json.length + ' stavki' : 'Objekt'}`);
          if (Array.isArray(json) && json.length > 0) {
            console.log(`   📋 Prvi element: ${JSON.stringify(json[0]).substring(0, 100)}...`);
          }
          resolve({ success: true, status: res.statusCode, data: json });
        } catch (e) {
          console.log(`   ⚠️  Response nije validan JSON`);
          console.log(`   📄 Data: ${data.substring(0, 200)}`);
          resolve({ success: false, error: 'Invalid JSON' });
        }
      });
    }).on('error', (err) => {
      const duration = Date.now() - startTime;
      console.log(`   ❌ Greška: ${err.message}`);
      console.log(`   ⏱️  Vrijeme: ${duration}ms`);
      resolve({ success: false, error: err.message });
    });
  });
}

async function runTests() {
  console.log('🚀 Testiram produkcijske endpointe na Vercelu...\n');
  console.log('='.repeat(80));
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ ...endpoint, ...result });
    await new Promise(resolve => setTimeout(resolve, 500)); // Pauza između requesta
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SAŽETAK REZULTATA:\n');
  
  results.forEach(r => {
    const icon = r.success ? '✅' : '❌';
    const status = r.success ? `Status ${r.status}` : r.error;
    console.log(`${icon} ${r.name}: ${status}`);
  });
  
  console.log('\n' + '='.repeat(80));
}

runTests();
