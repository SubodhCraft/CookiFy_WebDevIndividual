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
        <div className="min-h-screen grid lg:grid-cols-2 bg-white text-slate-900 font-sans overflow-hidden">
            {/* Left Narrative Column */}
            <div className="hidden lg:flex flex-col justify-center items-center p-24 bg-slate-50 border-r border-slate-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

                <div className="relative z-10 max-w-lg w-full space-y-16 animate-reveal">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-emerald-600 transition-colors">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-3xl font-extrabold tracking-tighter text-slate-900">Cookify</span>
                    </div>

                    <div className="space-y-8">
                        <h1 className="text-8xl font-black leading-[0.9] tracking-tighter text-slate-900">
                            Back in the <br />
                            <span className="text-emerald-600">Kitchen.</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
                            Your culinary adventure continues here. Discover new flavors and master your craft.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 pt-8">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                                    <img src={`https://images.unsplash.com/photo-${i === 1 ? '1535713875002-d1d0cf377fde' : i === 2 ? '1599566150163-29194dcaad36' : i === 3 ? '1527980965255-d3b416303d12' : '1438761681033-6461ffad8d80'}?q=80&w=100&h=100&auto=format&fit=crop`} alt="chef" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="h-10 w-px bg-slate-200" />
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                            <span className="text-emerald-600">50k+</span> Chefs Active
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-12 left-24 text-[10px] text-slate-300 font-black tracking-[0.3em] uppercase">
                    © 2026 Cookify System
                </div>
            </div>

            {/* Right Auth Column */}
            <div className="flex items-center justify-center p-12 lg:p-24 relative overflow-y-auto w-full bg-white">
                <div className="w-full max-w-md mx-auto space-y-12 animate-reveal delay-100">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Sign In</h2>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">Please enter your credentials to access your portal.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="your@email.com"
                        />

                        <div className="space-y-2 group">
                            <div className="flex justify-between items-end mb-1">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                <Link to="/forgot-password" className="text-emerald-600 hover:text-emerald-700 transition-colors text-xs font-bold uppercase tracking-widest">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-white border border-slate-200 rounded-lg px-5 py-3.5 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm ${errors.password ? 'border-red-400' : ''}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943-9.542-7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 font-medium mt-1.5 ml-0.5">{errors.password}</p>}
                        </div>

                        <Button type="submit" disabled={isLoading} variant="secondary" className="w-full py-5 text-lg shadow-xl shadow-slate-900/10">
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Syncing...</span>
                                </div>
                            ) : 'Enter Portal'}
                        </Button>
                    </form>

                    <div className="text-center pt-8 border-t border-slate-100">
                        <p className="text-slate-500 font-semibold text-sm">
                            New to the community? {' '}
                            <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 transition-colors underline underline-offset-8 decoration-emerald-500/30">
                                Create an Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SigninPage;
