
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [apiError, setApiError] = useState('');
    const [apiSuccess, setApiSuccess] = useState('');

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return Math.min(strength, 4);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        setApiError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        else if (formData.fullName.trim().length < 2) newErrors.fullName = 'Full name must be at least 2 characters';

        if (!formData.username.trim()) newErrors.username = 'Username is required';
        else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
        else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) newErrors.username = 'Username can only contain letters, numbers, and underscores';

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

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
            const response = await authService.signup({
                fullName: formData.fullName,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.success) {
                setApiSuccess(response.message || 'Account created successfully!');
                if (response.data?.token && response.data?.user) {
                    authService.setAuthData(response.data.token, response.data.user);
                }
                setFormData({
                    fullName: '',
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response?.data?.message) setApiError(error.response.data.message);
            else if (error.message) setApiError('Unable to connect to server. Please try again later.');
            else setApiError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
        return colors[passwordStrength] || colors[0];
    };

    return (
        <div className="min-h-screen bg-accent flex relative overflow-hidden">
            {/* Split Layout: Left Image Section */}
            <div className="hidden lg:flex w-1/2 relative bg-secondary overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 to-transparent"></div>
                <img
                    src="https://images.unsplash.com/photo-1556910602-38f53e68e15d?w=1100&h=1600&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Kitchen Essentials"
                />
                <div className="relative z-20 w-full flex flex-col justify-between p-16 text-white h-full">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-5xl font-serif font-bold leading-tight mb-6">Create. Share. <br /><span className="text-primary italic">Inspire.</span></h2>
                        <p className="text-lg text-neutral-300 max-w-md">Your culinary journey begins here. Join the community today.</p>
                    </div>
                    <div className="text-sm text-neutral-400">© 2024 CookiFy Inc.</div>
                </div>
            </div>

            {/* Split Layout: Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative overflow-y-auto">
                <div className="absolute top-6 right-6 lg:top-10 lg:right-10 flex items-center gap-2 text-sm text-neutral-600">
                    Already a member?
                    <Link to="/signin" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                        Sign in
                    </Link>
                </div>

                <div className="w-full max-w-md animate-fade-in mt-16 lg:mt-0">
                    <div className="mb-8">
                        <h1 className="text-3xl font-serif font-semibold text-secondary mb-2">Create Account</h1>
                        <p className="text-neutral-500">Sign up to get started.</p>
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                            placeholder="John Doe"
                        />

                        <Input
                            label="Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                            placeholder="johndoe_chef"
                        />

                        <Input
                            label="Email Address"
                            type="email"
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

                        {formData.password && (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-300 rounded-full"
                                        style={{ width: `${(passwordStrength + 1) * 20}%`, backgroundColor: getPasswordStrengthColor() }}
                                    />
                                </div>
                                <span className="text-xs font-medium" style={{ color: getPasswordStrengthColor() }}>
                                    {['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][passwordStrength]}
                                </span>
                            </div>
                        )}

                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-[38px] text-neutral-400 hover:text-secondary transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>

                        <div className="pt-2">
                            <Button type="submit" disabled={isLoading} className="w-full h-12">
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </div>

                        <p className="text-center text-xs text-neutral-400 mt-6">
                            By creating an account, you agree to our{' '}
                            <a href="#" className="underline hover:text-secondary">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="underline hover:text-secondary">Privacy Policy</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
