import React from 'react';

const Select = ({ className = '', children, ...props }) => {
  return (
    <select
      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;