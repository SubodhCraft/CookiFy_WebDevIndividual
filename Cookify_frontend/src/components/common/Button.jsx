const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer';

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-3.5 text-base'
    };

    const variants = {
        primary: 'bg-[#2E7D32] text-white hover:bg-[#1B5E20] shadow-sm hover:shadow-md',
        secondary: 'bg-[#2C2C2C] text-white hover:bg-[#1a1a1a] shadow-sm',
        outline: 'bg-transparent border-[1.5px] border-gray-200 text-gray-700 hover:border-[#2E7D32] hover:text-[#2E7D32] hover:bg-[#E8F5E9]',
        'outline-yellow': 'bg-transparent border-2 border-[#FBC02D] text-[#F57F17] hover:bg-[#FFF9C4]',
        ghost: 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
    };

    return (
        <button
            className={`${base} ${sizes[size]} ${variants[variant] || variants.primary} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
