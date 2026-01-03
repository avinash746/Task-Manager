import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import taskService from '../../services/taskService';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const TaskForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  
  const id = params.id;
  const isAdmin = auth.isAdmin;
  const user = auth.user;
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: ''
  });

  useEffect(() => {
    console.log('TaskForm mounted');
    console.log('User:', user);
    console.log('IsAdmin:', isAdmin);
    console.log('Navigate function:', typeof navigate);
    
    if (isAdmin) {
      loadUsers();
    }
    if (id) {
      loadTask();
    }
  }, [id, isAdmin]);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      console.log('Users loaded:', data.users);
      setUsers(data.users);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const loadTask = async () => {
    try {
      const data = await taskService.getTask(id);
      const task = data.task;
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.split('T')[0],
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo._id
      });
    } catch (err) {
      setError('Error loading task');
      console.error('Error loading task:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    console.log('Cancel clicked, navigating to /tasks');
    navigate('/tasks');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== Form Submit Started ===');
    console.log('Navigate function type:', typeof navigate);
    console.log('Navigate function:', navigate);
    console.log('Form Data:', formData);
    console.log('User:', user);
    
    setLoading(true);
    setError('');

    try {
      let result;
      
      // Prepare task data
      const taskData = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo || user.id
      };
      
      console.log('Task data to send:', taskData);

      if (id) {
        console.log('Updating task with ID:', id);
        result = await taskService.updateTask(id, taskData);
        console.log('Task updated successfully:', result);
      } else {
        console.log('Creating new task');
        result = await taskService.createTask(taskData);
        console.log('Task created successfully:', result);
      }
      
      console.log('About to navigate to /tasks');
      console.log('Navigate is:', navigate);
      
      // Use setTimeout to ensure navigation happens
      setTimeout(() => {
        if (typeof navigate === 'function') {
          console.log('Navigating now...');
          navigate('/tasks');
        } else {
          console.error('Navigate is not a function!', navigate);
          // Fallback to window.location
          window.location.href = '/tasks';
        }
      }, 100);
      
    } catch (err) {
      console.error('Error saving task:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Error saving task. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{id ? 'Edit Task' : 'Create New Task'}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter task title"
            />
          </div>
          
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="form-control"
              placeholder="Enter task description"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-control"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {isAdmin && users.length > 0 && (
              <div className="form-group">
                <label>Assign To *</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary"
            >
              {loading ? 'Saving...' : (id ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;