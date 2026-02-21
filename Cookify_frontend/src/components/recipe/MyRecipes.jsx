import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import recipeService from '../../services/recipeService';

const MyRecipes = () => {
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
                    className="group bg-white rounded-[40px] overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border border-black/[0.03]"
                >
                    <div className="relative h-64 overflow-hidden">
                        <img
                            src={recipe.image.startsWith('http') ? recipe.image : `http://localhost:5000${recipe.image}`}
                            alt={recipe.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-green-600 shadow-sm">
                            {recipe.category}
                        </div>
                    </div>
                    <div className="p-8 space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors uppercase tracking-tight">
                            {recipe.title}
                        </h3>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <span className="text-sm font-bold">{recipe.prepTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <span className="text-sm font-bold">{recipe.calories} kcal</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyRecipes;
