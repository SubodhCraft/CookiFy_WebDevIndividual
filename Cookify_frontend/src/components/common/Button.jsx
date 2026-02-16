
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-secondary text-white hover:bg-black shadow-md hover:shadow-xl',
        secondary: 'bg-primary text-secondary hover:bg-primary-dark',
        outline: 'bg-transparent border border-secondary text-secondary hover:bg-secondary hover:text-white',
        ghost: 'bg-transparent text-secondary hover:bg-neutral-100',
        accent: 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg',
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
