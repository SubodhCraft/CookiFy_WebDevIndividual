const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
