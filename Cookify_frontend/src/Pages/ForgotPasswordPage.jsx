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

        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading('Sending reset link...');
        try {
            const response = await authService.forgotPassword(email);
            if (response.success) {
                toast.success('Done!', { id: loadingToast });
                if (response.devResetLink) {
                    setDevResetLink(response.devResetLink);
                }
                setIsSent(true);
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to send reset email. Please try again.';
            toast.error(message, { id: loadingToast });
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white text-gray-900 overflow-hidden font-sans">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex flex-col justify-center items-center p-20 relative bg-gray-50 overflow-hidden border-r border-black/[0.1]">
                <div className="relative z-10 max-w-lg w-full space-y-12">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-14 h-14 bg-green-600 rounded-none flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-3xl font-bold tracking-tighter text-gray-900 uppercase">Cookify</span>
                    </div>

                    <div className="space-y-8">
                        <h1 className="text-7xl font-bold leading-[1] text-gray-900 tracking-tight">
                            Lost Your<br />
                            <span className="text-green-600">Password?</span>
                        </h1>
                        <p className="text-2xl text-gray-500 font-medium leading-relaxed">
                            Don't worry. Enter your email and we'll send you a link to reset it.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-8 pt-6">
                        {[
                            { step: '01', label: 'Enter your email address' },
                            { step: '02', label: 'Check your Gmail inbox' },
                            { step: '03', label: 'Create a new password' },
                        ].map(({ step, label }) => (
                            <div key={step} className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-white border border-black rounded-none flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-gray-900 tracking-widest uppercase">{step}</span>
                                </div>
                                <p className="text-gray-600 font-bold text-lg">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-12 left-20 text-xs text-gray-400 tracking-widest font-bold uppercase">
                    © 2026 Cookify Inc
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex items-center justify-center p-12 lg:p-20 relative overflow-y-auto w-full">
                <div className="w-full max-w-md mx-auto space-y-16 animate-fade-in relative z-10">

                    {isSent ? (
                        /* Success State */
                        <div className="text-center space-y-12">
                            <div className="relative mx-auto w-32 h-32">
                                <div className="relative w-32 h-32 bg-green-50 rounded-none border border-green-200 flex items-center justify-center text-6xl shadow-inner">
                                    {devResetLink ? '🛠️' : '📬'}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-5xl font-bold text-gray-900 tracking-tight">
                                    {devResetLink ? 'Dev Mode' : 'Email Sent!'}
                                </h2>
                                {devResetLink ? (
                                    <p className="text-gray-500 font-medium text-lg leading-relaxed">
                                        Email is not set up yet. Use this link to test:
                                    </p>
                                ) : (
                                    <p className="text-gray-500 font-medium text-lg leading-relaxed">
                                        A reset link has been sent to{' '}
                                        <span className="font-bold text-green-600">{email}</span>.<br />
                                        Please check your inbox.
                                    </p>
                                )}
                            </div>

                            {/* Dev Mode Reset Link Banner */}
                            {devResetLink && (
                                <div className="text-left p-6 bg-amber-50 border border-amber-200 rounded-none space-y-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Local Test Link</p>
                                    <p className="text-sm text-amber-700 font-medium break-all">{devResetLink}</p>
                                    <a
                                        href={devResetLink}
                                        className="inline-block w-full text-center py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-none font-bold text-xs uppercase tracking-widest transition-all"
                                    >
                                        Open Reset Page →
                                    </a>
                                </div>
                            )}

                            <div className="space-y-6 pt-4">
                                <button
                                    onClick={() => { setIsSent(false); setDevResetLink(null); }}
                                    className="w-full py-5 border border-black rounded-none font-bold text-sm uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
                                >
                                    {devResetLink ? 'Try Again' : 'Resend Email'}
                                </button>
                                <Link
                                    to="/signin"
                                    className="block w-full py-5 bg-green-600 text-white rounded-none font-bold text-sm uppercase tracking-widest text-center hover:bg-green-700 transition-all shadow-lg"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            <div className="space-y-4">
                                <h2 className="text-6xl font-bold text-gray-900 tracking-tight">Forgot Password</h2>
                                <p className="text-gray-500 font-medium text-lg">Enter your email and we'll send you a link.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-12">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    error={error}
                                    placeholder="your@email.com"
                                />

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-6 text-xl"
                                >
                                    {isLoading ? 'Sending...' : 'Send Link'}
                                </Button>
                            </form>

                            <div className="text-center pt-6">
                                <p className="text-gray-500 font-bold text-base">
                                    Found it?{' '}
                                    <Link to="/signin" className="text-green-600 hover:text-green-700 transition-colors underline underline-offset-8 decoration-green-500/20">
                                        Back to Login
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
