import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './Pages/LandingPage';
import SignupPage from './Pages/SignupPage';
import SigninPage from './Pages/SigninPage';
import DashboardPage from './Pages/DashboardPage';
import RecipeDetailPage from './Pages/RecipeDetailPage';
import ForgotPasswordPage from './Pages/ForgotPasswordPage';
import ResetPasswordPage from './Pages/ResetPasswordPage';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#111827',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: '20px',
            padding: '16px 24px',
            fontSize: '14px',
            fontWeight: '700',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
