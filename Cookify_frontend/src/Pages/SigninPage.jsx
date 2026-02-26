import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const SigninPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        const loadingToast = toast.loading('Signing in...');
        try {
            const response = await authService.signin(formData);
            if (response.success) {
                authService.setAuthData(response.data.token, response.data.user);
                toast.success(`Welcome back, ${response.data.user.fullName}!`, { id: loadingToast });
                navigate('/dashboard');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message, { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white text-[#2C2C2C] font-sans overflow-hidden">
            {/* Left Panel - Premium Brand Showcase */}
            <div className="hidden lg:flex flex-col justify-center items-center p-16 bg-[#F5F7F4] relative overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8F5E9]/60 via-transparent to-[#FFF9C4]/20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E7D32]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/5 rounded-full -ml-20 -mb-20 blur-2xl" />

                <div className="relative z-10 max-w-sm w-full space-y-12 animate-reveal">
                    {/* Brand Identity */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <img src="/Cookify.png" alt="Cookify Logo" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-2xl font-bold text-gray-900 font-heading tracking-tight">Cookify</span>
                    </div>

                    {/* Value Proposition */}
                    <div className="space-y-6">
                        <h1 className="text-6xl font-extrabold text-gray-900 leading-[1.1] font-heading">
                            Welcome<br />
                            <span className="text-[#2E7D32]">Back.</span>
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed font-medium">
                            Continue your culinary exploration. Access your favorite recipes and keep sharing your unique flavors.
                        </p>
                    </div>

                </div>

                <div className="absolute bottom-10 left-16 text-xs text-gray-400 font-medium tracking-widest uppercase italic">
                    © 2026 Cookify — Culinary Excellence
                </div>
            </div>

            {/* Right Panel - Form Area */}
            <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
                <div className="w-full max-w-md space-y-10 animate-reveal">
                    {/* Mobile Branding */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/Cookify.png" alt="Cookify Logo" className="w-10 h-10 object-contain" />
                        <span className="text-xl font-bold text-gray-900 font-heading">Cookify</span>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-4xl font-bold text-gray-900 font-heading tracking-tight">Sign In</h2>
                        <p className="text-gray-500 text-lg">Enter your details to continue your journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="you@example.com"
                        />

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <Link to="/forgot-password" className="text-xs font-semibold text-[#2E7D32] hover:text-[#1B5E20] transition-colors underline decoration-1 underline-offset-2">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 ${errors.password ? 'border-red-400' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E7D32] transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        ) : (
                                            <>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 font-medium mt-1">{errors.password}</p>}
                        </div>

                        <Button type="submit" disabled={isLoading} variant="primary" className="w-full py-4 rounded-2xl shadow-xl shadow-green-900/10 hover:shadow-green-900/20 active:scale-[0.98] transition-all">
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Signing In...</span>
                                </div>
                            ) : 'Sign In to Cookify'}
                        </Button>
                    </form>

                    <div className="text-center pt-8 border-t border-gray-100">
                        <p className="text-gray-500 font-medium">
                            New to the garden?{' '}
                            <Link to="/signup" className="font-bold text-[#2E7D32] hover:text-[#1B5E20] transition-colors underline decoration-2 underline-offset-4 decoration-green-100 hover:decoration-green-500">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SigninPage;
