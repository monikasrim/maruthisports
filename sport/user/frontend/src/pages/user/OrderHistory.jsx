// FIXED BY ANTIGRAVITY - User Dashboard Integration
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_URL from '../../api';
import { Link } from 'react-router-dom';
import {
    FaShoppingBag,
    FaClock,
    FaCheckCircle,
    FaTruck,
    FaInfoCircle,
    FaFileInvoice
} from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const getImageUrl = (image) => {
        if (!image) return 'https://placehold.co/600x600?text=No+Image';
        if (image.startsWith('http')) return image;
        return `${API_URL}${image}`;
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                const { data } = await axios.get(`${API_URL}/api/orders/mine`, config);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const requestReturn = async (orderId) => {
        if (window.confirm('Request a return for this order? Our pro-team will review the equipment status.')) {
            toast.success('Return Request Dispatched! Our team will contact you shortly.');
        }
    };

    return (
        <div className="space-y-12">
            <div className="space-y-2">
                <h2 className="text-5xl font-black tracking-tighter uppercase italic">
                    MY <span className="text-blue-600">ORDERS</span>
                </h2>
                <p className="text-slate-500 font-medium font-serif italic text-lg">Track your gear deployments and victory history.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black uppercase text-[10px] tracking-widest text-slate-400">Loading Deployment Logs...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-[4rem] p-20 text-center border border-slate-100 shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <FaShoppingBag className="text-4xl text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-widest text-slate-300">No Orders Yet</h3>
                    <p className="text-slate-400 mt-2 font-medium">Your gear is waiting for its first victory.</p>
                    <Link to="/shop" className="mt-8 inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-600/20">Start Shopping</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all space-y-8 relative overflow-hidden">
                            {order.isDelivered && (
                                <div className="absolute top-0 right-0 py-2 px-10 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rotate-45 translate-x-10 translate-y-4">
                                    Pro Verified
                                </div>
                            )}
                            <div className="flex flex-col md:flex-row justify-between gap-6 pb-8 border-b border-slate-50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Identifier</p>
                                    <h4 className="font-black text-slate-900">#{order._id.toUpperCase()}</h4>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                                        <p className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                                        <p className="font-black text-blue-600 text-lg">₹{order.totalPrice.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</p>
                                        <div className={`flex items-center gap-2 font-bold text-xs uppercase ${order.isPaid ? 'text-green-600' : 'text-amber-500'}`}>
                                            {order.isPaid ? <FaCheckCircle /> : <FaClock />}
                                            {order.isPaid ? 'Success' : 'Pending'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment</p>
                                        <div className={`flex items-center gap-2 font-bold text-xs uppercase ${order.isDelivered ? 'text-blue-600' : 'text-slate-500'}`}>
                                            {order.isDelivered ? <FaCheckCircle /> : <FaTruck />}
                                            {order.isDelivered ? 'Deployed' : 'Processing'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-4">
                                    <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Deployment Status</h5>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {order.status === 'Pending' ? 'Order Placed' : (order.status || 'Order Placed')}
                                    </span>
                                </div>
                                <div className="relative px-4 py-8">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                            style={{
                                                width: order.status === 'Delivered' ? '100%' :
                                                    order.status === 'Out for Delivery' ? '75%' :
                                                        order.status === 'Shipped' ? '50%' :
                                                            order.status === 'Processing' ? '25%' : '0%'
                                            }}
                                        ></div>
                                    </div>
                                    <div className="relative flex justify-between">
                                        {[
                                            { label: 'Order Placed', icon: FaClock },
                                            { label: 'Processing', icon: FaInfoCircle },
                                            { label: 'Shipped', icon: FaTruck },
                                            { label: 'Out for Delivery', icon: FaTruck },
                                            { label: 'Delivered', icon: FaCheckCircle }
                                        ].map((step, index) => {
                                            const statuses = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
                                            const currentIdx = statuses.indexOf(order.status || 'Pending');
                                            const isCompleted = index <= currentIdx;
                                            const isActive = index === currentIdx;

                                            return (
                                                <div key={index} className="flex flex-col items-center group">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 z-10 
                                                            ${isCompleted ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                                                        <step.icon className={`text-xs ${isActive ? 'animate-pulse' : ''}`} />
                                                    </div>
                                                    <p className={`mt-3 text-[8px] font-black uppercase tracking-tighter text-center 
                                                            ${isCompleted ? 'text-slate-900' : 'text-slate-300'}`}>
                                                        {step.label}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Items</h5>
                                    <div className="space-y-3">
                                        {order.orderItems.map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group">
                                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                                                    <img
                                                        src={getImageUrl(item.image)}
                                                        className="max-w-full max-h-full object-contain"
                                                        alt={item.name}
                                                        onError={(e) => {
                                                            if (!item.image?.startsWith('http')) {
                                                                e.target.src = 'https://placehold.co/50x50';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 text-xs">
                                                    <p className="font-black text-slate-900 uppercase tracking-tighter italic">{item.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.qty} unit × ₹{item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between gap-6">
                                    <div className="bg-slate-50 p-6 rounded-3xl space-y-4 flex-1">
                                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <FaInfoCircle /> Dispatch Location
                                        </h5>
                                        <div className="space-y-1 text-sm">
                                            <p className="font-black italic uppercase tracking-tight text-slate-900">{order.shippingAddress.address}</p>
                                            <p className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                                            <p className="font-black text-blue-600 uppercase tracking-widest text-[10px]"><span className="text-slate-400 font-bold">Contact:</span> {order.shippingAddress.phoneNumber}</p>
                                        </div>
                                    </div>

                                    {order.isPaid && (
                                        <div className="flex gap-4">
                                            <Link
                                                to={`/order/invoice/${order._id}`}
                                                className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                                            >
                                                <FaFileInvoice /> Invoice
                                            </Link>
                                            <button
                                                onClick={() => requestReturn(order._id)}
                                                className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                                            >
                                                Request Return
                                            </button>
                                        </div>
                                    )}

                                    {(order.status === 'Pending' || order.status === 'Processing') && (
                                        <button
                                            onClick={async () => {
                                                const message = order.isPaid
                                                    ? 'Abort this order deployment? Since you have already paid, a refund will be initiated to your original payment method.'
                                                    : 'Abort this order deployment?';

                                                if (window.confirm(message)) {
                                                    try {
                                                        const token = localStorage.getItem('token');
                                                        const config = { headers: { Authorization: `Bearer ${token}` } };
                                                        await axios.put(`${API_URL}/api/orders/${order._id}/cancel`, {}, config);
                                                        toast.success('Mission Aborted: Order Cancelled');
                                                        window.location.reload();
                                                    } catch (err) {
                                                        toast.error('Failed to cancel deployment');
                                                    }
                                                }
                                            }}
                                            className="w-full py-4 rounded-2xl border-2 border-red-100 bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-200/50"
                                        >
                                            Cancel Deployment
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
