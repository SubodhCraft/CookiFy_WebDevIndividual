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
        <div className="min-h-screen grid lg:grid-cols-2 bg-white text-slate-900 font-sans overflow-hidden">
            {/* Left Narrative Column */}
            <div className="hidden lg:flex flex-col justify-center items-center p-24 bg-slate-50 border-r border-slate-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

                <div className="relative z-10 max-w-lg w-full space-y-16 animate-reveal">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl group-hover:bg-emerald-600 transition-colors">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-3xl font-extrabold tracking-tighter text-slate-900">Cookify</span>
                    </div>

                    <div className="space-y-8">
                        <h1 className="text-8xl font-black leading-[0.9] tracking-tighter text-slate-900">
                            Lost Your <br />
                            <span className="text-emerald-600">Access?</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
                            It happens to the best chefs. Enter your email and we'll get you back in.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-6 pt-8">
                        {[
                            { step: '01', label: 'Identify your account' },
                            { step: '02', label: 'Check your digital mailbox' },
                            { step: '03', label: 'Secure your kitchen' },
                        ].map(({ step, label }) => (
                            <div key={step} className="flex items-center gap-6 group/step">
                                <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center shrink-0 shadow-sm group-hover/step:border-emerald-500 transition-colors">
                                    <span className="text-[10px] font-black text-slate-400 group-hover/step:text-emerald-600 tracking-widest uppercase">{step}</span>
                                </div>
                                <p className="text-slate-600 font-semibold text-lg">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-12 left-24 text-[10px] text-slate-300 font-black tracking-[0.3em] uppercase">
                    © 2026 Cookify System
                </div>
            </div>

            {/* Right Auth Column */}
            <div className="flex items-center justify-center p-12 lg:p-24 relative overflow-y-auto w-full bg-white">
                <div className="w-full max-w-md mx-auto space-y-12 animate-reveal delay-100">

                    {isSent ? (
                        /* Success State */
                        <div className="text-center space-y-10">
                            <div className="relative mx-auto w-32 h-32">
                                <div className="relative w-32 h-32 bg-emerald-50 rounded-[40px] border border-emerald-100 flex items-center justify-center text-6xl shadow-inner">
                                    {devResetLink ? '🛠️' : '📬'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                                    {devResetLink ? 'Dev Protocol' : 'Signal Sent'}
                                </h2>
                                {devResetLink ? (
                                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                        Email subsystem bypassed in dev mode.
                                    </p>
                                ) : (
                                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                        A reset link has been dispatched to <br />
                                        <span className="font-bold text-emerald-600">{email}</span>
                                    </p>
                                )}
                            </div>

                            {devResetLink && (
                                <div className="text-left p-6 bg-amber-50 border border-amber-200 rounded-2xl space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Dev Test Token</p>
                                    <p className="text-xs text-amber-700 font-mono break-all">{devResetLink}</p>
                                    <a
                                        href={devResetLink}
                                        className="inline-block w-full text-center py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                                    >
                                        Execute Reset →
                                    </a>
                                </div>
                            )}

                            <div className="space-y-4 pt-4">
                                <button
                                    onClick={() => { setIsSent(false); setDevResetLink(null); }}
                                    className="w-full py-5 border-2 border-slate-100 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                                >
                                    {devResetLink ? 'Initiate New Request' : 'Resend Signal'}
                                </button>
                                <Link
                                    to="/signin"
                                    className="block w-full py-5 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest text-center hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
                                >
                                    Return to Portal
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Form State */
                        <>
                            <div className="space-y-4">
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Identity Recovery</h2>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed">Enter your email and we'll send you a recovery link.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    error={error}
                                    placeholder="chef@domain.com"
                                />

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    variant="secondary"
                                    className="w-full py-5 text-lg shadow-xl shadow-slate-900/10"
                                >
                                    {isLoading ? 'Dispatching...' : 'Send Recovery Link'}
                                </Button>
                            </form>

                            <div className="text-center pt-8 border-t border-slate-100">
                                <p className="text-slate-500 font-semibold text-sm">
                                    Remembered? {' '}
                                    <Link to="/signin" className="text-emerald-600 hover:text-emerald-700 transition-colors underline underline-offset-8 decoration-emerald-500/30">
                                        Back to Portal
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
