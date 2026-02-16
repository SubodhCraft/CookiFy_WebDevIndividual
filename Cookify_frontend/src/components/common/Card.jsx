const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-xl border border-white/20 overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
