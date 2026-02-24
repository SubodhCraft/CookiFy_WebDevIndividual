import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import recipeService from '../services/recipeService';
import bookmarkService from '../services/bookmarkService';
import authService from '../services/authService';
import commentService from '../services/commentService';

const RecipeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const currentUser = authService.getUser();

    const icons = {
        back: "https://cdn-icons-png.flaticon.com/512/271/271220.png",
        time: "https://cdn-icons-png.flaticon.com/512/2088/2088617.png",
        fire: "https://cdn-icons-png.flaticon.com/512/426/426833.png",
        level: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png",
        chef: "https://cdn-icons-png.flaticon.com/512/3461/3461901.png",
        comment: "https://cdn-icons-png.flaticon.com/512/1380/1380338.png"
    };

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/signin');
            return;
        }
        fetchRecipeDetails();
        checkBookmarkStatus();
        fetchComments();
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

    const fetchComments = async () => {
        try {
            const response = await commentService.getRecipeComments(id);
            if (response.success) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsCommenting(true);
        try {
            const response = await commentService.addComment(id, newComment);
            if (response.success) {
                setComments([response.data, ...comments]);
                setNewComment('');
                toast.success('Thought shared successfully');
            }
        } catch (error) {
            toast.error('Failed to post thought');
            console.error('Post comment error:', error);
        } finally {
            setIsCommenting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await commentService.deleteComment(commentId);
            if (response.success) {
                setComments(comments.filter(c => c.id !== commentId));
                toast.success('Thought removed');
            }
        } catch (error) {
            toast.error('Failed to delete thought');
            console.error('Delete comment error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
                <div className="w-16 h-16 border-t-4 border-emerald-500 rounded-full animate-spin" />
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
                    className="absolute top-12 left-12 p-5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200 hover:bg-emerald-600 hover:scale-105 transition-all group z-20"
                >
                    <img src={icons.back} className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition-all" alt="back" />
                </button>

                <div className="absolute bottom-24 left-0 w-full page-container space-y-8 animate-fade-up">
                    <div className="inline-flex px-5 py-2 rounded-full bg-emerald-600 text-white text-[10px] font-black tracking-widest uppercase shadow-xl shadow-emerald-600/20">
                        {recipe.category}
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 leading-[0.9] max-w-5xl">
                        {recipe.title}
                    </h1>
                </div>
            </div>

            {/* Content Container */}
            <div className="page-container -mt-32 relative z-10 grid lg:grid-cols-4 gap-24">

                {/* Info Cards */}
                <div className="lg:col-span-3 space-y-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { label: 'Time To Create', val: recipe.prepTime, icon: icons.time, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                            { label: 'Energy Content', val: `${recipe.calories} kcal`, icon: icons.fire, color: 'text-orange-700', bg: 'bg-orange-50' },
                            { label: 'Skill Required', val: recipe.difficulty, icon: icons.level, color: 'text-blue-700', bg: 'bg-blue-50' }
                        ].map((item, i) => (
                            <div key={i} className={`p-10 rounded-[48px] border border-slate-100 space-y-8 shadow-[0_32px_80px_rgba(0,0,0,0.03)] transition-all bg-white/80 backdrop-blur-xl group cursor-default hover:bg-white hover:shadow-2xl`}>
                                <div className={`w-16 h-16 rounded-[24px] ${item.bg} flex items-center justify-center group-hover:rotate-12 transition-transform duration-500`}>
                                    <img src={item.icon} className={`w-7 h-7 object-contain`} alt={item.label} />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</div>
                                    <div className={`text-4xl font-black ${item.color} tracking-tighter`}>{item.val}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-6">
                            <h2 className="text-4xl font-black tracking-tighter uppercase text-slate-300">Description</h2>
                            <div className="h-px flex-grow bg-slate-100" />
                        </div>
                        <p className="text-3xl text-slate-600 leading-[1.6] font-medium max-w-5xl tracking-tight">
                            {recipe.description}
                        </p>
                    </div>

                    {/* Ingredients Section */}
                    <div className="space-y-12">
                        <div className="flex items-center gap-6">
                            <h2 className="text-4xl font-black tracking-tighter uppercase text-slate-300">Ingredients</h2>
                            <div className="h-px flex-grow bg-slate-100" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                recipe.ingredients.map((ing, i) => (
                                    <div key={i} className="px-12 py-8 rounded-[36px] bg-white border border-slate-50 shadow-[0_16px_48px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:border-emerald-200 hover:shadow-xl transition-all duration-500">
                                        <div className="flex items-center gap-8">
                                            <div className="w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-500 group-hover:scale-125 transition-transform duration-500" />
                                            <span className="text-2xl font-black text-slate-800 tracking-tight">{ing}</span>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 font-bold text-xl italic">No elements listed.</p>
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-16">
                        <div className="flex items-center gap-6">
                            <h2 className="text-4xl font-black tracking-tighter uppercase text-slate-300">Directions</h2>
                            <div className="h-px flex-grow bg-slate-100" />
                        </div>
                        <div className="space-y-12">
                            {recipe.instructions ? (
                                recipe.instructions.split('\n').filter(step => step.trim() !== '').map((step, index) => (
                                    <div key={index} className="flex gap-20 group">
                                        <div className="flex-shrink-0 w-24 h-24 rounded-[40px] bg-slate-900 flex items-center justify-center text-4xl font-black text-white shadow-2xl transition-all group-hover:bg-emerald-600 group-hover:rotate-[12deg] group-hover:scale-110">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </div>
                                        <div className="space-y-4 pt-4 border-l-4 border-slate-50 pl-12 group-hover:border-emerald-100 transition-colors">
                                            <p className="text-3xl text-slate-800 leading-[1.4] font-black tracking-tighter">
                                                {step.replace(/^Step \d+:? /i, '')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-16 rounded-[48px] bg-slate-50 border border-dashed border-slate-200 text-center text-slate-400 font-black uppercase tracking-widest">
                                    Step-by-step guidance is unavailable
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Community Thoughts (Commenting Section) */}
                    <div className="space-y-16">
                        <div className="flex items-center gap-6">
                            <h2 className="text-4xl font-black tracking-tighter uppercase text-slate-300">Community Thoughts</h2>
                            <div className="h-px flex-grow bg-slate-100" />
                        </div>

                        {/* Add Comment Form */}
                        <form onSubmit={handlePostComment} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-[40px] blur-xl opacity-10 group-focus-within:opacity-25 transition-all duration-700" />
                            <div className="relative bg-white rounded-[40px] p-4 flex flex-col md:flex-row gap-4 border border-slate-100 shadow-[0_32px_80px_rgba(0,0,0,0.03)]">
                                <div className="w-16 h-16 shrink-0 rounded-2xl bg-emerald-50 p-3">
                                    <img src={icons.comment} className="w-full h-full object-contain brightness-0 opacity-40" alt="comment" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Share your experience or a twist to this recipe..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-grow bg-transparent border-none focus:ring-0 text-xl font-bold placeholder-slate-300 text-slate-800 py-4 px-2"
                                />
                                <button
                                    type="submit"
                                    disabled={isCommenting || !newComment.trim()}
                                    className="px-10 py-4 rounded-[28px] bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] hover:bg-emerald-600 transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {isCommenting ? 'Posting...' : 'Post Thought'}
                                </button>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-10">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-8 group animate-fade-in">
                                        <div className="w-16 h-16 shrink-0 rounded-[20px] bg-slate-100 overflow-hidden border-4 border-white shadow-xl">
                                            <img
                                                src={comment.User?.profilePicture ?
                                                    (comment.User.profilePicture.startsWith('http') ? comment.User.profilePicture : `http://localhost:5000${comment.User.profilePicture}`) :
                                                    icons.chef}
                                                className="w-full h-full object-cover"
                                                alt={comment.User?.fullName}
                                            />
                                        </div>
                                        <div className="flex-grow space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <h4 className="text-xl font-black text-slate-800">{comment.User?.fullName}</h4>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {currentUser?.id === comment.userId && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-[10px] font-black uppercase tracking-widest text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-2xl font-medium text-slate-600 leading-snug tracking-tight">
                                                "{comment.content}"
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center space-y-4 rounded-[48px] border-4 border-dashed border-slate-50">
                                    <div className="text-5xl opacity-20">💭</div>
                                    <p className="text-xl font-bold text-slate-300 uppercase tracking-widest">No thoughts shared yet. Be the first!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-16 lg:pt-32">
                    <div className="bg-white rounded-[64px] p-12 shadow-[0_64px_128px_rgba(0,0,0,0.06)] border border-slate-100 space-y-12 sticky top-44">
                        <div className="flex items-center gap-8 pb-12 border-b border-slate-50">
                            <div className="w-24 h-24 rounded-[32px] bg-orange-500 overflow-hidden shadow-2xl shadow-orange-500/20">
                                <img src={recipe.User?.profilePicture || icons.chef} className="w-full h-full object-cover" alt="chef" />
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{recipe.User?.fullName || 'Anonymous Chef'}</div>
                                <div className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em]">Verified Contributor</div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Ingredient Tags</div>
                            <div className="flex flex-wrap gap-4">
                                {recipe.tags?.map(tag => (
                                    <span key={tag} className="px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-emerald-600 hover:text-white transition-all cursor-default">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleToggleBookmark}
                            disabled={isToggling}
                            className={`w-full py-7 rounded-[32px] font-black text-xl transition-all active:scale-95 disabled:opacity-50 shadow-2xl ${isBookmarked
                                ? 'bg-orange-500 text-white shadow-orange-500/30'
                                : 'bg-slate-900 text-white shadow-slate-900/30 hover:bg-emerald-600 hover:shadow-emerald-500/30'
                                }`}
                        >
                            {isToggling ? 'Syncing...' : isBookmarked ? 'Stored in Collection' : 'Add to Collection'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailPage;
