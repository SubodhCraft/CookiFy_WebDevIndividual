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

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your name';
        if (!formData.username.trim()) newErrors.username = 'Please choose a username';
        if (!formData.email.trim()) newErrors.email = 'Please enter your email';
        if (!formData.password) newErrors.password = 'Please create a password';
        else if (formData.password.length < 6) newErrors.password = 'Must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        const loadingToast = toast.loading('Setting up your account...');
        try {
            const response = await authService.signup(formData);
            if (response.success) {
                toast.success('You are all set! Please sign in.', { id: loadingToast });
                navigate('/signin');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Something went wrong. Please try again.';
            toast.error(message, { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white text-gray-900 overflow-hidden font-sans">
            {/* Form Side */}
            <div className="flex items-center justify-center p-12 lg:p-20 relative overflow-y-auto w-full">
                <div className="w-full max-w-md mx-auto space-y-16 animate-fade-in relative z-10 py-10">
                    <div className="space-y-6">
                        <Link to="/" className="inline-flex items-center gap-3 text-green-600 mb-8 group">
                            <div className="w-12 h-12 rounded-none bg-green-50 flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-green-100">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Back Home</span>
                        </Link>
                        <h1 className="text-6xl font-bold text-gray-900 tracking-tight leading-none">
                            Create <br />
                            <span className="text-green-600">Account.</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-lg">Join us to start sharing and finding great recipes.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-2 gap-8">
                            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} placeholder="Your Name" />
                            <Input label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} placeholder="Username" />
                        </div>
                        <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="your@email.com" />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                placeholder="Create password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-[52px] text-gray-400 hover:text-green-600 transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                placeholder="Type it again"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-5 top-[52px] text-gray-400 hover:text-green-600 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                )}
                            </button>
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full mt-6 py-6 text-xl">
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-gray-500 font-bold text-base">
                            Already have an account? {' '}
                            <Link to="/signin" className="text-green-600 hover:text-green-700 transition-colors underline underline-offset-8 decoration-green-500/20">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Side */}
            <div className="hidden lg:flex flex-col justify-center items-center p-20 relative bg-gray-50 overflow-hidden border-l border-black/[0.1]">
                <div className="relative z-10 max-w-lg w-full space-y-12">
                    <div className="bg-white rounded-none p-16 space-y-10 border border-black shadow-xl">
                        <div className="w-20 h-20 bg-green-600 rounded-none flex items-center justify-center shadow-lg p-5">
                            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" /><line x1="6" y1="17" x2="18" y2="17" />
                            </svg>
                        </div>
                        <h3 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">Master <br />Chef Plan</h3>
                        <p className="text-gray-500 text-xl font-medium leading-relaxed">
                            Share your best recipes, build a following, and explore new flavors every day.
                        </p>
                        <div className="flex flex-wrap items-center gap-10 text-xs font-bold text-green-600 tracking-widest uppercase">
                            <span>Share</span>
                            <span>Discover</span>
                            <span>Connect</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                        {[
                            { label: 'Total Recipes', val: '2,500+' },
                            { label: 'Cooking Now', val: '800+' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-none p-10 border border-black text-center shadow-md">
                                <div className="text-4xl font-bold text-gray-900">{stat.val}</div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-3">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
