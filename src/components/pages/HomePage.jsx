import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { isToday, isTomorrow, isAfter, startOfDay } from 'date-fns';

import { taskService, categoryService } from '@/services';
import ApperIcon from '@/components/ApperIcon';

import Modal from '@/components/molecules/Modal';
import TaskAddForm from '@/components/organisms/TaskAddForm';
import TaskFilterSidebar from '@/components/organisms/TaskFilterSidebar';
import TaskSectionList from '@/components/organisms/TaskSectionList';
import QuickAddTaskFeature from '@/components/organisms/QuickAddTaskFeature';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import ErrorDisplay from '@/components/organisms/ErrorDisplay';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [completionFilter, setCompletionFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredTasks = tasks.filter(task => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
      return false;
    }
    if (completionFilter === 'completed' && !task.completed) {
      return false;
    }
    if (completionFilter === 'pending' && task.completed) {
      return false;
    }
    return true;
  });

  const todayTasks = filteredTasks.filter(task => 
    task.dueDate && isToday(new Date(task.dueDate))
  );

  const tomorrowTasks = filteredTasks.filter(task => 
    task.dueDate && isTomorrow(new Date(task.dueDate))
  );

  const overdueTasks = filteredTasks.filter(task => 
    task.dueDate && 
    !task.completed && 
    isAfter(startOfDay(new Date()), new Date(task.dueDate))
  );

  const otherTasks = filteredTasks.filter(task => 
    !task.dueDate || 
    (!isToday(new Date(task.dueDate)) && 
     !isTomorrow(new Date(task.dueDate)) && 
     !isAfter(startOfDay(new Date()), new Date(task.dueDate)))
  );

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const handleAddTask = async (newTaskData) => {
    try {
      const taskData = {
        ...newTaskData,
        dueDate: newTaskData.dueDate ? new Date(newTaskData.dueDate) : null,
        completed: false,
        createdAt: new Date(),
        completedAt: null
      };

      const createdTask = await taskService.create(taskData);
      setTasks(prev => [createdTask, ...prev]);
      setShowAddForm(false);
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null
      });
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const getPriorityColor = useCallback((priority) => {
    switch (priority) {
      case 'high': return 'bg-accent';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-gray-400';
    }
  }, []);

  const getCategoryColor = useCallback((categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#64748b';
  }, [categories]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={loadData} />;
  }

  return (
    <div className="h-full flex overflow-hidden">
      <TaskFilterSidebar
        categories={categories}
        completionPercentage={completionPercentage}
        completedTasks={completedTasksCount}
        totalTasks={totalTasksCount}
        onShowAddForm={() => setShowAddForm(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        completionFilter={completionFilter}
        setCompletionFilter={setCompletionFilter}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl font-heading font-bold text-gray-900">Your Tasks</h1>
            <p className="text-gray-600">Stay organized and productive</p>
          </div>

          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium">
                {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' || completionFilter !== 'all'
                  ? 'No tasks match your filters'
                  : 'No tasks yet'
                }
              </h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' || completionFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first task'
                }
              </p>
              {(!searchQuery && selectedCategory === 'all' && selectedPriority === 'all' && completionFilter === 'all') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                >
                  Create Your First Task
                </motion.button>
              )}
            </motion.div>
          ) : (
            <div>
              <TaskSectionList 
                title="Overdue" 
                tasks={overdueTasks} 
                icon="AlertTriangle" 
                onToggleComplete={handleToggleComplete} 
                onDelete={handleDeleteTask} 
                getPriorityColor={getPriorityColor}
                getCategoryColor={getCategoryColor}
              />
              <TaskSectionList 
                title="Today" 
                tasks={todayTasks} 
                icon="Calendar" 
                onToggleComplete={handleToggleComplete} 
                onDelete={handleDeleteTask} 
                getPriorityColor={getPriorityColor}
                getCategoryColor={getCategoryColor}
              />
              <TaskSectionList 
                title="Tomorrow" 
                tasks={tomorrowTasks} 
                icon="CalendarDays" 
                onToggleComplete={handleToggleComplete} 
                onDelete={handleDeleteTask} 
                getPriorityColor={getPriorityColor}
                getCategoryColor={getCategoryColor}
              />
              <TaskSectionList 
                title="Other Tasks" 
                tasks={otherTasks} 
                icon="CheckSquare" 
                onToggleComplete={handleToggleComplete} 
                onDelete={handleDeleteTask} 
                getPriorityColor={getPriorityColor}
                getCategoryColor={getCategoryColor}
              />
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} title="Add New Task">
        <TaskAddForm 
          categories={categories} 
          onAddTask={handleAddTask} 
          onClose={() => setShowAddForm(false)} 
        />
      </Modal>

      <QuickAddTaskFeature onTaskAdded={loadData} />
    </div>
  );
};

export default HomePage;