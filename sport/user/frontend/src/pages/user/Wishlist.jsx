// FIXED BY ANTIGRAVITY - User Dashboard Integration
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_URL from '../../api';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingBag } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import EmptyState from '../../components/EmptyState';

const Wishlist = () => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const getImageUrl = (image) => {
        if (!image) return 'https://placehold.co/600x600?text=No+Image';
        if (image.startsWith('http')) return image;
        return `${API_URL}${image.replace(/\\/g, '/')}`;
    };

    const fetchWishlist = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${API_URL}/api/wishlist`, config);
            setWishlist(data.products || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const removeFromWishlist = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`${API_URL}/api/wishlist/${id}`, config);
            setWishlist(wishlist.filter((item) => item._id !== id));
            toast.success('Removed from Wishlist');
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    return (
        <div className="space-y-12">
            <div className="space-y-2">
                <h2 className="text-5xl font-black tracking-tighter uppercase italic">
                    YOUR <span className="text-blue-600">WISHLIST</span>
                </h2>
                <p className="text-slate-500 font-medium font-serif italic text-lg">Your dream gear, saved for the ultimate play.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black uppercase text-[10px] tracking-widest text-slate-400">Loading Wishlist...</p>
                </div>
            ) : wishlist.length === 0 ? (
                <EmptyState
                    type="wishlist"
                    title="Your Heart is Empty"
                    message="Add equipment that fuels your passion. Save your favorite gear for later."
                    actionText="Explore Shop"
                    actionLink="/shop"
                />
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlist.map((item) => (
                        <div key={item._id} className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center space-y-6">
                            <div className="w-40 h-40 bg-slate-50 rounded-[2rem] overflow-hidden flex items-center justify-center p-6 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        if (!item.image?.startsWith('http')) {
                                            e.target.src = 'https://placehold.co/200x200?text=' + encodeURIComponent(item.name);
                                        } else {
                                            e.target.src = 'https://placehold.co/200x200?text=' + encodeURIComponent(item.name);
                                        }
                                    }}
                                />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xl font-black uppercase italic tracking-tighter">{item.name}</h4>
                                <p className="text-blue-600 font-black text-2xl">₹{item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-4 w-full">
                                <Link
                                    to={`/product/${item._id}`}
                                    className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <FaShoppingBag /> View Gear
                                </Link>
                                <button
                                    onClick={() => removeFromWishlist(item._id)}
                                    className="bg-red-50 text-red-600 p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all border border-red-100"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
