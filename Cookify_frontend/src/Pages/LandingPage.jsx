import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import landingService from '../services/landingService';
import Button from '../components/common/Button';

const LandingPage = () => {
    const navigate = useNavigate();
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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-100 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-t-4 border-emerald-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50/50">
                <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-emerald-500/[0.03] to-transparent pointer-events-none" />
                <div className="container-max grid lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div className="space-y-12 animate-reveal">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {data.heroContent?.subtitle || 'Culinary Freshness Defined'}
                        </div>

                        <h1 className="text-hero">
                            Taste the <br />
                            <span className="text-gradient">Difference.</span>
                        </h1>

                        <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
                            {data.heroContent?.description || 'Discover thousands of organic recipes, connect with local growers, and elevate your home cooking with Cookify.'}
                        </p>

                        <div className="flex flex-wrap gap-5 pt-4">
                            <Button onClick={() => navigate('/signup')} variant="secondary" size="lg" className="shadow-2xl shadow-slate-900/20">
                                Join the Kitchen
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => navigate('/signin')}>
                                Member Portal
                            </Button>
                        </div>

                        <div className="flex items-center gap-12 pt-12 border-t border-slate-200">
                            {data.stats?.slice(0, 3).map((s, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-3xl font-black text-slate-900 tracking-tight">{s.value}</div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative group hidden lg:block animate-reveal delay-200">
                        <div className="relative rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(15,23,42,0.15)] bg-white p-4">
                            <img
                                src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1200&h=800&auto=format&fit=crop"
                                className="rounded-[32px] w-full h-[600px] object-cover transition-transform duration-1000 group-hover:scale-105"
                                alt="Chef work"
                            />
                            <div className="absolute top-12 right-12 p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 space-y-1 animate-float">
                                <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Fresh Pick</div>
                                <div className="text-lg font-bold text-slate-900 tracking-tight">Salmon & Greens</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Spotlight */}
            <section className="py-32 bg-white">
                <div className="container-max space-y-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="space-y-4">
                            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter">Harvest <span className="text-emerald-500">Vaults</span></h2>
                            <p className="text-slate-500 font-medium text-xl">Curated collections for every palate and preference.</p>
                        </div>
                        <Button variant="outline" size="md">View All Collections</Button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {data.categories?.map((cat, i) => (
                            <div key={i} className="group relative rounded-[32px] overflow-hidden aspect-[4/5] cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-slate-50">
                                <img
                                    src={cat.image}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={cat.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-8 left-8 right-8 space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                    <h3 className="text-2xl font-bold text-white tracking-tight">{cat.name}</h3>
                                    <p className="text-xs text-emerald-400 font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all delay-100">{cat.count} Recipes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-32 px-6 bg-slate-50">
                <div className="container-max max-w-5xl bg-slate-900 rounded-[48px] p-16 lg:p-24 text-center space-y-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-emerald-500/10 blur-[100px]" />
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg border border-emerald-500/20 relative z-10">🍋</div>
                    <div className="space-y-6 relative z-10">
                        <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">Ready for a fresh start?</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">Join our global community and start cooking with intent today.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-5 relative z-10">
                        <Button onClick={() => navigate('/signup')} size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-12">Get Started Now</Button>
                        <Button variant="ghost" size="lg" className="text-slate-400 hover:text-white" onClick={() => navigate('/signin')}>Member Portal</Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
