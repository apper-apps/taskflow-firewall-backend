import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Modal from '@/components/molecules/Modal';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { taskService } from '@/services';

const QuickAddTaskFeature = ({ onTaskAdded }) => {
  const [quickAddVisible, setQuickAddVisible] = useState(false);
  const [quickTask, setQuickTask] = useState('');
  const [recentTasks, setRecentTasks] = useState([]);

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

  useEffect(() => {
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
      
      await loadRecentTasks(); // Refresh recent tasks
      onTaskAdded(); // Notify parent to refresh main tasks
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
      onTaskAdded(); // Notify parent to refresh main tasks
    } catch (err) {
      toast.error('Failed to complete task');
    }
  };

  return (
    <>
      <Button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setQuickAddVisible(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-secondary transition-colors z-30 flex items-center justify-center"
      >
        <ApperIcon name="Plus" size={24} />
      </Button>

      <Modal
        isOpen={quickAddVisible}
        onClose={() => setQuickAddVisible(false)}
        title="Quick Add Task"
        className="fixed bottom-24 right-6 max-w-sm w-80 p-4" // Custom positioning and size
      >
        <form onSubmit={handleQuickAdd} className="space-y-3">
          <Input
            type="text"
            value={quickTask}
            onChange={(e) => setQuickTask(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            className="p-2" // smaller padding for quick add
          />
          <Button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition-colors"
          >
            Add Task
          </Button>
        </form>

        {recentTasks.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="text-xs font-medium text-gray-500 mb-2">RECENT TASKS</h4>
            <div className="space-y-2">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2 text-sm">
                  <Button
                    onClick={() => handleQuickComplete(task.id)}
                    className="w-4 h-4 border border-gray-300 rounded hover:border-primary transition-colors flex-shrink-0 bg-transparent"
                  />
                  <span className="flex-1 truncate text-gray-700">{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default QuickAddTaskFeature;