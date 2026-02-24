import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import recipeService from '../../services/recipeService';
import toast from 'react-hot-toast';

const MyRecipes = ({ onEdit }) => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [recipeToDelete, setRecipeToDelete] = useState(null);

    useEffect(() => {
        fetchMyRecipes();
    }, []);

    const fetchMyRecipes = async () => {
        setIsLoading(true);
        try {
            const response = await recipeService.getMyRecipes();
            if (response.success) setRecipes(response.data);
        } catch (error) {
            console.error('Error fetching my recipes:', error);
        } finally { setIsLoading(false); }
    };

    const confirmDelete = async () => {
        if (!recipeToDelete) return;

        const loadingToast = toast.loading('Deleting recipe...');
        try {
            const response = await recipeService.deleteRecipe(recipeToDelete.id);
            if (response.success) {
                toast.success('Recipe deleted successfully!', { id: loadingToast });
                setRecipes(prev => prev.filter(r => r.id !== recipeToDelete.id));
                setRecipeToDelete(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete recipe', { id: loadingToast });
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                        <div className="h-56 bg-gray-100 animate-pulse" />
                        <div className="p-5 space-y-3">
                            <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
                            <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-4xl mb-4">👨‍🍳</div>
                <h3 className="text-xl font-bold text-gray-900 font-heading mb-1">No recipes yet</h3>
                <p className="text-gray-500 text-sm">Start sharing your first recipe with the community.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
                    >
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={recipe.image.startsWith('http') ? recipe.image : `http://127.0.0.1:5000${recipe.image}`}
                                alt={recipe.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Actions overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}
                                    className="w-32 py-2.5 bg-white text-gray-900 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg"
                                >
                                    <svg className="w-4 h-4 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setRecipeToDelete(recipe); }}
                                    className="w-32 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#2E7D32] transition-colors leading-snug line-clamp-2 mb-3 font-heading">
                                {recipe.title}
                            </h3>
                            <div className="flex items-center gap-4 pt-3 border-t border-gray-50 mt-auto">
                                <span className="text-xs font-medium text-gray-400">{recipe.prepTime}</span>
                                <span className="text-xs font-medium text-gray-400">{recipe.calories} kcal</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Delete Confirmation Modal */}
            {recipeToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 font-heading">Delete Recipe?</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                Are you sure you want to delete <span className="font-semibold text-gray-900">"{recipeToDelete.title}"</span>? This action cannot be undone.
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setRecipeToDelete(null)}
                                    className="flex-1 py-3 px-4 bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600 shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyRecipes;
