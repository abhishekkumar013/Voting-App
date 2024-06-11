# Voting App

## Overview
The Voting App is a secure, user-friendly web application designed for conducting online voting. This application allows users to create, participate in, and manage polls and elections with robust security measures in place to ensure the integrity of the voting process.

## Features
- **User Registration and Authentication**
  - Secure registration with email and password.
  - Passwords hashed using bcrypt.
  - JWT-based authentication for secure login and session management.

- **Voting System**
  - Create, view, and participate in polls.
  - Ensure one vote per user per poll.
  - Real-time vote counting and results display.

- **Admin Capabilities**
  - Manage polls (create, edit, delete).
  - Access detailed voting statistics and user participation data.

- **Security**
  - Passwords hashed with bcrypt.
  - JWTs for authentication and authorization.
  - Secure cookies to store JWTs, preventing XSS attacks.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Frontend**: React
- **Authentication**: JSON Web Tokens (JWT), cookies
- **Password Security**: bcrypt

## Project Structure
### Backend
- `server.js`: Entry point for the backend application.
- `routes/`: Route definitions for authentication and voting features.
- `controllers/`: Business logic for handling requests and responses.
- `models/`: Database schemas and models.
- `middleware/`: Middleware functions for authentication and error handling.

### Frontend
- `src/App.js`: Main React component.
- `src/components/`: Reusable UI components (e.g., Login, Register, Poll).
- `src/services/`: API service functions for interacting with the backend.
- `src/context/`: Context for managing global state (e.g., user authentication state).

## Setup and Installation
1. **Clone the repository**:
   ```sh
   https://github.com/abhishekkumar013/Voting-App.git
2. **Navigate to the project directory**:
   ```sh
   cd Voting-App
3. **Install backend dependencies**:
   ```sh
   cd backend
   npm run dev
4. **Start the frontend server**:
   ```sh
    cd ../frontend
    npm run dev

### Contributing
Contributions are welcome! Please open an issue or submit a pull request with your improvements or bug fixes.

### License
This project is licensed under the MIT License.

### Acknowledgements
Thanks to the developers and community members who contributed to the open-source libraries used in this project.
