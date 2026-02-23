import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';

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
        const loadingToast = toast.loading('Dispatching reset signal...');
        try {
            const response = await authService.forgotPassword(email);
            if (response.success) {
                toast.success('Request processed!', { id: loadingToast });
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
                            Lost Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">Key?</span>
                        </h1>
                        <div className="w-20 h-2 bg-green-500 rounded-full" />
                        <p className="text-xl text-gray-500 font-medium leading-relaxed">
                            No worries! Enter your email and we'll send you a secure link to reclaim your culinary vault.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-6 pt-4">
                        {[
                            { step: '01', label: 'Enter your email address below' },
                            { step: '02', label: 'Check your inbox for the reset link' },
                            { step: '03', label: 'Create a new secure password' },
                        ].map(({ step, label }) => (
                            <div key={step} className="flex items-center gap-5">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-black text-green-600 tracking-widest uppercase">{step}</span>
                                </div>
                                <p className="text-gray-600 font-semibold">{label}</p>
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

                    {isSent ? (
                        /* Success State */
                        <div className="text-center space-y-8">
                            <div className="relative mx-auto w-28 h-28">
                                <div className="absolute inset-0 bg-green-500/10 rounded-[40px] blur-xl animate-pulse" />
                                <div className="relative w-28 h-28 bg-green-50 rounded-[40px] flex items-center justify-center text-5xl shadow-inner">
                                    {devResetLink ? '🛠️' : '📬'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                                    {devResetLink ? 'Dev Mode Active' : 'Link Dispatched!'}
                                </h2>
                                {devResetLink ? (
                                    <p className="text-gray-500 font-medium leading-relaxed">
                                        Email sending is not yet configured. Use the link below to test the reset flow:
                                    </p>
                                ) : (
                                    <p className="text-gray-500 font-medium leading-relaxed">
                                        A password reset link has been sent to{' '}
                                        <span className="font-black text-green-600">{email}</span>.<br />
                                        Check your inbox — the link expires in <strong>1 hour</strong>.
                                    </p>
                                )}
                            </div>

                            {/* Dev Mode Reset Link Banner */}
                            {devResetLink && (
                                <div className="text-left p-5 bg-amber-50 border border-amber-200/60 rounded-2xl space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">⚙️ Developer Reset Link</p>
                                    <p className="text-xs text-amber-700 font-medium break-all">{devResetLink}</p>
                                    <a
                                        href={devResetLink}
                                        className="inline-block w-full text-center py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                                    >
                                        Open Reset Page →
                                    </a>
                                    <p className="text-[10px] text-amber-600/70 font-bold">
                                        Add EMAIL_USER + EMAIL_PASS to backend .env to send real emails.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4 pt-2">
                                <button
                                    onClick={() => { setIsSent(false); setDevResetLink(null); }}
                                    className="w-full py-4 border-2 border-black/[0.06] rounded-2xl font-black text-sm uppercase tracking-widest text-gray-500 hover:border-green-500 hover:text-green-600 transition-all"
                                >
                                    {devResetLink ? 'Try Again' : 'Resend Email'}
                                </button>
                                <Link
                                    to="/signin"
                                    className="block w-full py-4 bg-green-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest text-center hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                                >
                                    Return to Sign In
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            <div className="space-y-3">
                                <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Forgot Password</h2>
                                <p className="text-gray-500 font-medium">Enter your email to receive a secure reset link.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3 group">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-green-600 transition-colors ml-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        className={`w-full bg-white border border-solid rounded-2xl px-6 py-4 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-gray-900 font-medium ${error ? 'border-red-400/60' : 'border-black/[0.05]'}`}
                                        placeholder="chef@cookify.com"
                                    />
                                    {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Sending Reset Link...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span>Send Reset Link</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="text-center pt-2">
                                <p className="text-gray-500 font-bold text-sm">
                                    Remembered it?{' '}
                                    <Link to="/signin" className="text-green-600 hover:text-green-700 transition-colors underline underline-offset-8 decoration-green-500/20">
                                        Back to Sign In
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
