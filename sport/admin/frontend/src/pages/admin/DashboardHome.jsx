import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../api';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts';
import {
    FaPlus,
    FaShoppingCart,
    FaUsers,
    FaBoxOpen,
    FaInfoCircle,
    FaExclamationTriangle,
    FaStar
} from 'react-icons/fa';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#ca8a04', '#16a34a'];

const DashboardHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalSales: 0,
        lowStockProducts: 0,
        salesChartData: [],
        latestOrders: [],
        categoryDistribution: [],
        topProducts: [],
        alerts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axios.get(`${API_URL}/api/stats`, config);
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [navigate]);

    const getStatusColor = (isPaid, isDelivered) => {
        if (isDelivered) return 'bg-blue-100 text-blue-700';
        if (isPaid) return 'bg-green-100 text-green-700';
        return 'bg-gray-100 text-gray-500';
    };


    return (
        <div className="space-y-6">
            {/* Standard Clean Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
                    <p className="text-sm text-gray-500">Overview of Maruthi Sports performance</p>
                </div>
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all font-bold text-sm shadow-md"
                >
                    <FaPlus /> <span>New Product</span>
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-32">
                            <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                        </div>
                    ))}
                    <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full mb-4"></div>
                        <p className="text-gray-400 font-medium">Analyzing business metrics...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Dynamic Alerts Section */}
                    {stats.alerts.length > 0 && (
                        <div className="space-y-3">
                            {stats.alerts.map((alert, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => navigate(alert.link)}
                                    className={`flex items-center p-4 rounded-xl border-l-[6px] cursor-pointer shadow-sm transition-transform hover:scale-[1.005] bg-white ${alert.type === 'warning' ? 'border-orange-500' : 'border-blue-500'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3 flex-1">
                                        {alert.type === 'warning' ?
                                            <FaExclamationTriangle className="text-orange-500 text-lg" /> :
                                            <FaInfoCircle className="text-blue-500 text-lg" />
                                        }
                                        <span className="text-sm font-semibold text-gray-700">{alert.message}</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400">View Details</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* KPI Metrics Grid - Back to Stable White Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, color: 'text-blue-600', sub: 'Total sales value' },
                            { label: 'Total Orders', value: stats.totalOrders, color: 'text-purple-600', sub: `${stats.latestOrders.length} recent orders` },
                            { label: 'Active Catalog', value: stats.totalProducts, color: 'text-pink-600', sub: `${stats.lowStockProducts} low stock items` },
                            { label: 'Athletes', value: stats.totalUsers, color: 'text-orange-600', sub: 'Registered customers' },
                        ].map((kpi, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                                <h3 className={`text-3xl font-black ${kpi.color} mt-2`}>{kpi.value}</h3>
                                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">{kpi.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions Shortcuts */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-6 overflow-x-auto">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Quick Links:</h4>
                        <div className="flex space-x-4">
                            <button onClick={() => navigate('/orders')} className="flex items-center space-x-2 text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                                <FaShoppingCart /> <span>Orders</span>
                            </button>
                            <button onClick={() => navigate('/inventory')} className="flex items-center space-x-2 text-sm font-bold text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                                <FaBoxOpen /> <span>Stock</span>
                            </button>
                            <button onClick={() => navigate('/users')} className="flex items-center space-x-2 text-sm font-bold text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                                <FaUsers /> <span>Users</span>
                            </button>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="text-lg font-bold text-gray-800 mb-6 flex justify-between items-center">
                                Sales Growth
                                <span className="text-xs font-medium text-gray-400">Last 7 Days</span>
                            </h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={stats.salesChartData}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="text-lg font-bold text-gray-800 mb-6 flex justify-between items-center">
                                Category Sales
                                <span className="text-xs font-medium text-gray-400">Dist.</span>
                            </h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.categoryDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Stock Value</h4>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={stats.categoryDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.categoryDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-50">
                                {stats.categoryDistribution.map((entry, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase truncate">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Transactions & Top Products */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h4 className="text-lg font-bold text-gray-800">Recent Transactions</h4>
                                <button onClick={() => navigate('/orders')} className="text-blue-600 text-xs font-bold hover:underline">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Customer</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {stats.latestOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-gray-800">{order.user?.name || 'Customer'}</p>
                                                    <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.isPaid, order.isDelivered)}`}>
                                                        {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : (order.status === 'Pending' ? 'Order Placed' : (order.status || 'Order Placed'))}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-800 text-right">₹{order.totalPrice.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FaStar className="text-amber-400" /> Top Selling
                            </h4>
                            <div className="space-y-4">
                                {stats.topProducts.map((prod) => (
                                    <div key={prod._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-all">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0">
                                            <img
                                                src={`${API_URL}${prod.image}`}
                                                className="w-full h-full object-cover rounded-lg shadow-sm"
                                                alt=""
                                                onError={(e) => { e.target.src = 'https://placehold.co/100'; }}
                                            />
                                        </div>
                                        <div className="flex-1 truncate">
                                            <p className="text-sm font-bold text-gray-800 truncate">{prod.name}</p>
                                            <div className="flex items-center text-amber-500 space-x-1">
                                                <FaStar className="text-[10px]" />
                                                <span className="text-[10px] font-bold">{prod.rating}</span>
                                            </div>
                                            <p className="text-xs font-black text-red-600 mt-0.5">₹{prod.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardHome;
