import { Link } from 'react-router-dom';
import API_URL from '../api';
import {
    FaTrash,
    FaPlus,
    FaMinus,
    FaArrowRight,
    FaShoppingBag,
    FaShieldAlt
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';

const Cart = () => {
    const {
        cartItems,
        removeFromCart,
        updateCartQty,
        cartTotalPrice,
        cartTotalItems
    } = useCart();

    const getImageUrl = (image) => {
        if (!image) return 'https://placehold.co/600x600?text=No+Image';
        if (image.startsWith('http')) return image;
        return `${API_URL}${item.image.replace(/\\/g, '/')}`;
    };

    const shippingPrice = cartTotalPrice > 5000 ? 0 : 250;
    const finalTotal = cartTotalPrice + shippingPrice;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-950 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-5xl font-black tracking-tighter uppercase italic">
                                    YOUR <span className="text-blue-600">BAG</span>
                                </h2>
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">
                                    {cartTotalItems} Items in your selection
                                </p>
                            </div>
                            <Link to="/shop" className="text-xs font-black uppercase tracking-widest text-blue-600 hover:underline mb-2">Continue Shopping →</Link>
                        </div>

                        {cartItems.length === 0 ? (
                            <EmptyState
                                type="cart"
                                title="Your Bag is Empty"
                                message="Looks like you haven't added any gear to your selection yet. Time to gear up and dominate."
                                actionText="Shop Gear"
                                actionLink="/shop"
                            />
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="bg-white rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center gap-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                        <div className="w-40 h-40 bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center p-4">
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    if (!item.image?.startsWith('http')) {
                                                        e.target.src = 'https://placehold.co/200x200?text=' + encodeURIComponent(item.name);
                                                    } else {
                                                        e.target.src = 'https://placehold.co/200x200?text=' + encodeURIComponent(item.name);
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div className="flex-1 space-y-2 text-center sm:text-left">
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.category}</p>
                                            <h4 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">{item.name}</h4>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Brand: {item.brand}</p>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center bg-slate-50 rounded-2xl p-2 border border-slate-100">
                                                <button
                                                    onClick={() => updateCartQty(item._id, Math.max(1, item.qty - 1))}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span className="w-12 text-center font-black text-lg">{item.qty}</span>
                                                <button
                                                    onClick={() => updateCartQty(item._id, item.qty + 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>
                                            <p className="text-2xl font-black text-slate-900 w-32 text-right">₹{(item.price * item.qty).toLocaleString()}</p>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary Checkout */}
                    <div className="lg:w-96">
                        <div className="bg-slate-950 rounded-[3rem] p-10 text-white space-y-10 sticky top-32 shadow-2xl">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">SUMMARY</h3>

                            <div className="space-y-6">
                                <div className="flex justify-between text-slate-400 font-bold uppercase text-xs tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{cartTotalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 font-bold uppercase text-xs tracking-widest">
                                    <span>Shipping</span>
                                    <span className="text-white">{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-4xl font-black italic tracking-tighter">₹{finalTotal.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <Link to="/checkout" className="flex items-center justify-center gap-4 bg-blue-600 w-full py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-blue-600/20 group">
                                <span>Go to Checkout</span>
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="pt-6 border-t border-white/5 flex items-center gap-4 opacity-30 grayscale">
                                <FaShieldAlt className="text-2xl" />
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] leading-tight">Secure checkout <br /> Guaranteed encryption</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
