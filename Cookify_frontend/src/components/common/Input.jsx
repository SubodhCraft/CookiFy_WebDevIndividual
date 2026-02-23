
const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full space-y-3">
            {label && (
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    className={`w-full bg-white border border-black/[0.1] border-solid rounded-none px-6 py-5 focus:ring-0 focus:border-green-600 outline-none transition-all duration-300 text-gray-900 font-medium placeholder:text-gray-300 shadow-sm ${error ? 'border-red-500' : ''
                        } ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500 font-bold mt-2 ml-1 animate-fade-in flex items-center gap-3">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-none shadow-sm" />
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
