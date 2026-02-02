# Pet Adoption Management System

This is a MERN (MongoDB, Express.js, React.js, Node.js) stack project for a Pet Adoption Web Application. Users can view available pets for adoption, add new pets for adoption, and adopt pets.

## Features

- **User authentication**: Users can sign up, log in, and log out.
- **CRUD operations**: Users can perform CRUD (Create, Read, Update, Delete) operations on pet listings.
- **Image upload**: Users can upload images of pets they want to put up for adoption.
- **Search functionality**: Users can search for pets based on various parameters such as breed, age, etc.
- **Responsive design**: The application is responsive and works seamlessly on various devices.
- **Role-based access**: Admin users can manage all pets and adoption applications.
- **Adoption applications**: Users can apply for pet adoption and track application status.
- **Advanced filtering**: Filter pets by species, breed, and age with pagination.

## Installation

To run this project locally, follow these steps:

### Clone the repository:

```bash
git clone <your-repository-url>
cd Pet-Adoption-Management-System
```

### Install dependencies:

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Frontend Dependencies
```bash
cd ../pet-adoption-frontend
npm install
```

### Set up environment variables:

#### Backend Environment Variables
Create a `.env` file in the `backend` directory and add the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/pet-adoption
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment Variables
Create a `.env` file in the `pet-adoption-frontend` directory and add the following variables:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run the development server:

#### Start Backend Server
```bash
cd backend
npm run dev
```

#### Start Frontend Development Server
```bash
cd pet-adoption-frontend
npm run dev
```

Open http://localhost:5173 in your browser to view the application.

## Technologies Used

### Frontend
- **React.js** - JavaScript library for building user interfaces
- **React Router** - Client-side routing
- **Tailwind CSS** - For styling
- **Axios** - For making HTTP requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - Database with Mongoose ODM

### Authentication
- **JSON Web Tokens (JWT)** - For secure authentication

### Others
- **Multer** - For handling file uploads
- **bcryptjs** - For password hashing
- **Lucide React** - For icons

## Project Structure

```
Pet-Adoption-Management-System/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/              # Uploaded pet images
│   └── server.js
├── pet-adoption-frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── public/
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Pets
- `GET /api/pets` - Get all pets with filtering
- `GET /api/pets/:id` - Get pet by ID
- `POST /api/pets` - Create new pet (Admin only)
- `PUT /api/pets/:id` - Update pet (Admin only)
- `DELETE /api/pets/:id` - Delete pet (Admin only)

### Adoption Applications
- `POST /api/adoptions` - Submit adoption application
- `GET /api/adoptions/my` - Get user's applications
- `GET /api/adoptions` - Get all applications (Admin only)
- `PUT /api/adoptions/:id` - Update application status (Admin only)

## Usage

1. **Register/Login**: Create an account or log in to the system
2. **Browse Pets**: View available pets with filtering options
3. **Search/Filter**: Use search and filter options to find specific pets
4. **View Details**: Click on any pet to see detailed information
5. **Apply for Adoption**: Submit adoption applications for pets you're interested in
6. **Admin Functions**: (Admin users only) Manage pets and review applications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
