import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { FaTrash, FaEdit, FaUserCircle, FaHistory } from 'react-icons/fa';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                // Port 5001 as confirmed earlier
                const { data } = await axios.get('http://localhost:5001/api/users', config);
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    Total: {users.length}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Orders</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="w-8 h-8 border-3 border-red-100 border-t-red-600 rounded-full"></div>
                                        <p className="text-sm text-gray-500 font-medium text-sm">Fetching users...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center text-gray-500 italic">
                                    No users found in the system.
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                                <FaUserCircle />
                                            </div>
                                            <span className="font-medium text-gray-800">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${u.role === 'admin'
                                            ? 'bg-purple-100 text-purple-600'
                                            : 'bg-green-100 text-green-600'
                                            }`}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => window.location.href = `/orders?user=${u._id}`}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            <FaHistory /> Deployment Log
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center space-x-2">
                                            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                                disabled={u._id === currentUser._id}
                                            >
                                                <FaTrash />
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

export default Users;
