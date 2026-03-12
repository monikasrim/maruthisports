import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api';
import {
    FaStar,
    FaArrowLeft,
    FaShoppingCart,
    FaTruck,
    FaShieldAlt,
    FaCamera,
    FaTimes,
    FaHeart
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const getImageUrl = (image) => {
        if (!image) return 'https://placehold.co/600x600?text=No+Image';
        if (image.startsWith('http')) return image;
        return `${API_URL}${image.replace(/\\/g, '/')}`;
    };

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewImages, setReviewImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const addToWishlistHandler = async () => {
        setWishlistLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to use Wishlist');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${API_URL}/api/wishlist/${id}`, {}, config);
            toast.success('Added to Wishlist');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error adding to wishlist');
        } finally {
            setWishlistLoading(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            const { data } = await axios.post(`${API_URL}/api/upload`, formData, config);
            setReviewImages([...reviewImages, data]);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image upload failed');
        }
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(
                `${API_URL}/api/products/${id}/reviews`,
                { rating, comment, images: reviewImages },
                config
            );
            toast.success('Review Submitted!');
            setRating(5);
            setComment('');
            setReviewImages([]);
            // Refresh product data
            const { data } = await axios.get(`${API_URL}/api/products/${id}`);
            setProduct(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting review');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return <div className="p-20 text-center">Product not found.</div>;

    return (
        <div className="min-h-screen bg-white pt-24 pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link to="/shop" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-12">
                    <FaArrowLeft className="mr-2" /> Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
                    {/* Image Area */}
                    <div className="relative group">
                        <div className="aspect-square rounded-[4rem] bg-slate-50 flex items-center justify-center p-12 overflow-hidden border border-slate-100">
                            <img
                                src={getImageUrl(product.image)}
                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                alt={product.name}
                                onError={(e) => {
                                    if (!product.image?.startsWith('http')) {
                                        e.target.src = `${API_URL}/admin-uploads` + product.image?.replace('/uploads', '');
                                    } else {
                                        e.target.src = 'https://placehold.co/600x600?text=' + encodeURIComponent(product.name);
                                    }
                                }}
                            />
                        </div>
                        {product.countInStock === 0 && (
                            <div className="absolute top-8 left-8 bg-slate-950 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                                Out of Stock
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col">
                        <div className="space-y-4 mb-8">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">{product.brand}</span>
                            <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'} />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">({product.numReviews} Reviews)</span>
                            </div>
                        </div>

                        <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">
                            {product.description}
                        </p>

                        <div className="flex items-center gap-8 mb-12">
                            <span className="text-5xl font-black italic tracking-tighter">₹{product.price.toLocaleString()}</span>
                            <div className="h-10 w-px bg-slate-200"></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Free Express Shipping</span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => { addToCart(product); toast.success('Added to bag!'); }}
                                disabled={product.countInStock === 0}
                                className={`flex-1 flex items-center justify-center gap-4 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl ${product.countInStock > 0 ? 'bg-blue-600 text-white hover:bg-slate-950 shadow-blue-600/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                            >
                                <FaShoppingCart /> Add to Bag
                            </button>
                            <button
                                onClick={addToWishlistHandler}
                                disabled={wishlistLoading}
                                className="w-20 flex items-center justify-center rounded-[2rem] border border-slate-100 bg-white text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-xl shadow-slate-200/50"
                            >
                                {wishlistLoading ? (
                                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <FaHeart className="text-xl" />
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600">
                                    <FaTruck />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Express Delivery</p>
                                    <p className="text-xs text-slate-400 font-bold">2-4 Business Days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600">
                                    <FaShieldAlt />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Authentic Gear</p>
                                    <p className="text-xs text-slate-400 font-bold">100% Genuine Pro Equipment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="border-t border-slate-100 pt-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Write Review */}
                        <div className="lg:col-span-1">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Post your <span className="text-blue-600">Review</span></h3>
                            <form onSubmit={submitReviewHandler} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Rating</label>
                                    <select
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 ring-blue-600/20 transition-all"
                                    >
                                        <option value="5">5 - Elite Performance</option>
                                        <option value="4">4 - Very Good</option>
                                        <option value="3">3 - Standard</option>
                                        <option value="2">2 - Below Average</option>
                                        <option value="1">1 - Poor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Comment</label>
                                    <textarea
                                        rows="4"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 ring-blue-600/20 transition-all"
                                        placeholder="Share your experience with this gear..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Upload Photos</label>
                                    <div className="flex flex-wrap gap-3">
                                        <label className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all group">
                                            <FaCamera className="text-slate-400 group-hover:text-blue-600" />
                                            <input type="file" className="hidden" onChange={uploadFileHandler} />
                                        </label>
                                        {reviewImages.map((img, idx) => (
                                            <div key={idx} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-100">
                                                                <img src={`${API_URL}${img.replace(/\\/g, '/')}`} className="w-full h-full object-cover" alt="" />
                                                <button
                                                    type="button"
                                                    onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 bg-slate-950/50 text-white p-1 rounded-full text-[8px]"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {uploading && <p className="text-[8px] font-bold text-blue-600 uppercase mt-2 animate-pulse">Uploading Capture...</p>}
                                </div>

                                <button type="submit" className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl">
                                    Submit Review
                                </button>
                            </form>
                        </div>

                        {/* Recent Reviews */}
                        <div className="lg:col-span-2">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                                <h3 className="text-4xl font-black uppercase italic tracking-tighter">User <span className="text-blue-600">Feedback</span></h3>
                                <div className="flex items-center gap-6 bg-slate-50 px-8 py-4 rounded-[2rem]">
                                    <div className="text-center border-r border-slate-200 pr-6">
                                        <p className="text-3xl font-black text-slate-900 leading-none">{(product.rating || 0).toFixed(1)}</p>
                                        <p className="text-[8px] font-black uppercase text-slate-400 mt-1">Average</p>
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-[120px]">
                                        {[5, 4, 3, 2, 1].map(num => {
                                            const count = product.reviews.filter(r => r.rating === num).length;
                                            const percentage = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0;
                                            return (
                                                <div key={num} className="flex items-center gap-2">
                                                    <span className="text-[8px] font-black text-slate-400 w-2">{num}</span>
                                                    <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {product.reviews.length === 0 ? (
                                <div className="bg-slate-50 rounded-[3rem] p-16 text-center border-2 border-dashed border-slate-100">
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-loose">
                                        No elite feedback yet.<br />Be the first to share your performance results.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    {product.reviews.map((review) => (
                                        <div key={review._id} className="group pb-12 border-b border-slate-100 last:border-0 relative">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center text-white font-black uppercase text-lg ring-4 ring-white shadow-xl">
                                                            {review.name.charAt(0)}
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center shadow-lg" title="Verified Athlete">
                                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-black uppercase text-xs tracking-tight">{review.name}</p>
                                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Verified Purchaser</span>
                                                        </div>
                                                        <div className="flex text-amber-400 text-[10px] mt-1.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar key={i} className={i < review.rating ? 'fill-current' : 'text-slate-200'} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>

                                            <div className="pl-18">
                                                <p className="text-slate-600 font-medium leading-[1.8] mb-8 text-lg">"{review.comment}"</p>

                                                {review.images && review.images.length > 0 && (
                                                    <div className="flex flex-wrap gap-4 mb-8">
                                                        {review.images.map((img, i) => (
                                                            <div key={i} className="relative w-28 h-28 rounded-3xl overflow-hidden border border-slate-100 cursor-pointer shadow-md hover:shadow-xl transition-all hover:scale-105 duration-300">
                                                                <img src={`${API_URL}${img.replace(/\\/g, '/')}`} className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-6">
                                                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                                                        Helpful? Yes
                                                    </button>
                                                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                                                        Report
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
