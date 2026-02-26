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

    const handleEdit = (recipe) => { setEditingRecipe(recipe); setIsModalOpen(true); };

    // Search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Bookmarks
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
    const [isBookmarksLoading, setIsBookmarksLoading] = useState(false);

    // Profile
    const [isUploadingProfile, setIsUploadingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

    useEffect(() => {
        const currentUser = authService.getUser();
        if (!currentUser) { navigate('/signin'); return; }
        setUser(currentUser);
        fetchRecipes();
        fetchBookmarks();
    }, [navigate]);

    const fetchBookmarks = async () => {
        setIsBookmarksLoading(true);
        try {
            const res = await bookmarkService.getMyBookmarks();
            if (res.success) setBookmarkedRecipes(res.data);
        } catch (error) {
            toast.error('Could not load bookmarks');
        } finally { setIsBookmarksLoading(false); }
    };

    const fetchRecipes = async () => {
        setIsLoading(true);
        try {
            const res = await recipeService.getAllRecipes();
            if (res.success) setRecipes(res.data);
        } catch (error) {
            toast.error('Failed to load recipes');
        } finally { setIsLoading(false); }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (activeTab === 'search') handleSearch(searchQuery);
        }, 500);
        return () => clearTimeout(delay);
    }, [searchQuery, activeTab]);

    const handleSearch = async (query) => {
        if (!query.trim()) { setSearchResults([]); return; }
        setIsSearching(true);
        try {
            const res = await recipeService.getAllRecipes(query);
            if (res.success) setSearchResults(res.data);
        } catch { console.error('Search error'); }
        finally { setIsSearching(false); }
    };

    const handleLogout = () => {
        authService.clearAuthData();
        toast.success('Signed out successfully');
        navigate('/');
    };

    const handleBookmark = async (recipe) => {
        try {
            const res = await bookmarkService.toggleBookmark(recipe.id);
            if (res.success) {
                toast.success(res.message, { icon: res.isBookmarked ? '🔖' : '🗑️' });
                fetchBookmarks();
            }
        } catch { toast.error('Failed to update bookmark'); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.error('Please fill in both fields');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        setIsChangingPassword(true);
        try {
            const res = await authService.changePassword(passwordData);
            if (res.success) {
                toast.success('Password updated successfully!');
                setShowPasswordForm(false);
                setPasswordData({ currentPassword: '', newPassword: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
        if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
        setIsUploadingProfile(true);
        try {
            const res = await authService.updateProfilePicture(file);
            if (res.success) { toast.success('Profile picture updated!'); setUser(res.data); }
        } catch { toast.error('Failed to update profile picture'); }
        finally { setIsUploadingProfile(false); }
    };

    /* ===== Reusable Recipe Card ===== */
    const RecipeCard = ({ recipe, showCategory = false }) => (
        <div
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={recipe.image.includes('http') ?
                        (recipe.image.includes('cloudinary') ? recipe.image.replace('/upload/', '/upload/c_fill,g_auto,h_600,w_800/') : recipe.image) :
                        `http://127.0.0.1:5000${recipe.image}`}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {showCategory && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#2E7D32] text-white text-xs font-semibold shadow-sm">
                        {recipe.category}
                    </div>
                )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-gray-400">{recipe.prepTime}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <span className="text-xs font-medium text-gray-400">{recipe.calories} kcal</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <span className={`text-xs font-semibold ${recipe.difficulty === 'Easy' ? 'text-green-600' : recipe.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-500'}`}>{recipe.difficulty}</span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#2E7D32] transition-colors leading-snug mb-3 line-clamp-2 font-heading">
                    {recipe.title}
                </h3>
                <div className="flex justify-between items-center pt-3 border-t border-gray-50 mt-auto">
                    <div className="flex flex-wrap gap-1.5">
                        {recipe.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleBookmark(recipe); }}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${bookmarkedRecipes.some(b => b.id === recipe.id)
                            ? 'bg-[#2E7D32] text-white shadow-sm'
                            : 'bg-gray-50 text-gray-400 hover:bg-[#E8F5E9] hover:text-[#2E7D32]'
                            }`}
                    >
                        <svg className="w-4 h-4" fill={bookmarkedRecipes.some(b => b.id === recipe.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

    /* ===== Skeleton Loader ===== */
    const SkeletonGrid = ({ count = 8 }) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                    <div className="h-56 bg-gray-100 animate-pulse" />
                    <div className="p-5 space-y-3">
                        <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );

    /* ===== Section Header ===== */
    const SectionHeader = ({ label, title }) => (
        <div className="flex items-center gap-4 mb-8">
            <div>
                {label && <div className="text-xs font-semibold text-[#2E7D32] mb-0.5">{label}</div>}
                <h2 className="text-2xl font-bold text-gray-900 font-heading">{title}</h2>
            </div>
            <div className="h-px flex-grow bg-gray-100" />
        </div>
    );

    const tabs = [
        { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { id: 'search', label: 'Search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
        { id: 'bookmarks', label: 'Saved', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' },
        { id: 'myRecipes', label: 'My Recipes', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C] font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
                <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" onClick={() => setActiveTab('home')}>
                        <img src="/Cookify.png" alt="Cookify Logo" className="w-9 h-9 object-contain" />
                        <span className="text-lg font-bold text-gray-900 font-heading hidden sm:block">Cookify</span>
                    </div>

                    {/* Navigation Tabs */}
                    <nav className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-white text-[#2E7D32] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                                </svg>
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Profile / Logout */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="hidden lg:block text-right">
                            <div className="text-sm font-semibold text-gray-900 leading-none">{user?.fullName}</div>
                        </div>
                        <div
                            className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden cursor-pointer border border-gray-200 hover:ring-2 hover:ring-[#2E7D32]/20 transition-all"
                            onClick={() => setActiveTab('profile')}
                        >
                            <img
                                src={user?.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `http://127.0.0.1:5000${user.profilePicture}`) : 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png'}
                                className="w-full h-full object-cover"
                                alt="profile"
                            />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-9 h-9 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                            title="Sign Out"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-24 max-w-[1280px] mx-auto px-6">
                {/* HOME TAB */}
                {activeTab === 'home' && (
                    <div className="animate-fade-in space-y-16">
                        <div className="pb-6 border-b border-gray-100">
                            <h1 className="text-3xl font-bold text-gray-900 font-heading">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
                            <p className="text-gray-500 mt-1">Here's what's cooking today.</p>
                        </div>

                        {isLoading ? <SkeletonGrid /> : (
                            <div className="space-y-16">
                                {/* System Recipes */}
                                {recipes.filter(r => !r.userId).length > 0 && (
                                    <div>
                                        <SectionHeader label="Featured" title="Popular Recipes" />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {recipes.filter(r => !r.userId).map(r => <RecipeCard key={r.id} recipe={r} />)}
                                        </div>
                                    </div>
                                )}

                                {/* User Recipes */}
                                <div>
                                    <SectionHeader label="Community" title="From the Community" />
                                    {recipes.filter(r => r.userId).length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {recipes.filter(r => r.userId).map(r => <RecipeCard key={r.id} recipe={r} showCategory />)}
                                        </div>
                                    ) : (
                                        <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <p className="text-gray-400">No community recipes yet. Be the first to share!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* SEARCH TAB */}
                {activeTab === 'search' && (
                    <div className="animate-fade-in space-y-10">
                        <div className="max-w-2xl mx-auto text-center space-y-6 pt-8">
                            <h1 className="text-3xl font-bold text-gray-900 font-heading">Search Recipes</h1>
                            <p className="text-gray-500">Find recipes by name, ingredient, or category.</p>
                            <div className={`flex items-center bg-white border ${searchQuery ? 'border-[#2E7D32]' : 'border-gray-200'} rounded-xl p-1.5 shadow-sm transition-colors`}>
                                <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                                    {isSearching ? (
                                        <div className="w-5 h-5 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Try 'Avocado', 'Italian', or 'Breakfast'..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-grow bg-transparent border-none focus:ring-0 text-base font-medium placeholder-gray-300 text-gray-800 px-2"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="w-10 h-10 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {searchQuery.trim() === '' ? (
                            <div className="py-20 text-center text-gray-300">
                                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <p className="text-sm font-medium">Start typing to search</p>
                            </div>
                        ) : isSearching ? <SkeletonGrid count={4} /> : searchResults.length > 0 ? (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-sm font-semibold text-[#2E7D32]">{searchResults.length} result{searchResults.length !== 1 && 's'} found</span>
                                    <div className="h-px flex-grow bg-gray-100" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {searchResults.map(r => <RecipeCard key={r.id} recipe={r} showCategory />)}
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="text-4xl mb-4">🍽️</div>
                                <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">No results found</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    No recipes match "<span className="font-semibold text-gray-700">{searchQuery}</span>". Try a different search term.
                                </p>
                                <button onClick={() => setSearchQuery('')} className="mt-6 px-6 py-2.5 bg-[#2C2C2C] text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors">
                                    Clear Search
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* BOOKMARKS TAB */}
                {activeTab === 'bookmarks' && (
                    <div className="animate-fade-in space-y-10">
                        <div className="pb-6 border-b border-gray-100">
                            <h1 className="text-3xl font-bold text-gray-900 font-heading">Saved Recipes</h1>
                            <p className="text-gray-500 mt-1">Your personal collection of favorite recipes.</p>
                        </div>

                        {isBookmarksLoading ? <SkeletonGrid count={4} /> : bookmarkedRecipes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {bookmarkedRecipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <div className="text-4xl mb-4">🔖</div>
                                <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">No saved recipes</h3>
                                <p className="text-gray-500 max-w-md mx-auto">Recipes you save will appear here for quick access.</p>
                                <button onClick={() => setActiveTab('home')} className="mt-6 px-6 py-2.5 bg-[#2E7D32] text-white rounded-lg text-sm font-semibold hover:bg-[#1B5E20] transition-colors">
                                    Explore Recipes
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* MY RECIPES TAB */}
                {activeTab === 'myRecipes' && (
                    <div className="animate-fade-in space-y-10">
                        <div className="pb-6 border-b border-gray-100">
                            <h1 className="text-3xl font-bold text-gray-900 font-heading">My Recipes</h1>
                            <p className="text-gray-500 mt-1">Manage the recipes you've shared with the community.</p>
                        </div>
                        <MyRecipes refreshKey={isModalOpen} onEdit={handleEdit} />
                    </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="animate-reveal max-w-5xl mx-auto pb-20">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Sidebar: Avatar and Quick Stats */}
                            <div className="lg:w-1/3 space-y-6">
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center space-y-6">
                                    {/* Avatar section */}
                                    <div className="relative inline-block group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
                                        <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleProfilePictureChange} />
                                        <div className="w-32 h-32 rounded-[40px] bg-gray-50 p-1 border-2 border-dashed border-gray-200 group-hover:border-[#2E7D32] transition-colors overflow-hidden">
                                            {isUploadingProfile ? (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            ) : (
                                                <img
                                                    src={user?.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `http://127.0.0.1:5000${user.profilePicture}`) : 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png'}
                                                    className="w-full h-full object-cover rounded-[32px] shadow-sm transform group-hover:scale-105 transition-transform duration-500"
                                                    alt="profile"
                                                />
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#2E7D32] rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg shadow-green-500/20 transform group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                    </div>

                                    {/* Name and Handle */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 font-heading tracking-tight">{user?.fullName}</h2>
                                        <p className="text-sm font-semibold text-[#2E7D32] tracking-wider uppercase mt-1">@{user?.username}</p>
                                    </div>

                                    {/* Mini Stats Row */}
                                    <div className="flex items-center justify-center gap-6 pt-4">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-gray-900">{recipes.filter(r => r.userId === user?.id).length}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Shared</div>
                                        </div>
                                        <div className="w-px h-8 bg-gray-100" />
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-gray-900">{bookmarkedRecipes.length}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Saved</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-3xl p-8 text-white shadow-xl shadow-green-900/10">
                                    <h3 className="text-lg font-bold font-heading mb-2">Grow the Community</h3>
                                    <p className="text-sm text-green-100/80 leading-relaxed mb-6">Your shared recipes help thousands of food lovers discover new flavors.</p>
                                    <button
                                        onClick={() => setActiveTab('myRecipes')}

                                        className="w-full py-3 bg-white text-[#2E7D32] rounded-xl font-bold text-sm shadow-lg hover:shadow-white/20 transition-all active:scale-95"
                                    >
                                        Manage My Recipes
                                    </button>
                                </div>
                            </div>

                            {/* Right Side: Detailed Information Panels */}
                            <div className="lg:w-2/3 space-y-6">
                                {/* Personal Info Panel */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-reveal">
                                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-900 font-heading">Personal Information</h3>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1 bg-white border border-gray-100 rounded-lg">Verified Account</div>
                                    </div>
                                    <div className="p-8 grid md:grid-cols-2 gap-8">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                <span className="text-sm font-semibold text-gray-800">{user?.fullName}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 text-sm font-semibold text-gray-800">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16" /></svg>
                                                {user?.username}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 text-sm font-semibold text-gray-800">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Security and Actions Panel */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-reveal delay-100">
                                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50">
                                        <h3 className="text-lg font-bold text-gray-900 font-heading">Security & Sessions</h3>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-red-100/50 text-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-gray-900">Sign Out</h4>
                                                    <p className="text-xs text-gray-400 font-medium">Clear your local session and re-authenticate.</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 hover:border-red-600 hover:text-white transition-all shadow-sm"
                                            >
                                                Logout
                                            </button>
                                        </div>

                                        <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300">
                                            <div className="flex items-center justify-between p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 ${showPasswordForm ? 'bg-[#2E7D32] text-white' : 'bg-gray-100 text-gray-400'} rounded-xl flex items-center justify-center transition-colors`}>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-bold text-gray-900">Change Password</h4>
                                                        <p className="text-xs text-gray-400 font-medium">Improve your vault security easily.</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                                                    className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${showPasswordForm ? 'bg-gray-200 text-gray-600' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32]'}`}
                                                >
                                                    {showPasswordForm ? 'Cancel' : 'Change'}
                                                </button>
                                            </div>

                                            {showPasswordForm && (
                                                <form onSubmit={handlePasswordChange} className="px-6 pb-6 pt-2 space-y-4 animate-reveal">
                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                                                            <input
                                                                type="password"
                                                                required
                                                                value={passwordData.currentPassword}
                                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 outline-none transition-all"
                                                                placeholder="••••••••"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                                            <input
                                                                type="password"
                                                                required
                                                                value={passwordData.newPassword}
                                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:border-[#2E7D32] focus:ring-4 focus:ring-[#2E7D32]/5 outline-none transition-all"
                                                                placeholder="Min. 6 characters"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={isChangingPassword}
                                                        className="w-full py-3 bg-[#2E7D32] text-white rounded-xl font-bold text-sm shadow-lg shadow-green-500/10 hover:bg-[#1B5E20] transition-all disabled:opacity-50"
                                                    >
                                                        {isChangingPassword ? 'Updating...' : 'Update Password'}
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* FAB for My Recipes */}
            {activeTab === 'myRecipes' && (
                <div className="fixed bottom-8 right-8 z-50">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-14 h-14 bg-[#2E7D32] rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center hover:bg-[#1B5E20] hover:shadow-xl transition-all active:scale-95 group"
                        title="Create Recipe"
                    >
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            )}

            <RecipeCreateModal
                isOpen={isModalOpen}
                editRecipe={editingRecipe}
                onClose={() => { setIsModalOpen(false); setEditingRecipe(null); }}
                onSuccess={() => {
                    fetchRecipes();
                    if (activeTab === 'myRecipes') {
                        setActiveTab('home');
                        setTimeout(() => setActiveTab('myRecipes'), 10);
                    }
                }}
            />
        </div>
    );
};

export default DashboardPage;
