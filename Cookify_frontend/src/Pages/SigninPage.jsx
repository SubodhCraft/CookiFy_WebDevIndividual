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
        const loadingToast = toast.loading('Logging you in...');
        try {
            const response = await authService.signin(formData);
            if (response.success) {
                authService.setAuthData(response.data.token, response.data.user);
                toast.success(`Welcome back, ${response.data.user.fullName}!`, { id: loadingToast });
                navigate('/dashboard');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please check your email and password.';
            toast.error(message, { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white text-gray-900 overflow-hidden font-sans">
            {/* Left Content Column */}
            <div className="hidden lg:flex flex-col justify-center items-center p-20 relative bg-gray-50 overflow-hidden border-r border-black/[0.1]">
                <div className="relative z-10 max-w-lg w-full space-y-12">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-14 h-14 bg-green-600 rounded-none flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-3xl font-bold tracking-tighter text-gray-900 uppercase">Cookify</span>
                    </div>

                    <div className="space-y-8">
                        <h1 className="text-7xl font-bold leading-[1] text-gray-900 tracking-tight">
                            Welcome <br />
                            <span className="text-green-600">Back.</span>
                        </h1>
                        <p className="text-2xl text-gray-500 font-medium leading-relaxed">
                            Find the best recipes and connect with other food lovers.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 pt-12">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-14 h-14 rounded-none border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
                                    <img src={`https://images.unsplash.com/photo-${i === 1 ? '1535713875002-d1d0cf377fde' : i === 2 ? '1599566150163-29194dcaad36' : i === 3 ? '1527980965255-d3b416303d12' : '1438761681033-6461ffad8d80'}?q=80&w=100&h=100&auto=format&fit=crop`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <p className="text-base text-gray-500 font-bold">
                            Joined by <span className="text-green-600">50,000+</span> food lovers
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-12 left-20 text-xs text-gray-400 tracking-widest font-bold uppercase">
                    © 2026 Cookify Inc
                </div>
            </div>

            {/* Right Form Column */}
            <div className="flex items-center justify-center p-12 lg:p-20 relative overflow-y-auto w-full">
                <div className="w-full max-w-md mx-auto space-y-16 animate-fade-in relative z-10">
                    <div className="space-y-4">
                        <h2 className="text-6xl font-bold text-gray-900 tracking-tight">Sign In</h2>
                        <p className="text-gray-500 font-medium text-lg">Enter your details and start cooking.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="your@email.com"
                        />

                        <div className="space-y-4 group">
                            <div className="flex justify-between ml-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-green-600 transition-colors">Password</label>
                                <Link to="/forgot-password" university-bold uppercase tracking-widest text-green-600 hover:text-green-700 transition-colors>Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-white border border-black/[0.1] border-solid rounded-none px-6 py-5 focus:ring-0 focus:border-green-600 outline-none transition-all text-gray-900 font-medium shadow-sm ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943-9.542-7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-red-500 font-bold ml-1">{errors.password}</p>}
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full py-6 text-xl">
                            {isLoading ? 'Wait...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="text-center pt-6">
                        <p className="text-gray-500 font-bold text-base">
                            Need an account? {' '}
                            <Link to="/signup" className="text-green-600 hover:text-green-700 transition-colors underline underline-offset-8 decoration-green-500/20">Create one here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SigninPage;
