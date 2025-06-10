import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TaskCard from '@/components/molecules/TaskCard';

const TaskSectionList = ({ title, tasks, icon, onToggleComplete, onDelete, getPriorityColor, getCategoryColor }) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name={icon} size={18} className="text-gray-600" />
        <h3 className="font-heading font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">({tasks.length})</span>
      </div>
      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              getPriorityColor={getPriorityColor}
              getCategoryColor={getCategoryColor}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskSectionList;