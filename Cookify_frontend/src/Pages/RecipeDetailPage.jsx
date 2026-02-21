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
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
                <div className="w-16 h-16 border-t-4 border-green-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!recipe) return null;

    return (
        <div className="min-h-screen bg-[#fafaf9] text-gray-900 font-sans pb-20">
            {/* Header / Hero */}
            <div className="relative h-[70vh] overflow-hidden">
                <img
                    src={recipe.image.includes('http') ?
                        (recipe.image.includes('cloudinary') ? recipe.image.replace('/upload/', '/upload/c_fill,g_auto,w_2560,h_1440/') : recipe.image) :
                        `http://localhost:5000${recipe.image}`}
                    alt={recipe.title}
                    className="w-full h-full object-cover brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fafaf9] via-[#fafaf9]/20 to-transparent" />

                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="absolute top-10 left-10 p-5 rounded-[24px] bg-white shadow-2xl border border-black/[0.03] hover:bg-green-50 transition-all group z-20"
                >
                    <img src={icons.back} className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" alt="back" />
                </button>

                <div className="absolute bottom-20 left-0 w-full page-container space-y-8 animate-fade-up">
                    <div className="inline-flex px-5 py-2.5 rounded-full bg-green-500 text-white text-[10px] font-black tracking-[0.2em] uppercase shadow-lg shadow-green-500/20">
                        {recipe.category}
                    </div>
                    <h1 className="text-7xl md:text-[120px] font-black tracking-tighter text-gray-900 leading-[0.85]">
                        {recipe.title}
                    </h1>
                </div>
            </div>

            {/* Content Container */}
            <div className="page-container -mt-10 relative z-10 grid lg:grid-cols-4 gap-16">

                {/* Info Cards */}
                <div className="lg:col-span-3 space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { label: 'Prep Time', val: recipe.prepTime, icon: icons.time, color: 'text-green-600', bg: 'bg-green-50' },
                            { label: 'Calories', val: `${recipe.calories} kcal`, icon: icons.fire, color: 'text-orange-600', bg: 'bg-orange-50' },
                            { label: 'Difficulty', val: recipe.difficulty, icon: icons.level, color: 'text-yellow-600', bg: 'bg-yellow-50' }
                        ].map((item, i) => (
                            <div key={i} className={`p-10 rounded-[40px] border border-black/[0.03] space-y-6 shadow-sm hover:shadow-xl transition-all bg-white`}>
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center`}>
                                    <img src={item.icon} className={`w-6 h-6 object-contain`} alt={item.label} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</div>
                                    <div className={`text-2xl font-black ${item.color}`}>{item.val}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-4xl font-black tracking-tighter">The Narrative</h2>
                            <div className="h-0.5 flex-grow bg-black/[0.05]" />
                        </div>
                        <p className="text-2xl text-gray-500 leading-relaxed font-medium italic max-w-5xl">
                            "{recipe.description}"
                        </p>
                    </div>

                    {/* Ingredients Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h2 className="text-4xl font-black tracking-tighter">Ingredients</h2>
                            <div className="h-0.5 flex-grow bg-black/[0.05]" />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                recipe.ingredients.map((ing, i) => (
                                    <div key={i} className="px-8 py-5 rounded-[28px] bg-white border border-black/[0.03] shadow-sm flex items-center gap-4 group hover:border-green-500 transition-all">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 group-hover:scale-150 transition-transform" />
                                        <span className="text-lg font-bold text-gray-700">{ing}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 font-medium">No specific ingredients listed.</p>
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-white rounded-[56px] p-16 shadow-2xl shadow-black/[0.02] border border-black/[0.01] space-y-12">
                        <h3 className="text-3xl font-black tracking-tighter uppercase">Preparation Method</h3>
                        <div className="space-y-12">
                            {recipe.instructions ? (
                                recipe.instructions.split('\n').filter(step => step.trim() !== '').map((step, index) => (
                                    <div key={index} className="flex gap-12 group">
                                        <div className="flex-shrink-0 w-16 h-16 rounded-[24px] bg-green-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-green-500/20 transform group-hover:rotate-6 transition-transform">
                                            {index + 1}
                                        </div>
                                        <div className="space-y-3 pt-2">
                                            <p className="text-xl text-gray-600 leading-relaxed font-bold">
                                                {step.replace(/^Step \d+:? /i, '')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 rounded-[32px] bg-gray-50 border border-dashed border-gray-200 text-center text-gray-400 font-bold">
                                    The preparation method is currently a guarded secret.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-10 lg:pt-16">
                    <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-black/[0.01] space-y-10 sticky top-32">
                        <div className="flex items-center gap-6 pb-10 border-b border-black/[0.05]">
                            <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center p-4 shadow-lg shadow-orange-500/20">
                                <img src={icons.chef} className="w-full h-full object-contain brightness-0 invert" alt="chef" />
                            </div>
                            <div>
                                <div className="text-lg font-black text-gray-900">{recipe.User?.fullName || 'Master Chef'}</div>
                                <div className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Verified Creator</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Culinary Tags</div>
                            <div className="flex flex-wrap gap-3">
                                {recipe.tags?.map(tag => (
                                    <span key={tag} className="px-5 py-2.5 rounded-2xl bg-gray-50 border border-black/[0.02] text-xs font-bold text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors cursor-default">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => toast.success('Recipe secured in your vault!')}
                            className="w-full py-6 rounded-[24px] btn-brand text-white font-black text-lg shadow-2xl shadow-green-500/30 active:scale-95"
                        >
                            Save to Vault
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailPage;
