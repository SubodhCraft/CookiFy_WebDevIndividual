import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import recipeService from '../../services/recipeService';
import Input from '../common/Input';
import Button from '../common/Button';

const RecipeCreateModal = ({ isOpen, onClose, onSuccess, editRecipe = null }) => {
    const [formData, setFormData] = useState({
        title: '', description: '', prepTime: '', calories: '',
        difficulty: 'Medium', category: '', tags: '', instructions: ''
    });
    const [ingredients, setIngredients] = useState(['']);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (editRecipe && isOpen) {
            setFormData({
                title: editRecipe.title || '', description: editRecipe.description || '',
                prepTime: editRecipe.prepTime || '', calories: editRecipe.calories || '',
                difficulty: editRecipe.difficulty || 'Medium', category: editRecipe.category || '',
                tags: Array.isArray(editRecipe.tags) ? editRecipe.tags.join(', ') : (editRecipe.tags || ''),
                instructions: editRecipe.instructions || ''
            });
            setIngredients(Array.isArray(editRecipe.ingredients) ? editRecipe.ingredients : (editRecipe.ingredients ? editRecipe.ingredients.split(', ') : ['']));
            if (editRecipe.image) setPreview(editRecipe.image.startsWith('http') ? editRecipe.image : `http://127.0.0.1:5000${editRecipe.image}`);
        } else if (!editRecipe && isOpen) {
            setFormData({ title: '', description: '', prepTime: '', calories: '', difficulty: 'Medium', category: '', tags: '', instructions: '' });
            setIngredients(['']);
            setImage(null);
            setPreview(null);
        }
    }, [editRecipe, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleIngredientChange = (i, val) => { const n = [...ingredients]; n[i] = val; setIngredients(n); };
    const addIngredient = () => setIngredients([...ingredients, '']);
    const removeIngredient = (i) => { if (ingredients.length > 1) setIngredients(ingredients.filter((_, idx) => idx !== i)); };
    const handleImageChange = (e) => { const f = e.target.files[0]; if (f) { setImage(f); setPreview(URL.createObjectURL(f)); } };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image && !editRecipe) { toast.error('Please upload a recipe image'); return; }
        const filtered = ingredients.filter(ing => ing.trim() !== '');
        if (filtered.length === 0) { toast.error('Please add at least one ingredient'); return; }

        const data = new FormData();
        Object.keys(formData).forEach(k => data.append(k, formData[k]));
        data.append('ingredients', filtered.join(', '));
        if (image) data.append('image', image);

        setIsLoading(true);
        const loadingToast = toast.loading(editRecipe ? 'Updating recipe...' : 'Creating recipe...');
        try {
            const response = editRecipe
                ? await recipeService.updateRecipe(editRecipe.id, data)
                : await recipeService.createRecipe(data);
            if (response.success) {
                toast.success(editRecipe ? 'Recipe updated!' : 'Recipe published!', { id: loadingToast });
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save recipe', { id: loadingToast });
        } finally { setIsLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl flex flex-col animate-fade-in">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-gray-900 font-heading">
                                {editRecipe ? 'Edit Recipe' : 'New Recipe'}
                            </h2>
                            {editRecipe && (
                                <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-lg">
                                    Editing
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to share your recipe.</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto px-8 py-8">
                    <div className="grid lg:grid-cols-2 gap-10">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">Recipe Image</label>
                                <div className="relative group aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-[#2E7D32] transition-all cursor-pointer bg-gray-50">
                                    {preview ? (
                                        <img src={preview} className="absolute inset-0 w-full h-full object-cover" alt="preview" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-3">
                                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                                <svg className="w-7 h-7 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-medium text-gray-400">Click to upload photo</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                                </div>
                            </div>

                            <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Classic Margherita Pizza" required />

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 min-h-[120px] text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10"
                                    placeholder="What makes this dish special?"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Prep Time" name="prepTime" value={formData.prepTime} onChange={handleChange} placeholder="e.g. 45 mins" required />
                                <Input label="Calories" name="calories" type="number" value={formData.calories} onChange={handleChange} placeholder="e.g. 520" required />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Ingredients */}
                            <div className="space-y-3 bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-700">Ingredients</label>
                                    <button
                                        type="button"
                                        onClick={addIngredient}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E7D32] text-white rounded-lg text-xs font-semibold hover:bg-[#1B5E20] transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                        Add
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                    {ingredients.map((ing, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                value={ing}
                                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                                className="flex-grow bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10"
                                                placeholder={index === 0 ? 'e.g. 2 cups flour' : 'e.g. 1 tsp salt'}
                                            />
                                            {ingredients.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeIngredient(index)}
                                                    className="w-10 h-10 rounded-lg bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all flex-shrink-0"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 cursor-pointer"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <Input label="Category" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Italian" required />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                                <textarea
                                    name="instructions"
                                    value={formData.instructions}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 min-h-[180px] text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 leading-relaxed"
                                    placeholder={"Step 1: Preheat oven to 200°C...\nStep 2: Mix ingredients together..."}
                                />
                            </div>

                            <Input label="Tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. healthy, quick, dinner" />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-5 bg-white border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <Button type="submit" onClick={handleSubmit} disabled={isLoading} variant="primary" className="px-8 py-2.5">
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>{editRecipe ? 'Updating...' : 'Publishing...'}</span>
                            </div>
                        ) : (editRecipe ? 'Update Recipe' : 'Publish Recipe')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCreateModal;
