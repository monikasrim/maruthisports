import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/user/OrderHistory';
import Profile from './pages/user/Profile';
import Wishlist from './pages/user/Wishlist';
import Invoice from './pages/user/Invoice';
import Dashboard from './pages/user/Dashboard';
import Terms from './pages/Terms';
import ProductDetails from './pages/ProductDetails';
import Layout from './components/Layout';
import UserLayout from './components/user/UserLayout';
import Chatbot from './components/Chatbot';

import { Toaster } from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private / Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserLayout>
                  <Dashboard />
                </UserLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserLayout>
                  <Profile />
                </UserLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <UserLayout>
                  <Wishlist />
                </UserLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <UserLayout>
                  <OrderHistory />
                </UserLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/order/invoice/:id"
            element={
              <PrivateRoute>
                <Invoice />
              </PrivateRoute>
            }
          />

          {/* Catch-all - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Chatbot />
    </Router>
  );
}

export default App;
