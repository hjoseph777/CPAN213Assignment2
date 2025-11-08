#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * Tests direct connection to MongoDB Atlas
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Atlas connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://hjoseph777_mongodb_user:%24Lulu12345@cluster0.nizoxiv.mongodb.net/lab04?appName=Cluster0';

console.log('🔍 Testing MongoDB Atlas Connection...');
console.log('📍 Cluster: cluster0.nizoxiv.mongodb.net');
console.log('📂 Database: lab04');
console.log('👤 User: hjoseph777_mongodb_user');
console.log('');

async function testConnection() {
  try {
    console.log('⏳ Attempting to connect to MongoDB Atlas...');
    
    const connection = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
    });

    console.log('✅ MongoDB connection successful!');
    console.log(`📊 Connection state: ${mongoose.connection.readyState}`);
    console.log(`🏠 Connected to database: ${mongoose.connection.db.databaseName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // Test database operations
    console.log('');
    console.log('🧪 Testing database operations...');
    
    // Check if courses collection exists and count documents
    const Course = require('../models/item');
    const courseCount = await Course.countDocuments();
    console.log(`📚 Found ${courseCount} courses in the database`);
    
    // List first 3 courses
    if (courseCount > 0) {
      console.log('');
      console.log('📋 Sample courses:');
      const sampleCourses = await Course.find().limit(3).select('name code -_id');
      sampleCourses.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.code} - ${course.name}`);
      });
    }
    
    console.log('');
    console.log('🎉 All tests passed! MongoDB connection is working perfectly.');
    
  } catch (error) {
    console.log('');
    console.error('❌ MongoDB connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('');
      console.log('🔧 Troubleshooting suggestions:');
      console.log('   1. Check if the cluster hostname is correct');
      console.log('   2. Verify internet connectivity');
      console.log('   3. Check MongoDB Atlas cluster status');
    } else if (error.message.includes('authentication')) {
      console.log('');
      console.log('🔧 Troubleshooting suggestions:');
      console.log('   1. Verify username and password');
      console.log('   2. Check if user has proper database permissions');
      console.log('   3. Ensure IP address is whitelisted in Atlas');
    }
    
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the test
testConnection();