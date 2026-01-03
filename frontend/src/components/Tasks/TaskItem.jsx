import { useNavigate } from 'react-router-dom';

const TaskItem = ({ task, onDelete, onStatusChange }) => {
  const navigate = useNavigate();

  const getPriorityClass = (priority) => {
    const classes = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      urgent: 'priority-urgent',
    };
    return classes[priority] || '';
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: 'status-pending',
      'in-progress': 'status-progress',
      completed: 'status-completed',
    };
    return classes[status] || '';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="task-item">
      <div className="task-header">
        <h3
          onClick={() => navigate(`/tasks/${task._id}`)}
          className="task-title"
        >
          {task.title}
        </h3>

        <span className={getPriorityClass(task.priority)}>
          {task.priority}
        </span>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <span>Due: {formatDate(task.dueDate)}</span>
        <span className={getStatusClass(task.status)}>
          {task.status}
        </span>
      </div>

      {task.assignedTo && (
        <p className="task-assigned">
          Assigned to: {task.assignedTo.name}
        </p>
      )}

      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task._id, e.target.value)
          }
          className="form-control-sm"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => navigate(`/tasks/edit/${task._id}`)}
          className="btn btn-sm btn-secondary"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task._id)}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
