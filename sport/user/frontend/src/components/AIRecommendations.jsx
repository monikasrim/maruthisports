import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { Link } from 'react-router-dom';
import { FaBolt, FaStar, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const AIRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const getImageUrl = (image) => {
        if (!image) return 'https://placehold.co/600x600?text=No+Image';
        if (image.startsWith('http')) return image;
        return `${API_URL}${image}`;
    };

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products`);
                const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                const viewedCategories = viewed.map(p => p.category);

                const suggestions = data
                    .filter(p => !viewed.some(v => v._id === p._id))
                    .sort((a, b) => {
                        const aCatMatch = viewedCategories.includes(a.category) ? 2 : 0;
                        const bCatMatch = viewedCategories.includes(b.category) ? 2 : 0;
                        const aScore = aCatMatch + (a.rating * 0.5) + (a.numReviews * 0.1);
                        const bScore = bCatMatch + (b.rating * 0.5) + (b.numReviews * 0.1);
                        return bScore - aScore;
                    })
                    .slice(0, 4);

                setRecommendations(suggestions);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading || recommendations.length === 0) return null;

    return (
        <section className="py-24 bg-[#fcfcfd] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/[0.03] blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="space-y-3 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-600 font-black uppercase text-[10px] tracking-[0.4em] px-4 py-1.5 rounded-full border border-blue-200/50">
                            <FaBolt /> AI-CORE ENGINE
                        </div>
                        <h3 className="text-5xl font-black tracking-tightest uppercase italic text-slate-950 leading-none">
                            PRECISION <span className="text-blue-600">ANALYTICS.</span>
                        </h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2">Personalized performance gear based on your training affinity.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {recommendations.map((product, i) => (
                        <div key={product._id} className="group bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm transition-all duration-700 flex flex-col h-full">
                            <div className="relative aspect-square rounded-[2.5rem] bg-slate-50 mb-8 flex items-center justify-center p-8 overflow-hidden group-hover:bg-white transition-colors">
                                <Link to={`/product/${product._id}`} className="w-full h-full flex items-center justify-center">
                                    <img
                                        src={getImageUrl(product.image)}
                                        className="max-w-full max-h-full object-contain transition-transform duration-700"
                                        alt={product.name}
                                    />
                                </Link>
                                <div className="absolute top-4 right-4 bg-blue-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">AI PICK</div>
                            </div>

                            <div className="space-y-5 mt-auto">
                                <div>
                                    <h4 className="font-black uppercase italic tracking-tighter text-lg truncate text-slate-950">{product.name}</h4>
                                    <div className="flex items-center gap-1 text-amber-500 text-[10px] mt-2 font-black">
                                        <FaStar /> <span>{product.rating.toFixed(1)}</span>
                                        <span className="text-slate-300 font-bold ml-1 uppercase">Recommended</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                                    <p className="text-2xl font-black text-blue-600 tracking-tighter">₹{product.price.toLocaleString()}</p>
                                    <button
                                        onClick={() => { addToCart(product); toast.success(`${product.name} ready for action!`); }}
                                        className="p-4 bg-slate-950 text-white rounded-2xl transition-all shadow-xl active:scale-95"
                                    >
                                        <FaShoppingCart className="text-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AIRecommendations;
