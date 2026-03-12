import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../api';
import { FaCheck, FaTruck, FaClock, FaEye } from 'react-icons/fa';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const queryUser = new URLSearchParams(location.search).get('user');

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const { data } = await axios.get(`${API_URL}/api/orders`, config);
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredByQuery = queryUser ? orders.filter(o => o.user?._id === queryUser) : orders;

    const filteredOrders = filteredByQuery.filter(o =>
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchOrders();
    }, []);

    const deliverOrder = async (id) => {
        if (window.confirm('Mark this order as delivered?')) {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                await axios.put(`${API_URL}/api/orders/${id}/deliver`, {}, config);
                fetchOrders();
            } catch (error) {
                console.error('Error updating delivery:', error);
                alert('Update failed');
            }
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.put(`${API_URL}/api/orders/${id}/status`, { status }, config);
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Status update failed');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-gray-100 text-gray-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Out for Delivery': return 'bg-yellow-100 text-yellow-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Deployment Management</h2>
                    <p className="text-sm text-gray-500">Track and update the status of active gear shipments ({orders.length} total).</p>
                </div>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search ID or Athlete..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-blue-600/10 focus:border-blue-600 transition-all w-full md:w-64 shadow-sm"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Paid</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="w-8 h-8 border-3 border-red-100 border-t-red-600 rounded-full"></div>
                                        <p className="text-sm text-gray-500 font-medium text-sm">Retrieving orders...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-20 text-center text-gray-400 italic">
                                    No deployments found matching "{searchTerm}".
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-blue-600">{order._id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-800">{order.user?.name || 'Deleted User'}</div>
                                        <div className="text-xs text-gray-400">{order.createdAt.substring(0, 10)}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-700">₹{order.totalPrice.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {order.isPaid ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                                                Paid {order.paidAt?.substring(0, 10)}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 uppercase">
                                                Unpaid
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status || 'Pending'}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className={`text-[10px] font-bold uppercase rounded-md px-2 py-1 border-none focus:ring-0 cursor-pointer ${getStatusColor(order.status || 'Pending')}`}
                                        >
                                            <option value="Pending">Order Placed</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
