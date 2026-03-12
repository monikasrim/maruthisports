import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaBoxOpen } from 'react-icons/fa';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        brand: '',
        category: '',
        countInStock: '',
        description: '',
    });

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('http://localhost:5001/api/upload', formDataUpload, config);

            setFormData({ ...formData, image: data });
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Image upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotification(null);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post('http://localhost:5001/api/products', formData, config);

            setNotification({ type: 'success', message: 'Product created successfully!' });

            // Short delay to show success message before closing modal
            setTimeout(() => {
                setIsModalOpen(false);
                setFormData({
                    name: '',
                    price: '',
                    image: '',
                    brand: '',
                    category: '',
                    countInStock: '',
                    description: '',
                });
                setNotification(null);
                fetchProducts(); // Refresh list in background
            }, 1500);
        } catch (error) {
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Error creating product'
            });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                await axios.delete(`http://localhost:5001/api/products/${id}`, config);
                fetchProducts();
            } catch (error) {
                alert('Error deleting product');
                console.error(error);
            }
        }
    };


    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Product Management</h2>
                    <p className="text-sm text-gray-500">Manage your catalog ({products.length} items)</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-red-500/20"
                >
                    <FaPlus />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Product List */}
            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full"></div>
                        <p className="text-gray-500 font-medium text-sm">Loading products catalog...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <FaBoxOpen className="mx-auto text-4xl text-gray-300 mb-4" />
                        <p className="text-gray-500">No products found. Start by adding one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    {/* Image Placeholder or Actual Image */}
                                    <img
                                        src={`http://localhost:5001${product.image ? product.image.replace(/\\/g, '/') : ''}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image' }}
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-700">
                                        ₹{product.price.toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">{product.category}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-1 truncate" title={product.name}>{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 truncate">{product.brand}</p>

                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <button className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center">
                                            <FaEdit className="mr-1" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                                        >
                                            <FaTrash className="mr-1" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Add New Product</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>

                        {notification && (
                            <div className={`px-6 py-3 text-sm font-medium ${notification.type === 'success' ? 'bg-green-50 text-green-700 border-b border-green-100' : 'bg-red-50 text-red-700 border-b border-red-100'}`}>
                                {notification.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input
                                        type="text" name="name" required
                                        value={formData.name} onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                        placeholder="e.g. Nike Air Max"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                    <input
                                        type="text" name="brand" required
                                        value={formData.brand} onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                        placeholder="e.g. Nike"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input
                                        type="text" name="category" required
                                        value={formData.category} onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                        placeholder="e.g. Shoes"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input
                                        type="number" name="price" required
                                        value={formData.price} onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                                    <input
                                        type="number" name="countInStock" required
                                        value={formData.countInStock} onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                                    <div className="flex flex-col space-y-2">
                                        <input
                                            type="file"
                                            onChange={uploadFileHandler}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                        />
                                        {uploading && <p className="text-xs text-blue-500 font-medium">Uploading image...</p>}
                                        {formData.image && (
                                            <p className="text-[10px] text-green-600 truncate">Selected: {formData.image}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description" required rows="3"
                                    value={formData.description} onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    placeholder="Product details..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || uploading}
                                    className={`px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30 flex items-center space-x-2 ${(isSubmitting || uploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    <span>{isSubmitting ? 'Creating...' : uploading ? 'Wait...' : 'Create Product'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
