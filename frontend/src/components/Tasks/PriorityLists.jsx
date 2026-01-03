import { useState, useEffect } from 'react';
import taskService from '../../services/taskService';
import { useNavigate } from 'react-router-dom';

const PriorityLists = () => {
  const [tasksByPriority, setTasksByPriority] = useState({
    low: [],
    medium: [],
    high: [],
    urgent: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAllTasks();
  }, []);

  const loadAllTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks(1, 1000);
      const tasks = data.tasks;

      const grouped = {
        low: tasks.filter((t) => t.priority === 'low'),
        medium: tasks.filter((t) => t.priority === 'medium'),
        high: tasks.filter((t) => t.priority === 'high'),
        urgent: tasks.filter((t) => t.priority === 'urgent'),
      };

      setTasksByPriority(grouped);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      await taskService.updateTaskPriority(taskId, newPriority);
      loadAllTasks();
    } catch (err) {
      console.error('Error updating priority:', err);
    }
  };

  const PriorityColumn = ({ priority, tasks }) => (
    <div className="priority-column">
      <h3>
        {priority.toUpperCase()} ({tasks.length})
      </h3>

      {tasks.length === 0 ? (
        <p>No {priority} priority tasks</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="task-card">
            <h4 onClick={() => navigate(`/tasks/${task._id}`)}>
              {task.title}
            </h4>

            <p>{task.description.substring(0, 100)}...</p>

            <div className="task-meta">
              <span>{task.status}</span>
              <span>
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>

            <select
              value={task.priority}
              onChange={(e) =>
                handlePriorityChange(task._id, e.target.value)
              }
              className="form-control-sm priority-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        ))
      )}
    </div>
  );

  if (loading) {
    return <div>Loading priority view...</div>;
  }

  return (
    <div className="priority-view">
      <div className="header">
        <h2>Priority View</h2>
        <button
          onClick={() => navigate('/tasks/new')}
          className="btn btn-primary"
        >
          Create New Task
        </button>
      </div>

      <div className="priority-grid">
        <PriorityColumn priority="low" tasks={tasksByPriority.low} />
        <PriorityColumn priority="medium" tasks={tasksByPriority.medium} />
        <PriorityColumn priority="high" tasks={tasksByPriority.high} />
        <PriorityColumn priority="urgent" tasks={tasksByPriority.urgent} />
      </div>
    </div>
  );
};

export default PriorityLists;
