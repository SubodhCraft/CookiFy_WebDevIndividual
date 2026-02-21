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
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#fafaf9] text-gray-900 overflow-hidden font-sans">
            {/* Form Side */}
            <div className="flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto w-full">
                <div className="w-full max-w-md mx-auto space-y-12 animate-fade-in relative z-10 py-10">
                    <div className="space-y-4">
                        <Link to="/" className="inline-flex items-center gap-3 text-green-600 mb-8 group">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase">Return Home</span>
                        </Link>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
                            Join the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">Green Club.</span>
                        </h1>
                        <p className="text-gray-500 font-medium pt-2">Establish your heritage chef profile today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} placeholder="Chef Name" />
                            <Input label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} placeholder="chef_X" />
                        </div>
                        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="chef@cookify.organic" />

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
                                className="absolute right-5 top-[46px] text-gray-400 hover:text-green-600 transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                )}
                            </button>
                        </div>

                        <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} placeholder="••••••••" />

                        <Button type="submit" disabled={isLoading} className="w-full mt-4 py-5 btn-brand text-lg">
                            {isLoading ? 'Creating Magic...' : 'Establish Registry'}
                        </Button>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-gray-500 font-bold text-sm">
                            Member already? {' '}
                            <Link to="/signin" className="text-green-600 hover:text-green-700 transition-colors underline underline-offset-8 decoration-green-500/20">Sign In Here</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Side */}
            <div className="hidden lg:flex flex-col justify-center items-center p-20 relative bg-white overflow-hidden border-l border-black/[0.03]">
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-green-500/[0.03] rounded-full blur-[100px] animate-pulse" />

                <div className="relative z-10 max-w-lg w-full space-y-12">
                    <div className="bg-white rounded-[48px] p-12 space-y-8 border border-black/[0.03] shadow-2xl">
                        <div className="w-16 h-16 bg-green-500 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/20 p-4">
                            <img src="https://res.cloudinary.com/demo/image/upload/v1/samples/logos/cloudinary_icon_white.png" className="w-full h-full object-contain" alt="chef icon" />
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 leading-[1.1] tracking-tighter">Elite Fresh <br />Program</h3>
                        <p className="text-gray-500 text-xl font-medium leading-relaxed">
                            Upgrade your profile to verified status, share exclusive recipes with subscribers, and monetize your culinary passion.
                        </p>
                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-green-600 tracking-[0.2em] uppercase">
                            <span>Verification</span>
                            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                            <span>Monetization</span>
                            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                            <span>Analytics</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {[
                            { label: 'Recipes', val: '2.5k+' },
                            { label: 'Active Chefs', val: '800+' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-[32px] p-8 border border-black/[0.03] text-center shadow-lg">
                                <div className="text-3xl font-black text-gray-900">{stat.val}</div>
                                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
