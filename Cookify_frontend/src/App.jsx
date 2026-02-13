import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import SignupPage from './Pages/SignupPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Sign in route will be added later */}
        <Route path="/signin" element={<div className="min-h-screen flex items-center justify-center text-2xl">Sign In Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}

export default App;
