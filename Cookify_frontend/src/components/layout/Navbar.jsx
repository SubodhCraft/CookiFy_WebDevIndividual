import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 py-8">
            <div className="page-container">
                <div className="w-full glass-card flex items-center justify-between px-8 py-4 border-black/5 bg-white/80 shadow-2xl backdrop-blur-xl">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-gray-900">COOKIFY</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-10">
                        {['Features', 'Recipes', 'Labs', 'Pricing'].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-bold text-gray-500 hover:text-green-500 transition-colors tracking-[0.2em] uppercase">
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Auth Actions */}
                    <div className="flex items-center gap-4">
                        <Link to="/signin" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors tracking-wide">
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-6 py-3 btn-brand text-sm font-bold active:scale-95"
                        >
                            Join Now
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
