# TaskMaster - MERN Stack Task Manager

TaskMaster is a full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js). It provides a clean, intuitive interface for managing your tasks with features like user authentication, task creation, editing, and filtering.

## Features

- User authentication (registration and login) with JWT
- Create, view, update, and delete tasks
- Filter tasks by status (pending, in progress, completed)
- Responsive design for all device sizes
- Clean and intuitive user interface

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Router, React Hook Form
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation and Setup

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the server directory based on the `.env.example` provided
   - Set your MongoDB connection string and JWT secret

4. Run the application:

```bash
# Start the backend and frontend concurrently
npm run dev:full

# Or run them separately
npm run dev       # Frontend
npm run server    # Backend
```

## API Endpoints

- **Authentication:**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login user
  - `GET /api/auth/profile` - Get user profile (protected)

- **Tasks:**
  - `GET /api/tasks` - Get all tasks for authenticated user
  - `GET /api/tasks/:id` - Get a specific task
  - `POST /api/tasks` - Create a new task
  - `PUT /api/tasks/:id` - Update a task
  - `DELETE /api/tasks/:id` - Delete a task

## Deployment

For deployment, you can follow these approaches:

1. **Frontend:** Deploy on Netlify, Vercel, or Azure Static Web Apps
2. **Backend:** Deploy on Azure App Service, Azure Functions, or another Node.js hosting platform
3. **Database:** Use MongoDB Atlas or Azure Cosmos DB with MongoDB API

## License

This project is licensed under the MIT License.