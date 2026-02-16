import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isLanding = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Recipes', href: '#recipes' },
        { name: 'About', href: '#about' },
        { name: 'Pricing', href: '#pricing' },
    ];

    const handleNavigation = (href) => {
        setIsMobileMenuOpen(false);
        if (!isLanding) {
            navigate('/');
            // Small timeout to allow navigation before scrolling
            setTimeout(() => {
                const element = document.querySelector(href);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.querySelector(href);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isLanding ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                        </div>
                        <span className={`text-xl font-bond font-serif tracking-tight ${isScrolled || !isLanding ? 'text-secondary' : 'text-secondary'}`}>
                            CookiFy
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavigation(link.href)}
                                className="text-secondary-light hover:text-primary text-sm font-medium transition-colors"
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/signin"
                            className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-5 py-2.5 bg-secondary text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-secondary"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-neutral-100 shadow-lg py-4 px-6 animate-fade-in">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavigation(link.href)}
                                className="text-left text-secondary-light hover:text-primary font-medium py-2"
                            >
                                {link.name}
                            </button>
                        ))}
                        <div className="h-px bg-neutral-100 my-2" />
                        <Link
                            to="/signin"
                            className="text-center text-secondary font-medium py-2 hover:text-primary"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="text-center bg-secondary text-white font-medium py-3 rounded-lg hover:bg-black"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
