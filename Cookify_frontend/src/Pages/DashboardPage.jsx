import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import recipeService from '../services/recipeService';
import RecipeCreateModal from '../components/recipe/RecipeCreateModal';
import MyRecipes from '../components/recipe/MyRecipes';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                : 'text-gray-400 hover:bg-gray-100'
                }`}
        >
            <img
                src={icon}
                alt={label}
                className={`w-5 h-5 object-contain transition-all ${activeTab === id ? 'brightness-0 invert' : 'opacity-60'}`}
            />
            <span className="font-bold tracking-tight text-sm">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-[#fafaf9] text-[#111827] font-sans">
            {/* Header / Top Nav */}
            <div className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-3xl border-b border-black/[0.03]">
                <div className="page-container h-24 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('home')}>
                        <div className="w-12 h-12 bg-green-500 rounded-[18px] flex items-center justify-center p-2.5 shadow-xl shadow-green-500/20">
                            <img src="https://cdn-icons-png.flaticon.com/512/3461/3461901.png" className="w-full h-full object-contain brightness-0 invert" alt="logo" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">COOKIFY</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-1.5 bg-gray-100/50 p-2 rounded-2xl">
                        <TabButton id="home" label="Home" icon={icons.home} />
                        <TabButton id="search" label="Search" icon={icons.search} />
                        <TabButton id="bookmarks" label="Bookmarks" icon={icons.bookmarks} />
                        <TabButton id="myRecipes" label="My Recipes" icon={icons.chef} />
                        <TabButton id="profile" label="Profile" icon={icons.profile} />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                            <div className="text-sm font-black text-gray-900 leading-none">{user?.fullName}</div>
                            <div className="text-[10px] text-green-600 font-black uppercase tracking-[0.2em] mt-1.5">Master Chef</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/10 flex items-center justify-center group hover:bg-orange-500 transition-all duration-500 shadow-sm"
                        >
                            <img src={icons.logout} className="w-5 h-5 object-contain group-hover:brightness-0 group-hover:invert" alt="logout" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="pt-48 pb-32 page-container">
                {activeTab === 'home' && (
                    <div className="space-y-12 animate-fade-in">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.05] pb-10">
                            <div className="space-y-2">
                                <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Morning, {user?.fullName?.split(' ')[0]}!</h1>
                                <p className="text-gray-500 font-medium text-lg">Taste the freshness with our Green-coded organic selections.</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-8 py-4 rounded-xl bg-white border border-gray-100 text-sm font-black uppercase tracking-widest text-gray-500 hover:text-green-600 hover:border-green-100 hover:bg-green-50 transition-all shadow-sm flex items-center gap-3 group">
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                    Explore Filters
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="h-[450px] rounded-3xl bg-gray-200 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                {recipes.map((recipe) => (
                                    <div
                                        key={recipe.id}
                                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                                        className="group glass-card bg-white overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 cursor-pointer border-none"
                                    >
                                        <div className="relative h-72 overflow-hidden">
                                            <img
                                                src={recipe.image.includes('http') ?
                                                    (recipe.image.includes('cloudinary') ? recipe.image.replace('/upload/', '/upload/c_fill,g_auto,h_600,w_800/') : recipe.image) :
                                                    `http://localhost:5000${recipe.image}`}
                                                alt={recipe.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-green-500 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg">
                                                {recipe.category}
                                            </div>
                                        </div>

                                        <div className="p-8 space-y-5">
                                            <div className="flex items-center gap-4 text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                                                <span>{recipe.prepTime}</span>
                                                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                                <span>{recipe.calories} kcal</span>
                                                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                                <span className={
                                                    recipe.difficulty === 'Easy' ? 'text-green-500' :
                                                        recipe.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                                                }>{recipe.difficulty}</span>
                                            </div>

                                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors leading-tight">
                                                {recipe.title}
                                            </h3>

                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                <div className="flex flex-wrap gap-2">
                                                    {recipe.tags?.slice(0, 2).map(tag => (
                                                        <span key={tag} className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg uppercase tracking-tighter">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleBookmark(recipe.title);
                                                    }}
                                                    className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center hover:bg-orange-500 transition-all duration-500 group/btn"
                                                >
                                                    <img src={icons.bookmarks} className="w-4 h-4 object-contain group-hover:brightness-0 group-hover:invert" alt="save" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'myRecipes' && (
                    <div className="space-y-12 animate-fade-in">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.05] pb-10">
                            <div className="space-y-2">
                                <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">My Culinary Legacy</h1>
                                <p className="text-gray-500 font-medium text-lg">Recipes shared by you that the world can now taste.</p>
                            </div>
                        </div>
                        <MyRecipes />
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="animate-fade-in w-full space-y-12">
                        <div className="glass-card bg-white p-16 flex flex-col items-center text-center space-y-8 border-none shadow-xl">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-green-500/20 rounded-[40px] blur-2xl group-hover:bg-green-500/40 transition-all" />
                                <div className="w-44 h-44 rounded-[40px] bg-green-500 p-1 flex items-center justify-center text-5xl relative z-10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                                    <img
                                        src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop`}
                                        className="w-full h-full object-cover"
                                        alt="avatar"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-500 rounded-2xl border-4 border-white flex items-center justify-center text-white z-20 shadow-2xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-5xl font-bold text-gray-900 tracking-tight">{user?.fullName}</h1>
                                <div className="flex items-center justify-center gap-4">
                                    <span className="text-green-600 font-bold tracking-[0.3em] uppercase text-xs">Fresh Food Advocate</span>
                                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                    <span className="text-orange-500 font-bold tracking-[0.3em] uppercase text-xs">Elite Level 42</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-10 md:gap-20 pt-12 border-t border-gray-100 w-full max-w-2xl">
                                {[
                                    { label: 'Recipes', val: '24' },
                                    { label: 'Followers', val: '1.2k' },
                                    { label: 'Saves', val: '450' }
                                ].map((s, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="text-4xl font-black text-gray-900">{s.val}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {(activeTab === 'search' || activeTab === 'bookmarks') && (
                    <div className="animate-fade-in text-center py-32 space-y-8">
                        <div className="w-24 h-24 bg-orange-500/10 rounded-3xl mx-auto flex items-center justify-center p-6 border border-orange-500/20">
                            <img src={activeTab === 'search' ? icons.search : icons.bookmarks} className="w-full h-full object-contain" alt="icon" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">The {activeTab} Screen</h2>
                            <p className="text-gray-500 max-w-md mx-auto font-medium">Coming soon! Experience the next level of culinary exploration in our vibrant food vault.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Floating Action Button - Bottom Right */}
            <div className="fixed bottom-12 right-12 z-[90] group">
                <div className="absolute -inset-4 bg-green-500/20 rounded-[32px] blur-2xl group-hover:bg-green-500/40 transition-all duration-500 opacity-0 group-hover:opacity-100" />
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="relative w-20 h-20 bg-green-500 rounded-[28px] shadow-2xl shadow-green-500/40 flex items-center justify-center group-hover:-translate-y-2 transition-all duration-500 active:scale-95"
                >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>

                    {/* Tooltip */}
                    <div className="absolute right-full mr-6 px-6 py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl whitespace-nowrap opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none shadow-2xl">
                        Share New Recipe
                    </div>
                </button>
            </div>

            <RecipeCreateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchRecipes();
                    if (activeTab === 'myRecipes') {
                        // Trigger re-fetch in MyRecipes component if needed
                        // (MyRecipes has its own useEffect, but we could pass a refresh key)
                        setActiveTab('home');
                        setTimeout(() => setActiveTab('myRecipes'), 10);
                    }
                }}
            />
        </div>
    );
};

export default DashboardPage;
