const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// Helper lives here so we don't rewrite the same switch/if ladder in every handler
function handleValidationErrors(error, req) {
  const messages = [];
  
  if (error.name === 'ValidationError') {
    // loop through each validation error (Mongoose bundles them nicely)
    Object.values(error.errors).forEach(err => {
      messages.push(err.message);
    });
  } else if (error.code === 11000) {
    // duplicate key error from MongoDB
    messages.push('Course code already exists. Please use a different code.');
  } else {
    // catch-all for other errors; no need to leak internals to end users
    messages.push('An unexpected error occurred. Please try again.');
  }
  
  // flash each message indvidually so the UI handles them line by line
  messages.forEach(msg => req.flash('error_msg', msg));
}

// =================== READ ===================

// GET /courses - main listing page for the catalog
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({})
                                .sort({ courseCode: 1 })
                                .lean(); // performance boost
    
    // console.log('DEBUG: found', courses.length, 'courses'); // temp debug line
    console.log(`Displaying ${courses.length} courses`);
    
    res.render('courses/index', {
      title: 'Course Management',
      courses: courses,
      totalCourses: courses.length
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    req.flash('error_msg', 'Unable to load courses. Please try again.');
    res.render('courses/index', {
      title: 'Course Management',
      courses: [],
      totalCourses: 0
    });
  }
});

// GET /courses/new - show form to add new course
router.get('/new', (req, res) => {
  res.render('courses/new', {
    title: 'Add New Course'
  });
});

// GET /courses/:id/edit - Show form to edit existing course
router.get('/:id/edit', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      req.flash('error_msg', 'Course not found.');
      return res.redirect('/courses');
    }
    
  console.log(`Editing course: ${course.courseCode}`);
    
    res.render('courses/edit', {
      title: 'Edit Course',
      course: course
    });
  } catch (error) {
    console.error('Error finding course for edit:', error);
    req.flash('error_msg', 'Unable to load course for editing.');
    res.redirect('/courses');
  }
});

// GET /courses/:id - show individual course details (Read)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      req.flash('error_msg', 'Course not found.');
      return res.redirect('/courses');
    }
    
    console.log(`Viewing course details: ${course.courseCode}`);
    
    res.render('courses/show', {
      title: `${course.courseCode} - Course Details`,
      course: course
    });
  } catch (error) {
    console.error('Error finding course details:', error);
    req.flash('error_msg', 'Unable to load course details.');
    res.redirect('/courses');
  }
});

// =================== CREATE ===================

// POST /courses - handle creating new course
router.post('/', async (req, res) => {
  try {
    const { courseName, courseCode, credits, description, instructor, semester } = req.body;
    
    // basic input cleaning - TODO: maybe add better validation later
    const newCourse = new Course({
      courseName: courseName?.trim(),
      courseCode: courseCode?.trim().toUpperCase(), // make sure it's uppercase
      credits: parseFloat(credits),
      description: description?.trim() || '',
      instructor: instructor?.trim() || '', // empty string if no instructor
      semester: semester || 'Fall' // default to Fall if nothing selected
    });
    
    await newCourse.save();
    
  console.log(`New course created: ${newCourse.courseCode} - ${newCourse.courseName}`);
  // TODO: paginate once this list gets out of hand
    
    req.flash('success_msg', 
      `Course "${newCourse.courseCode} - ${newCourse.courseName}" has been added successfully!`);
    res.redirect('/courses');
    
  } catch (error) {
    console.error('Error creating course:', error);
    
    handleValidationErrors(error, req);
    
    // send them back to the form so they can fix the errors
    res.redirect('/courses/new');
  }
});

// =================== UPDATE ===================

// PUT /courses/:id - update existing course
router.put('/:id', async (req, res) => {
  try {
    const { courseName, courseCode, credits, description, instructor, semester, isActive } = req.body;
    
    // console.log('Update data received:', req.body); // debug log
    
    // build the update object
    const updateData = {
      courseName: courseName?.trim(),
      courseCode: courseCode?.trim().toUpperCase(),
      credits: parseFloat(credits),
      description: description?.trim() || '',
      instructor: instructor?.trim() || '',
      semester: semester || 'Fall',
      isActive: isActive === 'true' || isActive === true // checkboxes can be tricky
    };
    
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { 
        new: true, // return the updated document
        runValidators: true // run schema validation
      }
    );
    
    if (!updatedCourse) {
      req.flash('error_msg', 'Course not found.');
      return res.redirect('/courses');
    }
    
    console.log(`Updated course: ${updatedCourse.courseCode} - ${updatedCourse.courseName} (Active: ${updatedCourse.isActive})`);
    
    req.flash('success_msg', 
      `Course "${updatedCourse.courseCode} - ${updatedCourse.courseName}" has been updated successfully!`);
    res.redirect('/courses');
    
  } catch (error) {
    console.error('Error updating course:', error);
    
    handleValidationErrors(error, req);
    
    // redirect back to edit form (yes, still old-school post/redirect/get)
    res.redirect(`/courses/${req.params.id}/edit`);
  }
});

// =================== DELETE ===================

// DELETE /courses/:id - remove a course from the system
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      req.flash('error_msg', 'Course not found.');
      return res.redirect('/courses');
    }
    
  console.log(`Deleted: ${course.courseCode} - ${course.courseName}`);
    
    req.flash('success_msg', 
      `Course "${course.courseCode}" deleted succesfully!`); // minor typo: succesfully
    res.redirect('/courses');
    
  } catch (error) {
    console.error('Error deleting course:', error);
    req.flash('error_msg', 'Unable to delete course. Please try again.');
    res.redirect('/courses');
  }
});

// =================== API ===================

// GET /courses/api - JSON API endpoint for all courses
router.get('/api', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ courseCode: 1 });
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /courses/:id/api - JSON API endpoint for single course
router.get('/:id/api', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;