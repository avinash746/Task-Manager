import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../services/taskService';
import TaskItem from './TaskItem';
import Pagination from '../Common/Pagination';
import ConfirmDialog from '../Common/ConfirmDialog';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, taskId: null });

  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, [currentPage, filters]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks(currentPage, 10, filters);
      setTasks(data.tasks || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskService.updateTaskStatus(taskId, status);
      loadTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleDelete = (taskId) => {
    setDeleteDialog({ isOpen: true, taskId });
  };

  const confirmDelete = async () => {
    try {
      await taskService.deleteTask(deleteDialog.taskId);
      setDeleteDialog({ isOpen: false, taskId: null });
      loadTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="task-list">
      {/* Header */}
      <div className="header">
        <h1>My Tasks</h1>
        <button
          onClick={() => navigate('/tasks/new')}
          className="btn btn-primary"
        >
          Create New Task
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <label>
          Status:
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Priority:
          <select name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
      </div>

      {/* Task List */}
      <div className="tasks">
        {tasks.length === 0 ? (
          <p>No tasks found. Create your first task!</p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, taskId: null })}
      />
    </div>
  );
};

export default TaskList;
