
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transform hover:-translate-y-1',
        secondary: 'glass-card text-white hover:bg-white/10 border-white/20',
        outline: 'bg-transparent border-2 border-indigo-500/50 text-indigo-400 hover:border-indigo-400 hover:text-white',
        ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5',
        accent: 'bg-emerald-500 text-slate-900 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
