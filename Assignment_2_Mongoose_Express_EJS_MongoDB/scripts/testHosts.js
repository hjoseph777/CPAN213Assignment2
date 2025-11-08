#!/usr/bin/env node

/**
 * MongoDB Connection Test with Alternative Formats
 */

const mongoose = require('mongoose');

console.log('🧪 Testing different MongoDB connection formats...');
console.log('');

// Test different possible hostnames
const possibleHosts = [
  'cluster0.nizoxiv.mongodb.net',
  'cluster0.mongodbnet', 
  'cluster0.mongodb.net',
  // Add more variations if needed
];

async function testHost(hostname) {
  const testURI = `mongodb+srv://hjoseph777_mongodb_user:%24Lulu12345@${hostname}/lab04?retryWrites=true&w=majority`;
  
  try {
    console.log(`⏳ Testing: ${hostname}`);
    await mongoose.connect(testURI, {
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log(`✅ SUCCESS: ${hostname} - Connection established!`);
    await mongoose.disconnect();
    return true;
    
  } catch (error) {
    console.log(`❌ FAILED: ${hostname} - ${error.message}`);
    await mongoose.disconnect();
    return false;
  }
}

async function runTests() {
  console.log('Testing different hostname variations...');
  console.log('');
  
  for (const host of possibleHosts) {
    const success = await testHost(host);
    if (success) {
      console.log('');
      console.log('🎉 Found working hostname!');
      console.log(`✅ Use this hostname: ${host}`);
      process.exit(0);
    }
    console.log('');
  }
  
  console.log('❌ None of the test hostnames worked.');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Go to MongoDB Atlas Dashboard');
  console.log('2. Click "Connect" on your cluster'); 
  console.log('3. Choose "Drivers"');
  console.log('4. Copy the correct connection string');
  
  process.exit(1);
}

runTests();