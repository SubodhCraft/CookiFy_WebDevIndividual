import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import recipeService from '../../services/recipeService';

const MyRecipes = ({ onEdit }) => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMyRecipes();
    }, []);

    const fetchMyRecipes = async () => {
        setIsLoading(true);
        try {
            const response = await recipeService.getMyRecipes();
            if (response.success) {
                setRecipes(response.data);
            }
        } catch (error) {
            console.error('Error fetching my recipes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-[400px] rounded-3xl bg-gray-100 animate-pulse" />
                ))}
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-black/[0.03] space-y-6">
                <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center text-4xl">👨‍🍳</div>
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter">No Recipes Shared Yet</h3>
                    <p className="text-gray-500 font-medium">Start your culinary legacy by sharing your first recipe.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {recipes.map((recipe) => (
                <div
                    key={recipe.id}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    className="group bg-white rounded-[40px] overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-100 flex flex-col"
                >
                    <div className="relative h-60 overflow-hidden">
                        <img
                            src={recipe.image.startsWith('http') ? recipe.image : `http://localhost:5000${recipe.image}`}
                            alt={recipe.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        {/* Edit Button Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(recipe);
                                }}
                                className="px-6 py-3 bg-white text-slate-900 rounded-[20px] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-110 transition-transform shadow-2xl"
                            >
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                Edit Recipe
                            </button>
                        </div>
                    </div>
                    <div className="p-10 flex flex-col gap-10 flex-grow">
                        <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors uppercase tracking-tight leading-tight">
                            {recipe.title}
                        </h3>
                        <div className="flex items-center gap-8 pt-8 border-t border-slate-100 mt-auto">
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <span className="text-[11px] font-black uppercase tracking-widest">{recipe.prepTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-orange-500/80">
                                <span className="text-[11px] font-black uppercase tracking-widest">{recipe.calories} kcal</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyRecipes;
