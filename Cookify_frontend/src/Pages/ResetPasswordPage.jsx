import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';

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

    useEffect(() => {
        if (!token) setTokenMissing(true);
    }, [token]);

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
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        const loadingToast = toast.loading('Encrypting your new password...');
        try {
            const response = await authService.resetPassword(token, formData.password);
            if (response.success) {
                toast.success('Password reset! Welcome back.', { id: loadingToast });
                setIsSuccess(true);
                setTimeout(() => navigate('/signin'), 3000);
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
            toast.error(message, { id: loadingToast });
            setErrors({ form: message });
        } finally {
            setIsLoading(false);
        }
    };

    /* ── Invalid / missing token ── */
    if (tokenMissing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-8">
                <div className="text-center space-y-8 max-w-md">
                    <div className="mx-auto w-28 h-28 bg-red-50 rounded-[40px] flex items-center justify-center text-5xl shadow-inner">🔗</div>
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Invalid Link</h2>
                        <p className="text-gray-500 font-medium">This reset link is missing or invalid. Please request a new one.</p>
                    </div>
                    <Link to="/forgot-password" className="inline-block px-10 py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    /* ── Success State ── */
    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-8">
                <div className="text-center space-y-8 max-w-md animate-fade-in">
                    <div className="relative mx-auto w-28 h-28">
                        <div className="absolute inset-0 bg-green-500/10 rounded-[40px] blur-xl animate-pulse" />
                        <div className="relative w-28 h-28 bg-green-50 rounded-[40px] flex items-center justify-center text-5xl shadow-inner">✅</div>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Vault Secured!</h2>
                        <p className="text-gray-500 font-medium">Your password has been updated successfully.<br />Redirecting you to Sign In...</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* ── Main Form ── */
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#fafaf9] text-gray-900 overflow-hidden font-sans">
            {/* Left Branding Panel */}
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
                            Create New<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">Password</span>
                        </h1>
                        <div className="w-20 h-2 bg-green-500 rounded-full" />
                        <p className="text-xl text-gray-500 font-medium leading-relaxed">
                            Choose a strong, unique password for your Cookify vault. Make it hard to guess!
                        </p>
                    </div>

                    {/* Tips */}
                    <div className="p-8 bg-green-50 rounded-[32px] space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-green-600">Password Tips</p>
                        {[
                            'Use at least 8 characters',
                            'Mix uppercase & lowercase letters',
                            'Include numbers and symbols',
                            'Avoid dictionary words',
                        ].map((tip, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-600 font-semibold">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-10 left-20 text-[10px] text-gray-400 tracking-[0.3em] font-black uppercase">
                    © 2026 Cookify Inc • Fresh Culinary Labs
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto w-full">
                <div className="w-full max-w-md mx-auto space-y-12 animate-fade-in relative z-10">
                    <div className="space-y-3">
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Reset Password</h2>
                        <p className="text-gray-500 font-medium">Your new password must be at least 6 characters.</p>
                    </div>

                    {errors.form && (
                        <div className="p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4">
                            <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-red-700">{errors.form}</p>
                                <Link to="/forgot-password" className="text-xs text-red-500 font-black uppercase tracking-widest underline underline-offset-4 mt-1 block">
                                    Request a new link →
                                </Link>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* New Password */}
                        <div className="space-y-3 group">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-green-600 transition-colors ml-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-white border border-solid rounded-2xl px-6 py-4 pr-14 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-gray-900 font-medium ${errors.password ? 'border-red-400/60' : 'border-black/[0.05]'}`}
                                    placeholder="••••••••••••"
                                />
                                <button type="button" onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
                                    {showPassword
                                        ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                            {/* Strength bar */}
                            {formData.password && (
                                <div className="space-y-1.5 px-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strength.score >= i ? strength.color : 'bg-gray-100'}`} />
                                        ))}
                                    </div>
                                    {strength.label && <p className={`text-[10px] font-black uppercase tracking-widest ${strength.score <= 1 ? 'text-red-500' : strength.score === 2 ? 'text-orange-500' : strength.score === 3 ? 'text-yellow-600' : 'text-green-600'}`}>{strength.label}</p>}
                                </div>
                            )}
                            {errors.password && <p className="text-xs text-red-500 font-bold ml-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-3 group">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-green-600 transition-colors ml-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full bg-white border border-solid rounded-2xl px-6 py-4 pr-14 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-gray-900 font-medium ${errors.confirmPassword ? 'border-red-400/60' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-400' : 'border-black/[0.05]'}`}
                                    placeholder="••••••••••••"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors">
                                    {showConfirmPassword
                                        ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <div className="absolute right-14 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-500 font-bold ml-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Securing Vault...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Save New Password</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <p className="text-gray-500 font-bold text-sm">
                            Remember your password?{' '}
                            <Link to="/signin" className="text-green-600 hover:text-green-700 transition-colors underline underline-offset-8 decoration-green-500/20">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
