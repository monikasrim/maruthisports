import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../api';
import { FaPrint, FaArrowLeft, FaCheckCircle, FaDownload } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Invoice = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${API_URL}/api/orders/${id}`, config);
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order for invoice:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('invoice-content');
        if (!element) {
            console.error('Invoice content element not found');
            alert('Error: Invoice content not found');
            return;
        }

        try {
            console.log('Generating PDF...');
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: true, // Enable logging for debugging
                allowTaint: true,
            });
            console.log('Canvas generated successfully');
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Invoice_${order._id.toUpperCase()}.pdf`);
            console.log('PDF saved successfully');
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to download PDF. Please try again or use the Print option.');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-400 animate-pulse">Generating Invoice...</div>;
    if (!order) return <div className="p-20 text-center">Order not found.</div>;

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans p-4 sm:p-10 pt-24 sm:pt-32">
            {/* Action Bar (Hidden on Print) */}
            <div className="max-w-4xl mx-auto mb-10 flex justify-between items-center print:hidden relative z-20">
                <Link to="/orders" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">
                    <FaArrowLeft /> Back to Orders
                </Link>
                <div className="flex gap-4">
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/20"
                    >
                        <FaDownload /> Download PDF
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-3 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-950 transition-all shadow-xl shadow-blue-600/20"
                    >
                        <FaPrint /> Print Invoice
                    </button>
                </div>
            </div>

            {/* Invoice Table */}
            <div id="invoice-content" className="max-w-4xl mx-auto border-2 border-slate-100 rounded-[3rem] overflow-hidden p-12 bg-white shadow-sm print:border-0 print:p-0">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-50 pb-12 mb-12">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">M</div>
                            <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase"> Maruthi <span className="text-blue-600 font-light">Sports</span></h1>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                            Plot No. 42, Elite Arena <br />
                            Sports Hub South, Chennai <br />
                            Tamil Nadu - 600001
                        </p>
                    </div>
                    <div className="text-right space-y-2">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">INVOICE</h2>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">#{order._id.toUpperCase()}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Bill To</h4>
                        <div className="space-y-1">
                            <p className="font-black text-slate-900 uppercase">{order.user.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                {order.shippingAddress.address} <br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode} <br />
                                {order.shippingAddress.country} <br />
                                <span className="font-black text-slate-900">Phone: {order.shippingAddress.phoneNumber}</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Timeline</h4>
                        <div className="space-y-1">
                            <div className="flex justify-end gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <span>Date Issued:</span>
                                <span className="text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-end gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <span>Shipment Status:</span>
                                <span className="text-blue-600 font-black">{order.status === 'Pending' ? 'Order Placed' : (order.status || 'Order Placed')}</span>
                            </div>
                            <div className="flex justify-end gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <span>Payment Status:</span>
                                <span className={order.isPaid ? 'text-green-600' : 'text-amber-500'}>{order.isPaid ? 'Paid' : 'Unpaid'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <table className="w-full mb-12">
                    <thead>
                        <tr className="border-b-2 border-slate-50">
                            <th className="text-left py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Equipment</th>
                            <th className="text-center py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                            <th className="text-right py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</th>
                            <th className="text-right py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {order.orderItems.map((item, i) => (
                            <tr key={i} className="group">
                                <td className="py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center p-2">
                                            <img
                                                src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`}
                                                crossOrigin="anonymous"
                                                className="max-w-full max-h-full object-contain"
                                                alt=""
                                            />
                                        </div>
                                        <span className="font-black text-slate-900 uppercase italic tracking-tighter text-sm">{item.name}</span>
                                    </div>
                                </td>
                                <td className="py-6 text-center font-bold text-slate-600">x{item.qty}</td>
                                <td className="py-6 text-right font-bold text-slate-600">₹{item.price.toLocaleString()}</td>
                                <td className="py-6 text-right font-black text-slate-900">₹{(item.price * item.qty).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end pt-12 border-t-2 border-slate-100">
                    <div className="w-64 space-y-4">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-slate-900 font-bold">₹{order.itemsPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Express Shipping</span>
                            <span className="text-slate-900 font-bold">{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Grand Total</span>
                            <span className="text-3xl font-black italic tracking-tighter text-slate-900">₹{order.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-20 pt-12 border-t-2 border-slate-50 text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        <FaCheckCircle /> Official Maruthi Sports Gear
                    </div>
                    <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.3em]">Thank you for fueling your athletic journey with us.</p>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
