
const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="block text-sm font-medium text-slate-300/80 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    className={`w-full glass-input px-5 py-3.5 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 ${error ? 'border-red-500/50 focus:ring-red-500/30' : ''
                        } ${className}`}
                    {...props}
                />
                <div className="absolute inset-0 rounded-xl bg-indigo-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
            </div>
            {error && (
                <p className="text-xs text-red-400/90 mt-1.5 ml-1 animate-fade-in flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
