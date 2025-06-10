import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/molecules/ProgressRing';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import FormField from '@/components/molecules/FormField';

const TaskFilterSidebar = ({
  categories,
  completionPercentage,
  completedTasks,
  totalTasks,
  onShowAddForm,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  completionFilter,
  setCompletionFilter
}) => {
  return (
    <div className="w-80 bg-surface border-r border-gray-200 p-6 overflow-y-auto">
      <div className="space-y-6">
        <ProgressRing
          percentage={completionPercentage}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
        />

        <Button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShowAddForm}
          className="w-full bg-primary text-white rounded-lg py-3 px-4 font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          Add New Task
        </Button>

        <div className="relative">
          <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2" // override default padding to accommodate icon
          />
        </div>

        <div className="space-y-4">
          <FormField label="Category" htmlFor="categoryFilter">
            <Select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2" // override default padding
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Priority" htmlFor="priorityFilter">
            <Select
              id="priorityFilter"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="p-2" // override default padding
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </FormField>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Status</h4>
            <div className="space-y-2">
              {['all', 'pending', 'completed'].map(status => (
                <label key={status} className="flex items-center">
                  <input
                    type="radio"
                    name="completion"
                    value={status}
                    checked={completionFilter === status}
                    onChange={(e) => setCompletionFilter(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilterSidebar;