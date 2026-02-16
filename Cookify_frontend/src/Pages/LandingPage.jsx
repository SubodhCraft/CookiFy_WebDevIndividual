import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import landingService from '../services/landingService';

const LandingPage = () => {
    const navigate = useNavigate();
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [data, setData] = useState({
        testimonials: [],
        features: [],
        categories: [],
        stats: [],
        heroContent: {}
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await landingService.getLandingData();
                if (response.success && response.data) {
                    setData(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch landing data:', err);
                setError('Failed to load content');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.testimonials.length > 0) {
            const interval = setInterval(() => {
                setCurrentTestimonial((prev) => (prev + 1) % data.testimonials.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [data.testimonials.length]);

    const handleRegisterClick = () => navigate('/signup');

    if (isLoading) {
        return (
            <div className="min-h-screen bg-accent flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Fallback data or empty arrays if API fails, to prevent crash, 
    // but ideally we show error or fallback.
    // Here using optional chaining in render or providing default empty arrays in state.
    const { testimonials, features, categories, stats, heroContent } = data;

    return (
        <div className="min-h-screen bg-accent text-secondary selection:bg-primary-light selection:text-secondary">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neutral-200 to-transparent opacity-40" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="animate-fade-up max-w-xl">
                            <p className="text-primary-dark font-medium tracking-widest uppercase text-sm mb-6 flex items-center gap-3">
                                <span className="w-8 h-px bg-primary-dark"></span>
                                {heroContent?.subtitle || 'The Art of Cooking, Reimagined'}
                            </p>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-[1.1] text-secondary mb-8">
                                Where Culinary
                                <br />
                                <span className="italic text-primary font-light">Excellence</span>
                                <br />
                                Meets Home
                            </h1>

                            <p className="text-lg text-neutral-600 leading-relaxed max-w-lg mb-10">
                                {heroContent?.description || 'Discover a refined collection of world-class recipes, curated by professional chefs and designed for the discerning home cook.'}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-12">
                                <button onClick={handleRegisterClick} className="btn-primary px-8 py-4 text-sm font-medium rounded-lg tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                                    <span>Start Your Journey</span>
                                </button>
                                <button className="btn-outline px-8 py-4 text-sm font-medium rounded-lg tracking-wide flex items-center gap-3 group">
                                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    Watch Video
                                </button>
                            </div>

                            <div className="flex items-center gap-8 pt-8 border-t border-neutral-200">
                                {stats?.slice(0, 3).map((stat, index) => (
                                    <div key={index} className="group cursor-default">
                                        <p className="text-2xl font-serif font-semibold text-secondary group-hover:text-primary transition-colors">{stat.value}</p>
                                        <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative hidden lg:block animate-fade-in delay-300">
                            <div className="relative z-10">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2rem] transform rotate-3 blur-sm" />
                                <img
                                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=1000&fit=crop"
                                    alt="Elegant Cuisine"
                                    className="relative rounded-[1.5rem] shadow-2xl object-cover w-full h-[650px] transform hover:scale-[1.01] transition-transform duration-700"
                                />

                                <div className="absolute -left-12 bottom-24 bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-xl max-w-xs animate-slide-left delay-500 border border-white/40">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-secondary text-sm">New Recipe Added</p>
                                            <p className="text-xs text-neutral-500 mt-1">Pan-Seared Duck with Orange Glaze</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -right-8 top-20 bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-xl animate-slide-right delay-400 border border-white/40">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-3">
                                            {[
                                                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                                                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                                                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'
                                            ].map((src, i) => (
                                                <img key={i} src={src} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                                            ))}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-secondary">12.5K+ users</p>
                                            <p className="text-[10px] text-neutral-500 font-medium">cooking right now</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands/Trust Section */}
            <section className="py-12 border-y border-neutral-200 bg-white/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <p className="text-center text-xs text-neutral-400 uppercase tracking-widest mb-8 font-medium">Trusted by culinary professionals worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Michelin Guide', 'Bon Appétit', 'Food & Wine', 'James Beard', 'Eater'].map((brand, i) => (
                            <span key={i} className="text-xl md:text-2xl font-serif text-secondary hover:text-primary cursor-default">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 lg:py-32 bg-accent">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="max-w-2xl mb-20">
                        <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">Why CookiFy</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-secondary leading-tight">
                            Designed for Those Who Appreciate the Finer Things
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
                        {features?.map((feature, index) => (
                            <div key={index} className="group hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex items-start gap-6">
                                    <span className="text-5xl font-serif text-neutral-200 group-hover:text-primary transition-colors duration-300">
                                        {feature.number}
                                    </span>
                                    <div className="pt-3">
                                        <h3 className="text-xl font-medium text-secondary mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                                        <p className="text-neutral-500 leading-relaxed max-w-sm">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories/Recipes Section */}
            <section id="recipes" className="py-24 lg:py-32 bg-secondary text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                        <div>
                            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">Explore Cuisines</p>
                            <h2 className="text-4xl md:text-5xl font-serif font-medium leading-tight">
                                A World of Flavors<br />at Your Fingertips
                            </h2>
                        </div>
                        <button className="btn-accent px-8 py-3 text-sm font-medium rounded-lg self-start md:self-auto hover:scale-105 transition-transform">
                            View All Categories
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories?.map((category, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="image-overlay rounded-xl overflow-hidden mb-4 relative h-80">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-6 left-6 right-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-2xl font-serif font-medium text-white mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                                        <p className="text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">{category.count}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="about" className="py-24 lg:py-32 bg-accent overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-4">Testimonials</p>
                            <h2 className="text-4xl md:text-5xl font-serif font-medium text-secondary leading-tight mb-12">
                                What Culinary<br />Experts Are Saying
                            </h2>

                            <div className="relative min-h-[250px]">
                                {testimonials?.map((testimonial, index) => (
                                    <div
                                        key={index}
                                        className={`transition-all duration-700 absolute inset-0 ${index === currentTestimonial
                                            ? 'opacity-100 translate-x-0'
                                            : 'opacity-0 translate-x-10 pointer-events-none'
                                            }`}
                                    >
                                        <svg className="w-10 h-10 text-primary/20 mb-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C9.00012 13.1784 11.3696 11.054 14.1802 11.0062C14.6503 10.9981 15 10.603 15 10.134V7.93083C15 7.43398 14.5976 7.03152 14.1008 7.03966C9.75887 7.11113 6.00012 10.5973 6.00012 15.0001C6.00012 18.0001 6.00012 21 6.00012 21H14.017ZM22.017 21L22.017 18C22.017 16.8954 21.1216 16 20.017 16H17C17.0001 13.1784 19.3696 11.054 22.1802 11.0062C22.6503 10.9981 23 10.603 23 10.134V7.93083C23 7.43398 22.5976 7.03152 22.1008 7.03966C17.7589 7.11113 14.0001 10.5973 14.0001 15.0001C14.0001 18.0001 14.0001 21 14.0001 21H22.017Z" />
                                        </svg>
                                        <blockquote className="text-2xl md:text-3xl text-secondary font-serif font-light leading-relaxed mb-8 italic">
                                            "{testimonial.quote}"
                                        </blockquote>
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-full p-1 border border-primary/30">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.author}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-secondary text-lg">{testimonial.author}</p>
                                                <p className="text-sm text-neutral-500">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 mt-12">
                                {testimonials?.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentTestimonial(index)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'w-12 bg-primary' : 'w-6 bg-neutral-300 hover:bg-neutral-400'
                                            }`}
                                        aria-label={`View testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <img
                                        src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=500&fit=crop"
                                        alt="Cooking"
                                        className="rounded-2xl object-cover h-64 w-full shadow-lg transform hover:scale-105 transition-transform duration-500"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=500&fit=crop"
                                        alt="Chef"
                                        className="rounded-2xl object-cover h-80 w-full shadow-lg transform hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=500&fit=crop"
                                        alt="Ingredients"
                                        className="rounded-2xl object-cover h-80 w-full shadow-lg transform hover:scale-105 transition-transform duration-500"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=500&fit=crop"
                                        alt="Plating"
                                        className="rounded-2xl object-cover h-64 w-full shadow-lg transform hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 lg:py-32 bg-white relative">
                <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(#c9a66b_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
                    <div className="w-16 h-1 bg-primary mx-auto mb-8"></div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-secondary leading-tight mb-8">
                        Ready to Elevate<br />Your Cooking?
                    </h2>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-12 font-light">
                        Join over 500,000 culinary enthusiasts who have transformed their home cooking with CookiFy.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <button onClick={handleRegisterClick} className="btn-primary px-10 py-4 text-base font-medium rounded-lg tracking-wide shadow-xl hover:-translate-y-1 transition-transform">
                            <span>Create Free Account</span>
                        </button>
                        <button onClick={() => navigate('/signin')} className="btn-outline px-10 py-4 text-base font-medium rounded-lg tracking-wide">
                            Sign In
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
