import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ checked, onClick, className = '' }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`task-checkbox mt-1 ${checked ? 'checked' : ''} ${className}`}
    >
      <div className="checkmark">
        <ApperIcon name="Check" size={12} />
      </div>
    </motion.button>
  );
};

export default Checkbox;