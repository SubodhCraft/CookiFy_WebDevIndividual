import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import landingService from '../services/landingService';
import Button from '../components/common/Button';

const LandingPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        categories: [], heroContent: {}, stats: []
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
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C] font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8F5E9]/40 via-transparent to-[#FFF9C4]/20 pointer-events-none" />
                <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8 animate-reveal">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] border border-[#2E7D32]/10 text-[#2E7D32] text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                            {data.heroContent?.subtitle || 'Fresh recipes daily'}
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] font-heading">
                            {data.heroContent?.title || 'Discover & Share Delicious Recipes'}
                        </h1>

                        <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
                            {data.heroContent?.description || 'Find your next favorite meal. Browse recipes, save what you love, and share your own creations with the community.'}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Button onClick={() => navigate('/signup')} variant="primary" size="lg" className="px-10">
                                Get Started Free
                            </Button>
                            <Button onClick={() => navigate('/signin')} variant="outline" size="lg" className="px-10">
                                Sign In
                            </Button>
                        </div>

                        {/* Stats Strip */}
                        {data.stats && data.stats.length > 0 && (
                            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-gray-100">
                                {data.stats.map((stat, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                        <div className="text-sm text-gray-400 font-medium tracking-wide border-l-2 border-[#2E7D32] pl-3 italic">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative hidden lg:block animate-reveal">
                        <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1200&h=800&auto=format&fit=crop"
                                className="w-full h-[580px] object-cover"
                                alt="Fresh food"
                            />
                        </div>
                        <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4 animate-float">
                            <div className="w-14 h-14 bg-[#FBC02D] rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/20">🍳</div>
                            <div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Today's Pick</div>
                                <div className="text-lg font-bold text-gray-900">Salmon & Greens</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            {data.categories?.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="max-w-[1280px] mx-auto px-6 space-y-16">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="max-w-xl">
                                <h2 className="text-4xl font-bold text-gray-900 font-heading">Browse by Category</h2>
                                <p className="text-gray-500 mt-4 text-lg">Find recipes that match your mood and taste. From quick snacks to elaborate dinners.</p>
                            </div>
                            <Button variant="outline" size="md" className="rounded-xl">View All</Button>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {data.categories.map((cat, i) => (
                                <div key={i} className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
                                    <img
                                        src={cat.image}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={cat.name}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                                    <div className="absolute bottom-8 left-8 right-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                                        <h3 className="text-2xl font-bold text-white mb-1">{cat.name}</h3>
                                        <p className="text-sm text-green-400 font-bold tracking-widest uppercase">{cat.count}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-24 px-6 bg-[#FAFAFA]">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-[48px] p-12 lg:p-20 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-green-900/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full -ml-20 -mb-20 blur-2xl" />

                    <div className="relative z-10 space-y-8">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner">🍋</div>
                        <div className="space-y-4">
                            <h2 className="text-4xl lg:text-5xl font-bold text-white font-heading">Ready to start cooking?</h2>
                            <p className="text-green-100/80 max-w-xl mx-auto text-lg leading-relaxed">
                                Join our community and start sharing your favorite recipes today. It's completely free and always will be.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-10 py-4 bg-white text-[#2E7D32] rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl hover:shadow-white/20 active:scale-95"
                            >
                                Get Started Free
                            </button>
                            <button
                                onClick={() => navigate('/signin')}
                                className="px-10 py-4 bg-transparent text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border-2 border-white/20 active:scale-95"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
