
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]';

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-8 py-4 text-base',
        lg: 'px-12 py-5 text-lg'
    };

    const variants = {
        primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md rounded-lg',
        secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm rounded-lg',
        outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 rounded-lg',
        ghost: 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-lg',
        danger: 'bg-red-500 text-white hover:bg-red-600 rounded-lg',
    };

    return (
        <button
            className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
