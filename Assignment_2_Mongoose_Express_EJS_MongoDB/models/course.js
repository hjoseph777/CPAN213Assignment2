const mongoose = require('mongoose');

// Quick-and-dirty course schema for now; we can revisit when electives show up
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true, // keeps accidental spaces from sneaking in
    maxlength: [100, 'Course name cannot exceed 100 characters'],
    minlength: [2, 'Course name must be at least 2 characters']
  },
  courseCode: {
    type: String,
    required: [true, 'Course code is required'], 
    unique: true, // duplicate course codes were a nightmare last semester
    trim: true,
    uppercase: true, // auto converts to uppercase so we stay consistent
    match: [/^[A-Z]{3,4}\d{3}$/, 'Course code must follow format like CPAN212 or MATH101'],
    maxlength: [7, 'Course code cannot exceed 7 characters']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [0.5, 'Credits must be at least 0.5'],
    max: [6, 'Credits cannot exceed 6'], // most courses are 1-4 credits anyway
    validate: {
      validator: function(value) {
        return (value * 2) % 1 === 0; // TODO double-check if Business wants quarter credits
      },
      message: 'Credits must be in half-point increments (0.5, 1, 1.5, etc.)'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'] // seems reasonable
  },
  instructor: {
    type: String,
    trim: true,
    maxlength: [100, 'Instructor name cannot exceed 100 characters']
  },
  semester: {
    type: String,
    enum: ['Fall', 'Winter', 'Summer'], // might add Spring later
    default: 'Fall'
  },
  isActive: {
    type: Boolean,
    default: true // new courses should be active unless someone explicitly turns them off
  }
}, {
  timestamps: true, // mongoose adds createdAt and updatedAt fields
  collection: 'courses'
});
// basic indexes for performance - students search by these frequently
courseSchema.index({ courseCode: 1 });
courseSchema.index({ courseName: 1 });

// TODO: revisit indexing once reporting requirements are finalised

// useful virtual for display purposes
courseSchema.virtual('fullTitle').get(function() {
  return `${this.courseCode} - ${this.courseName}`;
});

// helper method for filtering by credit range (used in the mini dashboard prototype)
courseSchema.statics.findByCreditRange = function(minCredits, maxCredits) {
  return this.find({ 
    credits: { $gte: minCredits, $lte: maxCredits },
    isActive: true 
  });
};

// Instance method to format the credits nicely for display
courseSchema.methods.getFormattedCredits = function() {
  return this.credits === 1 ? '1 credit' : `${this.credits} credits`;
};

// make sure course codes are always uppercase  
courseSchema.pre('save', function(next) {
  if (this.courseCode) {
    this.courseCode = this.courseCode.toUpperCase();
  }
  next();
});

// console.log('Course model loaded'); // left here on purpose in case seeding acts up again

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
