import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 py-10">
            <div className="page-container">
                <div className="w-full glass-card flex items-center justify-between px-12 py-5 border-slate-200/50 bg-white/80 shadow-2xl backdrop-blur-xl rounded-[28px] gap-12">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-6 group">
                        <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-emerald-600 transition-all transition-colors duration-500">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">COOKIFY</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-12">
                        {['Features', 'Recipes', 'Labs', 'Pricing'].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black text-slate-400 hover:text-emerald-600 transition-colors tracking-[0.2em] uppercase">
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Auth Actions */}
                    <div className="flex items-center gap-10">
                        <Link to="/signin" className="text-xs font-black text-slate-500 hover:text-slate-900 transition-colors tracking-widest uppercase">
                            Sign In
                        </Link>
                        <Button
                            onClick={() => navigate('/signup')}
                            variant="secondary"
                            size="md"
                            className="shadow-xl shadow-slate-900/10"
                        >
                            Join Now
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
