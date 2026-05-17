# Learning Management System Client

React frontend for a Canvas-inspired learning management platform supporting courses, assignments, modules, quizzes, grades, enrollments, announcements, users, and student/instructor workflows.

This repository contains the client-side application for a full-stack learning management system. The frontend is built with React, TypeScript, Redux Toolkit, React Router, Axios, Bootstrap, and Recharts. It connects to a separate Node.js/Express/MongoDB backend through REST API endpoints.

## Demo Video

If the live deployment is unavailable, you can watch a walkthrough of the project here:

[![Learning Management System Demo](https://img.youtube.com/vi/ea7ssjl5ycw/maxresdefault.jpg)](https://youtu.be/ea7ssjl5ycw?si=FTBWUDT8eywhppyB)

[Watch on YouTube](https://youtu.be/ea7ssjl5ycw?si=FTBWUDT8eywhppyB)


## Live Demo

You can open the deployed app here:

[Open the Learning Management System](https://learning-management-system-rayan.netlify.app/)

The app may take a few moments to load. If you are not sure how to navigate the platform, use the demo video below for a quick walkthrough.

## Overview

This project is a full-featured learning management system frontend inspired by platforms like Canvas. It provides students, instructors, and administrators with interfaces for managing courses, course content, assignments, quizzes, grades, enrollments, users, announcements, and uploaded files.

The application is structured around a course dashboard experience. Users can sign in, view their courses, navigate through course sections, manage modules and lessons, submit assignments, take quizzes, view grades, and interact with role-specific content depending on their account permissions.

This is the client repository. The backend API is maintained separately in the server repository.

## Key Features

- React and TypeScript frontend
- Client-side routing with React Router
- Global state management with Redux Toolkit
- User authentication and session handling
- Protected routes for authenticated users
- Role-based access for students, instructors, and admins
- Course dashboard with course cards and enrollment views
- Course-specific navigation
- Modules and lesson management
- Assignment creation, editing, submission, and grading workflows
- Quiz creation, editing, previewing, taking, and results tracking
- Grade viewing for students and instructors
- Course announcements
- People/users view for course participants
- File upload/download support through backend API integration
- Analytics view using Recharts
- Bootstrap-based responsive UI
- REST API communication using Axios

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- React Redux
- React Router / React Router DOM
- Axios
- Bootstrap
- React Icons
- Recharts
- React Simple WYSIWYG
- Create React App

## System Role

This repository represents the frontend layer of the full-stack learning management system.

```text
User Browser
    ↓
React / TypeScript Client
    ↓
Axios REST API Calls
    ↓
Node.js / Express Backend
    ↓
MongoDB Database
```

The client is responsible for rendering the user interface, managing frontend state, handling navigation, and communicating with the backend API.

## Project Structure

```text
learning-management-system-client/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   ├── index.css
│   │
│   └── Kanbas/
│       ├── index.tsx
│       ├── Navigation.tsx
│       ├── store.ts
│       ├── styles.css
│       │
│       ├── Account/
│       │   ├── index.tsx
│       │   ├── Navigation.tsx
│       │   ├── Signin.tsx
│       │   ├── Signup.tsx
│       │   ├── Profile.tsx
│       │   ├── Session.tsx
│       │   ├── Users.tsx
│       │   ├── ProtectedRoute.tsx
│       │   ├── ProtectedContent.tsx
│       │   ├── ProtectedContentAdmin.tsx
│       │   ├── ProtectedContentEnrollment.tsx
│       │   ├── client.ts
│       │   ├── reducer.ts
│       │   └── usersReducer.ts
│       │
│       └── Dashboard/
│           ├── index.tsx
│           │
│           ├── Enrollment/
│           │   ├── EnrollmentView.tsx
│           │   ├── client.ts
│           │   └── reducer.ts
│           │
│           └── Courses/
│               ├── index.tsx
│               ├── Navigation.tsx
│               ├── client.ts
│               ├── reducer.ts
│               ├── filesClient.ts
│               ├── filesReducer.ts
│               │
│               ├── Home/
│               │   ├── index.tsx
│               │   └── Status.tsx
│               │
│               ├── Modules/
│               │   ├── index.tsx
│               │   ├── client.ts
│               │   ├── reducer.ts
│               │   ├── lessonsReducer.ts
│               │   ├── ModuleEditor.tsx
│               │   ├── ModuleControlButtons.tsx
│               │   ├── ModulesControls.tsx
│               │   ├── LessonAddDialog.tsx
│               │   ├── LessonControlButtons.tsx
│               │   └── GreenCheckmark.tsx
│               │
│               ├── Assignments/
│               │   ├── index.tsx
│               │   ├── Editor.tsx
│               │   ├── TakeAssignment.tsx
│               │   ├── AssignmentRemove.tsx
│               │   ├── AssignmentsControlButtons.tsx
│               │   ├── client.ts
│               │   ├── reducer.ts
│               │   ├── assignmentsResultsClient.ts
│               │   ├── assignmentResultsReducer.ts
│               │   ├── studentFileClient.ts
│               │   └── studentFileReducer.ts
│               │
│               ├── Quizzes/
│               │   ├── index.tsx
│               │   ├── View.tsx
│               │   ├── QuizDetails.tsx
│               │   ├── QuizEditor.tsx
│               │   ├── QuizEditorDetails.tsx
│               │   ├── QuizEditorQuestions.tsx
│               │   ├── QuizPreview.tsx
│               │   ├── QuizPreviewResults.tsx
│               │   ├── TakeQuiz.tsx
│               │   ├── QuizResults.tsx
│               │   ├── QuizRemove.tsx
│               │   ├── StudentViewButton.tsx
│               │   ├── EditorNavigation.tsx
│               │   ├── client.ts
│               │   ├── questionsClient.ts
│               │   ├── questionsReducer.ts
│               │   ├── quizzesReducer.ts
│               │   ├── resultsClient.ts
│               │   └── resultsReducer.ts
│               │
│               ├── Grades/
│               │   ├── index.tsx
│               │   ├── GradeStudent.tsx
│               │   └── studentQuizResults.tsx
│               │
│               ├── People/
│               │   ├── index.tsx
│               │   ├── Details.tsx
│               │   └── client.ts
│               │
│               ├── Announcements/
│               │   ├── index.tsx
│               │   ├── editor.tsx
│               │   ├── client.ts
│               │   └── reducer.ts
│               │
│               └── Analytics/
│                   └── index.tsx
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
└── .gitignore
```

## Main Components

- `src/App.tsx` sets up the main application router and redirects users into the Kanbas application.
- `src/Kanbas/index.tsx` contains the main Kanbas application layout.
- `src/Kanbas/Navigation.tsx` contains the global application navigation.
- `src/Kanbas/store.ts` configures the Redux store and combines reducers for modules, courses, assignments, quizzes, users, enrollments, files, announcements, and results.
- `src/Kanbas/Account/` contains authentication, signup, signin, profile, session, protected route, and user-management logic.
- `src/Kanbas/Dashboard/` contains the main dashboard and enrollment views.
- `src/Kanbas/Dashboard/Courses/` contains course-specific pages and API clients.
- `src/Kanbas/Dashboard/Courses/Modules/` contains module and lesson management.
- `src/Kanbas/Dashboard/Courses/Assignments/` contains assignment creation, editing, submission, file upload, and results workflows.
- `src/Kanbas/Dashboard/Courses/Quizzes/` contains quiz creation, editing, preview, taking, grading, and results workflows.
- `src/Kanbas/Dashboard/Courses/Grades/` contains student and instructor grade views.
- `src/Kanbas/Dashboard/Courses/People/` contains course participant views.
- `src/Kanbas/Dashboard/Courses/Announcements/` contains course announcement features.
- `src/Kanbas/Dashboard/Courses/Analytics/` contains course analytics visualization.
- `client.ts` files contain Axios-based API functions for communicating with the backend.
- `reducer.ts` files contain Redux slices/reducers for managing frontend state.

## Frontend Architecture

The application follows a feature-based structure. Each major learning-management feature has its own folder containing UI components, API client functions, and Redux state logic where needed.

```text
Feature Folder
    ├── UI Components
    ├── API Client
    └── Redux State
```

This keeps related frontend logic grouped together instead of spreading course, assignment, quiz, and user functionality across unrelated folders.

## Routing

The app uses `HashRouter` and routes all main application views through the `/Kanbas` path.

```text
/               → redirects to /Kanbas
/Kanbas/*       → main learning management system
```

Inside the Kanbas application, users can navigate through dashboard pages, course pages, assignments, quizzes, modules, grades, people, announcements, and account views.

## State Management

Redux Toolkit is used to manage global application state. The Redux store includes reducers for:

- Account/session state
- Users
- Courses
- Enrollments
- Modules
- Lessons
- Assignments
- Assignment results
- Student files
- Quizzes
- Quiz questions
- Quiz results
- Course files
- Announcements

This allows the app to maintain complex state across many learning-management workflows without relying only on local component state.

## Backend API Integration

The frontend communicates with a separate backend server using Axios.

The backend base URL is configured through the following environment variable:

```env
REACT_APP_REMOTE_SERVER=http://localhost:4000
```

API requests are organized by feature. For example:

- Account API client handles users, signin, signup, profile, and signout.
- Courses API client handles courses, modules, assignments, quizzes, and announcements.
- Assignments API clients handle assignments, student submissions, files, and results.
- Quizzes API clients handle quizzes, questions, submissions, and results.
- Files API clients handle uploaded course and assignment files.

Some requests use `withCredentials: true` to support session-based authentication.

## Environment Variables

Create a `.env` file in the root of the client project:

```env
REACT_APP_REMOTE_SERVER=http://localhost:4000
```

For production, replace the value with the deployed backend URL:

```env
REACT_APP_REMOTE_SERVER=https://your-backend-url.com
```

Because this is a Create React App project, environment variables used by the frontend must start with:

```text
REACT_APP_
```

## Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/learning-management-system-client.git
cd learning-management-system-client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
REACT_APP_REMOTE_SERVER=http://localhost:4000
```

Start the development server:

```bash
npm start
```

The app will run at:

```text
http://localhost:3000
```

## Available Scripts

### Start the development server

```bash
npm start
```

Runs the app in development mode.

### Build for production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

### Run tests

```bash
npm test
```

Runs the test runner.

## Core User Workflows

### Authentication

Users can sign up, sign in, view their profile, and sign out. Protected routes restrict access to authenticated content.

### Course Dashboard

Users can view available courses and enrolled courses through the dashboard. Course cards provide entry points into course-specific pages.

### Course Management

The app supports course viewing, editing, and navigation across course sections such as home, modules, assignments, quizzes, grades, people, announcements, and analytics.

### Modules and Lessons

Instructors can manage modules and lessons. Students can view structured course content through the course modules interface.

### Assignments

The assignment workflow supports assignment viewing, editing, taking/submitting assignments, file upload integration, and assignment result tracking.

### Quizzes

The quiz system supports quiz creation, editing, question management, previewing, student quiz-taking, and quiz results.

### Grades

Students and instructors can view grade-related information, including assignment and quiz results.

### Announcements

Courses include announcement functionality for sharing updates with students.

### People

The people section allows users to view participants associated with a course.

### Analytics

The analytics section provides visual reporting for course-related data.

## Why This Project Matters

This project demonstrates the frontend side of a large full-stack application. It is not a small single-page demo. It includes many of the moving parts expected in a real learning management platform:

- Authentication
- Protected routes
- Role-aware UI
- REST API integration
- Complex nested routing
- Redux state management
- Course content management
- Assignment workflows
- Quiz workflows
- File handling
- Grades and results
- Dashboard-style navigation
- Reusable feature-based structure

## Related Repository

This frontend is designed to work with a separate backend repository:

```text
learning-management-system-server
```

The server repository contains the Node.js/Express/MongoDB backend API used by this client.

## Future Improvements

- Improve responsive design for smaller screens
- Add stronger form validation across assignment, quiz, and course editors
- Add better loading and error states for API requests
- Add more reusable UI components
- Improve accessibility across navigation and forms
- Add automated frontend tests for core workflows
- Add dashboard-level analytics summaries
- Add notification/toast feedback for successful actions
- Add richer role-based permissions for students, instructors, and admins
- Improve deployment documentation for production environments

## Project Context

This project was built as a full-stack learning management system inspired by Canvas. The frontend focuses on the user experience and application workflows, while the separate backend handles API routes, data persistence, authentication, and database operations.

The goal was to build a realistic educational platform with enough depth to support students, instructors, courses, assignments, quizzes, grades, enrollments, and course content management.