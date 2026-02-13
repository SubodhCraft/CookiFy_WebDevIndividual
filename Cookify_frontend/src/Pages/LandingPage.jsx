import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 80);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLoginClick = () => navigate('/signin');
    const handleRegisterClick = () => navigate('/signup');

    const features = [
        {
            number: '01',
            title: 'Curated Collection',
            description: 'Access over 50,000 professionally tested recipes from award-winning chefs and culinary experts worldwide.'
        },
        {
            number: '02',
            title: 'Personalized Experience',
            description: 'AI-powered recommendations tailored to your dietary preferences, skill level, and available ingredients.'
        },
        {
            number: '03',
            title: 'Step-by-Step Guidance',
            description: 'Detailed instructions with video tutorials, timing guides, and pro tips for flawless execution.'
        },
        {
            number: '04',
            title: 'Community & Sharing',
            description: 'Connect with passionate food lovers, share your creations, and discover trending recipes.'
        }
    ];

    const categories = [
        { name: 'Italian', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&h=400&fit=crop', count: '2,400+ recipes' },
        { name: 'Asian Fusion', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop', count: '3,100+ recipes' },
        { name: 'French Cuisine', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop', count: '1,800+ recipes' },
        { name: 'Mediterranean', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop', count: '2,200+ recipes' }
    ];

    const testimonials = [
        {
            quote: "CookiFy has completely transformed how I approach cooking. The quality of recipes and attention to detail is unmatched.",
            author: "Alexandra Chen",
            role: "Culinary Director, The Modern Kitchen",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face"
        },
        {
            quote: "As a professional chef, I'm impressed by the depth and authenticity of recipes. This is the gold standard for culinary platforms.",
            author: "Marcus Williams",
            role: "Executive Chef, Eleven Madison Park",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"
        },
        {
            quote: "The personalized recommendations have helped me discover cuisines I never knew I'd love. Absolutely brilliant platform.",
            author: "Sarah Mitchell",
            role: "Food Writer, Bon Appétit",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face"
        }
    ];

    const stats = [
        { value: '50K+', label: 'Curated Recipes' },
        { value: '150+', label: 'Countries' },
        { value: '500K+', label: 'Active Members' },
        { value: '4.9', label: 'App Store Rating' }
    ];

    return (
        <div className="min-h-screen bg-[#fafaf8]">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
                }`}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <a href="#" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#c9a66b]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold tracking-tight text-[#1a1a1a]">CookiFy</span>
                        </a>

                        <div className="hidden md:flex items-center gap-10">
                            <a href="#features" className="text-[#6b6b6b] hover:text-[#1a1a1a] text-sm font-medium transition-colors underline-hover">Features</a>
                            <a href="#recipes" className="text-[#6b6b6b] hover:text-[#1a1a1a] text-sm font-medium transition-colors underline-hover">Recipes</a>
                            <a href="#about" className="text-[#6b6b6b] hover:text-[#1a1a1a] text-sm font-medium transition-colors underline-hover">About</a>
                            <a href="#pricing" className="text-[#6b6b6b] hover:text-[#1a1a1a] text-sm font-medium transition-colors underline-hover">Pricing</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={handleLoginClick} className="text-sm font-medium text-[#1a1a1a] hover:text-[#c9a66b] transition-colors">
                                Sign In
                            </button>
                            <button onClick={handleRegisterClick} className="btn-primary px-5 py-2.5 text-sm font-medium rounded-lg">
                                <span>Get Started</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f0ebe3] to-transparent" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c9a66b]/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="animate-fade-up">
                            <p className="text-[#c9a66b] font-medium tracking-widest uppercase text-sm mb-6">
                                The Art of Cooking, Reimagined
                            </p>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-[1.1] text-[#1a1a1a] mb-8">
                                Where Culinary
                                <br />
                                <span className="italic">Excellence</span>
                                <br />
                                Meets Home
                            </h1>

                            <p className="text-lg text-[#6b6b6b] leading-relaxed max-w-lg mb-10">
                                Discover a refined collection of world-class recipes, curated by professional chefs and designed for the discerning home cook.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-12">
                                <button onClick={handleRegisterClick} className="btn-primary px-8 py-4 text-sm font-medium rounded-lg tracking-wide">
                                    <span>Start Your Journey</span>
                                </button>
                                <button className="btn-outline px-8 py-4 text-sm font-medium rounded-lg tracking-wide flex items-center gap-3">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Watch Video
                                </button>
                            </div>

                            <div className="flex items-center gap-8 pt-8 border-t border-[#e5e5e5]">
                                {stats.slice(0, 3).map((stat, index) => (
                                    <div key={index}>
                                        <p className="text-2xl font-semibold text-[#1a1a1a]">{stat.value}</p>
                                        <p className="text-xs text-[#a3a3a3] uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative hidden lg:block animate-fade-in delay-300">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-[#c9a66b]/10 rounded-3xl transform rotate-3" />
                                <img
                                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=750&fit=crop"
                                    alt="Elegant Cuisine"
                                    className="relative rounded-2xl shadow-2xl object-cover w-full h-[600px]"
                                />

                                <div className="absolute -left-8 bottom-24 bg-white p-6 rounded-xl shadow-xl max-w-xs animate-slide-left delay-500">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-[#c9a66b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#1a1a1a] text-sm">New Recipe Added</p>
                                            <p className="text-xs text-[#a3a3a3] mt-1">Pan-Seared Duck with Orange Glaze</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -right-6 top-20 bg-white p-5 rounded-xl shadow-xl animate-slide-right delay-400">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face" className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                                            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face" className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-[#1a1a1a]">12.5K cooking</p>
                                            <p className="text-xs text-[#a3a3a3]">right now</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands/Trust Section */}
            <section className="py-16 border-y border-[#e5e5e5]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <p className="text-center text-xs text-[#a3a3a3] uppercase tracking-widest mb-8">Trusted by culinary professionals worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-50">
                        {['Michelin Guide', 'Bon Appétit', 'Food & Wine', 'James Beard', 'Eater'].map((brand, i) => (
                            <span key={i} className="text-lg md:text-xl font-serif text-[#6b6b6b]">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="max-w-2xl mb-20">
                        <p className="text-[#c9a66b] font-medium tracking-widest uppercase text-sm mb-4">Why CookiFy</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#1a1a1a] leading-tight">
                            Designed for Those Who Appreciate the Finer Things
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                        {features.map((feature, index) => (
                            <div key={index} className="group">
                                <div className="flex items-start gap-6">
                                    <span className="text-4xl font-serif text-[#e5e5e5] group-hover:text-[#c9a66b] transition-colors">
                                        {feature.number}
                                    </span>
                                    <div className="pt-2">
                                        <h3 className="text-xl font-medium text-[#1a1a1a] mb-3">{feature.title}</h3>
                                        <p className="text-[#6b6b6b] leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories/Recipes Section */}
            <section id="recipes" className="py-24 lg:py-32 bg-[#1a1a1a]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                        <div>
                            <p className="text-[#c9a66b] font-medium tracking-widest uppercase text-sm mb-4">Explore Cuisines</p>
                            <h2 className="text-4xl md:text-5xl font-serif font-medium text-white leading-tight">
                                A World of Flavors<br />at Your Fingertips
                            </h2>
                        </div>
                        <button className="btn-accent px-6 py-3 text-sm font-medium rounded-lg self-start md:self-auto">
                            View All Categories
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="image-overlay rounded-xl overflow-hidden mb-4">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute bottom-4 left-4 right-4 z-10">
                                        <h3 className="text-xl font-medium text-white mb-1">{category.name}</h3>
                                        <p className="text-sm text-white/70">{category.count}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="about" className="py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-[#c9a66b] font-medium tracking-widest uppercase text-sm mb-4">Testimonials</p>
                            <h2 className="text-4xl md:text-5xl font-serif font-medium text-[#1a1a1a] leading-tight mb-8">
                                What Culinary<br />Experts Are Saying
                            </h2>

                            <div className="relative min-h-[200px]">
                                {testimonials.map((testimonial, index) => (
                                    <div
                                        key={index}
                                        className={`transition-all duration-500 ${index === currentTestimonial
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-4 absolute inset-0'
                                            }`}
                                    >
                                        <blockquote className="text-xl md:text-2xl text-[#2d2d2d] font-light leading-relaxed mb-8 font-serif italic">
                                            "{testimonial.quote}"
                                        </blockquote>
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.author}
                                                className="w-14 h-14 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-[#1a1a1a]">{testimonial.author}</p>
                                                <p className="text-sm text-[#a3a3a3]">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2 mt-8">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentTestimonial(index)}
                                        className={`w-12 h-1 rounded-full transition-all ${index === currentTestimonial ? 'bg-[#c9a66b]' : 'bg-[#e5e5e5]'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="grid grid-cols-2 gap-4">
                                <img
                                    src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=500&fit=crop"
                                    alt="Cooking"
                                    className="rounded-xl object-cover h-64 w-full"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=500&fit=crop"
                                    alt="Chef"
                                    className="rounded-xl object-cover h-64 w-full mt-12"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=500&fit=crop"
                                    alt="Ingredients"
                                    className="rounded-xl object-cover h-64 w-full -mt-8"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=500&fit=crop"
                                    alt="Plating"
                                    className="rounded-xl object-cover h-64 w-full mt-4"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 lg:py-32 bg-[#f5f3ef]">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-[#1a1a1a] leading-tight mb-8">
                        Ready to Elevate<br />Your Cooking?
                    </h2>
                    <p className="text-lg text-[#6b6b6b] max-w-2xl mx-auto mb-12">
                        Join over 500,000 culinary enthusiasts who have transformed their home cooking with CookiFy. Start your free trial today.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={handleRegisterClick} className="btn-primary px-10 py-4 text-sm font-medium rounded-lg tracking-wide">
                            <span>Create Free Account</span>
                        </button>
                        <button onClick={handleLoginClick} className="btn-outline px-10 py-4 text-sm font-medium rounded-lg tracking-wide">
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-[#1a1a1a]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-[#2d2d2d] rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#c9a66b]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                    </svg>
                                </div>
                                <span className="text-xl font-semibold text-white">CookiFy</span>
                            </div>
                            <p className="text-[#a3a3a3] leading-relaxed max-w-sm mb-8">
                                Elevating home cooking through curated recipes, expert guidance, and a passionate global community.
                            </p>
                            <div className="flex gap-4">
                                {['Twitter', 'Instagram', 'YouTube', 'Pinterest'].map((social, i) => (
                                    <a key={i} href="#" className="w-10 h-10 bg-[#2d2d2d] rounded-lg flex items-center justify-center text-[#a3a3a3] hover:text-[#c9a66b] hover:bg-[#3d3d3d] transition-colors text-xs">
                                        {social[0]}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {[
                            { title: 'Product', links: ['Features', 'Recipes', 'Meal Plans', 'Mobile App'] },
                            { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
                            { title: 'Legal', links: ['Terms', 'Privacy', 'Cookies', 'Licenses'] }
                        ].map((column, i) => (
                            <div key={i}>
                                <h4 className="text-white font-medium mb-6">{column.title}</h4>
                                <ul className="space-y-4">
                                    {column.links.map((link, j) => (
                                        <li key={j}>
                                            <a href="#" className="text-[#a3a3a3] hover:text-white transition-colors text-sm">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-[#2d2d2d] flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[#6b6b6b] text-sm">© 2024 CookiFy. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-[#6b6b6b] hover:text-white transition-colors text-sm">Terms of Service</a>
                            <a href="#" className="text-[#6b6b6b] hover:text-white transition-colors text-sm">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
