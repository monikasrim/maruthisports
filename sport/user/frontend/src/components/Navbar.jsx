import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaHistory, FaSignOutAlt, FaBell, FaCheckCircle, FaExclamationTriangle, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { cartTotalItems } = useCart();
    const { user, logout } = useContext(AuthContext);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (user) {
                try {
                    const token = localStorage.getItem('token');
                    const { data } = await axios.get(`${API_URL}/api/notifications`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setNotifications(data);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            }
        };

        const fetchWishlist = async () => {
            if (user) {
                try {
                    const token = localStorage.getItem('token');
                    const { data } = await axios.get(`${API_URL}/api/wishlist`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setWishlistCount(data.products?.length || 0);
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                }
            }
        };

        fetchNotifications();
        fetchWishlist();
        const interval = setInterval(() => {
            fetchNotifications();
            fetchWishlist();
        }, 120000); // Polling every 120s to reduce server load
        return () => clearInterval(interval);
    }, [user]);

    const markRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/notifications/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="Maruthi Sports Logo" className="h-16 w-auto object-contain" />
                </Link>

                <div className="hidden md:flex items-center space-x-8 font-bold text-xs uppercase tracking-[0.2em] text-slate-500">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <Link to="/shop" className="hover:text-blue-600 transition-colors">Products</Link>
                    <a href="/#categories" className="hover:text-blue-600 transition-colors cursor-pointer">Categories</a>
                    <Link to="/orders" className="hover:text-blue-600 transition-colors">Orders</Link>

                    <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
                </div>

                <div className="flex items-center space-x-6">
                    {/* Notifications */}
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                                className="relative p-2 text-slate-600 hover:text-blue-600 transition-all group"
                            >
                                <FaBell className={`text-xl ${unreadCount > 0 ? 'animate-swing origin-top' : ''}`} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {isNotifOpen && (
                                <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 space-y-4 animate-fade-in-up z-[60]">
                                    <div className="flex justify-between items-center px-2">
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Notifications</h5>
                                        {unreadCount > 0 && <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{unreadCount} New Alerts</span>}
                                    </div>
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <p className="text-center py-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">No New Alerts</p>
                                        ) : (
                                            notifications.map(n => (
                                                <div
                                                    key={n._id}
                                                    onClick={() => markRead(n._id)}
                                                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${n.isRead ? 'bg-slate-50 border-slate-50 opacity-60' : 'bg-white border-blue-100 shadow-sm border-l-4 border-l-blue-600'}`}
                                                >
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="space-y-1">
                                                            <h6 className="text-[10px] font-black uppercase tracking-tight text-slate-900">{n.title}</h6>
                                                            <p className="text-[10px] font-medium text-slate-500 leading-tight">{n.message}</p>
                                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest pt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        {!n.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 shrink-0"></div>}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {user && (
                        <Link to="/wishlist" className="relative p-2 text-slate-600 hover:text-red-500 transition-colors group">
                            <FaHeart className="text-xl" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                    )}

                    <Link to="/cart" className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors group">
                        <FaShoppingCart className="text-xl" />
                        <span className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                            {cartTotalItems}
                        </span>
                    </Link>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                                className="flex items-center space-x-3 bg-slate-50 p-2 pr-4 rounded-full border border-slate-100 hover:border-blue-200 transition-all group"
                            >
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xs uppercase">
                                    {user?.name?.[0] || 'U'}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{user?.name?.split(' ')?.[0] || 'Athlete'}</span>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-4 w-56 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-4 py-6 space-y-4 animate-fade-in-up z-[60]">
                                    <h5 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Athlete Hub</h5>
                                    <div className="space-y-1">
                                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-sm font-bold text-slate-700">
                                            <FaUser className="text-blue-600" /> Dashboard
                                        </Link>
                                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-sm font-bold text-slate-700">
                                            <FaUser className="text-blue-600" /> Profile
                                        </Link>
                                        <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all text-sm font-bold text-slate-700">
                                            <FaHistory className="text-blue-600" /> Orders
                                        </Link>
                                    </div>
                                    <div className="pt-4 border-t border-slate-50">
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all text-sm font-bold text-red-600"
                                        >
                                            <FaSignOutAlt /> Log Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-6">
                            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600">Login</Link>
                            <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-600/20">Join Club</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
