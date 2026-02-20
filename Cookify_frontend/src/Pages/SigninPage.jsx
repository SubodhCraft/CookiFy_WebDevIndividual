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
        if (!formData.email.trim()) newErrors.email = 'Email required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password) newErrors.password = 'Password required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        const loadingToast = toast.loading('Syncing your culinary vault...');
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
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0a0f] text-slate-200 overflow-hidden font-sans">
            {/* Left Content Column */}
            <div className="hidden lg:flex flex-col justify-center items-center p-20 relative bg-gradient-to-br from-indigo-900/40 to-black/20 overflow-hidden">
                {/* Floating Elements Background */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700" />

                <div className="relative z-10 max-w-lg w-full space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Cookify</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-6xl font-bold leading-[1.1] text-white">
                            Welcome <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Back!</span>
                        </h1>
                        <div className="w-20 h-1.5 bg-indigo-500 rounded-full" />
                        <p className="text-xl text-slate-400 font-light leading-relaxed">
                            Discover thousands of world-class recipes and connect with a community that breathes flavor.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 pt-10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-[#0a0a0f] bg-slate-800 flex items-center justify-center overflow-hidden">
                                    <img src={`https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_thumb,g_auto,v1/samples/people/boy-snow-hoodie.jpg`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-400 font-medium">
                            Joined by <span className="text-white">50k+</span> enthusiasts
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-10 left-20 text-xs text-slate-600 tracking-widest font-semibold uppercase">
                    © 2024 Cookify Inc • Premium Culinary Platform
                </div>
            </div>

            {/* Right Form Column */}
            <div className="flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto w-full">
                <div className="w-full max-w-md mx-auto space-y-10 animate-fade-in relative z-10">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold text-white tracking-tight">Sign In</h2>
                        <p className="text-slate-500">Access your personalized strategy vault.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="name@company.com"
                        />

                        <div className="space-y-1 group">
                            <div className="flex justify-between ml-1">
                                <label className="text-sm font-medium text-slate-400 group-focus-within:text-indigo-400 transition-colors">Password</label>
                                <button type="button" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot?</button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full glass-input px-5 py-3.5 focus:ring-2 focus:ring-indigo-500/50 transition-all ${errors.password ? 'border-red-500/50' : ''}`}
                                    placeholder="••••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500/80 ml-1">{errors.password}</p>}
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Syncing...</span>
                                </div>
                            ) : 'Sign In'}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Don't have an account? {' '}
                            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline underline-offset-4 decoration-indigo-500/20">Sign Up Free</Link>
                        </p>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-20 right-[-10%] w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px]" />
                <div className="absolute bottom-20 left-[-10%] w-[200px] h-[200px] bg-purple-500/5 rounded-full blur-[60px]" />
            </div>
        </div>
    );
};

export default SigninPage;
