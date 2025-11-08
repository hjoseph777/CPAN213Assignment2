const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // changed to uppercase - personal preference

// MongoDB Atlas connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://hjoseph777_mongodb_user:%24Lulu12345@cluster0.nizoxjv.mongodb.net/lab04?appName=Cluster0';

// connect to MongoDB Atlas
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 30000, // Increase timeout for serverless
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas - lab04 database');
    // console.log('Course Management System ready!'); // can uncomment if needed
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Don't exit in serverless environment - let it retry
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1); // only exit in development
    }
  });

// Set explicit paths for serverless environment
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware setup
app.use(express.static(path.join(__dirname, 'public'))); // This serves our CSS, images, and other static files
app.use(express.urlencoded({ extended: true })); // Parses form data from our EJS forms
app.use(express.json()); // Handles JSON data (useful for API endpoints)

app.use(session({
  secret: process.env.SESSION_SECRET || 'coursemanagement_secret_key_2024', // TODO: move to .env
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 * 60 }
}));

app.use(flash());
app.use(methodOverride('_method')); 

// global vars for templates
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

const courseRoutes = require('./routes/courses');

app.use('/courses', courseRoutes);

// home route - just redirect to courses page
app.get('/', (req, res) => {
  res.redirect('/courses');
});

// catch-all 404 handler
app.use('*', (req, res) => {
  res.status(404).render('error', { 
    title: 'Page Not Found',
    message: 'Sorry, the page you\'re looking for doesn\'t exist.',
    error: { status: 404, stack: '' }
  });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error('Application Error:', err); // removed emoji
  
  const status = err.status || 500;
  const msg = err.message || 'Something went wrong!';
  
  if (err.name === 'ValidationError') {
    req.flash('error_msg', 'Please check your input and try again.');
    return res.redirect('back');
  }
  
  res.status(status).render('error', {
    title: 'Application Error',
    message: msg,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// start the server (only for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Course Management System running on http://localhost:${PORT}`);
    console.log(`Access your courses at http://localhost:${PORT}/courses`);
  });
}

// Export for Vercel
module.exports = app;
