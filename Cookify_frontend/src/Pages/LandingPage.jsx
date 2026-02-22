
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
        <div className="min-h-screen bg-[#fafaf9] text-gray-900 font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-green-500/5 to-transparent z-0" />
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-green-500/[0.03] rounded-full blur-[120px]" />

                <div className="page-container grid lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div className="space-y-12 animate-fade-up">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card border-green-500/20 text-green-700 text-[10px] font-bold tracking-[0.2em] uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            {data.heroContent?.subtitle || 'Culinary Freshness Defined'}
                        </div>

                        <h1 className="text-7xl lg:text-[100px] font-black leading-[0.95] tracking-tighter text-gray-900">
                            Taste the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">Difference.</span>
                        </h1>

                        <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
                            {data.heroContent?.description || 'Discover thousands of organic recipes, connect with local growers, and elevate your home cooking with Cookify.'}
                        </p>

                        <div className="flex flex-wrap gap-6 pt-6">
                            <Button onClick={() => navigate('/signup')} className="px-12 py-5 btn-brand text-lg">
                                Join the Fresh Club
                            </Button>
                            <button className="flex items-center gap-5 group px-8 py-5 rounded-2xl bg-white border border-gray-100 hover:border-green-500/30 hover:bg-green-50 transition-all font-bold shadow-sm">
                                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20">
                                    <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                <span className="text-gray-700">Watch Rituals</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-16 pt-16 border-t border-black/[0.05] max-w-sm">
                            {data.stats?.slice(0, 3).map((s, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="text-3xl font-black text-gray-900">{s.value}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative group hidden lg:block">
                        <div className="relative glass-card border-none overflow-hidden p-4 bg-white shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1200&h=800&auto=format&fit=crop"
                                className="rounded-2xl w-full h-[700px] object-cover"
                                alt="Chef work"
                            />
                            <div className="absolute top-10 right-10 p-6 glass-card bg-white shadow-xl border-none space-y-2 animate-float">
                                <div className="text-[10px] text-green-600 font-black uppercase tracking-widest">Fresh Pick</div>
                                <div className="text-lg font-bold">Salmon & Greens</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Spotlight */}
            <section className="py-40 bg-white">
                <div className="page-container space-y-24">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="space-y-4">
                            <h2 className="text-6xl font-black text-gray-900 tracking-tighter">Harvest <span className="text-green-500">Vaults</span></h2>
                            <p className="text-gray-500 font-medium text-xl">Curated collections for every palate and preference.</p>
                        </div>
                        <Button variant="outline" className="px-10 py-5 border-gray-200 text-gray-900 hover:border-green-500 hover:text-green-600 hover:bg-green-50">View All Vaults</Button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {data.categories?.map((cat, i) => (
                            <div key={i} className="group relative rounded-[48px] overflow-hidden aspect-[3/4] cursor-pointer shadow-xl bg-gray-50">
                                <img
                                    src={cat.image}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    alt={cat.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent group-hover:from-green-900/40 transition-colors" />
                                <div className="absolute bottom-10 left-10 right-10 space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-3xl font-bold text-white tracking-tight">{cat.name}</h3>
                                    <p className="text-xs text-green-300 font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">{cat.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-40 px-6">
                <div className="page-container glass-card p-24 text-center space-y-12 border-none bg-white shadow-2xl">
                    <div className="w-24 h-24 bg-orange-100 rounded-[32px] mx-auto flex items-center justify-center text-4xl shadow-lg">🍋</div>
                    <div className="space-y-4">
                        <h2 className="text-6xl font-black text-gray-900 tracking-tighter">Ready for a fresh start?</h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">Join our global community and start cooking with intent today.</p>
                    </div>
                    <div className="flex justify-center gap-6 pt-6">
                        <Button onClick={() => navigate('/signup')} className="px-16 py-6 text-xl btn-brand">Get Started</Button>
                        <Button variant="ghost" className="px-16 py-6 text-xl text-gray-400" onClick={() => navigate('/signin')}>Member Portal</Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
