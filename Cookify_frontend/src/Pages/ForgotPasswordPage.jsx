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
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E7D32]/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                <div className="relative z-10 max-w-sm w-full space-y-12 animate-reveal">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <img src="/Cookify.png" alt="Cookify Logo" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-2xl font-bold text-gray-900 font-heading tracking-tight">Cookify</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-6xl font-extrabold text-gray-900 leading-[1.1] font-heading">
                            Forgot Your<br />
                            <span className="text-[#2E7D32]">Password?</span>
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed font-medium">
                            No worries — it happens to the best of us. We'll help you get back into your kitchen.
                        </p>
                    </div>

                    {/* Simple steps */}
                    <div className="space-y-4 pt-8 border-t border-gray-200/60">
                        {[
                            { step: '1', label: 'Enter your account email' },
                            { step: '2', label: 'Click link in your inbox' },
                            { step: '3', label: 'Set your new password' },
                        ].map(({ step, label }) => (
                            <div key={step} className="flex items-center gap-4 group/step">
                                <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover/step:border-[#2E7D32] transition-colors">
                                    <span className="text-xs font-bold text-gray-400 group-hover/step:text-[#2E7D32]">{step}</span>
                                </div>
                                <p className="text-sm text-gray-600 font-semibold">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-10 left-16 text-xs text-gray-400 font-medium tracking-widest uppercase italic">
                    © 2026 Cookify — Culinary Excellence
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
                <div className="w-full max-w-md space-y-10 animate-reveal">
                    {isSent ? (
                        <div className="text-center space-y-8 p-10 bg-[#FAFAFA] rounded-[32px] border border-gray-100 shadow-sm">
                            <div className="w-24 h-24 bg-[#E8F5E9] rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-inner animate-bounce">
                                {devResetLink ? '🛠️' : '📬'}
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold text-gray-900 font-heading tracking-tight">
                                    {devResetLink ? 'Development Mode' : 'Check Your Inbox'}
                                </h2>
                                <p className="text-gray-500 text-lg">
                                    {devResetLink
                                        ? 'Email service bypassed for development.'
                                        : `We've sent a recovery link to ${email}`}
                                </p>
                            </div>

                            {devResetLink && (
                                <div className="text-left p-6 bg-amber-50 border border-amber-200 rounded-2xl space-y-4">
                                    <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Dev Access Link</p>
                                    <p className="text-xs text-amber-800 font-mono break-all bg-white/50 p-2 rounded-lg">{devResetLink}</p>
                                    <a href={devResetLink} className="block w-full text-center py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:scale-[1.02] transition-all active:scale-[0.98]">
                                        Proceed to Reset →
                                    </a>
                                </div>
                            )}

                            <div className="space-y-4 pt-4">
                                <button
                                    onClick={() => { setIsSent(false); setDevResetLink(null); }}
                                    className="w-full py-4 border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-white hover:border-gray-200 transition-all"
                                >
                                    {devResetLink ? 'Try Another Email' : 'Resend Email'}
                                </button>
                                <Link
                                    to="/signin"
                                    className="block w-full py-4 bg-[#2E7D32] text-white rounded-2xl font-bold text-sm text-center shadow-xl shadow-green-900/10 hover:shadow-green-900/20 transition-all"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="lg:hidden flex items-center gap-2.5 mb-8" onClick={() => navigate('/')}>
                                <img src="/Cookify.png" alt="Cookify Logo" className="w-10 h-10 object-contain" />
                                <span className="text-xl font-bold text-gray-900 font-heading">Cookify</span>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-4xl font-bold text-gray-900 font-heading tracking-tight">Recover Password</h2>
                                <p className="text-gray-500 text-lg">Enter your email and we'll send you a recovery link.</p>
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

                                <Button type="submit" disabled={isLoading} variant="primary" className="w-full py-4 rounded-2xl shadow-xl shadow-green-900/10 hover:shadow-green-900/20 active:scale-[0.98] transition-all">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Sending link...</span>
                                        </div>
                                    ) : 'Send Recovery Link'}
                                </Button>
                            </form>

                            <div className="text-center pt-8 border-t border-gray-100">
                                <p className="text-gray-500 font-medium">
                                    Remembered your key?{' '}
                                    <Link to="/signin" className="font-bold text-[#2E7D32] hover:text-[#1B5E20] transition-colors underline decoration-2 underline-offset-4 decoration-green-100 hover:decoration-green-500">
                                        Sign In
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
