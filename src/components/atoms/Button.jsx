import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', whileHover, whileTap, ...props }) => {
  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      className={`${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;