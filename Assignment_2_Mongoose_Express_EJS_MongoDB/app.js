const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // changed to uppercase - personal preference

// MongoDB Atlas connection string
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://hjoseph777_mongodb_user:%24Lulu12345@cluster0.nizoxjv.mongodb.net/lab04?appName=Cluster0';

mongoose.set('strictQuery', true);

let connectPromise = null;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectPromise) {
    connectPromise = mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2,  // Maintain a minimum of 2 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    }).then((mongooseInstance) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Connected to MongoDB Atlas - lab04 database');
      }
      return mongooseInstance.connection;
    }).catch(err => {
      connectPromise = null; // allow retry on next request
      throw err;
    });
  }

  return connectPromise;
}

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

// ensure database connection is ready before handling routes
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    next(err);
  }
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

// start the server (only for local development or production)
const isVercel = Boolean(process.env.VERCEL);

if (!isVercel) {
  // Start server first, then attempt database connection
  const server = app.listen(PORT, () => {
    console.log(`Course Management System running on http://localhost:${PORT}`);
    console.log(`Access your courses at http://localhost:${PORT}/courses`);
    console.log('Server started successfully. Attempting MongoDB connection...');
  });

  // Attempt database connection with retry logic
  async function connectWithRetry() {
    try {
      await connectToDatabase();
      console.log('MongoDB connection established successfully!');
    } catch (err) {
      console.error('MongoDB connection failed:', err.message);
      console.log('Server will continue running. Retrying MongoDB connection in 10 seconds...');
      
      // Retry connection after 10 seconds
      setTimeout(connectWithRetry, 10000);
    }
  }

  // Start connection attempt
  connectWithRetry();
}

// Export for Vercel
module.exports = app;
