const Card = ({ children, className = '', interactive = false, ...props }) => {
    return (
        <div
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 ${interactive ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
