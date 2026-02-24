import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import recipeService from '../services/recipeService';
import bookmarkService from '../services/bookmarkService';
import RecipeCreateModal from '../components/recipe/RecipeCreateModal';
import MyRecipes from '../components/recipe/MyRecipes';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        setIsModalOpen(true);
    };

    // Search States
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Bookmark States
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
    const [isBookmarksLoading, setIsBookmarksLoading] = useState(false);

    // Profile States
    const [isUploadingProfile, setIsUploadingProfile] = useState(false);

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
        fetchBookmarks();
    }, [navigate]);

    const fetchBookmarks = async () => {
        setIsBookmarksLoading(true);
        try {
            const response = await bookmarkService.getMyBookmarks();
            if (response.success) {
                setBookmarkedRecipes(response.data);
                console.log('Bookmarks synced:', response.data.length);
            } else {
                console.error('Failed to sync bookmarks:', response.message);
            }
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            const msg = error.response?.data?.message || error.message;
            toast.error(`Could not load bookmarks: ${msg}`);
        } finally {
            setIsBookmarksLoading(false);
        }
    };

    const fetchRecipes = async () => {
        setIsLoading(true);
        try {
            const response = await recipeService.getAllRecipes();
            if (response.success) {
                setRecipes(response.data);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to sync recipe vault.';
            toast.error(errorMsg);
            console.error('Error fetching recipes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Real-time Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (activeTab === 'search') {
                handleSearch(searchQuery);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, activeTab]);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await recipeService.getAllRecipes(query);
            if (response.success) {
                setSearchResults(response.data);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleLogout = () => {
        authService.clearAuthData();
        toast.success('Signed out successfully. See you soon, Chef!');
        navigate('/');
    };

    const handleBookmark = async (recipe) => {
        try {
            console.log('Toggling bookmark for:', recipe.title, recipe.id);
            const response = await bookmarkService.toggleBookmark(recipe.id);
            if (response.success) {
                toast.success(response.message, {
                    icon: response.isBookmarked ? '🔖' : '🗑️',
                });
                console.log('Bookmark response:', response);
                // Refresh bookmarks list
                fetchBookmarks();
            }
        } catch (error) {
            toast.error('Failed to update bookmark');
            console.error('Bookmark toggle error:', error);
        }
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size must be less than 2MB');
            return;
        }

        setIsUploadingProfile(true);
        try {
            const response = await authService.updateProfilePicture(file);
            if (response.success) {
                toast.success('Profile picture updated!');
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error updating profile picture:', error);
            toast.error('Failed to update profile picture');
        } finally {
            setIsUploadingProfile(false);
        }
    };

    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 group ${activeTab === id
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
                }`}
        >
            <img
                src={icon}
                alt={label}
                className={`w-4 h-4 object-contain transition-all duration-300 ${activeTab === id ? '' : 'grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0'}`}
            />
            <span className={`text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {label}
            </span>
        </button>
    );

    return (
        <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans">
            {/* Premium Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 h-24">
                <div className="page-container h-full flex items-center justify-between gap-16">
                    {/* Brand Slot */}
                    <div className="flex items-center gap-10 cursor-pointer shrink-0" onClick={() => setActiveTab('home')}>
                        <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-slate-950 uppercase hidden min-[400px]:block">COOKIFY</span>
                    </div>

                    {/* Navigation Pills - More Adjustable/Responsive */}
                    <nav className="flex items-center bg-slate-100/80 p-1.5 rounded-[20px] overflow-x-auto no-scrollbar scroll-smooth shadow-inner border border-slate-200/50 max-w-[160px] min-[450px]:max-w-[280px] md:max-w-none">
                        <TabButton id="home" label="Home" icon={icons.home} />
                        <TabButton id="search" label="Search" icon={icons.search} />
                        <TabButton id="bookmarks" label="Saved" icon={icons.bookmarks} />
                        <TabButton id="myRecipes" label="Studio" icon={icons.chef} />
                        <TabButton id="profile" label="Profile" icon={icons.profile} />
                    </nav>

                    {/* Meta/Profile Slot */}
                    <div className="flex items-center gap-10 shrink-0">
                        <div className="hidden lg:flex flex-col items-end gap-2">
                            <span className="text-sm font-bold text-slate-900 leading-none tracking-tight">{user?.fullName}</span>
                            <span className="text-[11px] text-emerald-600 font-black uppercase tracking-[0.2em] opacity-80">Master Chef</span>
                        </div>

                        <div className="h-8 w-px bg-slate-200 hidden lg:block" />

                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden cursor-pointer border border-slate-200 hover:ring-2 hover:ring-emerald-500/20 transition-all shadow-sm"
                                onClick={() => setActiveTab('profile')}
                            >
                                <img
                                    src={user?.profilePicture ?
                                        (user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`) :
                                        icons.profile}
                                    className="w-full h-full object-cover"
                                    alt="profile"
                                />
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-red-500 transition-all duration-300 shadow-md shadow-slate-900/10 active:scale-95 group"
                                title="Sign Out"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="pt-44 pb-32 page-container flex flex-col gap-16">
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
                            <div className="space-y-24">
                                { /* System Recipes Section */}
                                <div className="space-y-10">
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-green-600 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Cookify Originals</span>
                                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Executive Selections</h2>
                                        </div>
                                        <div className="h-[1px] flex-grow bg-black/[0.05]" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                        {recipes.filter(r => !r.userId).map((recipe) => (
                                            <div
                                                key={recipe.id}
                                                onClick={() => navigate(`/recipe/${recipe.id}`)}
                                                className="group glass-card bg-white overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 cursor-pointer border-none"
                                            >
                                                <div className="relative h-64 overflow-hidden">
                                                    <img
                                                        src={recipe.image.includes('http') ?
                                                            (recipe.image.includes('cloudinary') ? recipe.image.replace('/upload/', '/upload/c_fill,g_auto,h_600,w_800/') : recipe.image) :
                                                            `http://localhost:5000${recipe.image}`}
                                                        alt={recipe.title}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                </div>

                                                <div className="p-10 flex flex-col gap-10">
                                                    <div className="space-y-6">
                                                        <div className="flex items-center gap-6 text-[11px] font-black text-orange-500 uppercase tracking-[0.15em]">
                                                            <span>{recipe.prepTime}</span>
                                                            <span>{recipe.calories} kcal</span>
                                                            <span className={
                                                                recipe.difficulty === 'Easy' ? 'text-green-500' :
                                                                    recipe.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                                                            }>{recipe.difficulty}</span>
                                                        </div>

                                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-[1.15] tracking-tight">
                                                            {recipe.title}
                                                        </h3>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-8 border-t border-slate-100 mt-auto">
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
                                                                handleBookmark(recipe);
                                                            }}
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group/btn ${bookmarkedRecipes.some(b => b.id === recipe.id)
                                                                ? 'bg-orange-500 shadow-lg shadow-orange-500/20'
                                                                : 'bg-orange-500/10 hover:bg-orange-500'
                                                                }`}
                                                        >
                                                            <img
                                                                src={icons.bookmarks}
                                                                className={`w-4 h-4 object-contain transition-all duration-500 ${bookmarkedRecipes.some(b => b.id === recipe.id)
                                                                    ? 'brightness-0 invert'
                                                                    : 'group-hover/btn:brightness-0 group-hover/btn:invert'
                                                                    }`}
                                                                alt="save"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                { /* User Recipes Section */}
                                <div className="space-y-10">
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-1">Member Submissions</span>
                                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Community Discoveries</h2>
                                        </div>
                                        <div className="h-[1px] flex-grow bg-black/[0.05]" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                        {recipes.filter(r => r.userId).map((recipe) => (
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

                                                    <div className="flex justify-between items-center pt-8 border-t border-slate-100 mt-auto">
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
                                                                handleBookmark(recipe);
                                                            }}
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group/btn ${bookmarkedRecipes.some(b => b.id === recipe.id)
                                                                ? 'bg-orange-500 shadow-lg shadow-orange-500/20'
                                                                : 'bg-orange-500/10 hover:bg-orange-500'
                                                                }`}
                                                        >
                                                            <img
                                                                src={icons.bookmarks}
                                                                className={`w-4 h-4 object-contain transition-all duration-500 ${bookmarkedRecipes.some(b => b.id === recipe.id)
                                                                    ? 'brightness-0 invert'
                                                                    : 'group-hover/btn:brightness-0 group-hover/btn:invert'
                                                                    }`}
                                                                alt="save"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {recipes.filter(r => r.userId).length === 0 && (
                                        <div className="py-20 text-center border-2 border-dashed border-black/[0.05] rounded-[48px]">
                                            <p className="text-gray-400 font-bold italic text-lg text-center">No community discoveries yet. Be the first to share!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'myRecipes' && (
                    <div className="space-y-12 animate-fade-in relative">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.05] pb-10">
                            <div className="space-y-2">
                                <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">My Culinary Legacy</h1>
                                <p className="text-gray-500 font-medium text-lg">Recipes shared by you that the world can now taste.</p>
                            </div>
                        </div>
                        <MyRecipes refreshKey={isModalOpen} onEdit={handleEdit} />
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="animate-fade-in w-full pb-44 -mx-4 md:-mx-8 lg:-mx-12">
                        {/* Immersive Profile Header */}
                        <div className="relative w-full h-[450px] overflow-hidden bg-slate-100">
                            <div className="absolute inset-0 opacity-20">
                                <img
                                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2400&auto=format&fit=crop"
                                    className="w-full h-full object-cover"
                                    alt="kitchen"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100/40 to-[#fafaf9]" />

                            <div className="absolute inset-0 page-container flex flex-col md:flex-row items-end pb-16 gap-16">
                                <div className="relative shrink-0 translate-y-10" onClick={() => document.getElementById('profile-upload').click()}>
                                    <input
                                        type="file" id="profile-upload" className="hidden" accept="image/*"
                                        onChange={handleProfilePictureChange}
                                    />
                                    <div className="w-64 h-64 rounded-[40px] bg-white p-1.5 flex items-center justify-center text-8xl relative z-10 overflow-hidden transform hover:scale-[1.02] cursor-pointer transition-transform duration-500 border-8 border-white shadow-2xl">
                                        {isUploadingProfile ? (
                                            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <img
                                                src={user?.profilePicture ?
                                                    (user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`) :
                                                    icons.profile}
                                                className="w-full h-full object-cover"
                                                alt="avatar"
                                            />
                                        )}
                                    </div>
                                    <div className="absolute bottom-4 right-4 w-14 h-14 bg-emerald-600 rounded-2xl border-4 border-white flex items-center justify-center text-white z-20 shadow-xl hover:scale-110 transition-all cursor-pointer">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                </div>

                                <div className="flex-grow space-y-5 pb-4">
                                    <span className="inline-flex px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] border border-emerald-200">
                                        Member Since 2024
                                    </span>
                                    <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">{user?.fullName}</h1>
                                    <p className="text-2xl text-slate-500 font-medium tracking-tight">@{user?.username}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Content Grid */}
                        <div className="page-container mt-32">
                            <div className="grid lg:grid-cols-12 gap-20">
                                {/* Left Side: Quick Stats */}
                                <div className="lg:col-span-4 space-y-16">
                                    <div className="bg-white rounded-[48px] p-12 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-slate-100 divide-y divide-slate-50">
                                        {[
                                            { label: 'Recipes Posted', val: recipes.filter(r => r.userId === user?.id).length || '0', icon: '🍳' },
                                            { label: 'Saved Recipes', val: bookmarkedRecipes.length || '0', icon: '🔖' },
                                            { label: 'Likes Received', val: '124', icon: '❤️' }
                                        ].map((s, i) => (
                                            <div key={i} className="flex items-center justify-between py-8 first:pt-0 last:pb-0 group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-emerald-50 transition-all duration-500">
                                                        {s.icon}
                                                    </div>
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</span>
                                                </div>
                                                <div className="text-3xl font-black text-slate-900 tracking-tight">{s.val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Side: Account Details */}
                                <div className="lg:col-span-8 space-y-16">
                                    <div className="bg-white rounded-[48px] p-16 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-slate-100 space-y-16">
                                        <div className="flex items-center gap-6">
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Account Information</h3>
                                            <div className="h-px flex-grow bg-slate-100" />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-12">
                                            {[
                                                { label: 'Full Name', val: user?.fullName, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                                                { label: 'Username', val: `@${user?.username}`, icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
                                                { label: 'Email Address', val: user?.email, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                                                { label: 'Account Status', val: 'Active Member', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
                                            ].map((field, i) => (
                                                <div key={i} className="p-8 rounded-[32px] bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-xl hover:border-emerald-100 transition-all duration-500">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-2">
                                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{field.label}</span>
                                                            <p className="text-xl font-black text-slate-800 tracking-tight">{field.val}</p>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:text-emerald-500 transition-colors">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={field.icon} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Danger Zone */}
                                    <div className="bg-white rounded-[48px] p-12 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-red-50 flex flex-col md:flex-row items-center justify-between gap-12">
                                        <div className="space-y-2 text-center md:text-left">
                                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Sign Out</h4>
                                            <p className="text-lg text-slate-500 font-medium">Log out of your current session on this device.</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full md:w-auto px-12 py-6 rounded-2xl bg-red-50 text-red-600 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'search' && (
                    <div className="animate-fade-in space-y-16">
                        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                            <div className="space-y-4">
                                <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase">Culinary Explorer</h1>
                                <p className="text-xl text-gray-500 font-medium">Search for ingredients, categories, or recipe names across our global vault.</p>
                            </div>

                            <div className="w-full relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-[32px] blur-xl opacity-20 group-focus-within:opacity-40 transition-all duration-500" />
                                <div className={`relative flex items-center bg-white border-2 ${searchQuery ? 'border-green-500' : 'border-black/[0.05]'} rounded-[32px] p-2 transition-all duration-500 shadow-2xl shadow-black/[0.02]`}>
                                    <div className="w-16 h-16 flex items-center justify-center">
                                        {isSearching ? (
                                            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Try 'Avocado', 'Italian', or 'Breakfast'..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-grow bg-transparent border-none focus:ring-0 text-xl font-bold placeholder-gray-300 text-gray-800 px-2"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="w-12 h-12 rounded-2xl hover:bg-gray-100 flex items-center justify-center transition-colors group"
                                        >
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {searchQuery.trim() === '' ? (
                            <div className="py-20 text-center space-y-4 opacity-40">
                                <div className="text-8xl">🔍</div>
                                <div className="text-xl font-black uppercase tracking-widest text-gray-400">Ready for exploration</div>
                            </div>
                        ) : isSearching ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-96 rounded-[48px] bg-white border border-black/[0.02] animate-pulse shadow-sm" />
                                ))}
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-green-600">Results Found</span>
                                    <div className="h-0.5 flex-grow bg-green-500/10" />
                                    <span className="text-sm font-black text-gray-400 px-4 py-2 bg-gray-100 rounded-full">{searchResults.length} Match{searchResults.length !== 1 && 'es'}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                    {searchResults.map((recipe) => (
                                        <div
                                            key={recipe.id}
                                            onClick={() => navigate(`/recipe/${recipe.id}`)}
                                            className="group bg-white rounded-[48px] overflow-hidden hover:shadow-2xl transition-all duration-700 cursor-pointer border border-black/[0.01]"
                                        >
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={recipe.image.startsWith('http') ? recipe.image : `http://localhost:5000${recipe.image}`}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    alt={recipe.title}
                                                />
                                            </div>
                                            <div className="p-10 flex flex-col gap-10">
                                                <div className="space-y-6">
                                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tighter leading-none">
                                                        {recipe.title}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-auto">
                                                    <div className="flex gap-8 text-[11px] font-black text-orange-500 uppercase tracking-[0.15em]">
                                                        <span>{recipe.prepTime}</span>
                                                        <span>{recipe.calories} kcal</span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleBookmark(recipe);
                                                        }}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group/btn ${bookmarkedRecipes.some(b => b.id === recipe.id)
                                                            ? 'bg-orange-500 shadow-lg shadow-orange-500/20'
                                                            : 'bg-orange-500/10 hover:bg-orange-500'
                                                            }`}
                                                    >
                                                        <img
                                                            src={icons.bookmarks}
                                                            className={`w-4 h-4 object-contain transition-all duration-500 ${bookmarkedRecipes.some(b => b.id === recipe.id)
                                                                ? 'brightness-0 invert'
                                                                : 'group-hover/btn:brightness-0 group-hover/btn:invert'
                                                                }`}
                                                            alt="save"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-32 text-center space-y-8 bg-white rounded-[64px] border border-black/[0.02] shadow-2xl shadow-black/[0.01]">
                                <div className="w-32 h-32 bg-orange-50 rounded-[48px] flex items-center justify-center text-6xl mx-auto shadow-inner">🍽️</div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Recipe Not Found</h3>
                                    <p className="text-gray-500 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                                        We couldn't find any culinary matches for <span className="text-orange-500 font-black">"{searchQuery}"</span>.
                                        Try searching for a different ingredient or category.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="px-10 py-5 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/10 active:scale-95"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'bookmarks' && (
                    <div className="space-y-12 animate-fade-in">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.05] pb-10">
                            <div className="space-y-2">
                                <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Saved Treasures</h1>
                                <p className="text-gray-500 font-medium text-lg">Your curated collection of culinary masterpieces.</p>
                            </div>
                        </div>

                        {isBookmarksLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-[450px] rounded-3xl bg-gray-200 animate-pulse" />
                                ))}
                            </div>
                        ) : bookmarkedRecipes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                {bookmarkedRecipes.map((recipe) => (
                                    <div
                                        key={recipe.id}
                                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                                        className="group glass-card bg-white overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 cursor-pointer border-none"
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={recipe.image.includes('http') ?
                                                    (recipe.image.includes('cloudinary') ? recipe.image.replace('/upload/', '/upload/c_fill,g_auto,h_600,w_800/') : recipe.image) :
                                                    `http://localhost:5000${recipe.image}`}
                                                alt={recipe.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        </div>

                                        <div className="p-10 flex flex-col gap-10">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-8 text-[11px] font-black text-orange-500 uppercase tracking-[0.15em]">
                                                    <span>{recipe.prepTime}</span>
                                                    <span>{recipe.calories} kcal</span>
                                                </div>

                                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-[1.15] tracking-tight">
                                                    {recipe.title}
                                                </h3>
                                            </div>

                                            <div className="flex justify-between items-center pt-8 border-t border-slate-100 mt-auto">
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
                                                        handleBookmark(recipe);
                                                    }}
                                                    className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-all duration-500 group/btn"
                                                >
                                                    <img src={icons.bookmarks} className="w-4 h-4 object-contain brightness-0 invert" alt="save" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 text-center space-y-8 bg-white rounded-[64px] border border-black/[0.02] shadow-2xl shadow-black/[0.01]">
                                <div className="w-32 h-32 bg-gray-50 rounded-[48px] flex items-center justify-center text-6xl mx-auto shadow-inner">🔖</div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">No Saved Treasures</h3>
                                    <p className="text-gray-500 text-xl font-medium max-w-lg mx-auto leading-relaxed">
                                        Your culinary vault is empty. Start exploring and save recipes you love to find them here later!
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('home')}
                                    className="px-10 py-5 bg-green-500 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-green-600 transition-all shadow-xl shadow-green-500/10 active:scale-95"
                                >
                                    Explore Recipes
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Conditional Floating Action Button - Only for My Recipes */}
            {activeTab === 'myRecipes' && (
                <div className="fixed bottom-12 right-12 z-[90] group animate-fade-in">
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
            )}

            <RecipeCreateModal
                isOpen={isModalOpen}
                editRecipe={editingRecipe}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingRecipe(null);
                }}
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
