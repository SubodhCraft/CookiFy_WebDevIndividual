
const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    className={`w-full bg-white border border-black/[0.05] border-solid rounded-2xl px-6 py-4.5 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all duration-300 text-gray-900 font-medium placeholder:text-gray-300 ${error ? 'border-red-500/50 focus:ring-red-500/10' : ''
                        } ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500 font-bold mt-1.5 ml-1 animate-fade-in flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full shadow-sm" />
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
