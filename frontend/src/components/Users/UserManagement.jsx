import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import ConfirmDialog from '../Common/ConfirmDialog';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, userId: null });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      setFormData({ name: '', email: '', password: '', role: 'user' });
      setShowForm(false);
      loadUsers();
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const handleDelete = (userId) => {
    setDeleteDialog({ isOpen: true, userId });
  };

  const confirmDelete = async () => {
    try {
      await userService.deleteUser(deleteDialog.userId);
      setDeleteDialog({ isOpen: false, userId: null });
      loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="user-management">
      {/* Header */}
      <div className="header">
        <h1>User Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {/* Create User Form */}
      {showForm && (
        <div className="card">
          <h2>Create New User</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Role *</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="form-control"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success">
              Create User
            </button>
          </form>
        </div>
      )}

      {/* Users Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, userId: null })}
      />
    </div>
  );
};

export default UserManagement;
