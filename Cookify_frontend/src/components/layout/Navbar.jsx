
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-[1440px] mx-auto glass-card flex items-center justify-between px-8 py-3.5 border-white/5 bg-white/[0.03] shadow-2xl">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-white">COOKIFY</span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-10">
                    {['Features', 'Recipes', 'Labs', 'Pricing'].map(item => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-widest uppercase">
                            {item}
                        </a>
                    ))}
                </div>

                {/* Auth Actions */}
                <div className="flex items-center gap-4">
                    <Link to="/signin" className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-wide">
                        Sign In
                    </Link>
                    <Link
                        to="/signup"
                        className="px-6 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                    >
                        Join Now
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
