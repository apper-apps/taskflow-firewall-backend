import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';
import { taskService, categoryService } from '../services';
import { isToday, isTomorrow, isAfter, format, startOfDay } from 'date-fns';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [completionFilter, setCompletionFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium',
    category: '',
    dueDate: ''
  });

  const loadData = async () => {
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
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }
    
    // Priority filter
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
      return false;
    }
    
    // Completion filter
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

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const taskData = {
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
        completed: false,
        createdAt: new Date(),
        completedAt: null
      };

      const createdTask = await taskService.create(taskData);
      setTasks(prev => [createdTask, ...prev]);
      setNewTask({ title: '', priority: 'medium', category: '', dueDate: '' });
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-accent';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-gray-400';
    }
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#64748b';
  };

  const TaskSection = ({ title, tasks: sectionTasks, icon }) => {
    if (sectionTasks.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ApperIcon name={icon} size={18} className="text-gray-600" />
          <h3 className="font-heading font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">({sectionTasks.length})</span>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {sectionTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all duration-200 hover:scale-[1.02] border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggleComplete(task.id)}
                    className={`task-checkbox mt-1 ${task.completed ? 'checked' : ''}`}
                  >
                    <div className="checkmark">
                      <ApperIcon name="Check" size={12} />
                    </div>
                  </motion.button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={`font-medium text-gray-900 ${task.completed ? 'task-completed' : ''}`}>
                        {task.title}
                      </h4>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-400 hover:text-error transition-colors p-1"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
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
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-card"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-surface border-r border-gray-200 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Progress Ring */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 progress-ring" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  className="text-primary progress-ring-circle"
                  strokeDasharray={`${completionPercentage}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{completionPercentage}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>

          {/* Quick Add Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(true)}
            className="w-full bg-primary text-white rounded-lg py-3 px-4 font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
          >
            <ApperIcon name="Plus" size={20} />
            Add New Task
          </motion.button>

          {/* Search */}
          <div className="relative">
            <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Category</h4>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Priority</h4>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

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

      {/* Main Content */}
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
              <TaskSection title="Overdue" tasks={overdueTasks} icon="AlertTriangle" />
              <TaskSection title="Today" tasks={todayTasks} icon="Calendar" />
              <TaskSection title="Tomorrow" tasks={tomorrowTasks} icon="CalendarDays" />
              <TaskSection title="Other Tasks" tasks={otherTasks} icon="CheckSquare" />
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading font-semibold">Add New Task</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What needs to be done?"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newTask.category}
                        onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="">No Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <MainFeature />
    </div>
  );
};

export default Home;