import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaShieldAlt,
    FaArrowRight,
    FaPlus,
    FaMinus,
    FaArrowLeft,
    FaCheckCircle,
    FaCreditCard,
    FaTruck,
    FaWallet,
    FaFileInvoice,
    FaTrash
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaQrcode } from 'react-icons/fa';

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { cartItems, cartTotalPrice, updateCartQty, removeFromCart, clearCart } = useCart();

    const [step, setStep] = useState(1);
    const [orderId, setOrderId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phoneNumber: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [couponCode, setCouponCode] = useState('');
    const [coupon, setCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [isVerifyingQR, setIsVerifyingQR] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
    const [isProcessingCard, setIsProcessingCard] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsApplyingCoupon(true);
        setCouponError('');
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.post('http://localhost:5000/api/coupons/validate', { code: couponCode }, config);
            setCoupon(data);
            toast.success('Coupon Applied!');
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Invalid Coupon');
            setCoupon(null);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const shippingPrice = cartTotalPrice > 5000 ? 0 : 250;
    const discountAmount = coupon ? (coupon.discountType === 'percentage' ? (cartTotalPrice * coupon.discount) / 100 : coupon.discount) : 0;
    const finalTotal = cartTotalPrice + shippingPrice - discountAmount;

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const placeOrderInDB = async (paymentResult = null) => {
        // Ensure we don't treat the React event object as a payment result
        const actualPaymentResult = (paymentResult && paymentResult.nativeEvent) ? null : paymentResult;

        try {
            const token = localStorage.getItem('token');
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item._id
                })),
                shippingAddress,
                paymentMethod,
                itemsPrice: cartTotalPrice,
                shippingPrice,
                taxPrice: 0,
                totalPrice: finalTotal,
                appliedCoupon: coupon ? { code: coupon.code, discount: discountAmount } : null,
                isPaid: !!actualPaymentResult,
                paidAt: actualPaymentResult ? Date.now() : null,
                paymentResult: actualPaymentResult || null
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            const { data: createdOrder } = await axios.post('http://localhost:5000/api/orders', orderData, config);
            setOrderId(createdOrder._id);
            clearCart();
            setStep(4);
            toast.success('Order Successfully Placed!');
        } catch (error) {
            console.error('Order saving failed:', error);
            toast.error('Failed to save order. Contact support.');
        }
    };

    const handleRazorpayPayment = async () => {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Create Order on Backend (User Port 5000)
            const { data: orderData } = await axios.post(
                "http://localhost:5000/api/payments/order",
                { amount: finalTotal },
                config
            );

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Maruthi Sports",
                description: "Pro Equipment Gear Checkout",
                order_id: orderData.id,
                handler: async (response) => {
                    try {
                        const { data } = await axios.post(
                            "http://localhost:5000/api/payments/verify",
                            response,
                            config
                        );
                        if (data.success) {
                            // Pass payment details to be saved with order
                            placeOrderInDB({
                                id: response.razorpay_payment_id,
                                status: 'Completed',
                                update_time: Date.now().toString(),
                                email_address: user?.email
                            });
                        }
                    } catch (err) {
                        toast.error("Payment Verification Failed");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: { color: "#2563eb" },
            };

            const paymentObject = new window.Razorpay(options);

            // Handle Simulation Mode
            if (orderData.mock) {
                console.log('SIMULATION MODE DETECTED');

                if (paymentMethod === 'UPI_QR') {
                    setShowQR(true);
                } else if (paymentMethod === 'DEBIT_CARD') {
                    setShowCardModal(true);
                } else {
                    toast.success("Simulation Mode: Processing Demo Payment...", { duration: 2000 });
                    setTimeout(() => {
                        placeOrderInDB({
                            id: `mock_pay_${Date.now()}`,
                            status: 'Completed',
                            update_time: Date.now().toString(),
                            email_address: user?.email
                        });
                    }, 1500);
                }
                return;
            }

            paymentObject.open();

        } catch (error) {
            console.error('Payment Error Detail:', error);
            toast.error("Payment Initialization Failed: " + (error.response?.data?.message || error.message));
        }
    };

    if (cartItems.length === 0 && step !== 4) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="text-center space-y-6">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter">Your bag is empty</h2>
                    <Link to="/shop" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase">Back to Shop</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-950 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Step Progress */}
                <div className="flex justify-center mb-16 px-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-slate-200 text-slate-400'}`}>
                                {step > s ? <FaCheckCircle /> : s}
                            </div>
                            {s < 3 && <div className={`w-12 sm:w-24 h-1 mx-2 rounded-full ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`}></div>}
                        </div>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto">
                    {step === 1 && (
                        <div className="space-y-10">
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter">Shipping <span className="text-blue-600">Logistics</span></h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Street Address</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold shadow-sm"
                                        value={shippingAddress.address}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                        placeholder="Enter your street address"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">City</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold shadow-sm"
                                        value={shippingAddress.city}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        placeholder="City"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">State</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold shadow-sm"
                                        value={shippingAddress.state}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                        placeholder="State"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Pincode</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold shadow-sm"
                                        value={shippingAddress.postalCode}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                        placeholder="Pincode"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold shadow-sm"
                                        value={shippingAddress.phoneNumber}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })}
                                        placeholder="Enter your 10-digit phone number"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.phoneNumber}
                                className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50 transition-all shadow-2xl"
                            >
                                Continue to Payment
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-10">
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter">Select <span className="text-blue-600">Method</span></h3>
                            <div className="grid gap-4">
                                {[
                                    { id: 'UPI', icon: <FaWallet />, label: 'Live Payment (UPI / Card)' },
                                    { id: 'UPI_QR', icon: <FaQrcode />, label: 'UPI Scan QR' },
                                    { id: 'DEBIT_CARD', icon: <FaCreditCard />, label: 'Debit / Credit Card' },
                                    { id: 'NETBANKING', icon: <FaCreditCard />, label: 'Net Banking' },
                                    { id: 'COD', icon: <FaTruck />, label: 'Cash on Delivery' }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`flex items-center gap-6 p-8 rounded-[2rem] border-2 transition-all text-left ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/50 shadow-xl' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                                    >
                                        <div className={`text-3xl ${paymentMethod === method.id ? 'text-blue-600' : 'text-slate-300'}`}>{method.icon}</div>
                                        <div className="flex-1">
                                            <span className="font-black italic uppercase tracking-tight text-xl">{method.label}</span>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Instant Verification</p>
                                        </div>
                                        {paymentMethod === method.id && <FaCheckCircle className="text-blue-600 text-2xl" />}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 bg-white border border-slate-200 py-6 rounded-2xl font-black uppercase tracking-widest">Back</button>
                                <button onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 shadow-2xl transition-all">Review Order</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-10">
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter">Elite <span className="text-blue-600">Review</span></h3>
                            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">GEAR LIST ({cartItems.length})</h4>
                                    <div className="space-y-4">
                                        {cartItems.map(item => (
                                            <div key={item._id} className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100 group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-white rounded-2xl p-2 border border-slate-100 flex items-center justify-center">
                                                        <img
                                                            src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image.replace(/\\/g, '/')}`}
                                                            alt={item.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="font-extrabold text-slate-900 uppercase italic text-sm block leading-none">{item.name}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-8">
                                                    <div className="flex items-center bg-white rounded-xl border border-slate-100 p-1 shadow-sm">
                                                        <button
                                                            onClick={() => updateCartQty(item._id, Math.max(1, item.qty - 1))}
                                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            <FaMinus className="text-[10px]" />
                                                        </button>
                                                        <span className="w-8 text-center font-black text-sm">{item.qty}</span>
                                                        <button
                                                            onClick={() => updateCartQty(item._id, item.qty + 1)}
                                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            <FaPlus className="text-[10px]" />
                                                        </button>
                                                    </div>

                                                    <div className="text-right w-24">
                                                        <p className="font-black text-slate-900">₹{(item.price * item.qty).toLocaleString()}</p>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm"
                                                    >
                                                        <FaTrash className="text-sm" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Promo Code Section */}
                                <div className="pt-8 border-t border-slate-50 space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">HAVE A PROMO CODE?</h4>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                placeholder="MARUTHI10"
                                                className={`w-full bg-slate-50 border ${couponError ? 'border-red-200' : coupon ? 'border-green-200' : 'border-slate-100'} rounded-2xl px-6 py-4 outline-none focus:border-blue-500 font-bold uppercase tracking-widest text-xs`}
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                disabled={coupon}
                                            />
                                            {coupon && <FaCheckCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500" />}
                                        </div>
                                        <button
                                            onClick={coupon ? () => { setCoupon(null); setCouponCode(''); } : handleApplyCoupon}
                                            disabled={isApplyingCoupon || (!couponCode && !coupon)}
                                            className={`px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${coupon ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
                                        >
                                            {isApplyingCoupon ? '...' : coupon ? 'Remove' : 'Apply'}
                                        </button>
                                    </div>
                                    {couponError && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest px-2">{couponError}</p>}
                                    {coupon && (
                                        <div className="bg-green-50 p-4 rounded-2xl flex justify-between items-center border border-green-100 animate-in fade-in slide-in-from-top-4">
                                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                                                Code <span className="text-slate-900">{coupon.code}</span> Activated
                                            </p>
                                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                                                -{coupon.discount}{coupon.discountType === 'percentage' ? '%' : ' OFF'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Grand Total</p>
                                        <p className="text-5xl font-black italic tracking-tighter">₹{finalTotal.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                                        Subtotal: ₹{cartTotalPrice.toLocaleString()} <br />
                                        {coupon && <span className="text-green-600 font-black">Discount: -₹{discountAmount.toLocaleString()} <br /></span>}
                                        Shipping: {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(2)} className="flex-1 bg-white border border-slate-200 py-6 rounded-2xl font-black uppercase tracking-widest">Back</button>
                                <button
                                    onClick={() => paymentMethod === 'COD' ? placeOrderInDB() : handleRazorpayPayment()}
                                    className="flex-[2] bg-blue-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-950 shadow-2xl shadow-blue-600/20 transition-all flex items-center justify-center gap-4"
                                >
                                    <span>{paymentMethod === 'COD' ? 'Confirm Order (COD)' : `Initiate ${paymentMethod === 'UPI_QR' ? 'QR' : (paymentMethod === 'NETBANKING' ? 'Banking' : 'Secure')} Payment`}</span>
                                    <FaArrowRight />
                                </button>
                            </div>

                            {/* UPI QR Modal Simulation */}
                            {showQR && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center space-y-8 shadow-2xl border border-blue-50">
                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Scan <span className="text-blue-600">& Pay</span></h4>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Simulation Mode Only</p>
                                        </div>

                                        <div className="bg-slate-50 p-6 rounded-3xl inline-block border-2 border-dashed border-blue-100 relative group transition-all">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=madhesmoni03@okaxis%26pn=Maruthi%20Sports%26am=${finalTotal}%26cu=INR`}
                                                alt="UPI QR"
                                                className="w-48 h-48 mx-auto grayscale group-hover:grayscale-0 transition-all duration-700"
                                            />
                                            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-xs px-4">
                                                <span className="font-bold text-slate-400 uppercase tracking-widest">Amount Due</span>
                                                <span className="font-black text-slate-900 italic text-xl">₹{finalTotal.toLocaleString()}</span>
                                            </div>
                                            <div className="bg-blue-50/50 p-4 rounded-2xl">
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] animate-pulse">Waiting for Payment Confirmation...</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setShowQR(false)}
                                                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all"
                                            >
                                                Abort
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    setIsVerifyingQR(true);
                                                    setTimeout(() => {
                                                        setIsVerifyingQR(false);
                                                        setShowQR(false);
                                                        placeOrderInDB({
                                                            id: `qr_mock_${Date.now()}`,
                                                            status: 'Completed',
                                                            update_time: Date.now().toString(),
                                                            email_address: user?.email
                                                        });
                                                    }, 2000);
                                                }}
                                                disabled={isVerifyingQR}
                                                className="flex-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                                            >
                                                {isVerifyingQR ? 'Verifying...' : 'Verify Payment'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Card Entry Simulation Modal */}
                            {showCardModal && (
                                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 space-y-8 shadow-2xl border border-blue-50">
                                        <div className="text-center space-y-2">
                                            <h4 className="text-2xl font-black uppercase italic tracking-tighter">Secure <span className="text-blue-600">Card Entry</span></h4>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Simulation Mode Only</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">Card Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="xxxx xxxx xxxx xxxx"
                                                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all text-center tracking-widest"
                                                    value={cardDetails.number}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">Expiry</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all text-center"
                                                        value={cardDetails.expiry}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block">CVC</label>
                                                    <input
                                                        type="password"
                                                        placeholder="***"
                                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all text-center"
                                                        value={cardDetails.cvc}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                                            <div className="flex justify-between items-center text-[10px] px-2 font-black text-slate-400 uppercase tracking-widest">
                                                <span>Final Total</span>
                                                <span className="text-slate-900 text-lg italic">₹{finalTotal.toLocaleString()}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setIsProcessingCard(true);
                                                    setTimeout(() => {
                                                        setIsProcessingCard(false);
                                                        setShowCardModal(false);
                                                        placeOrderInDB({
                                                            id: `card_mock_${Date.now()}`,
                                                            status: 'Completed',
                                                            update_time: Date.now().toString(),
                                                            email_address: user?.email
                                                        });
                                                    }, 2000);
                                                }}
                                                disabled={isProcessingCard}
                                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                                            >
                                                {isProcessingCard ? 'Processing...' : 'Secure Pay Now'}
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => setShowCardModal(false)}
                                            className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all"
                                        >
                                            Cancel Transaction
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center py-20 space-y-10">
                            <div className="w-40 h-40 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner ring-8 ring-green-50">
                                <FaCheckCircle className="text-7xl" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-6xl font-black italic uppercase tracking-tighter">GEAR <span className="text-green-600">DEPLOYED</span></h3>
                                <p className="text-slate-500 font-medium text-xl font-serif italic">Your elite equipment is on its way. Check your dashboard for status.</p>
                            </div>
                            <div className="flex gap-4 justify-center pt-8">
                                <Link to="/orders" className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Track Order</Link>
                                {orderId && (
                                    <Link to={`/order/invoice/${orderId}`} target="_blank" className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2">
                                        <FaFileInvoice /> View Invoice
                                    </Link>
                                )}
                                <Link to="/shop" className="bg-white border border-slate-200 px-10 py-5 rounded-2xl font-black uppercase tracking-widest">Continue Shopping</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Checkout;
