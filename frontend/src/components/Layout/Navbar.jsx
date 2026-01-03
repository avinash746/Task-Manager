// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Navbar = () => {
//   const { user, logout, isAdmin } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <h2 className="logo">Task Manager</h2>

//         {user && (
//           <ul className="nav-links">
//             <li>
//               <Link to="/tasks">My Tasks</Link>
//             </li>

//             <li>
//               <Link to="/priority">Priority View</Link>
//             </li>

//             {isAdmin && (
//               <li>
//                 <Link to="/admin/users">Users</Link>
//               </li>
//             )}

//             <li className="welcome">
//               Welcome, {user.name}
//             </li>

//             <li>
//               <button onClick={handleLogout}>Logout</button>
//             </li>
//           </ul>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Task Manager
        </Link>
        
        {user && (
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/tasks" className="nav-link">My Tasks</Link>
            </li>
            <li className="nav-item">
              <Link to="/priority" className="nav-link">Priority View</Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link to="/users" className="nav-link">Users</Link>
              </li>
            )}
            <li className="nav-item">
              <span className="nav-user">Welcome, {user.name}</span>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;