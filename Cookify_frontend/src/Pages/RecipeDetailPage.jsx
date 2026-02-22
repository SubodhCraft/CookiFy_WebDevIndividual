import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import recipeService from '../services/recipeService';
import bookmarkService from '../services/bookmarkService';
import authService from '../services/authService';

const RecipeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const icons = {
        back: "https://cdn-icons-png.flaticon.com/512/271/271220.png",
        time: "https://cdn-icons-png.flaticon.com/512/2088/2088617.png",
        fire: "https://cdn-icons-png.flaticon.com/512/426/426833.png",
        level: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png",
        chef: "https://cdn-icons-png.flaticon.com/512/3461/3461901.png"
    };

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/signin');
            return;
        }
        fetchRecipeDetails();
        checkBookmarkStatus();
    }, [id]);

    const checkBookmarkStatus = async () => {
        try {
            const response = await bookmarkService.checkBookmark(id);
            if (response.success) {
                setIsBookmarked(response.isBookmarked);
            }
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    const handleToggleBookmark = async () => {
        setIsToggling(true);
        try {
            const response = await bookmarkService.toggleBookmark(id);
            if (response.success) {
                setIsBookmarked(response.isBookmarked);
                toast.success(response.message, {
                    icon: response.isBookmarked ? '🔖' : '🗑️',
                });
            }
        } catch (error) {
            toast.error('Failed to update bookmark');
            console.error('Bookmark toggle error:', error);
        } finally {
            setIsToggling(false);
        }
    };

    const fetchRecipeDetails = async () => {
        setIsLoading(true);
        try {
            const response = await recipeService.getRecipeById(id);
            if (response.success) {
                setRecipe(response.data);
            } else {
                toast.error('Recipe not found');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error fetching recipe:', error);
            toast.error('Failed to load recipe details');
            navigate('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
                <div className="w-16 h-16 border-t-4 border-green-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!recipe) return null;

    return (
        <div className="min-h-screen bg-[#fafaf9] text-gray-900 font-sans pb-32">
            {/* Header / Hero */}
            <div className="relative h-[80vh] overflow-hidden">
                <img
                    src={recipe.image.includes('http') ?
                        (recipe.image.includes('cloudinary') ? recipe.image.replace('/upload/', '/upload/c_fill,g_auto,w_2560,h_1440/') : recipe.image) :
                        `http://localhost:5000${recipe.image}`}
                    alt={recipe.title}
                    className="w-full h-full object-cover brightness-[0.8] transition-transform duration-[2s] hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf9] via-[#fafaf9]/40 to-transparent" />

                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="absolute top-12 left-12 p-6 rounded-[32px] bg-white/90 backdrop-blur-xl shadow-2xl border border-black/[0.03] hover:bg-green-500 hover:scale-110 transition-all group z-20"
                >
                    <img src={icons.back} className="w-6 h-6 opacity-60 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition-all" alt="back" />
                </button>

                <div className="absolute bottom-24 left-0 w-full page-container space-y-10 animate-fade-up">
                    <div className="inline-flex px-6 py-3 rounded-full bg-green-500 text-white text-[11px] font-black tracking-[0.3em] uppercase shadow-2xl shadow-green-500/30">
                        {recipe.category}
                    </div>
                    <h1 className="text-8xl md:text-[140px] font-black tracking-tighter text-gray-900 leading-[0.8] max-w-6xl">
                        {recipe.title}
                    </h1>
                </div>
            </div>

            {/* Content Container */}
            <div className="page-container -mt-16 relative z-10 grid lg:grid-cols-4 gap-20">

                {/* Info Cards */}
                <div className="lg:col-span-3 space-y-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { label: 'Preparation', val: recipe.prepTime, icon: icons.time, color: 'text-green-600', bg: 'bg-green-500/10' },
                            { label: 'Energy Content', val: `${recipe.calories} kcal`, icon: icons.fire, color: 'text-orange-600', bg: 'bg-orange-500/10' },
                            { label: 'Skill Required', val: recipe.difficulty, icon: icons.level, color: 'text-yellow-600', bg: 'bg-yellow-500/10' }
                        ].map((item, i) => (
                            <div key={i} className={`p-12 rounded-[56px] border border-black/[0.02] space-y-8 shadow-2xl shadow-black/[0.01] hover:shadow-black/[0.05] transition-all bg-white group cursor-default`}>
                                <div className={`w-16 h-16 rounded-[24px] ${item.bg} flex items-center justify-center group-hover:rotate-12 transition-transform duration-500`}>
                                    <img src={item.icon} className={`w-7 h-7 object-contain`} alt={item.label} />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{item.label}</div>
                                    <div className={`text-3xl font-black ${item.color} tracking-tight`}>{item.val}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-10">
                        <div className="flex items-center gap-6">
                            <h2 className="text-5xl font-black tracking-tighter uppercase italic text-gray-300">The Story</h2>
                            <div className="h-[1px] flex-grow bg-black/[0.05]" />
                        </div>
                        <p className="text-3xl text-gray-600 leading-[1.6] font-medium italic max-w-6xl">
                            "{recipe.description}"
                        </p>
                    </div>

                    {/* Ingredients Section */}
                    <div className="space-y-12">
                        <div className="flex items-center gap-6">
                            <h2 className="text-5xl font-black tracking-tighter uppercase italic text-gray-300">Elements</h2>
                            <div className="h-[1px] flex-grow bg-black/[0.05]" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                recipe.ingredients.map((ing, i) => (
                                    <div key={i} className="px-10 py-7 rounded-[32px] bg-white border border-black/[0.02] shadow-sm flex items-center gap-6 group hover:border-green-500 transition-all">
                                        <div className="w-3 h-3 rounded-full bg-green-500 group-hover:scale-[2] transition-transform duration-500" />
                                        <span className="text-xl font-bold text-gray-800 tracking-tight">{ing}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 font-bold text-xl italic">No elements listed.</p>
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-white rounded-[72px] p-20 shadow-2xl shadow-black/[0.02] border border-black/[0.01] space-y-16">
                        <h3 className="text-4xl font-black tracking-tighter uppercase italic text-gray-400">Mastery Steps</h3>
                        <div className="space-y-16">
                            {recipe.instructions ? (
                                recipe.instructions.split('\n').filter(step => step.trim() !== '').map((step, index) => (
                                    <div key={index} className="flex gap-16 group">
                                        <div className="flex-shrink-0 w-20 h-20 rounded-[32px] bg-green-500 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-green-500/40 transition-all group-hover:rotate-[12deg] group-hover:scale-110">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </div>
                                        <div className="space-y-4 pt-4">
                                            <p className="text-2xl text-gray-800 leading-[1.5] font-bold tracking-tight">
                                                {step.replace(/^Step \d+:? /i, '')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-16 rounded-[48px] bg-gray-50 border border-dashed border-gray-200 text-center text-gray-400 font-black uppercase tracking-widest">
                                    Confidential Preparation Method
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-12 lg:pt-24">
                    <div className="bg-white rounded-[56px] p-12 shadow-[0_32px_80px_rgba(0,0,0,0.04)] border border-black/[0.01] space-y-12 sticky top-36">
                        <div className="flex items-center gap-8 pb-12 border-b border-black/[0.05]">
                            <div className="w-20 h-20 rounded-[28px] bg-orange-500 flex items-center justify-center p-5 shadow-2xl shadow-orange-500/30">
                                <img src={icons.chef} className="w-full h-full object-contain brightness-0 invert" alt="chef" />
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl font-black text-gray-900 tracking-tight leading-none">{recipe.User?.fullName || 'Master Chef'}</div>
                                <div className="text-[11px] text-green-600 font-black uppercase tracking-[0.2em]">Verified Creator</div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Culinary Taxonomy</div>
                            <div className="flex flex-wrap gap-4">
                                {recipe.tags?.map(tag => (
                                    <span key={tag} className="px-6 py-3 rounded-2xl bg-gray-50 border border-black/[0.02] text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-green-500 hover:text-white transition-all cursor-default">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleToggleBookmark}
                            disabled={isToggling}
                            className={`w-full py-7 rounded-[32px] font-black text-xl shadow-2xl transition-all active:scale-95 disabled:opacity-50 ring-8 ring-transparent hover:ring-black/[0.02] ${isBookmarked
                                ? 'bg-orange-500 text-white shadow-orange-500/40'
                                : 'bg-green-500 text-white shadow-green-500/40'
                                }`}
                        >
                            {isToggling ? 'Syncing...' : isBookmarked ? 'Remove from Vault' : 'Secure to Vault'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailPage;
