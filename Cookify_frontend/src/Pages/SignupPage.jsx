import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
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
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name required';
        if (!formData.username.trim()) newErrors.username = 'Username required';
        if (!formData.email.trim()) newErrors.email = 'Email required';
        if (!formData.password) newErrors.password = 'Password required';
        else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords mismatch';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        const loadingToast = toast.loading('Creating your chef profile...');
        try {
            const response = await authService.signup(formData);
            if (response.success) {
                toast.success('Registration successful! Please sign in.', { id: loadingToast });
                navigate('/signin');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message, { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0a0f] text-slate-200 overflow-hidden font-sans">
            {/* Form Side */}
            <div className="flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto w-full">
                <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in relative z-10 py-10">
                    <div className="space-y-2">
                        <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 mb-6 group">
                            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm font-bold tracking-widest uppercase">Home</span>
                        </Link>
                        <h1 className="text-4xl font-bold text-white tracking-tight leading-none">Join the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Revolution.</span></h1>
                        <p className="text-slate-500 font-medium pt-2">Create your free expert account today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} placeholder="Cook Star" />
                            <Input label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} placeholder="chef_X" />
                        </div>
                        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="chef@cookify.pro" />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[42px] text-slate-500 hover:text-slate-300"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                )}
                            </button>
                        </div>

                        <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="••••••••" />

                        <Button type="submit" disabled={isLoading} className="w-full mt-4">
                            {isLoading ? 'Creating Magic...' : 'Start Cooking'}
                        </Button>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-slate-500 text-sm">
                            Member already? {' '}
                            <Link to="/signin" className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4 decoration-indigo-500/20">Sign In Here</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Side */}
            <div className="hidden lg:flex flex-col justify-center items-center p-20 relative bg-gradient-to-bl from-indigo-900/40 via-purple-900/10 to-black overflow-hidden border-l border-white/5">
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" />

                <div className="relative z-10 max-w-lg w-full space-y-12">
                    <div className="glass-card p-10 space-y-6 border-white/10 shadow-2xl">
                        <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 p-3">
                            <img src="https://res.cloudinary.com/demo/image/upload/v1/samples/logos/cloudinary_icon_white.png" className="w-full h-full object-contain" alt="chef icon" />
                        </div>
                        <h3 className="text-3xl font-bold text-white leading-tight">Elite Chef Program</h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Upgrade your profile to verified status, share exclusive recipes with subscribers, and monetize your culinary passion.
                        </p>
                        <div className="flex items-center gap-4 text-sm font-bold text-indigo-400 tracking-wider uppercase">
                            <span>Verification</span>
                            <div className="w-1 h-1 bg-slate-600 rounded-full" />
                            <span>Monetization</span>
                            <div className="w-1 h-1 bg-slate-600 rounded-full" />
                            <span>Analytics</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { label: 'Recipes', val: '2.5k+' },
                            { label: 'Active Chefs', val: '800+' }
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-6 border-white/5 text-center">
                                <div className="text-2xl font-bold text-white">{stat.val}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
