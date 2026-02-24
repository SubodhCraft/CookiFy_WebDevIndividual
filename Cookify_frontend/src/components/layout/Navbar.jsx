import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-[#2E7D32] rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 font-heading">Cookify</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {['Features', 'Recipes', 'About'].map(item => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-500 hover:text-[#2E7D32] transition-colors">
                            {item}
                        </a>
                    ))}
                </div>

                {/* Auth Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
                        Sign In
                    </Link>
                    <Button onClick={() => navigate('/signup')} variant="primary" size="sm">
                        Get Started
                    </Button>
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 animate-fade-in">
                    {['Features', 'Recipes', 'About'].map(item => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm font-medium text-gray-600 py-2">
                            {item}
                        </a>
                    ))}
                    <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                        <Link to="/signin" className="text-sm font-medium text-gray-600 py-2">Sign In</Link>
                        <Button onClick={() => navigate('/signup')} variant="primary" size="sm" className="w-full">
                            Get Started
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
