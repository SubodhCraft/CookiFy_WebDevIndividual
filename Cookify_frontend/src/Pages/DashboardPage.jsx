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

                    <div className="flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-2xl overflow-x-auto no-scrollbar max-w-[50%] md:max-w-none">
                        <TabButton id="home" label="Home" icon={icons.home} />
                        <TabButton id="search" label="Search" icon={icons.search} />
                        <TabButton id="bookmarks" label={`Bookmarks ${bookmarkedRecipes.length > 0 ? `(${bookmarkedRecipes.length})` : ''}`} icon={icons.bookmarks} />
                        <TabButton id="myRecipes" label="My Recipes" icon={icons.chef} />
                        <TabButton id="profile" label="Profile" icon={icons.profile} />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                            <div className="text-sm font-black text-gray-900 leading-none">{user?.fullName}</div>
                            <div className="text-[10px] text-green-600 font-black uppercase tracking-[0.2em] mt-1.5">Master Chef</div>
                        </div>
                        <div
                            className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden cursor-pointer border-2 border-white shadow-xl hover:scale-110 transition-transform"
                            onClick={() => setActiveTab('profile')}
                        >
                            <img
                                src={user?.profilePicture?.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`}
                                className="w-full h-full object-cover"
                                alt="profile"
                            />
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
                            <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
                                <input
                                    type="file"
                                    id="profile-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleProfilePictureChange}
                                />
                                <div className="absolute inset-0 bg-green-500/20 rounded-[40px] blur-2xl group-hover:bg-green-500/40 transition-all" />
                                <div className="w-44 h-44 rounded-[40px] bg-green-500 p-1 flex items-center justify-center text-5xl relative z-10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                                    {isUploadingProfile ? (
                                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <img
                                            src={user?.profilePicture?.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`}
                                            className="w-full h-full object-cover"
                                            alt="avatar"
                                        />
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-500 rounded-2xl border-4 border-white flex items-center justify-center text-white z-20 shadow-2xl group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
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
                                            <div className="relative h-72 overflow-hidden">
                                                <img
                                                    src={recipe.image.startsWith('http') ? recipe.image : `http://localhost:5000${recipe.image}`}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    alt={recipe.title}
                                                />
                                                <div className="absolute top-6 left-6 px-6 py-3 rounded-2xl bg-white/90 backdrop-blur-xl text-[10px] font-black uppercase tracking-[0.2em] text-green-600 shadow-2xl">
                                                    {recipe.category}
                                                </div>
                                            </div>
                                            <div className="p-10 space-y-6">
                                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-green-600 transition-colors uppercase tracking-tighter leading-none">
                                                    {recipe.title}
                                                </h3>
                                                <div className="flex items-center justify-between pt-4 border-t border-black/[0.03]">
                                                    <div className="flex gap-4">
                                                        <span className="text-xs font-black text-gray-400">{recipe.prepTime}</span>
                                                        <span className="text-xs font-black text-gray-400">{recipe.calories} kcal</span>
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
