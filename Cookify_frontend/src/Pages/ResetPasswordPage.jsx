import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import Button from '../components/common/Button';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [tokenMissing, setTokenMissing] = useState(false);

    useEffect(() => { if (!token) setTokenMissing(true); }, [token]);

    const getPasswordStrength = (pwd) => {
        if (!pwd) return { score: 0, label: '', color: '' };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        const levels = [
            { score: 0, label: '', color: '' },
            { score: 1, label: 'Weak', color: 'bg-red-400' },
            { score: 2, label: 'Fair', color: 'bg-orange-400' },
            { score: 3, label: 'Good', color: 'bg-yellow-400' },
            { score: 4, label: 'Strong', color: 'bg-green-500' },
        ];
        return levels[score];
    };

    const strength = getPasswordStrength(formData.password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Must be at least 6 characters';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        const loadingToast = toast.loading('Resetting password...');
        try {
            const response = await authService.resetPassword(token, formData.password);
            if (response.success) {
                toast.success('Password reset successfully!', { id: loadingToast });
                setIsSuccess(true);
                setTimeout(() => navigate('/signin'), 3000);
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
            toast.error(message, { id: loadingToast });
            setErrors({ form: message });
        } finally { setIsLoading(false); }
    };

    const EyeToggle = ({ show, onToggle }) => (
        <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2E7D32] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {show ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                ) : (
                    <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                )}
            </svg>
        </button>
    );

    /* Invalid / missing token */
    if (tokenMissing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-8">
                <div className="text-center space-y-6 max-w-md animate-reveal">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl mx-auto flex items-center justify-center text-3xl">🔗</div>
                    <h2 className="text-2xl font-bold text-gray-900 font-heading">Invalid Reset Link</h2>
                    <p className="text-gray-500">This reset link is missing or invalid. Please request a new one.</p>
                    <Link to="/forgot-password" className="inline-block px-6 py-3 bg-[#2E7D32] text-white rounded-lg font-semibold text-sm hover:bg-[#1B5E20] transition-colors">
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    /* Success State */
    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-8">
                <div className="text-center space-y-6 max-w-md animate-reveal">
                    <div className="w-16 h-16 bg-[#E8F5E9] rounded-2xl mx-auto flex items-center justify-center text-3xl">✅</div>
                    <h2 className="text-2xl font-bold text-gray-900 font-heading">Password Reset!</h2>
                    <p className="text-gray-500">Your password has been updated successfully. Redirecting to sign in...</p>
                    <div className="flex justify-center gap-1">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="w-2 h-2 rounded-full bg-[#2E7D32] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* Main Form */
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white text-[#2C2C2C] font-sans overflow-hidden">
            {/* Left Panel */}
            <div className="hidden lg:flex flex-col justify-center items-center p-16 bg-[#F5F7F4] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8F5E9]/60 via-transparent to-[#FFF9C4]/20 pointer-events-none" />

                <div className="relative z-10 max-w-md w-full space-y-10 animate-reveal">
                    <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-[#2E7D32] rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900 font-heading">Cookify</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight font-heading">
                            Create a New<br />
                            <span className="text-[#2E7D32]">Password.</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed max-w-sm">
                            Choose a strong, unique password to secure your account.
                        </p>
                    </div>

                    {/* Tips */}
                    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm space-y-3">
                        <p className="text-xs font-semibold text-[#2E7D32]">Password Tips</p>
                        {[
                            'Use at least 8 characters',
                            'Mix uppercase & lowercase letters',
                            'Include numbers and symbols',
                            'Avoid common dictionary words',
                        ].map((tip, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                                <svg className="w-4 h-4 text-[#2E7D32] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-sm text-gray-600">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-8 left-16 text-xs text-gray-300">© 2026 Cookify</div>
            </div>

            {/* Right Panel */}
            <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
                <div className="w-full max-w-md space-y-8 animate-reveal">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900 font-heading">Reset Password</h2>
                        <p className="text-gray-500">Your new password must be at least 6 characters.</p>
                    </div>

                    {errors.form && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-red-700">{errors.form}</p>
                                <Link to="/forgot-password" className="text-xs text-red-500 font-medium underline mt-1 inline-block">
                                    Request a new link →
                                </Link>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pr-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 ${errors.password ? 'border-red-400' : ''}`}
                                    placeholder="••••••••"
                                />
                                <EyeToggle show={showPassword} onToggle={() => setShowPassword(v => !v)} />
                            </div>
                            {/* Strength bar */}
                            {formData.password && (
                                <div className="space-y-1 pt-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength.score >= i ? strength.color : 'bg-gray-100'}`} />
                                        ))}
                                    </div>
                                    {strength.label && (
                                        <p className={`text-xs font-medium ${strength.score <= 1 ? 'text-red-500' : strength.score === 2 ? 'text-orange-500' : strength.score === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {strength.label}
                                        </p>
                                    )}
                                </div>
                            )}
                            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pr-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 ${errors.confirmPassword ? 'border-red-400' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-400' : ''}`}
                                    placeholder="••••••••"
                                />
                                <EyeToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(v => !v)} />
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
                        </div>

                        <Button type="submit" disabled={isLoading} variant="primary" className="w-full py-3.5">
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Resetting...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Save New Password</span>
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Remember your password?{' '}
                            <Link to="/signin" className="font-semibold text-[#2E7D32] hover:text-[#1B5E20] transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
