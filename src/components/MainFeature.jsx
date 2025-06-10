import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { taskService } from '../services';

const MainFeature = () => {
  const [quickAddVisible, setQuickAddVisible] = useState(false);
  const [quickTask, setQuickTask] = useState('');
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    // Load recent tasks for quick access
    const loadRecentTasks = async () => {
      try {
        const tasks = await taskService.getAll();
        const recent = tasks
          .filter(task => !task.completed)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setRecentTasks(recent);
      } catch (err) {
        console.error('Failed to load recent tasks:', err);
      }
    };

    loadRecentTasks();
  }, []);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTask.trim()) return;

    try {
      const taskData = {
        title: quickTask.trim(),
        priority: 'medium',
        category: '',
        dueDate: null,
        completed: false,
        createdAt: new Date(),
        completedAt: null
      };

      await taskService.create(taskData);
      setQuickTask('');
      setQuickAddVisible(false);
      toast.success('Quick task added!');
      
      // Refresh recent tasks
      const tasks = await taskService.getAll();
      const recent = tasks
        .filter(task => !task.completed)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setRecentTasks(recent);
    } catch (err) {
      toast.error('Failed to add quick task');
    }
  };

  const handleQuickComplete = async (taskId) => {
    try {
      await taskService.update(taskId, {
        completed: true,
        completedAt: new Date()
      });
      
      setRecentTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task completed!');
    } catch (err) {
      toast.error('Failed to complete task');
    }
  };

  return (
    <>
      {/* Floating Quick Add Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setQuickAddVisible(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-secondary transition-colors z-30 flex items-center justify-center"
      >
        <ApperIcon name="Plus" size={24} />
      </motion.button>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {quickAddVisible && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setQuickAddVisible(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-xl p-4 z-50"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Quick Add Task</h3>
                <button
                  onClick={() => setQuickAddVisible(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              </div>

              <form onSubmit={handleQuickAdd} className="space-y-3">
                <input
                  type="text"
                  value={quickTask}
                  onChange={(e) => setQuickTask(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors"
                >
                  Add Task
                </button>
              </form>

              {/* Recent Tasks Quick Access */}
              {recentTasks.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="text-xs font-medium text-gray-500 mb-2">RECENT TASKS</h4>
                  <div className="space-y-2">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2 text-sm">
                        <button
                          onClick={() => handleQuickComplete(task.id)}
                          className="w-4 h-4 border border-gray-300 rounded hover:border-primary transition-colors flex-shrink-0"
                        />
                        <span className="flex-1 truncate text-gray-700">{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MainFeature;