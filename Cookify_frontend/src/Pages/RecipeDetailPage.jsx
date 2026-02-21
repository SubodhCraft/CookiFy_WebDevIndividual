import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import recipeService from '../services/recipeService';
import authService from '../services/authService';

const RecipeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
    }, [id]);

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
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-16 h-16 border-t-4 border-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!recipe) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans pb-20">
            {/* Header / Hero */}
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src={recipe.image.includes('cloudinary') ? recipe.image.replace('/upload/', '/upload/c_fill,g_auto,w_1920,h_1080/') : recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="absolute top-10 left-10 p-4 rounded-2xl glass-card border-white/10 hover:bg-white/10 transition-all group z-20"
                >
                    <img src={icons.back} className="w-6 h-6 invert opacity-60 group-hover:opacity-100 transition-opacity" alt="back" />
                </button>

                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 lg:px-12 space-y-6">
                    <div className="inline-flex px-4 py-2 rounded-xl glass-card border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase">
                        {recipe.category}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-none">
                        {recipe.title}
                    </h1>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-10 relative z-10 grid lg:grid-cols-3 gap-12">

                {/* Info Cards */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="grid grid-cols-3 gap-6">
                        {[
                            { label: 'Prep Time', val: recipe.prepTime, icon: icons.time, color: 'text-indigo-400' },
                            { label: 'Calories', val: `${recipe.calories} kcal`, icon: icons.fire, color: 'text-orange-400' },
                            { label: 'Level', val: recipe.difficulty, icon: icons.level, color: 'text-emerald-400' }
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-8 border-white/5 space-y-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                    <img src={item.icon} className={`w-6 h-6 object-contain ${item.color.includes('indigo') ? 'brightness-200' : ''}`} alt={item.label} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</div>
                                    <div className={`text-xl font-bold ${item.color}`}>{item.val}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight">The Story</h2>
                        <div className="w-12 h-1 bg-indigo-500 rounded-full" />
                        <p className="text-xl text-slate-400 leading-relaxed font-light italic">
                            "{recipe.description}"
                        </p>
                    </div>

                    {/* Placeholder for real instructions if we had them in model */}
                    <div className="glass-card p-10 border-white/5 space-y-8">
                        <h3 className="text-2xl font-bold">Preparation</h3>
                        <div className="space-y-8">
                            {[1, 2, 3].map(step => (
                                <div key={step} className="flex gap-8 group">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-xl font-bold text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        {step}
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <div className="text-lg font-bold text-white">Artisanal Step {step}</div>
                                        <p className="text-slate-500 leading-relaxed">
                                            Follow the professional techniques optimized for this gourmet dish. Ensure all ingredients are fresh and sourced locally for the best flavor profile.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="glass-card p-10 border-white/5 space-y-8 sticky top-32">
                        <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center p-3 shadow-lg shadow-indigo-500/20">
                                <img src={icons.chef} className="w-full h-full object-contain brightness-0 invert" alt="chef" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Cloudinary Kitchen</div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Verified Publisher</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="text-sm font-bold uppercase tracking-widest text-slate-500">Expert Tags</div>
                            <div className="flex flex-wrap gap-3">
                                {recipe.tags?.map(tag => (
                                    <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm font-medium text-slate-300">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => toast.success('Recipe saved to your vault!')}
                            className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all"
                        >
                            Save to Bookmarks
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailPage;
