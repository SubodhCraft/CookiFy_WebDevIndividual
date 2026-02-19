
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import landingService from '../services/landingService';
import Button from '../components/common/Button';

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await landingService.getLandingData();
                if (response.success && response.data) setData(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-indigo-500/20 rounded-full animate-ping" />
                    <div className="absolute inset-0 w-20 h-20 border-t-2 border-indigo-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-slate-200">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                {/* Visual Backdrop */}
                <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-indigo-900/20 via-transparent to-transparent z-0" />
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 items-center justify-items-center relative z-10">
                    <div className="space-y-10 animate-fade-up">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-[0.2em] uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            {data.heroContent?.subtitle || 'Culinary Excellence Reimagined'}
                        </div>

                        <h1 className="text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight">
                            Master the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-500">Art of Taste.</span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-light">
                            {data.heroContent?.description || 'Access a curated ecosystem of world-class recipes, AI-powered meal planning, and an elite community of culinary masters.'}
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <Button onClick={() => navigate('/signup')} className="px-10 py-5">
                                Start Your Journey
                            </Button>
                            <button className="flex items-center gap-4 group px-6 py-4 rounded-xl glass-card border-white/5 hover:bg-white/5 transition-all">
                                <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 text-indigo-400 ml-1" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                <span className="font-bold tracking-wide">Watch Masterclass</span>
                            </button>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5 max-w-md">
                            {data.stats?.slice(0, 3).map((s, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-2xl font-bold text-white">{s.value}</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hero Visual Card */}
                    <div className="relative hidden lg:block animate-fade-in delay-300">
                        <div className="relative z-10 p-4 glass-card border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                            <img
                                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&h=1200&fit=crop"
                                className="rounded-2xl w-full h-[650px] object-cover filter brightness-90 grayscale-[0.2]"
                                alt="Chef work"
                            />
                            {/* Overlay Card 1 */}
                            <div className="absolute -left-12 top-[20%] glass-card p-6 border-white/10 shadow-2xl animate-float">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-2xl">🔥</div>
                                    <div>
                                        <div className="text-sm font-bold text-white">Trending Now</div>
                                        <div className="text-[10px] text-slate-500 font-medium">Spicy Lobster Risotto</div>
                                    </div>
                                </div>
                            </div>
                            {/* Overlay Card 2 */}
                            <div className="absolute -right-8 bottom-[15%] glass-card p-6 border-white/10 shadow-2xl animate-float [animation-delay:1s]">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-9 h-9 rounded-full border-2 border-indigo-900 bg-slate-800 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="u" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-[11px] font-bold text-indigo-400">1.2k+ active labs</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Spotlight */}
            <section className="py-32 relative">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center justify-items-center">
                    <div className="space-y-6">
                        <div className="text-indigo-500 font-bold tracking-[0.3em] uppercase text-xs">Framework</div>
                        <h2 className="text-5xl font-bold text-white leading-tight">Professional tools for the modern cook.</h2>
                        <div className="grid sm:grid-cols-2 gap-8 pt-6">
                            {data.features?.map((f, i) => (
                                <div key={i} className="space-y-4 group">
                                    <div className="text-4xl font-serif italic text-indigo-500/30 group-hover:text-indigo-500 transition-colors">{f.number}</div>
                                    <h4 className="text-lg font-bold text-white">{f.title}</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="glass-card p-1 items-center justify-center flex overflow-hidden group">
                        <img
                            src="https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80"
                            className="rounded-3xl object-cover w-full h-[500px] transition-transform duration-700 group-hover:scale-110"
                            alt="Cooking"
                        />
                        <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-indigo-900/10 transition-colors" />
                    </div>
                </div>
            </section>

            {/* Interactive Grid (Categories) */}
            <section className="py-32 bg-indigo-500/5 border-y border-white/5">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 space-y-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-bold text-white tracking-tight">World Collections.</h2>
                            <p className="text-slate-500 font-medium">Explore curated recipe vaults from every continent.</p>
                        </div>
                        <Button variant="outline" className="h-fit">Explore All Archives</Button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.categories?.map((cat, i) => (
                            <div key={i} className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-2xl">
                                <img
                                    src={cat.image}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                                    alt={cat.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                <div className="absolute bottom-6 left-6 right-6 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                                    <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">{cat.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Glass Section */}
            <section className="py-40 relative px-6 overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/5 z-0" />
                <div className="max-w-5xl mx-auto glass-card p-20 text-center space-y-10 border-indigo-500/20 shadow-[0_0_100px_rgba(79,70,229,0.1)] relative z-10">
                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-2xl">⚡</div>
                    <h2 className="text-6xl font-bold text-white tracking-tight">Ready to elevate your game?</h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Join 500k+ users who are redefining what it means to cook at home.
                        No placeholders, just pure culinary mastery.
                    </p>
                    <div className="flex justify-center flex-wrap gap-6 pt-6">
                        <Button onClick={() => navigate('/signup')} className="px-14 py-6 text-lg">Join Exclusive Club</Button>
                        <Button variant="ghost" className="px-14 py-6 text-lg" onClick={() => navigate('/signin')}>Member Portal</Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
