import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import recipeService from '../services/recipeService';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Icon Mappings
    const icons = {
        home: "https://cdn-icons-png.flaticon.com/512/1946/1946436.png",
        search: "https://cdn-icons-png.flaticon.com/512/1170/1170666.png",
        bookmarks: "https://cdn-icons-png.flaticon.com/512/102/102279.png",
        profile: "https://cdn-icons-png.flaticon.com/512/1077/1077063.png",
        chef: "https://cdn-icons-png.flaticon.com/512/3461/3461901.png",
        logout: "https://cdn-icons-png.flaticon.com/512/1828/1828427.png"
    };

    useEffect(() => {
        const currentUser = authService.getUser();
        if (!currentUser) {
            navigate('/signin');
            return;
        }
        setUser(currentUser);
        fetchRecipes();
    }, [navigate]);

    const fetchRecipes = async () => {
        setIsLoading(true);
        try {
            const response = await recipeService.getAllRecipes();
            if (response.success) {
                setRecipes(response.data);
            }
        } catch (error) {
            toast.error('Failed to sync recipe vault. Please try again.');
            console.error('Error fetching recipes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        authService.clearAuthData();
        toast.success('Signed out successfully. See you soon, Chef!');
        navigate('/');
    };

    const handleBookmark = (title) => {
        toast.success(`"${title}" added to your bookmarks!`, {
            icon: '🔖',
        });
    };

    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === id
                ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white group'
                }`}
        >
            <img
                src={icon}
                alt={label}
                className={`w-5 h-5 object-contain transition-all ${activeTab === id ? 'brightness-200' : 'brightness-75 group-hover:brightness-100 opacity-60 group-hover:opacity-100'}`}
            />
            <span className="font-bold tracking-wide">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans">
            {/* Sidebar / Top Nav */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-white/5">
                <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-indigo-500/20">
                            <img src="https://res.cloudinary.com/demo/image/upload/v1/samples/logos/cloudinary_icon_white.png" className="w-full h-full object-contain" alt="logo" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-white">COOKIFY</span>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <TabButton id="home" label="Home" icon={icons.home} />
                        <TabButton id="search" label="Search" icon={icons.search} />
                        <TabButton id="bookmarks" label="Bookmarks" icon={icons.bookmarks} />
                        <TabButton id="profile" label="Profile" icon={icons.profile} />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                            <div className="text-sm font-bold text-white">{user?.fullName}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master Chef</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/10 flex items-center justify-center group hover:bg-red-500 transition-all duration-300"
                        >
                            <img src={icons.logout} className="w-5 h-5 object-contain brightness-0 invert group-hover:brightness-100" alt="logout" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="pt-32 pb-20 max-w-[1440px] mx-auto px-6 lg:px-12">
                {activeTab === 'home' && (
                    <div className="space-y-12 animate-fade-in">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <h1 className="text-5xl font-bold text-white tracking-tight">Morning, {user?.fullName?.split(' ')[0]}!</h1>
                                <p className="text-slate-500 font-medium">Explore hand-picked recipes optimized by Cloudinary CDN.</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 rounded-xl glass-card border-white/5 bg-white/5 text-sm font-bold hover:bg-white/10 transition-all">Filter</button>
                                <button className="px-6 py-3 rounded-xl bg-indigo-600 text-sm font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-all">New Recipe</button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-[450px] rounded-3xl bg-white/5 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {recipes.map((recipe) => (
                                    <div key={recipe.id} className="group glass-card border-white/5 bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] transition-all duration-700 hover:-translate-y-2">
                                        <div className="relative h-72 overflow-hidden">
                                            <img
                                                src={`${recipe.image.includes('cloudinary') ? recipe.image.replace('/upload/', '/upload/c_fill,g_auto,h_600,w_800/') : recipe.image}`}
                                                alt={recipe.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute top-6 right-6 px-4 py-2 rounded-xl glass-card border-white/20 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-xl">
                                                {recipe.category}
                                            </div>
                                        </div>

                                        <div className="p-10 space-y-5">
                                            <div className="flex items-center gap-4 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                                <span>{recipe.prepTime}</span>
                                                <div className="w-1 h-1 bg-slate-700 rounded-full" />
                                                <span>{recipe.calories} kcal</span>
                                                <div className="w-1 h-1 bg-slate-700 rounded-full" />
                                                <span className={
                                                    recipe.difficulty === 'Easy' ? 'text-green-400' :
                                                        recipe.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                                                }>{recipe.difficulty}</span>
                                            </div>

                                            <h3 className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                                                {recipe.title}
                                            </h3>

                                            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
                                                {recipe.description}
                                            </p>

                                            <div className="flex justify-between items-center pt-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {recipe.tags?.map(tag => (
                                                        <span key={tag} className="text-[9px] font-bold text-slate-500 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 uppercase tracking-tighter">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => handleBookmark(recipe.title)}
                                                    className="w-12 h-12 rounded-2xl glass-card border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-500 shadow-xl group/btn"
                                                >
                                                    <img src={icons.bookmarks} className="w-5 h-5 object-contain brightness-0 invert opacity-40 group-hover/btn:opacity-100" alt="save" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Other tabs remain similar but with Cloudinary assets... */}
                {activeTab === 'profile' && (
                    <div className="animate-fade-in max-w-4xl mx-auto space-y-12">
                        <div className="glass-card p-16 flex flex-col items-center text-center space-y-8 border-white/5">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-[40px] blur-2xl group-hover:bg-indigo-500/40 transition-all" />
                                <div className="w-44 h-44 rounded-[40px] bg-indigo-600 p-1 flex items-center justify-center text-5xl relative z-10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                                    <img
                                        src={`https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_face,g_face/r_max/v1/samples/people/smiling-man.jpg`}
                                        className="w-full h-full object-cover"
                                        alt="avatar"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-2xl border-4 border-[#0a0a0f] flex items-center justify-center text-white z-20 shadow-2xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-5xl font-bold text-white tracking-tight">{user?.fullName}</h1>
                                <div className="flex items-center justify-center gap-4">
                                    <span className="text-indigo-400 font-bold tracking-[0.3em] uppercase text-xs">Certified Master Chef</span>
                                    <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                                    <span className="text-slate-500 font-bold tracking-[0.3em] uppercase text-xs">Level 42</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-20 pt-12 border-t border-white/5 w-full max-w-2xl">
                                {[
                                    { label: 'Recipes Created', val: '24' },
                                    { label: 'Chef Followers', val: '1.2k' },
                                    { label: 'Recipe Saves', val: '450' }
                                ].map((s, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="text-3xl font-bold text-white">{s.val}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Search & Bookmarks empty states would use Cloudinary placeholders too */}
                {(activeTab === 'search' || activeTab === 'bookmarks') && (
                    <div className="animate-fade-in text-center py-32 space-y-8">
                        <div className="w-24 h-24 bg-indigo-600/10 rounded-3xl mx-auto flex items-center justify-center p-6 border border-indigo-500/20">
                            <img src={activeTab === 'search' ? icons.search : icons.bookmarks} className="w-full h-full object-contain brightness-0 invert opacity-40" alt="icon" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">The {activeTab} Screen</h2>
                            <p className="text-slate-500 max-w-md mx-auto font-medium">Access our elite gourmet vault with real-time assets delivered via Cloudinary CDN.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;
