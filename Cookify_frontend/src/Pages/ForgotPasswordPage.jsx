import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');
    const [devResetLink, setDevResetLink] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) { setError('Please enter your email address'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address'); return; }

        setIsLoading(true);
        const loadingToast = toast.loading('Sending reset link...');
        try {
            const response = await authService.forgotPassword(email);
            if (response.success) {
                toast.success('Reset link sent!', { id: loadingToast });
                if (response.devResetLink) setDevResetLink(response.devResetLink);
                setIsSent(true);
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to send reset email. Please try again.';
            toast.error(message, { id: loadingToast });
            setError(message);
        } finally { setIsLoading(false); }
    };

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
                            Forgot Your<br />
                            <span className="text-[#2E7D32]">Password?</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed max-w-sm">
                            No worries — it happens to the best of us. We'll help you get back in.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4 pt-6 border-t border-gray-200">
                        {[
                            { step: '1', label: 'Enter your email address' },
                            { step: '2', label: 'Check your inbox for the reset link' },
                            { step: '3', label: 'Create a new password' },
                        ].map(({ step, label }) => (
                            <div key={step} className="flex items-center gap-4 group/step">
                                <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover/step:border-[#2E7D32] transition-colors">
                                    <span className="text-xs font-bold text-gray-400 group-hover/step:text-[#2E7D32]">{step}</span>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-8 left-16 text-xs text-gray-300">© 2026 Cookify</div>
            </div>

            {/* Right Panel */}
            <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
                <div className="w-full max-w-md space-y-8 animate-reveal">
                    {isSent ? (
                        /* Success State */
                        <div className="text-center space-y-8">
                            <div className="w-20 h-20 bg-[#E8F5E9] rounded-2xl mx-auto flex items-center justify-center text-4xl">
                                {devResetLink ? '🛠️' : '📬'}
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-gray-900 font-heading">
                                    {devResetLink ? 'Dev Mode' : 'Check Your Email'}
                                </h2>
                                {devResetLink ? (
                                    <p className="text-gray-500">Email service bypassed in development mode.</p>
                                ) : (
                                    <p className="text-gray-500">
                                        We sent a reset link to <span className="font-semibold text-[#2E7D32]">{email}</span>
                                    </p>
                                )}
                            </div>

                            {devResetLink && (
                                <div className="text-left p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                                    <p className="text-xs font-semibold text-amber-600">Dev Reset Link</p>
                                    <p className="text-xs text-amber-700 font-mono break-all">{devResetLink}</p>
                                    <a
                                        href={devResetLink}
                                        className="inline-block w-full text-center py-3 bg-[#2C2C2C] text-white rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors"
                                    >
                                        Open Reset Page →
                                    </a>
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={() => { setIsSent(false); setDevResetLink(null); }}
                                    className="w-full py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all"
                                >
                                    {devResetLink ? 'Try Again' : 'Resend Email'}
                                </button>
                                <Link
                                    to="/signin"
                                    className="block w-full py-3 bg-[#2E7D32] text-white rounded-lg font-semibold text-sm text-center hover:bg-[#1B5E20] transition-colors"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            <div className="lg:hidden mb-4">
                                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                                    <div className="w-9 h-9 bg-[#2E7D32] rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900 font-heading">Cookify</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-gray-900 font-heading">Reset Password</h2>
                                <p className="text-gray-500">Enter your email and we'll send you a recovery link.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    error={error}
                                    placeholder="you@example.com"
                                />

                                <Button type="submit" disabled={isLoading} variant="primary" className="w-full py-3.5">
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Sending...</span>
                                        </div>
                                    ) : 'Send Reset Link'}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
