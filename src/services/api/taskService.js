import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...tasksData].map(task => ({
  ...task,
  createdAt: new Date(task.createdAt),
  dueDate: task.dueDate ? new Date(task.dueDate) : null,
  completedAt: task.completedAt ? new Date(task.completedAt) : null
}));

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(250);
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date(),
      completedAt: null
    };
    tasks.unshift(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = { ...tasks[index], ...updates };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks.splice(index, 1);
    return true;
  },

  async getByCategory(category) {
    await delay(250);
    return tasks.filter(task => task.category === category);
  },

  async getByPriority(priority) {
    await delay(250);
    return tasks.filter(task => task.priority === priority);
  },

  async getCompleted() {
    await delay(250);
    return tasks.filter(task => task.completed);
  },

  async getPending() {
    await delay(250);
    return tasks.filter(task => !task.completed);
  }
};

export default taskService;