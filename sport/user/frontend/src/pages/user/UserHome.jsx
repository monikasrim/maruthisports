import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_URL from '../../api';
import AuthContext from '../../context/AuthContext';
import {
    FaSearch,
    FaShoppingCart,
    FaUser,
    FaSignOutAlt,
    FaFilter,
    FaPlus
} from 'react-icons/fa';

const UserHome = () => {
    const { user, logout } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const getImageUrl = (image) => {
        if (!image) return 'https://placehold.co/600x600?text=No+Image';
        if (image.startsWith('http')) return image;
        return `${API_URL}${image}`;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch from user backend port 5000
                const { data } = await axios.get(`${API_URL}/api/products`);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => p.category))];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                MARUTHI <span className="font-light">SPORTS</span>
                            </h1>
                        </Link>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full group">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search gear, brands, sports..."
                                    className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-6">
                            <div className="hidden sm:flex items-center space-x-2 text-slate-600">
                                <FaUser className="text-sm" />
                                <span className="text-sm font-medium">{user?.name}</span>
                            </div>

                            <button className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
                                <FaShoppingCart className="text-xl" />
                                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">0</span>
                            </button>

                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                            >
                                <FaSignOutAlt />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Hero / Filter Section */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                                Premium Sports Gear
                            </h2>
                            <p className="text-slate-500 text-lg">
                                High-performance equipment for every athlete.
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
                                <FaFilter />
                                <span>Categories:</span>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                            : 'bg-white text-slate-600 hover:bg-slate-200 shadow-sm'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-lg">No products found matching your search.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            className="mt-4 text-blue-600 font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
                                {/* Image Wrapper */}
                                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            if (!product.image?.startsWith('http')) {
                                                e.target.src = 'https://placehold.co/400x500?text=' + encodeURIComponent(product.name);
                                            } else {
                                                e.target.src = 'https://placehold.co/400x500?text=' + encodeURIComponent(product.name);
                                            }
                                        }}
                                    />
                                    {/* Action Overlays */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button className="bg-white text-slate-900 p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                                            <FaPlus />
                                        </button>
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                                        {product.brand}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <span className="text-xl font-black text-slate-900 ml-2">
                                            ${product.price}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`text-xs ${i < Math.floor(product.rating || 0) ? 'text-amber-400' : 'text-slate-200'}`}>
                                                    ★
                                                </span>
                                            ))}
                                            <span className="text-[10px] text-slate-400 ml-1 font-bold">
                                                ({product.numReviews || 0})
                                            </span>
                                        </div>
                                        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                        © 2026 Maruthi Sports. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default UserHome;
