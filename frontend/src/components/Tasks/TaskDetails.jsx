import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskService from '../../services/taskService';
import ConfirmDialog from '../Common/ConfirmDialog';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const data = await taskService.getTask(id);
      setTask(data.task);
    } catch (err) {
      console.error('Error loading task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await taskService.deleteTask(id);
      navigate('/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const getPriorityClass = (priority) => {
    const classes = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      urgent: 'priority-urgent',
    };
    return classes[priority] || '';
  };

  if (loading) {
    return <div>Loading task details...</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="task-details">
      <div className="task-header">
        <h2>{task.title}</h2>
        <span className={getPriorityClass(task.priority)}>
          {task.priority}
        </span>
      </div>

      <div className="task-section">
        <h4>Description</h4>
        <p>{task.description}</p>
      </div>

      <div className="task-section">
        <p>
          <strong>Status:</strong> {task.status}
        </p>
        <p>
          <strong>Due Date:</strong>{' '}
          {new Date(task.dueDate).toLocaleDateString()}
        </p>
      </div>

      <div className="task-section">
        <p>
          <strong>Assigned To:</strong>{' '}
          {task.assignedTo.name} ({task.assignedTo.email})
        </p>
        <p>
          <strong>Created By:</strong> {task.createdBy.name}
        </p>
      </div>

      <div className="task-section">
        <p>
          <strong>Created:</strong>{' '}
          {new Date(task.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Last Updated:</strong>{' '}
          {new Date(task.updatedAt).toLocaleString()}
        </p>
      </div>

      <div className="task-actions">
        <button
          onClick={() => navigate('/tasks')}
          className="btn btn-secondary"
        >
          Back to Tasks
        </button>

        <button
          onClick={() => navigate(`/tasks/edit/${task._id}`)}
          className="btn btn-primary"
        >
          Edit Task
        </button>

        <button
          onClick={() => setDeleteDialog(true)}
          className="btn btn-danger"
        >
          Delete Task
        </button>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog(false)}
      />
    </div>
  );
};

export default TaskDetails;
