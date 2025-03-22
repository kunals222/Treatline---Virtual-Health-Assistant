import React from 'react';

const Button = ({ onClick, children }) => {
    return (
        <button onClick={onClick} className="w-full bg-blue-600 text-white rounded-lg py-2">
            {children}
        </button>
    );
};

export default Button;
