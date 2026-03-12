import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import {
    FaSearch,
    FaFilter,
    FaShoppingCart,
    FaStar,
    FaPlus,
    FaTrophy,
    FaArrowLeft,
    FaHeart,
    FaBalanceScale
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import ComparisonModal from '../components/ComparisonModal';

import EmptyState from '../components/EmptyState';

const Shop = () => {
    const { addToCart } = useCart();

    const trackRecentlyViewed = (product) => {
        let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        viewed = [product, ...viewed.filter(p => p._id !== product._id)].slice(0, 4);
        localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
    };

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'All';

    const getImageUrl = (image) => {
        if (!image) return 'https://placehold.co/600x600?text=No+Image';
        if (image.startsWith('http')) return image;
        return `http://localhost:5000${image.startsWith('/') ? image : '/' + image}`;
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState('newest');

    // New Multi-Filter States
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [compareList, setCompareList] = useState([]);
    const [showCompare, setShowCompare] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentlyViewed(viewed);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
                // Dynamically set max price if needed
                if (data.length > 0) {
                    const max = Math.max(...data.map(p => p.price));
                    setPriceRange([0, max]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = ['All', ...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];
    const allSizes = [...new Set(products.flatMap(p => p.sizes || []))];
    const allColors = [...new Set(products.flatMap(p => p.colors || []))];

    const toggleFilter = (item, state, setter) => {
        if (state.includes(item)) {
            setter(state.filter(i => i !== item));
        } else {
            setter([...state, item]);
        }
    };

    const filteredProducts = products
        .filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
            const matchesSize = selectedSizes.length === 0 || (p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
            const matchesColor = selectedColors.length === 0 || (p.colors && p.colors.some(c => selectedColors.includes(c)));

            return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesSize && matchesColor;
        })
        .sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'rating') return b.rating - a.rating;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    return (
        <div className="min-h-screen bg-white font-sans text-slate-950 pt-24 pb-20">
            {/* Header / Search Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <Link to="/" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-blue-600 hover:gap-2 transition-all">
                            <FaArrowLeft className="mr-2" /> Back to Home
                        </Link>
                        <h2 className="text-5xl font-black tracking-tighter uppercase italic italic">
                            ELITE <span className="text-blue-600">COLLECTION</span>
                        </h2>
                        <p className="text-slate-500 font-medium font-serif">Curated high-performance gear for elite athletes.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:max-w-2xl lg:justify-end">
                        <div className="relative flex-1 group">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search gear, brands, or tech..."
                                className="w-full bg-slate-100 border-none rounded-3xl py-5 pl-14 pr-6 outline-none focus:ring-2 ring-blue-500/20 font-bold transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-slate-100 border-none rounded-3xl px-8 py-5 font-black uppercase text-xs tracking-widest outline-none focus:ring-2 ring-blue-500/20 appearance-none cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content: Filter + Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filter Sidebar (Desktop) */}
                    <aside className="hidden lg:block w-72 space-y-10">
                        {/* Categories */}
                        <div className="space-y-6">
                            <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                                <FaFilter /> Categories
                            </h4>
                            <div className="flex flex-col space-y-1">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-left py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-tight transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-6">
                            <h4 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                                Price Range
                            </h4>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="50000"
                                    step="500"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between mt-4 text-[10px] font-black text-slate-500 uppercase">
                                    <span>₹0</span>
                                    <span>Up to ₹{priceRange[1].toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Brands */}
                        {brands.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Brands</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {brands.map(brand => (
                                        <button
                                            key={brand}
                                            onClick={() => toggleFilter(brand, selectedBrands, setSelectedBrands)}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${selectedBrands.includes(brand) ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}
                                        >
                                            {brand}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {allSizes.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Pro Sizes</h4>
                                <div className="flex flex-wrap gap-2">
                                    {allSizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-[10px] font-black border transition-all ${selectedSizes.includes(size) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Colors */}
                        {allColors.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Colors</h4>
                                <div className="flex flex-wrap gap-3">
                                    {allColors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => toggleFilter(color, selectedColors, setSelectedColors)}
                                            title={color}
                                            className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${selectedColors.includes(color) ? 'border-blue-600 scale-110' : 'border-transparent'}`}
                                        >
                                            <div
                                                className="w-full h-full rounded-full shadow-inner"
                                                style={{
                                                    backgroundColor: color.toLowerCase(),
                                                    border: color.toLowerCase() === 'white' ? '1px solid #e2e8f0' : 'none'
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setPriceRange([0, 50000]);
                                setSelectedBrands([]);
                                setSelectedSizes([]);
                                setSelectedColors([]);
                                setSelectedCategory('All');
                            }}
                            className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        >
                            Reset All Filters
                        </button>

                        <div className="p-8 bg-slate-950 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
                            <FaTrophy className="text-4xl text-blue-500 relative z-10" />
                            <div className="space-y-2 relative z-10">
                                <h5 className="font-black italic uppercase tracking-tighter text-xl">PRO DISCOUNTS</h5>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Join the club for 20% off your first order.</p>
                            </div>
                            <Link to="/register" className="block text-center bg-blue-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all relative z-10">Join Club</Link>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full"></div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="font-black uppercase text-[10px] tracking-widest text-slate-400">Fetching Gear...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <EmptyState
                                type="products"
                                title="No Gear Found"
                                message="We couldn't find any equipment matching your current filters. Try expanding your search or resetting filters."
                                actionText="Clear All Filters"
                                actionLink="#"
                                actionCallback={() => {
                                    setPriceRange([0, 50000]);
                                    setSelectedBrands([]);
                                    setSelectedSizes([]);
                                    setSelectedColors([]);
                                    setSelectedCategory('All');
                                    setSearchTerm('');
                                }}
                            />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredProducts.map(product => (
                                    <div key={product._id} className="group flex flex-col bg-white border border-slate-100 rounded-[3rem] p-6 hover:shadow-2xl transition-all duration-500">
                                        <div className="relative aspect-square rounded-[2rem] bg-slate-50 mb-8 flex items-center justify-center p-8 overflow-hidden">
                                            <Link to={`/product/${product._id}`} onClick={() => trackRecentlyViewed(product)}>
                                                <img
                                                    src={getImageUrl(product.image)}
                                                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                                    alt={product.name}
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/600x600?text=' + encodeURIComponent(product.name);
                                                    }}
                                                />
                                            </Link>
                                            <button
                                                onClick={() => { addToCart(product); trackRecentlyViewed(product); toast.success(`${product.name} added to bag!`, { style: { borderRadius: '20px', background: '#0f172a', color: '#fff', fontSize: '12px', fontWeight: 'bold' } }); }}
                                                className="absolute bottom-4 right-4 bg-white text-blue-600 p-4 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all hover:bg-blue-600 hover:text-white"
                                            >
                                                <FaPlus />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const token = localStorage.getItem('token');
                                                        if (!token) {
                                                            toast.error('Please login to use Wishlist');
                                                            return;
                                                        }
                                                        const config = { headers: { Authorization: `Bearer ${token}` } };
                                                        await axios.post(`http://localhost:5000/api/wishlist/${product._id}`, {}, config);
                                                        toast.success('Added to Wishlist');
                                                    } catch (err) {
                                                        toast.error(err.response?.data?.message || 'Error adding to wishlist');
                                                    }
                                                }}
                                                className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-slate-400 p-3 rounded-2xl opacity-0 group-hover:opacity-100 -translate-y-4 group-hover:translate-y-0 transition-all hover:text-red-500"
                                            >
                                                <FaHeart />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (compareList.length >= 3 && !compareList.find(p => p._id === product._id)) {
                                                        toast.error('Max 3 items for comparison');
                                                        return;
                                                    }
                                                    if (compareList.find(p => p._id === product._id)) {
                                                        setCompareList(compareList.filter(p => p._id !== product._id));
                                                        toast.success('Removed from compare');
                                                    } else {
                                                        setCompareList([...compareList, product]);
                                                        setShowCompare(true);
                                                        toast.success('Added to compare');
                                                    }
                                                }}
                                                className={`absolute top-4 left-4 p-3 rounded-2xl opacity-0 group-hover:opacity-100 -translate-y-4 group-hover:translate-y-0 transition-all ${compareList.find(p => p._id === product._id) ? 'bg-blue-600 text-white' : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-blue-600'}`}
                                            >
                                                <FaBalanceScale />
                                            </button>
                                        </div>

                                        <div className="flex-1 flex flex-col">
                                            <div className="space-y-1 mb-6">
                                                <Link to={`/product/${product._id}`}>
                                                    <h3 className="text-xl font-black uppercase italic tracking-tighter hover:text-blue-600 transition-colors">{product.name}</h3>
                                                </Link>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{product.brand}</p>
                                            </div>

                                            <div className="flex items-center gap-1 text-amber-500 text-[10px] mb-4">
                                                <FaStar /> <span className="font-black">{(product.rating || 0).toFixed(1)}</span>
                                                <span className="text-slate-400 italic font-medium ml-1">({product.numReviews || 0} Reviews)</span>
                                            </div>

                                            <div className="mb-6">
                                                {product.countInStock > 0 ? (
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">In Stock</span>
                                                ) : (
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">Out of Stock</span>
                                                )}
                                            </div>

                                            <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                                                <p className="text-2xl font-black text-blue-600">₹{product.price.toLocaleString()}</p>
                                                <button
                                                    onClick={() => { addToCart(product); trackRecentlyViewed(product); toast.success(`${product.name} added to bag!`, { style: { borderRadius: '20px', background: '#0f172a', color: '#fff', fontSize: '12px', fontWeight: 'bold' } }); }}
                                                    className="bg-slate-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-950/20"
                                                >
                                                    Add to Bag
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recently Viewed Section */}
                {recentlyViewed.length > 0 && (
                    <div className="mt-32 space-y-12">
                        <div className="flex items-center justify-between">
                            <h4 className="text-3xl font-black uppercase italic tracking-tighter">
                                RECENTLY <span className="text-blue-600">VIEWED</span>
                            </h4>
                            <button
                                onClick={() => { localStorage.removeItem('recentlyViewed'); setRecentlyViewed([]); }}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                            >
                                Clear History
                            </button>
                        </div>
                        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
                            {recentlyViewed.map(product => (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    className="min-w-[200px] group snap-start"
                                >
                                    <div className="aspect-square bg-slate-50 rounded-[2rem] p-6 mb-4 flex items-center justify-center border border-slate-100 group-hover:shadow-xl transition-all">
                                        <img
                                            src={getImageUrl(product.image)}
                                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-all duration-500"
                                            alt={product.name}
                                        />
                                    </div>
                                    <h6 className="font-black uppercase italic text-xs tracking-tight truncate">{product.name}</h6>
                                    <p className="text-blue-600 font-black mt-1 text-sm">₹{product.price.toLocaleString()}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showCompare && (
                <ComparisonModal
                    products={compareList}
                    onRemove={(id) => setCompareList(compareList.filter(p => p._id !== id))}
                    onClose={() => setShowCompare(false)}
                />
            )}
        </div>
    );
};

export default Shop;
