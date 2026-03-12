import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_URL from '../../api';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FaBolt, FaHistory, FaHeart, FaArrowRight, FaTrophy, FaFire } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        orderCount: 0,
        wishlistCount: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [ordersRes, wishlistRes] = await Promise.all([
                    axios.get(`${API_URL}/api/orders/mine`, config),
                    axios.get(`${API_URL}/api/wishlist`, config)
                ]);

                setStats({
                    orderCount: ordersRes.data.length,
                    wishlistCount: wishlistRes.data.products?.length || 0,
                    recentOrders: ordersRes.data.slice(0, 3)
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black uppercase text-[10px] tracking-widest text-slate-400">Syncing Athlete Performance...</p>
        </div>
    );

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative bg-slate-900 rounded-[4rem] p-10 lg:p-16 text-white overflow-hidden shadow-2xl shadow-blue-900/20">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-600/30 animate-pulse">
                            <FaBolt /> Pro Access Active
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
                            Welcome Back, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.name?.split(' ')?.[0] || 'Athlete'}</span>
                        </h2>
                        <p className="max-w-md text-slate-400 font-medium font-serif italic text-lg leading-relaxed">
                            Your equipment is ready. Track your deployments, manage your wishlist, and optimize your gear.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Link to="/shop" className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                                Gear Up Now
                            </Link>
                            <Link to="/profile" className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-700 transition-all">
                                Update Profile
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 text-center space-y-1 group hover:bg-white/10 transition-all">
                            <FaTrophy className="text-3xl text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <p className="text-3xl font-black italic tracking-tighter">{stats.orderCount}</p>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Deployments</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 text-center space-y-1 group hover:bg-white/10 transition-all">
                            <FaFire className="text-3xl text-purple-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <p className="text-3xl font-black italic tracking-tighter">{stats.wishlistCount}</p>
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Wishlisted</p>
                        </div>
                    </div>
                </div>

                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Recent Orders Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-end px-4">
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] italic leading-none">Gear History</h4>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Recent Orders</h3>
                        </div>
                        <Link to="/orders" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                            View All <FaArrowRight />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {stats.recentOrders.length === 0 ? (
                            <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-100 italic font-medium text-slate-400">
                                No recent deployments found.
                            </div>
                        ) : (
                            stats.recentOrders.map((order) => (
                                <div key={order._id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex items-center justify-between gap-6 group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                                            <FaHistory className="text-xl group-hover:text-blue-600 transition-colors" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">#{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="font-black text-slate-900 uppercase tracking-tighter italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="font-black text-blue-600 italic">₹{order.totalPrice.toLocaleString()}</p>
                                        <div className="flex flex-col items-end gap-1">
                                            <p className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                                {order.isPaid ? 'PAID' : 'UNPAID'}
                                            </p>
                                            <p className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 flex items-center gap-1">
                                                {order.status === 'Pending' ? 'ORDER PLACED' : (order.status || 'ORDER PLACED')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-6">
                    <div className="space-y-1 px-4">
                        <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] italic leading-none">Smart Actions</h4>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Athlete Hub</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <Link to="/orders" className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-4 hover:border-blue-200 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <FaHistory className="text-xl" />
                            </div>
                            <h5 className="font-black uppercase italic tracking-tighter">Track Gear</h5>
                            <p className="text-xs font-medium text-slate-400 leading-relaxed font-serif">Check the real-time status of your gear deployments.</p>
                        </Link>
                        <Link to="/wishlist" className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-4 hover:border-purple-200 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <FaHeart className="text-xl" />
                            </div>
                            <h5 className="font-black uppercase italic tracking-tighter">Gear Wishlist</h5>
                            <p className="text-xs font-medium text-slate-400 leading-relaxed font-serif">Manage the high-performance gear you need next.</p>
                        </Link>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 font-bold text-center text-[10px] uppercase tracking-[0.4em] text-slate-400 italic">
                        "Victory is paid for in advance with equipment and sweat."
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
