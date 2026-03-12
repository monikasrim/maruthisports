import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// Layout & Dashboard Pages
import AdminLayout from './components/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import Users from './pages/admin/Users';
import Products from './pages/admin/Products';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Strict Admin Check
  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-gray-100">
        <div className="text-2xl font-bold text-red-600">Access Denied: Admins Only</div>
        <p className="text-gray-600">Your account does not have administrator privileges.</p>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="px-6 py-2 text-white bg-red-600 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    );
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes with Nested Layout */}
          <Route
            path="/"
            element={
              <PrivateRoute role="admin">
                <AdminLayout />
              </PrivateRoute>
            }
          >
            {/* Sub-routes rendered inside AdminLayout's Outlet */}
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
