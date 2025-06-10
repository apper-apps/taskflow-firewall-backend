import React, { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const TaskAddForm = ({ categories, onAddTask, onClose }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium',
    category: '',
    dueDate: ''
  });

  useEffect(() => {
    // Set default category if available
    if (categories.length > 0 && !newTask.category) {
      setNewTask(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories, newTask.category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    onAddTask(newTask);
    setNewTask({ title: '', priority: 'medium', category: '', dueDate: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Task Title" htmlFor="taskTitle">
        <Input
          id="taskTitle"
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
          placeholder="What needs to be done?"
          required
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Priority" htmlFor="taskPriority">
          <Select
            id="taskPriority"
            value={newTask.priority}
            onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </FormField>

        <FormField label="Category" htmlFor="taskCategory">
          <Select
            id="taskCategory"
            value={newTask.category}
            onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">No Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Due Date" htmlFor="taskDueDate">
        <Input
          id="taskDueDate"
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
        />
      </FormField>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
        >
          Add Task
        </Button>
      </div>
    </form>
  );
};

export default TaskAddForm;