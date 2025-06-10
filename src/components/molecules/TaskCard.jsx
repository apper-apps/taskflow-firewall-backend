import React from 'react';
import { motion } from 'framer-motion';
import { format, isAfter, startOfDay } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';

const TaskCard = ({ task, onToggleComplete, onDelete, getPriorityColor, getCategoryColor, index }) => {
  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all duration-200 hover:scale-[1.02] border border-gray-100"
    >
      <div className="flex items-start gap-3">
        <Checkbox checked={task.completed} onClick={() => onToggleComplete(task.id)} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className={`font-medium text-gray-900 ${task.completed ? 'task-completed' : ''}`}>
              {task.title}
            </h4>
            <Button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-error transition-colors p-1 bg-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} ${
                task.dueDate && isAfter(startOfDay(new Date()), new Date(task.dueDate)) && !task.completed 
                  ? 'priority-dot overdue' : ''
              }`} />
              <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
            </div>
            
            {task.category && (
              <span 
                className="text-xs px-2 py-1 rounded-full text-white"
                style={{ backgroundColor: getCategoryColor(task.category) }}
              >
                {task.category}
              </span>
            )}
            
            {task.dueDate && (
              <span className={`text-xs px-2 py-1 rounded ${
                isAfter(startOfDay(new Date()), new Date(task.dueDate)) && !task.completed
                  ? 'bg-error text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;