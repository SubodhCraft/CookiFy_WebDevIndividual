# Cookify - Recipe Management Application

A full-stack web application for managing and sharing recipes, built with React (Vite) frontend and Node.js/Express backend.

## Project Structure

```
Web_Individual_CookiFy/
├── Cookify_frontend/          # React + Vite + Tailwind CSS Frontend
│   ├── node_modules/          # Frontend dependencies
│   ├── public/                # Static assets
│   │   └── vite.svg
│   ├── src/                   # Source files
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── App.css            # App component styles
│   │   ├── App.jsx            # Main App component
│   │   ├── index.css          # Global styles (Tailwind directives)
│   │   └── main.jsx           # Application entry point
│   ├── .env                   # Environment variables
│   ├── .gitignore             # Git ignore rules
│   ├── eslint.config.js       # ESLint configuration
│   ├── index.html             # HTML entry point
│   ├── package.json           # Frontend dependencies & scripts
│   ├── package-lock.json      # Locked dependency versions
│   ├── README.md              # Frontend documentation
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── vite.config.js         # Vite configuration
│
└── backend/                   # Node.js + Express Backend
    ├── node_modules/          # Backend dependencies
    ├── .env                   # Environment variables
    ├── .gitignore             # Git ignore rules
    ├── index.js               # Express server entry point
    ├── package.json           # Backend dependencies & scripts
    └── package-lock.json      # Locked dependency versions
```

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Language**: JavaScript (ES6+)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Dependencies**: 
  - `cors` - Cross-Origin Resource Sharing
  - `dotenv` - Environment variable management
  - `nodemon` - Auto-restart during development

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Frontend Setup

```bash
cd Cookify_frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` (default Vite port)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will run on `http://localhost:5000` (configured in .env)

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon (auto-restart)
- `npm start` - Start production server

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
```

## Next Steps

1. **Database Setup**: Choose and configure your database (MongoDB, PostgreSQL, etc.)
2. **API Routes**: Create route handlers in the backend
3. **Components**: Build React components in the frontend
4. **State Management**: Add Redux/Context API if needed
5. **Authentication**: Implement user authentication (JWT, OAuth, etc.)

## License

ISC

---

**Happy Coding! 🍳**
