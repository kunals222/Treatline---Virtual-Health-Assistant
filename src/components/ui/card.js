import React from 'react';

const Card = ({ children }) => {
    return (
        <div className="p-6 w-96 bg-white rounded-2xl shadow-lg">
            {children}
        </div>
    );
};

export default Card;
