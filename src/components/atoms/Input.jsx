import React from 'react';

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
      {...props}
    />
  );
};

export default Input;