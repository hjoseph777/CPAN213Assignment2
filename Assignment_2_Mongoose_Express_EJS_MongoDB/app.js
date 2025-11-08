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
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://hjoseph777_mongodb_user:%24Lulu12345@cluster0.nizoxiv.mongodb.net/lab04?appName=Cluster0';

mongoose.set('strictQuery', true);

// cache the connection across invocations (important for serverless)
const cachedConnection = global.mongooseConnection || { conn: null, promise: null };
if (!global.mongooseConnection) {
  global.mongooseConnection = cachedConnection;
}

async function connectToDatabase() {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    }).then(mongooseInstance => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Connected to MongoDB Atlas - lab04 database');
      }
      return mongooseInstance;
    }).catch(err => {
      cachedConnection.promise = null; // allow future retries
      throw err;
    });
  }

  cachedConnection.conn = await cachedConnection.promise;
  return cachedConnection.conn;
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

// start the server (only for local development)
if (process.env.NODE_ENV !== 'production') {
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Course Management System running on http://localhost:${PORT}`);
        console.log(`Access your courses at http://localhost:${PORT}/courses`);
      });
    })
    .catch(err => {
      console.error('Failed to start server due to MongoDB connection error:', err);
      process.exit(1);
    });
}

// Export for Vercel
module.exports = app;
