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
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#fafaf9] text-gray-900 overflow-hidden font-sans">
            {/* Left Content Column */}
            <div className="hidden lg:flex flex-col justify-center items-center p-20 relative bg-white overflow-hidden border-r border-black/[0.03]">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/[0.03] rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-orange-500/[0.03] rounded-full blur-[100px] animate-pulse delay-700" />

                <div className="relative z-10 max-w-lg w-full space-y-10">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">Cookify</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-6xl font-black leading-[1] text-gray-900 tracking-tighter">
                            Welcome <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">Back!</span>
                        </h1>
                        <div className="w-20 h-2 bg-green-500 rounded-full" />
                        <p className="text-xl text-gray-500 font-medium leading-relaxed">
                            Discover thousands of fresh recipes and connect with a community that breathes organic flavor.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 pt-10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                                    <img src={`https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_face,g_face/v1/samples/people/smiling-man.jpg`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 font-bold">
                            Joined by <span className="text-green-600">50k+</span> foodies
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-10 left-20 text-[10px] text-gray-400 tracking-[0.3em] font-black uppercase">
                    © 2026 Cookify Inc • Fresh Culinary Labs
                </div>
            </div>

            {/* Right Form Column */}
            <div className="flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto w-full">
                <div className="w-full max-w-md mx-auto space-y-12 animate-fade-in relative z-10">
                    <div className="space-y-3">
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Sign In</h2>
                        <p className="text-gray-500 font-medium">Access your personalized culinary vault.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="chef@cookify.com"
                        />

                        <div className="space-y-2 group">
                            <div className="flex justify-between ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-green-600 transition-colors">Password</label>
                                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 transition-colors">Forgot?</button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-white border border-black/[0.05] border-solid rounded-2xl px-6 py-4.5 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-gray-900 font-medium ${errors.password ? 'border-red-500/50' : ''}`}
                                    placeholder="••••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943-9.542-7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 font-bold ml-1">{errors.password}</p>}
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full py-5 btn-brand text-lg">
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>Syncing...</span>
                                </div>
                            ) : 'Enter Kitchen'}
                        </Button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-gray-500 font-bold text-sm">
                            New to the garden? {' '}
                            <Link to="/signup" className="text-green-600 hover:text-green-700 transition-colors underline underline-offset-8 decoration-green-500/20">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SigninPage;
