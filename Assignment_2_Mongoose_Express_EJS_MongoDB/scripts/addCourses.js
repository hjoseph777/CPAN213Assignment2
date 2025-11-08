// Add Sample STEM Courses Script
const mongoose = require('mongoose');
require('dotenv').config();

// Import Course model
const Course = require('../models/course');

// MongoDB connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://hjoseph777_mongodb_user:%24Lulu12345@cluster0.nizoxjv.mongodb.net/lab04?appName=Cluster0';

// Sample STEM courses data with complete information
const stemCourses = [
  {
    courseCode: 'CPAN212',
    courseName: 'Web Programming with JavaScript',
    credits: 3,
    description: 'Comprehensive course covering modern web development using JavaScript, HTML5, CSS3, and popular frameworks like React and Node.js. Students will build interactive web applications and learn industry best practices for front-end and back-end development.',
    semester: 'Fall',
    isActive: true,
    createdAt: new Date('2024-09-01')
  },
  {
    courseCode: 'MATH201',
    courseName: 'Calculus for Computer Science',
    credits: 4,
    description: 'Advanced mathematics course focusing on differential and integral calculus with specific applications in computer science and engineering. Topics include limits, derivatives, optimization, and numerical methods essential for algorithm analysis.',
    semester: 'Fall',
    isActive: true,
    createdAt: new Date('2024-08-15')
  },
  {
    courseCode: 'PHYS141',
    courseName: 'Physics for Engineers I',
    credits: 3.5,
    description: 'Fundamental physics principles for engineering students covering mechanics, waves, thermodynamics, and energy systems. Laboratory work includes hands-on experiments and data analysis using modern instrumentation.',
    semester: 'Winter',
    isActive: true,
    createdAt: new Date('2024-01-10')
  },
  {
    courseCode: 'CHEM105',
    courseName: 'General Chemistry',
    credits: 3,
    description: 'Introduction to chemical principles including atomic structure, chemical bonding, stoichiometry, and reaction mechanisms. Laboratory sessions focus on experimental techniques and safety protocols in chemical analysis.',
    semester: 'Fall',
    isActive: true,
    createdAt: new Date('2024-08-20')
  },
  {
    courseCode: 'CPAN213',
    courseName: 'Database Systems and MongoDB',
    credits: 3,
    description: 'Comprehensive study of database design and implementation with emphasis on NoSQL databases and MongoDB. Students learn data modeling, query optimization, database administration, and integration with web applications.',
    semester: 'Winter',
    isActive: true,
    createdAt: new Date('2024-01-05')
  },
  {
    courseCode: 'MATH301',
    courseName: 'Linear Algebra and Statistics',
    credits: 3.5,
    description: 'Advanced mathematical concepts including matrix operations, vector spaces, eigenvalues, and statistical analysis for data science applications. Practical applications in machine learning and data analytics are emphasized.',
    semester: 'Summer',
    isActive: true,
    createdAt: new Date('2024-05-01')
  },
  {
    courseCode: 'BIOL120',
    courseName: 'Introduction to Biotechnology',
    credits: 2.5,
    description: 'Foundational course in biotechnology covering genetic engineering, molecular biology techniques, and bioethics. Students explore applications in medicine, agriculture, and environmental science through case studies and laboratory work.',
    semester: 'Summer',
    isActive: true,
    createdAt: new Date('2024-05-15')
  },
  {
    courseCode: 'ENGR150',
    courseName: 'Engineering Design and Analysis',
    credits: 4,
    description: 'Introduction to engineering problem-solving methodologies, design thinking, and project management. Students work on real-world engineering challenges using CAD software, prototyping, and systematic design processes.',
    semester: 'Winter',
    isActive: true,
    createdAt: new Date('2024-01-20')
  },
  {
    courseCode: 'STAT200',
    courseName: 'Applied Statistics for STEM',
    credits: 3,
    description: 'Statistical methods and data analysis techniques specifically designed for science and engineering applications. Topics include hypothesis testing, regression analysis, experimental design, and statistical software usage.',
    semester: 'Fall',
    isActive: true,
    createdAt: new Date('2024-09-10')
  },
  {
    courseCode: 'CYBR301',
    courseName: 'Cybersecurity Fundamentals',
    credits: 3.5,
    description: 'Comprehensive introduction to cybersecurity principles including network security, encryption algorithms, threat assessment, and incident response. Students learn ethical hacking techniques and security policy development.',
    semester: 'Summer',
    isActive: false,
    createdAt: new Date('2024-04-20')
  }
];

// Random instructor names
const instructorNames = [
  'Dr. Sarah Johnson',
  'Prof. Michael Chen',
  'Dr. Emily Rodriguez',
  'Prof. David Kim',
  'Dr. Jennifer Smith',
  'Prof. Robert Wilson',
  'Dr. Lisa Thompson',
  'Prof. James Anderson',
  'Dr. Maria Garcia',
  'Prof. Thomas Brown',
  'Dr. Ashley Davis',
  'Prof. Kevin Lee',
  'Dr. Rachel White',
  'Prof. Daniel Martinez',
  'Dr. Amanda Clark'
];

// Function to get random instructor
function getRandomInstructor() {
  return instructorNames[Math.floor(Math.random() * instructorNames.length)];
}

// Function to add courses to database
async function addSampleCourses() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas - lab04 database');

    // Clear existing courses (optional - comment out if you want to keep existing)
    console.log('🧹 Clearing existing courses...');
    await Course.deleteMany({});
    console.log('✅ Cleared existing courses');

    // Add courses with random instructors
    console.log('📚 Adding STEM courses...');
    const coursesToAdd = stemCourses.map(course => ({
      ...course,
      instructor: getRandomInstructor()
    }));

    // Insert courses
    const addedCourses = await Course.insertMany(coursesToAdd);
    
    console.log('🎉 Successfully added courses:');
    console.log('=====================================');
    
    addedCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.courseCode} - ${course.courseName}`);
      console.log(`   Instructor: ${course.instructor}`);
      console.log(`   Credits: ${course.credits} | Semester: ${course.semester}`);
      console.log(`   Status: ${course.isActive ? 'Active' : 'Inactive'}`);
      console.log(`   Created: ${course.createdAt.toLocaleDateString()}`);
      console.log(`   Description: ${course.description.substring(0, 80)}...`);
      console.log('   ---');
    });
    
    console.log('=====================================');
    console.log(`✅ Total courses added: ${addedCourses.length}`);
    console.log('🌐 Visit http://localhost:3000/courses to view them');
    
  } catch (error) {
    console.error('❌ Error adding courses:', error);
    
    if (error.name === 'ValidationError') {
      console.error('📝 Validation errors:');
      Object.values(error.errors).forEach(err => {
        console.error(`   - ${err.message}`);
      });
    }
    
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
console.log('🚀 Starting STEM Course Addition Script...');
console.log('📖 This will add 10 sample STEM courses to your database');
addSampleCourses();