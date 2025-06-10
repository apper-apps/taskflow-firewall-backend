import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div className="text-center py-12">
      <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      <Button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
      >
        Try Again
      </Button>
    </div>
  );
};

export default ErrorDisplay;