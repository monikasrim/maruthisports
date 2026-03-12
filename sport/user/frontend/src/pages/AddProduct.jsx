import { useState, useContext } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaPlusCircle, FaTrophy, FaTag, FaBoxOpen, FaImage } from 'react-icons/fa';

const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        category: 'Cricket',
        brand: 'Maruthi',
        countInStock: ''
    });

    const categories = [
        'Cricket', 'Football', 'Badminton', 'Volleyball',
        'Basketball', 'Fitness', 'Indoor Games', 'Running',
        'Clothing', 'Accessories'
    ];

    const handleChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/products`, productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Product added successfully!');
            navigate('/shop');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="bg-blue-600 p-12 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-md mb-4 text-white text-4xl shadow-xl">
                            <FaPlusCircle />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">ADD NEW <span className="text-slate-900">GEAR.</span></h2>
                        <p className="text-blue-100 font-medium font-serif italic">Expand the Maruthi Sports catalog with premium equipment.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-12 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <FaTrophy className="text-blue-600" /> <span>Product Name</span>
                                </label>
                                <input
                                    name="name"
                                    value={productData.name}
                                    onChange={handleChange}
                                    required
                                    type="text"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
                                    placeholder="e.g., Aero-Strike Gloves"
                                />
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <FaTag className="text-blue-600" /> <span>Price (₹)</span>
                                </label>
                                <input
                                    name="price"
                                    value={productData.price}
                                    onChange={handleChange}
                                    required
                                    type="number"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
                                    placeholder="999"
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <FaBoxOpen className="text-blue-600" /> <span>Category</span>
                                </label>
                                <select
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold appearance-none"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Brand */}
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <FaTrophy className="text-blue-600" /> <span>Brand</span>
                                </label>
                                <input
                                    name="brand"
                                    value={productData.brand}
                                    onChange={handleChange}
                                    required
                                    type="text"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
                                    placeholder="Maruthi"
                                />
                            </div>

                            {/* Image URL */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <FaImage className="text-blue-600" /> <span>Image URL</span>
                                </label>
                                <input
                                    name="image"
                                    value={productData.image}
                                    onChange={handleChange}
                                    required
                                    type="text"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold font-mono text-xs"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>

                            {/* Stock */}
                            <div className="md:col-span-1 space-y-2">
                                <label className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <FaBoxOpen className="text-blue-600" /> <span>Quantity in Stock</span>
                                </label>
                                <input
                                    name="countInStock"
                                    value={productData.countInStock}
                                    onChange={handleChange}
                                    required
                                    type="number"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
                                    placeholder="50"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <FaHistory className="text-blue-600" /> <span>Detailed Description</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={productData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-blue-500 transition-all font-bold"
                                    placeholder="Describe the product's premium features..."
                                ></textarea>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-6 rounded-3xl text-xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 hover:bg-slate-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center space-x-4"
                        >
                            <span>{loading ? 'Adding to Catalog...' : 'Initialize Product'}</span>
                            {!loading && <FaPlusCircle className="group-hover:rotate-90 transition-transform" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
