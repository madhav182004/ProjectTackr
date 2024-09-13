
# PROJECTTRACKR

## Overview

**PROJECTTRACKR** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application designed to manage projects and track todos efficiently. This application integrates user management and task tracking, with a focus on a clean and intuitive user experience.

## Features

- **Project Management**: Create, update, and delete projects.
- **Todo Management**: Add, update, complete, and delete todos associated with each project.
- **User Management**: Assign users to projects and todos.
- **Authentication**: Secure user login and registration using JWT (JSON Web Tokens).
- **Task Tracking**: Track task completion and view completed and pending tasks separately.

## Technologies Used

- **MongoDB**: NoSQL database used for storing projects, users, and todos.
- **Express.js**: Backend framework for building RESTful APIs.
- **React.js**: Frontend library for building user interfaces.
- **Node.js**: Runtime environment for executing JavaScript code on the server.
- **JWT**: Token-based authentication for securing API endpoints.

## Advantages of Using MongoDB

- **Flexible Schema**: MongoDB's document-oriented data model allows for flexible and dynamic schema design, making it easy to evolve and adapt the data structure as the application grows.
- **Scalability**: MongoDB provides horizontal scalability, allowing for easy scaling out by adding more servers. This makes it suitable for handling large volumes of data and high traffic.
- **Performance**: MongoDB offers high performance for read and write operations with its in-memory processing and indexing capabilities.
- **Ease of Use**: The JSON-like format of MongoDB documents aligns closely with the way data is represented in JavaScript, simplifying the development process and reducing the need for complex data transformations.
- **Rich Query Language**: MongoDB's query language supports powerful and flexible queries, including aggregation and indexing, to efficiently handle complex data retrieval and analysis.

## Database Structure

**PROJECTTRACKR** uses three primary MongoDB databases:

1. **Projects**: Stores information about individual projects, including project details and associated todos.
2. **Users**: Contains user profiles and credentials for authentication and authorization.
3. **Todos**: Manages tasks related to projects, including task details and completion status.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/PROJECTTRACKR.git
   cd PROJECTTRACKR
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application on client:

   ```bash
   cd client
   npm start
   ```
4. Start the application on api:

   ```bash
   cd api
   nodemon index.js
   ```

## API Endpoints

- **POST** `/api/users/register` - Register a new user
- **POST** `/api/users/login` - Login and receive a JWT token
- **GET** `/api/projects` - Get all projects
- **POST** `/api/projects` - Create a new project
- **PUT** `/api/projects/:id` - Update a project
- **DELETE** `/api/projects/:id` - Delete a project
- **GET** `/api/projects/:id/todos` - Get todos for a specific project
- **POST** `/api/projects/:id/todo/new` - Add a new todo to a project
- **PUT** `/api/projects/:id/todo/complete/:todoId` - Mark a todo as completed
- **DELETE** `/api/projects/:id/todo/delete/:todoId` - Delete a todo

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.


## Acknowledgments

- Thanks to the developers and community members who contributed to the technologies used in this project. This project was a task given in the second round of interview in an internship offer for the post of backend developer. So please ignore the UI an the frontend beacuse it is kept very minimilistic. The main focus was creating a proper backend that suppports all the functionality. 

