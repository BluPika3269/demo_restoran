const https = require('https');

const BASE_URL = 'https://client-85pzprp4g-crodex23-7051s-projects.vercel.app';

const endpoints = [
  '/api/services',
  '/api/categories',
  '/api/appointments'
];

function testEndpoint(path) {
  return new Promise((resolve) => {
    const url = BASE_URL + path;
    console.log(`\n🔍 Testing: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`   ✅ Status: ${res.statusCode}`);
          console.log(`   📊 Results: ${Array.isArray(json) ? json.length + ' items' : 'Object'}`);
          if (Array.isArray(json) && json.length > 0) {
            console.log(`   📋 First item: ${JSON.stringify(json[0]).substring(0, 100)}...`);
          }
          resolve(true);
        } catch (e) {
          console.log(`   ⚠️  Response: ${data.substring(0, 200)}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`   ❌ Error: ${err.message}`);
      resolve(false);
    });
  });
}

async function runTests() {
  console.log('🚀 Testing Production Deployment\n');
  console.log('='.repeat(80));
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Tests complete!');
}

runTests();
