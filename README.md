# Todo App

This to-do list application is a portfolio project designed to demonstrate modern web development skills. Built with Angular, the app provides tools for intuitive task management, including CRUD operations, filtering, drag-and-drop reordering, and task presets. It integrates with a MongoDB backend for persistent data storage and features a fully responsive design optimized for various device sizes.

## Links

- **GitHub Repository**: [View Source Code](https://github.com/hanna-skryl/todo-app)
- **Live Demo**: [View Live Site](https://hanna-skryl-todo.netlify.app)

## Features

#### Task Management
- Add, edit, and delete tasks with ease
- Mark tasks as complete or active
- Clear all completed tasks with one click
- Create and manage task presets for quick reuse of predefined task lists

#### Organization and Filtering
- Filter tasks by status (all, active, completed)
- Drag-and-drop functionality for reordering tasks

#### Themes and Responsiveness
- Toggle between light and dark themes
- Fully responsive design optimized for mobile, tablet, and desktop views

#### Backend Integration
- Persistent data storage using a MongoDB backend

#### Authentication
- Simple user authentication for binding tasks to specific accounts

## Technology Stack

The application is built with the following technologies and tools:

- **Frontend**: Angular, RxJS, NgRx SignalStore
- **Styling**: SCSS
- **Backend**: Node.js, Express, MongoDB
- **Deployment**: Netlify (Frontend), Render (Backend)

## Highlights

### Backend Integration

The app integrates with a MongoDB backend to persist user data, ensuring tasks and presets remain consistent and accessible across sessions. A RESTful API handles all interactions between the front end and the database.

### User Authentication

Simple user authentication tasks and presets to be tied to specific accounts. Key features include:

- Login and logout functionality with session persistence using `localStorage`
- Angular route guards to protect task management features for authenticated users only

### Task Presets

The app includes a task preset management system for recurring workflows. Users can:

- Save task lists as reusable presets
- Edit and delete existing presets
- Quickly generate a new to-do list based on a saved preset

### Themes and Responsiveness

The app supports light and dark themes. Its responsive design ensures an optimal experience across mobile, tablet, and desktop devices.
