## Course Management System – CRUD Application

## Project Metadata
- Created: 2025-11-07
- Platform: Node.js + Express + MongoDB Atlas
- Package Manager: npm
- Database: MongoDB (Mongoose ODM)
- View Engine: EJS
- Minimum Node version: 16.x

## Overview
A full-stack CRUD web application for managing academic courses. Built with Express.js, Mongoose, and EJS templating, it demonstrates Create, Read, Update, and Delete operations with server-side validation, flash messaging, and a conservative academic UI theme.

## Important: Where your CRUD logic lives
- Main application entry point is [`app.js`](app.js) with middleware and database connection
- Course schema with validation is in [`models/course.js`](models/course.js)
- All CRUD routes are in [`routes/courses.js`](routes/courses.js)
- EJS views are in [`views/courses/`](views/courses/) (index, new, edit, show)

## Project Explorer
An interactive, collapsible view of the codebase. Click file names to open them.

<details open>
   <summary><strong>app.js – Application Entry Point</strong></summary>

   - 📄 [`app.js`](app.js) – Express server setup with middleware, session, flash messages, and MongoDB connection
</details>

<details>
   <summary><strong>models/ – Database Schemas</strong></summary>

   - 📁 <strong>models</strong>
      - 📄 [`course.js`](models/course.js) – **Course schema with validation, indexes, and helper methods**
      - 📄 [`item.js`](models/item.js) – Legacy item model (unused)
</details>

<details>
   <summary><strong>routes/ – Request Handlers</strong></summary>

   - 📁 <strong>routes</strong>
      - 🚦 [`courses.js`](routes/courses.js) – **All CRUD routes + JSON API endpoints**
</details>

<details>
   <summary><strong>views/ – EJS Templates</strong></summary>

   - 📁 <strong>views</strong>
      - 📄 [`index.ejs`](views/index.ejs) – Home page
      - 📄 [`error.ejs`](views/error.ejs) – Error page
      - 📁 <strong>courses</strong>
         - 🏠 [`index.ejs`](views/courses/index.ejs) – **Course listing page**
         - ➕ [`new.ejs`](views/courses/new.ejs) – **Create course form**
         - ✏️ [`edit.ejs`](views/courses/edit.ejs) – **Edit course form**
         - 📖 [`show.ejs`](views/courses/show.ejs) – **Course details view**
      - 📁 <strong>partials</strong>
         - 🧩 [`header.ejs`](views/partials/header.ejs) – Header with navigation
         - 🦶 [`footer.ejs`](views/partials/footer.ejs) – Footer section
</details>

<details>
   <summary><strong>public/ – Static Assets</strong></summary>

   - 📁 <strong>public</strong>
      - 📁 css
         - 🎨 [`styles.css`](public/css/styles.css) – **Academic theme styles**
</details>

<details>
   <summary><strong>scripts/ – Database Utilities</strong></summary>

   - 📁 <strong>scripts</strong>
      - 🛠️ [`addCourses.js`](scripts/addCourses.js) – Seed script to populate sample STEM courses
</details>

<details>
   <summary><strong>Config & Meta</strong></summary>

   - ⚙️ [`.env`](.env) – Environment variables (MongoDB URI, session secret)
   - 📦 [`package.json`](package.json) – Dependencies & scripts
   - 🔒 [`.gitignore`](.gitignore) – Files excluded from version control
   - 📝 [`README.md`](README.md) – Documentation (this file)
</details>

## 📥 Quick Download

**Get the complete project instantly:**

[![Download CPAN213Assignment2](https://img.shields.io/badge/Download-CPAN213Assignment2.zip-blue?style=for-the-badge&logo=download)](https://github.com/hjoseph777/CPAN213Assignment2/releases/download/v1/CPAN213Assignment2.zip)

*Complete Course Management CRUD application ready to run*

## 🌐 Live Demo

**Try the application online:**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://your-demo-url.vercel.app)

*Experience the Course Management System in action*

## File Structure

```text
Assignment_2_Mongoose_Express_EJS_MongoDB
├── 📄 app.js                        # Express server + middleware setup
├── 📁 models/                       # Mongoose schemas
│   ├── 📄 course.js                 # Course model with validation
│   └── 📄 item.js                   # Legacy item model
├── 📁 routes/                       # Route handlers
│   └── 🚦 courses.js                # CRUD routes + API endpoints
├── 📁 views/                        # EJS templates
│   ├── 📄 index.ejs                 # Home page
│   ├── 📄 error.ejs                 # Error page
│   ├── 📁 courses/
│   │   ├── 🏠 index.ejs             # Course listing
│   │   ├── ➕ new.ejs               # Create form
│   │   ├── ✏️ edit.ejs              # Edit form
│   │   └── 📖 show.ejs              # Details view
│   └── 📁 partials/
│       ├── 🧩 header.ejs            # Header partial
│       └── 🦶 footer.ejs            # Footer partial
├── 📁 public/
│   └── 📁 css/
│       └── 🎨 styles.css            # Academic theme CSS
├── 📁 scripts/
│   └── 🛠️ addCourses.js            # Database seeding script
├── ⚙️ .env                          # Environment variables
├── 📦 package.json                  # Dependencies & scripts
├── 🔒 .gitignore                    # Git ignore rules
└── 📝 README.md                     # Documentation
```

### Quick Code Reference
| Icon | Type | Path | Purpose |
|------|------|------|---------|
| 📄 | Entry | [`app.js`](app.js) | Express server setup with MongoDB connection |
| 📄 | Model | [`models/course.js`](models/course.js) | **Course schema with validation & helpers** |
| 🚦 | Routes | [`routes/courses.js`](routes/courses.js) | **CRUD handlers + API endpoints** |
| 🏠 | View | [`views/courses/index.ejs`](views/courses/index.ejs) | Course listing page |
| ➕ | View | [`views/courses/new.ejs`](views/courses/new.ejs) | Create course form |
| ✏️ | View | [`views/courses/edit.ejs`](views/courses/edit.ejs) | Edit course form |
| 📖 | View | [`views/courses/show.ejs`](views/courses/show.ejs) | Course details view |
| 🧩 | Partial | [`views/partials/header.ejs`](views/partials/header.ejs) | Header navigation |
| 🦶 | Partial | [`views/partials/footer.ejs`](views/partials/footer.ejs) | Footer section |
| 🎨 | CSS | [`public/css/styles.css`](public/css/styles.css) | Academic theme styles |
| 🛠️ | Script | [`scripts/addCourses.js`](scripts/addCourses.js) | Seed sample courses |
| ⚙️ | Config | [`.env`](.env) | MongoDB URI & session secret |
| 📦 | Config | [`package.json`](package.json) | Dependencies & npm scripts |
| 🔒 | Config | [`.gitignore`](.gitignore) | Git ignore rules |



## Features

- **Create**: Add new courses with validation (course code format, credit ranges)
- **Read**: View all courses or individual course details
- **Update**: Edit existing course information with active/inactive toggle
- **Delete**: Remove courses from the database
- **JSON API**: Export courses as JSON (`/courses/api`)
- **Flash Messages**: User-friendly success/error notifications
- **Validation**: Server-side schema validation with custom error messages
- **Responsive Design**: Academic-themed UI with responsive layout

---

*This project demonstrates full-stack CRUD operations with Express, MongoDB, and EJS templating.*