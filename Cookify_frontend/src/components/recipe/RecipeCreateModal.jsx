import { useState } from 'react';
import toast from 'react-hot-toast';
import recipeService from '../../services/recipeService';
import Input from '../common/Input';
import Button from '../common/Button';

const RecipeCreateModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        prepTime: '',
        calories: '',
        difficulty: 'Medium',
        category: '',
        tags: '',
        instructions: ''
    });

    const [ingredients, setIngredients] = useState(['']);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => setIngredients([...ingredients, '']);
    const removeIngredient = (index) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            toast.error('Please upload a recipe image');
            return;
        }

        const filteredIngredients = ingredients.filter(ing => ing.trim() !== '');
        if (filteredIngredients.length === 0) {
            toast.error('Please add at least one ingredient');
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        // Custom append for arrays
        data.append('ingredients', filteredIngredients.join(', '));
        data.append('image', image);

        setIsLoading(true);
        const loadingToast = toast.loading('Publishing your masterpiece...');

        try {
            const response = await recipeService.createRecipe(data);
            if (response.success) {
                toast.success('Recipe shared with the world!', { id: loadingToast });
                onSuccess();
                onClose();
                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    prepTime: '',
                    calories: '',
                    difficulty: 'Medium',
                    category: '',
                    tags: '',
                    instructions: ''
                });
                setIngredients(['']);
                setImage(null);
                setPreview(null);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to share recipe', { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden bg-white rounded-[48px] shadow-2xl animate-fade-up flex flex-col">
                {/* Header */}
                <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Craft Your Recipe</h2>
                        <p className="text-gray-500 font-medium">Detailed precision for better cooking results.</p>
                    </div>
                    <button onClick={onClose} className="w-14 h-14 rounded-2xl hover:bg-gray-100 flex items-center justify-center transition-colors group">
                        <svg className="w-7 h-7 text-gray-400 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Form */}
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-10 custom-scrollbar">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Left Column: Visuals & Basics */}
                        <div className="space-y-10">
                            <section className="space-y-6">
                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-green-600 ml-1">Hero Visual</label>
                                <div className="relative group aspect-video rounded-[32px] overflow-hidden border-2 border-dashed border-gray-200 hover:border-green-500 transition-all cursor-pointer bg-gray-50/50">
                                    {preview ? (
                                        <img src={preview} className="absolute inset-0 w-full h-full object-cover" alt="preview" />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-5">
                                            <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="font-black text-xs uppercase tracking-widest">Upload Masterpiece Photo</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </section>

                            <Input label="Recipe Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Grandma's Secret Sunday Roast" required />

                            <div className="space-y-3">
                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-green-600 ml-1">The Story / Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-black/[0.03] rounded-3xl px-8 py-6 min-h-[140px] focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-gray-900 font-medium placeholder:text-gray-300"
                                    placeholder="What makes this dish special?"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <Input label="Prep Time" name="prepTime" value={formData.prepTime} onChange={handleChange} placeholder="e.g. 45 mins" required />
                                <Input label="Calories" name="calories" type="number" value={formData.calories} onChange={handleChange} placeholder="e.g. 520" required />
                            </div>
                        </div>

                        {/* Right Column: Details & Method */}
                        <div className="space-y-10">
                            {/* Ingredients section */}
                            <section className="space-y-6 bg-gray-50/50 p-8 rounded-[40px] border border-black/[0.02]">
                                <div className="flex justify-between items-center px-1">
                                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-green-600">Pure Ingredients</label>
                                    <button
                                        type="button"
                                        onClick={addIngredient}
                                        className="p-2.5 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20 hover:scale-105 transition-all text-xs font-bold flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                        Add Item
                                    </button>
                                </div>
                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {ingredients.map((ing, index) => (
                                        <div key={index} className="flex gap-3 animate-fade-in">
                                            <input
                                                value={ing}
                                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                                className="flex-grow bg-white border border-black/[0.05] rounded-2xl px-6 py-4 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-gray-900 font-bold placeholder:text-gray-200 text-sm"
                                                placeholder={`e.g. ${index === 0 ? '2kg Fresh Organic Beef' : 'Pinch of sea salt'}`}
                                            />
                                            {ingredients.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeIngredient(index)}
                                                    className="w-14 h-14 rounded-2xl bg-white border border-red-50 hover:bg-red-50 text-red-400 flex items-center justify-center transition-all shadow-sm"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-green-600 ml-1">Expertise Level</label>
                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-black/[0.03] rounded-2xl px-8 py-5 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-gray-900 font-black uppercase text-xs tracking-widest cursor-pointer shadow-sm"
                                    >
                                        <option value="Easy">Beginner Friendly</option>
                                        <option value="Medium">Skilled Chef</option>
                                        <option value="Hard">Culinary Master</option>
                                    </select>
                                </div>
                                <Input label="Cuisine Category" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Mediterranean" required />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-green-600 ml-1">Preparation Steps / Method</label>
                                <textarea
                                    name="instructions"
                                    value={formData.instructions}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-black/[0.03] rounded-[32px] px-8 py-6 min-h-[220px] focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-gray-900 font-medium placeholder:text-gray-300 leading-relaxed"
                                    placeholder="Step 1: Preheat oven to 200°C... &#10;Step 2: Season the beef generously..."
                                />
                            </div>

                            <Input label="Discovery Tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="healthy, fast, roast, dinner" />
                        </div>
                    </div>
                </form>

                {/* Footer Action */}
                <div className="p-10 bg-white border-t border-gray-100 flex gap-6 items-center">
                    <Button onClick={onClose} variant="ghost" className="px-12 py-5 text-gray-400 font-black uppercase tracking-widest text-xs hover:text-red-500 transition-colors">
                        Discard Draft
                    </Button>
                    <Button type="submit" onClick={handleSubmit} disabled={isLoading} className="flex-grow py-6 btn-brand text-lg shadow-2xl shadow-green-500/30 font-black uppercase tracking-widest">
                        {isLoading ? 'Encrypting & Sharing...' : 'Publish to Global Vault'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCreateModal;
