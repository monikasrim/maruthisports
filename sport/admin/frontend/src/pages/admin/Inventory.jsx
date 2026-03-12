import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaBox, FaArrowUp, FaArrowDown, FaExclamationTriangle } from 'react-icons/fa';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

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

    const updateStock = async (id, currentStock, change) => {
        const newStock = Math.max(0, currentStock + change);
        setUpdatingId(id);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.put(`http://localhost:5001/api/products/${id}/stock`, { countInStock: newStock }, config);
            fetchProducts();
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Failed to update stock');
        } finally {
            setUpdatingId(null);
        }
    };


    const lowStockItems = products.filter(p => p.countInStock < 10);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden">
            {lowStockItems.length > 0 && (
                <div className="bg-red-50 border-b border-red-100 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                            <FaExclamationTriangle className="text-xl" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-red-900 uppercase tracking-tight">Stock Alert: {lowStockItems.length} Items Low</p>
                            <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Immediate procurement required for elite inventory levels.</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800">Inventory Tracking</h2>
                <p className="text-sm text-gray-500">Monitor and manage real-time stock levels across your catalog.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Current Stock</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Quick Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="w-8 h-8 border-3 border-red-100 border-t-red-600 rounded-full"></div>
                                        <p className="text-sm text-gray-500 font-medium text-sm">Updating inventory data...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center text-gray-500 italic">
                                    No products found in inventory.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                                <img
                                                    src={`http://localhost:5001${product.image}`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=PS' }}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                                                <p className="text-xs text-gray-400">{product.brand}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-mono font-bold text-lg ${product.countInStock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                                            {product.countInStock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.countInStock === 0 ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <FaExclamationTriangle className="mr-1" /> Out of Stock
                                            </span>
                                        ) : product.countInStock < 10 ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Healthy
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                disabled={updatingId === product._id}
                                                onClick={() => updateStock(product._id, product.countInStock, -1)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 disabled:opacity-50"
                                                title="Decrease Stock"
                                            >
                                                <FaArrowDown />
                                            </button>
                                            <button
                                                disabled={updatingId === product._id}
                                                onClick={() => updateStock(product._id, product.countInStock, 1)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100 disabled:opacity-50"
                                                title="Increase Stock"
                                            >
                                                <FaArrowUp />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
