
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const SigninPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState('');
    const [apiSuccess, setApiSuccess] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        setApiError('');
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setApiSuccess('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await authService.signin({
                email: formData.email,
                password: formData.password
            });

            if (response.success) {
                setApiSuccess(response.message || 'Login successful!');
                if (response.data?.token && response.data?.user) {
                    authService.setAuthData(response.data.token, response.data.user);
                }
                setFormData({ email: '', password: '' });
                setTimeout(() => navigate('/'), 1500);
            }
        } catch (error) {
            console.error('Signin error:', error);
            if (error.response?.data?.message) setApiError(error.response.data.message);
            else if (error.message) setApiError('Unable to connect to server. Please try again later.');
            else setApiError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-accent flex relative overflow-hidden">
            {/* Split Layout: Left Image Section */}
            <div className="hidden lg:flex w-1/2 relative bg-secondary overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 to-transparent"></div>
                <img
                    src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200&h=1600&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Culinary Experience"
                />
                <div className="relative z-20 w-full flex flex-col justify-between p-16 text-white">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-5xl font-serif font-bold leading-tight mb-6">Master the Art of <br /><span className="text-primary italic">Flavor</span></h2>
                        <p className="text-lg text-neutral-300 max-w-md">Join thousands of passionate cooks and discover recipes that inspire.</p>
                    </div>
                    <div className="text-sm text-neutral-400">© 2024 CookiFy Inc.</div>
                </div>
            </div>

            {/* Split Layout: Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative">
                <div className="absolute top-6 right-6 lg:top-10 lg:right-10 flex items-center gap-2 text-sm text-neutral-600">
                    Not a member?
                    <Link to="/signup" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                        Sign up now
                    </Link>
                </div>

                <div className="w-full max-w-md animate-fade-in">
                    <div className="mb-10">
                        <h1 className="text-3xl font-serif font-semibold text-secondary mb-2">Welcome back</h1>
                        <p className="text-neutral-500">Please enter your details to sign in.</p>
                    </div>

                    {apiError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
                            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-800">{apiError}</p>
                        </div>
                    )}

                    {apiSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fade-in">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-green-800">{apiSuccess}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="john@example.com"
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-neutral-400 hover:text-secondary transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-primary bg-neutral-100 border-neutral-300 rounded focus:ring-primary cursor-pointer"
                                />
                                <span className="text-sm text-neutral-500 group-hover:text-secondary transition-colors">Remember me</span>
                            </label>
                            <button type="button" className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
                                Forgot password?
                            </button>
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full h-12">
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-neutral-400">Or continue with</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                <span className="text-sm font-medium text-secondary">Google</span>
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                <span className="text-sm font-medium text-secondary">Facebook</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SigninPage;
