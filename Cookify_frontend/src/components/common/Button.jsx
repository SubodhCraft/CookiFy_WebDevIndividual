
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center px-10 py-5 rounded-none text-base font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1',
        secondary: 'bg-white border border-black text-black hover:bg-gray-50',
        outline: 'bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
        ghost: 'bg-transparent text-gray-500 hover:text-green-600 hover:bg-green-50',
        accent: 'bg-orange-500 text-white hover:bg-orange-600 shadow-md',
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
