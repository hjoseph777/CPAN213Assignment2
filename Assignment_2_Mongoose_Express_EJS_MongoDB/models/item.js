const mongoose = require('mongoose');

// Course schema for the course management system
// This follows the requirements: courseName, courseCode, credits
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [100, 'Course name cannot exceed 100 characters'],
    minlength: [2, 'Course name must be at least 2 characters']
  },
  courseCode: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true, // Prevent duplicate course codes - makes sense for academic courses!
    trim: true,
    uppercase: true, // Always store course codes in uppercase (e.g., "cpan212" -> "CPAN212")
    match: [/^[A-Z]{3,4}\d{3}$/, 'Course code must follow format like CPAN212 or MATH101'],
    maxlength: [7, 'Course code cannot exceed 7 characters']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [0.5, 'Credits must be at least 0.5'],
    max: [6, 'Credits cannot exceed 6'], // Reasonable range for academic credits
    validate: {
      validator: function(value) {
        // Credits should be in increments of 0.5 (0.5, 1, 1.5, 2, etc.)
        return (value * 2) % 1 === 0;
      },
      message: 'Credits must be in increments of 0.5 (e.g., 1, 1.5, 2, 3, etc.)'
    }
  },
  // Additional helpful fields that make sense for course management
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  instructor: {
    type: String,
    trim: true,
    maxlength: [100, 'Instructor name cannot exceed 100 characters']
  },
  semester: {
    type: String,
    enum: ['Fall', 'Winter', 'Summer'],
    default: 'Fall'
  },
  isActive: {
    type: Boolean,
    default: true // Whether the course is currently offered
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'courses' // Explicitly set collection name in Lab04 database
});

// Index for better query performance - students will often search by code or name
courseSchema.index({ courseCode: 1 });
courseSchema.index({ courseName: 1 });

// Virtual for display purposes - combines code and name nicely
courseSchema.virtual('fullTitle').get(function() {
  return `${this.courseCode} - ${this.courseName}`;
});

// Static method to find courses by credit range
courseSchema.statics.findByCreditRange = function(minCredits, maxCredits) {
  return this.find({ 
    credits: { $gte: minCredits, $lte: maxCredits },
    isActive: true 
  });
};

// Instance method to format credits nicely
courseSchema.methods.getFormattedCredits = function() {
  return this.credits === 1 ? '1 credit' : `${this.credits} credits`;
};

// Pre-save middleware to ensure courseCode is always uppercase
courseSchema.pre('save', function(next) {
  if (this.courseCode) {
    this.courseCode = this.courseCode.toUpperCase();
  }
  next();
});

// Create and export the Course model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
