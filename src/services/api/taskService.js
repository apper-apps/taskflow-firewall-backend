import { toast } from 'react-toastify';

const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: ['Id', 'Name', 'title', 'completed', 'priority', 'category', 'due_date', 'created_at', 'completed_at'],
        orderBy: [
          {
            fieldName: 'created_at',
            SortType: 'DESC'
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Transform database fields to match UI expectations
      return response.data?.map(task => ({
        id: task.Id,
        title: task.title || task.Name,
        completed: task.completed || false,
        priority: task.priority || 'medium',
        category: task.category || '',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        createdAt: task.created_at ? new Date(task.created_at) : new Date(),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      })) || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: ['Id', 'Name', 'title', 'completed', 'priority', 'category', 'due_date', 'created_at', 'completed_at']
      };
      
      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      const task = response.data;
      if (!task) return null;
      
      // Transform database fields to match UI expectations
      return {
        id: task.Id,
        title: task.title || task.Name,
        completed: task.completed || false,
        priority: task.priority || 'medium',
        category: task.category || '',
        dueDate: task.due_date ? new Date(task.due_date) : null,
        createdAt: task.created_at ? new Date(task.created_at) : new Date(),
        completedAt: task.completed_at ? new Date(task.completed_at) : null
      };
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to load task');
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          title: taskData.title,
          completed: taskData.completed || false,
          priority: taskData.priority || 'medium',
          category: taskData.category || null,
          due_date: taskData.dueDate ? taskData.dueDate.toISOString() : null,
          created_at: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to create task');
        }
        
        const successfulRecord = response.results[0];
        if (successfulRecord && successfulRecord.success) {
          const task = successfulRecord.data;
          
          // Transform database fields to match UI expectations
          return {
            id: task.Id,
            title: task.title,
            completed: task.completed || false,
            priority: task.priority || 'medium',
            category: task.category || '',
            dueDate: task.due_date ? new Date(task.due_date) : null,
            createdAt: task.created_at ? new Date(task.created_at) : new Date(),
            completedAt: task.completed_at ? new Date(task.completed_at) : null
          };
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields for update operation
      const updateData = {
        Id: parseInt(id)
      };
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.dueDate !== undefined) {
        updateData.due_date = updates.dueDate ? updates.dueDate.toISOString() : null;
      }
      if (updates.completedAt !== undefined) {
        updateData.completed_at = updates.completedAt ? updates.completedAt.toISOString() : null;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to update task');
        }
        
        const successfulRecord = response.results[0];
        if (successfulRecord && successfulRecord.success) {
          const task = successfulRecord.data;
          
          // Transform database fields to match UI expectations
          return {
            id: task.Id,
            title: task.title,
            completed: task.completed || false,
            priority: task.priority || 'medium',
            category: task.category || '',
            dueDate: task.due_date ? new Date(task.due_date) : null,
            createdAt: task.created_at ? new Date(task.created_at) : new Date(),
            completedAt: task.completed_at ? new Date(task.completed_at) : null
          };
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Failed to delete task');
        }
        
        return true;
      }
      
      throw new Error('Failed to delete task');
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

export default taskService;