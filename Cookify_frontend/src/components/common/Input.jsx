
const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="block text-sm font-semibold text-slate-700 ml-0.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    className={`w-full bg-white border border-slate-200 rounded-lg px-5 py-3.5 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all duration-200 text-slate-900 font-medium placeholder:text-slate-400 shadow-sm ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''
                        } ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500 font-medium mt-1.5 ml-0.5 animate-reveal flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
