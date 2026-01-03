import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoute';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import TaskForm from './components/Tasks/TaskForm';
import TaskDetails from './components/Tasks/TaskDetails';
import PriorityLists from './components/Tasks/PriorityLists';
import UserManagement from './components/Users/UserManagement';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TaskList />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <TaskList />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/tasks/new"
              element={
                <PrivateRoute>
                  <TaskForm />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/tasks/edit/:id"
              element={
                <PrivateRoute>
                  <TaskForm />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/tasks/:id"
              element={
                <PrivateRoute>
                  <TaskDetails />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/priority"
              element={
                <PrivateRoute>
                  <PriorityLists />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/users"
              element={
                <PrivateRoute adminOnly={true}>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;