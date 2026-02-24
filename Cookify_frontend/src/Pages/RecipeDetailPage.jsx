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

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/3461/3461901.png";

    useEffect(() => {
        if (!authService.isAuthenticated()) { navigate('/signin'); return; }
        fetchRecipeDetails();
        checkBookmarkStatus();
        fetchComments();
    }, [id]);

    const checkBookmarkStatus = async () => {
        try {
            const res = await bookmarkService.checkBookmark(id);
            if (res.success) setIsBookmarked(res.isBookmarked);
        } catch (e) { console.error(e); }
    };

    const handleToggleBookmark = async () => {
        setIsToggling(true);
        try {
            const res = await bookmarkService.toggleBookmark(id);
            if (res.success) { setIsBookmarked(res.isBookmarked); toast.success(res.message); }
        } catch { toast.error('Could not update bookmark'); }
        finally { setIsToggling(false); }
    };

    const fetchRecipeDetails = async () => {
        setIsLoading(true);
        try {
            const res = await recipeService.getRecipeById(id);
            if (res.success) setRecipe(res.data); else navigate('/dashboard');
        } catch { navigate('/dashboard'); }
        finally { setIsLoading(false); }
    };

    const fetchComments = async () => {
        try {
            const res = await commentService.getRecipeComments(id);
            if (res.success) setComments(res.data);
        } catch (e) { console.error(e); }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setIsCommenting(true);
        try {
            const res = await commentService.addComment(id, newComment);
            if (res.success) { setComments([res.data, ...comments]); setNewComment(''); toast.success('Comment posted'); }
        } catch { toast.error('Failed to post comment'); }
        finally { setIsCommenting(false); }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const res = await commentService.deleteComment(commentId);
            if (res.success) { setComments(comments.filter(c => c.id !== commentId)); toast.success('Comment deleted'); }
        } catch { toast.error('Delete failed'); }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-400">Loading recipe...</span>
                </div>
            </div>
        );
    }

    if (!recipe) return null;

    const getDifficultyColor = (d) => d === 'Easy' ? 'text-green-600 bg-green-50' : d === 'Medium' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C] font-sans pb-20">
            {/* Sticky Nav */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleToggleBookmark}
                            disabled={isToggling}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isBookmarked
                                ? 'text-[#2E7D32] bg-[#E8F5E9]'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            {isBookmarked ? 'Saved' : 'Save'}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pt-8 animate-reveal">
                {/* Banner Image */}
                <div className="rounded-2xl overflow-hidden shadow-lg mb-10 aspect-[21/9] bg-gray-100">
                    <img
                        src={recipe.image.includes('http') ? recipe.image : `http://localhost:5000${recipe.image}`}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Title + Meta */}
                <div className="mb-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold">{recipe.category}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>{recipe.difficulty}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading leading-tight">{recipe.title}</h1>
                    <p className="text-gray-500 text-base leading-relaxed max-w-3xl">{recipe.description}</p>

                    {/* Author + Stats row */}
                    <div className="flex items-center justify-between flex-wrap gap-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                                <img src={recipe.User?.profilePicture || defaultAvatar} className="w-full h-full object-cover" alt="author" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-900">{recipe.User?.fullName}</div>
                                <div className="text-xs text-gray-400">Recipe Author</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            {[
                                { icon: '🕐', label: recipe.prepTime },
                                { icon: '🔥', label: `${recipe.calories} kcal` }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <span>{s.icon}</span>
                                    <span className="font-medium">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Sidebar: Ingredients + Tags */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-20">
                            <h2 className="text-lg font-bold text-gray-900 font-heading mb-5">Ingredients</h2>
                            <ul className="space-y-3">
                                {recipe.ingredients?.map((ing, i) => (
                                    <li key={i} className="flex items-start gap-3 group">
                                        <div className="mt-1 w-4 h-4 rounded border border-gray-300 flex-shrink-0 flex items-center justify-center group-hover:border-[#2E7D32] transition-colors cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                        </div>
                                        <span className="text-sm text-gray-600 leading-snug">{ing}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {recipe.tags?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {recipe.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs font-medium text-gray-500">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main: Instructions + Comments */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Instructions */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <h2 className="text-lg font-bold text-gray-900 font-heading mb-6">Instructions</h2>
                            <ol className="space-y-6">
                                {recipe.instructions?.split('\n').filter(s => s.trim()).map((step, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed pt-0.5">
                                            {step.replace(/^Step \d+:? /i, '')}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {/* Comments */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <h2 className="text-lg font-bold text-gray-900 font-heading mb-6">
                                Comments <span className="text-gray-400 font-normal text-sm ml-1">({comments.length})</span>
                            </h2>

                            {/* Comment Input */}
                            <form onSubmit={handlePostComment} className="mb-8">
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img src={currentUser?.profilePicture || defaultAvatar} className="w-full h-full object-cover" alt="you" />
                                    </div>
                                    <div className="flex-grow space-y-3">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write a comment..."
                                            rows="3"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 resize-none transition-all"
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={isCommenting || !newComment.trim()}
                                                className="px-5 py-2 bg-[#2E7D32] text-white rounded-lg text-sm font-semibold hover:bg-[#1B5E20] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                            >
                                                {isCommenting ? 'Posting...' : 'Post Comment'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {/* Comment List */}
                            <div className="space-y-6">
                                {comments.length > 0 ? comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3 group">
                                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                            <img src={comment.User?.profilePicture || defaultAvatar} className="w-full h-full object-cover" alt="user" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="bg-gray-50 rounded-xl rounded-tl-sm p-4">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-semibold text-gray-900">{comment.User?.fullName}</span>
                                                    {currentUser?.id === comment.userId && (
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{comment.content}</p>
                                            </div>
                                            <span className="text-[11px] text-gray-400 mt-1 ml-1 inline-block">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-gray-400">
                                        <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RecipeDetailPage;
